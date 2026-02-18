/**
 * Pagination state information for cursor-based pagination.
 *
 * Used in GraphQL Relay connection pattern to track pagination cursors
 * and availability of next/previous pages.
 */
export interface InterfacePageInfo {
  /** Whether more items exist after the current set (has next page) */
  hasNextPage: boolean;
  /** Whether items existed before the current set (has previous page) */
  hasPreviousPage: boolean;
  /** Cursor pointing to the start of the current result set */
  startCursor?: string;
  /** Cursor pointing to the end of the current result set */
  endCursor?: string;
}

export type PageInfo = InterfacePageInfo;

/**
 * A single edge in a GraphQL Relay connection.
 *
 * Wraps a node (or null) and can be null itself, representing
 * a single item in a paginated result set.
 *
 * @typeParam TNode - The type of node data wrapped by this edge
 */
export type Edge<TNode> = { node: TNode | null } | null;

/**
 * GraphQL Relay connection pattern for paginated data.
 *
 * Contains an array of edges (each wrapping a node or null) and pagination
 * metadata. Consumers should iterate the edges array and safely access node
 * values (which may be null), then use pageInfo to determine pagination state.
 *
 * @typeParam TNode - The type of node data in the edges
 *
 * @example
 * ```
 * connection?.edges?.forEach(edge => {
 *   if (edge?.node) {
 *     // Process non-null node
 *   }
 * });
 * ```
 */
export type Connection<TNode> =
  | {
      /** Array of edges, each optionally containing a node */
      edges?: Array<Edge<TNode>> | null;
      /** Pagination state (cursors and next/previous availability) */
      pageInfo?: PageInfo | null;
    }
  | null
  | undefined;

/**
 * Props for a pagination controls component.
 *
 * Displays pagination UI with page indicators and navigation buttons
 * allowing users to move between pages of data.
 */
export interface InterfacePaginationControlsProps {
  /** Current page number (typically 1-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items across all pages */
  totalItems: number;
  /**
   * Callback fired when user navigates to a different page.
   *
   * @param page - The new page number
   */
  onPageChange: (page: number) => void;
}
