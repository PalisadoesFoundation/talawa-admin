import React from 'react';
import { InterfaceSearchToggleProps } from 'types/shared-components/DropDownButton/interface';
import styles from './SearchToggle.module.css';

/**
 * Custom Toggle for Search functionality.
 * Renders an input field that acts as a dropdown toggle.
 *
 * @param props - The props for the SearchToggle component.
 * @param ref - The ref forwarded to the div element.
 */
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
      className={`${className ?? ''} ${styles.searchToggleContainer} d-flex align-items-center border rounded p-0 bg-light`}
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
        aria-label={placeholder}
        onClick={(e) => {
          onInputClick(e);
          onClick(e);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onInputClick(e as unknown as React.MouseEvent<HTMLInputElement>);
            onClick(e as unknown as React.MouseEvent<HTMLElement>);
          }
        }}
        data-testid={`${dataTestIdPrefix}-input`}
      />
      <span className={styles.dropdownCaret}>▼</span>
    </div>
  ),
);

SearchToggle.displayName = 'SearchToggle';

export default SearchToggle;
