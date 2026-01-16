import type { DocumentNode } from 'graphql';
import type { DefaultConnectionPageInfo } from '../AdminPortal/pagination';

/**
 * Helper type to combine pagination variables with custom query variables
 */
export type PaginationVariables<T extends Record<string, unknown>> = T & {
  first: number;
  after: string | null;
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
}
