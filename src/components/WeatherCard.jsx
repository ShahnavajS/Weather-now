import React from "react";
import { mapWeatherCodeToText } from "../api";
import styles from "../styles/WeatherCard.module.css";

/**
 * WeatherCard
 * Props:
 * - data: { current: {...}, hourlySample: [...], timezone: "..." }
 * - locationName: string
 */
export default function WeatherCard({ data, locationName }) {
  const { current, hourlySample, timezone } = data;

  // Format temperature and time simply
  const temp = Math.round(current.temperature);
  const wind = Math.round(current.windspeed);

  // current_weather has fields: temperature, windspeed, winddirection, weathercode, time
  const description = mapWeatherCodeToText(current.weathercode);

  return (
    <section className={styles.card} aria-live="polite">
      <div className={styles.header}>
        <div>
          <h2 className={styles.location}>{locationName || "Location"}</h2>
          <div className={styles.timezone}>{timezone}</div>
        </div>
        <div className={styles.tempBlock}>
          <div className={styles.temp}>{temp}°C</div>
          <div className={styles.desc}>{description}</div>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <strong>Wind</strong>
          <div>{wind} km/h</div>
        </div>
        <div className={styles.detailItem}>
          <strong>Measured at</strong>
          <div>{new Date(current.time).toLocaleString()}</div>
        </div>
      </div>

      <div className={styles.hourlyTitle}>Hourly snapshot</div>
      <div className={styles.hourlyList}>
        {hourlySample.map((h) => (
          <div className={styles.hourItem} key={h.time}>
            <div className={styles.hourTime}>
              {new Date(h.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className={styles.hourTemp}>{Math.round(h.temp)}°</div>
            <div className={styles.hourCode}>{mapWeatherCodeToText(h.weathercode)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
