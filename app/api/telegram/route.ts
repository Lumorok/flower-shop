import { NextRequest, NextResponse } from 'next/server';

// ==================== КОНСТАНТЫ ====================

// Список пунктов самовывоза (можно вынести в отдельный файл, если нужно)
const PICKUP_POINTS = [
  {
    id: 'point-1',
    name: 'Проспект 100-летия Владивостока',
    address: 'г. Владивосток, пр-т 100-летия Владивостока, 12в',
  },
  {
    id: 'point-2',
    name: 'Толстого',
    address: 'г. Владивосток, ул. Толстого, 38, ст. 1',
  },
  {
    id: 'point-3',
    name: 'Скоро открытие',
    address: 'Новый пункт выдачи (уточняется)',
  },
];

// Названия цветов крафт-бумаги
const PAPER_COLORS: Record<string, string> = {
  kraft: 'Крафт',
  white: 'Нежно-фиолетовый',
  black: 'Розовый',
  beige: 'Тёмно-фиолетовый',
};

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

/**
 * Экранирует специальные символы для MarkdownV2 в Telegram.
 * @param text - исходный текст
 * @returns экранированный текст
 */
function escapeMarkdown(text: string): string {
  if (!text) return '';
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

/**
 * Возвращает локализованное название цвета бумаги.
 * @param value - ключ цвета (например, 'kraft')
 * @returns название на русском
 */
function getPaperLabel(value: string): string {
  return PAPER_COLORS[value] || value;
}

// ==================== ОСНОВНОЙ ОБРАБОТЧИК ====================

export async function POST(request: NextRequest) {
  // ---- Логирование начала запроса ----
  console.log('📨 [API] /api/telegram вызван');

  try {
    // ---- 1. Проверка переменных окружения ----
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const OWNER_ID = process.env.TELEGRAM_OWNER_ID;

    console.log('🔑 TELEGRAM_BOT_TOKEN:', BOT_TOKEN ? '✅ установлен' : '❌ ОТСУТСТВУЕТ');
    console.log('🆔 TELEGRAM_OWNER_ID:', OWNER_ID ? `✅ ${OWNER_ID}` : '❌ ОТСУТСТВУЕТ');

    if (!BOT_TOKEN) {
      console.error('❌ Ошибка: TELEGRAM_BOT_TOKEN не задан');
      return NextResponse.json(
        { error: 'Telegram bot token is not configured' },
        { status: 500 }
      );
    }

    if (!OWNER_ID) {
      console.error('❌ Ошибка: TELEGRAM_OWNER_ID не задан');
      return NextResponse.json(
        { error: 'Telegram owner ID is not configured' },
        { status: 500 }
      );
    }

    // ---- 2. Получение данных заказа ----
    const orderData = await request.json();
    console.log('📦 Данные заказа:', JSON.stringify(orderData, null, 2));

    // ---- 3. Валидация обязательных полей ----
    if (!orderData.customerName || !orderData.phone || !orderData.pickupPointId) {
      console.error('❌ Ошибка: отсутствуют обязательные поля');
      return NextResponse.json(
        { error: 'Missing required fields: customerName, phone, pickupPointId' },
        { status: 400 }
      );
    }

    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      console.error('❌ Ошибка: корзина пуста');
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // ---- 4. Поиск выбранного пункта выдачи ----
    const selectedPoint = PICKUP_POINTS.find((p) => p.id === orderData.pickupPointId);
    if (!selectedPoint) {
      console.error(`❌ Ошибка: пункт выдачи с id "${orderData.pickupPointId}" не найден`);
      return NextResponse.json(
        { error: 'Invalid pickup point' },
        { status: 400 }
      );
    }

    // ---- 5. Формирование списка товаров с экранированием ----
    const itemsList = orderData.items
      .map((item: any) => {
        let optionsText = '';
        if (item.options?.paperColor && item.product.id === 'pack-1') {
          optionsText = ` (цвет: ${getPaperLabel(item.options.paperColor)})`;
        }

        const priceText =
          item.product.price === 0
            ? 'Бесплатно'
            : `${item.product.price * item.quantity} ₽`;

        // Экранируем название товара и опции, оставляя управляющие символы
        return `• ${escapeMarkdown(item.product.name)}${escapeMarkdown(optionsText)} \\- ${item.quantity} шт. \\- ${priceText}`;
      })
      .join('\n');

    // ---- 6. Формирование полного текста сообщения (MarkdownV2) ----
    const message = `
🎉 *НОВЫЙ ЗАКАЗ!*

👤 *Клиент:* ${escapeMarkdown(orderData.customerName)}
📞 *Телефон:* ${escapeMarkdown(orderData.phone)}
${orderData.telegram ? `✈️ *Telegram:* ${escapeMarkdown(orderData.telegram)}` : ''}

📍 *Пункт выдачи:* ${escapeMarkdown(selectedPoint.name)}
🏠 *Адрес:* ${escapeMarkdown(selectedPoint.address)}

🛒 *Заказ:*
${itemsList}

💰 *Итого:* ${orderData.total} ₽

${orderData.notes ? `📝 *Комментарий:* ${escapeMarkdown(orderData.notes)}` : ''}

⏰ *Время заказа:* ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Vladivostok' })}
`;

    console.log('📝 Текст сообщения (первые 200 символов):', message.substring(0, 200));

    // ---- 7. Отправка запроса в Telegram API ----
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: OWNER_ID,
        text: message,
        parse_mode: 'MarkdownV2',
      }),
    });

    const result = await response.json();
    console.log('🤖 Ответ Telegram:', result);

    // ---- 8. Проверка ответа ----
    if (!result.ok) {
      console.error('❌ Ошибка Telegram:', result.description);
      return NextResponse.json(
        { error: `Telegram error: ${result.description}` },
        { status: 500 }
      );
    }

    // ---- 9. Успешное завершение ----
    console.log('✅ Уведомление успешно отправлено');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // ---- 10. Непредвиденная ошибка ----
    console.error('❌ Необработанное исключение:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
