/**
 * Handles loading more comments for a post with pagination support.
 *
 * This function fetches additional comments from the GraphQL API and updates
 * the local state with the new comments while maintaining pagination information.
 *
 * @param params - The parameters object containing all required dependencies
 * @param params.fetchMoreComments - Apollo Client fetchMore function for pagination
 * @param params.postId - Unique identifier of the post to load comments for
 * @param params.userId - Unique identifier of the current user
 * @param params.endCursor - Cursor for pagination (where to start fetching from)
 * @param params.setComments - State setter for updating the comments list
 * @param params.setEndCursor - State setter for updating the pagination cursor
 * @param params.setHasNextPage - State setter for updating pagination flag
 * @param params.setLoadingMoreComments - State setter for loading state
 * @param params.t - Translation function (passed through to errorHandler for consistency)
 *
 * @returns Promise that resolves when the operation is complete
 *
 * * Errors are handled via `errorHandler`; this function does not throw
 */

import type React from 'react';
import type {
  InterfaceCommentEdge,
  InterfaceComment,
} from '../../utils/interfaces';
import { errorHandler } from '../../utils/errorHandler';
import type {
  ApolloQueryResult,
  FetchMoreQueryOptions,
  OperationVariables,
  QueryFunctionOptions,
} from '@apollo/client';

// Define proper types for GraphQL response
/**
 * Represents a connection of comments with pagination information.
 */
interface InterfaceCommentConnection {
  edges: InterfaceCommentEdge[];
  pageInfo: {
    startCursor?: string | null;
    endCursor?: string | null;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

/**
 * Represents the GraphQL response data structure for post comments.
 */
interface InterfacePostCommentsData {
  post: {
    id: string;
    caption?: string;
    comments: InterfaceCommentConnection;
  };
}

/**
 * Represents the result structure from fetchMore operation.
 */
interface InterfaceFetchMoreResult {
  post?: {
    comments?: InterfaceCommentConnection;
  };
}

/**
 * Parameters required for the handleLoadMoreComments function.
 */
interface InterfaceHandleLoadMoreCommentsParams {
  fetchMoreComments: (
    options: FetchMoreQueryOptions<
      {
        postId: string;
        userId: string;
        first: number;
        after: string | null;
      },
      InterfacePostCommentsData
    > & {
      updateQuery: (
        previousQueryResult: InterfacePostCommentsData,
        options: {
          fetchMoreResult?: InterfaceFetchMoreResult;
          variables?: {
            postId: string;
            userId: string;
            first: number;
            after: string | null;
          };
        },
      ) => InterfacePostCommentsData;
    },
  ) => Promise<ApolloQueryResult<InterfacePostCommentsData>>;
  postId: string;
  userId: string;
  endCursor: string | null;
  setComments: React.Dispatch<React.SetStateAction<InterfaceComment[]>>;
  setEndCursor: React.Dispatch<React.SetStateAction<string | null>>;
  setHasNextPage: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingMoreComments: React.Dispatch<React.SetStateAction<boolean>>;
  t: (key: string, options?: Record<string, unknown>) => string;
}

export const handleLoadMoreComments = async ({
  fetchMoreComments,
  postId,
  userId,
  endCursor,
  setComments,
  setEndCursor,
  setHasNextPage,
  setLoadingMoreComments,
  t,
}: InterfaceHandleLoadMoreCommentsParams): Promise<void> => {
  setLoadingMoreComments(true);
  try {
    const result = await fetchMoreComments({
      variables: {
        postId,
        userId,
        first: 10,
        after: endCursor,
      },
      updateQuery: (previousQueryResult, { fetchMoreResult }) => {
        if (!fetchMoreResult?.post?.comments) return previousQueryResult;

        const newEdges = fetchMoreResult.post.comments.edges;
        const newPageInfo = fetchMoreResult.post.comments.pageInfo;

        return {
          ...previousQueryResult,
          post: {
            ...previousQueryResult.post,
            comments: {
              ...previousQueryResult.post.comments,
              edges: [
                ...(previousQueryResult.post.comments.edges || []),
                ...newEdges,
              ],
              pageInfo: {
                ...previousQueryResult.post.comments.pageInfo,
                ...newPageInfo,
              },
            },
          },
        };
      },
    });

    const newEdges = result.data?.post?.comments?.edges ?? [];
    const newPageInfo = result.data?.post?.comments?.pageInfo;
    if (newEdges.length) {
      setComments((prevComments) => [
        ...prevComments,
        ...newEdges.map((edge: InterfaceCommentEdge) => edge.node),
      ]);
    }
    if (newPageInfo) {
      setEndCursor(newPageInfo.endCursor ?? null);
      setHasNextPage(newPageInfo.hasNextPage ?? false);
    }
  } catch (error) {
    errorHandler(t, error);
  } finally {
    setLoadingMoreComments(false);
  }
};
