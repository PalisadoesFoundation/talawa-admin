/**
 * Interface for LoadingState component props.
 *
 * This interface defines the props for the LoadingState component,
 * which provides a consistent loading experience across the application.
 *
 * @interface InterfaceLoadingStateProps
 *
 * @property {boolean} isLoading - Whether the loading state is active
 * @property {'spinner' | 'inline' | 'table' | 'skeleton' | 'custom'} [variant] - The variant of the loading indicator
 *   - 'spinner': Full-screen loading with overlay (default)
 *   - 'inline': Compact inline loading indicator
 *   - 'table': Table placeholder for tabular data loading
 *   - 'skeleton': Skeleton placeholder for initial content loading
 *   - 'custom': Custom loader component provided via customLoader prop
 * @property {'sm' | 'lg' | 'xl'} [size] - Size of the loading indicator
 *   - 'sm': Small
 *   - 'lg': Large
 *   - 'xl': Extra large (default)
 * @property {React.ReactNode} children - Content to display when not loading
 * @property {string} [data-testid] - Test ID for testing purposes
 * @property {string[]} [tableHeaderTitles] - Array of header titles for the table variant
 * @property {number} [noOfRows] - Number of rows to render for the table variant
 * @property {number} [skeletonRows] - Number of rows to render for the skeleton variant
 * @property {number} [skeletonCols] - Number of columns to render for the skeleton variant
 * @property {React.ReactNode} [customLoader] - Custom loader component for the custom variant (required when variant='custom')
 *
 * @example
 * ```tsx
 * const props: InterfaceLoadingStateProps = {
 *   isLoading: true,
 *   variant: 'skeleton',
 *   size: 'lg',
 *   children: <div>Content</div>,
 *   'data-testid': 'my-loading-state'
 * };
 * ```
 */

type BaseProps = {
  isLoading: boolean;
  children: React.ReactNode;
  'data-testid'?: string;
  size?: 'sm' | 'lg' | 'xl';
  tableHeaderTitles?: string[];
  noOfRows?: number;
  skeletonRows?: number;
  skeletonCols?: number;
};

type WithCustomVariant = BaseProps & {
  variant: 'custom';
  customLoader: React.ReactNode;
};

type WithoutCustomVariant = BaseProps & {
  variant?: 'spinner' | 'inline' | 'table' | 'skeleton';
  customLoader?: never;
};

export type InterfaceLoadingStateProps =
  | WithCustomVariant
  | WithoutCustomVariant;
