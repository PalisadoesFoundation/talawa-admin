import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import { Search } from '@mui/icons-material';
import styles from './../style/app-fixed.module.css';

interface InterfaceSearchBarProps {
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Function to handle search input change */
  onSearch: (searchTerm: string) => void;
  /** Optional function to handle input change (for automatic search) */
  onChange?: (searchTerm: string) => void;
  /** Optional custom class name for the search bar container */
  className?: string;
  /** Custom data-testid for the search input */
  inputTestId?: string;
  /** Custom data-testid for the search button */
  buttonTestId?: string;
}

/**
 * SearchBar component renders a search input with a button.
 * It allows users to enter a search term and triggers a callback on search.
 *
 * @param props - The properties for the SearchBar component.
 * @returns The rendered SearchBar component.
 */
const SearchBar: React.FC<InterfaceSearchBarProps> = ({
  placeholder,
  onSearch,
  onChange,
  className = styles.input, // Default className
  inputTestId,
  buttonTestId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setSearchTerm(value);
    // Call onChange for automatic search if provided
    if (onChange) {
      onChange(value);
    }
  };

  const handleSearchClick = (): void => {
    onSearch(searchTerm);
  };

  const handleSearchByEnter = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === 'Enter') {
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
        required
        placeholder={placeholder || 'Search...'}
        onChange={handleSearchChange}
        onKeyUp={handleSearchByEnter}
        data-testid={inputTestId}
      />
      <Button
        tabIndex={-1}
        className={` ${styles.searchButton} `}
        onClick={handleSearchClick}
        data-testid={buttonTestId}
      >
        <Search className={styles.searchIcon} />
      </Button>
    </div>
  );
};

export default SearchBar;
