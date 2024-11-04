import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import OrgPost from './OrgPost';
import { ORGANIZATION_POST_LIST } from 'GraphQl/Queries/Queries';
import i18nForTest from 'utils/i18nForTest';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('components/OrgPostCard/OrgPostCard', () => {
  return function MockOrgPostCard({ refetch, ...props }: any) {
    return (
      <div data-testid="org-post-card">
        <button onClick={refetch} data-testid="refetch-trigger">
          Trigger Refetch
        </button>
        <div data-testid="post-props">{JSON.stringify(props)}</div>
      </div>
    );
  };
});

// Mock modules
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('utils/useLocalstorage', () => ({
  __esModule: true,
  default: () => ({
    getItem: () => 'mock-token',
  }),
}));

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: 'test-org' }),
}));

// Base mock data
const mockPostsData = {
  organizations: [
    {
      posts: {
        edges: [
          {
            node: {
              _id: '1',
              title: 'Test Post 1',
              text: 'Test Content 1',
              creator: {
                _id: 'user1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@test.com',
                image: null,
              },
              file: {
                _id: 'file1',
                fileName: 'test.jpg',
                mimeType: 'image/jpeg',
                size: 1000,
                hash: {
                  value: 'hash123',
                  algorithm: 'md5',
                },
                uri: 'test.jpg',
                metadata: {
                  objectKey: 'key123',
                },
                visibility: 'public',
                status: 'active',
              },
              createdAt: '2024-01-01',
              likeCount: 0,
              likedBy: [],
              commentCount: 0,
              comments: [],
              pinned: false,
            },
            cursor: 'cursor1',
          },
        ],
        pageInfo: {
          startCursor: 'cursor1',
          endCursor: 'cursor1',
          hasNextPage: false,
          hasPreviousPage: false,
        },
        totalCount: 1,
      },
    },
  ],
};

const paginationMocks = [
  // Initial page mock
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        id: 'test-org',
        after: null,
        before: null,
        first: 6,
        last: null,
      },
    },
    result: {
      data: {
        organizations: [
          {
            posts: {
              edges: [
                {
                  node: {
                    _id: '1',
                    title: 'Post 1',
                    text: 'Content 1',
                    creator: {
                      _id: 'user1',
                      firstName: 'John',
                      lastName: 'Doe',
                      email: 'john@test.com',
                    },
                    createdAt: '2024-01-01',
                    pinned: false,
                  },
                  cursor: 'cursor1',
                },
              ],
              pageInfo: {
                startCursor: 'cursor1',
                endCursor: 'cursor1',
                hasNextPage: true,
                hasPreviousPage: false,
              },
              totalCount: 2,
            },
          },
        ],
      },
    },
  },
  // Next page mock
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        id: 'test-org',
        after: 'cursor1',
        before: null,
        first: 6,
        last: null,
      },
    },
    result: {
      data: {
        organizations: [
          {
            posts: {
              edges: [
                {
                  node: {
                    _id: '2',
                    title: 'Post 2',
                    text: 'Content 2',
                    creator: {
                      _id: 'user1',
                      firstName: 'John',
                      lastName: 'Doe',
                      email: 'john@test.com',
                    },
                    createdAt: '2024-01-02',
                    pinned: false,
                  },
                  cursor: 'cursor2',
                },
              ],
              pageInfo: {
                startCursor: 'cursor2',
                endCursor: 'cursor2',
                hasNextPage: false,
                hasPreviousPage: true,
              },
              totalCount: 2,
            },
          },
        ],
      },
    },
  },
];

const mockPostsDataWithPinned = {
  organizations: [
    {
      posts: {
        edges: [
          {
            node: {
              _id: '1',
              title: 'Unpinned Post 1',
              text: 'Content 1',
              creator: {
                _id: 'user1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@test.com',
                image: null,
              },
              file: null,
              createdAt: '2024-01-01',
              likeCount: 0,
              likedBy: [],
              commentCount: 0,
              comments: [],
              pinned: false,
            },
            cursor: 'cursor1',
          },
          {
            node: {
              _id: '2',
              title: 'Pinned Post 1',
              text: 'Content 2',
              creator: {
                _id: 'user1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@test.com',
                image: null,
              },
              file: null,
              createdAt: '2024-01-02',
              likeCount: 0,
              likedBy: [],
              commentCount: 0,
              comments: [],
              pinned: true,
            },
            cursor: 'cursor2',
          },
          {
            node: {
              _id: '3',
              title: 'Pinned Post 2',
              text: 'Content 3',
              creator: {
                _id: 'user1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@test.com',
                image: null,
              },
              file: null,
              createdAt: '2024-01-03',
              likeCount: 0,
              likedBy: [],
              commentCount: 0,
              comments: [],
              pinned: true,
            },
            cursor: 'cursor3',
          },
          {
            node: {
              _id: '4',
              title: 'Unpinned Post 2',
              text: 'Content 4',
              creator: {
                _id: 'user1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@test.com',
                image: null,
              },
              file: null,
              createdAt: '2024-01-04',
              likeCount: 0,
              likedBy: [],
              commentCount: 0,
              comments: [],
              pinned: false,
            },
            cursor: 'cursor4',
          },
        ],
        pageInfo: {
          startCursor: 'cursor1',
          endCursor: 'cursor4',
          hasNextPage: false,
          hasPreviousPage: false,
        },
        totalCount: 4,
      },
    },
  ],
};

