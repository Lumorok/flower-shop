import { Product, PickupPoint } from './types';

// ===========================================================================
// 🟡 ТЮЛЬПАНЫ – ВСЕ ПО 160 ₽
// ===========================================================================
export const tulipsCatalog: Product[] = [
  {
    id: 'tulip-1',
    name: 'Тюльпан Lalibela',
    description: '',
    price: 165, // изменено
    imageUrl: '/images/tulips/lalibela.jpg',
    category: 'tulips',
    sort: 'Lalibela',
    inStock: true
  },
  {
    id: 'tulip-2',
    name: 'Тюльпан Sissi',
    description: '',
    price: 165,
    imageUrl: '/images/tulips/sissi.jpg',
    category: 'tulips',
    sort: 'Sissi',
    inStock: true
  },
  {
    id: 'tulip-3',
    name: 'Тюльпан Strong Gold',
    description: '',
    price: 165,
    imageUrl: '/images/tulips/strong-gold.jpg',
    category: 'tulips',
    sort: 'Strong Gold',
    inStock: true
  },
  {
    id: 'tulip-4',
    name: 'Тюльпан Update',
    description: '',
    price: 165,
    imageUrl: '/images/tulips/update.jpg',
    category: 'tulips',
    sort: 'Update',
    inStock: true
  },
  {
    id: 'tulip-5',
    name: 'Тюльпан White Prince',
    description: '',
    price: 165,
    imageUrl: '/images/tulips/white-prince.jpg',
    category: 'tulips',
    sort: 'White Prince',
    inStock: true
  },
  {
    id: 'tulip-6',
    name: 'Тюльпан Replay',
    description: '',
    price: 165,
    imageUrl: '/images/tulips/replay.jpg',
    category: 'tulips',
    sort: 'Replay',
    inStock: true
  },
  {
    id: 'tulip-7',
    name: 'Тюльпан Kamaliya',
    description: '',
    price: 165,
    imageUrl: '/images/tulips/kamaliya.jpg',
    category: 'tulips',
    sort: 'Kamaliya',
    inStock: true
  },
  {
    id: 'tulip-8',
    name: 'Тюльпан Dynasty',
    description: '',
    price: 175,
    imageUrl: '/images/tulips/dynasty.jpg',
    category: 'tulips',
    sort: 'Dynasty',
    inStock: true
  },
  {
    id: 'tulip-9',
    name: 'Тюльпан Frontline',
    description: '',
    price: 165,
    imageUrl: '/images/tulips/frontline.jpg',
    category: 'tulips',
    sort: 'Frontline',
    inStock: true
  },
  {
    id: 'tulip-10',
    name: 'Тюльпан Pink Ardour',
    description: '',
    price: 165,
    imageUrl: '/images/tulips/pink-ardour.jpg',
    category: 'tulips',
    sort: 'Pink Ardour',
    inStock: true
  },
  {
    id: 'tulip-11',
    name: 'Тюльпан Rodeo Drive',
    description: '',
    price: 165,
    imageUrl: '/images/tulips/rodeo-drive.jpg',
    category: 'tulips',
    sort: 'Rodeo Drive',
    inStock: true
  }
];

// ============================================================================
// 🎁 УПАКОВКА – НОВЫЕ ЦЕНЫ
// ============================================================================

// Цвета для крафт бумаги с соответствующими изображениями
export const PAPER_COLORS = [
  { 
    value: 'kraft', 
    label: 'Крафт', 
    image: '/images/packaging/kraft-natural.jpg',
    bgColor: 'bg-amber-100', 
    textColor: 'text-amber-900' 
  },
  { 
    value: 'white', 
    label: 'Нежно феолетовый', 
    image: '/images/packaging/kraft-white.jpg',
    bgColor: 'bg-white', 
    textColor: 'text-gray-900' 
  },
  { 
    value: 'black', 
    label: 'Розовый', 
    image: '/images/packaging/kraft-black.jpg',
    bgColor: 'bg-gray-900', 
    textColor: 'text-white' 
  },
  { 
    value: 'beige', 
    label: 'Темно фиолетовый', 
    image: '/images/packaging/kraft-beige.jpg',
    bgColor: 'bg-stone-100', 
    textColor: 'text-stone-800' 
  },
];

export const packagingCatalog: Product[] = [
  {
    id: 'pack-1',
    name: 'Крафт бумага',
    description: '3 листов высококачественной крафт бумаги. Выберите цвет!',
    price: 250, // изменено
    imageUrl: PAPER_COLORS[0].image, // по умолчанию натуральный
    category: 'packaging',
    sort: 'Крафт',
    inStock: true,
    hasOptions: true
  },
  {
    id: 'pack-2',
    name: 'Пакет малый',
    description: 'Компактный бумажный пакет с ручками.',
    price: 300, // изменено
    imageUrl: '/images/packaging/bag-small.jpg',
    category: 'packaging',
    sort: 'Пакет',
    inStock: true
  },
  {
    id: 'pack-3',
    name: 'Пакет большой',
    description: 'Вместительный бумажный пакет с усиленными ручками.',
    price: 300, // изменено
    imageUrl: '/images/packaging/bag-large.jpg',
    category: 'packaging',
    sort: 'Пакет',
    inStock: true
  },
  {
    id: 'pack-4',
    name: 'Газета',
    description: 'Крафтовая газета для декоративной упаковки.',
    price: 0,
    imageUrl: '/images/packaging/newspaper.jpg',
    category: 'packaging',
    sort: 'Газета',
    inStock: true
  },
  {
    id: 'pack-5',
    name: 'Ленточка',
    description: 'Декоративная ленточка для украшения букета.',
    price: 0,
    imageUrl: '/images/packaging/ribbon.jpg',
    category: 'packaging',
    sort: 'Ленточка',
    inStock: true
  }
];

// ============================================================================
// 📍 ПУНКТЫ САМОВЫВОЗА (график 07:00–23:00)
// ============================================================================
export const defaultPickupPoints: PickupPoint[] = [
  {
    id: 'point-1',
    name: 'Проспект 100-летия Владивостока',
    address: 'г. Владивосток, проспект 100-летия Владивостока, 12в',
    description: 'Напротив автомойки «Дельфин». Самовывоз с 07:00 до 23:00.',
    workingHours: '07:00 - 23:00',
    coordinates: { lat: 43.1198, lng: 131.8869 }
  },
  {
    id: 'point-2',
    name: 'Толстого',
    address: 'г. Владивосток, ул. Толстого, 38, ст. 1',
    description: 'Центральный пункт выдачи. Работаем без выходных.',
    workingHours: '07:00 - 23:00',
    coordinates: { lat: 43.1156, lng: 131.8853 }
  },
  {
    id: 'point-3',
    name: 'Скоро открытие',
    address: 'Новый пункт выдачи (уточняется)',
    description: 'Скоро откроем новый пункт выдачи в вашем районе!',
    workingHours: '07:00 - 23:00',
  }
];
