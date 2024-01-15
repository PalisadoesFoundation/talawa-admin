import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a new comment on a post.
 *
 * @param comment - The text content of the comment.
 * @param postId - The ID of the post to which the comment is being added.
 * @returns The created comment object.
 */

export const CREATE_COMMENT_POST = gql`
  mutation createComment($comment: String!, $postId: ID!) {
    createComment(data: { text: $comment }, postId: $postId) {
      _id
      creator {
        _id
        firstName
        lastName
        email
      }
      likeCount
      likedBy {
        _id
      }
      text
    }
  }
`;

/**
 * GraphQL mutation to like a comment.
 *
 * @param commentId - The ID of the comment to be liked.
 * @returns The liked comment object.
 */

export const LIKE_COMMENT = gql`
  mutation likeComment($commentId: ID!) {
    likeComment(id: $commentId) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to unlike a comment.
 *
 * @param commentId - The ID of the comment to be unliked.
 * @returns The unliked comment object.
 */

export const UNLIKE_COMMENT = gql`
  mutation unlikeComment($commentId: ID!) {
    unlikeComment(id: $commentId) {
      _id
    }
  }
`;
