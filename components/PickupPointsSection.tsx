'use client';

import { motion } from 'framer-motion';
import { MapPin, Truck, Send, Clock, Gift } from 'lucide-react';
import { defaultPickupPoints } from '@/lib/constants';
import PickupPointCard from './PickupPointCard';
import { useStore } from '@/lib/store';

const TELEGRAM_OWNER_ID = process.env.NEXT_PUBLIC_TELEGRAM_OWNER_ID || '5141102236';
const TELEGRAM_LINK = `tg://user?id=${TELEGRAM_OWNER_ID}`;

export default function PickupPointsSection() {
  const { selectedPickupPoint, selectPickupPoint } = useStore();

  return (
    <section id="pickup" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-6">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Где забрать заказ
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg md:text-xl">
            Выберите удобный пункт самовывоза или закажите доставку через Telegram
          </p>
          <motion.div 
            className="section-divider"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
          {defaultPickupPoints.map((point, idx) => (
            <motion.div
              key={point.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <PickupPointCard
                point={point}
                isSelected={selectedPickupPoint === point.id}
                onSelect={selectPickupPoint}
              />
            </motion.div>
          ))}
        </div>

        {/* Карточка доставки */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 dark:from-primary/10 dark:via-primary/5 dark:to-secondary/10 rounded-3xl p-10 text-center border border-primary/20 shadow-2xl overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center p-5 rounded-full bg-white dark:bg-gray-900 shadow-xl mb-8"
              >
                <Truck className="w-12 h-12 text-primary" />
              </motion.div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Доставка через Telegram
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Напишите нам в Telegram, и мы обсудим все детали: время, адрес, 
                особые пожелания. Доставим букет с заботой!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Приём заказов: 07:00–23:00</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full">
                  <Gift className="w-4 h-4 text-primary" />
                  <span>Бесплатная упаковка</span>
                </div>
              </div>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-3 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                <Send className="w-5 h-5" />
                <span>Написать в Telegram</span>
              </motion.a>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                Нажмите, чтобы открыть диалог с владельцем магазина
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}