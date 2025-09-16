/**
 * api.js
 * Helper functions to interact with Open-Meteo APIs:
 *  - Geocoding: https://geocoding-api.open-meteo.com/v1/search?name=...
 *  - Forecast: https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&current_weather=true&hourly=temperature_2m,...
 *
 * These functions return simple JS objects ready for the UI.
 */

/**
 * getCoordinatesByName - returns an array of matching places (may be empty)
 * Each place contains { name, country, latitude, longitude, ... }
 * @param {string} name
 * @returns {Promise<Array>}
 */
export async function getCoordinatesByName(name) {
  const encoded = encodeURIComponent(name);
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encoded}&count=5&language=en&format=json`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Geocoding API error: ${res.status}`);
  }
  const json = await res.json();
  return json.results || []; // array or undefined
}

/**
 * getWeatherByCoords - fetches current weather + small hourly sample for the given coords
 * Returns a normalized object for UI.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object|null>}
 */
export async function getWeatherByCoords(latitude, longitude) {
  // We request current_weather and hourly temperature + weathercode for next 12 hours.
  // timezone=auto returns datetimes localized to coordinates which simplifies display.
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(
    latitude
  )}&longitude=${encodeURIComponent(
    longitude
  )}&current_weather=true&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,weathercode,windspeed_10m&forecast_days=2&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Forecast API error: ${res.status}`);
  }

  const json = await res.json();

  if (!json || !json.current_weather) return null;

  // Build a small summary of next hours from hourly arrays
  const hourly = json.hourly || {};
  // hourly.time is an array of ISO datetimes; we will pick first 12 items.
  const times = hourly.time || [];
  const temps = hourly.temperature_2m || [];
  const weathercodes = hourly.weathercode || [];
  const winds = hourly.windspeed_10m || [];

  const hourlySample = times.slice(0, 12).map((t, i) => ({
    time: t,
    temp: temps[i],
    weathercode: weathercodes[i],
    windspeed: winds[i]
  }));

  return {
    current: json.current_weather,
    hourlySample,
    timezone: json.timezone
  };
}

/**
 * mapWeatherCodeToText - helper to convert Open-Meteo weathercode to human text.
 * For UI use only.
 */
export function mapWeatherCodeToText(code) {
  // mapping from Open-Meteo docs (simplified)
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };
  return map[code] || "Unknown";
}
