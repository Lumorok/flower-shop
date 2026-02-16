'use client';

import { motion } from 'framer-motion';
import { Flower, Package, Gift } from 'lucide-react'; // ✅ Добавлен Gift
import { tulipsCatalog, packagingCatalog } from '@/lib/constants';
import ProductCard from './ProductCard';

export default function CatalogSection() {
  return (
    <section className="py-24">
      <div className="container-custom">
        {/* 🟡 Эксклюзивные тюльпаны */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          id="tulips"
          className="mb-32"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-5"
            >
              <Flower className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Эксклюзивные тюльпаны
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg md:text-xl">
              Отборные сорта тюльпанов из Голландии. Каждый цветок проходит строгий контроль качества.
            </p>
            <div className="w-24 h-1.5 bg-primary mx-auto mt-8 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {tulipsCatalog.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </motion.div>

        {/* 🎁 Упаковка */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2 }}
          id="packaging"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-5"
            >
              <Package className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Всё для упаковки
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg md:text-xl">
              Крафт бумага с выбором цвета, пакеты двух размеров, а также бесплатные газета и ленточка. 
              Создайте идеальную презентацию!
            </p>
            <div className="w-24 h-1.5 bg-primary mx-auto mt-8 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {packagingCatalog.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          
          {/* Подпись о бесплатных товарах */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/5 rounded-full border border-primary/20">
              <Gift className="w-5 h-5 text-primary" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Газета и ленточка — абсолютно бесплатно! Добавляйте в корзину.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}