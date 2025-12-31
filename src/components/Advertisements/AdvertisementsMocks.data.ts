/**
 * @file AdvertisementsMocks.data.ts
 * @description Mock data exports for advertisement testing.
 */

import {
  ADD_ADVERTISEMENT_MUTATION,
  DELETE_ADVERTISEMENT_MUTATION,
  UPDATE_ADVERTISEMENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import { createDates, updateDates } from './AdvertisementsMocks.constants';
import {
  createAdvertisementNode,
  createAdvertisementListMock,
  createBatchNodes,
  createMutationMock,
} from './AdvertisementsMocks.utils';
import type { IAdvertisementListMock } from './AdvertisementsMocks.types';

export const emptyMocks: IAdvertisementListMock[] = [
  createAdvertisementListMock({
    isCompleted: false,
    edges: [],
    hasNextPage: false,
    endCursor: null,
  }),
  createAdvertisementListMock({
    isCompleted: true,
    edges: [],
    hasNextPage: false,
    endCursor: null,
  }),
];

const completedAdNode = createAdvertisementNode({
  id: '1',
  name: 'Cookie shop',
  description: 'this is a completed advertisement',
  endAt: new Date().toISOString(),
});

const activeAdNode = createAdvertisementNode({
  id: '2',
  name: 'Cookie shop',
  description: 'this is an active advertisement',
  endAt: new Date('2030-01-01').toISOString(),
});

export const getCompletedAdvertisementMocks: IAdvertisementListMock[] = [
  createAdvertisementListMock({ isCompleted: true, edges: [completedAdNode] }),
  createAdvertisementListMock({ isCompleted: true, edges: [completedAdNode] }),
  createAdvertisementListMock({ isCompleted: false, edges: [] }),
  createAdvertisementListMock({ isCompleted: false, edges: [] }),
];

export const getActiveAdvertisementMocks: IAdvertisementListMock[] = [
  createAdvertisementListMock({ isCompleted: false, edges: [activeAdNode] }),
  createAdvertisementListMock({ isCompleted: false, edges: [activeAdNode] }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
];

export const deleteAdvertisementMocks = [
  createAdvertisementListMock({ isCompleted: true, edges: [completedAdNode] }),
  createAdvertisementListMock({ isCompleted: true, edges: [completedAdNode] }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [],
    hasNextPage: false,
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [],
    hasNextPage: false,
  }),
  createMutationMock(
    DELETE_ADVERTISEMENT_MUTATION,
    { id: '1' },
    { deleteAdvertisement: { id: '1' } },
  ),
];

export const initialArchivedData: IAdvertisementListMock[] = [
  createAdvertisementListMock({
    isCompleted: false,
    edges: [],
    hasNextPage: false,
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [],
    hasNextPage: false,
  }),
  createAdvertisementListMock({
    isCompleted: true,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is an active advertisement',
      new Date('2025-02-03').toISOString(),
    ),
  }),
  createAdvertisementListMock({
    isCompleted: true,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is an active advertisement',
      new Date('2025-02-03').toISOString(),
    ),
  }),
  createAdvertisementListMock({
    isCompleted: true,
    after: 'cursor-2',
    edges: [
      createAdvertisementNode({
        id: '121',
        name: 'Cookie shop infinite 1',
        description: 'this is an infinitely scrolled archived advertisement',
        endAt: new Date('2025-02-03').toISOString(),
      }),
    ],
    startCursor: 'cursor-2',
    endCursor: 'cursor-3',
    hasNextPage: false,
    hasPreviousPage: true,
  }),
];

export const initialActiveData: IAdvertisementListMock[] = [
  createAdvertisementListMock({
    isCompleted: true,
    edges: [],
    hasNextPage: false,
  }),
  createAdvertisementListMock({
    isCompleted: true,
    edges: [],
    hasNextPage: false,
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is an active advertisement',
      new Date('2030-02-03').toISOString(),
    ),
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is an active advertisement',
      new Date('2030-02-03').toISOString(),
    ),
  }),
  createAdvertisementListMock({
    isCompleted: false,
    after: 'cursor-2',
    edges: [
      createAdvertisementNode({
        id: '121',
        name: 'Cookie shop infinite 1',
        description: 'this is an infinitely scrolled active advertisement',
        endAt: new Date('2030-02-03').toISOString(),
      }),
    ],
    startCursor: 'cursor-2',
    endCursor: 'cursor-3',
    hasNextPage: false,
    hasPreviousPage: true,
  }),
];

export const filterActiveAdvertisementData: IAdvertisementListMock[] = [
  createAdvertisementListMock({
    isCompleted: false,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is an active advertisement',
      new Date('2030-01-01').toISOString(),
      true,
    ),
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is an active advertisement',
      new Date('2030-01-01').toISOString(),
      true,
    ),
  }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
];

