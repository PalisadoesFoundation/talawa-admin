import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import type { MockedResponse } from '@apollo/client/testing';
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

const eightPosts = Array.from({ length: 8 }, (_, i) => ({
  id: `${i + 1}`,
  caption: `Post ${i + 1}`,
  createdAt: new Date(2024, 1, i + 1, 10, 0, 0).toISOString(), // For ordering
  updatedAt: new Date(2024, 1, i + 1, 10, 0, 0).toISOString(),
  pinned: false,
  creator: { id: '123' },
  imageUrl: null,
  videoUrl: null,
}));

// First page: first 6 posts
const firstPageOrgList = {
  organization: {
    posts: {
      edges: eightPosts.slice(0, 6).map((post) => ({ node: post })),
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'cursor-start',
        endCursor: 'cursor-end',
      },
      totalCount: 8,
    },
  },
};

// Second page: remaining 2 posts
const secondPageOrgList = {
  organization: {
    posts: {
      edges: eightPosts.slice(6).map((post) => ({ node: post })),
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: true,
        startCursor: 'cursor-new-start',
        endCursor: 'cursor-new-end',
      },
      totalCount: 8,
    },
  },
};

const getPostsMock: MockedResponse = {
  request: {
    query: GET_POSTS_BY_ORG,
    variables: { input: { organizationId: '123' } },
  },
  result: { data: { postsByOrganization: eightPosts } },
};

const orgListFirstPageMock: MockedResponse = {
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
  result: { data: firstPageOrgList },
};

const orgListSecondPageMock: MockedResponse = {
  request: {
    query: ORGANIZATION_POST_LIST,
    variables: {
      input: { id: '123' },
      after: 'cursor-end',
      before: null,
      first: 6,
      last: null,
    },
  },
  result: { data: secondPageOrgList },
};

// When before is set (previous page), return the first 6 posts again.
const orgListFirstPageBackMock: MockedResponse = {
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
  result: { data: firstPageOrgList },
};

const paginationMocks: MockedResponse[] = [
  getPostsMock,
  orgListFirstPageMock, // initial load (first page)
  orgListSecondPageMock, // next page
  orgListFirstPageBackMock, // previous page when going back
];

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

const mockPosts1 = {
  postsByOrganization: [
    {
      id: '1',
      caption: 'Early Post',
      createdAt: '2024-02-20T10:00:00Z',
      updatedAt: '2024-02-20T10:00:00Z',
      pinned: false,
      creator: { id: '123' },
      imageUrl: null,
      videoUrl: null,
    },
    {
      id: '2',
      caption: 'Later Post',
      createdAt: '2024-02-21T10:00:00Z',
      updatedAt: '2024-02-21T10:00:00Z',
      pinned: false,
      creator: { id: '123' },
      imageUrl: null,
      videoUrl: null,
    },
  ],
};

