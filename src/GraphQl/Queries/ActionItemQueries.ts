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
        firstName
        lastName
        image
      }
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
      allotedHours
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
