import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve post comments with cursor-based pagination.
 *
 * @param postId - The ID of the post to fetch comments for.
 * @param after - Cursor to fetch comments after this point (for load more).
 * @param before - Cursor to fetch comments before this point.
 * @param first - Number of comments to fetch (forward pagination).
 * @param last - Number of comments to fetch (backward pagination).
 * @returns Post with paginated comments using cursor-based pagination.
 */

export const GET_POST_COMMENTS = gql`
  query GetPostComments(
    $postId: String!
    $userId: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    post(input: { id: $postId }) {
      id
      caption
      comments(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            id
            body
            creator {
              id
              name
              avatarURL
            }
            createdAt
            upVotesCount
            downVotesCount
            hasUserVoted(userId: $userId) {
              hasVoted
              voteType
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;
