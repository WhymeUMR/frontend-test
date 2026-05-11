"use client";

import { useCallback, useState } from "react";
import type { Nomenclature } from "@/lib/api-types";

export interface CartItem {
  nomenclature: Nomenclature;
  quantity: number;
  price: number;
  priceTypeId?: number | null;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback(
    (nomenclature: Nomenclature, priceTypeId?: number | null) => {
      setItems((prev) => {
        const exists = prev.find((i) => i.nomenclature.id === nomenclature.id);
        if (exists) {
          return prev.map((i) =>
            i.nomenclature.id === nomenclature.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          );
        }
        const defaultPrice = resolvePrice(nomenclature, priceTypeId);
        return [
          ...prev,
          { nomenclature, quantity: 1, price: defaultPrice, priceTypeId },
        ];
      });
    },
    [],
  );

  const removeItem = useCallback((nomenclatureId: number) => {
    setItems((prev) => prev.filter((i) => i.nomenclature.id !== nomenclatureId));
  }, []);

  const updateQuantity = useCallback((nomenclatureId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.nomenclature.id !== nomenclatureId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.nomenclature.id === nomenclatureId ? { ...i, quantity } : i,
      ),
    );
  }, []);

  const updatePrice = useCallback((nomenclatureId: number, price: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.nomenclature.id === nomenclatureId ? { ...i, price } : i,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, updatePrice, clearCart, total };
}

export function resolvePrice(
  nomenclature: Nomenclature,
  priceTypeId?: number | null,
): number {
  if (priceTypeId && nomenclature.prices) {
    const found = nomenclature.prices.find((p) => p.price_type === priceTypeId);
    if (found) return found.price;
  }
  if (nomenclature.prices && nomenclature.prices.length > 0) {
    return nomenclature.prices[0].price;
  }
  return nomenclature.price ?? 0;
}
