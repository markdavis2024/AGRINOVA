"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  CloudRain,
  CloudSun,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Sunrise,
  Sunset,
} from "lucide-react";

interface WeatherData {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
  hourly: {
    temperature_2m: number[];
  };
}

function getWeatherInfo(code: number): {
  icon: React.ReactNode;
  label: string;
  emoji: string;
} {
  if (code === 0) return {
    icon: <Sun className="w-8 h-8 text-yellow-400" />,
    label: "Clear Sky",
    emoji: "☀️"
  };
  if (code === 1 || code === 2 || code === 3) return {
    icon: <CloudSun className="w-8 h-8 text-gray-300" />,
    label: "Partly Cloudy",
    emoji: "⛅"
  };
  if (code >= 45 && code <= 48) return {
    icon: <Cloud className="w-8 h-8 text-gray-400" />,
    label: "Foggy",
    emoji: "🌫️"
  };
  if (code >= 51 && code <= 67) return {
    icon: <CloudRain className="w-8 h-8 text-blue-400" />,
    label: "Rainy",
    emoji: "🌧️"
  };
  if (code >= 80 && code <= 82) return {
    icon: <CloudRain className="w-8 h-8 text-blue-500" />,
    label: "Rain Showers",
    emoji: "🌦️"
  };
  return {
    icon: <Cloud className="w-8 h-8 text-gray-400" />,
    label: "Cloudy",
    emoji: "☁️"
  };
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/weather?lat=4&lon=12`);
        if (!response.ok) throw new Error("Failed to fetch weather");
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Weather unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="weather-skeleton">
        <div className="weather-skeleton-content">
          <div className="weather-skeleton-icon"></div>
          <div className="weather-skeleton-info">
            <div className="weather-skeleton-line weather-skeleton-line-sm"></div>
            <div className="weather-skeleton-line weather-skeleton-line-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="weather-error">
        <div className="weather-error-content">
          <Cloud className="weather-error-icon" />
          <div>
            <div className="weather-error-title">Weather</div>
            <div className="weather-error-desc">Currently unavailable</div>
          </div>
        </div>
      </div>
    );
  }

  const weatherInfo = weather.current_weather
    ? getWeatherInfo(weather.current_weather.weathercode)
    : getWeatherInfo(0);

  const hour = currentTime.getHours();
  const isDay = hour > 6 && hour < 18;
  const temp = Math.round(weather.current_weather.temperature);
  const windSpeed = Math.round(weather.current_weather.windspeed);

  const hourlyForecast = weather.hourly?.temperature_2m?.slice(0, 6) || [];

  return (
    <div className="weather-widget">
      <div className={`weather-card ${isDay ? 'weather-card-day' : 'weather-card-night'}`}>
        {/* Decorative particles */}
        <div className="weather-bg">
          <div className="weather-particles">
            <span className="weather-particle weather-particle-1">✦</span>
            <span className="weather-particle weather-particle-2">✦</span>
            <span className="weather-particle weather-particle-3">✦</span>
            <span className="weather-particle weather-particle-4">✦</span>
            <span className="weather-particle weather-particle-5">✦</span>
          </div>
        </div>

        <div className="weather-content">
          {/* Top Row */}
          <div className="weather-top">
            <div className="weather-location">
              <span className="weather-location-icon">📍</span>
              <span className="weather-location-text">Cameroon</span>
              <span className="weather-time">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="weather-status-badge">
              <span className="weather-status-dot"></span>
              Live
            </div>
          </div>

          {/* Main Weather - Centered */}
          <div className="weather-main">
            <div className="weather-left">
              <div className="weather-icon-wrapper">
                {weatherInfo.icon}
              </div>
              <div className="weather-emoji">{weatherInfo.emoji}</div>
            </div>

            <div className="weather-center">
              <div className="weather-temp">{temp}°</div>
              <div className="weather-condition">{weatherInfo.label}</div>
              <div className="weather-feels-like">
                <Thermometer className="weather-feels-icon" />
                Feels like {temp}°
              </div>
            </div>

            <div className="weather-right">
              <div className="weather-detail">
                <Wind className="weather-detail-icon" />
                <div>
                  <div className="weather-detail-value">{windSpeed} km/h</div>
                  <div className="weather-detail-label">Wind</div>
                </div>
              </div>
              <div className="weather-detail">
                <Droplets className="weather-detail-icon" />
                <div>
                  <div className="weather-detail-value">65%</div>
                  <div className="weather-detail-label">Humidity</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Sunrise/Sunset & Hourly */}
          <div className="weather-bottom">
            <div className="weather-sun-times">
              <div className="weather-sun-time">
                <Sunrise className="weather-sun-icon" />
                <div>
                  <div className="weather-sun-label">Sunrise</div>
                  <div className="weather-sun-value">06:30</div>
                </div>
              </div>
              <div className="weather-sun-time">
                <Sunset className="weather-sun-icon" />
                <div>
                  <div className="weather-sun-label">Sunset</div>
                  <div className="weather-sun-value">18:30</div>
                </div>
              </div>
            </div>

            {/* Hourly Forecast */}
            {hourlyForecast.length > 0 && (
              <div className="weather-hourly">
                <div className="weather-hourly-title">Hourly Forecast</div>
                <div className="weather-hourly-grid">
                  {hourlyForecast.map((temp, i) => {
                    const forecastHour = (hour + i) % 24;
                    const isNow = i === 0;
                    return (
                      <div
                        key={i}
                        className={`weather-hourly-item ${isNow ? 'weather-hourly-item-now' : ''}`}
                      >
                        <span className="weather-hourly-time">
                          {isNow ? 'Now' : `${forecastHour}:00`}
                        </span>
                        <span className="weather-hourly-temp">{Math.round(temp)}°</span>
                        <span className="weather-hourly-icon">
                          {forecastHour > 6 && forecastHour < 18 ? '☀️' : '🌙'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .weather-widget {
          width: 100%;
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Skeleton */
        .weather-skeleton {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
        }

        .weather-skeleton-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .weather-skeleton-icon {
          width: 3.5rem;
          height: 3.5rem;
          background: #f3f4f6;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .weather-skeleton-info {
          flex: 1;
        }

        .weather-skeleton-line {
          background: #f3f4f6;
          border-radius: 0.5rem;
          animation: pulse 1.5s ease-in-out infinite;
          height: 0.75rem;
        }
        .weather-skeleton-line-sm { width: 30%; margin-bottom: 0.5rem; }
        .weather-skeleton-line-lg { width: 50%; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Error */
        .weather-error {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid #f3f4f6;
        }

        .weather-error-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #6b7280;
        }

        .weather-error-icon {
          width: 2rem;
          height: 2rem;
          color: #9ca3af;
        }

        .weather-error-title {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .weather-error-desc {
          font-size: 0.75rem;
        }

        /* Main Card */
        .weather-card {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .weather-card-day {
          background: linear-gradient(135deg, #60a5fa 0%, #93c5fd 50%, #bfdbfe 100%);
        }

        .weather-card-night {
          background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
        }

        /* Background */
        .weather-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .weather-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .weather-particle {
          position: absolute;
          font-size: 0.5rem;
          color: rgba(255,255,255,0.15);
          animation: float 8s ease-in-out infinite;
        }

        .weather-particle-1 { top: 10%; left: 20%; animation-delay: 0s; }
        .weather-particle-2 { top: 30%; right: 15%; animation-delay: 2s; }
        .weather-particle-3 { bottom: 20%; left: 30%; animation-delay: 4s; }
        .weather-particle-4 { top: 60%; right: 30%; animation-delay: 1s; }
        .weather-particle-5 { bottom: 10%; left: 60%; animation-delay: 3s; }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.15; }
          50% { transform: translateY(-15px) rotate(180deg); opacity: 0.4; }
        }

        /* Content */
        .weather-content {
          position: relative;
          padding: 1.25rem;
          z-index: 1;
        }

        /* Top Row */
        .weather-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .weather-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255,255,255,0.9);
          font-size: 0.875rem;
        }

        .weather-location-icon {
          font-size: 0.875rem;
        }

        .weather-location-text {
          font-weight: 500;
        }

        .weather-time {
          font-size: 0.75rem;
          opacity: 0.7;
          margin-left: 0.25rem;
        }

        .weather-status-badge {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          font-size: 0.625rem;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
        }

        .weather-status-dot {
          width: 0.375rem;
          height: 0.375rem;
          background: #34d399;
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* Main Weather */
        .weather-main {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .weather-left {
          position: relative;
          flex-shrink: 0;
        }

        .weather-icon-wrapper {
          width: 4rem;
          height: 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          backdrop-filter: blur(4px);
          animation: float-icon 4s ease-in-out infinite;
        }

        @keyframes float-icon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .weather-emoji {
          position: absolute;
          top: -0.25rem;
          right: -0.25rem;
          font-size: 1.25rem;
          animation: bounce-emoji 2s ease-in-out infinite;
        }

        @keyframes bounce-emoji {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.05); }
        }

        .weather-center {
          flex: 1;
        }

        .weather-temp {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .weather-condition {
          color: rgba(255,255,255,0.9);
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 0.1rem;
        }

        .weather-feels-like {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: rgba(255,255,255,0.7);
          font-size: 0.7rem;
          margin-top: 0.1rem;
        }

        .weather-feels-icon {
          width: 0.75rem;
          height: 0.75rem;
        }

        .weather-right {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .weather-detail {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(4px);
          padding: 0.4rem 0.6rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .weather-detail-icon {
          width: 0.875rem;
          height: 0.875rem;
          color: rgba(255,255,255,0.7);
        }

        .weather-detail-value {
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          line-height: 1.2;
        }

        .weather-detail-label {
          font-size: 0.55rem;
          color: rgba(255,255,255,0.6);
        }

        /* Bottom */
        .weather-bottom {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .weather-sun-times {
          display: flex;
          gap: 1rem;
          flex-shrink: 0;
        }

        .weather-sun-time {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .weather-sun-icon {
          width: 1rem;
          height: 1rem;
          color: rgba(255,255,255,0.7);
        }

        .weather-sun-label {
          font-size: 0.55rem;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .weather-sun-value {
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
        }

        /* Hourly Forecast */
        .weather-hourly {
          flex: 1;
          min-width: 0;
        }

        .weather-hourly-title {
          font-size: 0.6rem;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.4rem;
        }

        .weather-hourly-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.25rem;
        }

        .weather-hourly-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.1rem;
          padding: 0.3rem 0.1rem;
          background: rgba(255,255,255,0.05);
          border-radius: 0.5rem;
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.2s;
        }

        .weather-hourly-item:hover {
          background: rgba(255,255,255,0.1);
        }

        .weather-hourly-item-now {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.15);
        }

        .weather-hourly-item-now .weather-hourly-temp {
          color: #fcd34d;
        }

        .weather-hourly-time {
          font-size: 0.55rem;
          color: rgba(255,255,255,0.6);
        }

        .weather-hourly-temp {
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
        }

        .weather-hourly-icon {
          font-size: 0.75rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .weather-content {
            padding: 1rem;
          }

          .weather-main {
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .weather-left {
            flex-shrink: 0;
          }

          .weather-icon-wrapper {
            width: 3.5rem;
            height: 3.5rem;
          }

          .weather-icon-wrapper svg {
            width: 1.75rem;
            height: 1.75rem;
          }

          .weather-temp {
            font-size: 2rem;
          }

          .weather-right {
            flex-direction: row;
            width: 100%;
          }

          .weather-detail {
            flex: 1;
          }

          .weather-bottom {
            flex-direction: column;
            gap: 0.75rem;
          }

          .weather-sun-times {
            width: 100%;
            justify-content: space-around;
          }

          .weather-hourly {
            width: 100%;
          }

          .weather-hourly-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }

        @media (max-width: 480px) {
          .weather-main {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .weather-right {
            flex-direction: row;
            justify-content: center;
          }

          .weather-detail {
            padding: 0.3rem 0.5rem;
          }

          .weather-detail-value {
            font-size: 0.65rem;
          }

          .weather-hourly-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .weather-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.3rem;
          }
        }
      `}</style>
    </div>
  );
}