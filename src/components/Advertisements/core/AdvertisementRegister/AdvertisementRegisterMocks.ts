import { MockedResponse } from '@apollo/client/testing';
import {
  ADD_ADVERTISEMENT_MUTATION,
  UPDATE_ADVERTISEMENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/AdvertisementQueries';

interface PageInfo {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface DateConstantSet {
  startAtISO: string;
  endAtISO: string;
  startAtCalledWith: string;
  endAtCalledWith: string;
  startISOReceived: string;
  endISOReceived: string;
  endBeforeStartISO: string;
  endBeforeStartCalledWith: string;
  endBeforeStartISOReceived: string;
}

export const mockFile = new File(['dummy content'], 'test.jpg', {
  type: 'image/jpeg',
});

export const mockBigFile = new File(
  [new Array(10 * 1024 * 1024).fill('a').join('')],
  'test.jpg',
  {
    type: 'image/jpeg',
  },
);

export const dateConstants = {
  create: {
    startAtISO: '2024-12-31T18:30:00.000Z',
    endAtISO: '2030-02-01T18:30:00.000Z',
    startAtCalledWith: '2024-12-31T00:00:00.000Z',
    endAtCalledWith: '2030-02-01T00:00:00.000Z',
    startISOReceived: '2024-12-30T18:30:00.000Z',
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
    startISOReceived: '2024-12-30T18:30:00.000Z',
    endISOReceived: '2040-01-31T18:30:00.000Z',
    endBeforeStartISO: '2010-02-01T18:30:00.000Z',
    endBeforeStartCalledWith: '2010-02-01T00:00:00.000Z',
    endBeforeStartISOReceived: '2010-01-31T18:30:00.000Z',
  },
};

const createMockResponse = <T extends Record<string, any> | undefined>(
  query: any,
  variables: T,
  resultData?: any,
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
      data: resultData,
    };
  }

  return response;
};

const createAdvertisementListResponse = (
  isCompleted: boolean,
  edges: any[] = [],
  pageInfo: Partial<PageInfo> = {},
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
  attachments: any[] = [],
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
      startAt: dateConstants.create.startISOReceived,
      endAt: dateConstants.create.endISOReceived,
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
];
