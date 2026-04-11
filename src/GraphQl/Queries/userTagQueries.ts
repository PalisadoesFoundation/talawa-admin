import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve organization members assigned a certain tag.
 *
 * @param id - The ID of the tag that is assigned.
 * @returns The list of organization members.
 */

export const USER_TAGS_ASSIGNED_MEMBERS = gql`
  query UserTagDetails(
    $id: String!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    getAssignedUsers: tag(input: { id: $id }) {
      id
      name
      usersAssignedTo: assignees(
        after: $after
        before: $before
        first: $first
        last: $last
      ) {
        edges {
          node {
            _id: id
            name
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
      folder {
        _id: id
        name
        parentFolder {
          _id: id
          name
          parentFolder {
            _id: id
            name
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to retrieve the sub tags of a certain tag.
 *
 * @param id - The ID of the parent tag.
 * @returns The list of sub tags.
 */

export const USER_TAG_SUB_TAGS = gql`
  query GetChildTags(
    $id: String!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    getChildTags: tagFolder(input: { id: $id }) {
      _id: id
      name
      childTags: childFolders(
        after: $after
        before: $before
        first: $first
        last: $last
      ) {
        edges {
          node {
            _id: id
            name
            tags(first: 32) {
              edges {
                node {
                  id
                }
              }
            }
            childFolders(first: 32) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
      parentFolder {
        _id: id
        name
        parentFolder {
          _id: id
          name
          parentFolder {
            _id: id
            name
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to retrieve details of a tag folder and its child folders.
 *
 * @param input - The id of the tag folder.
 * @returns The current folder metadata and child folders.
 */

export const TAG_FOLDER_CHILD_FOLDERS = gql`
  query TagFolderChildFolders(
    $input: QueryTagFolderInput!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    tagFolder(input: $input) {
      id
      name
      tags(first: 32) {
        edges {
          node {
            id
            name
            createdAt
            creator {
              id
              name
            }
          }
        }
      }
      childFolders(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            id
            name
            createdAt
            creator {
              id
              name
            }
            childFolders(first: 32) {
              edges {
                node {
                  id
                }
              }
            }
            tags(first: 32) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
      parentFolder {
        id
        name
        parentFolder {
          id
          name
          parentFolder {
            id
            name
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to retrieve tags for an organization with their folder id.
 *
 * Used as a compatibility fallback in folder view while tagFolder.tags
 * resolver alignment is being completed in the API.
 */

export const ORGANIZATION_TAGS_WITH_FOLDER = gql`
  query OrganizationTagsWithFolder(
    $id: String!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    organization(input: { id: $id }) {
      id
      tags(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            id
            name
            createdAt
            creator {
              id
              name
            }
            folder {
              id
            }
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
`;

/**
 * GraphQL query to retrieve organization tags and tag folders.
 *
 * Used in assign/remove tag actions to display a folder-tree view of tags.
 */

export const ORGANIZATION_TAGS_AND_FOLDERS = gql`
  query OrganizationRootTagFolders(
    $id: String!
    $tagFoldersAfter: String
    $tagFoldersFirst: Int
  ) {
    organization(input: { id: $id }) {
      id
      tagFolders(after: $tagFoldersAfter, first: $tagFoldersFirst) {
        edges {
          node {
            id
            name
            parentFolder {
              id
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

/**
 * GraphQL query to retrieve a folder node lazily with paginated children and tags.
 */

export const TAG_FOLDER_TREE_NODE = gql`
  query TagFolderTreeNode(
    $input: QueryTagFolderInput!
    $childFoldersAfter: String
    $childFoldersFirst: Int
  ) {
    tagFolder(input: $input) {
      id
      name
      parentFolder {
        id
      }
      childFolders(after: $childFoldersAfter, first: $childFoldersFirst) {
        edges {
          node {
            id
            name
            parentFolder {
              id
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

/**
 * GraphQL query to retrieve organization members that aren't assigned a certain tag.
 *
 * @param id - The ID of the tag.
 * @returns The list of organization members.
 */

export const USER_TAGS_MEMBERS_TO_ASSIGN_TO = gql`
  query GetMembersToAssignTo(
    $organizationId: String!
    $tagId: String!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $where: MembersWhereInput
  ) {
    organization(input: { id: $organizationId }) {
      id
      members(
        after: $after
        before: $before
        first: $first
        last: $last
        where: $where
      ) {
        edges {
          node {
            _id: id
            name
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
    tag(input: { id: $tagId }) {
      id
      assignees(first: 32) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;