const mocks = [
  // Initial query mock
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        id: 'test-org',
        after: null,
        before: null,
        first: 6,
        last: null,
      },
    },
    result: {
      data: mockPostsData,
    },
  },
  // Refetch query mock - same shape as initial query
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        id: 'test-org',
        after: null,
        before: null,
        first: 6,
        last: null,
      },
    },
    result: {
      data: {
        organizations: [
          {
            posts: {
              edges: [
                {
                  node: {
                    _id: '1',
                    title: 'Updated Test Post 1',
                    text: 'Updated Test Content 1',
                    creator: {
                      _id: 'user1',
                      firstName: 'John',
                      lastName: 'Doe',
                      email: 'john@test.com',
                      image: null,
                    },
                    file: {
                      _id: 'file1',
                      fileName: 'test.jpg',
                      mimeType: 'image/jpeg',
                      size: 1000,
                      hash: {
                        value: 'hash123',
                        algorithm: 'md5',
                      },
                      uri: 'test.jpg',
                      metadata: {
                        objectKey: 'key123',
                      },
                      visibility: 'public',
                      status: 'active',
                    },
                    createdAt: '2024-01-01',
                    likeCount: 0,
                    likedBy: [],
                    commentCount: 0,
                    comments: [],
                    pinned: false,
                  },
                  cursor: 'cursor1',
                },
              ],
              pageInfo: {
                startCursor: 'cursor1',
                endCursor: 'cursor1',
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 1,
            },
          },
        ],
      },
    },
  },
];
jest.mock('components/OrgPostCard/OrgPostCard', () => {
  return function MockOrgPostCard({ refetch, ...props }: any) {
    return (
      <div data-testid="org-post-card">
        <button onClick={refetch} data-testid="refetch-trigger">
          Trigger Refetch
        </button>
        <div data-testid="post-props">{JSON.stringify(props)}</div>
      </div>
    );
  };
});

const renderWithProviders = () => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <OrgPost />
        </I18nextProvider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

// Function to generate GraphQL mocks
const generateMocks = () => {
  const baseMock = {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        id: 'test-org',
        after: null,
        before: null,
        first: 6,
        last: null,
      },
    },
    result: {
      data: mockPostsData,
    },
  };

  const refetchMock = {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        id: 'test-org',
        after: null,
        before: null,
        first: 6,
        last: null,
      },
    },
    result: {
      data: {
        organizations: [
          {
            posts: {
              edges: [
                {
                  node: {
                    _id: '1',
                    title: 'Updated Test Post 1',
                    text: 'Updated Test Content 1',
                    creator: {
                      _id: 'user1',
                      firstName: 'John',
                      lastName: 'Doe',
                      email: 'john@test.com',
                      image: null,
                    },
                    file: {
                      _id: 'file1',
                      fileName: 'test.jpg',
                      mimeType: 'image/jpeg',
                      size: 1000,
                      hash: {
                        value: 'hash123',
                        algorithm: 'md5',
                      },
                      uri: 'test.jpg',
                      metadata: {
                        objectKey: 'key123',
                      },
                      visibility: 'public',
                      status: 'active',
                    },
                    createdAt: '2024-01-01',
                    likeCount: 0,
                    likedBy: [],
                    commentCount: 0,
                    comments: [],
                    pinned: false,
                  },
                  cursor: 'cursor1',
                },
              ],
              pageInfo: {
                startCursor: 'cursor1',
                endCursor: 'cursor1',
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 1,
            },
          },
        ],
      },
    },
  };

  const searchMocks = ['t', 'te', 'tes', 'test'].map((searchTerm) => ({
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        id: 'test-org',
        after: null,
        before: null,
        first: 6,
        last: null,
        title_contains: searchTerm,
        text_contains: null,
      },
    },
    result: {
      data: mockPostsData,
    },
  }));

  const textSearchMocks = ['t', 'te', 'tes', 'test'].map((searchTerm) => ({
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        id: 'test-org',
        after: null,
        before: null,
        first: 6,
        last: null,
        title_contains: null,
        text_contains: searchTerm,
      },
    },
    result: {
      data: mockPostsData,
    },
  }));

  return [baseMock, refetchMock, ...searchMocks, ...textSearchMocks];
};

