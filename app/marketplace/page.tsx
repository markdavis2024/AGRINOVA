"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  ImageOff,
  Layout,
  LayoutDashboard,
  Loader2,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Minus,
  Package,
  PackageX,
  Phone,
  Plus,
  Search,
  Store,
  X,
} from "lucide-react";

import Logo from "../../components/Logo";
import { useAnySession, ROLE_PATH } from "../../lib/useSession";

type Listing = {
  id: number;
  title: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  quantity: string;
  imageUrl: string | null;
  status: "ACTIVE" | "SOLD_OUT";
  farmerId: number;
  farmer: {
    name: string;
    region: string | null;
    town: string | null;
    phone: string | null;
  };
};

const categories = [
  "All categories",
  "Vegetables",
  "Fruits",
  "Cereals & grains",
  "Livestock & poultry",
  "Dairy",
  "Other produce",
];

export default function MarketplacePage() {
  const router = useRouter();
  const { user, loading } = useAnySession();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [selected, setSelected] = useState<Listing | null>(null);
  const [orderQuantity, setOrderQuantity] = useState("1");
  const [orderNote, setOrderNote] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  function openListing(listing: Listing) {
    setSelected(listing);
    setOrderQuantity("1");
    setOrderNote("");
    setOrderError("");
    setOrderSuccess(false);
  }

  async function placeOrder() {
    if (!selected) return;

    const quantity = Number(orderQuantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setOrderError("Please enter a valid quantity.");
      return;
    }

    setOrderLoading(true);
    setOrderError("");

    try {
      const res = await fetch("/api/marketplace/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: selected.id,
          quantity,
          note: orderNote,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setOrderError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setOrderSuccess(true);
    } catch {
      setOrderError("Couldn't reach the server. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  }

  useEffect(() => {
    if (!user) return;

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "All categories") params.set("category", category);

    const timeout = setTimeout(() => {
      fetch(`/api/marketplace/listings?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => setListings(data.listings ?? []))
        .catch(() => setListings([]));
    }, 250);

    return () => clearTimeout(timeout);
  }, [user, search, category]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading || !user) {
    return <div className="dash-loading">Loading the marketplace...</div>;
  }

  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];
  const homePath = ROLE_PATH[user.role];

  return (
    <div className="dash-page">
      {sidebarOpen && (
        <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={`dash-sidebar ${sidebarOpen ? "dash-sidebar-open" : ""}`}>
        <div className="dash-sidebar-top">
          <Link href="/" className="dash-logo">
            <Logo width={130} />
          </Link>

          <button
            className="dash-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="dash-nav">
          <span className="dash-nav-label">Main</span>

          <Link href={homePath} className="dash-nav-item">
            <LayoutDashboard size={16} />
            Dashboard
          </Link>

          <button className="dash-nav-item dash-nav-active">
            <Store size={16} />
            Marketplace
          </button>
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-admin-card">
            <div className="dash-avatar">{initial}</div>
            <div>
              <strong>{user.name}</strong>
              <span>{user.role.charAt(0) + user.role.slice(1).toLowerCase()} account</span>
            </div>
          </div>

          <button className="dash-logout" onClick={handleLogout}>
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="dash-main">
        <header className="dash-topbar">
          <button
            className="dash-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="dash-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search produce..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="dash-topbar-actions">
            <button className="dash-icon-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="dash-dot" />
            </button>

            <div className="dash-profile">
              <button
                className="dash-profile-btn"
                onClick={() => setProfileOpen((v) => !v)}
              >
                <div className="dash-avatar dash-avatar-small">{initial}</div>
                <span>{firstName}</span>
                <ChevronDown size={14} />
              </button>

              {profileOpen && (
                <div className="dash-profile-menu">
                  <Link href="/" className="dash-profile-menu-item">
                    <Layout size={14} />
                    Back to landing page
                  </Link>
                  <button className="dash-profile-menu-item" onClick={handleLogout}>
                    <LogOut size={14} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="dash-content">
          <div className="dash-page-header">
            <div>
              <h1>Marketplace</h1>
              <p>Fresh produce from farmers across AGRINOVA.</p>
            </div>
          </div>

          <div className="market-filters">
            {categories.map((c) => (
              <button
                key={c}
                className={`auth-chip ${category === c ? "auth-chip-active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {listings === null && (
            <div className="dash-loading-inline">Loading listings...</div>
          )}

          {listings !== null && listings.length === 0 && (
            <div className="verif-empty">
              <PackageX size={22} />
              <h3>No listings found</h3>
              <p>Try a different search or category.</p>
            </div>
          )}

          <div className="listing-grid">
            {listings?.map((l) => (
              <button
                className="listing-card listing-card-clickable"
                key={l.id}
                onClick={() => openListing(l)}
              >
                <div className="listing-card-image">
                  {l.imageUrl ? (
                    <img src={l.imageUrl} alt={l.title} />
                  ) : (
                    <ImageOff size={22} />
                  )}
                </div>

                <div className="listing-card-body">
                  <span className="listing-category">{l.category}</span>
                  <h3>{l.title}</h3>
                  <div className="listing-price">
                    {l.price.toLocaleString()} FCFA
                    <span> / {l.unit}</span>
                  </div>
                  <p className="listing-quantity">
                    <MapPin size={11} />
                    {l.farmer.town ?? "Unknown location"}
                    {l.farmer.region ? `, ${l.farmer.region}` : ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>

      {/* ================= LISTING DETAIL MODAL ================= */}
      {selected && (
        <div className="market-modal-overlay" onClick={() => setSelected(null)}>
          <div className="market-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="market-modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="market-modal-image">
              {selected.imageUrl ? (
                <img src={selected.imageUrl} alt={selected.title} />
              ) : (
                <ImageOff size={30} />
              )}
            </div>

            <div className="market-modal-body">
              <span className="listing-category">{selected.category}</span>
              <h2>{selected.title}</h2>
              <div className="listing-price market-modal-price">
                {selected.price.toLocaleString()} FCFA
                <span> / {selected.unit}</span>
              </div>
              <p className="market-modal-desc">{selected.description}</p>
              <p className="listing-quantity">
                <Package size={13} />
                {selected.quantity} available
              </p>

              <div className="market-modal-farmer">
                <div className="dash-avatar">{selected.farmer.name.charAt(0).toUpperCase()}</div>
                <div>
                  <strong>{selected.farmer.name}</strong>
                  <span>
                    <MapPin size={11} />
                    {selected.farmer.town ?? "Unknown location"}
                    {selected.farmer.region ? `, ${selected.farmer.region}` : ""}
                  </span>
                </div>
              </div>

              <div className="market-modal-contact-row">
                {selected.farmer.phone && (
                  <a href={`tel:${selected.farmer.phone}`} className="btn btn-light market-modal-contact">
                    <Phone size={15} />
                    Call
                  </a>
                )}

                <Link
                  href={`/messages?to=${selected.farmerId}`}
                  className="btn btn-light market-modal-contact"
                >
                  <MessageSquare size={15} />
                  Message
                </Link>
              </div>

              {user.role === "BUYER" && selected.status === "ACTIVE" && (
                <div className="order-box">
                  {orderSuccess ? (
                    <div className="order-success">
                      <CheckCircle2 size={18} />
                      <div>
                        <strong>Order placed!</strong>
                        <span>The farmer will confirm it shortly.</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="order-box-label">Place an order</span>

                      <div className="order-qty-row">
                        <button
                          type="button"
                          className="order-qty-btn"
                          onClick={() =>
                            setOrderQuantity((q) =>
                              String(Math.max(1, Number(q || "1") - 1))
                            )
                          }
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={orderQuantity}
                          onChange={(e) => setOrderQuantity(e.target.value)}
                        />
                        <button
                          type="button"
                          className="order-qty-btn"
                          onClick={() =>
                            setOrderQuantity((q) => String(Number(q || "0") + 1))
                          }
                        >
                          <Plus size={14} />
                        </button>
                        <span className="order-qty-unit">{selected.unit}</span>
                      </div>

                      <textarea
                        className="listing-textarea order-note"
                        placeholder="Add a note for the farmer (optional) — delivery address, timing..."
                        rows={2}
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                      />

                      <div className="order-total">
                        Total:{" "}
                        <strong>
                          {(
                            selected.price * (Number(orderQuantity) || 0)
                          ).toLocaleString()}{" "}
                          FCFA
                        </strong>
                      </div>

                      {orderError && (
                        <div className="login-message login-error">{orderError}</div>
                      )}

                      <button
                        type="button"
                        className="btn btn-primary market-modal-contact"
                        disabled={orderLoading}
                        onClick={placeOrder}
                      >
                        {orderLoading ? (
                          <>
                            <Loader2 size={16} className="login-spinner" />
                            Placing order...
                          </>
                        ) : (
                          <>Place order →</>
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
