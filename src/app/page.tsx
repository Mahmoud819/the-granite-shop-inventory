import Link from "next/link";
import { ArrowRight, KeyRound } from "lucide-react";
import { InventoryBrowser } from "@/components/inventory-browser";

export default function PublicInventoryPage() {
  return (
    <div className="public-site">
      <header className="public-header">
        <Link className="public-brand" href="/" aria-label="Granite Shop Inventory home">
          <span className="brand-mark"><span /></span>
          <span className="brand-copy"><strong>GRANITE SHOP</strong><small>INVENTORY LOOKUP</small></span>
        </Link>
        <Link className="button button-secondary public-login" href="/login"><KeyRound size={15} /> Employee login</Link>
      </header>
      <main className="public-main">
        <div className="public-heading">
          <div className="eyebrow"><span className="eyebrow-line" /> PUBLIC STOCK VIEW</div>
          <h1>Find your stone<span className="heading-period">.</span></h1>
          <p>Search available remnants, slabs, sinks, and faucets by material, size, colour, or location.</p>
        </div>
        <div className="public-demo-notice"><span className="demo-indicator"><i /> Demo catalogue</span><span>This view uses sample data. Live shared stock is not connected yet.</span></div>
        <InventoryBrowser isAdmin={false} />
      </main>
      <footer className="public-footer"><span>GRANITE SHOP INVENTORY</span><span>For current availability, contact the shop.</span><Link href="/login">Employee access <ArrowRight size={13} /></Link></footer>
    </div>
  );
}