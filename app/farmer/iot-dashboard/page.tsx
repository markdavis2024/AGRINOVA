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
  Cloud,
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
  Bot,
  BadgeCheck,
} from "lucide-react";

import Logo from "@/components/Logo";
import { useSession } from "@/lib/useSession";
import DashboardSidebar from "@/components/DashboardSidebar";

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
  deviceKey: string;
  farmId?: number | null;
};

type WeatherData = {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
  hourly: {
    temperature_2m: number[];
    precipitation: number[];
    relative_humidity_2m: number[];
  };
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

// Map weather code to icon and description
function getWeatherInfo(code: number): { icon: typeof Cloud; label: string; color: string } {
  if (code === 0) return { icon: Cloud, label: "Clear sky", color: "#f59e0b" };
  if (code === 1 || code === 2 || code === 3) return { icon: Cloud, label: "Partly cloudy", color: "#6b7280" };
  if (code >= 45 && code <= 48) return { icon: Cloud, label: "Foggy", color: "#9ca3af" };
  if (code >= 51 && code <= 67) return { icon: Cloud, label: "Rainy", color: "#3b82f6" };
  if (code >= 80 && code <= 82) return { icon: Cloud, label: "Rain showers", color: "#2563eb" };
  return { icon: Cloud, label: "Cloudy", color: "#6b7280" };
}

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/farmer" },
  { label: "My Farms", icon: Sprout, href: "/farmer/farms" },
  { label: "Marketplace", icon: Store, href: "/farmer/marketplace" },
  { label: "Orders", icon: Package, href: "/farmer/orders" },
  { label: "IoT Devices", icon: Activity, href: "/farmer/iot", active: true },
  { label: "IoT Dashboard", icon: Cpu, href: "/farmer/iot-dashboard" },
  { label: "Weather", icon: Cloud, href: "/weather" },
  { label: "AI Assistant", icon: Bot, href: "/ai-chat" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Settings", icon: Settings, href: "/settings" },
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

  // Weather data for weather station devices
  const [weatherData, setWeatherData] = useState<Record<number, WeatherData | null>>({});
  const [weatherLoading, setWeatherLoading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!user) return;

    fetch("/api/iot/devices")
      .then((res) => res.json())
      .then((data) => {
        const devicesList = data.devices ?? [];
        setDevices(devicesList);
        
        // Fetch weather for weather station devices
        const weatherDevices = devicesList.filter(
          (device: Device) => device.type === "WEATHER_STATION" && device.active
        );
        
        if (weatherDevices.length > 0) {
          fetchWeatherForDevices(weatherDevices);
        }
      })
      .catch(() => setDevices([]));
  }, [user]);

  // Fetch weather for all weather devices at once
  async function fetchWeatherForDevices(weatherDevices: Device[]) {
    const loadingState: Record<number, boolean> = {};
    weatherDevices.forEach((d) => {
      loadingState[d.id] = true;
    });
    setWeatherLoading(loadingState);

    try {
      const lat = 3.848;
      const lon = 11.502;
      
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      
      if (res.ok) {
        const data = await res.json();
        if (data.current_weather) {
          const weatherDataState: Record<number, WeatherData> = {};
          weatherDevices.forEach((d) => {
            weatherDataState[d.id] = data;
          });
          setWeatherData(weatherDataState);
        }
      }
    } catch (error) {
      console.error("Weather fetch error:", error);
    } finally {
      const loadingStateClear: Record<number, boolean> = {};
      weatherDevices.forEach((d) => {
        loadingStateClear[d.id] = false;
      });
      setWeatherLoading(loadingStateClear);
    }
  }

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

      // If weather station activated, fetch weather
      if (device.type === "WEATHER_STATION" && device.active) {
        setWeatherLoading(prev => ({ ...prev, [device.id]: true }));
        try {
          const lat = 3.848;
          const lon = 11.502;
          const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
          if (res.ok) {
            const data = await res.json();
            if (data.current_weather) {
              setWeatherData(prev => ({ ...prev, [device.id]: data }));
            }
          }
        } catch (error) {
          console.error("Weather fetch error:", error);
        } finally {
          setWeatherLoading(prev => ({ ...prev, [device.id]: false }));
        }
      }
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
      <DashboardSidebar
        user={user}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

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
            <div className="iot-header-actions">
              <Link href="/farmer/iot-dashboard" className="btn btn-primary">
                <Activity size={16} /> View Dashboard
              </Link>
              <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
                <Plus size={16} /> Add device
              </button>
            </div>
          </div>

          <div className="dash-banner">
            <BadgeCheck size={16} />
            This is a device registry. Add devices here, then view real-time data in the IoT Dashboard.
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
              const weather = weatherData[d.id];
              const weatherInfo = weather?.current_weather 
                ? getWeatherInfo(weather.current_weather.weathercode)
                : null;
              const isLoading = weatherLoading[d.id] || false;

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

                  {/* Weather data for weather station devices */}
                  {d.type === "WEATHER_STATION" && d.active && (
                    <div className="device-weather-data">
                      {isLoading ? (
                        <div className="device-weather-loading">Loading weather...</div>
                      ) : weather && weatherInfo ? (
                        <div className="device-weather-content">
                          <div className="device-weather-temp">
                            <span style={{ color: weatherInfo.color }}>
                              <weatherInfo.icon size={16} />
                            </span>
                            <span className="device-weather-value">
                              {Math.round(weather.current_weather.temperature)}°C
                            </span>
                          </div>
                          <div className="device-weather-detail">
                            <span>💧 {weather.hourly.relative_humidity_2m?.[0] ?? '—'}%</span>
                          </div>
                          <div className="device-weather-detail">
                            <span>💨 {Math.round(weather.current_weather.windspeed)} km/h</span>
                          </div>
                        </div>
                      ) : (
                        <div className="device-weather-error">
                          <span>Weather data unavailable</span>
                        </div>
                      )}
                    </div>
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

          <style jsx>{`
            .iot-header-actions {
              display: flex;
              gap: 10px;
              flex-wrap: wrap;
            }

            .iot-add-form {
              display: grid;
              gap: 16px;
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 18px;
              padding: 22px;
              margin-bottom: 22px;
            }

            .iot-form-actions {
              display: flex;
              justify-content: flex-end;
              gap: 10px;
            }

            .iot-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
              gap: 16px;
            }

            .device-card {
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 18px;
              padding: 20px;
              display: flex;
              flex-direction: column;
              gap: 6px;
            }

            .device-card-top {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 6px;
            }

            .device-card-icon {
              width: 38px;
              height: 38px;
              border-radius: 11px;
              display: grid;
              place-items: center;
              background: #f3f4f6;
              color: #9ca3af;
            }

            .device-card-icon-active {
              background: #ecfdf5;
              color: #059669;
            }

            .device-card h3 {
              font-size: 14px;
              font-weight: 600;
              color: #1f2937;
              margin: 0;
            }

            .device-card-type {
              font-size: 11px;
              color: #6b7280;
              margin: 0;
            }

            .device-card-actions {
              display: flex;
              gap: 8px;
              margin-top: 10px;
            }

            .device-card-actions .btn {
              flex: 1;
              justify-content: center;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              font-size: 11.5px;
            }

            .listing-delete-btn {
              flex-shrink: 0;
              width: 38px;
              border: 1px solid #e5e7eb;
              background: white;
              border-radius: 10px;
              color: #ef4444;
              display: grid;
              place-items: center;
            }

            .listing-delete-btn:hover {
              background: #fef2f2;
              border-color: #fecaca;
            }

            .device-weather-data {
              margin: 8px 0 12px 0;
              padding: 10px 12px;
              background: #f9fafb;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }

            .device-weather-loading {
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }

            .device-weather-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
              gap: 4px;
            }

            .device-weather-temp {
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .device-weather-value {
              font-weight: 600;
              font-size: 16px;
              color: #1f2937;
            }

            .device-weather-detail {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 12px;
              color: #6b7280;
            }

            .device-weather-error {
              text-align: center;
              color: #9ca3af;
              font-size: 12px;
            }

            .verif-empty {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
              padding: 60px 20px;
              text-align: center;
              color: #6b7280;
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 18px;
            }

            .verif-empty h3 {
              font-size: 14px;
              color: #1f2937;
              font-weight: 600;
              margin: 0;
            }

            .verif-empty p {
              font-size: 12px;
              margin: 0;
            }

            .dash-loading-inline {
              padding: 30px;
              text-align: center;
              color: #6b7280;
              font-size: 13px;
              font-weight: 600;
            }

            .login-message {
              padding: 11px 14px;
              border-radius: 12px;
              font-size: 12px;
              line-height: 1.6;
            }

            .login-error {
              background: #fdecec;
              color: #b3261e;
              border: 1px solid #f6c9c7;
            }

            .auth-field-row {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
            }

            .login-field {
              display: grid;
              gap: 8px;
            }

            .login-field span {
              font-size: 11.5px;
              font-weight: 700;
              color: #1f2937;
            }

            .login-input {
              display: flex;
              align-items: center;
              gap: 10px;
              padding: 0 14px;
              border-radius: 14px;
              border: 1px solid #e5e7eb;
              background: white;
              color: #9ca3af;
              transition: border-color 0.2s ease, box-shadow 0.2s ease;
            }

            .login-input:focus-within {
              border-color: #059669;
              box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.15);
            }

            .login-input input,
            .login-input select {
              flex: 1;
              border: none;
              outline: none;
              padding: 13px 0;
              font-size: 14px;
              color: #1f2937;
              background: transparent;
              font-family: inherit;
            }

            .login-input select {
              appearance: none;
              cursor: pointer;
            }

            .btn {
              border: none;
              border-radius: 100px;
              padding: 10px 20px;
              font-weight: 700;
              font-size: 14px;
              transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              gap: 8px;
            }

            .btn:hover {
              transform: translateY(-2px);
            }

            .btn-primary {
              background: #b8e62e;
              color: #1f2937;
              box-shadow: 0 10px 25px rgba(184, 230, 46, 0.25);
            }

            .btn-primary:hover {
              box-shadow: 0 15px 35px rgba(184, 230, 46, 0.35);
              background: #c5ed48;
            }

            .btn-light {
              background: rgba(255, 255, 255, 0.8);
              color: #1f2937;
              border: 1px solid #e5e7eb;
            }

            @media (max-width: 768px) {
              .auth-field-row {
                grid-template-columns: 1fr;
              }
              .iot-grid {
                grid-template-columns: 1fr;
              }
              .iot-header-actions {
                flex-direction: column;
                width: 100%;
              }
              .iot-header-actions .btn {
                width: 100%;
                justify-content: center;
              }
            }
          `}</style>
        </main>
      </div>
    </div>
  );
}