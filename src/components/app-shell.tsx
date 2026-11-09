"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useInventory } from "@/components/inventory-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Boxes },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items } = useInventory();
  const [userEmail, setUserEmail] = useState("");
  const authConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? ""));
  }, [pathname]);

  if (pathname === "/" || pathname === "/login") return <>{children}</>;

  const signOut = async () => {
    await getSupabaseBrowserClient()?.auth.signOut();
    window.location.assign("/login");
  };

  return (
    <div className="app-frame">
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="mobile-scrim"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`sidebar${mobileOpen ? " sidebar-open" : ""}`}>
        <Link className="brand-lockup" href="/" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark"><span /></span>
          <span className="brand-copy">
            <strong>GRANITE SHOP</strong>
            <small>INVENTORY DESK</small>
          </span>
        </Link>
        <button aria-label="Close navigation" className="sidebar-close" onClick={() => setMobileOpen(false)}>
          <X size={18} />
        </button>

        <div className="nav-caption">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`nav-link${active ? " nav-link-active" : ""}`}
                href={href}
                key={href}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{label}</span>
                {label === "Inventory" && <span className="nav-count">{items.length}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="warehouse-chip">
            <span className="warehouse-dot" />
            <span><strong>Warehouse A</strong><small>Local workspace</small></span>
          </div>
          <div className="user-profile">
            <span className="user-avatar">{userEmail ? userEmail.slice(0, 1).toUpperCase() : "D"}</span>
            <span><strong>{userEmail || "Demo user"}</strong><small>{userEmail ? "Shop employee" : "Local demo session"}</small></span>
            {authConfigured && <button aria-label="Sign out" className="profile-signout" onClick={signOut} title="Sign out" type="button"><LogOut size={15} /></button>}
          </div>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button
            aria-label="Open navigation"
            className="mobile-menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>Inventory desk</strong></div>
          <div className="topbar-right"><span className="demo-indicator"><i /> Demo data</span><span className="topbar-divider" /><span className="topbar-date">Friday, November 6</span></div>
        </header>
        <main className="page-content">{children}</main>
        <footer className="demo-note"><span>DEMO WORKSPACE</span><span>Sample inventory only. Changes are not saved.</span></footer>
      </div>
    </div>
  );
}