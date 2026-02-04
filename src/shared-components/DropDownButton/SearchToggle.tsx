import React from 'react';
import styles from './SearchToggle.module.css';

interface InterfaceSearchToggleProps {
  onClick: (e: React.MouseEvent) => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputClick: (e: React.MouseEvent) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  dataTestIdPrefix: string;
  className?: string;
}

// Custom Toggle for Search functionality
const SearchToggle = React.forwardRef<
  HTMLDivElement,
  InterfaceSearchToggleProps
>(
  (
    {
      onClick,
      value,
      onChange,
      onInputClick,
      placeholder,
      icon,
      dataTestIdPrefix,
      className,
    },
    ref,
  ) => (
    <div
      className={`${className} ${styles.searchToggleContainer} d-flex align-items-center bg-white border rounded p-0`}
      ref={ref}
    >
      {icon && (
        <span
          className={styles.dropdownIcon}
          data-testid={`${dataTestIdPrefix}-icon`}
        >
          {icon}
        </span>
      )}
      <input
        type="text"
        className={`form-control border-0 shadow-none ${styles.searchToggleInput}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={(e) => {
          onInputClick(e);
          onClick(e);
        }}
        data-testid={`${dataTestIdPrefix}-input`}
      />
      <span className={styles.dropdownCaret}>▼</span>
    </div>
  ),
);

SearchToggle.displayName = 'SearchToggle';

export default SearchToggle;
