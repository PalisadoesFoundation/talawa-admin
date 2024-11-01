import gql from 'graphql-tag';

/**
 * GraphQL mutation to create an action item.
 *
 * @param actionItemCategoryId - ActionItemCategory to which the ActionItem is related.
 * @param assigneeId - User to whom the ActionItem is assigned.
 * @param preCompletionNotes - Notes prior to completion.
 * @param dueDate - Due date.
 * @param eventId - Event to which the ActionItem is related.
 * @param allottedHours - Hours allotted for the ActionItem.
 */

export const CREATE_ACTION_ITEM_MUTATION = gql`
  mutation CreateActionItem(
    $actionItemCategoryId: ID!
    $assigneeId: ID!
    $assigneeType: String!
    $preCompletionNotes: String
    $dDate: Date
    $eventId: ID
    $allottedHours: Float
  ) {
    createActionItem(
      actionItemCategoryId: $actionItemCategoryId
      data: {
        assigneeId: $assigneeId
        assigneeType: $assigneeType
        preCompletionNotes: $preCompletionNotes
        dueDate: $dDate
        eventId: $eventId
        allottedHours: $allottedHours
      }
    ) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to update an action item.
 *
 * @param id - Id of the ActionItem to be updated.
 * @param assigneeId - User to whom the ActionItem is assigned.
 * @param preCompletionNotes - Notes prior to completion.
 * @param postCompletionNotes - Notes on completion.
 * @param dueDate - Due date.
 * @param completionDate - Completion date.
 * @param isCompleted - Whether the ActionItem has been completed.
 */

export const UPDATE_ACTION_ITEM_MUTATION = gql`
  mutation UpdateActionItem(
    $actionItemId: ID!
    $assigneeId: ID!
    $assigneeType: String!
    $preCompletionNotes: String
    $postCompletionNotes: String
    $dueDate: Date
    $completionDate: Date
    $isCompleted: Boolean
    $allottedHours: Float
  ) {
    updateActionItem(
      id: $actionItemId
      data: {
        assigneeId: $assigneeId
        assigneeType: $assigneeType
        preCompletionNotes: $preCompletionNotes
        postCompletionNotes: $postCompletionNotes
        dueDate: $dueDate
        completionDate: $completionDate
        allottedHours: $allottedHours
        isCompleted: $isCompleted
      }
    ) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to delete an action item.
 *
 * @param id - Id of the ActionItem to be updated.
 */

export const DELETE_ACTION_ITEM_MUTATION = gql`
  mutation RemoveActionItem($actionItemId: ID!) {
    removeActionItem(id: $actionItemId) {
      _id
    }
  }
`;
