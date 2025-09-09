import gql from 'graphql-tag';

/**
 * GraphQL mutation to create an action item.
 * Updated to match new schema structure.
 */
export const CREATE_ACTION_ITEM_MUTATION = gql`
  mutation CreateActionItem($input: CreateActionItemInput!) {
    createActionItem(input: $input) {
      id
      isCompleted
      assignedAt
      completionAt
      createdAt
      preCompletionNotes
      postCompletionNotes
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
        isDisabled
      }
      organization {
        id
        name
      }
      event {
        id
        description
        name
      }
    }
  }
`;

/**
 * GraphQL mutation to update an action item.
 * Updated to match new schema structure.
 */
export const UPDATE_ACTION_ITEM_MUTATION = gql`
  mutation UpdateActionItem($input: MutationUpdateActionItemInput!) {
    updateActionItem(input: $input) {
      id
      isCompleted
      assignedAt
      completionAt
      createdAt
      preCompletionNotes
      postCompletionNotes
      assignee {
        id
      }
      creator {
        id
      }
      updater {
        id
      }
      category {
        id
        name
        description
        isDisabled
      }
      organization {
        id
        name
      }
      event {
        id
        description
      }
    }
  }
`;

/**
 * GraphQL mutation to delete an action item.
 * Updated to match new schema structure.
 */
export const DELETE_ACTION_ITEM_MUTATION = gql`
  mutation DeleteActionItem($input: MutationDeleteActionItemInput!) {
    deleteActionItem(input: $input) {
      id
    }
  }
`;

/**
 * GraphQL mutation to mark action item as pending.
 * New mutation for status updates.
 */
export const MARK_ACTION_ITEM_AS_PENDING_MUTATION = gql`
  mutation MarkActionItemAsPending($input: MarkActionItemAsPendingInput!) {
    markActionItemAsPending(input: $input) {
      id
      isCompleted
    }
  }
`;
