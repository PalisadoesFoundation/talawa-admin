import gql from 'graphql-tag';

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

export const LIKE_COMMENT = gql`
  mutation likeComment($commentId: ID!) {
    likeComment(id: $commentId) {
      _id
    }
  }
`;

export const UNLIKE_COMMENT = gql`
  mutation unlikeComment($commentId: ID!) {
    unlikeComment(id: $commentId) {
      _id
    }
  }
`;
