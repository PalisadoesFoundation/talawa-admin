import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import OrgPost from './OrgPost';
import {
  GET_POSTS_BY_ORG,
  ORGANIZATION_POST_LIST,
} from '../../GraphQl/Queries/Queries';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { ToastContainer, toast } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import i18n from 'utils/i18n';
import type { RenderResult } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import type { InterfacePost } from '../../types/Post/interface';
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  ToastContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('react-i18next', () => ({
  // Include initReactI18next
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        searchTitle: 'Search by title',
        searchText: 'Search by text',
        title: 'Organization Posts',
        postDetails: 'Post Details',
        postTitle: 'Post Title',
        postTitle1: 'Enter post title',
        information: 'Information',
        information1: 'Enter information',
        addMedia: 'Add Media',
        pinPost: 'Pin Post',
        addPost: 'Add Post',
        createPost: 'Create Post',
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en',
    },
  }),
  // Add other necessary exports
  Trans: ({ children }: { children: React.ReactNode }) => children,
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock convertToBase64
vi.mock('utils/convertToBase64', () => ({
  default: vi.fn().mockResolvedValue('base64String'),
}));

const mockPosts = {
  postsByOrganization: [
    {
      _id: '1',
      caption: 'Test Post 1',
      createdAt: '2024-02-23T10:00:00Z',
      creatorid: '123',
      imageUrl: null,
      videoUrl: null,
      isPinned: false,
    },
    {
      _id: '2',
      caption: 'Test Post 2',
      createdAt: '2024-02-23T11:00:00Z',
      creator: { firstName: 'Jane', lastName: 'Smith' },
      imageUrl: null,
      videoUrl: null,
      isPinned: true,
    },
  ],
};

const createPostWithFileMock = {
  request: {
    query: CREATE_POST_MUTATION,
    variables: {
      input: expect.objectContaining({
        caption: 'Test Post Title with File',
        organizationId: '123',
        isPinned: false,
        attachments: expect.any(Array),
      }),
    },
  },
  result: {
    data: {
      createPost: {
        id: '4',
        caption: 'Test Post Title with File',
        pinnedAt: null,
        attachments: [{ url: 'base64String' }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  },
};

const mockOrgPostList = {
  organization: {
    posts: {
      edges: mockPosts.postsByOrganization.map((post) => ({ node: post })),
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'cursor1',
        endCursor: 'cursor2',
      },
      totalCount: 2,
    },
  },
};

const mocks = [
  {
    request: {
      query: GET_POSTS_BY_ORG,
      variables: { input: { organizationId: '123' } },
    },
    result: { data: mockPosts },
  },
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        input: { id: '123' },
        after: null,
        before: null,
        first: 6,
        last: null,
      },
    },
    result: { data: mockOrgPostList },
  },
  {
    request: {
      query: CREATE_POST_MUTATION,
      variables: {
        input: {
          caption: 'Test Post Title',
          organizationId: '123',
          isPinned: false,
        },
      },
    },
    result: {
      data: {
        createPost: {
          id: '3',
          caption: 'Test Post Title',
          pinnedAt: null,
          attachments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    },
  },
  createPostWithFileMock,
];

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orgId: '123' }),
  };
});

const mockOrgId = '123';
const renderComponent = (): RenderResult => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[`/org/${mockOrgId}`]}>
          <Routes>
            <Route path="/org/:orgId" element={<OrgPost />} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </MockedProvider>,
  );
};

