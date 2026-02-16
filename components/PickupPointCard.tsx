'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Car, Check } from 'lucide-react';
import { PickupPoint } from '@/lib/types';

interface PickupPointCardProps {
  point: PickupPoint;
  isSelected: boolean;
  onSelect: (pointId: string) => void;
}

export default function PickupPointCard({ point, isSelected, onSelect }: PickupPointCardProps) {
  const [carNumber, setCarNumber] = useState('');
  const [carModel, setCarModel] = useState('');

  return (
    <div
      className={`bg-white dark:bg-gray-800/80 rounded-2xl p-6 transition-all duration-300 ${
        isSelected
          ? 'ring-2 ring-primary shadow-xl scale-[1.02]'
          : 'hover:shadow-lg hover:scale-[1.01]'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-full bg-primary/10">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold text-foreground">
              {point.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {point.address}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => onSelect(point.id)}
          className={`px-5 py-2 rounded-xl transition-all duration-200 font-medium ${
            isSelected
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {isSelected ? (
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4" />
              Выбрано
            </span>
          ) : (
            'Выбрать'
          )}
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{point.workingHours}</span>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {point.description}
      </p>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <Car className="w-4 h-4" />
            <span>Укажите номер и модель машины для быстрого поиска на парковке</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Номер машины
              </label>
              <input
                type="text"
                placeholder="А123БВ 25"
                value={carNumber}
                onChange={(e) => setCarNumber(e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Модель машины
              </label>
              <input
                type="text"
                placeholder="Toyota Camry"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}