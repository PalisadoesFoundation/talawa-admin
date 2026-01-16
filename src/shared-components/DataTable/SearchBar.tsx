import React from 'react';
import styles from './DataTable.module.css';

import type { ISearchBarProps } from '../../types/shared-components/DataTable/interface';

/**
 * A controlled search input with optional clear button.
 *
 * @param props - Component props
 * @param props.value - Current search query value
 * @param props.onChange - Callback fired when input value changes
 * @param props.placeholder - Placeholder text (default: 'Search…')
 * @param props['aria-label'] - Accessible label for screen readers (default: 'Search')
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
