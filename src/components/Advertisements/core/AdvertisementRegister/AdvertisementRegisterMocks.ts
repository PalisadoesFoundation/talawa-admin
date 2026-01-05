import { MockedResponse } from '@apollo/client/testing';
import {
  ADD_ADVERTISEMENT_MUTATION,
  UPDATE_ADVERTISEMENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/AdvertisementQueries';

interface IPageInfo {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const mockFile = new File(['dummy content'], 'test.jpg', {
  type: 'image/jpeg',
});

export const mockBigFile = new File(
  [new Array(6 * 1024 * 1024).fill('a').join('')],
  'test.jpg',
  {
    type: 'image/jpeg',
  },
);

export const dateConstants = {
  create: {
    startAtISO: dayjs().endOf('year').hour(18).minute(30).toISOString(),
    endAtISO: '2030-02-01T18:30:00.000Z',
    startAtCalledWith: dayjs().endOf('year').startOf('day').toISOString(),
    endAtCalledWith: '2030-02-01T00:00:00.000Z',
    startISOReceived: dayjs()
      .endOf('year')
      .subtract(1, 'day')
      .hour(18)
      .minute(30)
      .toISOString(),
    endISOReceived: '2030-01-31T18:30:00.000Z',
    endBeforeStartISO: '2010-02-01T18:30:00.000Z',
    endBeforeStartCalledWith: '2010-02-01T00:00:00.000Z',
    endBeforeStartISOReceived: '2010-01-31T18:30:00.000Z',
  },
  update: {
    startAtISO: '2020-12-31T18:30:00.000Z',
    endAtISO: '2040-02-01T18:30:00.000Z',
    startAtCalledWith: '2020-12-31T00:00:00.000Z',
    endAtCalledWith: '2040-02-01T00:00:00.000Z',
    startISOReceived: dayjs()
      .endOf('year')
      .subtract(1, 'day')
      .hour(18)
      .minute(30)
      .toISOString(),
    endISOReceived: '2040-01-31T18:30:00.000Z',
    endBeforeStartISO: '2010-02-01T18:30:00.000Z',
    endBeforeStartCalledWith: '2010-02-01T00:00:00.000Z',
    endBeforeStartISOReceived: '2010-01-31T18:30:00.000Z',
  },
};

import { DocumentNode } from 'graphql';
import dayjs from 'dayjs';

const createMockResponse = <T extends Record<string, unknown> | undefined>(
  query: DocumentNode,
  variables: T,
  resultData?: unknown,
  error?: Error,
): MockedResponse => {
  const response: MockedResponse = {
    request: {
      query,
      variables,
    },
  };

  if (error) {
    response.error = error;
  } else {
    response.result = {
      data: resultData as Record<string, unknown>,
    };
  }

  return response;
};

interface IAdvertisementEdge {
  node: {
    id: string;
    createdAt: string;
    description: string;
    endAt: string;
    organization: {
      id: string;
    };
    name: string;
    startAt: string;
    type: string;
    attachments: File[];
  };
}

const createAdvertisementListResponse = (
  isCompleted: boolean,
  edges: IAdvertisementEdge[] = [],
  pageInfo: Partial<IPageInfo> = {},
) => {
  return createMockResponse(
    ORGANIZATION_ADVERTISEMENT_LIST,
    {
      id: '1',
      first: 6,
      after: null,
      where: { isCompleted },
    },
    {
      organization: {
        advertisements: {
          edges,
          pageInfo: {
            startCursor: pageInfo.startCursor || 'cursor-1',
            endCursor: pageInfo.endCursor || 'cursor-2',
            hasNextPage:
              pageInfo.hasNextPage !== undefined
                ? pageInfo.hasNextPage
                : isCompleted
                  ? false
                  : true,
            hasPreviousPage: pageInfo.hasPreviousPage || false,
          },
        },
      },
    },
  );
};

const createAdvertisementNode = (
  id: string,
  name: string,
  description: string,
  startAt: string,
  endAt: string,
  type: string = 'banner',
  attachments: File[] = [],
) => ({
  node: {
    id,
    createdAt: new Date().toISOString(),
    description,
    endAt,
    organization: {
      id: '1',
    },
    name,
    startAt,
    type,
    attachments,
  },
});

export const createAdFailMock = createMockResponse(
  ADD_ADVERTISEMENT_MUTATION,
  {
    organizationId: '1',
    name: 'Ad1',
    type: 'banner',
    startAt: '2022-12-31T18:30:00.000Z',
    endAt: '2023-01-31T18:30:00.000Z',
    description: 'advertisement',
    attachments: [mockFile],
  },
  undefined,
  new Error('Invalid arguments for this action.'),
);

export const updateAdFailMock = createMockResponse(
  UPDATE_ADVERTISEMENT_MUTATION,
  {
    id: '1',
    name: 'Ad1',
    type: 'banner',
    startAt: '2022-01-31T18:30:00.000Z',
    endAt: '2023-12-31T18:30:00.000Z',
    description: 'advertisement',
    attachments: [],
  },
  undefined,
  new Error('Invalid arguments for this action.'),
);

export const createAdvertisement = [
  createMockResponse(
    ADD_ADVERTISEMENT_MUTATION,
    {
      organizationId: '1',
      name: 'Ad1',
      description: 'this is a banner',
      type: 'banner',
      startAt: dateConstants.create.startAtCalledWith,
      endAt: dateConstants.create.endAtCalledWith,
    },
    {
      createAdvertisement: {
        id: '123',
      },
    },
  ),

  createAdvertisementListResponse(false, [
    createAdvertisementNode(
      '1',
      'Ad1',
      'This is a new advertisement created for testing.',
      dateConstants.create.startAtISO,
      dateConstants.create.endAtISO,
    ),
  ]),

  createAdvertisementListResponse(true),

  createAdvertisementListResponse(true, [], {
    startCursor: 'custom-start',
    endCursor: 'custom-end',
    hasNextPage: true,
    hasPreviousPage: true,
  }),

  createAdvertisementListResponse(true, [], {}),

  createAdvertisementListResponse(false, [], {}),
];
