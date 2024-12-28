type AgendaItemConnectionType = 'Event';
import { vi } from 'vitest';

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
