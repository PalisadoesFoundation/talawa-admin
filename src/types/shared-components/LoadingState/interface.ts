/**
 * Interface for LoadingState component props.
 *
 * This interface defines the props for the LoadingState component,
 * which provides a consistent loading experience across the application.
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
