'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShoppingCart, Trash2, Plus, Minus,
  Send, Gift, Truck, MapPin
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { PAPER_COLORS, defaultPickupPoints } from '@/lib/constants';

// Хук для определения мобильного устройства
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export default function CartModal() {
  const {
    cart,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
  } = useStore();

  const isMobile = useMediaQuery('(max-width: 768px)');

  // Локальные состояния
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<string>(
    defaultPickupPoints[0]?.id || ''
  );
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const getPaperLabel = (value: string) => {
    return PAPER_COLORS.find(p => p.value === value)?.label || value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim()) {
      alert('Заполните имя и телефон');
      return;
    }

    if (deliveryType === 'pickup' && !selectedPickupPoint) {
      alert('Выберите пункт самовывоза');
      return;
    }

    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      alert('Введите адрес доставки');
      return;
    }

    if (cart.length === 0) {
      alert('Корзина пуста');
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      items: cart,
      customerName,
      phone,
      telegram: telegram.trim() || undefined,
      pickupPointId: deliveryType === 'pickup' ? selectedPickupPoint : undefined,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress.trim() : undefined,
      notes: notes.trim() || undefined,
      total: getTotalPrice(),
    };

    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setOrderSuccess(true);
        clearCart();
        setCustomerName('');
        setPhone('');
        setTelegram('');
        setNotes('');
        setDeliveryAddress('');
        setDeliveryType('pickup');
        setSelectedPickupPoint(defaultPickupPoints[0]?.id || '');
        setTimeout(() => {
          setOrderSuccess(false);
          toggleCart();
        }, 3000);
      } else {
        throw new Error('Ошибка отправки заказа');
      }
    } catch (error) {
      console.error(error);
      alert('Произошла ошибка при отправке заказа. Попробуйте ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Динамическая анимация в зависимости от устройства
  const initial = isMobile ? { y: '100%' } : { x: '100%' };
  const animate = isMobile ? { y: 0 } : { x: 0 };
  const exit = isMobile ? { y: '100%' } : { x: '100%' };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={initial}
            animate={animate}
            exit={exit}
            transition={{ type: 'tween', duration: 0.3 }}
            className={`fixed ${
              isMobile
                ? 'bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl'
                : 'right-0 top-0 bottom-0 w-full max-w-md'
            } bg-white dark:bg-[hsl(var(--background))] z-50 shadow-2xl overflow-y-auto`}
          >
            <div className="h-full flex flex-col">
              {/* Заголовок */}
              <div className="p-4 sm:p-6 border-b border-border sticky top-0 bg-white dark:bg-[hsl(var(--background))] z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    <h2 className="text-lg sm:text-xl font-bold text-foreground">
                      Корзина {cart.length > 0 && `(${cart.length})`}
                    </h2>
                  </div>
                  <button
                    onClick={toggleCart}
                    className="p-2 sm:p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Закрыть"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              {/* Список товаров */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Корзина пуста
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => {
                      const isFree = item.product.price === 0;
                      return (
                        <div
                          key={`${item.product.id}-${JSON.stringify(item.options)}`}
                          className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                        >
                          <div
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gray-200 dark:bg-gray-700 bg-cover bg-center flex-shrink-0"
                            style={{
                              backgroundImage: `url("${item.product.imageUrl}")`,
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground text-sm sm:text-base truncate">
                              {item.product.name}
                            </h3>
                            {item.options?.paperColor && (
                              <div className="mt-1 flex items-center gap-1.5">
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  Цвет:
                                </span>
                                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  {getPaperLabel(item.options.paperColor)}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span className="text-primary font-semibold text-sm sm:text-base">
                                {isFree ? 'Бесплатно' : `${item.product.price} ₽`}
                              </span>
                              {!isFree && (
                                <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                  × {item.quantity} = {item.product.price * item.quantity} ₽
                                </span>
                              )}
                              {isFree && (
                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Gift className="w-3 h-3" />
                                  Подарок
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            {!isFree && (
                              <>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-2 sm:p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                  aria-label="Уменьшить количество"
                                >
                                  <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                                <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-2 sm:p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                  aria-label="Увеличить количество"
                                >
                                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-2 sm:p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                              aria-label="Удалить товар"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Форма оформления (если есть товары) */}
              {cart.length > 0 && !orderSuccess && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="border-t border-border p-4 sm:p-6 space-y-4"
                >
                  <h3 className="font-semibold text-base sm:text-lg text-foreground">
                    Оформление заказа
                  </h3>

                  {/* Переключатель способа получения */}
                  <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-3 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                        deliveryType === 'pickup'
                          ? 'bg-primary text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden xs:inline">Самовывоз</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-3 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                        deliveryType === 'delivery'
                          ? 'bg-primary text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden xs:inline">Доставка</span>
                    </button>
                  </div>

                  {/* Блок самовывоза */}
                  {deliveryType === 'pickup' && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Выберите пункт самовывоза *
                      </label>
                      {defaultPickupPoints.map((point) => (
                        <label
                          key={point.id}
                          className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedPickupPoint === point.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="pickupPoint"
                            value={point.id}
                            checked={selectedPickupPoint === point.id}
                            onChange={(e) => setSelectedPickupPoint(e.target.value)}
                            className="mt-1 w-4 h-4 sm:w-5 sm:h-5"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm sm:text-base">{point.name}</div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              {point.address}
                            </div>
                            {point.workingHours && (
                              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                ⏰ {point.workingHours}
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Блок доставки */}
                  {deliveryType === 'delivery' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Адрес доставки *
                      </label>
                      <textarea
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="input-field min-h-[80px] text-base"
                        placeholder="Улица, дом, квартира, этаж, домофон..."
                        required={deliveryType === 'delivery'}
                      />
                    </div>
                  )}

                  {/* Контактные данные */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Имя *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="input-field text-base"
                      placeholder="Ваше имя"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field text-base"
                      placeholder="+7 (999) 999-99-99"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telegram (username или номер)
                    </label>
                    <input
                      type="text"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      className="input-field text-base"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Комментарий к заказу
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="input-field min-h-[80px] text-base"
                      placeholder="Особые пожелания, время доставки и т.д."
                    />
                  </div>

                  {/* Итог и кнопка */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-base sm:text-lg font-semibold text-foreground">
                        Итого:
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-primary">
                        {getTotalPrice()} ₽
                      </span>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full flex items-center justify-center space-x-2 py-3 sm:py-4 text-base"
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>
                        {isSubmitting ? 'Отправка...' : `Оформить заказ (${cart.length})`}
                      </span>
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Сообщение об успехе */}
              {orderSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 text-center"
                >
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Заказ отправлен!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Мы свяжемся с вами в ближайшее время.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
