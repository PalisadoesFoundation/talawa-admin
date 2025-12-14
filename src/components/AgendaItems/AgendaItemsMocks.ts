import { vi } from 'vitest';
import {
  UPDATE_AGENDA_ITEM_MUTATION,
  DELETE_AGENDA_ITEM_MUTATION,
} from 'GraphQl/Mutations/AgendaItemMutations';

type AgendaItemConnectionType = 'Event';

export const props = {
  agendaItemConnection: 'Event' as AgendaItemConnectionType,
  agendaItemData: [
    {
      _id: 'agendaItem1',
      title: 'AgendaItem 1',
      description: 'AgendaItem 1 Description',
      duration: '2h',
      attachments: ['attachment1'],
      createdBy: {
        _id: 'user0',
        firstName: 'Wilt',
        lastName: 'Shepherd',
      },
      urls: [],
      users: [],
      sequence: 1,
      categories: [
        {
          _id: 'category1',
          name: 'Category 1',
        },
      ],
      organization: {
        _id: 'org1',
        name: 'Unity Foundation',
      },
      relatedEvent: {
        _id: 'event1',
        title: 'Aerobics for Everyone',
      },
    },
    {
      _id: 'agendaItem2',
      title: 'AgendaItem 2',
      description: 'AgendaItem 2 Description',
      duration: '1h',
      attachments: ['attachment3'],
      createdBy: {
        _id: 'user1',
        firstName: 'Jane',
        lastName: 'Doe',
      },
      urls: ['http://example.com'],
      users: [
        {
          _id: 'user2',
          firstName: 'John',
          lastName: 'Smith',
        },
      ],
      sequence: 2,
      categories: [
        {
          _id: 'category2',
          name: 'Category 2',
        },
      ],
      organization: {
        _id: 'org2',
        name: 'Health Organization',
      },
      relatedEvent: {
        _id: 'event2',
        title: 'Yoga for Beginners',
      },
    },
  ],
  agendaItemRefetch: vi.fn(),
  agendaItemCategories: [
    {
      _id: 'agendaCategory1',
      name: 'AgendaCategory 1',
      description: 'AgendaCategory 1 Description',
      createdBy: {
        _id: 'user0',
        firstName: 'Wilt',
        lastName: 'Shepherd',
      },
    },
    {
      _id: 'agendaCategory2',
      name: 'AgendaCategory 2',
      description: 'AgendaCategory 2 Description',
      createdBy: {
        _id: 'user1',
        firstName: 'Jane',
        lastName: 'Doe',
      },
    },
  ],
};

export const props2 = {
  agendaItemConnection: 'Event' as AgendaItemConnectionType,
  agendaItemData: [],
  agendaItemRefetch: vi.fn(),
  agendaItemCategories: [],
};

