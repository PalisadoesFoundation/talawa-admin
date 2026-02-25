/**
 * Type definitions for the SearchFilterBar component.
 * This file contains TypeScript interfaces for the SearchFilterBar component,
 * which provides a unified search and filter interface across multiple screens in
 * the Talawa Admin application.
 */

import type React from 'react';

/**
 * Represents a single option in a sorting or filtering dropdown.
 * This interface is compatible with the SortingButton component's option format.
 */
export interface InterfaceSortingOption {
  /**
   * The display text shown to the user in the dropdown menu.
   * @example "Latest", "Oldest", "Most Hours"
   */
  label: string;

  /**
   * The underlying value associated with this option.
   * This value is passed to the onOptionChange callback when the option is selected.
   * @example "DESCENDING", "hours_DESC", "all", 0, 1, 2
   */
  value: string | number;
}

/**
 * Configuration for a single dropdown (sort or filter) in the SearchFilterBar.
 * Each dropdown represents either a sorting control or a filter control,
 * and is rendered using the SortingButton component.
 */
export interface InterfaceDropdownConfig {
  /**
   * A unique identifier for this dropdown configuration.
   * Used as the React key for stable rendering and should be unique across all dropdowns.
   * @example "sort-by-date", "filter-by-status", "group-by-category"
   */
  id: string;

  /**
   * The label/title displayed on the dropdown button.
   * This is typically a user-facing label like "Sort", "Filter", or "Time Frame".
   * @example "Sort", "Filter plugins", "Time Frame"
   */
  label: string;

  /**
   * The type of dropdown control.
   * - `'sort'`: Displays a sort icon and is used for ordering data
   * - `'filter'`: Displays a filter icon and is used for filtering data
   */
  type: 'sort' | 'filter';

  /**
   * The list of available options for this dropdown.
   * Each option contains a label (display text) and a value (underlying data).
   * @example
   * ```ts
   * [
   *   { label: 'Latest', value: 'DESCENDING' },
   *   { label: 'Oldest', value: 'ASCENDING' }
   * ]
   * ```
   */
  options: InterfaceSortingOption[];

  /**
   * The currently selected option value.
   * This should match the `value` field of one of the options in the `options` array.
   * @example "DESCENDING", "hours_DESC", "all", 0, 1, 2
   */
  selectedOption: string | number;

  /**
   * Callback function triggered when the user selects a different option.
   * **Trigger:** User clicks on a dropdown item in the menu.
   * **Job:** Updates the parent component's state with the newly selected value.
   * @param value - The `value` field of the selected option
   *
   * @example
   * ```ts
   * onOptionChange={(value) => setSortOrder(value as SortedByType)}
   * ```
   */
  onOptionChange: (value: string | number) => void;

  /**
   * The prefix used for generating data-testid attributes for testing.
   * This is passed directly to the SortingButton component's `dataTestIdPrefix` prop.
   * @example "sortTags", "filterPlugins", "timeFrame"
   */
  dataTestIdPrefix: string;

  /**
   * Optional title attribute for the dropdown element.
   * **Job:** Provides tooltip text when hovering over the dropdown.
   * @example "Filter plugins", "Sort options"
   */
  title?: string;

  /**
   * Optional data-testid for the dropdown element itself.
   * **Job:** Enables testing frameworks to identify the entire dropdown component.
   * @example "filter", "sort", "timeFrame"
   */
  dropdownTestId?: string;
}

/**
 * Base interface containing common search-related properties.
 * These properties are required for all variants of the SearchFilterBar component.
 */
interface InterfaceSearchFilterBarBase {
  /**
   * Placeholder text displayed in the search input field.
   * **Job:** Provides guidance to users about what they can search for.
   * @example "Search by volunteer", "Search requests", "Search plugins"
   */
  searchPlaceholder: string;

  /**
   * The current search term value.
   * **Job:** Controls the value of the search input field (controlled component pattern).
   * This should be managed in the parent component's state.
   * @example "John Doe", "authentication", ""
   */
  searchValue: string;

  /**
   * Callback function triggered on every keystroke in the search input.
   * **Trigger:** User types or deletes characters in the search field (onChange event).
   * **Job:** Updates the parent component's search state immediately.
   * Parent components should handle their own debouncing for expensive operations.
   * @param value - The current value of the search input field
   * @example
   * ```ts
   * onSearchChange={(value) => setSearchTerm(value)}
   * ```
   */
  onSearchChange: (value: string) => void;

