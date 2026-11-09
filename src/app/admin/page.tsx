"use client";

import Link from "next/link";
import { ArrowRight, Boxes, CircleAlert, Layers3, PackageCheck } from "lucide-react";
import { getInventorySummary } from "@/lib/inventory";
import { useInventory } from "@/components/inventory-provider";

export default function AdminDashboardPage() {
  const { items } = useInventory();
  const summary = getInventorySummary(items);
  const metrics = [
    { label: "Active stock", value: summary.totalUnits, icon: Boxes, tone: "green" },
    { label: "Available", value: summary.availableUnits, icon: PackageCheck, tone: "blue" },
    { label: "Reserved", value: summary.reservedUnits, icon: Layers3, tone: "amber" },
    { label: "Low-stock products", value: summary.lowStock.length, icon: CircleAlert, tone: "slate" },
  ];

  return (
    <div className="dashboard-page">
      <section className="page-heading dashboard-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> EMPLOYEE WORKSPACE</div>
          <h1>Shop overview<span className="heading-period">.</span></h1>
          <p>Inventory totals and stock requiring attention.</p>
        </div>
        <Link className="button button-primary" href="/inventory"><Boxes size={16} /> Manage inventory</Link>
      </section>
      <section aria-label="Inventory overview" className="metric-grid">
        {metrics.map(({ label, value, icon: Icon, tone }, index) => (
          <article className={`metric-card metric-${tone}`} key={label} style={{ animationDelay: `${index * 65}ms` }}>
            <div className="metric-top"><span>{label}</span><Icon size={17} strokeWidth={1.8} /></div>
            <div className="metric-value">{value.toLocaleString()}<small>demo records</small></div>
            <div className="metric-note">Stored in this browser only</div>
          </article>
        ))}
      </section>
      <section className="panel category-panel admin-category-panel">
        <div className="panel-heading"><div><span className="section-kicker">STOCK BREAKDOWN</span><h2>Inventory by category</h2></div><Link className="panel-link panel-link-heading" href="/inventory">Manage records <ArrowRight size={14} /></Link></div>
        <div className="category-list">
          {summary.categories.map((category) => <Link className="category-row" href={`/inventory?category=${encodeURIComponent(category.name)}`} key={category.name}><span className="category-label"><strong>{category.name}</strong><small>{category.records} product {category.records === 1 ? "record" : "records"}</small></span><span className="category-quantity">{category.units}<small>units</small></span><ArrowRight className="category-arrow" size={15} /></Link>)}
        </div>
      </section>
    </div>
  );
}