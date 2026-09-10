import { notificationService } from './notificationService';

export class WeatherService {
  private static instance: WeatherService;
  private interval: NodeJS.Timeout | null = null;
  private isRunning = false;

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  startMonitoring() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Check weather every 2 hours
    this.interval = setInterval(() => {
      this.checkWeatherAlerts();
    }, 2 * 60 * 60 * 1000);

    // Initial check after 30 seconds
    setTimeout(() => {
      this.checkWeatherAlerts();
    }, 30000);
  }

  stopMonitoring() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
  }

  private async checkWeatherAlerts() {
    try {
      const response = await fetch('/api/weather?lat=4&lon=12');
      if (!response.ok) return;
      const data = await response.json();

      const temp = data.current_weather?.temperature || 0;
      const weatherCode = data.current_weather?.weathercode || 0;

      // Temperature alerts
      if (temp > 35) {
        notificationService.triggerEvent({
          type: 'WEATHER_ALERT',
          data: { message: 'Extreme heat warning! Temperatures above 35°C. Protect your crops.' }
        });
      } else if (temp < 15) {
        notificationService.triggerEvent({
          type: 'WEATHER_ALERT',
          data: { message: 'Cold alert! Temperatures below 15°C. Protect sensitive crops from frost.' }
        });
      } else if (temp >= 20 && temp <= 28) {
        // Good weather notification once a day
        const lastNotif = localStorage.getItem('last_good_weather_notif');
        const now = Date.now();
        if (!lastNotif || now - parseInt(lastNotif) > 24 * 60 * 60 * 1000) {
          notificationService.triggerEvent({
            type: 'WEATHER_FORECAST',
            data: { message: `Perfect farming weather! ${Math.round(temp)}°C with optimal conditions.` }
          });
          localStorage.setItem('last_good_weather_notif', now.toString());
        }
      }

      // Rain alerts
      if (weatherCode >= 51 && weatherCode <= 67) {
        notificationService.triggerEvent({
          type: 'WEATHER_ALERT',
          data: { message: 'Rain expected. Ensure proper drainage and check crop protection.' }
        });
      }

      // Clear sky alert - good for farming activities
      if (weatherCode === 0 && temp > 20 && temp < 30) {
        const lastNotif = localStorage.getItem('last_clear_sky_notif');
        const now = Date.now();
        if (!lastNotif || now - parseInt(lastNotif) > 12 * 60 * 60 * 1000) {
          notificationService.triggerEvent({
            type: 'WEATHER_FORECAST',
            data: { message: 'Clear skies expected. Great day for field activities and harvesting!' }
          });
          localStorage.setItem('last_clear_sky_notif', now.toString());
        }
      }

    } catch (error) {
      console.error('Weather check error:', error);
    }
  }

  // Send a manual weather forecast notification
  sendForecast(forecast: any) {
    notificationService.triggerEvent({
      type: 'WEATHER_FORECAST',
      data: { message: `Weather forecast: ${forecast.summary || 'Check the weather dashboard for details.'}` }
    });
  }
}

export const weatherService = WeatherService.getInstance();