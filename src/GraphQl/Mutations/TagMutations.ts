import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a user tag.
 *
 * @param name - Name of the tag.
 * @param tagColor - Color of the tag.
 * @param parentTagId - Id of the parent tag.
 * @param organizationId - Organization to which the tag belongs.
 */

export const CREATE_USER_TAG = gql`
  mutation CreateUserTag(
    $name: String!
    $tagColor: String
    $parentTagId: ID
    $organizationId: ID!
  ) {
    createUserTag(
      input: {
        name: $name
        organizationId: $organizationId
        parentTagId: $parentTagId
        tagColor: $tagColor
      }
    ) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to unsssign a user tag from a user.
 *
 * @param tagId - Id the tag.
 * @param userId - Id of the user to be unassigned.
 */

export const UNASSIGN_USER_TAG = gql`
  mutation UnassignUserTag($tagId: ID!, $userId: ID!) {
    unassignUserTag(input: { tagId: $tagId, userId: $userId }) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to update a user tag.
 *
 * @param tagId - Id the tag.
 * @param name - Updated name of the tag.
 */

export const UPDATE_USER_TAG = gql`
  mutation UpdateUserTag($tagId: ID!, $name: String!) {
    updateUserTag(input: { tagId: $tagId, name: $name }) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to remove a user tag.
 *
 * @param id - Id of the tag to be removed .
 */

export const REMOVE_USER_TAG = gql`
  mutation RemoveUserTag($id: ID!) {
    removeUserTag(id: $id) {
      _id
    }
  }
`;
