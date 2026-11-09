import { InventoryBrowser } from "@/components/inventory-browser";

type InventoryPageProps = {
  searchParams: Promise<{ category?: string; status?: string }>;
};

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const filters = await searchParams;
  return <InventoryBrowser isAdmin initialCategory={filters.category ?? ""} initialStatus={filters.status ?? ""} />;
}