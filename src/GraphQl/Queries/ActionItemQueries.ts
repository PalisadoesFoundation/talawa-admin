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
    $organizationId: ID!
    $eventId: ID
    $where: ActionItemWhereInput
    $orderBy: ActionItemsOrderByInput
  ) {
    actionItemsByOrganization(
      organizationId: $organizationId
      eventId: $eventId
      orderBy: $orderBy
      where: $where
    ) {
      _id
      assignee {
        _id
        user {
          _id
          firstName
          lastName
          image
        }
      }
      assigneeGroup {
        _id
        name
      }
      assigneeUser {
        _id
        firstName
        lastName
        image
      }
      assigneeType
      assigner {
        _id
        firstName
        lastName
        image
      }
      actionItemCategory {
        _id
        name
      }
      preCompletionNotes
      postCompletionNotes
      assignmentDate
      dueDate
      completionDate
      isCompleted
      event {
        _id
        title
      }
      creator {
        _id
        firstName
        lastName
      }
      allottedHours
    }
  }
`;

export const ACTION_ITEMS_BY_USER = gql`
  query ActionItemsByUser(
    $userId: ID!
    $where: ActionItemWhereInput
    $orderBy: ActionItemsOrderByInput
  ) {
    actionItemsByUser(userId: $userId, where: $where, orderBy: $orderBy) {
      _id
      assignee {
        _id
        user {
          _id
          firstName
          lastName
          image
        }
      }
      assigneeGroup {
        _id
        name
      }
      assigneeType
      assigner {
        _id
        firstName
        lastName
        image
      }
      actionItemCategory {
        _id
        name
      }
      preCompletionNotes
      postCompletionNotes
      assignmentDate
      dueDate
      completionDate
      isCompleted
      event {
        _id
        title
      }
      creator {
        _id
        firstName
        lastName
      }
      allottedHours
    }
  }
`;
