/**
 * Interface for LoadingState component props.
 *
 * This interface defines the props for the LoadingState component,
 * which provides a consistent loading experience across the application.
 *
 * @interface InterfaceLoadingStateProps
 *
 * @property {boolean} isLoading - Whether the loading state is active
 * @property {'spinner' | 'inline'} [variant] - The variant of the loading indicator
 *   - 'spinner': Full-screen loading with overlay (default)
 *   - 'inline': Compact inline loading indicator
 * @property {'sm' | 'lg' | 'xl'} [size] - Size of the loading indicator
 *   - 'sm': Small
 *   - 'lg': Large
 *   - 'xl': Extra large (default)
 * @property {React.ReactNode} children - Content to display when not loading
 * @property {string} [data-testid] - Test ID for testing purposes
 *
 * @example
 * ```tsx
 * const props: InterfaceLoadingStateProps = {
 *   isLoading: true,
 *   variant: 'spinner',
 *   size: 'lg',
 *   children: <div>Content</div>,
 *   'data-testid': 'my-loading-state'
 * };
 * ```
 */
export interface InterfaceLoadingStateProps {
  isLoading: boolean;
  variant?: 'spinner' | 'inline';
  size?: 'sm' | 'lg' | 'xl';
  children: React.ReactNode;
  'data-testid'?: string;
}