export const MOCKS = [
  {
    request: {
      query: UPDATE_AGENDA_ITEM_MUTATION,
      variables: {
        updateAgendaItemId: 'agendaItem1',
        input: {
          title: 'AgendaItem 1 Edited',
          description: 'AgendaItem 1 Description Edited',
          duration: '2h',
          categories: ['category1'],
          attachments: ['attachment1'],
          urls: [],
        },
      },
    },
    result: {
      data: {
        updateAgendaItem: {
          __typename: 'AgendaItem',
          _id: 'agendaItem1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_MUTATION,
      variables: {
        updateAgendaItemId: 'agendaItem1',
        input: {
          title: 'AgendaItem 1',
          description: 'AgendaItem 1 Description',
          duration: '2h',
          categories: ['category1'],
          attachments: ['attachment1'],
          urls: [],
        },
      },
    },
    result: {
      data: {
        updateAgendaItem: {
          __typename: 'AgendaItem',
          _id: 'agendaItem1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_MUTATION,
      variables: {
        updateAgendaItemId: 'agendaItem2',
        input: {
          title: 'AgendaItem 2 edited',
          description: 'AgendaItem 2 Description',
          duration: '1h',
          categories: ['category2'],
          attachments: ['attachment3'],
          urls: ['http://example.com'],
        },
      },
    },
    result: {
      data: {
        updateAgendaItem: {
          __typename: 'AgendaItem',
          _id: 'agendaItem2',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_AGENDA_ITEM_MUTATION,
      variables: {
        removeAgendaItemId: 'agendaItem1',
      },
    },
    result: {
      data: {
        removeAgendaItem: {
          __typename: 'AgendaItem',
          _id: 'agendaItem1',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_AGENDA_ITEM_MUTATION,
      variables: {
        removeAgendaItemId: 'agendaItem2',
      },
    },
    result: {
      data: {
        removeAgendaItem: {
          __typename: 'AgendaItem',
          _id: 'agendaItem2',
        },
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: UPDATE_AGENDA_ITEM_MUTATION,
      variables: {
        updateAgendaItemId: 'agendaItem1',
        input: {
          title: 'AgendaItem 1 Edited',
          description: 'AgendaItem 1 Description Edited',
          duration: '2h',
          categories: ['category1'],
          attachments: ['attachment1'],
          urls: [],
        },
      },
    },
    error: new Error('An error occurred'),
  },
  {
    request: {
      query: DELETE_AGENDA_ITEM_MUTATION,
      variables: {
        removeAgendaItemId: 'agendaItem1',
      },
    },
    error: new Error('An error occurred'),
  },
];

// Mocks for drag-and-drop reordering
export const MOCKS_DRAG_DROP = [
  {
    request: {
      query: UPDATE_AGENDA_ITEM_MUTATION,
      variables: {
        updateAgendaItemId: 'agendaItem1',
        input: {
          sequence: 2,
        },
      },
    },
    result: {
      data: {
        updateAgendaItem: {
          __typename: 'AgendaItem',
          _id: 'agendaItem1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_MUTATION,
      variables: {
        updateAgendaItemId: 'agendaItem2',
        input: {
          sequence: 1,
        },
      },
    },
    result: {
      data: {
        updateAgendaItem: {
          __typename: 'AgendaItem',
          _id: 'agendaItem2',
        },
      },
    },
  },
];

export const MOCKS_DRAG_DROP_ERROR = [
  {
    request: {
      query: UPDATE_AGENDA_ITEM_MUTATION,
      variables: {
        updateAgendaItemId: 'agendaItem1',
        input: {
          sequence: 2,
        },
      },
    },
    error: new Error('Failed to update sequence'),
  },
];

export const mockFormState1 = {
  title: 'Test Title',
  description: 'Test Description',
  duration: '20',
  attachments: ['Test Attachment'],
  urls: ['https://example.com'],
  agendaItemCategoryIds: ['category'],
  agendaItemCategoryNames: ['category'],
  createdBy: {
    firstName: 'Test',
    lastName: 'User',
  },
};

export const mockFormState2 = {
  title: 'Test Title',
  description: 'Test Description',
  duration: '20',
  attachments: [
    'https://example.com/video.mp4',
    'https://example.com/image.jpg',
  ],
  urls: [
    'https://example.com',
    'https://thisisaverylongurlthatexceedsfiftycharacters.com/very/long/path',
  ],
  agendaItemCategoryIds: ['category'],
  agendaItemCategoryNames: ['category'],
  createdBy: {
    firstName: 'Test',
    lastName: 'User',
  },
};

export const mockAgendaItemCategories = [
  {
    _id: '1',
    name: 'Test Name',
    description: 'Test Description',
    createdBy: {
      _id: '1',
      firstName: 'Test',
      lastName: 'User',
    },
  },
  {
    _id: '2',
    name: 'Another Category',
    description: 'Another Description',
    createdBy: {
      _id: '2',
      firstName: 'Another',
      lastName: 'Creator',
    },
  },
  {
    _id: '3',
    name: 'Third Category',
    description: 'Third Description',
    createdBy: {
      _id: '3',
      firstName: 'Third',
      lastName: 'User',
    },
  },
];
