// === ELITE LA PEPTIDES — Global Cart Context ===
// Shared cart state accessible from any page

import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  productId: string;
  productName: string;
  productCategory: string;
  quantity: number;
  unitPrice: number;
};

type CartContextType = {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  updateQty: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getQty: (productId: string) => number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => (i.productId === productId ? { ...i, quantity: i.quantity + delta } : i))
        .filter(i => i.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const isInCart = (productId: string) => cart.some(i => i.productId === productId);

  const getQty = (productId: string) => cart.find(i => i.productId === productId)?.quantity ?? 0;

  return (
    <CartContext.Provider
      value={{ cart, cartCount, cartTotal, addToCart, updateQty, removeFromCart, clearCart, isInCart, getQty }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
