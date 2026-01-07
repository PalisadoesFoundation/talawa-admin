/**
 * Mock data for Advertisement Register tests.
 * @remarks
 * Includes a typed File polyfill for Node.js environments to prevent "File is not defined" errors.
 * Unused exports have been removed or prefixed with underscores to satisfy linting and job requirements.
 */
import { MockedResponse } from '@apollo/client/testing';
import {
  ADD_ADVERTISEMENT_MUTATION,
  UPDATE_ADVERTISEMENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import { DocumentNode } from 'graphql';
import dayjs from 'dayjs';

if (typeof File === 'undefined') {
  class MockFile {
    public name: string;
    public type: string;
    public size: number;
    public content: string[];

    constructor(content: string[], name: string, opts?: { type?: string }) {
      this.content = content;
      this.name = name;
      this.type = opts?.type || '';
      this.size = content.reduce((acc, curr) => acc + (curr.length || 0), 0);
    }
  }
  global.File = MockFile as unknown as typeof File;
}

interface IPageInfo {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const _mockFile = new File(['dummy content'], 'test.jpg', {
  type: 'image/jpeg',
}) as unknown as File;

const _mockBigFile = new File(
  [new Array(6 * 1024 * 1024).fill('a').join('')],
  'test.jpg',
  {
    type: 'image/jpeg',
  },
) as unknown as File;

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
    attachments: Record<string, unknown>[];
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
                : !isCompleted,
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
  attachments: Record<string, unknown>[] = [],
): IAdvertisementEdge => ({
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

const createBatchNodes = (
  count: number,
  baseName: string,
  description: string,
  endAt: string,
): IAdvertisementEdge[] => {
  return Array.from({ length: count }, (_, i) =>
    createAdvertisementNode(
      String(i + 1),
      `${baseName} ${i + 1}`,
      `${description} ${i + 1}`,
      new Date().toISOString(),
      endAt,
    ),
  );
};

const _createAdFailMock = createMockResponse(
  ADD_ADVERTISEMENT_MUTATION,
  {
    organizationId: '1',
    name: 'Ad1',
    type: 'banner',
    startAt: '2022-12-31T18:30:00.000Z',
    endAt: '2023-01-31T18:30:00.000Z',
    description: 'advertisement',
  },
  undefined,
  new Error('Invalid arguments for this action.'),
);

const _updateAdFailMock = createMockResponse(
  UPDATE_ADVERTISEMENT_MUTATION,
  {
    id: '1',
    name: 'Ad1',
    type: 'banner',
    startAt: '2022-01-31T18:30:00.000Z',
    endAt: '2023-12-31T18:30:00.000Z',
    description: 'advertisement',
  },
  undefined,
  new Error('Invalid arguments for this action.'),
);

const _createAdvertisement = [
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
];

const _emptyMocks: MockedResponse[] = [
  createAdvertisementListResponse(false, []),
  createAdvertisementListResponse(true, []),
];

const _initialActiveData: MockedResponse[] = [
  createAdvertisementListResponse(
    false,
    createBatchNodes(6, 'Cookie shop', 'Active', '2030-01-01'),
  ),
  createAdvertisementListResponse(true, []),
];

export {
  createAdvertisementListResponse,
  createAdvertisementNode,
  createBatchNodes,
};
