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

export const POSTGRES_CREATE_ACTION_ITEM_MUTATION = gql`
  mutation CreateActionItem($input: CreateActionItemInput!) {
    createActionItem(input: $input) {
      id
      categoryId
      assigneeId
      assignedAt
      completionAt
      preCompletionNotes
      postCompletionNotes
      isCompleted
      eventId
      organizationId
      creatorId
      updaterId
      updatedAt
    }
  }
`;

export const POSTGRES_EVENTS_BY_ORGANIZATION_ID = gql`
  query EventsByOrganizationId($input: EventsByOrganizationIdInput!) {
    eventsByOrganizationId(input: $input) {
      id
      name
      description
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
  mutation UpdateActionItem($input: MutationUpdateActionItemInput!) {
    updateActionItem(input: $input) {
      id
      isCompleted
      postCompletionNotes
      preCompletionNotes
      categoryId
      assigneeId
      updaterId
    }
  }
`;

/**
 * GraphQL mutation to delete an action item.
 *
 * @param id - Id of the ActionItem to be updated.
 */

export const DELETE_ACTION_ITEM_MUTATION = gql`
  mutation DeleteActionItem($input: MutationDeleteActionItemInput!) {
    deleteActionItem(input: $input) {
      id
      isCompleted
      categoryId
      assigneeId
      organizationId
      createdAt
      updatedAt
      postCompletionNotes
      preCompletionNotes
    }
  }
`;
