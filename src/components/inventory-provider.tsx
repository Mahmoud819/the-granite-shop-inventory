"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { inventory, type InventoryItem } from "@/lib/inventory";

const STORAGE_KEY = "granite-shop-inventory-v1";

type InventoryContextValue = {
  items: InventoryItem[];
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  resetDemoInventory: () => void;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

function isInventoryItem(value: unknown): value is InventoryItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<InventoryItem>;
  return typeof item.id === "string" && typeof item.name === "string" &&
    typeof item.category === "string" && typeof item.quantity === "number" &&
    typeof item.status === "string";
}

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState(inventory);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(isInventoryItem)) setItems(parsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // The current browser may block storage; the in-page edits still work.
    }
  }, [items, ready]);

  const resetDemoInventory = () => {
    setItems(inventory);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <InventoryContext.Provider value={{ items, setItems, resetDemoInventory }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory must be used inside InventoryProvider");
  return context;
}