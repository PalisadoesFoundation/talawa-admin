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

// export const CREATE_VENUE_MUTATION = gql`
//   mutation createVenue(
//     $capacity: Int!
//     $description: String
//     $file: String
//     $name: String!
//     $organizationId: ID!
//   ) {
//     createVenue(
//       data: {
//         capacity: $capacity
//         description: $description
//         file: $file
//         name: $name
//         organizationId: $organizationId
//       }
//     ) {
//       id
//     }
//   }
// `;
export const CREATE_VENUE_MUTATION = gql`
  mutation CREATE_VENUE(
    $organizationId: ID!
    $capacity: Int!
    $name: String!
    $description: String
    $attachments: [Upload!]
  ) {
    createVenue(
      input: {
        organizationId: $organizationId
        name: $name
        description: $description
        attachments: $attachments
        capacity: $capacity
      }
    ) {
      id
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

// export const UPDATE_VENUE_MUTATION = gql`
//   mutation editVenue(
//     $capacity: Int
//     $description: String
//     $file: String
//     $id: ID!
//     $name: String
//   ) {
//     editVenue(
//       data: {
//         capacity: $capacity
//         description: $description
//         file: $file
//         id: $id
//         name: $name
//       }
//     ) {
//       _id
//     }
//   }
// `;
export const UPDATE_VENUE_MUTATION = gql`
  mutation UPDATE_VENUE_MUTATION(
    $attachments: [Upload!]
    $capacity: Int!
    $description: String
    $id: ID!
    $name: String!
    $organizationId: ID!
  ) {
    updateVenue(
      input: {
        organizationId: $organizationId
        name: $name
        description: $description
        attachments: $attachments
        capacity: $capacity
        id: $id
      }
    ) {
      id
    }
  }
`;

/**
 * GraphQL mutation to delete a venue.
 *
 * @param id - The id of the Venue to be deleted.
 */

export const DELETE_VENUE_MUTATION = gql`
  mutation DELETE_VENUE_MUTATION($id: ID!) {
    deleteVenue(input: { id: $id }) {
      id
    }
  }
`;
