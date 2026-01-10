import type { ReactNode } from 'react';
import type { DocumentNode } from 'graphql';
import type { ApolloError } from '@apollo/client';
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
 * Base props shared by all CursorPaginationManager configurations
 */
interface InterfaceCursorPaginationManagerBaseProps<
  TNode,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
> {
  query: DocumentNode;
  /** Query variables (pagination params 'first' and 'after' are added automatically) */
  queryVariables?: Omit<TVariables, 'first' | 'after'>;
  /** Dot-separated path to the connection field in the GraphQL response (e.g. "post.comments") */
  dataPath: string;
  itemsPerPage?: number;
  /** Optional function to extract unique key from item */
  keyExtractor?: (item: TNode, index: number) => string | number;
  loadingComponent?: ReactNode;
  emptyStateComponent?: ReactNode;
  onDataChange?: (data: TNode[]) => void;
  /** Changing this numeric prop triggers a refetch when it updates */
  refetchTrigger?: number;
}

/**
 * Props for default UI mode (useExternalUI is false or undefined)
 * In this mode, renderItem is required
 */
interface InterfaceCursorPaginationManagerDefaultProps<
  TNode,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
> extends InterfaceCursorPaginationManagerBaseProps<TNode, TVariables> {
  /** Function to render each item */
  renderItem: (item: TNode, index: number) => ReactNode;
  useExternalUI?: false;
  children?: never;
}

/**
 * Props for external UI mode (useExternalUI is true)
 * In this mode, children render prop is required and renderItem is optional
 */
interface InterfaceCursorPaginationManagerExternalProps<
  TNode,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
  TData = unknown,
> extends InterfaceCursorPaginationManagerBaseProps<TNode, TVariables> {
  /** Function to render each item. Ignored in external UI mode. */
  renderItem?: (item: TNode, index: number) => ReactNode;
  useExternalUI: true;
  /** Render prop for external UI integration (e.g., InfiniteScroll) */
  children: (props: InterfaceCursorPaginationRenderProps<TNode, TData>) => ReactNode;
}

/**
 * Props for CursorPaginationManager component.
 *
 * @remarks
 * This component supports two modes:
 * 1. Default UI mode: Provide `renderItem` to use built-in rendering
 * 2. External UI mode: Set `useExternalUI={true}` and provide `children` render prop
 */
export type InterfaceCursorPaginationManagerProps<
  TNode,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
  TData = unknown,
> =
  | InterfaceCursorPaginationManagerDefaultProps<TNode, TVariables>
  | InterfaceCursorPaginationManagerExternalProps<TNode, TVariables, TData>;

/**
 * Props passed to children render function when useExternalUI is true
 */
export interface InterfaceCursorPaginationRenderProps<TNode, TData = unknown> {
  items: TNode[];
  loading: boolean;
  loadingMore: boolean;
  pageInfo: InterfacePageInfo | null;
  handleLoadMore: () => void;
  handleRefetch: () => void;
  error: ApolloError | undefined;
  /** The full query data from Apollo Client */
  queryData: TData | undefined;
}
