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
    $capacity: Int!
    $description: String
    $file: String
    $name: String!
    $organizationId: ID!
  ) {
    createVenue(
      data: {
        capacity: $capacity
        description: $description
        file: $file
        name: $name
        organizationId: $organizationId
      }
    ) {
      _id
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
  mutation editVenue(
    $capacity: Int
    $description: String
    $file: String
    $id: ID!
    $name: String
  ) {
    editVenue(
      data: {
        capacity: $capacity
        description: $description
        file: $file
        id: $id
        name: $name
      }
    ) {
      _id
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
    deleteVenue(id: $id) {
      _id
    }
  }
`;
