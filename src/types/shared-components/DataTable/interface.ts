/**
 * Main interface file for DataTable component types.
 * This file re-exports all types from modular type files for backward compatibility.
 */

// Re-export all types from modular files
export * from './types';
export * from './column';
export * from './pagination';
export * from './hooks';
export * from './props';

import type {
  InterfaceTableLoaderProps,
  InterfaceDataTableProps,
} from './props';
import type {
  InterfacePageInfo,
  InterfacePaginationControlsProps,
} from './pagination';

// Backward compatibility aliases for renamed interfaces
export type {
  InterfaceTableLoaderProps as ITableLoaderProps,
  InterfaceDataTableProps as IDataTableProps,
};
export type {
  InterfacePageInfo as IPageInfo,
  InterfacePaginationControlsProps as IPaginationControlsProps,
};
