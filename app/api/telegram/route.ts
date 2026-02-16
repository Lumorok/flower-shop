import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OWNER_ID = process.env.TELEGRAM_OWNER_ID || '5141102236';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

// Функция для получения названия цвета
function getPaperLabel(value: string): string {
  const papers: Record<string, string> = {
    kraft: 'Натуральный',
    white: 'Белый',
    black: 'Чёрный',
    beige: 'Бежевый',
  };
  return papers[value] || value;
}

export async function POST(request: NextRequest) {
  try {
    if (!BOT_TOKEN) {
      return NextResponse.json(
        { error: 'Telegram bot token is not configured' },
        { status: 500 }
      );
    }

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

    // Поиск товара крафт-бумаги с фото
    const kraftItem = orderData.items.find(
      (item: any) => item.product.id === 'pack-1' && item.options?.imageUrl
    );

    // Если есть крафт с фото – отправляем его первым
    if (kraftItem) {
      const photoUrl = `${APP_URL}${kraftItem.options.imageUrl}`;
      const colorLabel = getPaperLabel(kraftItem.options.paperColor);
      const caption = `🟡 Выбран цвет крафт-бумаги: *${colorLabel}*`;

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: OWNER_ID,
          photo: photoUrl,
          caption: caption,
          parse_mode: 'MarkdownV2',
        }),
      });
    }

    // Формируем текстовое сообщение с заказом
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
        return `• ${escapeMarkdown(item.product.name)}${optionsText} \\- ${item.quantity} шт. \\- ${priceText}`;
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
      const error = await response.json();
      console.error('Telegram API error:', error);
      return NextResponse.json(
        { error: 'Failed to send message to Telegram' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}