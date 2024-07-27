import {
  UPDATE_ACTION_ITEM_MUTATION,
  DELETE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/mutations';

export const MOCKS = [
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItem1',
        assigneeId: 'user2',
        preCompletionNotes: 'pre completion notes edited',
        postCompletionNotes: 'Post Completion Notes',
        dueDate: '2024-02-14',
        completionDate: '2024-02-21',
        isCompleted: false,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: 'actionItem1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItem1',
        assigneeId: 'user1',
        preCompletionNotes: 'Pre Completion Notes',
        postCompletionNotes: 'this action item has been completed successfully',
        dueDate: '2024-02-21',
        completionDate: '2024-02-21',
        isCompleted: true,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: 'actionItem1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItem2',
        assigneeId: 'user1',
        preCompletionNotes: 'this action item has been made active again',
        postCompletionNotes: 'Post Completion Notes',
        dueDate: '2024-02-21',
        completionDate: '2024-02-21',
        isCompleted: false,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: 'actionItem1',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItem1',
      },
    },
    result: {
      data: {
        removeActionItem: {
          _id: 'actionItem1',
        },
      },
    },
  },
];

export const MOCKS_ERROR_MUTATIONS = [
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItem1',
        assigneeId: 'user2',
        preCompletionNotes: 'pre completion notes edited',
        postCompletionNotes: '',
        dueDate: '2024-02-14',
        completionDate: '2024-02-21',
        isCompleted: false,
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: DELETE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItem1',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];
