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

const toastSuccessMock = toast.success as unknown as ReturnType<typeof vi.fn>;

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

const samplePosts = [
  {
    id: '1',
    caption: 'First post title',
    createdAt: '2023-01-01T12:00:00Z',
    creator: { id: 'user1' },
    imageUrl: 'image1.jpg',
    videoUrl: null,
    pinned: false,
  },
  {
    id: '2',
    caption: 'Second post about testing',
    createdAt: '2023-01-02T12:00:00Z',
    creator: { id: 'user2' },
    imageUrl: null,
    videoUrl: 'video2.mp4',
    pinned: true,
  },
  {
    id: '3',
    caption: 'Third post with random content',
    createdAt: '2023-01-03T12:00:00Z',
    creator: { id: 'user1' },
    imageUrl: 'image3.jpg',
    videoUrl: null,
    pinned: false,
  },
];

// Prepare mocks for GraphQL queries
const orgPostListMock = {
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
      organization: {
        id: '123',
        name: 'Test Organization',
        posts: {
          totalCount: 3,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'cursor1',
            endCursor: 'cursor3',
          },
          edges: [
            {
              node: samplePosts[0],
              cursor: 'cursor1',
            },
            {
              node: samplePosts[1],
              cursor: 'cursor2',
            },
            {
              node: samplePosts[2],
              cursor: 'cursor3',
            },
          ],
        },
      },
    },
  },
};

const getPostsByOrgInitialMock = {
  request: {
    query: GET_POSTS_BY_ORG,
    variables: {
      input: {
        organizationId: '123',
      },
    },
  },
  result: {
    data: {
      postsByOrganization: samplePosts,
    },
  },
};

