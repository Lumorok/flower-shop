import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, PickupPoint, Theme, Review } from './types';

interface StoreState {
  cart: CartItem[];
  isCartOpen: boolean;
  theme: Theme;
  pickupPoints: PickupPoint[];
  selectedPickupPoint: string | null;
  reviews: Review[];
  
  addToCart: (product: Product, options?: CartItem['options']) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  
  selectPickupPoint: (pointId: string) => void;
  
  addReview: (review: Omit<Review, 'id' | 'date' | 'approved'>) => void;
  deleteReview: (reviewId: string) => void;
  
  getTotalPrice: () => number;
  getCartCount: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      theme: 'light',
      pickupPoints: [],
      selectedPickupPoint: null,
      reviews: [],
      
      addToCart: (product, options) => {
        set((state) => {
          // Для товаров с опциями проверяем совпадение product.id + options
          const existingItem = state.cart.find(item => 
            item.product.id === product.id && 
            JSON.stringify(item.options) === JSON.stringify(options)
          );
          
          if (existingItem) {
            return {
              cart: state.cart.map(item =>
                item.product.id === product.id && 
                JSON.stringify(item.options) === JSON.stringify(options)
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          } else {
            return {
              cart: [...state.cart, { product, quantity: 1, options }]
            };
          }
        });
      },
      
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter(item => item.product.id !== productId)
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        set((state) => ({
          cart: state.cart.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        }));
      },
      
      clearCart: () => {
        set({ cart: [] });
      },
      
      toggleCart: () => {
        set((state) => ({ isCartOpen: !state.isCartOpen }));
      },
      
      closeCart: () => {
        set({ isCartOpen: false });
      },
      
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light'
        }));
      },
      
      setTheme: (theme) => {
        set({ theme });
      },
      
      selectPickupPoint: (pointId) => {
        set({ selectedPickupPoint: pointId });
      },
      
      addReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: `review-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          approved: true
        };
        
        set((state) => ({
          reviews: [newReview, ...state.reviews]
        }));
      },
      
      deleteReview: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.filter(review => review.id !== reviewId)
        }));
      },
      
      getTotalPrice: () => {
        return get().cart.reduce(
          (total, item) => total + (item.product.price * item.quantity),
          0
        );
      },
      
      getCartCount: () => {
        return get().cart.reduce(
          (count, item) => count + item.quantity,
          0
        );
      }
    }),
    {
      name: 'flower-shop-storage',
      partialize: (state) => ({
        cart: state.cart,
        theme: state.theme,
        selectedPickupPoint: state.selectedPickupPoint,
        reviews: state.reviews
      })
    }
  )
);