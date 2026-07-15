'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types/cart';
import { Product } from '@/types/product';
import { toast } from 'sonner';

interface CartContextType {
  cartItems: CartItem[];
  isInitialized: boolean;
  appliedVoucher: string | null;
  discountPercentage: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyVoucher: (code: string) => boolean;
  removeVoucher: () => void;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getGrandTotal: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'shopping-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
          } else {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to parse shopping cart from localStorage. Resetting cart.', error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setCartItems([]);
      } finally {
        setIsInitialized(true);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error('Failed to save shopping cart to localStorage:', error);
      }
    }
  }, [cartItems, isInitialized]);

  // Add Item to Cart
  const addItem = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.productId === product.id);

      if (existingItemIndex > -1) {
        const existingItem = prevItems[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;

        // Check stock bounds
        if (newQuantity > product.stock) {
          toast.warning(`Stok tidak mencukupi. Maksimal pembelian adalah ${product.stock} unit.`);
          return prevItems;
        }

        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          subtotal: newQuantity * existingItem.price,
        };
        toast.success(`${product.name} berhasil ditambahkan ke keranjang.`);
        return updatedItems;
      } else {
        // Add new item
        if (quantity > product.stock) {
          toast.warning(`Stok tidak mencukupi. Maksimal pembelian adalah ${product.stock} unit.`);
          return prevItems;
        }

        const newItem: CartItem = {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity,
          subtotal: quantity * product.price,
          createdAt: new Date().toISOString(),
        };
        toast.success(`${product.name} berhasil ditambahkan ke keranjang.`);
        return [...prevItems, newItem];
      }
    });
  };

  // Remove Item from Cart
  const removeItem = (productId: string) => {
    setCartItems((prevItems) => {
      const updated = prevItems.filter((item) => item.productId !== productId);
      return updated;
    });
  };

  // Update Quantity
  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productId !== productId) return item;

        // Constrain quantity to [1, stock]
        const constrainedQuantity = Math.max(1, Math.min(quantity, item.stock));
        return {
          ...item,
          quantity: constrainedQuantity,
          subtotal: constrainedQuantity * item.price,
        };
      }),
    );
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
    setAppliedVoucher(null);
    setDiscountPercentage(0);
  };

  // Apply Voucher
  const applyVoucher = (code: string): boolean => {
    if (code.toUpperCase() === 'HEMAT10') {
      setAppliedVoucher('HEMAT10');
      setDiscountPercentage(10);
      return true;
    }
    return false;
  };

  // Remove Voucher
  const removeVoucher = () => {
    setAppliedVoucher(null);
    setDiscountPercentage(0);
  };

  // Calculations
  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  };

  const getDiscountAmount = () => {
    const subtotal = getSubtotal();
    return (subtotal * discountPercentage) / 100;
  };

  const getShippingFee = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 500000 ? 0 : 20000;
  };

  const getGrandTotal = () => {
    return getSubtotal() - getDiscountAmount() + getShippingFee();
  };

  const getTotalItems = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isInitialized,
        appliedVoucher,
        discountPercentage,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyVoucher,
        removeVoucher,
        getSubtotal,
        getDiscountAmount,
        getShippingFee,
        getGrandTotal,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
