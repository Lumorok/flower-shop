import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OWNER_ID = process.env.TELEGRAM_OWNER_ID || '1602352560';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://flower-shop-henna.vercel.app/'; // замените на реальный домен

// Экранирование специальных символов MarkdownV2
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

// Названия цветов бумаги (исправлены опечатки)
function getPaperLabel(value: string): string {
  const papers: Record<string, string> = {
    kraft: 'Крафт',
    white: 'Нежно-фиолетовый',
    black: 'Розовый',
    beige: 'Тёмно-фиолетовый',
  };
  return papers[value] || value;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Проверка токена
    if (!BOT_TOKEN) {
      console.error('TELEGRAM_BOT_TOKEN not configured');
      return NextResponse.json(
        { error: 'Telegram bot token is not configured' },
        { status: 500 }
      );
    }

    // 2. Получение и валидация данных
    const orderData = await request.json();

    if (!orderData.customerName || !orderData.phone || !orderData.pickupPointId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // 3. Поиск товара с изображением (крафт-бумага)
    const kraftItem = orderData.items.find(
      (item: any) => item.product.id === 'pack-1' && item.options?.imageUrl
    );

    // 4. Если есть крафт-бумага – отправляем фото (не блокируем основной заказ)
    if (kraftItem) {
      try {
        const imagePath = kraftItem.options.imageUrl;
        // Корректное формирование абсолютного URL
        const photoUrl = new URL(imagePath, APP_URL).toString();
        const colorLabel = getPaperLabel(kraftItem.options.paperColor);
        const caption = `🟡 Выбран цвет крафт-бумаги: *${escapeMarkdown(colorLabel)}*`;

        const photoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: OWNER_ID,
            photo: photoUrl,
            caption: caption,
            parse_mode: 'MarkdownV2',
          }),
        });

        if (!photoResponse.ok) {
          const err = await photoResponse.json();
          console.error('Failed to send photo to Telegram:', err);
        }
      } catch (photoError) {
        console.error('Exception while sending photo:', photoError);
      }
    }

    // 5. Формирование текста заказа
    const pickupPoints = [
      { id: 'point-1', name: 'Проспект 100-летия Владивостока', address: 'г. Владивосток, пр-т 100-летия Владивостока, 12в' },
      { id: 'point-2', name: 'Толстого', address: 'г. Владивосток, ул. Толстого, 38, ст. 1' },
      { id: 'point-3', name: 'Скоро открытие', address: 'Новый пункт выдачи (уточняется)' }
    ];
    const selectedPoint = pickupPoints.find(p => p.id === orderData.pickupPointId);

    const itemsList = orderData.items
      .map((item: any) => {
        let optionsText = '';
        if (item.options?.paperColor && item.product.id === 'pack-1') {
          optionsText = ` (цвет: ${getPaperLabel(item.options.paperColor)})`;
        }
        const priceText = item.product.price === 0
          ? 'Бесплатно'
          : `${item.product.price * item.quantity} ₽`;
        // Экранируем все динамические части, кроме управляющих символов Markdown
        return `• ${escapeMarkdown(item.product.name)}${escapeMarkdown(optionsText)} \\- ${item.quantity} шт. \\- ${priceText}`;
      })
      .join('\n');

    const message = `
🎉 *НОВЫЙ ЗАКАЗ!*

👤 *Клиент:* ${escapeMarkdown(orderData.customerName)}
📞 *Телефон:* ${escapeMarkdown(orderData.phone)}
${orderData.telegram ? `✈️ *Telegram:* ${escapeMarkdown(orderData.telegram)}` : ''}

📍 *Пункт выдачи:* ${escapeMarkdown(selectedPoint?.name || 'Не указан')}
🏠 *Адрес:* ${escapeMarkdown(selectedPoint?.address || 'Не указан')}

🛒 *Заказ:*
${itemsList}

💰 *Итого:* ${orderData.total} ₽

${orderData.notes ? `📝 *Комментарий:* ${escapeMarkdown(orderData.notes)}` : ''}

⏰ *Время заказа:* ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Vladivostok' })}
`;

    // 6. Отправка основного сообщения
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: OWNER_ID,
        text: message,
        parse_mode: 'MarkdownV2',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error (sendMessage):', errorData);
      return NextResponse.json(
        { error: 'Failed to send message to Telegram' },
        { status: 500 }
      );
    }

    // 7. Успешный ответ
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error processing order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
