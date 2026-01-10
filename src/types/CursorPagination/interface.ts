import type { DocumentNode } from 'graphql';

export interface InterfacePageInfo {
  endCursor: string | null;
  startCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Props for CursorPaginationManager component.
 */
export interface InterfaceCursorPaginationProps<TNode> {
  query: DocumentNode;
  queryVariables?: Record<string, unknown>;
  /** Dot-separated path to the connection field in the GraphQL response (e.g. "post.comments") */
  dataPath: string;
  itemsPerPage?: number;
  renderItem: (item: TNode, index: number) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  emptyStateComponent?: React.ReactNode;
  onDataChange?: (data: TNode[]) => void;
  /** Changing this numeric prop triggers a refetch when it updates */
  refetchTrigger?: number;
  /** When true, component only manages data and exposes children as render prop */
  useExternalUI?: boolean;
  /** Render prop for external UI integration (e.g., InfiniteScroll) */
  children?: (
    props: InterfaceCursorPaginationRenderProps<TNode>,
  ) => React.ReactNode;
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
  error: Error | undefined;
}
