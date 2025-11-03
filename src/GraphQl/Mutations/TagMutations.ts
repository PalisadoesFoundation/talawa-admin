import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a tag.
 *
 * @param name - Name of the tag.
 * @param folderId - Id of the containing folder (optional).
 * @param organizationId - Organization to which the tag belongs.
 */

export const CREATE_USER_TAG = gql`
  mutation CreateUserTag($name: String!, $folderId: ID, $organizationId: ID!) {
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
 * GraphQL mutation to unassign a tag from a user.
 *
 * @param tagId - Id of the tag.
 * @param assigneeId - Id of the user to be unassigned.
 */

export const UNASSIGN_USER_TAG = gql`
  mutation UnassignUserTag($tagId: ID!, $assigneeId: ID!) {
    unassignUserTag(tagId: $tagId, assigneeId: $assigneeId) {
      id
    }
  }
`;

/**
 * GraphQL mutation to update a user tag.
 *
 * @param id - Id of the tag.
 * @param name - Updated name of the tag.
 */

export const UPDATE_USER_TAG = gql`
  mutation UpdateUserTag($id: ID!, $name: String!) {
    updateTag(input: { id: $id, name: $name }) {
      id
    }
  }
`;

/**
 * GraphQL mutation to remove a user tag.
 *
 * @param id - Id of the tag to be removed.
 */

export const REMOVE_USER_TAG = gql`
  mutation RemoveUserTag($id: ID!) {
    deleteTag(input: { id: $id }) {
      id
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
      id
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
      id
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
      id
    }
  }
`;
