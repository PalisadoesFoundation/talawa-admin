type ActionItemsConnectionType = 'Organization' | 'Event';

export const props = {
  actionItemsConnection: 'Organization' as ActionItemsConnectionType,
  actionItemsData: [
    {
      _id: 'actionItem1',
      assignee: {
        _id: 'user1',
        firstName: 'Harve',
        lastName: 'Lance',
      },
      actionItemCategory: {
        _id: 'actionItemCategory1',
        name: 'ActionItemCategory 1',
      },
      preCompletionNotes: 'Pre Completion Notes',
      postCompletionNotes: 'Post Completion Notes',
      assignmentDate: new Date('2024-02-14'),
      dueDate: new Date('2024-02-21'),
      completionDate: new Date('2024-02-21'),
      isCompleted: false,
      assigner: {
        _id: 'user0',
        firstName: 'Wilt',
        lastName: 'Shepherd',
      },
      event: {
        _id: 'event1',
        title: 'event 1',
      },
      creator: {
        _id: 'user0',
        firstName: 'Wilt',
        lastName: 'Shepherd',
      },
    },
    {
      _id: 'actionItem2',
      assignee: {
        _id: 'user1',
        firstName: 'Harve',
        lastName: 'Lance',
      },
      actionItemCategory: {
        _id: 'actionItemCategory1',
        name: 'ActionItemCategory 1',
      },
      preCompletionNotes: 'Pre Completion Notes',
      postCompletionNotes: 'Post Completion Notes',
      assignmentDate: new Date('2024-02-14'),
      dueDate: new Date('2024-02-21'),
      completionDate: new Date('2024-02-21'),
      isCompleted: true,
      assigner: {
        _id: 'user0',
        firstName: 'Wilt',
        lastName: 'Shepherd',
      },
      event: {
        _id: 'event1',
        title: 'event 1',
      },
      creator: {
        _id: 'user0',
        firstName: 'Wilt',
        lastName: 'Shepherd',
      },
    },
    {
      _id: 'actionItem3',
      assignee: {
        _id: 'user1',
        firstName: 'Harve',
        lastName: 'Lance',
      },
      actionItemCategory: {
        _id: 'actionItemCategory1',
        name: 'ActionItemCategory 1',
      },
      preCompletionNotes: 'Pre Completion Notes more than 25 characters',
      postCompletionNotes: 'Post Completion Notes more than 25 characters',
      assignmentDate: new Date('2024-02-14'),
      dueDate: new Date('2024-02-21'),
      completionDate: new Date('2024-02-21'),
      isCompleted: true,
      assigner: {
        _id: 'user0',
        firstName: 'Wilt',
        lastName: 'Shepherd',
      },
      event: {
        _id: 'event1',
        title: 'event 1',
      },
      creator: {
        _id: 'user0',
        firstName: 'Wilt',
        lastName: 'Shepherd',
      },
    },
  ],
  membersData: [
    {
      _id: 'user1',
      firstName: 'Harve',
      lastName: 'Lance',
      email: 'harve@example.com',
      image: '',
      organizationsBlockedBy: [],
      createdAt: '2024-02-14',
    },
    {
      _id: 'user2',
      firstName: 'Scott',
      lastName: 'Norris',
      email: 'scott@example.com',
      image: '',
      organizationsBlockedBy: [],
      createdAt: '2024-02-14',
    },
  ],
  actionItemsRefetch: jest.fn(),
};

export const props2 = {
  actionItemsConnection: 'Organization' as ActionItemsConnectionType,
  actionItemsData: [],
  membersData: [],
  actionItemsRefetch: jest.fn(),
};
