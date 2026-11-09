import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { InventoryProvider } from "@/components/inventory-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Granite Shop Inventory",
  description: "Granite, quartz, and countertop shop inventory dashboard.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><InventoryProvider><AppShell>{children}</AppShell></InventoryProvider></body>
    </html>
  );
}