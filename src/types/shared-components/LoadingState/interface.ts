/**
 * Interface for LoadingState component props.
 *
 * This interface defines the props for the LoadingState component,
 * which provides a consistent loading experience across the application.
 *
 * @param isLoading - Whether the loading state is active
 * @param variant - (Optional) The variant of the loading indicator
 *   - 'spinner': Full-screen loading with overlay (default)
 *   - 'inline': Compact inline loading indicator
 *   - 'table': Table placeholder for tabular data loading
 *   - 'skeleton': Skeleton placeholder for initial content loading
 *   - 'custom': Custom loader component provided via customLoader prop
 * @param size - (Optional) Size of the loading indicator
 *   - 'sm': Small
 *   - 'lg': Large
 *   - 'xl': Extra large (default)
 * @param children - Content to display when not loading
 * @param data-testid - (Optional) Test ID for testing purposes
 * @param tableHeaderTitles - (Optional) Array of header titles for the table variant
 * @param noOfRows - (Optional) Number of rows to render for the table variant
 * @param skeletonRows - (Optional) Number of rows to render for the skeleton variant
 * @param skeletonCols - (Optional) Number of columns to render for the skeleton variant
 * @param customLoader - (Optional) Custom loader component for the custom variant (required when variant='custom')
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
