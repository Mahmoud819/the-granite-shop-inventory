export type Category =
  | "Granite slabs"
  | "Quartz slabs"
  | "Remnants"
  | "Vanities"
  | "Sinks"
  | "Faucets";

export type Availability = "Available" | "Reserved" | "Sold" | "Damaged";

export type InventoryItem = {
  id: string;
  name: string;
  category: Category;
  material: string;
  brand: string;
  supplier: string;
  sku: string;
  colour: string;
  location: string;
  quantity: number;
  unit: "slabs" | "pieces" | "units";
  status: Availability;
  dimensions: string;
  tracking: "individual" | "quantity";
  application?: "Kitchen" | "Vanity";
  length?: number;
  width?: number;
  thickness?: number;
  dimensionUnit?: "in" | "cm";
  shape?: string;
  originalSlabId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  image: string;
};

const demoPhoto = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1000&q=82`;

export const inventory: InventoryItem[] = [
  {
    id: "GRT-24081",
    name: "Alaska White",
    category: "Granite slabs",
    material: "Granite",
    brand: "Stonepeak",
    supplier: "Northstar Imports",
    sku: "STP-AW-3CM",
    colour: "Pearl / grey",
    location: "Warehouse A · Rack G2",
    quantity: 4,
    unit: "slabs",
    status: "Available",
    dimensions: "126 × 63 in · 3 cm",
    tracking: "individual",
    length: 126,
    width: 63,
    thickness: 3,
    dimensionUnit: "in",
    createdAt: "2026-10-28",
    updatedAt: "2026-11-05",
    image: demoPhoto("photo-1600607687939-ce8a6c25118c"),
  },
  {
    id: "GRT-24094",
    name: "Absolute Black",
    category: "Granite slabs",
    material: "Granite",
    brand: "Orion Stone",
    supplier: "Northstar Imports",
    sku: "ORI-AB-2CM",
    colour: "Black",
    location: "Warehouse A · Rack G4",
    quantity: 2,
    unit: "slabs",
    status: "Reserved",
    dimensions: "120 × 58 in · 2 cm",
    tracking: "individual",
    length: 120,
    width: 58,
    thickness: 2,
    dimensionUnit: "in",
    createdAt: "2026-10-23",
    updatedAt: "2026-11-04",
    image: demoPhoto("photo-1600566753086-00f18fb6b3ea"),
  },
  {
    id: "QRT-18203",
    name: "Calacatta Gold",
    category: "Quartz slabs",
    material: "Quartz",
    brand: "Silestone",
    supplier: "Pacific Surfaces",
    sku: "SIL-CG-3CM",
    colour: "Warm white / gold",
    location: "Warehouse B · Rack Q1",
    quantity: 6,
    unit: "slabs",
    status: "Available",
    dimensions: "126 × 63 in · 3 cm",
    tracking: "individual",
    length: 126,
    width: 63,
    thickness: 3,
    dimensionUnit: "in",
    createdAt: "2026-10-21",
    updatedAt: "2026-11-06",
    image: demoPhoto("photo-1600607687920-4e2a09cf159d"),
  },
  {
    id: "QRT-18224",
    name: "Frost White",
    category: "Quartz slabs",
    material: "Quartz",
    brand: "Caesarstone",
    supplier: "Pacific Surfaces",
    sku: "CAE-FW-2CM",
    colour: "Soft white",
    location: "Warehouse B · Rack Q3",
    quantity: 3,
    unit: "slabs",
    status: "Available",
    dimensions: "120 × 56 in · 2 cm",
    tracking: "individual",
    length: 120,
    width: 56,
    thickness: 2,
    dimensionUnit: "in",
    createdAt: "2026-10-19",
    updatedAt: "2026-11-02",
    image: demoPhoto("photo-1600210492486-724fe5c67fb0"),
  },
  {
    id: "REM-0921",
    name: "Taj Mahal remnant",
    category: "Remnants",
    material: "Quartzite",
    brand: "Natural stone",
    supplier: "Northstar Imports",
    sku: "REM-TM-0921",
    colour: "Ivory / taupe",
    location: "Remnant yard · Bin R12",
    quantity: 1,
    unit: "pieces",
    status: "Available",
    dimensions: "68 × 31 in · 3 cm",
    tracking: "individual",
    length: 68,
    width: 31,
    thickness: 3,
    dimensionUnit: "in",
    shape: "Rectangle",
    originalSlabId: "QRT-18203",
    createdAt: "2026-11-03",
    updatedAt: "2026-11-03",
    image: demoPhoto("photo-1600607687939-ce8a6c25118c"),
  },
  {
    id: "REM-0938",
    name: "Nero Marquina remnant",
    category: "Remnants",
    material: "Quartz",
    brand: "Silestone",
    supplier: "Pacific Surfaces",
    sku: "REM-NM-0938",
    colour: "Black / white vein",
    location: "Remnant yard · Bin R04",
    quantity: 1,
    unit: "pieces",
    status: "Reserved",
    dimensions: "44 × 26 in · 2 cm",
    tracking: "individual",
    length: 44,
    width: 26,
    thickness: 2,
    dimensionUnit: "in",
    shape: "Rectangle",
    createdAt: "2026-10-31",
    updatedAt: "2026-11-05",
    image: demoPhoto("photo-1600566753086-00f18fb6b3ea"),
  },
  {
    id: "VAN-1045",
    name: "Oslo 48 in vanity",
    category: "Vanities",
    material: "Oak / porcelain",
    brand: "Northline Bath",
    supplier: "Pacific Surfaces",
    sku: "NLB-OSL-48",
    colour: "Natural oak",
    location: "Showroom · Bay 3",
    quantity: 4,
    unit: "units",
    status: "Available",
    dimensions: "48 × 34 × 22 in",
    tracking: "quantity",
    createdAt: "2026-10-17",
    updatedAt: "2026-11-01",
    image: demoPhoto("photo-1600607687920-4e2a09cf159d"),
  },
  {
    id: "SNK-0384",
    name: "Pure 1810 undermount",
    category: "Sinks",
    material: "Stainless steel",
    brand: "Blanco",
    supplier: "Harbour Fixtures",
    sku: "BL-401234",
    colour: "Satin stainless",
    location: "Warehouse C · Shelf S2",
    quantity: 8,
    unit: "units",
    status: "Available",
    dimensions: "28 × 18 × 8 in",
    tracking: "quantity",
    application: "Kitchen",
    createdAt: "2026-10-25",
    updatedAt: "2026-10-30",
    image: demoPhoto("photo-1600210492486-724fe5c67fb0"),
  },
  {
    id: "SNK-0412",
    name: "Solaqua vessel basin",
    category: "Sinks",
    material: "Vitreous china",
    brand: "Kohler",
    supplier: "Harbour Fixtures",
    sku: "KOH-SOL-141",
    colour: "White",
    location: "Warehouse C · Shelf S4",
    quantity: 2,
    unit: "units",
    status: "Reserved",
    dimensions: "16 × 16 × 6 in",
    tracking: "quantity",
    application: "Vanity",
    createdAt: "2026-10-14",
    updatedAt: "2026-11-04",
    image: demoPhoto("photo-1600607687939-ce8a6c25118c"),
  },
  {
    id: "FCT-0229",
    name: "Litze single-handle faucet",
    category: "Faucets",
    material: "Brass",
    brand: "Brizo",
    supplier: "Harbour Fixtures",
    sku: "BRZ-LIT-630",
    colour: "Brushed nickel",
    location: "Showroom · Display F2",
    quantity: 3,
    unit: "units",
    status: "Available",
    dimensions: "8 in reach · 1-hole",
    tracking: "quantity",
    application: "Vanity",
    createdAt: "2026-10-12",
    updatedAt: "2026-11-06",
    image: demoPhoto("photo-1600566753086-00f18fb6b3ea"),
  },
  {
    id: "FCT-0230",
    name: "Align pull-down faucet",
    category: "Faucets",
    material: "Brass",
    brand: "Moen",
    supplier: "Harbour Fixtures",
    sku: "MOE-ALIGN-872",
    colour: "Matte black",
    location: "Warehouse C · Shelf F1",
    quantity: 1,
    unit: "units",
    status: "Sold",
    dimensions: "7.5 in reach · 1-hole",
    tracking: "quantity",
    application: "Kitchen",
    createdAt: "2026-10-09",
    updatedAt: "2026-11-02",
    image: demoPhoto("photo-1600210492486-724fe5c67fb0"),
  },
];

export const activeInventory = inventory.filter((item) => item.status !== "Sold");

export function getInventorySummary(items: InventoryItem[]) {
  const activeItems = items.filter((item) => item.status !== "Sold");

  return {
    totalUnits: activeItems.reduce((total, item) => total + item.quantity, 0),
    availableUnits: activeItems
    .filter((item) => item.status === "Available")
    .reduce((total, item) => total + item.quantity, 0),
    reservedUnits: activeItems
    .filter((item) => item.status === "Reserved")
    .reduce((total, item) => total + item.quantity, 0),
    soldUnits: items
    .filter((item) => item.status === "Sold")
    .reduce((total, item) => total + item.quantity, 0),
    lowStock: activeItems.filter(
    (item) => item.tracking === "quantity" && item.quantity <= 4,
  ),
    categories: [
    "Granite slabs",
    "Quartz slabs",
    "Remnants",
    "Vanities",
    "Sinks",
    "Faucets",
  ].map((category) => {
      const categoryItems = activeItems.filter((item) => item.category === category);
    return {
      name: category as Category,
        units: categoryItems.reduce((total, item) => total + item.quantity, 0),
        records: categoryItems.length,
    };
  }),
  };
}

export const inventorySummary = getInventorySummary(inventory);