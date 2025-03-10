import { VENUE_LIST } from 'GraphQl/Queries/OrganizationQueries';
import { DELETE_VENUE_MUTATION } from 'GraphQl/Mutations/VenueMutations';
export const MOCK_ALL_VENUE_ASC = [
  {
    request: {
      query: VENUE_LIST,
      variables: {
        id: 'orgId',
        first: 30,
        isInversed: true, // default
        where: undefined,
      },
    },
    result: {
      data: {
        organization: {
          name: 'Test Organization',
          venues: {
            edges: [
              {
                node: {
                  id: '1',
                  name: 'Test Venue 1',
                  capacity: 100,
                  description: 'This is a test venue.',
                  attachments: [
                    {
                      url: 'https://example.com/image1.jpg',
                      mimeType: 'image/jpg',
                    },
                  ],
                },
              },
              {
                node: {
                  id: '2',
                  name: 'Test Venue 2',
                  capacity: 200,
                  description: 'Another test venue.',
                  attachments: [
                    {
                      url: 'https://example.com/image1.jpg',
                      mimeType: 'image/jpg',
                    },
                  ],
                },
              },
              {
                node: {
                  id: '3',
                  name: 'Test Venue 3',
                  capacity: 200,
                  description: '',
                  attachments: [],
                },
              },
              {
                node: {
                  id: '4',
                  name: 'Test Venue 4',
                  capacity: 1200,
                  description: '',
                  attachments: [
                    {
                      url: 'https://example.com/image1.jpg',
                      mimeType: 'image/jpg',
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  },
];
export const MOCK_ALL_VENUE_DESC = [
  {
    request: {
      query: VENUE_LIST,
      variables: {
        id: 'orgId',
        first: 30,
        isInversed: true, // default
        where: undefined,
      },
    },
    result: {
      data: {
        organization: {
          name: 'Test Organization',
          venues: {
            edges: [
              {
                node: {
                  id: '4',
                  name: 'Test Venue 4',
                  capacity: 1200,
                  description: '',
                  attachments: [
                    {
                      url: 'https://example.com/image1.jpg',
                      mimeType: 'image/jpg',
                    },
                  ],
                },
              },
              {
                node: {
                  id: '2',
                  name: 'Test Venue 2',
                  capacity: 200,
                  description: 'Another test venue.',
                  attachments: [
                    {
                      url: 'https://example.com/image1.jpg',
                      mimeType: 'image/jpg',
                    },
                  ],
                },
              },
              {
                node: {
                  id: '3',
                  name: 'Test Venue 3',
                  capacity: 200,
                  description: '',
                  attachments: [],
                },
              },
              {
                node: {
                  id: '1',
                  name: 'Test Venue 1',
                  capacity: 100,
                  description: 'This is a test venue.',
                  attachments: [
                    {
                      url: 'https://example.com/image1.jpg',
                      mimeType: 'image/jpg',
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  },
];

export const MOCK_SEARCH_VENUE_BY_NAME = [
  {
    request: {
      query: VENUE_LIST,
      variables: {
        id: 'orgId',
        first: 30,
        isInversed: true,
        where: {
          name_contains: 'Test Venue 4',
        },
      },
    },
    result: {
      data: {
        organization: {
          name: 'Test Organization',
          venues: {
            edges: [
              {
                node: {
                  id: '4',
                  name: 'Test Venue 4',
                  capacity: 200,
                  description: 'desc',
                  attachments: [
                    {
                      url: 'https://example.com/image1.jpg',
                      mimeType: 'image/jpg',
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  },
];
export const MOCK_SEARCH_VENUE_BY_DESC = [
  {
    request: {
      query: VENUE_LIST,
      variables: {
        id: 'orgId',
        first: 30,
        isInversed: true,
        where: {
          description_contains: 'description of venue4',
        },
      },
    },
    result: {
      data: {
        organization: {
          name: 'Test Organization',
          venues: {
            edges: [
              {
                node: {
                  id: '4',
                  name: 'Test Venue 4',
                  capacity: 200,
                  description: 'description of venue4',
                  attachments: [
                    {
                      url: 'https://example.com/image1.jpg',
                      mimeType: 'image/jpg',
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  },
];

export const MOCK_FETCH_VENUES_ERROR = [
  {
    request: {
      query: VENUE_LIST,
      variables: {
        id: 'orgId',
        first: 30,
        isInversed: true, // default
        where: undefined,
      },
    },
    error: new Error('Failed to fetch venues'),
  },
];

export const MOCK_FAILED_TO_DELETE_VENUE_ERROR = [
  {
    request: {
      query: VENUE_LIST,
      variables: {
        id: 'orgId',
        first: 30,
        isInversed: true, // default
        where: undefined,
      },
    },
    result: {
      data: {
        organization: {
          name: 'Test Organization',
          venues: {
            edges: [
              {
                node: {
                  id: '4',
                  name: 'Test Venue 4',
                  capacity: 200,
                  description: 'description of venue4',
                  attachments: [
                    {
                      url: 'https://example.com/image1.jpg',
                      mimeType: 'image/jpg',
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    request: {
      query: DELETE_VENUE_MUTATION,
      variables: { id: '4' },
    },
    error: new Error('Failed to delete venue'),
  },
];
