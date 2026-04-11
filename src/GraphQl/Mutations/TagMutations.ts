import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a tag.
 *
 * @param name - Name of the tag.
 * @param folderId - Id of the folder that owns this tag.
 * @param organizationId - Organization to which the tag belongs.
 */

export const CREATE_TAG = gql`
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

// Backward-compatible alias used by legacy screens/mocks.
export const CREATE_USER_TAG = CREATE_TAG;

/**
 * GraphQL mutation to create a tag folder.
 *
 * @param name - Name of the folder.
 * @param organizationId - Organization to which the folder belongs.
 * @param parentFolderId - Optional parent folder id for nesting.
 */

export const CREATE_TAG_FOLDER = gql`
  mutation CreateTagFolder(
    $name: String!
    $organizationId: ID!
    $parentFolderId: ID
  ) {
    createTagFolder(
      input: {
        name: $name
        organizationId: $organizationId
        parentFolderId: $parentFolderId
      }
    ) {
      id
    }
  }
`;

/**
 * GraphQL mutation to update a tag folder.
 *
 * @param id - Id of the folder to update.
 * @param name - Updated folder name.
 * @param parentFolderId - Optional updated parent folder id.
 */

export const UPDATE_TAG_FOLDER = gql`
  mutation UpdateTagFolder($id: ID!, $name: String, $parentFolderId: ID) {
    updateTagFolder(
      input: { id: $id, name: $name, parentFolderId: $parentFolderId }
    ) {
      id
    }
  }
`;

/**
 * GraphQL mutation to delete a tag folder.
 *
 * @param id - Id of the folder to delete.
 */

export const DELETE_TAG_FOLDER = gql`
  mutation DeleteTagFolder($id: ID!) {
    deleteTagFolder(input: { id: $id }) {
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
    unassignUserTag(tagId: $tagId, assigneeId: $userId)
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
    updateTag(input: { id: $tagId, name: $name }) {
      id
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
  mutation AddPeopleToUserTag($tagId: ID!, $userId: ID!) {
    assignUserTag(tagId: $tagId, assigneeId: $userId)
  }
`;

/**
 * GraphQL mutation to assign people to multiple tags.
 *
 * @param currentTagId - Id of the current tag.
 * @param selectedTagIds - Ids of the selected tags to be assined.
 */

export const ASSIGN_TO_TAGS = gql`
  mutation AssignToUserTags {
    __typename
  }
`;

/**
 * GraphQL mutation to remove people from multiple tags.
 *
 * @param currentTagId - Id of the current tag.
 * @param selectedTagIds - Ids of the selected tags to be removed from.
 */

export const REMOVE_FROM_TAGS = gql`
  mutation RemoveFromUserTags {
    __typename
  }
`;