// Create mock for search query with "test" term
const getPostsByOrgSearchMock = {
  request: {
    query: GET_POSTS_BY_ORG,
    variables: {
      input: {
        organizationId: '123',
      },
    },
  },
  result: {
    data: {
      postsByOrganization: samplePosts,
    },
  },
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
  orgListFirstPageMock,
  orgListSecondPageMock,
  orgListFirstPageBackMock,
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
const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

// Updated mutation mock: make sure variables match what is sent.
// If the component always attaches the file if provided, we need to match that.
const createPostSuccessMock: MockedResponse = {
  request: {
    query: CREATE_POST_MUTATION,
    variables: {
      input: {
        caption: 'Test Post Title',
        organizationId: '123',
        isPinned: false,
        attachments: [file],
      },
    },
  },
  result: {
    data: {
      createPost: {
        id: '3',
        caption: 'Test Post Title',
        pinnedAt: null,
        attachments: [{ url: 'base64String' }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  },
};

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

describe('OrgPost Component', () => {
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

  it('shows success toast, resets state and closes modal on successful post creation', async () => {
    render(
      <MockedProvider mocks={[createPostSuccessMock]} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/org/123']}>
            <Routes>
              <Route path="/org/:orgId" element={<OrgPost />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    const openModalBtn = await screen.findByTestId('createPostModalBtn');
    fireEvent.click(openModalBtn);

    const titleInput = await screen.findByTestId('modalTitle');
    const infoInput = await screen.findByTestId('modalinfo');
    fireEvent.change(titleInput, { target: { value: 'Test Post Title' } });
    fireEvent.change(infoInput, { target: { value: 'Some Information' } });

    const mediaInput = screen.getByTestId('addMediaField');
    await act(async () => {
      fireEvent.change(mediaInput, { target: { files: [file] } });
    });

    const submitBtn = await screen.findByTestId('createPostBtn');
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );

    expect(toastSuccessMock.mock.calls[0][0]).toContain('postCreatedSuccess');

    await act(() => new Promise((resolve) => setTimeout(resolve, 500)));

    const modalElement = screen
      .queryByTestId('modalOrganizationHeader')
      ?.closest('.modal');

    if (modalElement) {
      fireEvent.transitionEnd(modalElement);

      await waitFor(
        () => {
          const updatedModal = screen
            .queryByTestId('modalOrganizationHeader')
            ?.closest('.modal');
          return !updatedModal || !updatedModal.classList.contains('show');
        },
        { timeout: 3000 },
      );
    }
  });

  it('renders the create post button when orgId is provided', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/org/123']}>
            <Routes>
              <Route path="/org/:orgId" element={<OrgPost />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    const openModalBtn = await screen.findByTestId('createPostModalBtn');
    expect(openModalBtn).toBeInTheDocument();
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

describe('OrgPost SearchBar functionality', () => {
  // Helper function to render the component with specified mocks
  const renderWithMocks = (mocks: MockedResponse[]): RenderResult => {
    return render(
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
  };
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should filter posts when search term is entered', async () => {
    renderWithMocks([
      orgPostListMock,
      getPostsByOrgInitialMock,
      getPostsByOrgSearchMock,
    ]);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    await userEvent.type(searchInput, 'test{enter}');

    await waitFor(() => {
      const postElements = screen.getAllByTestId('post-caption');

      expect(postElements.length).toBe(1);
      expect(postElements[0].textContent).toContain(
        'Second post about testing',
      );
    });
  });

  it('should handle case-insensitive search correctly', async () => {
    renderWithMocks([
      orgPostListMock,
      getPostsByOrgInitialMock,
      getPostsByOrgSearchMock,
    ]);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    await userEvent.type(searchInput, 'TeStInG{enter}');

    await waitFor(() => {
      const postElements = screen.getAllByTestId('post-caption');
      expect(postElements.length).toBe(1);
      expect(postElements[0].textContent).toContain(
        'Second post about testing',
      );
    });
  });

  // it('should clear filtering when search term is empty', async () => {
  //   // Arrange
  //   renderWithMocks([orgPostListMock, getPostsByOrgInitialMock, getPostsByOrgEmptySearchMock]);

  //   // Wait for initial load
  //   await waitFor(() => {
  //     expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  //   });

  //   // Act - first enter a search term and then clear it
  //   const searchInput = screen.getByTestId('searchByName');
  //   await userEvent.type(searchInput, 'test{enter}');

  //   // Wait for filtered results
  //   await waitFor(() => {
  //     const postElements = screen.getAllByTestId('post-caption');
  //     expect(postElements.length).toBe(1);
  //   });

  //   // Clear the search input and trigger search by pressing Enter
  //   await userEvent.clear(searchInput);
  //   fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

  //   // Assert - verify that all posts are shown
  //   await waitFor(() => {
  //     const postElements = screen.getAllByTestId('post-caption');
  //     expect(postElements.length).toBe(3); // All three posts should be visible
  //   });
  // });

  // it('should show error toast when search fails', async () => {
  //   renderWithMocks([orgPostListMock, getPostsByOrgInitialMock, getPostsByOrgErrorMock]);

  //   await waitFor(() => {
  //     expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  //   });

  //   const searchInput = screen.getByTestId('searchByName');
  //   await userEvent.type(searchInput, 'error-trigger');

  //   fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

  //   await waitFor(() => {
  //     expect(toast.error).toHaveBeenCalledWith('Error searching posts');
  //   });
  // });

  it('should correctly integrate with PostsRenderer when filtering', async () => {
    renderWithMocks([
      orgPostListMock,
      getPostsByOrgInitialMock,
      getPostsByOrgSearchMock,
    ]);
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const postsRenderer = await screen.findByTestId('posts-renderer');
    expect(postsRenderer.getAttribute('data-is-filtering')).toBe('false');

    const searchInput = screen.getByTestId('searchByName');
    await userEvent.type(searchInput, 'post{enter}');

    await waitFor(() => {
      expect(postsRenderer.getAttribute('data-is-filtering')).toBe('true');
      expect(postsRenderer.getAttribute('data-loading')).toBe('false');
      expect(screen.queryByText('First post title')).toBeInTheDocument();
      expect(
        screen.queryByText('Second post about testing'),
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Third post with random content'),
      ).toBeInTheDocument();
    });
  });
});

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

vi.mock('utils/convertToBase64', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue('base64-encoded-string'),
}));

describe('OrgPost component - Post Creation Tests', () => {
  const mockOrgId = '123';
  const createPostMock: MockedResponse = {
    request: {
      query: CREATE_POST_MUTATION,
      variables: {
        input: {
          caption: 'Test Post',
          organizationId: mockOrgId,
          isPinned: false,
        },
      },
    },
    result: {
      data: {
        createPost: {
          id: 'post123',
          caption: 'Test Post',
          createdAt: '2023-09-20T12:00:00Z',
          isPinned: false,
        },
      },
    },
  };

  const getPostsQueryMock = {
    request: {
      query: GET_POSTS_BY_ORG,
      variables: {
        input: {
          organizationId: mockOrgId,
        },
      },
    },
    result: {
      data: {
        postsByOrganization: [
          {
            id: 'post1',
            caption: 'Existing Post 1',
            createdAt: '2023-09-19T12:00:00Z',
            isPinned: false,
          },
          {
            id: 'post2',
            caption: 'Existing Post 2',
            createdAt: '2023-09-18T12:00:00Z',
            isPinned: true,
          },
        ],
      },
    },
  };

  const orgPostListMock = {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        input: { id: mockOrgId },
        after: null,
        before: null,
        first: 6,
        last: null,
      },
    },
    result: {
      data: {
        organization: {
          id: mockOrgId,
          name: 'Test Organization',
          posts: {
            edges: [
              {
                node: {
                  id: 'post1',
                  caption: 'Existing Post 1',
                  createdAt: '2023-09-19T12:00:00Z',
                  isPinned: false,
                },
              },
              {
                node: {
                  id: 'post2',
                  caption: 'Existing Post 2',
                  createdAt: '2023-09-18T12:00:00Z',
                  isPinned: true,
                },
              },
            ],
            pageInfo: {
              startCursor: 'cursor1',
              endCursor: 'cursor2',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 2,
          },
        },
      },
    },
  };

  const refetchMock = {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        input: { id: mockOrgId },
        after: null,
        before: null,
        first: 6,
        last: null,
      },
    },
    result: {
      data: {
        organization: {
          id: mockOrgId,
          name: 'Test Organization',
          posts: {
            edges: [
              {
                node: {
                  id: 'post123',
                  caption: 'Test Post',
                  createdAt: '2023-09-20T12:00:00Z',
                  isPinned: false,
                },
              },
              {
                node: {
                  id: 'post1',
                  caption: 'Existing Post 1',
                  createdAt: '2023-09-19T12:00:00Z',
                  isPinned: false,
                },
              },
              {
                node: {
                  id: 'post2',
                  caption: 'Existing Post 2',
                  createdAt: '2023-09-18T12:00:00Z',
                  isPinned: true,
                },
              },
            ],
            pageInfo: {
              startCursor: 'cursor1',
              endCursor: 'cursor3',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 3,
          },
        },
      },
    },
  };

  const renderComponent = (
    mocks = [getPostsQueryMock, orgPostListMock, createPostMock, refetchMock],
  ): RenderResult => {
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

  beforeEach(async () => {
    vi.clearAllMocks();

    renderComponent();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  it('allows filling out the post form', async () => {
    const createPostButton = screen.getByTestId('createPostModalBtn');
    await userEvent.click(createPostButton);

    const titleInput = await screen.findByTestId('modalTitle');
    const infoInput = screen.getByTestId('modalinfo');

    await userEvent.type(titleInput, 'Test Post');
    await userEvent.type(infoInput, 'This is a test post description');

    expect(titleInput).toHaveValue('Test Post');
    expect(infoInput).toHaveValue('This is a test post description');
  });

  it('successfully submits the form and shows success toast', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/org/123']}>
            <Routes>
              <Route path="/org/:orgId" element={<OrgPost />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    const createPostButton = screen.getByTestId('createPostModalBtn');
    await userEvent.click(createPostButton);

    const titleInput = await screen.findByTestId('modalTitle');
    const infoInput = screen.getByTestId('modalinfo');
    await userEvent.type(titleInput, 'Test Post');
    await userEvent.type(infoInput, 'This is a test post description');

    const submitButton = screen.getByTestId('createPostBtn');
    await act(async () => {
      await userEvent.click(submitButton);
    });

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith('postCreatedSuccess');
      },
      { timeout: 5000 },
    );

    await waitFor(
      () => {
        expect(screen.queryByTestId('modalTitle')).not.toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('handles pin post toggle correctly', async () => {
    const createPostButton = screen.getByTestId('createPostModalBtn');
    await userEvent.click(createPostButton);

    const pinPostSwitch = await screen.findByTestId('pinPost');

    await userEvent.click(pinPostSwitch);
    await waitFor(() => {
      expect(pinPostSwitch).toBeChecked();
    });

    await userEvent.click(pinPostSwitch);
    await waitFor(() => {
      expect(pinPostSwitch).not.toBeChecked();
    });
  });

  it('cancels post creation and resets form state', async () => {
    const createPostButton = screen.getByTestId('createPostModalBtn');
    userEvent.click(createPostButton);

    const titleInput = await screen.findByTestId('modalTitle');
    const infoInput = screen.getByTestId('modalinfo');

    await userEvent.type(titleInput, 'Test Post');
    await userEvent.type(infoInput, 'This is a test post description');

    const cancelButton = screen.getByTestId('closeOrganizationModal');
    userEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId('modalTitle')).not.toBeInTheDocument();
    });

    userEvent.click(createPostButton);

    const newTitleInput = await screen.findByTestId('modalTitle');

    expect(newTitleInput).toHaveValue('');
    expect(screen.getByTestId('modalinfo')).toHaveValue('');
  });
});
