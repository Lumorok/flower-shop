'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, Send, Gift, Package } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PAPER_COLORS } from '@/lib/constants';

export default function CartModal() {
  const {
    cart,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    selectedPickupPoint,
  } = useStore();

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
    if (!customerName.trim() || !phone.trim() || !selectedPickupPoint) {
      alert('Заполните обязательные поля: имя, телефон и выберите пункт выдачи');
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
      pickupPointId: selectedPickupPoint,
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
        setTimeout(() => {
          setOrderSuccess(false);
          toggleCart();
        }, 3000);
      } else {
        throw new Error('Ошибка отправки заказа');
      }
    } catch (error) {
      console.error(error);
      alert('Произошла ошибка при отправке заказа. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-[hsl(var(--background))] z-50 shadow-2xl overflow-y-auto"
          >
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">
                      Корзина
                    </h2>
                  </div>
                  <button
                    onClick={toggleCart}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
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
                          className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                        >
                          <div
                            className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 bg-cover bg-center"
                            style={{
                              backgroundImage: `url("${item.product.imageUrl}")`,
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate">
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
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-primary font-semibold">
                                {isFree ? 'Бесплатно' : `${item.product.price} ₽`}
                              </span>
                              {!isFree && (
                                <span className="text-gray-500 dark:text-gray-400 text-sm">
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
                          <div className="flex items-center space-x-2">
                            {!isFree && (
                              <>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {cart.length > 0 && !orderSuccess && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="border-t border-border p-6 space-y-4"
                >
                  <h3 className="font-semibold text-lg text-foreground">
                    Оформление заказа
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Имя *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="input-field"
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
                      className="input-field"
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
                      className="input-field"
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
                      className="input-field min-h-[80px]"
                      placeholder="Особые пожелания, время доставки и т.д."
                    />
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-foreground">
                        Итого:
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {getTotalPrice()} ₽
                      </span>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Отправка...' : `Оформить заказ (${cart.length})`}</span>
                    </button>
                  </div>
                </motion.form>
              )}

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