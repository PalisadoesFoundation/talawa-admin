import React from 'react';
import styles from './DataTable.module.css';

import type { ISearchBarProps } from '../../types/shared-components/DataTable/interface';

/**
 * A controlled search input with optional clear button.
 *
 * @param props - Component props containing value, onChange, placeholder, and aria-label
 * @returns A search input element with optional clear button
 */
export function SearchBar(props: ISearchBarProps) {
  const {
    value,
    onChange,
    placeholder = 'Search…',
    'aria-label': ariaLabel = 'Search',
  } = props;
  return (
    <div className={styles.searchWrap}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={styles.searchInput}
      />
      {value && (
        <button
          type="button"
          className={styles.searchClear}
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