  /**
   * Optional callback function triggered when the user explicitly submits the search.
   * **Trigger:** User presses Enter key or clicks the search button.
   * **Job:** Performs an immediate search action.
   * Useful for triggering search on explicit user action vs typing.
   * @param value - The current value of the search input field
   * @example
   * ```ts
   * onSearchSubmit={(value) => {
   *   console.log('User explicitly searched for:', value);
   *   performSearch(value);
   * }}
   * ```
   */
  onSearchSubmit?: (value: string) => void;

  /**
   * Optional data-testid for the search input field.
   * **Job:** Enables testing frameworks to identify the search input element.
   * default "searchInput"
   * @example "searchPlugins", "searchBy", "searchRequests"
   */
  searchInputTestId?: string;

  /**
   * Optional data-testid for the search button.
   * **Job:** Enables testing frameworks to identify the search button element.
   * default "searchButton"
   * @example "searchPluginsBtn", "searchBtn", "searchButton"
   */
  searchButtonTestId?: string;

  /**
   * Optional custom class name for the container div.
   * **Job:** Allows overriding the default container styling for different screen layouts.
   * default "btnsContainerSearchBar"
   * @example "btnsContainer", "btnsContainerSearchBar"
   */
  containerClassName?: string;

  /**
   * Optional delay in milliseconds for debouncing search input changes.
   * **Job:** Controls how long to wait after the user stops typing before calling onSearchChange.
   * This prevents excessive API calls while the user is actively typing.
   * default 300
   * @example 300, 500, 1000
   */
  debounceDelay?: number;

  /**
   * Optional translation overrides for accessibility and UI customization.
   * **Job:** Allows customizing internal component translations while providing sensible defaults.
   * @example
   * ```ts
   * translations: {
   *   searchButtonAriaLabel: "Search for volunteers",
   *   dropdownAriaLabel: "Toggle {label} options"
   * }
   * ```
   */
  translations?: InterfaceSearchFilterBarTranslations;
}

/**
 * Configuration for SearchFilterBar with only search functionality (no dropdowns).
 * Use this variant when you only need search capabilities without any sorting or filtering dropdowns.
 * @example Requests screen - search only
 * ```tsx
 * <SearchFilterBar
 *   hasDropdowns={false}
 *   searchPlaceholder="Search requests"
 *   searchValue={searchTerm}
 *   onSearchChange={setSearchTerm}
 * />
 * ```
 */
export interface InterfaceSearchFilterBarSimple extends InterfaceSearchFilterBarBase {
  /**
   * Discriminator property indicating this variant has no dropdowns.
   *
   * **Job:** When `false`, the `dropdowns` property must be omitted.
   */
  hasDropdowns: false;
}

/**
 * Configuration for SearchFilterBar with search and dropdown functionality.
 *
 * Use this variant when you need search capabilities combined with one or more
 * sorting/filtering dropdowns.
 *
 * @example PluginStore screen - search with one filter dropdown
 * ```tsx
 * <SearchFilterBar
 *   hasDropdowns={true}
 *   searchPlaceholder="Search plugins"
 *   searchValue={searchTerm}
 *   onSearchChange={setSearchTerm}
 *   dropdowns={[
 *     {
 *       label: 'Filter plugins',
 *       type: 'filter',
 *       options: [
 *         { label: 'All Plugins', value: 'all' },
 *         { label: 'Installed Plugins', value: 'installed' }
 *       ],
 *       selectedOption: filterState.selectedOption,
 *       onOptionChange: handleFilterChange,
 *       dataTestIdPrefix: 'filterPlugins'
 *     }
 *   ]}
 * />
 * ```
 *
 * @example Leaderboard screen - search with two dropdowns (sort + filter)
 * ```tsx
 * <SearchFilterBar
 *   hasDropdowns={true}
 *   searchPlaceholder="Search by volunteer"
 *   searchValue={searchTerm}
 *   onSearchChange={setSearchTerm}
 *   dropdowns={[
 *     {
 *       label: 'Sort',
 *       type: 'sort',
 *       options: [
 *         { label: 'Most Hours', value: 'hours_DESC' },
 *         { label: 'Least Hours', value: 'hours_ASC' }
 *       ],
 *       selectedOption: sortBy,
 *       onOptionChange: (value) => setSortBy(value as 'hours_DESC' | 'hours_ASC'),
 *       dataTestIdPrefix: 'sort'
 *     },
 *     {
 *       label: 'Time Frame',
 *       type: 'filter',
 *       options: [
 *         { label: 'All Time', value: 'allTime' },
 *         { label: 'Weekly', value: 'weekly' }
 *       ],
 *       selectedOption: timeFrame,
 *       onOptionChange: (value) => setTimeFrame(value as TimeFrame),
 *       dataTestIdPrefix: 'timeFrame'
 *     }
 *   ]}
 * />
 * ```
 */
