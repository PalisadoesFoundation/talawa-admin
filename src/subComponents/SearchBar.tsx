import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Search } from '@mui/icons-material';
import styles from './../style/app-fixed.module.css';
import type { InterfaceSimpleSearchBarProps } from 'types/SimpleSearchBar/interface';

/**
 * SearchBar component renders a search input with a button.
 * It allows users to enter a search term and triggers a callback on search.
 *
 * @param props - The properties for the SearchBar component.
 * @returns The rendered SearchBar component.
 */
const SearchBar: React.FC<InterfaceSimpleSearchBarProps> = ({
  placeholder,
  onSearch,
  onChange,
  className = styles.input,
  inputTestId,
  buttonTestId,
  buttonAriaLabel = 'Search',
  value,
  ...inputProps
}) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');

  const isControlled = value !== undefined;
  const searchTerm = isControlled ? value : internalSearchTerm;

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value;
    if (!isControlled) {
      setInternalSearchTerm(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSearchClick = (): void => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleSearchByEnter = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === 'Enter' && onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className={`mb-1 ${className}`}>
      <Form.Control
        type="text"
        value={searchTerm}
        className={styles.inputField}
        autoComplete="off"
        placeholder={placeholder || 'Search...'}
        onChange={handleSearchChange}
        onKeyUp={handleSearchByEnter}
        data-testid={inputTestId}
        {...inputProps}
      />
      <Button
        tabIndex={-1}
        className={` ${styles.searchButton} `}
        onClick={handleSearchClick}
        data-testid={buttonTestId}
        aria-label={buttonAriaLabel}
      >
        <Search className={styles.searchIcon} />
      </Button>
    </div>
  );
};

export default SearchBar;
