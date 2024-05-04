import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve action item categories by organization.
 *
 * @param organizationId - The ID of the organization for which action item categories are being retrieved.
 * @param orderBy - Sort action items Latest/Earliest first.
 * @param actionItemCategory_id - Filter action items belonging to an action item category.
 * @param event_id - Filter action items belonging to an event.
 * @param is_active - Filter all the active action items.
 * @param is_completed - Filter all the completed action items.
 * @returns The list of action item categories associated with the organization.
 */

export const ACTION_ITEM_LIST = gql`
  query ActionItemsByOrganization(
    $organizationId: ID!
    $actionItemCategoryId: ID
    $eventId: ID
    $isActive: Boolean
    $isCompleted: Boolean
    $orderBy: ActionItemsOrderByInput
  ) {
    actionItemsByOrganization(
      organizationId: $organizationId
      orderBy: $orderBy
      where: {
        actionItemCategory_id: $actionItemCategoryId
        event_id: $eventId
        is_active: $isActive
        is_completed: $isCompleted
      }
    ) {
      _id
      assignee {
        _id
        firstName
        lastName
      }
      assigner {
        _id
        firstName
        lastName
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
    }
  }
`;

export const ACTION_ITEM_LIST_BY_EVENTS = gql`
  query actionItemsByEvent($eventId: ID!) {
    actionItemsByEvent(eventId: $eventId) {
      _id
      assignee {
        _id
        firstName
        lastName
      }
      assigner {
        _id
        firstName
        lastName
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
    }
  }
`;
