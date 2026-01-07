import type { ReactNode } from 'react';
import type { DocumentNode } from 'graphql';
import type { DefaultConnectionPageInfo } from '../pagination';

// Re-export DefaultConnectionPageInfo as InterfacePageInfo for consistency
export type InterfacePageInfo = DefaultConnectionPageInfo;

/**
 * Helper type to combine pagination variables with custom query variables
 */
export type PaginationVariables<T extends Record<string, unknown>> = T & {
  first: number;
  after?: string | null;
};

/**
 * Represents the GraphQL connection structure with edges and pageInfo.
 * This follows the Relay cursor pagination specification.
 */
export interface InterfaceConnectionData<TNode> {
  edges: Array<{
    cursor: string;
    node: TNode;
  }>;
  pageInfo?: InterfacePageInfo;
}

/**
 * Props for CursorPaginationManager component.
 *
 * @remarks
 * When `useExternalUI` is true, the component uses render prop pattern via `children`.
 * In this mode, `renderItem` is ignored and can be omitted or set to an empty function.
 */
export interface InterfaceCursorPaginationManagerProps<
  TNode,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
> {
  query: DocumentNode;
  queryVariables?: TVariables;
  /** Dot-separated path to the connection field in the GraphQL response (e.g. "post.comments") */
  dataPath: string;
  itemsPerPage?: number;
  /** Function to render each item. Ignored when useExternalUI is true. */
  renderItem?: (item: TNode, index: number) => ReactNode;
  /** Optional function to extract unique key from item */
  keyExtractor?: (item: TNode, index: number) => string | number;
  loadingComponent?: ReactNode;
  emptyStateComponent?: ReactNode;
  onDataChange?: (data: TNode[]) => void;
  /** Changing this numeric prop triggers a refetch when it updates */
  refetchTrigger?: number;
  /** When true, component only manages data and exposes children as render prop */
  useExternalUI?: boolean;
  /** Render prop for external UI integration (e.g., InfiniteScroll) */
  children?: (props: InterfaceCursorPaginationRenderProps<TNode>) => ReactNode;
}

/**
 * Props passed to children render function when useExternalUI is true
 */
export interface InterfaceCursorPaginationRenderProps<TNode> {
  items: TNode[];
  loading: boolean;
  loadingMore: boolean;
  pageInfo: InterfacePageInfo | null;
  handleLoadMore: () => void;
  handleRefetch: () => void;
  error: Error | undefined;
}
