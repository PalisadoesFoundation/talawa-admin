import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a user tag.
 *
 * @param name - Name of the tag.
 * @param folderId - Id of the folder/parent tag to organize tags.
 * @param organizationId - Organization to which the tag belongs.
 */

export const CREATE_USER_TAG = gql`
  mutation CreateTag($name: String!, $folderId: ID, $organizationId: ID!) {
    createTag(
      input: {
        name: $name
        organizationId: $organizationId
        folderId: $folderId
      }
    ) {
      id
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

/**
 * GraphQL mutation to add people to tag.
 *
 * @param tagId - Id of the tag to be assigned.
 * @param userIds - Ids of the users to assign to.
 */

export const ADD_PEOPLE_TO_TAG = gql`
  mutation AddPeopleToUserTag($tagId: ID!, $userIds: [ID!]!) {
    addPeopleToUserTag(input: { tagId: $tagId, userIds: $userIds }) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to assign people to multiple tags.
 *
 * @param currentTagId - Id of the current tag.
 * @param selectedTagIds - Ids of the selected tags to be assined.
 */

export const ASSIGN_TO_TAGS = gql`
  mutation AssignToUserTags($currentTagId: ID!, $selectedTagIds: [ID!]!) {
    assignToUserTags(
      input: { currentTagId: $currentTagId, selectedTagIds: $selectedTagIds }
    ) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to remove people from multiple tags.
 *
 * @param currentTagId - Id of the current tag.
 * @param selectedTagIds - Ids of the selected tags to be removed from.
 */

export const REMOVE_FROM_TAGS = gql`
  mutation RemoveFromUserTags($currentTagId: ID!, $selectedTagIds: [ID!]!) {
    removeFromUserTags(
      input: { currentTagId: $currentTagId, selectedTagIds: $selectedTagIds }
    ) {
      _id
    }
  }
`;
