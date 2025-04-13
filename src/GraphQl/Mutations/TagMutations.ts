import { gql } from '@apollo/client';

/**
 * GraphQL mutation to create a user tag.
 *
 * @param name - Name of the tag.
 * @param organizationId - Organization to which the tag belongs.
 * @param parentTagId - ID of the parent tag (optional).
 */

export const CREATE_USER_TAG = gql`
  mutation CreateTag($name: String!, $organizationId: ID!) {
    createTag(input: { name: $name, organizationId: $organizationId }) {
      id
      name
      organization {
        id
      }
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
  mutation removeUserTag($tagId: String!, $userId: String!) {
    removeUserTag(input: { tagId: $tagId, userId: $userId }) {
      id
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
  mutation UpdateTag($id: ID!, $name: String!) {
    updateTag(input: { id: $id, name: $name }) {
      id
      name
    }
  }
`;

export const REMOVE_USER_TAG = gql`
  mutation deleteTag($id: ID!) {
    deleteTag(input: { id: $id }) {
      id
    }
  }
`;

/**
 * GraphQL mutation to add people to tag.
 */
export const ADD_PEOPLE_TO_TAG = gql`
  mutation assignUserTag($tagId: String!, $userId: String!) {
    assignUserTag(input: { tagId: $tagId, userId: $userId }) {
      id
    }
  }
`;

/**
 * GraphQL mutation to assign a user to tags.
 */
export const ADD_USER_TO_TAG = gql`
  mutation AssignToTag($tagId: ID!, $userId: String!) {
    assignUserTag(input: { tagId: $tagId, userId: $userId }) {
      id
      name
      organization {
        id
      }
    }
  }
`;

export const ASSIGN_USER_TAG = gql`
  mutation AssignUserTag($tagId: String!, $userId: String!) {
    assignUserTag(input: { tagId: $tagId, userId: $userId }) {
      id
    }
  }
`;

///////////////
/**
 * GraphQL mutation to assign tags to a user.
 */
export const ASSIGN_TO_TAGS = gql`
  mutation AssignToUserTags($currentTagId: ID!, $selectedTagIds: [ID!]!) {
    assignToUserTag(
      input: { currentTagId: $currentTagId, selectedTagIds: $selectedTagIds }
    ) {
      id
      name
      organization {
        id
      }
    }
  }
`;

/**
 * GraphQL mutation to remove tags from a user.
 */
export const REMOVE_FROM_TAGS = gql`
  mutation RemoveFromUserTags(
    $currentTagId: String!
    $selectedTagIds: [String!]!
  ) {
    removeFromUserTags(
      input: { currentTagId: $currentTagId, selectedTagIds: $selectedTagIds }
    ) {
      id
      name
      organization {
        id
      }
    }
  }
`;
