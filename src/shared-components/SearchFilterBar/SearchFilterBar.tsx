/**
 * SearchFilterBar — thin wrapper around Toolbar.
 *
 * @deprecated Use `Toolbar` from `shared-components/Toolbar/Toolbar` directly.
 * This component exists only for backward compatibility with existing call sites
 * that have not yet been migrated.
 */
import React from 'react';
import Toolbar from 'shared-components/Toolbar/Toolbar';
import type {
  InterfaceSearchFilterBarProps,
  InterfaceSearchFilterBarAdvanced,
} from 'types/shared-components/SearchFilterBar/interface';
import styles from './SearchFilterBar.module.css';

const SearchFilterBar: React.FC<InterfaceSearchFilterBarProps> = ({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  debounceDelay = 300,
  searchInputTestId = 'searchInput',
  searchButtonTestId = 'searchButton',
  containerClassName,
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

  return (
    <Toolbar
      search={{
        placeholder: searchPlaceholder,
        value: searchValue,
        onSearch: onSearchSubmit ?? onSearchChange,
        onChange: onSearchChange,
        debounceDelay,
        inputTestId: searchInputTestId,
        buttonTestId: searchButtonTestId,
        ariaDescription: customTranslations?.searchInputAriaDescription,
      }}
      filters={dropdowns?.map((d) => ({
        id: d.id,
        type: d.type,
        title: d.title ?? d.label,
        label: d.label,
        options: d.options,
        selected: d.selectedOption,
        onChange: d.onOptionChange,
        testIdPrefix: d.dataTestIdPrefix,
        dropdownTestId: d.dropdownTestId,
        containerClassName: d.containerClassName,
        toggleClassName: d.toggleClassName,
      }))}
      actions={additionalButtons}
      containerClassName={containerClassName ?? styles.btnsContainerSearchBar}
      filtersAriaLabel={customTranslations?.filterAndSortOptionsLabel}
    />
  );
};

export default SearchFilterBar;