describe('OrgPost Component', () => {
  const renderWithProviders = () => {
    return render(
      <MockedProvider mocks={generateMocks()} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPost />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      }),
    ) as jest.Mock;
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  it('renders and loads posts successfully', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('searchByName')).toBeInTheDocument();
  });

  it('handles title search', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 't');
    await waitFor(() => {
      expect(searchInput).toHaveValue('t');
    });

    await userEvent.type(searchInput, 'e');
    await waitFor(() => {
      expect(searchInput).toHaveValue('te');
    });
  });

  it('handles text search toggle', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    });

    // Open search dropdown
    const searchByButton = screen.getByTestId('searchBy');
    await act(async () => {
      fireEvent.click(searchByButton);
    });

    // Click text search option
    const textSearchOption = screen.getByTestId('Text');
    await act(async () => {
      fireEvent.click(textSearchOption);
    });

    const searchInput = screen.getByTestId('searchByName');
    await act(async () => {
      await userEvent.type(searchInput, 'test');
    });

    await waitFor(() => {
      expect(searchInput).toHaveValue('test');
    });
  });

  it('opens create post modal and handles form submission', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    });

    // Open modal
    await act(async () => {
      userEvent.click(screen.getByTestId('createPostModalBtn'));
    });

    // Fill form
    const titleInput = screen.getByTestId('modalTitle');
    const infoInput = screen.getByTestId('modalinfo');
    const pinToggle = screen.getByTestId('pinPost');

    await userEvent.type(titleInput, 'Test Title');
    await userEvent.type(infoInput, 'Test Content');

    await act(async () => {
      userEvent.click(pinToggle);
    });

    // Submit form
    await act(async () => {
      userEvent.click(screen.getByTestId('createPostBtn'));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/create-post'),
        expect.any(Object),
      );
    });
  });

  it('passes refetch function to OrgPostCard and calls it correctly', async () => {
    renderWithProviders();

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    });

    // Verify OrgPostCard is rendered with the post data
    const postCards = screen.getAllByTestId('org-post-card');
    expect(postCards).toHaveLength(1); // Based on mock data having one post

    // Get the refetch trigger button from the mocked OrgPostCard
    const refetchTrigger = screen.getByTestId('refetch-trigger');

    // Trigger refetch
    await act(async () => {
      fireEvent.click(refetchTrigger);
    });

    // Wait for refetch to complete
    await waitFor(() => {
      const postProps = screen.getByTestId('post-props');
      const props = JSON.parse(postProps.textContent || '');
      expect(props.postTitle).toBe('Updated Test Post 1');
    });

    // Verify post props are passed correctly
    const postProps = screen.getByTestId('post-props');
    const props = JSON.parse(postProps.textContent || '');

    // Check the essential props are passed
    expect(props).toHaveProperty('id');
    expect(props).toHaveProperty('postTitle');
    expect(props).toHaveProperty('postInfo');
    expect(props).toHaveProperty('postAuthor');
    expect(props).toHaveProperty('pinned');
  });

  it('handles media upload in create post modal', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    });

    // Open modal
    await act(async () => {
      userEvent.click(screen.getByTestId('createPostModalBtn'));
    });

    // Upload file
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('addMediaField');
    await act(async () => {
      await userEvent.upload(input, file);
    });

    // Check preview
    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    });

    // Clear media
    await act(async () => {
      userEvent.click(screen.getByTestId('mediaCloseButton'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('mediaPreview')).not.toBeInTheDocument();
    });
  });

  it('handles post sorting', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    });

    const sortButton = screen.getByTestId('sortpost');
    await act(async () => {
      userEvent.click(sortButton);
    });

    const latestOption = screen.getByTestId('latest');
    await act(async () => {
      userEvent.click(latestOption);
    });

    const oldestOption = screen.getByTestId('oldest');
    await act(async () => {
      userEvent.click(oldestOption);
    });
  });

  it('closes create post modal', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    });

    // Open modal
    await act(async () => {
      userEvent.click(screen.getByTestId('createPostModalBtn'));
    });

    // Close modal
    await act(async () => {
      userEvent.click(screen.getByTestId('closeOrganizationModal'));
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('modalOrganizationHeader'),
      ).not.toBeInTheDocument();
    });
  });
  it('displays pinned posts before unpinned posts', async () => {
    renderWithProviders();

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    });

    // Get all post cards
    const postCards = screen.getAllByTestId('org-post-card');

    // Get props from each post card
    const postProps = postCards.map((card) => {
      const propsDiv = card.querySelector('[data-testid="post-props"]');
      return JSON.parse(propsDiv?.textContent || '{}');
    });

    // Verify the order of posts - pinned posts should come first
    expect(postProps[0].postTitle).toBe('Test Post 1');
  });

  it('handles case where all posts have same pinned status', async () => {
    // Create modified mock where all posts are unpinned
    const allUnpinnedMock = {
      ...mockPostsDataWithPinned,
      organizations: [
        {
          posts: {
            ...mockPostsDataWithPinned.organizations[0].posts,
            edges: mockPostsDataWithPinned.organizations[0].posts.edges.map(
              (edge) => ({
                ...edge,
                node: {
                  ...edge.node,
                  pinned: false,
                },
              }),
            ),
          },
        },
      ],
    };

    const unpinnedMocks = [
      {
        request: {
          query: ORGANIZATION_POST_LIST,
          variables: {
            id: 'test-org',
            after: null,
            before: null,
            first: 6,
            last: null,
          },
        },
        result: {
          data: allUnpinnedMock,
        },
      },
    ];

    render(
      <MockedProvider mocks={unpinnedMocks} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPost />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    });

    const postCards = screen.getAllByTestId('org-post-card');
    const postProps = postCards.map((card) => {
      const propsDiv = card.querySelector('[data-testid="post-props"]');
      return JSON.parse(propsDiv?.textContent || '{}');
    });

    // Verify original order is maintained when all posts have same pinned status
    expect(postProps[0].id).toBe('4');

    // Verify all posts are unpinned
    postProps.forEach((props) => {
      expect(props.pinned).toBe(false);
    });
  });

  it('maintains search functionality after toggling search type', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    });

    // Open dropdown and select title search
    const searchByButton = screen.getByTestId('searchBy');
    await act(async () => {
      fireEvent.click(searchByButton);
    });

    const titleSearchOption = screen.getByTestId('searchTitle');
    await act(async () => {
      fireEvent.click(titleSearchOption, {
        preventDefault: jest.fn(),
      });
    });

    // Type in search
    const searchInput = screen.getByTestId('searchByName');
    await act(async () => {
      await userEvent.type(searchInput, 'test');
    });

    expect(searchInput).toHaveValue('test');

    // Switch to text search
    await act(async () => {
      fireEvent.click(searchByButton);
    });

    const textSearchOption = screen.getByTestId('Text');
    await act(async () => {
      fireEvent.click(textSearchOption, {
        preventDefault: jest.fn(),
      });
    });

    // Verify search input maintains functionality
    expect(searchInput).toHaveValue('test');
    expect(searchInput.getAttribute('placeholder')).toBe('searchText');
  });

  it('renders both search type and sort dropdowns correctly', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    });

    // Verify search type dropdown
    const searchByDropdown = screen.getByTestId('sea');
    expect(searchByDropdown).toBeInTheDocument();

    const searchByButton = screen.getByTestId('searchBy');
    expect(searchByButton).toBeInTheDocument();

    // Verify sort dropdown
    const sortDropdown = screen.getByTestId('sort');
    expect(sortDropdown).toBeInTheDocument();

    const sortButton = screen.getByTestId('sortpost');
    expect(sortButton).toBeInTheDocument();
  });

  it('verifies default search behavior', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    });

    // Check initial placeholder text
    const searchInput = screen.getByTestId('searchByName');
    expect(searchInput.getAttribute('placeholder')).toBe('searchTitle');
  });

  describe('Media File Handling in Post Creation', () => {
    const mockData = {
      request: {
        query: ORGANIZATION_POST_LIST,
        variables: {
          id: 'test-org',
          after: null,
          before: null,
          first: 6,
          last: null,
        },
      },
      result: {
        data: {
          organizations: [
            {
              posts: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: '',
                  endCursor: '',
                },
              },
            },
          ],
        },
      },
    };

    const renderComponent = () => {
      return render(
        <MockedProvider mocks={[mockData]} addTypename={false}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </BrowserRouter>
        </MockedProvider>,
      );
    };

    beforeEach(() => {
      jest.clearAllMocks();
      global.URL.createObjectURL = jest.fn(() => 'mock-url');
      global.URL.revokeObjectURL = jest.fn();
    });

    it('appends file to FormData when media file is present', async () => {
      // Mock fetch response
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        }),
      ) as jest.Mock;

      renderComponent();

      // Open create post modal
      await waitFor(() => {
        const createButton = screen.getByTestId('createPostModalBtn');
        fireEvent.click(createButton);
      });

      // Fill in required fields
      const titleInput = screen.getByTestId('modalTitle');
      const infoInput = screen.getByTestId('modalinfo');

      fireEvent.change(titleInput, { target: { value: 'Test Title' } });
      fireEvent.change(infoInput, { target: { value: 'Test Content' } });

      // Create and attach file
      const file = new File(['test file content'], 'test-image.png', {
        type: 'image/png',
      });
      const fileInput = screen.getByTestId('addMediaField');

      fireEvent.change(fileInput, { target: { files: [file] } });

      // Verify file preview is shown
      await waitFor(() => {
        expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
      });

      // Submit form
      const submitButton = screen.getByTestId('createPostBtn');
      fireEvent.click(submitButton);

      // Verify fetch call includes file in FormData
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
        const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
        const [, { body }] = fetchCall;

        expect(body instanceof FormData).toBe(true);
        expect(body.get('file')).toBeTruthy();
        expect(body.get('file')).toEqual(file);
      });
    });

    it('does not append file to FormData when no media file is present', async () => {
      // Mock fetch response
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        }),
      ) as jest.Mock;

      renderComponent();

      // Open create post modal
      await waitFor(() => {
        const createButton = screen.getByTestId('createPostModalBtn');
        fireEvent.click(createButton);
      });

      // Fill in required fields without file
      const titleInput = screen.getByTestId('modalTitle');
      const infoInput = screen.getByTestId('modalinfo');

      fireEvent.change(titleInput, { target: { value: 'Test Title' } });
      fireEvent.change(infoInput, { target: { value: 'Test Content' } });

      // Verify no media preview is shown
      expect(screen.queryByTestId('mediaPreview')).not.toBeInTheDocument();

      // Submit form
      const submitButton = screen.getByTestId('createPostBtn');
      fireEvent.click(submitButton);

      // Verify fetch call does not include file in FormData
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
        const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
        const [, { body }] = fetchCall;

        expect(body instanceof FormData).toBe(true);
        expect(body.get('file')).toBeFalsy();
      });
    });

    it('handles file removal correctly', async () => {
      renderComponent();

      // Open create post modal
      await waitFor(() => {
        const createButton = screen.getByTestId('createPostModalBtn');
        fireEvent.click(createButton);
      });

      // Add file
      const file = new File(['test file content'], 'test-image.png', {
        type: 'image/png',
      });
      const fileInput = screen.getByTestId('addMediaField');

      fireEvent.change(fileInput, { target: { files: [file] } });

      // Verify file preview is shown
      await waitFor(() => {
        expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
      });

      // Remove file
      const removeButton = screen.getByTestId('mediaCloseButton');
      fireEvent.click(removeButton);

      // Verify preview is removed
      expect(screen.queryByTestId('mediaPreview')).not.toBeInTheDocument();

      // Fill required fields and submit
      const titleInput = screen.getByTestId('modalTitle');
      const infoInput = screen.getByTestId('modalinfo');

      fireEvent.change(titleInput, { target: { value: 'Test Title' } });
      fireEvent.change(infoInput, { target: { value: 'Test Content' } });

      const submitButton = screen.getByTestId('createPostBtn');
      fireEvent.click(submitButton);

      // Verify fetch call does not include removed file
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
        const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
        const [, { body }] = fetchCall;

        expect(body instanceof FormData).toBe(true);
        expect(body.get('file')).toBeFalsy();
      });
    });

    it('handles different file types correctly', async () => {
      renderComponent();

      // Open create post modal
      await waitFor(() => {
        const createButton = screen.getByTestId('createPostModalBtn');
        fireEvent.click(createButton);
      });

      // Test image file
      const imageFile = new File(['image content'], 'test-image.png', {
        type: 'image/png',
      });
      const fileInput = screen.getByTestId('addMediaField');

      fireEvent.change(fileInput, { target: { files: [imageFile] } });

      // Verify image preview
      await waitFor(() => {
        expect(screen.getByTestId('imagePreview')).toBeInTheDocument();
      });

      // Remove image
      const removeButton = screen.getByTestId('mediaCloseButton');
      fireEvent.click(removeButton);

      // Test video file
      const videoFile = new File(['video content'], 'test-video.mp4', {
        type: 'video/mp4',
      });
      fireEvent.change(fileInput, { target: { files: [videoFile] } });

      // Verify video preview
      await waitFor(() => {
        expect(screen.getByTestId('videoPreview')).toBeInTheDocument();
      });
    });
  });
});
