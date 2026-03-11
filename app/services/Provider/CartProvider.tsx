// providers/CartProvider.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import {
  BuyPayload,
  SellPayload,
} from "@/app/services/features/market/marketApi";

interface CartContextType {
  buyCart: BuyPayload[];
  sellCart: SellPayload[];
  addToBuyCart: (item: BuyPayload) => void;
  addToSellCart: (item: SellPayload) => void;
  removeFromBuy: (symbol: string) => void;
  removeFromSell: (symbol: string) => void;
  updateBuyShares: (symbol: string, shares: number) => void;
  updateSellShares: (symbol: string, shares: number) => void;
  clearCarts: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [buyCart, setBuyCart] = useState<BuyPayload[]>([]);
  const [sellCart, setSellCart] = useState<SellPayload[]>([]);

  const addToBuyCart = (item: BuyPayload) => {
    setBuyCart((prev) => [
      ...prev.filter((i) => i.symbol !== item.symbol),
      item,
    ]);
  };

  const addToSellCart = (item: SellPayload) => {
    setSellCart((prev) => [
      ...prev.filter(
        (i) => i.symbol !== item.symbol || i.holdingId !== item.holdingId
      ),
      item,
    ]);
  };
  ("");

  // Add these functions inside the CartProvider component
  const updateBuyShares = (symbol: string, shares: number) => {
    setBuyCart((prev) =>
      prev.map((item) => (item.symbol === symbol ? { ...item, shares } : item))
    );
  };

  const updateSellShares = (symbol: string, shares: number) => {
    setSellCart((prev) =>
      prev.map((item) => (item.symbol === symbol ? { ...item, shares } : item))
    );
  };

  const removeFromBuy = (symbol: string) =>
    setBuyCart((prev) => prev.filter((i) => i.symbol !== symbol));

  const removeFromSell = (symbol: string) =>
    setSellCart((prev) => prev.filter((i) => i.symbol !== symbol));

  const clearCarts = () => {
    setBuyCart([]);
    setSellCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        buyCart,
        sellCart,
        addToBuyCart,
        addToSellCart,
        updateBuyShares,
        updateSellShares,
        removeFromBuy,
        removeFromSell,
        clearCarts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
