import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve action item categories by organization.
 *
 * @param organizationId - The ID of the organization for which action item categories are being retrieved.
 * @param orderBy - Sort action items Latest/Earliest first.
 * @param actionItemCategory_id - Filter action items belonging to an action item category.
 * @param event_id - Filter action items belonging to an event.
 * @param is_completed - Filter all the completed action items.
 * @returns The list of action item categories associated with the organization.
 */

export const ACTION_ITEM_LIST = gql`
  query ActionItemsByOrganization(
    $input: QueryActionItemsByOrganizationInput!
  ) {
    actionItemsByOrganization(input: $input) {
      id
      assignee {
        id
        name
        avatarURL
      }
      category {
        id
        name
      }
      event {
        id
        name
      }
      organization {
        id
        name
      }
      creator {
        id
        name
      }
      updater {
        id
        name
      }
      assignedAt
      completionAt
      createdAt
      isCompleted
      preCompletionNotes
      postCompletionNotes
    }
  }
`;

export const ACTION_ITEMS_BY_USER = gql`
  query ActionItemsByUser($input: QueryActionItemsByUserInput!) {
    actionItemsByUser(input: $input) {
      id
      isCompleted
      assignedAt
      completionAt
      preCompletionNotes
      postCompletionNotes
      createdAt
      assignee {
        id
        name
      }
      creator {
        id
        name
      }
      updater {
        id
        name
      }
      category {
        id
        name
        description
      }
      event {
        id

        description
      }
      organization {
        id
        name
        description
      }
    }
  }
`;
