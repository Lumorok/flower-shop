'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Check, Star, Package, Gift, 
  Droplet, Flower, BaggageClaim, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { PAPER_COLORS } from '@/lib/constants';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const addToCart = useStore((state) => state.addToCart);
  const isFree = product.price === 0;
  const isPackaging = product.category === 'packaging';
  const isKraft = product.id === 'pack-1';

  // Для крафт-бумаги получаем текущий выбранный цвет
  const currentColor = isKraft ? PAPER_COLORS[currentColorIndex] : null;
  const currentImage = isKraft ? currentColor?.image : product.imageUrl;

  const handlePrevColor = () => {
    setCurrentColorIndex((prev) => 
      prev === 0 ? PAPER_COLORS.length - 1 : prev - 1
    );
  };

  const handleNextColor = () => {
    setCurrentColorIndex((prev) => 
      prev === PAPER_COLORS.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCart = () => {
    const options = isKraft && currentColor
      ? { paperColor: currentColor.value, imageUrl: currentColor.image }
      : undefined;
    
    addToCart(product, options);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Иконка для категории
  const getIcon = () => {
    if (product.id === 'pack-1') return <Droplet className="w-4 h-4" />;
    if (product.id === 'pack-2' || product.id === 'pack-3') return <BaggageClaim className="w-4 h-4" />;
    if (product.id === 'pack-4' || product.id === 'pack-5') return <Gift className="w-4 h-4" />;
    return <Package className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-soft dark:shadow-soft-dark hover:shadow-hover dark:hover:shadow-hover-dark transition-all duration-300 border border-border/40 flex flex-col h-full"
    >
      {/* Изображение с каруселью для крафта */}
      <div className="relative pt-[100%] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div 
          className="absolute inset-4 bg-center bg-contain bg-no-repeat transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url("${currentImage}")`,
          }}
        />
        
        {/* Стрелки для крафт-бумаги */}
        {isKraft && (
          <>
            <button
              onClick={handlePrevColor}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextColor}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {/* Индикатор цвета */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {PAPER_COLORS.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentColorIndex 
                      ? 'bg-primary w-3' 
                      : 'bg-gray-400 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Плашка бесплатно */}
        {isFree && (
          <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm border border-primary/20">
            <Gift className="w-3.5 h-3.5" />
            Бесплатно
          </div>
        )}
        
        {/* Индикатор выбранного цвета для крафта */}
        {isKraft && currentColor && (
          <div className="absolute top-3 right-3 bg-primary/10 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border border-primary/30">
            <Droplet className="w-3.5 h-3.5" />
            {currentColor.label}
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/90 dark:bg-gray-900/90 text-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-serif text-lg font-semibold text-foreground leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-primary font-bold whitespace-nowrap">
                {isFree ? '0 ₽' : `${product.price} ₽`}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {product.description}
          </p>

          {/* Мета-информация */}
          <div className="flex flex-wrap items-center gap-2 mt-auto mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-medium border border-primary/10">
              <Star className="w-3.5 h-3.5 fill-current" />
              {product.sort}
            </span>
            {isPackaging && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium">
                {getIcon()}
                {product.id.includes('pack-1') && 'Крафт'}
                {product.id.includes('pack-2') && 'Малый'}
                {product.id.includes('pack-3') && 'Большой'}
                {product.id.includes('pack-4') && 'Газета'}
                {product.id.includes('pack-5') && 'Лента'}
              </span>
            )}
          </div>
        </div>

        {/* Кнопка добавления */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdded}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium
            transition-all duration-300 active:scale-[0.98]
            ${isAdded 
              ? 'bg-primary/20 text-primary cursor-default border border-primary/30' 
              : isFree
                ? 'bg-secondary/10 text-secondary-foreground border-2 border-secondary/30 hover:bg-secondary hover:text-white hover:border-secondary'
                : 'btn-primary'
            }
            ${!product.inStock ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400' : ''}
          `}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Добавлено</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>{isFree ? 'Добавить бесплатно' : 'В корзину'}</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}