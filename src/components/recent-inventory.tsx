"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import type { InventoryItem } from "@/lib/inventory";

type ActivityView = "updated" | "added";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${date}T12:00:00`));

export function RecentInventory({ items }: { items: InventoryItem[] }) {
  const [view, setView] = useState<ActivityView>("updated");
  const dateField = view === "updated" ? "updatedAt" : "createdAt";
  const recentItems = [...items].sort((a, b) => b[dateField].localeCompare(a[dateField])).slice(0, 4);

  return (
    <section className="panel recent-panel">
      <div className="panel-heading recent-heading">
        <div><span className="section-kicker">LATEST ACTIVITY</span><h2>{view === "updated" ? "Recently updated" : "Recently added"}</h2></div>
        <div className="recent-controls">
          <div className="activity-tabs" role="tablist" aria-label="Inventory activity">
            <button aria-selected={view === "updated"} className={view === "updated" ? "activity-tab activity-tab-active" : "activity-tab"} onClick={() => setView("updated")} role="tab" type="button">Updated</button>
            <button aria-selected={view === "added"} className={view === "added" ? "activity-tab activity-tab-active" : "activity-tab"} onClick={() => setView("added")} role="tab" type="button">Added</button>
          </div>
          <Link className="panel-link panel-link-heading" href="/inventory">All inventory <ArrowRight size={14} /></Link>
        </div>
      </div>
      <div className="recent-table-wrap">
        <table className="recent-table">
          <thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>LOCATION</th><th>STATUS</th><th>{view === "updated" ? "UPDATED" : "ADDED"}</th><th /></tr></thead>
          <tbody>
            {recentItems.map((item) => (
              <tr key={item.id}>
                <td><div className="table-product"><Image alt="" src={item.image} width={44} height={44} /><span><strong>{item.name}</strong><small>{item.id} · {item.colour}</small></span></div></td>
                <td><span className="table-category">{item.category}</span></td>
                <td className="table-location">{item.location}</td>
                <td><span className={`status-pill status-${item.status.toLowerCase()}`}><i />{item.status}</span></td>
                <td className="table-date">{formatDate(item[dateField])}</td>
                <td><ArrowRight className="table-arrow" size={14} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}