export const filterCompletedAdvertisementData: IAdvertisementListMock[] = [
  createAdvertisementListMock({
    isCompleted: true,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is a completed advertisement',
      new Date().toISOString(),
      true,
    ),
  }),
  createAdvertisementListMock({
    isCompleted: true,
    edges: createBatchNodes(
      6,
      'Cookie shop',
      'this is a completed advertisement',
      new Date().toISOString(),
      true,
    ),
  }),
  createAdvertisementListMock({ isCompleted: false, edges: [] }),
  createAdvertisementListMock({ isCompleted: false, edges: [] }),
];

export const createAdvertisement = [
  createMutationMock(
    ADD_ADVERTISEMENT_MUTATION,
    {
      organizationId: '1',
      name: 'Ad1',
      type: 'banner',
      startAt: createDates.startAtCalledWith,
      endAt: createDates.endAtCalledWith,
    },
    { createAdvertisement: { id: '123' } },
  ),
  createAdvertisementListMock({
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is a new advertisement created for testing.',
        startAt: createDates.startAtISO,
        endAt: createDates.endAtISO,
      }),
    ],
  }),
  createAdvertisementListMock({
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is a new advertisement created for testing.',
        startAt: createDates.startAtISO,
        endAt: createDates.endAtISO,
      }),
    ],
  }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
];

export const createAdvertisementWithoutName = [
  ...getActiveAdvertisementMocks,
  createMutationMock(
    ADD_ADVERTISEMENT_MUTATION,
    {
      organizationId: '1',
      type: 'banner',
      startAt: createDates.startAtCalledWith,
      endAt: createDates.endAtCalledWith,
    },
    { createAdvertisement: { id: '123' } },
  ),
];

export const createAdvertisementWithEndDateBeforeStart = [
  ...getActiveAdvertisementMocks,
  createMutationMock(
    ADD_ADVERTISEMENT_MUTATION,
    {
      organizationId: '1',
      type: 'banner',
      startAt: createDates.startAtCalledWith,
      endAt: createDates.endBeforeStartCalledWith,
    },
    { createAdvertisement: { id: '123' } },
  ),
];

export const createAdvertisementError = [
  ...getActiveAdvertisementMocks,
  createMutationMock(
    ADD_ADVERTISEMENT_MUTATION,
    {
      organizationId: '1',
      type: 'banner',
      startAt: createDates.startAtCalledWith,
      endAt: createDates.endAtCalledWith,
    },
    undefined,
    new Error('An unknown error occurred'),
  ),
];

export const updateAdMocks = [
  // First pair: completed query fires first in component
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is a new advertisement created for testing.',
        startAt: updateDates.startAtISO,
        endAt: updateDates.endAtISO,
      }),
    ],
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is a new advertisement created for testing.',
        startAt: updateDates.startAtISO,
        endAt: updateDates.endAtISO,
      }),
    ],
  }),
  // Second pair for refetch after update
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is a new advertisement created for testing.',
        startAt: updateDates.startAtISO,
        endAt: updateDates.endAtISO,
      }),
    ],
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is a new advertisement created for testing.',
        startAt: updateDates.startAtISO,
        endAt: updateDates.endAtISO,
      }),
    ],
  }),
  createMutationMock(
    UPDATE_ADVERTISEMENT_MUTATION,
    {
      id: '1',
      description: 'This is an updated advertisement',
      startAt: updateDates.startAtCalledWith,
      endAt: updateDates.endAtCalledWith,
    },
    { updateAdvertisement: { id: '1' } },
  ),
  // Third pair after mutation completes
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({ isCompleted: true, edges: [] }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is an updated advertisement',
        startAt: updateDates.startAtISO,
        endAt: updateDates.endAtISO,
      }),
    ],
  }),
  createAdvertisementListMock({
    isCompleted: false,
    edges: [
      createAdvertisementNode({
        id: '1',
        name: 'Ad1',
        description: 'This is an updated advertisement',
        startAt: updateDates.startAtISO,
        endAt: updateDates.endAtISO,
      }),
    ],
  }),
];

export const fetchErrorMocks = [
  createMutationMock(
    ORGANIZATION_ADVERTISEMENT_LIST,
    { id: '1', first: 6, after: null, where: { isCompleted: false } },
    undefined,
    new Error('Failed to fetch advertisements'),
  ),
  createMutationMock(
    ORGANIZATION_ADVERTISEMENT_LIST,
    { id: '1', first: 6, after: null, where: { isCompleted: true } },
    undefined,
    new Error('Failed to fetch advertisements'),
  ),
];