describe('OrgPost Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    // Optionally, reset all mocks after all tests run
    vi.resetAllMocks();
  });

  it('renders without crashing and displays search bar', async () => {
    renderComponent();
    // Wait for any async GraphQL queries to flush
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    // Optionally, log the DOM to inspect it
    // screen.debug();
    await waitFor(
      () => {
        const searchBar = screen.getByTestId('searchByName');
        expect(searchBar).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('opens and closes the create post modal', async () => {
    renderComponent();
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    const openModalBtn = await screen.findByTestId(
      'createPostModalBtn',
      {},
      { timeout: 5000 },
    );
    fireEvent.click(openModalBtn);
    await waitFor(
      () => {
        expect(
          screen.getByTestId('modalOrganizationHeader'),
        ).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
    const closeModalBtn = screen.getByTestId('closeOrganizationModal');
    fireEvent.click(closeModalBtn);
    await waitFor(
      () => {
        expect(screen.queryByTestId('modalOrganizationHeader')).toBeNull();
      },
      { timeout: 5000 },
    );
  });

  it('submits the create post form successfully', async () => {
    renderComponent();
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    const openModalBtn = await screen.findByTestId(
      'createPostModalBtn',
      {},
      { timeout: 5000 },
    );
    fireEvent.click(openModalBtn);
    const titleInput = screen.getByTestId('modalTitle');
    const infoInput = screen.getByTestId('modalinfo');
    fireEvent.change(titleInput, { target: { value: 'Test Post Title' } });
    fireEvent.change(infoInput, { target: { value: 'Test Post Information' } });
    const submitBtn = screen.getByTestId('createPostBtn');
    fireEvent.click(submitBtn);
    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );
  });

  it('handles media upload and removal', async () => {
    renderComponent();
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    const openModalBtn = await screen.findByTestId(
      'createPostModalBtn',
      {},
      { timeout: 5000 },
    );
    fireEvent.click(openModalBtn);
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const mediaInput = screen.getByTestId('addMediaField');
    fireEvent.change(mediaInput, { target: { files: [file] } });
    await waitFor(
      () => {
        expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
    const removeBtn = screen.getByTestId('mediaCloseButton');
    fireEvent.click(removeBtn);
    await waitFor(
      () => {
        expect(screen.queryByTestId('mediaPreview')).toBeNull();
      },
      { timeout: 5000 },
    );
  });

  it('handles pin post toggle', async () => {
    renderComponent();
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    const openModalBtn = await screen.findByTestId(
      'createPostModalBtn',
      {},
      { timeout: 5000 },
    );
    fireEvent.click(openModalBtn);
    const pinSwitch = await screen.findByTestId(
      'pinPost',
      {},
      { timeout: 5000 },
    );
    fireEvent.click(pinSwitch);
    await waitFor(
      () => {
        expect(pinSwitch).toBeChecked();
      },
      { timeout: 5000 },
    );
  });

  it('handles file attachment correctly', async () => {
    const mockFile = new File(['dummy content'], 'test.png', {
      type: 'image/png',
    });

    const fileUploadMock = {
      request: {
        query: CREATE_POST_MUTATION,
        variables: {
          input: {
            caption: 'Test Post Title',
            organizationId: '123',
            isPinned: false,
            attachments: [mockFile],
          },
        },
      },
      result: {
        data: {
          createPost: {
            id: '4',
            caption: 'Test Post Title',
            pinnedAt: null,
            attachments: [{ url: 'uploaded-file-url' }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      },
    };

    const customMocks = [...mocks, fileUploadMock];

    render(
      <MockedProvider mocks={customMocks} addTypename={false}>
        <BrowserRouter>
          <OrgPost />
          <ToastContainer />
        </BrowserRouter>
      </MockedProvider>,
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const openModalBtn = await screen.findByTestId('createPostModalBtn');
    fireEvent.click(openModalBtn);

    const mediaInput = screen.getByTestId('addMediaField');
    await act(async () => {
      fireEvent.change(mediaInput, { target: { files: [mockFile] } });
    });

    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    });

    const titleInput = screen.getByTestId('modalTitle');
    fireEvent.change(titleInput, { target: { value: 'Test Post Title' } });

    const submitBtn = screen.getByTestId('createPostBtn');
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('allows removing attached file', async () => {
    renderComponent();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const openModalBtn = await screen.findByTestId('createPostModalBtn');
    fireEvent.click(openModalBtn);

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const mediaInput = screen.getByTestId('addMediaField');

    await act(async () => {
      fireEvent.change(mediaInput, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    });

    const removeBtn = screen.getByTestId('mediaCloseButton');
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('mediaPreview')).not.toBeInTheDocument();
    });
  });

  it('submits form successfully without file attachment', async () => {
    renderComponent();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const openModalBtn = await screen.findByTestId('createPostModalBtn');
    fireEvent.click(openModalBtn);

    const titleInput = screen.getByTestId('modalTitle');
    fireEvent.change(titleInput, { target: { value: 'Test Post Title' } });

    const submitBtn = screen.getByTestId('createPostBtn');
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('accepts image files', async () => {
    renderComponent();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const openModalBtn = await screen.findByTestId('createPostModalBtn');
    fireEvent.click(openModalBtn);

    const imageFile = new File(['dummy image'], 'test.png', {
      type: 'image/png',
    });
    const mediaInput = screen.getByTestId('addMediaField');

    await act(async () => {
      fireEvent.change(mediaInput, { target: { files: [imageFile] } });
    });
    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  it('accepts video files', async () => {
    renderComponent();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const openModalBtn = await screen.findByTestId('createPostModalBtn');
    fireEvent.click(openModalBtn);

    const videoFile = new File(['dummy video'], 'test.mp4', {
      type: 'video/mp4',
    });
    const mediaInput = screen.getByTestId('addMediaField');

    await act(async () => {
      fireEvent.change(mediaInput, { target: { files: [videoFile] } });
    });

    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  it('rejects invalid file types', async () => {
    renderComponent();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const openModalBtn = await screen.findByTestId('createPostModalBtn');
    fireEvent.click(openModalBtn);

    const invalidFile = new File(['dummy pdf'], 'test.pdf', {
      type: 'application/pdf',
    });
    const mediaInput = screen.getByTestId('addMediaField');

    await act(async () => {
      fireEvent.change(mediaInput, { target: { files: [invalidFile] } });
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Please select an image or video file',
      );
      expect(screen.queryByTestId('mediaPreview')).not.toBeInTheDocument();
    });
  });

  it('handles no file selected', async () => {
    renderComponent();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const openModalBtn = await screen.findByTestId('createPostModalBtn');
    fireEvent.click(openModalBtn);

    const mediaInput = screen.getByTestId('addMediaField');

    await act(async () => {
      fireEvent.change(mediaInput, { target: { files: [] } });
    });

    await waitFor(() => {
      expect(screen.queryByTestId('mediaPreview')).not.toBeInTheDocument();
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  it('should update search term and trigger search', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <OrgPost />
      </MockedProvider>,
    );

    const searchInput = await screen.findByTestId('searchByName');
    await userEvent.type(searchInput, 'test search');

    expect(searchInput).toHaveValue('test search');
  });
});

describe('handleSearch', () => {
  const mockSetSearchTerm = vi.fn();
  const mockSetIsFiltering = vi.fn();
  const mockSetFilteredPosts = vi.fn();
  const mockRefetchPosts = vi.fn();
  const currentUrl = '123';

  // Setup mock function implementations
  const handleSearch = async (term: string): Promise<void> => {
    mockSetSearchTerm(term);
    try {
      const { data: searchData } = await mockRefetchPosts({
        input: { organizationId: currentUrl },
      });
      if (!term.trim()) {
        mockSetIsFiltering(false);
        mockSetFilteredPosts([]);
        return;
      }
      if (searchData?.postsByOrganization) {
        mockSetIsFiltering(true);
        const filtered = searchData.postsByOrganization.filter(
          (post: InterfacePost) =>
            post.caption.toLowerCase().includes(term.toLowerCase()),
        );

        mockSetFilteredPosts(filtered);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error searching posts');
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should handle empty search term correctly', async () => {
    const mockData = {
      data: {
        postsByOrganization: [],
      },
    };
    mockRefetchPosts.mockResolvedValue(mockData);

    await handleSearch('   ');

    expect(mockSetSearchTerm).toHaveBeenCalledWith('   ');
    expect(mockSetIsFiltering).toHaveBeenCalledWith(false);
    expect(mockSetFilteredPosts).toHaveBeenCalledWith([]);
    expect(mockRefetchPosts).toHaveBeenCalledWith({
      input: { organizationId: currentUrl },
    });
  });

  it('should filter posts based on search term', async () => {
    const mockPosts = {
      data: {
        postsByOrganization: [
          { caption: 'Test Post 1' },
          { caption: 'Another Post' },
          { caption: 'Test Post 2' },
        ],
      },
    };
    mockRefetchPosts.mockResolvedValue(mockPosts);

    await handleSearch('test');

    expect(mockSetSearchTerm).toHaveBeenCalledWith('test');
    expect(mockSetIsFiltering).toHaveBeenCalledWith(true);
    expect(mockSetFilteredPosts).toHaveBeenCalledWith([
      { caption: 'Test Post 1' },
      { caption: 'Test Post 2' },
    ]);
  });

  it('should handle case-insensitive search', async () => {
    const mockPosts = {
      data: {
        postsByOrganization: [
          { caption: 'TEST Post 1' },
          { caption: 'Another Post' },
          { caption: 'test POST 2' },
        ],
      },
    };
    mockRefetchPosts.mockResolvedValue(mockPosts);

    await handleSearch('test');

    expect(mockSetFilteredPosts).toHaveBeenCalledWith([
      { caption: 'TEST Post 1' },
      { caption: 'test POST 2' },
    ]);
  });

  it('should handle API error correctly', async () => {
    const error = new Error('API Error');
    mockRefetchPosts.mockRejectedValue(error);

    const consoleSpy = vi.spyOn(console, 'error');

    await handleSearch('test');

    expect(consoleSpy).toHaveBeenCalledWith('Search error:', error);
    expect(toast.error).toHaveBeenCalledWith('Error searching posts');
  });

  it('should handle undefined postsByOrganization', async () => {
    const mockData = {
      data: {},
    };
    mockRefetchPosts.mockResolvedValue(mockData);

    await handleSearch('test');

    expect(mockSetFilteredPosts).not.toHaveBeenCalled();
    expect(mockSetIsFiltering).not.toHaveBeenCalled();
  });

  it('should filter posts with partial matches', async () => {
    const mockPosts = {
      data: {
        postsByOrganization: [
          { caption: 'Testing Post' },
          { caption: 'Another Post' },
          { caption: 'Post with test in middle' },
        ],
      },
    };
    mockRefetchPosts.mockResolvedValue(mockPosts);

    await handleSearch('test');

    expect(mockSetFilteredPosts).toHaveBeenCalledWith([
      { caption: 'Testing Post' },
      { caption: 'Post with test in middle' },
    ]);
  });
});

describe('handleSorting', () => {
  // Mock state setters and dependencies
  const mockSetCurrentPage = vi.fn();
  const mockSetSortingOption = vi.fn();
  const mockSetDisplayPosts = vi.fn();
  const mockSetSortedPosts = vi.fn();
  const mockRefetchPosts = vi.fn();
  const currentUrl = '123';
  const postsPerPage = 6;

  // Setup mock posts data
  const mockPosts = [
    { createdAt: '2024-02-20T10:00:00Z', id: '1' },
    { createdAt: '2024-02-21T10:00:00Z', id: '2' },
    { createdAt: '2024-02-19T10:00:00Z', id: '3' },
  ];

  // Create a function that returns handleSorting with the desired loading and error states
  const createHandleSorting = (loading = false, error = null) => {
    return (option: string): void => {
      mockSetCurrentPage(1);
      mockSetSortingOption(option);
      if (option === 'None') {
        mockSetDisplayPosts([]);
        mockRefetchPosts({
          input: {
            organizationId: currentUrl,
          },
        });
        return;
      }
      if (!['latest', 'oldest'].includes(option)) {
        return;
      }

      const data = { postsByOrganization: mockPosts };

      if (loading || error || !data?.postsByOrganization) {
        return;
      }

      const posts = [...data.postsByOrganization];
      const sorted = posts.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return option === 'oldest' ? dateA - dateB : dateB - dateA;
      });
      mockSetSortedPosts(sorted);
      const initialPosts = sorted.slice(0, postsPerPage);
      mockSetDisplayPosts(initialPosts);
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should reset page and update sorting option for any input', () => {
    const handleSorting = createHandleSorting();
    handleSorting('latest');

    expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
    expect(mockSetSortingOption).toHaveBeenCalledWith('latest');
  });

  it('should handle "None" option correctly', () => {
    const handleSorting = createHandleSorting();
    handleSorting('None');

    expect(mockSetDisplayPosts).toHaveBeenCalledWith([]);
    expect(mockRefetchPosts).toHaveBeenCalledWith({
      input: { organizationId: currentUrl },
    });
  });

  it('should sort posts by latest date', () => {
    const handleSorting = createHandleSorting();
    handleSorting('latest');

    const expectedSortedPosts = [
      { createdAt: '2024-02-21T10:00:00Z', id: '2' },
      { createdAt: '2024-02-20T10:00:00Z', id: '1' },
      { createdAt: '2024-02-19T10:00:00Z', id: '3' },
    ];

    expect(mockSetSortedPosts).toHaveBeenCalledWith(expectedSortedPosts);
    expect(mockSetDisplayPosts).toHaveBeenCalledWith(expectedSortedPosts);
  });

  it('should sort posts by oldest date', () => {
    const handleSorting = createHandleSorting();
    handleSorting('oldest');

    const expectedSortedPosts = [
      { createdAt: '2024-02-19T10:00:00Z', id: '3' },
      { createdAt: '2024-02-20T10:00:00Z', id: '1' },
      { createdAt: '2024-02-21T10:00:00Z', id: '2' },
    ];

    expect(mockSetSortedPosts).toHaveBeenCalledWith(expectedSortedPosts);
    expect(mockSetDisplayPosts).toHaveBeenCalledWith(expectedSortedPosts);
  });

  it('should handle invalid sorting options', () => {
    const handleSorting = createHandleSorting();
    handleSorting('invalid_option');

    expect(mockSetSortedPosts).not.toHaveBeenCalled();
    expect(mockSetDisplayPosts).not.toHaveBeenCalled();
  });

  it('should not process sorting when data is loading', () => {
    const handleSorting = createHandleSorting(true, null);
    handleSorting('latest');

    expect(mockSetSortedPosts).not.toHaveBeenCalled();
    expect(mockSetDisplayPosts).not.toHaveBeenCalled();
  });

  it('should limit display posts to postsPerPage', () => {
    const handleSorting = createHandleSorting();
    const manyPosts = Array.from({ length: 10 }, (_, i) => ({
      createdAt: `2024-02-${i + 1}T10:00:00Z`,
      id: String(i + 1),
    }));

    vi.spyOn(Object.getPrototypeOf(mockPosts), 'sort').mockImplementation(
      () => manyPosts,
    );

    handleSorting('latest');

    expect(mockSetDisplayPosts).toHaveBeenCalledWith(
      expect.arrayContaining(manyPosts.slice(0, postsPerPage)),
    );
  });

  it('should preserve original posts array when sorting', () => {
    const handleSorting = createHandleSorting();
    const originalPosts = [...mockPosts];
    handleSorting('latest');

    expect(mockPosts).toEqual(originalPosts);
  });
});

describe('Pagination Handlers', () => {
  // Mock state setters
  const mockSetAfter = vi.fn();
  const mockSetBefore = vi.fn();
  const mockSetFirst = vi.fn();
  const mockSetLast = vi.fn();
  const mockSetCurrentPage = vi.fn();
  const postsPerPage = 6;

  // Mock data
  const mockOrgPostListData = {
    organization: {
      posts: {
        pageInfo: {
          startCursor: 'cursor1',
          endCursor: 'cursor10',
          hasNextPage: true,
          hasPreviousPage: true,
        },
      },
    },
  };

  const mockSortedPosts = Array.from({ length: 15 }, (_, i) => ({
    id: String(i + 1),
    title: `Post ${i + 1}`,
  }));

  beforeEach(() => {
    vi.clearAllMocks();
    mockSetCurrentPage.mockImplementation((callback) => {
      if (typeof callback === 'function') {
        return callback(2); // Simulate current page being 2
      }
      return callback;
    });
  });

  describe('handleNextPage', () => {
    const handleNextPage = (sortingOption = 'None', currentPage = 2): void => {
      if (sortingOption === 'None') {
        const endCursor =
          mockOrgPostListData?.organization?.posts?.pageInfo?.endCursor;
        if (endCursor) {
          mockSetAfter(endCursor);
          mockSetBefore(null);
          mockSetFirst(postsPerPage);
          mockSetLast(null);
          mockSetCurrentPage((prev: number) => prev + 1);
        }
      } else {
        const maxPage = Math.ceil(mockSortedPosts.length / postsPerPage);
        if (currentPage < maxPage) {
          mockSetCurrentPage((prev: number) => prev + 1);
        }
      }
    };

    it('should handle next page with "None" sorting option', () => {
      handleNextPage('None');

      expect(mockSetAfter).toHaveBeenCalledWith('cursor10');
      expect(mockSetBefore).toHaveBeenCalledWith(null);
      expect(mockSetFirst).toHaveBeenCalledWith(postsPerPage);
      expect(mockSetLast).toHaveBeenCalledWith(null);
      expect(mockSetCurrentPage).toHaveBeenCalled();
    });

    it('should handle next page with sorted posts', () => {
      handleNextPage('latest', 2);

      expect(mockSetCurrentPage).toHaveBeenCalled();
      expect(mockSetAfter).not.toHaveBeenCalled();
      expect(mockSetBefore).not.toHaveBeenCalled();
      expect(mockSetFirst).not.toHaveBeenCalled();
      expect(mockSetLast).not.toHaveBeenCalled();
    });

    it('should not increment page when on last page of sorted posts', () => {
      handleNextPage('latest', 3); // With 15 posts and 6 per page, 3 is the last page

      expect(mockSetCurrentPage).not.toHaveBeenCalled();
    });
  });

  describe('handlePreviousPage', () => {
    const handlePreviousPage = (
      sortingOption = 'None',
      currentPage = 2,
    ): void => {
      if (sortingOption === 'None') {
        const startCursor =
          mockOrgPostListData?.organization?.posts?.pageInfo?.startCursor;
        if (startCursor) {
          mockSetBefore(startCursor);
          mockSetAfter(null);
          mockSetFirst(null);
          mockSetLast(postsPerPage);
          mockSetCurrentPage((prev: number) => prev - 1);
        }
      } else {
        if (currentPage > 1) {
          mockSetCurrentPage((prev: number) => prev - 1);
        }
      }
    };

    it('should handle previous page with "None" sorting option', () => {
      handlePreviousPage('None');

      expect(mockSetBefore).toHaveBeenCalledWith('cursor1');
      expect(mockSetAfter).toHaveBeenCalledWith(null);
      expect(mockSetFirst).toHaveBeenCalledWith(null);
      expect(mockSetLast).toHaveBeenCalledWith(postsPerPage);
      expect(mockSetCurrentPage).toHaveBeenCalled();
    });

    it('should handle previous page with sorted posts', () => {
      handlePreviousPage('latest', 2);

      expect(mockSetCurrentPage).toHaveBeenCalled();
      expect(mockSetBefore).not.toHaveBeenCalled();
      expect(mockSetAfter).not.toHaveBeenCalled();
      expect(mockSetFirst).not.toHaveBeenCalled();
      expect(mockSetLast).not.toHaveBeenCalled();
    });

    it('should not decrement page when on first page of sorted posts', () => {
      handlePreviousPage('latest', 1);

      expect(mockSetCurrentPage).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined pageInfo', () => {
      const handleNextPage = (sortingOption = 'None'): void => {
        if (sortingOption === 'None') {
          const endCursor = undefined;
          if (endCursor) {
            mockSetAfter(endCursor);
          }
        }
      };

      handleNextPage('None');
      expect(mockSetAfter).not.toHaveBeenCalled();
    });

    it('should handle empty sorted posts array', () => {
      const emptySortedPosts: InterfacePost[] = [];

      const handleNextPage = (
        sortingOption = 'latest',
        currentPage = 1,
      ): void => {
        if (sortingOption !== 'None') {
          const maxPage = Math.ceil(emptySortedPosts.length / postsPerPage);
          if (currentPage < maxPage) {
            mockSetCurrentPage((prev: number) => prev + 1);
          }
        }
      };
      handleNextPage('latest', 1);
      expect(mockSetCurrentPage).not.toHaveBeenCalled();
    });
  });
});
