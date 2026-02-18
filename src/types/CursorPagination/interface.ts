import type { DocumentNode } from 'graphql';
import type { DefaultConnectionPageInfo } from '../AdminPortal/pagination';

/**
 * Helper type to combine pagination variables with custom query variables
 */
export type PaginationVariables<T extends Record<string, unknown>> = T & {
  first?: number;
  after?: string | null;
  last?: number;
  before?: string | null;
  [key: string]: unknown;
};

/**
 * Represents the GraphQL connection structure with edges and pageInfo.
 * This follows the Relay cursor pagination specification.
 *
 * @typeParam TNode - The type of individual items in the connection
 *
 * @remarks
 * While the Relay spec requires both edges and pageInfo, this interface
 * makes pageInfo optional to gracefully handle incomplete responses.
 * When pageInfo is missing, items are still rendered but pagination is disabled.
 */
export interface InterfaceConnectionData<TNode> {
  edges: Array<{
    cursor: string;
    node: TNode;
  }>;
  pageInfo?: DefaultConnectionPageInfo;
}

/**
 * Props for the CursorPaginationManager component.
 *
 * @typeParam TNode - The type of individual items extracted from edges
 * @typeParam TVariables - The GraphQL query variables type (defaults to `Record<string, unknown>`)
 */
export interface InterfaceCursorPaginationManagerProps<
  TData,
  TNode,
  TVariables extends Record<string, unknown> = Record<string, unknown>, //i18n-ignore-line
> {
  /**
   * GraphQL query document for fetching data
   */
  query: DocumentNode;

  /**
   * Query variables (excluding pagination variables like 'first' and 'after')
   */
  queryVariables?: Omit<TVariables, 'first' | 'after'>;

  /**
   * Dot-separated path to extract connection data from the query response
   * @example "users" for data.users
   * @example "organization.members" for data.organization.members
   */
  dataPath: string;

  /**
   * Number of items to fetch per page
   * default 10
   */
  itemsPerPage?: number;

  /**
   * Function to render each item in the list
   *
   * @remarks
   * When items have stable unique identifiers, provide a keyExtractor function
   * to ensure proper React reconciliation. If keyExtractor is not provided,
   * the component falls back to using the array index as the key, which works
   * for append-only pagination but may cause issues if items are reordered.
   *
   * @example
   * ```tsx
   * // With keyExtractor for stable keys:
   * <CursorPaginationManager
   *   keyExtractor={(user) => user.id}
   *   renderItem={(user) => <div>{user.name}</div>}
   * />
   *
   * // Without keyExtractor (uses index):
   * <CursorPaginationManager
   *   renderItem={(user) => <div>{user.name}</div>}
   * />
   * ```
   */
  renderItem: (item: TNode, index: number) => React.ReactNode;

  /**
   * Optional function to extract a unique key for each item
   *
   * @remarks
   * Provides a stable key for React reconciliation. When not provided,
   * falls back to using the array index as the key.
   *
   * @param item - The current item
   * @param index - The index of the item in the array
   * @returns A unique string or number identifier for the item
   *
   * @example
   * ```tsx
   * keyExtractor={(user) => user.id}
   * ```
   */
  keyExtractor?: (item: TNode, index: number) => string | number;

  /**
   * Custom loading component to show during initial data fetch
   */
  loadingComponent?: React.ReactNode;

  /**
   * Custom component to show when no items are available
   */
  emptyStateComponent?: React.ReactNode;

  /**
   * Callback invoked when the data changes (initial load or after loading more)
   */
  onDataChange?: (data: TNode[]) => void;

  /**
   * Trigger value that causes a refetch when changed
   * Can be a number (counter) or any value that changes
   */
  refetchTrigger?: number;

  /**
   * Direction of pagination.
   * 'forward': Uses 'first' and 'after' (default)
   * 'backward': Uses 'last' and 'before' (mapped via variableKeyMap if needed)
   */
  paginationType?: 'forward' | 'backward';

  /**
   * Map generic pagination variables (first, after, last, before) to custom query variable names.
   * Useful when the query uses different variable names (e.g., 'lastMessages' instead of 'last').
   */
  variableKeyMap?: {
    first?: string;
    after?: string;
    last?: string;
    before?: string;
  };

  /**
   * Callback to return the full query result data.
   * Useful when the parent component needs access to metadata in the response
   * (e.g., chat title, member count) outside of the connection data.
   */
  onQueryResult?: (data: TData) => void;

  /**
   * Callback to handle scroll events or restoration.
   * If provided, the manager might delegate some scroll logic to the parent.
   */
  onContentScroll?: (e: React.UIEvent<HTMLElement>) => void;

  /**
   * Ref to access imperative actions
   */
  actionRef?: React.Ref<InterfaceCursorPaginationManagerRef<TNode>>;

  /**
   * Custom class name for the container
   */
  className?: string;

  /**
   * Enable infinite scroll behavior (auto-load when reaching threshold)
   */
  infiniteScroll?: boolean;

  /**
   * Distance from edge (top for backward, bottom for forward) to trigger load more.
   * Default: 50px
   */
  scrollThreshold?: number;
}

export interface InterfaceCursorPaginationManagerRef<TNode> {
  addItem: (item: TNode, position?: 'start' | 'end') => void;
  removeItem: (predicate: (item: TNode) => boolean) => void;
  updateItem: (
    predicate: (item: TNode) => boolean,
    updater: (item: TNode) => TNode,
  ) => void;
  getItems: () => TNode[];
}
