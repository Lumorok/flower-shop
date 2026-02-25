import { NextRequest, NextResponse } from 'next/server';

// ==================== ЖЁСТКО ПРОПИСАННЫЕ ДАННЫЕ (для гарантии) ====================
const BOT_TOKEN = '8546089505:AAF6jAuItoeqpaYmPj9cvT790Tn0uxJPJME';
const OWNER_ID = '1602352560';

// ==================== Пункты выдачи ====================
const PICKUP_POINTS = [
  { id: 'point-1', name: 'Проспект 100-летия Владивостока', address: 'г. Владивосток, пр-т 100-летия Владивостока, 12в' },
  { id: 'point-2', name: 'Толстого', address: 'г. Владивосток, ул. Толстого, 38, ст. 1' },
  { id: 'point-3', name: 'Скоро открытие', address: 'Новый пункт выдачи (уточняется)' },
];

// ==================== ОСНОВНОЙ ОБРАБОТЧИК ====================
export async function POST(request: NextRequest) {
  console.log('🔥 API ВЫЗВАН');
  
  try {
    const data = await request.json();
    console.log('📦 ПРИШЛИ ДАННЫЕ:', JSON.stringify(data, null, 2));

    // Извлекаем все возможные поля
    const customerName = data.customerName || data.name || data.fullName || data.clientName || '';
    const phone = data.phone || data.phoneNumber || data.tel || data.mobile || '';
    const pickupPointId = data.pickupPointId || data.pickupPoint || data.pointId || data.point || '';
    const deliveryAddress = data.deliveryAddress || data.address || '';
    const items = data.items || data.cart || data.products || [];
    const total = data.total || data.totalPrice || data.amount || 0;
    const telegram = data.telegram || data.username || data.tg || '';
    const notes = data.notes || data.comment || data.message || '';

    // Валидация
    if (!customerName || !phone) {
      console.error('❌ Не хватает имени или телефона');
      return NextResponse.json(
        { error: 'Заполните имя и телефон' },
        { status: 400 }
      );
    }

    if (!deliveryAddress && !pickupPointId) {
      console.error('❌ Не указан способ получения');
      return NextResponse.json(
        { error: 'Укажите адрес доставки или выберите пункт самовывоза' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      console.error('❌ Корзина пуста');
      return NextResponse.json(
        { error: 'Корзина не может быть пустой' },
        { status: 400 }
      );
    }

    // Определяем способ получения
    let pickupInfo = '';
    if (deliveryAddress) {
      pickupInfo = `📍 Доставка по адресу: ${deliveryAddress}`;
    } else {
      const selectedPoint = PICKUP_POINTS.find(p => p.id === pickupPointId);
      if (!selectedPoint) {
        console.error(`❌ Неизвестный пункт выдачи: ${pickupPointId}`);
        return NextResponse.json(
          { error: 'Выбранный пункт выдачи не найден' },
          { status: 400 }
        );
      }
      pickupInfo = `📍 Самовывоз: ${selectedPoint.name}\n🏠 Адрес: ${selectedPoint.address}`;
    }

    // Формируем список товаров
    let itemsText = '';
    for (const item of items) {
      const product = item.product || item;
      const name = product.name || 'Товар';
      const quantity = item.quantity || 1;
      const price = product.price || 0;
      const itemTotal = price * quantity;
      itemsText += `• ${name} x${quantity} = ${itemTotal} ₽\n`;
    }

    // Собираем сообщение
    const message = `
🆕 НОВЫЙ ЗАКАЗ

👤 Клиент: ${customerName}
📞 Телефон: ${phone}
${telegram ? `✈️ Telegram: ${telegram}` : ''}

${pickupInfo}

🛒 Товары:
${itemsText}
💰 Итого: ${total} ₽
${notes ? `\n📝 Комментарий: ${notes}` : ''}
⏰ Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Vladivostok' })}
    `.trim();

    console.log('📝 Сообщение для Telegram:', message);

    // Отправляем в Telegram
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: OWNER_ID,
        text: message,
      }),
    });

    const result = await response.json();
    console.log('🤖 Ответ Telegram:', result);

    if (!result.ok) {
      console.error('❌ Ошибка Telegram:', result.description);
      return NextResponse.json(
        { error: `Telegram отказался принять сообщение: ${result.description}` },
        { status: 500 }
      );
    }

    console.log('✅ Заказ успешно отправлен');
    return NextResponse.json({ success: true, message: 'Заказ принят' });

  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
