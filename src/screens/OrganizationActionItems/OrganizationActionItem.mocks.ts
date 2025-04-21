import dayjs from 'dayjs';
import {
  CREATE_ACTION_ITEM_MUTATION,
  DELETE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/ActionItemMutations';

import {
  actionItemCategoryListQuery,
  groupListQuery,
  itemWithGroup,
  itemWithUser,
  itemWithUserImage,
  itemWithVolunteer,
  itemWithVolunteerImage,
  memberListQuery,
  volunteerListQuery,
} from './testObject.mocks';

export const MOCKS = [
  {
    request: {
      query: DELETE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId1',
      },
    },
    result: {
      data: {
        removeActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId1',
        assigneeId: 'userId1',
        assigneeType: 'User',
        postCompletionNotes: '',
        isCompleted: false,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId1',
        assigneeId: 'userId1',
        assigneeType: 'User',
        actionItemCategoryId: 'categoryId2',
        postCompletionNotes: 'Cmp Notes 2',
        allottedHours: 19,
        isCompleted: true,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId1',
        assigneeId: 'volunteerGroupId1',
        assigneeType: 'EventVolunteerGroup',
        postCompletionNotes: 'Cmp Notes 1',
        isCompleted: true,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId2',
        assigneeId: 'userId1',
        assigneeType: 'User',
        actionItemCategoryId: 'categoryId1',
        preCompletionNotes: 'Notes 3',
        allottedHours: 19,
        dueDate: '2044-01-02',
        isCompleted: false,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId1',
        assigneeId: 'userId1',
        postCompletionNotes: 'Cmp Notes 1',
        isCompleted: true,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId2',
        assigneeId: 'volunteerId2',
        assigneeType: 'EventVolunteer',
        actionItemCategoryId: 'categoryId1',
        allottedHours: 19,
        isCompleted: false,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId2',
        assigneeId: 'groupId2',
        assigneeType: 'EventVolunteerGroup',
        actionItemCategoryId: 'categoryId1',
        allottedHours: 19,
        isCompleted: false,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_MUTATION,
      variables: {
        assigneeId: 'userId1',
        assigneeType: 'User',
        actionItemCategoryId: 'categoryId1',
        preCompletionNotes: 'Notes',
        allottedHours: 9,
        dDate: '2044-01-02',
      },
    },
    result: {
      data: {
        createActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_MUTATION,
      variables: {
        assigneeId: 'userId1',
        assigneeType: 'User',
        actionItemCategoryId: 'categoryId1',
        preCompletionNotes: 'Notes',
        allottedHours: 9,
        dDate: '2044-01-02',
      },
    },
    result: {
      data: {
        createActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_MUTATION,
      variables: {
        assigneeId: 'volunteerId1',
        assigneeType: 'EventVolunteer',
        actionItemCategoryId: 'categoryId1',
        preCompletionNotes: 'Notes',
        allottedHours: 9,
        dDate: '2044-01-02',
        eventId: 'eventId',
      },
    },
    result: {
      data: {
        createActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_MUTATION,
      variables: {
        assigneeId: 'groupId1',
        assigneeType: 'EventVolunteerGroup',
        actionItemCategoryId: 'categoryId1',
        preCompletionNotes: 'Notes',
        allottedHours: 9,
        dDate: '2044-01-02',
        eventId: 'eventId',
      },
    },
    result: {
      data: {
        createActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  memberListQuery,
  actionItemCategoryListQuery,
  ...volunteerListQuery,
  ...groupListQuery,
];
