import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ErrorBox from "./components/ErrorBox";
import { getCoordinatesByName, getWeatherByCoords } from "./api";
import styles from "./styles/App.module.css";

/**
 * App - Main application component
 * - Manages app-level state: current weather, loading, errors.
 * - Coordinates fetching coordinates -> weather.
 */
export default function App() {
  const [weatherData, setWeatherData] = useState(null); // weather object from API
  const [locationName, setLocationName] = useState(""); // friendly location text
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * handleSearch - invoked when SearchBar submits a city name
   * @param {string} cityName
   */
  async function handleSearch(cityName) {
    // Reset
    setWeatherData(null);
    setLocationName("");
    setError(null);
    if (!cityName || !cityName.trim()) {
      setError({ message: "Please enter a city name." });
      return;
    }

    setLoading(true);
    try {
      // 1) Get coordinates from Open-Meteo Geocoding API
      const coordsResult = await getCoordinatesByName(cityName.trim());

      if (!coordsResult || coordsResult.length === 0) {
        setError({ message: `No results found for "${cityName}"` });
        setLoading(false);
        return;
      }

      // We'll pick the first (best) result
      const place = coordsResult[0];
      const lat = place.latitude;
      const lon = place.longitude;

      // 2) Fetch weather for coordinates
      const weather = await getWeatherByCoords(lat, lon);

      if (!weather) {
        setError({ message: "Weather data not available for that location." });
        setLoading(false);
        return;
      }

      // Save results
      setWeatherData(weather);
      setLocationName(`${place.name}${place.country ? ", " + place.country : ""}`);
    } catch (err) {
      console.error("Error in handleSearch:", err);
      setError({ message: "Network error or API error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Weather - Now</h1>
        <p className={styles.subtitle}>
          Search a city to see current weather. Uses Open-Meteo free APIs.
        </p>
      </header>

      <main className={styles.main}>
        <SearchBar onSearch={handleSearch} loading={loading} />

        {loading && (
          <div className={styles.loadingBox} role="status" aria-live="polite">
            Loading…
          </div>
        )}

        {error && <ErrorBox message={error.message} />}

        {weatherData && !error && (
          <WeatherCard data={weatherData} locationName={locationName} />
        )}
      </main>

      <footer className={styles.footer}>
        <small>
          Data provided by <a href="https://open-meteo.com" target="_blank" rel="noreferrer">Open-Meteo</a>.
        </small>
      </footer>
    </div>
  );
}
