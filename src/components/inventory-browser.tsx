"use client";

import Image from "next/image";
import { useState } from "react";
import { Pencil, Plus, Search, SlidersHorizontal, Trash2, X } from "lucide-react";
import { useInventory } from "@/components/inventory-provider";
import { inventory, type Availability, type Category, type InventoryItem } from "@/lib/inventory";

const categories: Category[] = ["Granite slabs", "Quartz slabs", "Remnants", "Vanities", "Sinks", "Faucets"];
const statuses: Availability[] = ["Available", "Reserved", "Sold", "Damaged"];

export function InventoryBrowser({ initialCategory = "", initialStatus = "", isAdmin = false }: { initialCategory?: string; initialStatus?: string; isAdmin?: boolean }) {
  const { items: savedItems, setItems } = useInventory();
  const items = isAdmin ? savedItems : inventory.filter((item) => item.status === "Available");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [material, setMaterial] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [application, setApplication] = useState("");
  const [draft, setDraft] = useState<InventoryItem | null>(null);
  const [formError, setFormError] = useState("");

  const filteredInventory = items.filter((item) => {
    const searchable = [item.id, item.name, item.colour, item.material, item.brand, item.sku, item.supplier, item.location, item.dimensions, item.application, item.originalSlabId]
      .join(" ")
      .toLowerCase();
    return (
      (!query || searchable.includes(query.trim().toLowerCase())) &&
      (!category || item.category === category) &&
      (!material || item.material === material) &&
      (!brand || item.brand === brand) &&
      (!application || item.application === application) &&
      (!status || item.status === status)
    );
  });
  const activeFilters = [category, material, brand, application, status].filter(Boolean).length;

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setMaterial("");
    setBrand("");
    setApplication("");
    setStatus("");
  };

  const openNewItem = () => {
    const today = new Date().toISOString().slice(0, 10);
    const prefix = "INV";
    let id = `${prefix}-${Date.now()}`;
    let suffix = 1;
    while (items.some((item) => item.id === id)) id = `${prefix}-${Date.now()}-${suffix++}`;
    setDraft({
      id,
      name: "",
      category: "Remnants",
      material: "",
      brand: "",
      supplier: "",
      sku: "",
      colour: "",
      location: "",
      quantity: 1,
      unit: "pieces",
      status: "Available",
      dimensions: "",
      tracking: "individual",
      length: undefined,
      width: undefined,
      thickness: undefined,
      dimensionUnit: "in",
      shape: "",
      originalSlabId: "",
      notes: "",
      createdAt: today,
      updatedAt: today,
      image: inventory[0].image,
    });
    setFormError("");
  };

  const saveItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;
    const normalizedId = draft.id.trim().toUpperCase();
    if (items.some((item) => item.id.toUpperCase() === normalizedId && item.id !== draft.id)) {
      setFormError("That inventory ID is already in use.");
      return;
    }
    if (!draft.name.trim() || !draft.material.trim() || !draft.location.trim()) {
      setFormError("Enter a product name, material type, and location.");
      return;
    }
    const isRemnant = draft.category === "Remnants";
    const isSlab = draft.category === "Granite slabs" || draft.category === "Quartz slabs";
    const dimensions = isRemnant || isSlab
      ? `${draft.length || 0} × ${draft.width || 0} ${draft.dimensionUnit || "in"}${draft.thickness ? ` · ${draft.thickness} cm` : ""}`
      : draft.dimensions;
    const updated: InventoryItem = {
      ...draft,
      id: normalizedId,
      name: draft.name.trim(),
      material: draft.material.trim(),
      location: draft.location.trim(),
      quantity: isRemnant ? 1 : Math.max(0, Number(draft.quantity) || 0),
      unit: isSlab ? "slabs" : isRemnant ? "pieces" : "units",
      tracking: isSlab || isRemnant ? "individual" : "quantity",
      dimensions,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setItems((current) => current.some((item) => item.id === draft.id)
      ? current.map((item) => item.id === draft.id ? updated : item)
      : [updated, ...current]);
    setDraft(null);
  };

  const deleteItem = (item: InventoryItem) => {
    if (!window.confirm(`Delete ${item.name} (${item.id}) from this browser's demo inventory?`)) return;
    setItems((current) => current.filter((record) => record.id !== item.id));
  };

  const setDraftField = <K extends keyof InventoryItem>(field: K, value: InventoryItem[K]) => {
    setDraft((current) => current ? { ...current, [field]: value } : current);
  };

  return (
    <div className="inventory-page">
      <section className="page-heading inventory-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> STOCK CATALOGUE</div>
          <h1>Inventory<span className="heading-period">.</span></h1>
          <p>Every surface, remnant, fixture, and finish in one place.</p>
        </div>
        <div className="inventory-header-stats">
          <span><strong>{items.length}</strong><small>product records</small></span>
          <i />
          <span><strong>{items.filter((item) => item.status !== "Sold").length}</strong><small>active records</small></span>
        </div>
      </section>

      <section className={`panel inventory-panel${isAdmin ? " inventory-panel-admin" : " inventory-panel-public"}`}>
        <div className="inventory-toolbar">
          <label className="inventory-search">
            <Search size={17} />
            <input
              aria-label="Search inventory"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search ID, material, colour, location..."
              type="search"
              value={query}
            />
            {query && <button aria-label="Clear search" onClick={() => setQuery("")} type="button"><X size={15} /></button>}
          </label>
          <div className="toolbar-filters">
            <label className="filter-select"><span className="sr-only">Category</span><select aria-label="Filter by category" onChange={(event) => setCategory(event.target.value)} value={category}><option value="">All categories</option>{categories.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="filter-select"><span className="sr-only">Material</span><select aria-label="Filter by material" onChange={(event) => setMaterial(event.target.value)} value={material}><option value="">All materials</option>{Array.from(new Set(items.map((item) => item.material))).sort().map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="filter-select"><span className="sr-only">Brand</span><select aria-label="Filter by brand" onChange={(event) => setBrand(event.target.value)} value={brand}><option value="">All brands</option>{Array.from(new Set(items.map((item) => item.brand).filter(Boolean))).sort().map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="filter-select"><span className="sr-only">Use</span><select aria-label="Filter by kitchen or vanity" onChange={(event) => setApplication(event.target.value)} value={application}><option value="">Kitchen / vanity</option><option>Kitchen</option><option>Vanity</option></select></label>
            {isAdmin && <label className="filter-select"><span className="sr-only">Availability</span><select aria-label="Filter by availability" onChange={(event) => setStatus(event.target.value)} value={status}><option value="">Any status</option>{statuses.map((option) => <option key={option}>{option}</option>)}</select></label>}
          </div>
          {isAdmin && <button className="button button-primary add-inventory-button" onClick={openNewItem} type="button"><Plus size={15} /> Add inventory</button>}
        </div>

        <div className="inventory-resultbar">
          <span><SlidersHorizontal size={14} /> Showing <strong>{filteredInventory.length}</strong> of {items.length} product records</span>
          {activeFilters > 0 && <button className="clear-filters" onClick={clearFilters} type="button">Clear filters <X size={13} /></button>}
        </div>

        {filteredInventory.length > 0 ? (
          <div className="inventory-table-wrap">
            <table className="inventory-table">
              <thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>BRAND / SKU</th><th>DIMENSIONS</th><th>LOCATION</th><th>STOCK</th><th>STATUS</th>{isAdmin && <th><span className="sr-only">Actions</span></th>}</tr></thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id}>
                    <td><div className="table-product"><Image alt="" src={item.image} width={48} height={48} /><span><strong>{item.name}</strong><small>{item.id} · {item.colour}</small></span></div></td>
                    <td><span className="table-category">{item.application ? `${item.application} ${item.category.slice(0, -1).toLowerCase()}` : item.category}</span></td>
                    <td><span className="table-brand">{item.brand}</span><small className="table-sku">{item.sku}</small></td>
                    <td className="dimensions-cell">{item.dimensions}</td>
                    <td className="table-location">{item.location}</td>
                    <td><span className="stock-count">{item.quantity}</span><small className="stock-unit">{item.unit}</small></td>
                    <td><span className={`status-pill status-${item.status.toLowerCase()}`}><i />{item.status}</span></td>
                    {isAdmin && <td><div className="row-actions"><button aria-label={`Edit ${item.name}`} className="icon-action" onClick={() => { setDraft({ ...item }); setFormError(""); }} title="Edit inventory" type="button"><Pencil size={14} /></button><button aria-label={`Delete ${item.name}`} className="icon-action icon-action-danger" onClick={() => deleteItem(item)} title="Delete inventory" type="button"><Trash2 size={14} /></button></div></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state"><span className="empty-icon"><Search size={20} /></span><h2>No inventory found</h2><p>Try a different search or clear some filters.</p><button className="button button-secondary" onClick={clearFilters} type="button">Clear filters</button></div>
        )}
        <div className="inventory-footnote"><span>Product counts vary by tracking type.</span><span>Individual slabs and remnants are tracked separately.</span></div>
      </section>

      {isAdmin && draft && (
        <div className="editor-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDraft(null); }}>
          <section aria-labelledby="editor-title" aria-modal="true" className="inventory-editor" role="dialog">
            <div className="editor-heading">
              <div><span className="section-kicker">LOCAL DEMO RECORD</span><h2 id="editor-title">{items.some((item) => item.id === draft.id) ? "Edit inventory" : "Add inventory"}</h2></div>
              <button aria-label="Close form" className="icon-action" onClick={() => setDraft(null)} type="button"><X size={17} /></button>
            </div>
            <p className="editor-intro">Changes save in this browser only. They are not shared with other employees.</p>
            <form className="editor-form" onSubmit={saveItem}>
              <div className="form-grid">
                <label className="form-field"><span>Inventory ID</span><input onChange={(event) => setDraftField("id", event.target.value)} readOnly value={draft.id} /></label>
                <label className="form-field"><span>Category</span><select onChange={(event) => {
                  const nextCategory = event.target.value as Category;
                  setDraft((current) => current ? {
                    ...current,
                    category: nextCategory,
                    unit: nextCategory === "Remnants" ? "pieces" : nextCategory.includes("slabs") ? "slabs" : "units",
                    tracking: nextCategory === "Remnants" || nextCategory.includes("slabs") ? "individual" : "quantity",
                    quantity: nextCategory === "Remnants" ? 1 : current.quantity,
                    application: nextCategory === "Sinks" || nextCategory === "Faucets" ? current.application ?? "Kitchen" : undefined,
                  } : current);
                }} value={draft.category}>{categories.map((option) => <option key={option}>{option}</option>)}</select></label>
                <label className="form-field form-field-wide"><span>Product name</span><input autoFocus onChange={(event) => setDraftField("name", event.target.value)} required value={draft.name} /></label>
                <label className="form-field"><span>Material type</span><input onChange={(event) => setDraftField("material", event.target.value)} placeholder="Granite, quartz, porcelain..." required value={draft.material} /></label>
                <label className="form-field"><span>Colour</span><input onChange={(event) => setDraftField("colour", event.target.value)} value={draft.colour} /></label>
                <label className="form-field"><span>Brand</span><input onChange={(event) => setDraftField("brand", event.target.value)} value={draft.brand} /></label>
                <label className="form-field"><span>Supplier</span><input onChange={(event) => setDraftField("supplier", event.target.value)} value={draft.supplier} /></label>
                <label className="form-field"><span>SKU</span><input onChange={(event) => setDraftField("sku", event.target.value)} value={draft.sku} /></label>
                <label className="form-field"><span>Availability</span><select onChange={(event) => setDraftField("status", event.target.value as Availability)} value={draft.status}>{statuses.map((option) => <option key={option}>{option}</option>)}</select></label>
                <label className="form-field form-field-wide"><span>Warehouse / section / rack / shelf / bin</span><input onChange={(event) => setDraftField("location", event.target.value)} placeholder="Warehouse A · Section 1 · Rack A3 · Position 4" required value={draft.location} /></label>
                {(draft.category === "Remnants" || draft.category.includes("slabs")) && <>
                  <label className="form-field"><span>Length</span><input min="0" onChange={(event) => setDraftField("length", event.target.value === "" ? undefined : Number(event.target.value))} required type="number" value={draft.length ?? ""} /></label>
                  <label className="form-field"><span>Width</span><input min="0" onChange={(event) => setDraftField("width", event.target.value === "" ? undefined : Number(event.target.value))} required type="number" value={draft.width ?? ""} /></label>
                  <label className="form-field"><span>Dimension unit</span><select onChange={(event) => setDraftField("dimensionUnit", event.target.value as "in" | "cm")} value={draft.dimensionUnit ?? "in"}><option value="in">Inches</option><option value="cm">Centimetres</option></select></label>
                  <label className="form-field"><span>Thickness (cm)</span><input min="0" onChange={(event) => setDraftField("thickness", event.target.value === "" ? undefined : Number(event.target.value))} required type="number" value={draft.thickness ?? ""} /></label>
                </>}
                {draft.category === "Remnants" && <>
                  <label className="form-field"><span>Shape</span><input onChange={(event) => setDraftField("shape", event.target.value)} placeholder="Rectangle, L-shape..." value={draft.shape ?? ""} /></label>
                  <label className="form-field"><span>Original slab ID</span><input onChange={(event) => setDraftField("originalSlabId", event.target.value)} value={draft.originalSlabId ?? ""} /></label>
                </>}
                {(draft.category === "Sinks" || draft.category === "Faucets") && <label className="form-field"><span>Use</span><select onChange={(event) => setDraftField("application", event.target.value as "Kitchen" | "Vanity")} value={draft.application ?? "Kitchen"}><option>Kitchen</option><option>Vanity</option></select></label>}
                {draft.category !== "Remnants" && <label className="form-field"><span>Quantity</span><input min="0" onChange={(event) => setDraftField("quantity", Number(event.target.value))} required type="number" value={draft.quantity} /></label>}
                {!draft.category.includes("slabs") && draft.category !== "Remnants" && <label className="form-field"><span>Dimensions / details</span><input onChange={(event) => setDraftField("dimensions", event.target.value)} placeholder="Size, installation type, finish..." value={draft.dimensions} /></label>}
                <label className="form-field form-field-wide"><span>Notes</span><textarea onChange={(event) => setDraftField("notes", event.target.value)} rows={2} value={draft.notes ?? ""} /></label>
              </div>
              {formError && <p className="form-error" role="alert">{formError}</p>}
              <div className="editor-actions"><button className="button button-secondary" onClick={() => setDraft(null)} type="button">Cancel</button><button className="button button-primary" type="submit">Save inventory</button></div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}