import React from 'react';
import styles from './SearchBar.module.css';

import type { InterfaceSearchBarProps } from '../../types/shared-components/DataTable/interface';

/**
 * A controlled search input with optional clear button.
 *
 * @param props - Component props containing value, onChange, placeholder, and aria-label
 * @returns A search input element with optional clear button
 */
export function SearchBar(props: InterfaceSearchBarProps) {
  const {
    value,
    onChange,
    placeholder,
    'aria-label': ariaLabel,
    'clear-aria-label': clearAriaLabel,
  } = props;

  // Safe fallbacks for accessibility
  const inputAria = ariaLabel ?? placeholder ?? 'Search';
  const clearAria = clearAriaLabel ?? 'Clear search';

  return (
    <div className={styles.searchWrap}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={inputAria}
        className={styles.searchInput}
      />
      {value && (
        <button
          type="button"
          className={styles.searchClear}
          onClick={() => onChange('')}
          aria-label={clearAria}
        >
          ✕
        </button>
      )}
    </div>
  );
}
