import type { ReactNode } from 'react';

/**
 * Configuration for a single filter/sort dropdown in the Toolbar.
 */
export interface InterfaceToolbarFilter {
  /** Unique id for React key */
  id?: string;
  /** Determines icon: 'sort' → SortIcon, 'filter' → FilterAltOutlined */
  type?: 'sort' | 'filter';
  /** Accessible title / aria-label for the dropdown */
  title: string;
  /** Label text shown on the dropdown button */
  label?: string;
  /** Available options */
  options: { label: string; value: string | number }[];
  /** Currently selected value */
  selected: string | number;
  /** Called when user selects an option */
  onChange: (value: string | number) => void;
  /** data-testid prefix */
  testIdPrefix: string;
  /** Optional data-testid for the whole dropdown element */
  dropdownTestId?: string;
  containerClassName?: string;
  toggleClassName?: string;
  /** Optional custom icon URL (overrides type-based icon) */
  icon?: string;
}

/**
 * Props for the unified Toolbar component.
 *
 * This is a superset of both the old PageHeader (Navbar) and SearchFilterBar APIs.
 * Migrate all callers to this component to avoid duplicate toolbar implementations.
 */
export interface InterfaceToolbarProps {
  /** Optional heading rendered above the toolbar row */
  title?: string;

  /** Search bar configuration */
  search?: {
    /** Placeholder text for the search input */
    placeholder: string;
    /** Controlled value. When provided the input is controlled. */
    value?: string;
    /**
     * Called when the user submits the search (button click / Enter) OR,
     * if no `onChange` is provided, on every debounced keystroke.
     */
    onSearch: (value: string) => void;
    /** Per-keystroke callback. When provided, onSearch is only called on submit. */
    onChange?: (value: string) => void;
    /** Debounce delay in ms when using onChange (default 300) */
    debounceDelay?: number;
    inputTestId?: string;
    buttonTestId?: string;
    /** Visually-hidden description for screen readers */
    ariaDescription?: string;
  };

  /** Sort/filter dropdowns rendered between search and actions */
  filters?: InterfaceToolbarFilter[];

  /** Action buttons rendered on the right of the toolbar row */
  actions?: ReactNode;

  /** Extra class applied to the outermost wrapper div */
  rootClassName?: string;

  /** Extra class applied to the inner flex row (overrides default) */
  containerClassName?: string;

  /** Accessible label for the filters toolbar region */
  filtersAriaLabel?: string;
}
