import React, { useState } from "react";
import styles from "../styles/SearchBar.module.css";

/**
 * SearchBar
 * Props:
 * - onSearch(cityName) - called when user submits
 * - loading (bool) - shows disabled state
 */
export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState("");

  function submitHandler(e) {
    e.preventDefault();
    if (typeof onSearch === "function") {
      onSearch(query);
    }
  }

  return (
    <form className={styles.searchForm} onSubmit={submitHandler} role="search">
      <label htmlFor="city" className={styles.label}>
        Find city
      </label>
      <div className={styles.row}>
        <input
          id="city"
          name="city"
          className={styles.input}
          placeholder="e.g. London, New York, Mumbai"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          aria-label="City name"
        />
        <button
          type="submit"
          className={styles.button}
          disabled={loading}
          aria-disabled={loading}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>
    </form>
  );
}
