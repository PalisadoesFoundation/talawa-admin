import gql from 'graphql-tag';

/**
 * GraphQL mutation to create an advertisement.
 *
 * @param organizationId - Global identifier of the associated organization.
 * @param name - Name of the advertisement.
 * @param type - Type of the advertisement.
 * @param startAt - Date time at which the advertised event starts.
 * @param endAt - Date time at which the advertised event ends.
 * @param description - Custom information about the advertisement.
 * @param attachments - Attachments of the advertisement.
 */
export const ADD_ADVERTISEMENT_MUTATION = gql`
  mutation (
    $organizationId: ID!
    $name: String!
    $type: AdvertisementType!
    $startAt: DateTime!
    $endAt: DateTime!
    $description: String
    $attachments: [Upload!]
  ) {
    createAdvertisement(
      input: {
        organizationId: $organizationId
        name: $name
        type: $type
        startAt: $startAt
        endAt: $endAt
        description: $description
        attachments: $attachments
      }
    ) {
      id
    }
  }
`;

/**
 * GraphQL mutation to update an advertisement.
 *
 * @param id - Global identifier of the advertisement.
 * @param name - Optional updated name of the advertisement
 * @param description - Optional updated description of the advertisement
 * @param type - Optional updated type of the advertisement
 * @param startAt - Optional updated starting date of the advertisement
 * @param endAt - Optional updated ending date of the advertisement
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
 *
 * @param id - Global identifier of the advertisement.
 */

export const DELETE_ADVERTISEMENT_MUTATION = gql`
  mutation ($id: ID!) {
    deleteAdvertisement(input: { id: $id }) {
      id
    }
  }
`;
