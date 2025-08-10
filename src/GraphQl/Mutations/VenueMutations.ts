import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a venue.
 *
 * @param name - Name of the venue.
 * @param capacity - Ineteger representing capacity of venue.
 * @param description - Description of the venue.
 * @param file - Image file for the venue.
 * @param organizationId - Organization to which the ActionItemCategory belongs.
 */

export const CREATE_VENUE_MUTATION = gql`
  mutation createVenue(
    $name: String!
    $description: String
    $organizationId: ID!
  ) {
    createVenue(
      input: {
        name: $name
        description: $description
        organizationId: $organizationId
      }
    ) {
      id
      name
      description
    }
  }
`;

/**
 * GraphQL mutation to update a venue.
 *
 * @param id - The id of the Venue to be updated.
 * @param capacity - Ineteger representing capacity of venue.
 * @param description - Description of the venue.
 * @param file - Image file for the venue.
 * @param name - Name of the venue.
 */

export const UPDATE_VENUE_MUTATION = gql`
  mutation updateVenue($id: ID!, $name: String, $description: String) {
    updateVenue(input: { id: $id, name: $name, description: $description }) {
      id
      name
      description
    }
  }
`;

/**
 * GraphQL mutation to delete a venue.
 *
 * @param id - The id of the Venue to be deleted.
 */

export const DELETE_VENUE_MUTATION = gql`
  mutation DeleteVenue($id: ID!) {
    deleteVenue(input: { id: $id }) {
      id
    }
  }
`;
