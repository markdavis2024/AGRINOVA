import { NextResponse } from "next/server";

// Cache with longer duration
let weatherCache: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes (increased from 5)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat") || "3.848";
    const lon = searchParams.get("lon") || "11.502";

    // Return cached data immediately if available and fresh
    if (weatherCache && Date.now() - weatherCache.timestamp < CACHE_DURATION) {
      console.log("✅ Weather from cache");
      return NextResponse.json(weatherCache.data, {
        headers: {
          "Cache-Control": "public, max-age=900",
        },
      });
    }

    console.log("🌤️ Fetching fresh weather...");

    // Use a simpler API call with shorter timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${lat}&longitude=${lon}&` +
        `current_weather=true&` +
        `hourly=temperature_2m&` +
        `timezone=Africa/Douala&` +
        `forecast_days=1`,
        {
          headers: {
            'User-Agent': 'AGRINOVA-App/1.0',
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Store in cache
      weatherCache = {
        data,
        timestamp: Date.now(),
      };

      return NextResponse.json(data, {
        headers: {
          "Cache-Control": "public, max-age=900",
        },
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("Weather fetch error:", fetchError);
      
      // Return cached data even if expired
      if (weatherCache) {
        console.log("⚠️ Using stale cached weather data");
        return NextResponse.json(weatherCache.data, {
          headers: {
            "Cache-Control": "public, max-age=60",
          },
        });
      }

      // Return fast fallback data
      return NextResponse.json(getFastFallbackWeather(), {
        headers: {
          "Cache-Control": "public, max-age=60",
        },
      });
    }

  } catch (error) {
    console.error("Weather API error:", error);
    
    // Return fast fallback data
    return NextResponse.json(getFastFallbackWeather(), {
      headers: {
        "Cache-Control": "public, max-age=60",
      },
    });
  }
}

// Fast fallback weather data
function getFastFallbackWeather() {
  const now = new Date();
  const hour = now.getHours();
  const isDay = hour > 6 && hour < 18;
  
  return {
    current_weather: {
      temperature: isDay ? 28 : 22,
      windspeed: 10,
      weathercode: isDay ? 1 : 3,
    },
    hourly: {
      temperature_2m: Array(24).fill(null).map((_, i) => {
        const h = (hour + i) % 24;
        return h > 6 && h < 18 ? 28 : 22;
      }),
    },
  };
}