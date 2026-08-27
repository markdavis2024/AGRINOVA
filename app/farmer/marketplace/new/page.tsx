"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Banknote,
  Bell,
  ChevronDown,
  ImagePlus,
  Layout,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Search,
  Settings,
  Sprout,
  Store,
  Tag,
  X,
} from "lucide-react";

import Logo from "../../../../components/Logo";
import { useSession } from "../../../../lib/useSession";

const categories = [
  "Vegetables",
  "Fruits",
  "Cereals & grains",
  "Livestock & poultry",
  "Dairy",
  "Other produce",
];

const units = ["kg", "bag", "crate", "liter", "piece"];

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/farmer" },
  { label: "My Farms", icon: Sprout },
  { label: "Marketplace", icon: Store, href: "/farmer/marketplace", active: true },
  { label: "Orders", icon: Package },
  { label: "IoT Devices", icon: Activity },
  { label: "Messages", icon: MessageSquare },
  { label: "Settings", icon: Settings },
];

export default function NewListingPage() {
  const router = useRouter();
  const { user, loading } = useSession("FARMER");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    unit: "",
    quantity: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleImageChange(file: File | null) {
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      !form.title ||
      !form.category ||
      !form.description ||
      !form.price ||
      !form.unit ||
      !form.quantity
    ) {
      setError("Please fill in every field.");
      return;
    }

    const priceNumber = Number(form.price);

    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.set("title", form.title);
      fd.set("category", form.category);
      fd.set("description", form.description);
      fd.set("price", form.price);
      fd.set("unit", form.unit);
      fd.set("quantity", form.quantity);
      if (image) fd.set("image", image);

      const res = await fetch("/api/marketplace/listings", {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push("/farmer/marketplace");
    } catch {
      setError(
        "Couldn't reach the server. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) {
    return <div className="dash-loading">Loading your dashboard...</div>;
  }

  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];

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

          {navItems.slice(0, 4).map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className={`dash-nav-item ${item.active ? "dash-nav-active" : ""}`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ) : (
              <button key={item.label} className="dash-nav-item">
                <item.icon size={16} />
                {item.label}
                <span className="dash-soon">Soon</span>
              </button>
            )
          )}

          <span className="dash-nav-label">Support</span>

          {navItems.slice(4).map((item) => (
            <button key={item.label} className="dash-nav-item">
              <item.icon size={16} />
              {item.label}
              <span className="dash-soon">Soon</span>
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-admin-card">
            <div className="dash-avatar">{initial}</div>
            <div>
              <strong>{user.name}</strong>
              <span>Farmer account</span>
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
            <input type="text" placeholder="Search farms, listings, orders..." />
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
          <Link href="/farmer/marketplace" className="auth-mini-back">
            <ArrowLeft size={14} />
            Back to my listings
          </Link>

          <div className="dash-page-header">
            <div>
              <h1>Create a listing</h1>
              <p>Put your produce up for sale on the AGRINOVA marketplace.</p>
            </div>
          </div>

          <div className="listing-form-card">
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <label className="login-field">
                <span>Listing title</span>
                <div className="login-input">
                  <Tag size={16} />
                  <input
                    type="text"
                    placeholder="e.g. Fresh Tomatoes"
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                  />
                </div>
              </label>

              <div className="auth-field-row">
                <label className="login-field">
                  <span>Category</span>
                  <div className="login-input">
                    <Sprout size={16} />
                    <select
                      value={form.category}
                      onChange={(e) => update("category", e.target.value)}
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>

                <label className="login-field">
                  <span>Quantity available</span>
                  <div className="login-input">
                    <Package size={16} />
                    <input
                      type="text"
                      placeholder="e.g. 50"
                      value={form.quantity}
                      onChange={(e) => update("quantity", e.target.value)}
                    />
                  </div>
                </label>
              </div>

              <div className="auth-field-row">
                <label className="login-field">
                  <span>Price (FCFA)</span>
                  <div className="login-input">
                    <Banknote size={16} />
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 500"
                      value={form.price}
                      onChange={(e) => update("price", e.target.value)}
                    />
                  </div>
                </label>

                <label className="login-field">
                  <span>Unit</span>
                  <div className="login-input">
                    <Tag size={16} />
                    <select
                      value={form.unit}
                      onChange={(e) => update("unit", e.target.value)}
                    >
                      <option value="">Select unit</option>
                      {units.map((u) => (
                        <option key={u} value={u}>
                          per {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>

              <label className="login-field">
                <span>Description</span>
                <textarea
                  className="listing-textarea"
                  placeholder="Describe your produce — freshness, harvest date, delivery options..."
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={4}
                />
              </label>

              <div className="login-field">
                <span>Photo (optional)</span>
                <label className="auth-upload listing-image-upload">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="listing-image-preview" />
                  ) : (
                    <ImagePlus size={18} />
                  )}
                  <div>
                    <strong>{image ? image.name : "Click to upload a photo"}</strong>
                    <small>JPG, PNG or WEBP, up to 5MB.</small>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              {error && <div className="login-message login-error">{error}</div>}

              <button
                type="submit"
                className="btn btn-primary listing-submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="login-spinner" />
                    Publishing...
                  </>
                ) : (
                  <>Publish listing →</>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
