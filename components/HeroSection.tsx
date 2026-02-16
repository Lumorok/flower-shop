'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Flower } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=2070")',
        }}
      >
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
      </div>

      <div className="relative z-10 container-custom text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block p-3 rounded-full bg-white/10 backdrop-blur-sm mb-6"
          >
            <Flower className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6"
          >
            Эксклюзивные тюльпаны
            <span className="block text-primary">и авторские букеты</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto"
          >
            Самовывоз и доставка с букетами с 7:00 до 23:00
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#tulips"
              className="btn-primary inline-flex items-center justify-center"
            >
              Выбрать тюльпаны
            </a>
            <a
              href="#bouquets"
              className="btn-outline bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-gray-900 inline-flex items-center justify-center"
            >
              Смотреть букеты
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-white animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}