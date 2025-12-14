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
 * @param params.t - Translation function for error messages
 *
 * @returns Promise that resolves when the operation is complete
 *
 * @throws Will call errorHandler if the GraphQL request fails
 */

import React from 'react';
import type {
  InterfaceCommentEdge,
  InterfaceComment,
} from '../../utils/interfaces';
import { errorHandler } from '../../utils/errorHandler';

// Define proper types for GraphQL response
/**
 * Represents a connection of comments with pagination information.
 */
interface CommentConnection {
  edges: InterfaceCommentEdge[];
  pageInfo: {
    startCursor: string | null;
    endCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Represents the GraphQL response data structure for post comments.
 */
interface PostCommentsData {
  post: {
    id: string;
    caption: string;
    comments: CommentConnection;
  };
}

/**
 * Represents the result structure from fetchMore operation.
 */
interface FetchMoreResult {
  post?: {
    comments?: CommentConnection;
  };
}

/**
 * Parameters required for the handleLoadMoreComments function.
 */
interface HandleLoadMoreCommentsParams {
  fetchMoreComments: (options: {
    variables: {
      postId: string;
      userId: string;
      first: number;
      after: string | null;
    };
    updateQuery: (
      prev: PostCommentsData,
      { fetchMoreResult }: { fetchMoreResult?: FetchMoreResult },
    ) => PostCommentsData;
  }) => Promise<unknown>;
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
}: HandleLoadMoreCommentsParams): Promise<void> => {
  setLoadingMoreComments(true);
  try {
    await fetchMoreComments({
      variables: {
        postId,
        userId,
        first: 10,
        after: endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.post?.comments) return prev;

        const newEdges = fetchMoreResult.post.comments.edges;
        const newPageInfo = fetchMoreResult.post.comments.pageInfo;

        // Update local state
        setComments((prevComments) => [
          ...prevComments,
          ...newEdges.map((edge: InterfaceCommentEdge) => edge.node),
        ]);
        setEndCursor(newPageInfo.endCursor);
        setHasNextPage(newPageInfo.hasNextPage);

        return {
          ...prev,
          post: {
            ...prev.post,
            comments: {
              ...prev.post.comments,
              edges: [...prev.post.comments.edges, ...newEdges],
              pageInfo: newPageInfo,
            },
          },
        };
      },
    });
  } catch (error) {
    errorHandler(t, error);
  } finally {
    setLoadingMoreComments(false);
  }
};