export interface InterfaceSearchFilterBarAdvanced extends InterfaceSearchFilterBarBase {
  /**
   * Discriminator property indicating this variant has dropdowns.
   * **Job:** When `true`, the `dropdowns` property must be provided.
   */
  hasDropdowns: true;

  /**
   * Array of dropdown configurations for sorting and filtering.
   * **Job:** Defines all the dropdown controls that appear alongside the search bar.
   * Each dropdown can be either a sort control or a filter control.
   * The order of dropdowns in this array determines their visual order in the UI.
   * @example
   * ```ts
   * dropdowns={[
   *   {
   *     label: 'Sort',
   *     type: 'sort',
   *     options: [...],
   *     selectedOption: sortBy,
   *     onOptionChange: setSortBy,
   *     dataTestIdPrefix: 'sort'
   *   }
   * ]}
   * ```
   */
  dropdowns: InterfaceDropdownConfig[];

  /**
   * Optional additional React elements to render after the dropdowns.
   * **Job:** Allows inserting custom buttons or components (e.g., "Upload Plugin" button).
   * These elements are rendered inside the btnsBlockSearchBar container after all dropdowns.
   * @example
   * ```tsx
   * additionalButtons={
   *   <Button onClick={() => setShowModal(true)}>
   *     Upload Plugin
   *   </Button>
   * }
   * ```
   */
  additionalButtons?: React.ReactNode;
}

/**
 * Optional translation overrides for SearchFilterBar component.
 * Allows parent components to customize internal translations while
 * providing sensible defaults for accessibility and common UI elements.
 */
export interface InterfaceSearchFilterBarTranslations {
  /** Search button accessible label (screen readers) */
  searchButtonAriaLabel?: string;

  /** Clear search button text/label */
  clearSearchLabel?: string;

  /** Clear button accessible label (screen readers) */
  clearButtonAriaLabel?: string;

  /** Loading state text */
  loadingLabel?: string;

  /** No results found message */
  noResultsLabel?: string;

  /** Search input accessible description */
  searchInputAriaDescription?: string;

  /** Dropdown toggle accessible label pattern */
  dropdownAriaLabel?: string; // e.g., "Toggle {dropdownLabel} options"

  /** Sort button accessible label */
  sortButtonAriaLabel?: string;

  /** Filter button accessible label */
  filterButtonAriaLabel?: string;

  /** Filter and sort options toolbar accessible label */
  filterAndSortOptionsLabel?: string;
}

/**
 * Main props interface for the SearchFilterBar component.
 *
 * This is a discriminated union type that ensures type safety:
 * - When `hasDropdowns` is `false`, the `dropdowns` property cannot be provided
 * - When `hasDropdowns` is `true`, the `dropdowns` property must be provided
 *
 * @example Simple variant (search only)
 * ```tsx
 * const props: InterfaceSearchFilterBarProps = {
 *   hasDropdowns: false,
 *   searchPlaceholder: "Search...",
 *   searchValue: searchTerm,
 *   onSearchChange: setSearchTerm
 * };
 * ```
 *
 * @example Advanced variant (search + dropdowns)
 * ```tsx
 * const props: InterfaceSearchFilterBarProps = {
 *   hasDropdowns: true,
 *   searchPlaceholder: "Search...",
 *   searchValue: searchTerm,
 *   onSearchChange: setSearchTerm,
 *   dropdowns: [...]
 * };
 * ```
 *
 * @example With custom translations
 * ```tsx
 * const props: InterfaceSearchFilterBarProps = {
 *   hasDropdowns: true,
 *   searchPlaceholder: "Search plugins...",
 *   searchValue: searchTerm,
 *   onSearchChange: setSearchTerm,
 *   dropdowns: [...],
 *   translations: {
 *     searchButtonAriaLabel: "Search for plugins",
 *     dropdownAriaLabel: "Toggle {label} filters"
 *   }
 * };
 * ```
 */
export type InterfaceSearchFilterBarProps =
  | InterfaceSearchFilterBarSimple
  | InterfaceSearchFilterBarAdvanced;
