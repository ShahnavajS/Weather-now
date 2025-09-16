import React from "react";
import styles from "../styles/WeatherCard.module.css";

/**
 * ErrorBox - simple error display reuse styles from WeatherCard.module.css
 * Props:
 * - message: string
 */
export default function ErrorBox({ message }) {
  return (
    <div className={styles.errorBox} role="alert" aria-live="assertive">
      <strong>Error:</strong> {message}
    </div>
  );
}
