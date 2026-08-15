import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  HARDWARE_MAX_QUANTITY_PER_LINE,
  HARDWARE_PRODUCTS,
  hardwareProductById,
  type HardwareProduct,
} from "../data/aiHardware";

const CART_STORAGE_KEY = "usjet-hardware-cart-v1";

export type CartLine = {
  productId: string;
  quantity: number;
};

export type CartLineWithProduct = CartLine & { product: HardwareProduct };

type HardwareCartContextValue = {
  lines: CartLineWithProduct[];
  totalItems: number;
  totalUsd: number;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const HardwareCartContext = createContext<HardwareCartContextValue | undefined>(undefined);

function readStoredLines(): CartLine[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (line) =>
        line &&
        typeof line.productId === "string" &&
        typeof line.quantity === "number" &&
        line.quantity > 0 &&
        line.quantity <= HARDWARE_MAX_QUANTITY_PER_LINE &&
        Boolean(hardwareProductById(line.productId)),
    );
  } catch {
    return [];
  }
}

export function HardwareCartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => readStoredLines());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    if (!hardwareProductById(productId) || hardwareProductById(productId)?.contactToOrder) {
      return;
    }
    setLines((current) => {
      const addQty = Math.min(HARDWARE_MAX_QUANTITY_PER_LINE, Math.max(1, Math.floor(quantity)));
      const existing = current.find((line) => line.productId === productId);
      if (existing) {
        return current.map((line) =>
          line.productId === productId
            ? { ...line, quantity: Math.min(HARDWARE_MAX_QUANTITY_PER_LINE, line.quantity + addQty) }
            : line,
        );
      }
      return [...current, { productId, quantity: addQty }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setLines((current) => current.filter((line) => line.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((current) => {
      if (quantity <= 0) {
        return current.filter((line) => line.productId !== productId);
      }
      const nextQty = Math.min(HARDWARE_MAX_QUANTITY_PER_LINE, Math.floor(quantity));
      return current.map((line) => (line.productId === productId ? { ...line, quantity: nextQty } : line));
    });
  }, []);

  const clearCart = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const linesWithProduct = useMemo<CartLineWithProduct[]>(
    () =>
      lines
        .map((line) => {
          const product = hardwareProductById(line.productId);
          return product ? { ...line, product } : undefined;
        })
        .filter((line): line is CartLineWithProduct => Boolean(line)),
    [lines],
  );

  const totalItems = useMemo(() => linesWithProduct.reduce((sum, line) => sum + line.quantity, 0), [linesWithProduct]);
  const totalUsd = useMemo(
    () => linesWithProduct.reduce((sum, line) => sum + line.quantity * line.product.priceUsd, 0),
    [linesWithProduct],
  );

  const value = useMemo<HardwareCartContextValue>(
    () => ({
      lines: linesWithProduct,
      totalItems,
      totalUsd,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      isOpen,
      openCart,
      closeCart,
    }),
    [linesWithProduct, totalItems, totalUsd, addToCart, removeFromCart, setQuantity, clearCart, isOpen, openCart, closeCart],
  );

  return <HardwareCartContext.Provider value={value}>{children}</HardwareCartContext.Provider>;
}

export function useHardwareCart(): HardwareCartContextValue {
  const ctx = useContext(HardwareCartContext);
  if (!ctx) {
    throw new Error("useHardwareCart must be used within a HardwareCartProvider");
  }
  return ctx;
}

export function allHardwareProducts(): readonly HardwareProduct[] {
  return HARDWARE_PRODUCTS;
}
