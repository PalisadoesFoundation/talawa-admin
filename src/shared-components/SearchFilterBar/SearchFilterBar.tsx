import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { debounce } from 'utils/performance';
import { useTranslation } from 'react-i18next';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import SortingButton from 'shared-components/SortingButton/SortingButton';
import type {
  InterfaceSearchFilterBarProps,
  InterfaceSearchFilterBarAdvanced,
} from 'types/shared-components/SearchFilterBar/interface';
import styles from './SearchFilterBar.module.css';

/**
 * SearchFilterBar component provides a unified search and filter interface.
 * Supports search functionality with optional sorting and filtering dropdowns.
 * Manages internal state for instant visual feedback while debouncing parent updates.
 * Includes internal i18n support for accessibility and customizable translations.
 * @param props - Component props based on discriminated union (simple or advanced variant)
 * @returns The rendered SearchFilterBar component
 */
const SearchFilterBar: React.FC<InterfaceSearchFilterBarProps> = ({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  debounceDelay = 300,
  searchInputTestId = 'searchInput',
  searchButtonTestId = 'searchButton',
  containerClassName = styles.btnsContainerSearchBar,
  hasDropdowns,
  translations: customTranslations,
  ...rest
}) => {
  const dropdowns = hasDropdowns
    ? (rest as InterfaceSearchFilterBarAdvanced).dropdowns
    : undefined;
  const additionalButtons = hasDropdowns
    ? (rest as InterfaceSearchFilterBarAdvanced).additionalButtons
    : undefined;

  // Internal translations with defaults from common namespace
  const { t: tCommon } = useTranslation('common');

  const translations = {
    searchButtonAriaLabel:
      customTranslations?.searchButtonAriaLabel || tCommon('search'),
    clearSearchLabel: customTranslations?.clearSearchLabel || tCommon('clear'),
    clearButtonAriaLabel:
      customTranslations?.clearButtonAriaLabel || tCommon('clear'),
    loadingLabel: customTranslations?.loadingLabel || tCommon('loading'),
    noResultsLabel:
      customTranslations?.noResultsLabel || tCommon('noResultsFound'),
    searchInputAriaDescription:
      customTranslations?.searchInputAriaDescription || tCommon('searchByName'),
    dropdownAriaLabel:
      customTranslations?.dropdownAriaLabel || tCommon('toggleOptions'),
    sortButtonAriaLabel:
      customTranslations?.sortButtonAriaLabel || tCommon('sort'),
    filterButtonAriaLabel:
      customTranslations?.filterButtonAriaLabel || tCommon('filter'),
    filterAndSortOptionsLabel:
      customTranslations?.filterAndSortOptionsLabel ||
      tCommon('filterAndSortOptions'),
    ...customTranslations, // Allow full override
  };

  const [internalSearchValue, setInternalSearchValue] = useState(searchValue);

  useEffect(() => {
    setInternalSearchValue(searchValue);
  }, [searchValue]);

  const debouncedOnSearchChange = useMemo(
    () => debounce(onSearchChange, debounceDelay),
    [onSearchChange, debounceDelay],
  );

  useEffect(() => {
    return () => {
      debouncedOnSearchChange.cancel();
    };
  }, [debouncedOnSearchChange]);

  const handleSearchChange = useCallback(
    (value: string): void => {
      setInternalSearchValue(value);
      debouncedOnSearchChange(value);
    },
    [debouncedOnSearchChange],
  );

  const handleSearchSubmit = (value: string): void => {
    if (onSearchSubmit) {
      onSearchSubmit(value);
    }
  };

  return (
    <div className={containerClassName}>
      <span id="admin-search-desc" className={styles.screenReaderOnly}>
        {translations.searchInputAriaDescription}
      </span>
      <SearchBar
        placeholder={searchPlaceholder}
        value={internalSearchValue}
        onSearch={handleSearchSubmit}
        onChange={handleSearchChange}
        inputTestId={searchInputTestId}
        buttonTestId={searchButtonTestId}
        buttonAriaLabel={translations.searchButtonAriaLabel}
        clearButtonAriaLabel={translations.clearButtonAriaLabel}
        aria-describedby="admin-search-desc"
      />
      {(dropdowns?.length || additionalButtons) && (
        <div
          className={styles.btnsBlockSearchBar}
          role="toolbar"
          aria-label={translations.filterAndSortOptionsLabel}
        >
          {dropdowns &&
            dropdowns.map((dropdown, index) => (
              <SortingButton
                key={dropdown.id || `${dropdown.dataTestIdPrefix}-${index}`}
                title={dropdown.title}
                sortingOptions={dropdown.options}
                selectedOption={dropdown.selectedOption}
                onSortChange={dropdown.onOptionChange}
                dataTestIdPrefix={dropdown.dataTestIdPrefix}
                dropdownTestId={dropdown.dropdownTestId}
                buttonLabel={dropdown.label}
                type={dropdown.type}
                ariaLabel={`${translations.dropdownAriaLabel} ${dropdown.label}`}
                containerClassName={dropdown.containerClassName}
                toggleClassName={dropdown.toggleClassName}
              />
            ))}
          {additionalButtons}
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
