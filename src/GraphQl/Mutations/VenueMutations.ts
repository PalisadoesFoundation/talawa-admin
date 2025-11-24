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
    $capacity: Int
    $attachments: [Upload!]
  ) {
    createVenue(
      input: {
        name: $name
        description: $description
        organizationId: $organizationId
        capacity: $capacity
        attachments: $attachments
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
 * @param description - Description of the venue.
 * @param name - Name of the venue.
 */
export const UPDATE_VENUE_MUTATION = gql`
  mutation updateVenue(
    $id: ID!
    $name: String
    $description: String
    $capacity: Int
    $attachments: [Upload!]
  ) {
    updateVenue(
      input: {
        id: $id
        name: $name
        description: $description
        capacity: $capacity
        attachments: $attachments
      }
    ) {
      id
      name
      description
      capacity
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
