"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Layout,
  LogOut,
  Menu,
  Search,
  Cloud,
  CloudRain,
  CloudSun,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Sunrise,
  Sunset,
  Eye,
  Gauge,
  Calendar,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  X,
  Clock,
  MapPin,
  Navigation,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { useSession } from "@/lib/useSession";
import DashboardSidebar from "@/components/DashboardSidebar";

interface WeatherData {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
  hourly: {
    temperature_2m: number[];
    relative_humidity_2m: number[];
    weathercode: number[];
  };
  daily?: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

function getWeatherInfo(code: number): {
  icon: React.ReactNode;
  label: string;
  description: string;
  bg: string;
} {
  if (code === 0) return {
    icon: <Sun className="w-12 h-12 text-yellow-400" />,
    label: "Clear Sky",
    description: "Perfect weather for farming activities",
    bg: "from-blue-400 to-blue-300"
  };
  if (code === 1 || code === 2 || code === 3) return {
    icon: <CloudSun className="w-12 h-12 text-gray-300" />,
    label: "Partly Cloudy",
    description: "Good conditions with some cloud cover",
    bg: "from-blue-300 to-gray-300"
  };
  if (code >= 45 && code <= 48) return {
    icon: <Cloud className="w-12 h-12 text-gray-400" />,
    label: "Foggy",
    description: "Reduced visibility, take care",
    bg: "from-gray-400 to-gray-300"
  };
  if (code >= 51 && code <= 67) return {
    icon: <CloudRain className="w-12 h-12 text-blue-400" />,
    label: "Rainy",
    description: "Good for crops, but monitor waterlogging",
    bg: "from-blue-500 to-blue-400"
  };
  if (code >= 80 && code <= 82) return {
    icon: <CloudRain className="w-12 h-12 text-blue-500" />,
    label: "Rain Showers",
    description: "Intermittent rain, good for planting",
    bg: "from-blue-600 to-blue-500"
  };
  return {
    icon: <Cloud className="w-12 h-12 text-gray-400" />,
    label: "Cloudy",
    description: "Overcast conditions",
    bg: "from-gray-400 to-gray-300"
  };
}

export default function WeatherDashboard() {
  const router = useRouter();
  const { user, loading } = useSession("FARMER");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(0);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Rain Alert",
      message: "Heavy rainfall expected in your area tomorrow. Ensure proper drainage.",
      time: "2 hours ago",
      read: false,
      type: "warning",
      icon: <CloudRain className="w-5 h-5 text-blue-500" />
    },
    {
      id: 2,
      title: "Optimal Planting Conditions",
      message: "The next 3 days are ideal for planting maize. Soil moisture is optimal.",
      time: "5 hours ago",
      read: false,
      type: "success",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    {
      id: 3,
      title: "Weather Advisory",
      message: "Temperatures are expected to rise next week. Plan irrigation accordingly.",
      time: "1 day ago",
      read: true,
      type: "info",
      icon: <Sun className="w-5 h-5 text-yellow-500" />
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoadingWeather(true);
        setError(null);
        const response = await fetch(`/api/weather?lat=4&lon=12`);
        if (!response.ok) throw new Error("Failed to fetch weather");
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Weather data unavailable");
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading || !user) {
    return <div className="dash-loading">Loading weather dashboard...</div>;
  }

  const initial = user.name.charAt(0).toUpperCase();
  const firstName = user.name.split(" ")[0];
  const weatherInfo = weather?.current_weather
    ? getWeatherInfo(weather.current_weather.weathercode)
    : getWeatherInfo(0);

  const hour = currentTime.getHours();
  const isDay = hour > 6 && hour < 18;
  const temp = weather?.current_weather ? Math.round(weather.current_weather.temperature) : 28;
  const windSpeed = weather?.current_weather ? Math.round(weather.current_weather.windspeed) : 10;

  const hourlyForecast = weather?.hourly?.temperature_2m?.slice(0, 12) || [];
  const hourlyHumidity = weather?.hourly?.relative_humidity_2m?.slice(0, 12) || [];

  // Generate 7-day forecast if not available
  const dailyForecast = weather?.daily || {
    time: Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    }),
    weathercode: [1, 3, 0, 2, 1, 3, 0],
    temperature_2m_max: [30, 31, 29, 32, 30, 28, 29],
    temperature_2m_min: [22, 23, 21, 24, 22, 21, 22]
  };

  const farmingTips = [
    { icon: "🌱", tip: "Optimal soil temperature for planting", value: "18-25°C", good: true },
    { icon: "💧", tip: "Soil moisture level", value: "65%", good: true },
    { icon: "☀️", tip: "UV Index", value: "6 (High)", good: false },
    { icon: "🌾", tip: "Best crop for current conditions", value: "Maize, Cassava", good: true },
  ];

  return (
    <div className="dash-page">
      <DashboardSidebar
        user={user}
        onLogout={() => {}}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dash-main">
        <header className="dash-topbar">
          <button className="dash-menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          <div className="dash-search">
            <Search size={16} />
            <input type="text" placeholder="Search weather, locations..." />
          </div>

          <div className="dash-topbar-actions">
            <div className="dash-notifications-wrapper">
              <button 
                className="dash-icon-btn" 
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="dash-dot">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="dash-notifications-dropdown">
                  <div className="dash-notifications-header">
                    <h3>Notifications</h3>
                    <div className="dash-notifications-actions">
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="dash-notif-btn">
                          Mark all read
                        </button>
                      )}
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="dash-notif-close"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="dash-notifications-list">
                    {notifications.length === 0 ? (
                      <div className="dash-notifications-empty">
                        <Bell size={32} />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`dash-notification-item ${!notif.read ? 'dash-notification-unread' : ''}`}
                        >
                          <div className={`dash-notification-icon dash-notification-${notif.type}`}>
                            {notif.icon}
                          </div>
                          <div className="dash-notification-content">
                            <div className="dash-notification-title">{notif.title}</div>
                            <div className="dash-notification-message">{notif.message}</div>
                            <div className="dash-notification-time">{notif.time}</div>
                          </div>
                          <div className="dash-notification-actions">
                            {!notif.read && (
                              <button onClick={() => markAsRead(notif.id)} className="dash-notif-mark-read">
                                ✓
                              </button>
                            )}
                            <button onClick={() => deleteNotification(notif.id)} className="dash-notif-delete">
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="dash-profile">
              <button className="dash-profile-btn" onClick={() => setProfileOpen((v) => !v)}>
                <div className="dash-avatar dash-avatar-small">{initial}</div>
                <span>{firstName}</span>
                <ChevronDown size={14} />
              </button>

              {profileOpen && (
                <div className="dash-profile-menu">
                  <Link href="/" className="dash-profile-menu-item">
                    <Layout size={14} /> Back to landing page
                  </Link>
                  <button className="dash-profile-menu-item" onClick={() => router.push("/login")}>
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="dash-content weather-dashboard-content">
          {/* Current Weather Section */}
          <div className="weather-dashboard-grid">
            <div className={`weather-main-card ${isDay ? 'weather-main-day' : 'weather-main-night'}`}>
              <div className="weather-main-bg">
                <div className="weather-main-particles">
                  <span className="weather-main-particle">✦</span>
                  <span className="weather-main-particle">✦</span>
                  <span className="weather-main-particle">✦</span>
                  <span className="weather-main-particle">✦</span>
                  <span className="weather-main-particle">✦</span>
                </div>
              </div>
              <div className="weather-main-content">
                <div className="weather-main-location">
                  <MapPin className="weather-main-location-icon" />
                  <span>Yaoundé, Cameroon</span>
                  <span className="weather-main-time">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="weather-main-display">
                  <div className="weather-main-icon-wrapper">
                    {weatherInfo.icon}
                    <div className="weather-main-emoji">{getWeatherInfo(weather.current_weather?.weathercode || 0).label}</div>
                  </div>
                  <div className="weather-main-temp">{temp}°C</div>
                  <div className="weather-main-condition">{weatherInfo.label}</div>
                  <div className="weather-main-desc">{weatherInfo.description}</div>
                </div>
                <div className="weather-main-details">
                  <div className="weather-main-detail">
                    <Thermometer className="weather-main-detail-icon" />
                    <div>
                      <div className="weather-main-detail-value">{temp}°C</div>
                      <div className="weather-main-detail-label">Temperature</div>
                    </div>
                  </div>
                  <div className="weather-main-detail">
                    <Wind className="weather-main-detail-icon" />
                    <div>
                      <div className="weather-main-detail-value">{windSpeed} km/h</div>
                      <div className="weather-main-detail-label">Wind Speed</div>
                    </div>
                  </div>
                  <div className="weather-main-detail">
                    <Droplets className="weather-main-detail-icon" />
                    <div>
                      <div className="weather-main-detail-value">65%</div>
                      <div className="weather-main-detail-label">Humidity</div>
                    </div>
                  </div>
                  <div className="weather-main-detail">
                    <Eye className="weather-main-detail-icon" />
                    <div>
                      <div className="weather-main-detail-value">10 km</div>
                      <div className="weather-main-detail-label">Visibility</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Stats Cards */}
            <div className="weather-stats-grid">
              <div className="weather-stat-card">
                <div className="weather-stat-icon stat-sunrise">
                  <Sunrise className="w-6 h-6" />
                </div>
                <div className="weather-stat-info">
                  <span className="weather-stat-label">Sunrise</span>
                  <span className="weather-stat-value">06:30</span>
                </div>
              </div>
              <div className="weather-stat-card">
                <div className="weather-stat-icon stat-sunset">
                  <Sunset className="w-6 h-6" />
                </div>
                <div className="weather-stat-info">
                  <span className="weather-stat-label">Sunset</span>
                  <span className="weather-stat-value">18:30</span>
                </div>
              </div>
              <div className="weather-stat-card">
                <div className="weather-stat-icon stat-pressure">
                  <Gauge className="w-6 h-6" />
                </div>
                <div className="weather-stat-info">
                  <span className="weather-stat-label">Pressure</span>
                  <span className="weather-stat-value">1013 hPa</span>
                </div>
              </div>
              <div className="weather-stat-card">
                <div className="weather-stat-icon stat-uv">
                  <Sun className="w-6 h-6" />
                </div>
                <div className="weather-stat-info">
                  <span className="weather-stat-label">UV Index</span>
                  <span className="weather-stat-value">6 (High)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Forecast */}
          <div className="weather-hourly-section">
            <div className="weather-hourly-header">
              <h3>Hourly Forecast</h3>
              <span className="weather-hourly-label">Next 12 hours</span>
            </div>
            <div className="weather-hourly-scroll">
              {hourlyForecast.map((temp, i) => {
                const forecastHour = (hour + i) % 24;
                const isNow = i === 0;
                const humidity = hourlyHumidity[i] || 60;
                const weatherCode = weather?.hourly?.weathercode?.[i] || 1;
                const icon = getWeatherInfo(weatherCode).icon;
                return (
                  <div 
                    key={i} 
                    className={`weather-hourly-card ${isNow ? 'weather-hourly-now' : ''}`}
                  >
                    <span className="weather-hourly-time">
                      {isNow ? 'Now' : `${forecastHour}:00`}
                    </span>
                    <div className="weather-hourly-icon-wrap">{icon}</div>
                    <span className="weather-hourly-temp">{Math.round(temp)}°C</span>
                    <span className="weather-hourly-humidity">
                      <Droplets className="weather-hourly-humidity-icon" />
                      {Math.round(humidity)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="weather-daily-section">
            <div className="weather-daily-header">
              <h3>7-Day Forecast</h3>
              <Calendar className="weather-daily-icon" />
            </div>
            <div className="weather-daily-grid">
              {dailyForecast.time.map((date, i) => {
                const day = new Date(date);
                const dayName = i === 0 ? 'Today' : day.toLocaleDateString('en', { weekday: 'short' });
                const maxTemp = dailyForecast.temperature_2m_max[i];
                const minTemp = dailyForecast.temperature_2m_min[i];
                const weatherCode = dailyForecast.weathercode[i];
                const icon = getWeatherInfo(weatherCode).icon;
                const isSelected = selectedDay === i;
                return (
                  <div 
                    key={i}
                    className={`weather-daily-card ${isSelected ? 'weather-daily-selected' : ''}`}
                    onClick={() => setSelectedDay(i)}
                  >
                    <span className="weather-daily-day">{dayName}</span>
                    <div className="weather-daily-icon-wrap">{icon}</div>
                    <div className="weather-daily-temps">
                      <span className="weather-daily-max">{Math.round(maxTemp)}°</span>
                      <span className="weather-daily-min">{Math.round(minTemp)}°</span>
                    </div>
                    <div className="weather-daily-bar">
                      <div 
                        className="weather-daily-bar-fill" 
                        style={{ width: `${((maxTemp - minTemp) / 15) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Farming Tips */}
          <div className="weather-tips-section">
            <h3>🌾 Farming Insights</h3>
            <div className="weather-tips-grid">
              {farmingTips.map((tip, i) => (
                <div key={i} className={`weather-tip-card ${tip.good ? 'weather-tip-good' : 'weather-tip-warning'}`}>
                  <div className="weather-tip-icon">{tip.icon}</div>
                  <div className="weather-tip-content">
                    <div className="weather-tip-label">{tip.tip}</div>
                    <div className="weather-tip-value">{tip.value}</div>
                  </div>
                  {tip.good ? (
                    <CheckCircle className="weather-tip-status weather-tip-status-good" />
                  ) : (
                    <AlertTriangle className="weather-tip-status weather-tip-status-warning" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Map/Region Info */}
          <div className="weather-region-section">
            <div className="weather-region-card">
              <div className="weather-region-header">
                <Navigation className="weather-region-icon" />
                <div>
                  <h4>Your Region</h4>
                  <p>Centre Region, Cameroon</p>
                </div>
              </div>
              <div className="weather-region-details">
                <div className="weather-region-stat">
                  <span>Elevation</span>
                  <strong>750m</strong>
                </div>
                <div className="weather-region-stat">
                  <span>Climate Zone</span>
                  <strong>Humid Tropical</strong>
                </div>
                <div className="weather-region-stat">
                  <span>Rainy Season</span>
                  <strong>March-November</strong>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        /* Weather Dashboard Styles */
        .weather-dashboard-content {
          padding: 1.5rem;
        }

        .weather-dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        /* Main Weather Card */
        .weather-main-card {
          border-radius: 1.5rem;
          overflow: hidden;
          position: relative;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .weather-main-day {
          background: linear-gradient(135deg, #60a5fa 0%, #93c5fd 50%, #bfdbfe 100%);
        }

        .weather-main-night {
          background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
        }

        .weather-main-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .weather-main-particles {
          position: absolute;
          inset: 0;
        }

        .weather-main-particle {
          position: absolute;
          font-size: 0.5rem;
          color: rgba(255,255,255,0.15);
          animation: float-particle 8s ease-in-out infinite;
        }

        .weather-main-particle:nth-child(1) { top: 10%; left: 20%; animation-delay: 0s; }
        .weather-main-particle:nth-child(2) { top: 30%; right: 15%; animation-delay: 2s; }
        .weather-main-particle:nth-child(3) { bottom: 20%; left: 30%; animation-delay: 4s; }
        .weather-main-particle:nth-child(4) { top: 60%; right: 30%; animation-delay: 1s; }
        .weather-main-particle:nth-child(5) { bottom: 10%; left: 60%; animation-delay: 3s; }

        @keyframes float-particle {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.15; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.4; }
        }

        .weather-main-content {
          position: relative;
          padding: 1.5rem;
          z-index: 1;
          color: white;
        }

        .weather-main-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          opacity: 0.9;
          margin-bottom: 1rem;
        }

        .weather-main-location-icon {
          width: 1rem;
          height: 1rem;
        }

        .weather-main-time {
          margin-left: auto;
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .weather-main-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .weather-main-icon-wrapper {
          position: relative;
          margin-bottom: 0.5rem;
        }

        .weather-main-emoji {
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .weather-main-temp {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .weather-main-condition {
          font-size: 1.125rem;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .weather-main-desc {
          font-size: 0.875rem;
          opacity: 0.8;
          margin-top: 0.25rem;
        }

        .weather-main-details {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }

        .weather-main-detail {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.08);
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .weather-main-detail-icon {
          width: 1.25rem;
          height: 1.25rem;
          opacity: 0.8;
        }

        .weather-main-detail-value {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .weather-main-detail-label {
          font-size: 0.6rem;
          opacity: 0.7;
        }

        /* Stats Grid */
        .weather-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .weather-stat-card {
          background: white;
          border-radius: 1rem;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: all 0.2s;
        }

        .weather-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .weather-stat-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-sunrise { background: #fef3c7; color: #f59e0b; }
        .stat-sunset { background: #fef3c7; color: #f59e0b; }
        .stat-pressure { background: #dbeafe; color: #3b82f6; }
        .stat-uv { background: #fef3c7; color: #f59e0b; }

        .weather-stat-info {
          display: flex;
          flex-direction: column;
        }

        .weather-stat-label {
          font-size: 0.625rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .weather-stat-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
        }

        /* Hourly Forecast */
        .weather-hourly-section {
          background: white;
          border-radius: 1.5rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .weather-hourly-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .weather-hourly-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .weather-hourly-label {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .weather-hourly-scroll {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .weather-hourly-scroll::-webkit-scrollbar {
          height: 0.25rem;
        }

        .weather-hourly-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 9999px;
        }

        .weather-hourly-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          background: #f9fafb;
          border-radius: 0.75rem;
          min-width: 4rem;
          border: 1px solid #f3f4f6;
          transition: all 0.2s;
        }

        .weather-hourly-card:hover {
          background: #f3f4f6;
          transform: translateY(-2px);
        }

        .weather-hourly-now {
          background: #ecfdf5;
          border-color: #10a37f;
        }

        .weather-hourly-now .weather-hourly-temp {
          color: #10a37f;
        }

        .weather-hourly-time {
          font-size: 0.6rem;
          color: #6b7280;
        }

        .weather-hourly-icon-wrap {
          font-size: 1.25rem;
        }

        .weather-hourly-temp {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
        }

        .weather-hourly-humidity {
          display: flex;
          align-items: center;
          gap: 0.125rem;
          font-size: 0.55rem;
          color: #6b7280;
        }

        .weather-hourly-humidity-icon {
          width: 0.625rem;
          height: 0.625rem;
        }

        /* Daily Forecast */
        .weather-daily-section {
          background: white;
          border-radius: 1.5rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .weather-daily-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .weather-daily-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .weather-daily-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #6b7280;
        }

        .weather-daily-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
        }

        .weather-daily-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem;
          background: #f9fafb;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .weather-daily-card:hover {
          background: #f3f4f6;
        }

        .weather-daily-selected {
          border-color: #10a37f;
          background: #ecfdf5;
        }

        .weather-daily-day {
          font-size: 0.625rem;
          font-weight: 500;
          color: #6b7280;
        }

        .weather-daily-icon-wrap {
          font-size: 1.25rem;
        }

        .weather-daily-temps {
          display: flex;
          gap: 0.25rem;
          font-size: 0.75rem;
        }

        .weather-daily-max {
          font-weight: 600;
          color: #1f2937;
        }

        .weather-daily-min {
          color: #6b7280;
        }

        .weather-daily-bar {
          width: 100%;
          height: 0.25rem;
          background: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
        }

        .weather-daily-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #10a37f, #34d399);
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        /* Farming Tips */
        .weather-tips-section {
          background: white;
          border-radius: 1.5rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .weather-tips-section h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .weather-tips-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }

        .weather-tip-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .weather-tip-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .weather-tip-good {
          border-left: 3px solid #10a37f;
        }

        .weather-tip-warning {
          border-left: 3px solid #f59e0b;
        }

        .weather-tip-icon {
          font-size: 1.25rem;
        }

        .weather-tip-content {
          flex: 1;
        }

        .weather-tip-label {
          font-size: 0.7rem;
          color: #6b7280;
        }

        .weather-tip-value {
          font-size: 0.75rem;
          font-weight: 600;
          color: #1f2937;
        }

        .weather-tip-status {
          width: 1rem;
          height: 1rem;
        }

        .weather-tip-status-good {
          color: #10a37f;
        }

        .weather-tip-status-warning {
          color: #f59e0b;
        }

        /* Region Info */
        .weather-region-section {
          margin-bottom: 1.5rem;
        }

        .weather-region-card {
          background: white;
          border-radius: 1.5rem;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .weather-region-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .weather-region-header h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
        }

        .weather-region-header p {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .weather-region-icon {
          width: 2rem;
          height: 2rem;
          color: #10a37f;
          background: #ecfdf5;
          padding: 0.375rem;
          border-radius: 0.5rem;
        }

        .weather-region-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .weather-region-stat {
          display: flex;
          flex-direction: column;
        }

        .weather-region-stat span {
          font-size: 0.6rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .weather-region-stat strong {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
        }

        /* Notifications Dropdown */
        .dash-notifications-wrapper {
          position: relative;
        }

        .dash-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: white;
          font-size: 0.5rem;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dash-notifications-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 24rem;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          border: 1px solid #e5e7eb;
          z-index: 100;
          margin-top: 0.5rem;
          max-height: 28rem;
          display: flex;
          flex-direction: column;
        }

        .dash-notifications-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .dash-notifications-header h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
        }

        .dash-notifications-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dash-notif-btn {
          font-size: 0.625rem;
          color: #10a37f;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
        }

        .dash-notif-btn:hover {
          background: #ecfdf5;
        }

        .dash-notif-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 0.125rem;
          border-radius: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dash-notif-close:hover {
          background: #f3f4f6;
        }

        .dash-notifications-list {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .dash-notifications-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 2rem 0;
          color: #9ca3af;
        }

        .dash-notifications-empty p {
          font-size: 0.875rem;
        }

        .dash-notification-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          transition: background 0.2s;
          border-bottom: 1px solid #f9fafb;
        }

        .dash-notification-item:hover {
          background: #f9fafb;
        }

        .dash-notification-unread {
          background: #f0f9f6;
        }

        .dash-notification-unread:hover {
          background: #ecfdf5;
        }

        .dash-notification-icon {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dash-notification-warning {
          background: #fef3c7;
        }

        .dash-notification-success {
          background: #d1fae5;
        }

        .dash-notification-info {
          background: #dbeafe;
        }

        .dash-notification-content {
          flex: 1;
        }

        .dash-notification-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #1f2937;
        }

        .dash-notification-message {
          font-size: 0.7rem;
          color: #6b7280;
          margin-top: 0.125rem;
        }

        .dash-notification-time {
          font-size: 0.55rem;
          color: #9ca3af;
          margin-top: 0.125rem;
        }

        .dash-notification-actions {
          display: flex;
          align-items: flex-start;
          gap: 0.25rem;
        }

        .dash-notif-mark-read {
          background: none;
          border: none;
          color: #10a37f;
          font-size: 0.75rem;
          cursor: pointer;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }

        .dash-notif-mark-read:hover {
          background: #ecfdf5;
        }

        .dash-notif-delete {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 0.125rem;
          border-radius: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dash-notif-delete:hover {
          background: #fef2f2;
          color: #ef4444;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .weather-dashboard-grid {
            grid-template-columns: 1fr;
          }

          .weather-stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .weather-daily-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .weather-tips-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .weather-dashboard-content {
            padding: 1rem;
          }

          .weather-main-details {
            grid-template-columns: repeat(2, 1fr);
          }

          .weather-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .weather-daily-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .weather-tips-grid {
            grid-template-columns: 1fr;
          }

          .weather-region-details {
            grid-template-columns: 1fr;
          }

          .weather-main-temp {
            font-size: 2.5rem;
          }

          .dash-notifications-dropdown {
            width: 20rem;
            right: -4rem;
          }
        }

        @media (max-width: 480px) {
          .weather-dashboard-grid {
            grid-template-columns: 1fr;
          }

          .weather-stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .weather-daily-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .weather-hourly-scroll {
            gap: 0.25rem;
          }

          .weather-hourly-card {
            min-width: 3rem;
            padding: 0.375rem 0.5rem;
          }

          .weather-main-details {
            grid-template-columns: 1fr 1fr;
          }

          .weather-main-content {
            padding: 1rem;
          }

          .dash-notifications-dropdown {
            width: 18rem;
            right: -6rem;
          }
        }
      `}</style>
    </div>
  );
}