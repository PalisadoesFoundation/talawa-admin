import gql from 'graphql-tag';

/**
 * GraphQL mutation to create an advertisement.
 * * NOTE: The attachments variable (Upload scalar) has been removed
 * to align with the HttpLink migration (PR 2/5).
 */
export const ADD_ADVERTISEMENT_MUTATION = gql`
  mutation (
    $organizationId: ID!
    $name: String!
    $type: AdvertisementType!
    $startAt: DateTime!
    $endAt: DateTime!
    $description: String
  ) {
    createAdvertisement(
      input: {
        organizationId: $organizationId
        name: $name
        type: $type
        startAt: $startAt
        endAt: $endAt
        description: $description
      }
    ) {
      id
    }
  }
`;

/**
 * GraphQL mutation to update an advertisement.
 */
export const UPDATE_ADVERTISEMENT_MUTATION = gql`
  mutation UpdateAdvertisement(
    $id: ID!
    $name: String
    $description: String
    $type: AdvertisementType
    $startAt: DateTime
    $endAt: DateTime
  ) {
    updateAdvertisement(
      input: {
        id: $id
        name: $name
        type: $type
        description: $description
        startAt: $startAt
        endAt: $endAt
      }
    ) {
      id
    }
  }
`;

/**
 * GraphQL mutation to delete an advertisement.
 */
export const DELETE_ADVERTISEMENT_MUTATION = gql`
  mutation ($id: ID!) {
    deleteAdvertisement(input: { id: $id }) {
      id
    }
  }
`;
