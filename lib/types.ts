export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'tulips' | 'packaging';
  sort: string;
  inStock: boolean;
  hasOptions?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  options?: {
    paperColor?: string;
    imageUrl?: string; // для крафт-бумаги – фото выбранного цвета
  };
}

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  description: string;
  workingHours: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Order {
  items: CartItem[];
  customerName: string;
  phone: string;
  telegram?: string;
  pickupPointId: string;
  carNumber?: string;
  carModel?: string;
  notes?: string;
  total: number;
}

export type Theme = 'light' | 'dark';

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}