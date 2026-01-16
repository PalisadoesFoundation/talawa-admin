import React from 'react';
import styles from './DataTable.module.css';

export function SearchBar({
    value,
    onChange,
    placeholder = 'Search…',
    'aria-label': ariaLabel = 'Search',
}: {
    value: string;
    onChange: (q: string) => void;
    placeholder?: string;
    'aria-label'?: string;
}) {
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
