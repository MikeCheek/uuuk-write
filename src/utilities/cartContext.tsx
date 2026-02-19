import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Metadata } from './arenaSettings';
import { useSnackbar } from './snackbarContext';

const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (product: Metadata) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalPrice: number;
}>({
  cart: [],
  addToCart: () => { },
  removeFromCart: () => { },
  clearCart: () => { },
  totalItems: 0,
  subtotalPrice: 0
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { showSnackbar } = useSnackbar();
  // 1. Initialize state from LocalStorage or empty array
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const savedCart = localStorage.getItem('shopping_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Persist to LocalStorage whenever the cart changes
  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
  }, [cart]);

  // Helper: Add Item
  const addToCart = (product: Metadata) => {
    setCart((prev) => {
      const existing = false // prev.find((item) => item.id === product.id);
      const cartId = Date.now(); // Unique ID for cart item instance
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 0) + 1 } : item
        );
      }
      showSnackbar(`${product.name ?? 'Prodotto'} aggiunto al carrello!`, 'success');
      return [...prev, { ...product, quantity: 1, cartId }];
    });
  };

  // Helper: Remove Item
  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.cartId !== id));
  };

  // Helper: Clear Cart
  const clearCart = () => setCart([]);

  // Calculate Totals (Assuming numeric conversion if needed, otherwise string management)
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const subtotalPrice = cart.reduce((total, item) => total + (item.price || 0), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, subtotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for cleaner usage in components
export const useCart = () => useContext(CartContext);