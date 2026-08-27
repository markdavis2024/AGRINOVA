"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Bell,
  CheckCircle2,
  ChevronDown,
  CircleX,
  Cpu,
  Droplets,
  Layout,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Package,
  Plus,
  Radio,
  Search,
  Settings,
  Sprout,
  Store,
  Thermometer,
  Trash2,
  Waves,
  X,
} from "lucide-react";

import Logo from "../../../components/Logo";
import { useSession } from "../../../lib/useSession";

type DeviceType =
  | "SOIL_MOISTURE"
  | "WEATHER_STATION"
  | "TEMPERATURE_HUMIDITY"
  | "WATER_LEVEL"
  | "OTHER";

type Device = {
  id: number;
  name: string;
  type: DeviceType;
  location: string | null;
  active: boolean;
  createdAt: string;
};

const deviceTypes: { value: DeviceType; label: string; icon: typeof Droplets }[] = [
  { value: "SOIL_MOISTURE", label: "Soil moisture sensor", icon: Droplets },
  { value: "WEATHER_STATION", label: "Weather station", icon: Radio },
  { value: "TEMPERATURE_HUMIDITY", label: "Temperature & humidity", icon: Thermometer },
  { value: "WATER_LEVEL", label: "Water level sensor", icon: Waves },
  { value: "OTHER", label: "Other device", icon: Cpu },
];

function typeMeta(type: DeviceType) {
  return deviceTypes.find((t) => t.value === type) ?? deviceTypes[4];
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/farmer" },
  { label: "My Farms", icon: Sprout },
  { label: "Marketplace", icon: Store, href: "/farmer/marketplace" },
  { label: "Orders", icon: Package },
  { label: "IoT Devices", icon: Activity, href: "/farmer/iot", active: true },
  { label: "Messages", icon: MessageSquare },
  { label: "Settings", icon: Settings },
];

export default function FarmerIotPage() {
  const router = useRouter();
  const { user, loading } = useSession("FARMER");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [devices, setDevices] = useState<Device[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "" as DeviceType | "",
    location: "",
  });

  useEffect(() => {
    if (!user) return;

    fetch("/api/iot/devices")
      .then((res) => res.json())
      .then((data) => setDevices(data.devices ?? []))
      .catch(() => setDevices([]));
  }, [user]);

  async function handleAddDevice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!form.name || !form.type) {
      setMessage("Please name the device and choose a type.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/iot/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setDevices((list) => (list ? [data.device, ...list] : [data.device]));
      setForm({ name: "", type: "", location: "" });
      setShowForm(false);
    } catch {
      setMessage("Couldn't reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(device: Device) {
    setBusyId(device.id);
    setMessage("");

    try {
      const res = await fetch(`/api/iot/devices/${device.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !device.active }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setDevices((list) =>
        list
          ? list.map((d) => (d.id === device.id ? { ...d, active: !device.active } : d))
          : list
      );
    } catch {
      setMessage("Couldn't reach the server. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteDevice(id: number) {
    setBusyId(id);
    setMessage("");

    try {
      const res = await fetch(`/api/iot/devices/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setDevices((list) => (list ? list.filter((d) => d.id !== id) : list));
    } catch {
      setMessage("Couldn't reach the server. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
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

          {navItems.slice(0, 5).map((item) =>
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

          {navItems.slice(5).map((item) => (
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
            <input type="text" placeholder="Search your devices..." />
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
              <h1>IoT devices</h1>
              <p>Register the sensors installed on your farms.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
              <Plus size={16} />
              Add device
            </button>
          </div>

          <div className="dash-banner">
            <Radio size={16} />
            This is a device registry for now — live sensor readings aren&apos;t
            connected yet. Adding a device here reserves its record for when
            that&apos;s ready.
          </div>

          {showForm && (
            <form className="iot-add-form" onSubmit={handleAddDevice}>
              <div className="auth-field-row">
                <label className="login-field">
                  <span>Device name</span>
                  <div className="login-input">
                    <Cpu size={16} />
                    <input
                      type="text"
                      placeholder="e.g. North field sensor"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                </label>

                <label className="login-field">
                  <span>Device type</span>
                  <div className="login-input">
                    <Radio size={16} />
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, type: e.target.value as DeviceType }))
                      }
                    >
                      <option value="">Select type</option>
                      {deviceTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>

              <label className="login-field">
                <span>Location (optional)</span>
                <div className="login-input">
                  <MapPin size={16} />
                  <input
                    type="text"
                    placeholder="e.g. North field, near the well"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </div>
              </label>

              <div className="iot-form-actions">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Adding..." : "Add device"}
                </button>
              </div>
            </form>
          )}

          {message && <div className="login-message login-error verif-message">{message}</div>}

          {devices === null && (
            <div className="dash-loading-inline">Loading your devices...</div>
          )}

          {devices !== null && devices.length === 0 && (
            <div className="verif-empty">
              <Cpu size={22} />
              <h3>No devices yet</h3>
              <p>Add your first sensor to start building your device list.</p>
            </div>
          )}

          <div className="iot-grid">
            {devices?.map((d) => {
              const meta = typeMeta(d.type);
              return (
                <div className="device-card" key={d.id}>
                  <div className="device-card-top">
                    <div className={`device-card-icon ${d.active ? "device-card-icon-active" : ""}`}>
                      <meta.icon size={18} />
                    </div>
                    <span className={`listing-status ${d.active ? "listing-status-active" : "listing-status-sold_out"}`}>
                      {d.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <h3>{d.name}</h3>
                  <p className="device-card-type">{meta.label}</p>

                  {d.location && (
                    <p className="listing-quantity">
                      <MapPin size={11} />
                      {d.location}
                    </p>
                  )}

                  <div className="listing-card-actions device-card-actions">
                    <button
                      className="btn btn-light"
                      disabled={busyId === d.id}
                      onClick={() => toggleActive(d)}
                    >
                      {d.active ? (
                        <>
                          <CircleX size={14} />
                          Set inactive
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={14} />
                          Set active
                        </>
                      )}
                    </button>
                    <button
                      className="listing-delete-btn"
                      disabled={busyId === d.id}
                      onClick={() => deleteDevice(d.id)}
                      aria-label="Remove device"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
