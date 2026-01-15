import type { IActionItemCategoryInfo } from 'types/shared-components/ActionItems/interface';

/**
 * Props for CategorySelector component.
 */
export interface InterfaceCategorySelectorProps {
  /** List of available action item categories */
  categories: IActionItemCategoryInfo[];
  /** Currently selected category (null if none selected) */
  selectedCategory: IActionItemCategoryInfo | null;
  /** Callback fired when user selects a different category */
  onCategoryChange: (category: IActionItemCategoryInfo | null) => void;
}
