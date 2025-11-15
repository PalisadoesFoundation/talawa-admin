import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a new comment on a post.
 *
 * @param comment - The text content of the comment.
 * @param postId - The ID of the post to which the comment is being added.
 * @returns The created comment object.
 */

export const CREATE_COMMENT_POST = gql`
  mutation createComment($input: MutationCreateCommentInput!) {
    createComment(input: $input) {
      id
      body
      createdAt
      updatedAt
      upVotesCount
      downVotesCount
      creator {
        id
        name
        emailAddress
      }
      post {
        id
      }
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
  mutation createCommentVote($input: MutationCreateCommentVoteInput!) {
    createCommentVote(input: $input) {
      id
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
  mutation deleteCommentVote($input: MutationDeleteCommentVoteInput!) {
    deleteCommentVote(input: $input) {
      id
    }
  }
`;
export const DELETE_COMMENT = gql`
  mutation deleteComment($input: MutationDeleteCommentInput!) {
    deleteComment(input: $input) {
      id
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation updateComment($input: MutationUpdateCommentInput!) {
    updateComment(input: $input) {
      id
      body
    }
  }
`;