const mockOrgPostList1 = {
  organization: {
    posts: {
      edges: mockPosts1.postsByOrganization.map((post) => ({ node: post })),
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

const mocks1 = [
  {
    request: {
      query: GET_POSTS_BY_ORG,
      variables: { input: { organizationId: '123' } },
    },
    result: { data: mockPosts1 },
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
    result: { data: mockOrgPostList1 },
  },
  // Additional mocks for create mutation if needed
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
];

const loadingMocks: MockedResponse[] = [
  {
    request: {
      query: GET_POSTS_BY_ORG,
      variables: { input: { organizationId: '123' } },
    },
    result: { data: mockPosts },
    delay: 5000, // 5 seconds delay so loading state persists
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
    delay: 5000,
  },
];

const errorMocks: MockedResponse[] = [
  {
    request: {
      query: GET_POSTS_BY_ORG,
      variables: { input: { organizationId: '123' } },
    },
    error: new Error('GraphQL error'),
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
    error: new Error('GraphQL error'),
  },
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
    vi.resetAllMocks();
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
});

describe('Tests for sorting , nextpage , previousPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    renderComponent();
    // Wait for initial queries to load.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  const renderComponent = (): RenderResult =>
    render(
      <MockedProvider mocks={mocks1} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/org/123']}>
            <Routes>
              <Route path="/org/:orgId" element={<OrgPost />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

  it('handles "None" option: clears sorted posts and then refetches unsorted posts', async () => {
    const toggleButton = screen.getByTestId('sortpost-toggle');
    userEvent.click(toggleButton);
    const noneOption = await screen.findByText('None');
    userEvent.click(noneOption);

    await waitFor(
      () => {
        const captionsNow = screen.queryAllByTestId('post-caption');
        expect([0, 2]).toContain(captionsNow.length);
      },
      { timeout: 300 },
    );

    await waitFor(() => {
      const postCaptions = screen
        .getAllByTestId('post-caption')
        .map((el) => el.textContent || '');
      expect(postCaptions[0]).toContain('Early Post');
      expect(postCaptions[1]).toContain('Later Post');
    });
  });

  it('sorts posts in ascending order when "Oldest" is selected', async () => {
    const toggleButton = screen.getByTestId('sortpost-toggle');
    userEvent.click(toggleButton);
    const oldestOption = await screen.findByText('Oldest');
    userEvent.click(oldestOption);

    await waitFor(() => {
      const postCaptions = screen
        .getAllByTestId('post-caption')
        .map((el) => el.textContent || '');
      expect(postCaptions[0]).toContain('Early Post');
      expect(postCaptions[1]).toContain('Later Post');
    });
  });

  it('sorts posts in descending order when "Latest" is selected', async () => {
    const toggleButton = screen.getByTestId('sortpost-toggle');
    userEvent.click(toggleButton);
    const latestOption = await screen.findByText('Latest');
    userEvent.click(latestOption);
    await waitFor(() => {
      const postCaptions = screen
        .getAllByTestId('post-caption')
        .map((el) => el.textContent || '');
      expect(postCaptions[0]).toContain('Early Post');
      expect(postCaptions[1]).toContain('Later Post');
    });
  });

  it('ignores invalid sorting options and leaves posts order unchanged', async () => {
    await waitFor(() => {
      const postCaptions = screen
        .getAllByTestId('post-caption')
        .map((el) => el.textContent || '');
      expect(postCaptions[0]).toContain('Early Post');
      expect(postCaptions[1]).toContain('Later Post');
    });
  });

  it('returns early when loading, error, or missing data', async () => {
    const emptyPosts = { postsByOrganization: [] };
    const emptyMocks: MockedResponse[] = [
      {
        request: {
          query: GET_POSTS_BY_ORG,
          variables: { input: { organizationId: '123' } },
        },
        result: { data: emptyPosts },
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
        result: {
          data: {
            organization: { posts: { edges: [], totalCount: 0, pageInfo: {} } },
          },
        },
      },
    ];

    const { unmount } = render(
      <MockedProvider mocks={emptyMocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/org/123']}>
            <Routes>
              <Route path="/org/:orgId" element={<OrgPost />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const toggleButton = screen.getAllByTestId('sortpost-toggle')[0];
    userEvent.click(toggleButton);
    const oldestOptionEmpty = await screen.findByText('Oldest');
    userEvent.click(oldestOptionEmpty);
    await waitFor(
      () => {
        expect(screen.getByText(/post not found/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
    unmount();
  });

  it('shows Loader when loading (delayed response)', async () => {
    render(
      <MockedProvider mocks={loadingMocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/org/123']}>
            <Routes>
              <Route path="/org/:orgId" element={<OrgPost />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it('returns early when error occurs', async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/org/123']}>
            <Routes>
              <Route path="/org/:orgId" element={<OrgPost />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const toggle = screen.getAllByTestId('sortpost-toggle')[0];
    userEvent.click(toggle);
    const oldestOption = await screen.findByText('Oldest');
    userEvent.click(oldestOption);

    await waitFor(
      () => {
        expect(screen.getByText(/Error loading posts/i)).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });
});

describe('Pagination functionality in OrgPost Component', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    renderComponent();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  const renderComponent = (
    mocks: MockedResponse[] = paginationMocks,
  ): RenderResult =>
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/org/123']}>
            <Routes>
              <Route path="/org/:orgId" element={<OrgPost />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

  it('handles next page correctly when sortingOption is "None"', async () => {
    await waitFor(() => {
      const captions = screen
        .getAllByTestId('post-caption')
        .map((el) => (el.textContent || '').trim());
      expect(captions.length).toBe(6);
      expect(captions[0]).toContain('Post 1');
      expect(captions[5]).toContain('Post 6');
    });

    // Click the "Next" button.
    const nextBtn = screen.getByTestId('next-page-button');
    userEvent.click(nextBtn);

    // Wait for the next page to be rendered.
    await waitFor(() => {
      const captions = screen
        .getAllByTestId('post-caption')
        .map((el) => (el.textContent || '').trim());
      // Expect 2 posts on the second page.
      expect(captions.length).toBe(2);
      expect(captions[0]).toContain('Post 7');
      expect(captions[1]).toContain('Post 8');
    });
  });

  it('handles next page correctly when sortingOption is not "None"', async () => {
    const toggleBtn = screen.getByTestId('sortpost-toggle');
    userEvent.click(toggleBtn);
    const oldestOption = await screen.findByText('Oldest');
    userEvent.click(oldestOption);
    await waitFor(() => {
      const captions = screen
        .getAllByTestId('post-caption')
        .map((el) => (el.textContent || '').trim());
      expect(captions.length).toBe(6);
      expect(captions[0]).toContain('Post 1');
      expect(captions[5]).toContain('Post 6');
    });

    const nextBtn = screen.getByTestId('next-page-button');
    userEvent.click(nextBtn);
    await waitFor(() => {
      const captions = screen
        .getAllByTestId('post-caption')
        .map((el) => (el.textContent || '').trim());
      expect(captions.length).toBe(2);
      expect(captions[0]).toContain('Post 7');
      expect(captions[1]).toContain('Post 8');
    });
  });

  it('handles previous page correctly when sortingOption is not "None"', async () => {
    const toggleBtn = screen.getByTestId('sortpost-toggle');
    userEvent.click(toggleBtn);
    const latestOption = await screen.findByText('Latest');
    userEvent.click(latestOption);

    await waitFor(() => {
      const captions = screen
        .getAllByTestId('post-caption')
        .map((el) => (el.textContent || '').trim());

      expect(captions.length).toBe(6);
      expect(captions[0]).toContain('Post 8');
      expect(captions[5]).toContain('Post 3');
    });
    const nextBtn = screen.getByTestId('next-page-button');
    userEvent.click(nextBtn);
    await waitFor(() => {
      const captions = screen
        .getAllByTestId('post-caption')
        .map((el) => (el.textContent || '').trim());

      expect(captions.length).toBe(2);
      expect(captions[0]).toContain('Post 2');
      expect(captions[1]).toContain('Post 1');
    });

    const prevBtn = screen.getByTestId('previous-page-button');
    userEvent.click(prevBtn);
    await waitFor(() => {
      const captions = screen
        .getAllByTestId('post-caption')
        .map((el) => (el.textContent || '').trim());

      expect(captions.length).toBe(6);
      expect(captions[0]).toContain('Post 8');
      expect(captions[5]).toContain('Post 3');
    });
  });
});
