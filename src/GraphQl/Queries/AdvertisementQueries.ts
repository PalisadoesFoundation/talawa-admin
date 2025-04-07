/**
 * GraphQL query to retrieve organization's advertisements based on input.
 *
 * @param id - The ID of a specific organization to retrieve.
 * @param first - Optional. Number of advertisements to retrieve in the first batch.
 * @param last - Optional. Number of advertisements to retrieve in the last batch.
 * @returns The list of organizations based on the applied filters.
 */

import gql from 'graphql-tag';

export const ORGANIZATION_ADVERTISEMENT_LIST = gql`
  query OrganizationPg(
    $id: String!
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    organization(input: { id: $id }) {
      advertisements(
        first: $first
        last: $last
        after: $after
        before: $before
      ) {
        edges {
          node {
            createdAt
            description
            organization {
              id
            }
            endAt
            id
            name
            startAt
            type
            attachments {
              mimeType
              url
            }
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
`;
