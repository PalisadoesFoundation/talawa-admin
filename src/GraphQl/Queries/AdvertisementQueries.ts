/**
 * GraphQL query to retrieve organization's advertisements based on input.
 *
 * @param id - The ID of a specific organization to retrieve.
 * @param first - Optional. Number of advertisements to retrieve in the first batch.
 * @param last - Optional. Number of advertisements to retrieve in the last batch.
 * @param after - Optional. Cursor for pagination to fetch records after this cursor.
 * @param before - Optional. Cursor for pagination to fetch records before this cursor.
 * @param where - Optional. Filter criteria for advertisements.
 * @returns The organization's advertisements based on the applied filters.
 */

import gql from 'graphql-tag';

export const ORGANIZATION_ADVERTISEMENT_LIST = gql`
  query OrganizationAdvertisements(
    $id: String!
    $first: Int
    $last: Int
    $after: String
    $before: String
    $where: AdvertisementWhereInput
  ) {
    organization(input: { id: $id }) {
      advertisements(
        first: $first
        last: $last
        after: $after
        before: $before
        where: $where
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
