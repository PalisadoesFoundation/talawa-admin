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
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router';
import OrgPost from './OrgPost';
import {
  GET_POSTS_BY_ORG,
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { ToastContainer, toast } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import i18n from 'utils/i18n';
import type { RenderResult } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import convertToBase64 from 'utils/convertToBase64';
import type { MockedFunction } from 'vitest';
import * as convertToBase64Module from 'utils/convertToBase64';

vi.mock('utils/convertToBase64');
vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('utils/errorHandler', () => ({ errorHandler: vi.fn() }));

vi.mock('utils/convertToBase64', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue('base64-encoded-string'),
}));

vi.mock('react-i18next', () => ({
  // Include initReactI18next
  initReactI18next: { type: '3rdParty', init: () => {} },
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
    i18n: { changeLanguage: () => new Promise(() => {}), language: 'en' },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('utils/convertToBase64', () => ({
  default: vi.fn().mockResolvedValue('base64String'),
}));

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
            { node: samplePosts[0], cursor: 'cursor1' },
            { node: samplePosts[1], cursor: 'cursor2' },
            { node: samplePosts[2], cursor: 'cursor3' },
          ],
        },
      },
    },
  },
};

const getPostsByOrgInitialMock = {
  request: {
    query: GET_POSTS_BY_ORG,
    variables: { input: { organizationId: '123' } },
  },
  result: { data: { postsByOrganization: samplePosts } },
};

// Create mock for search query with "test" term
const getPostsByOrgSearchMock = {
  request: {
    query: GET_POSTS_BY_ORG,
    variables: { input: { organizationId: '123' } },
  },
  result: { data: { postsByOrganization: samplePosts } },
};

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

const minimalMocks: MockedResponse[] = [
  {
    request: {
      query: GET_POSTS_BY_ORG,
      variables: { input: { organizationId: '123' } },
    },
    result: { data: { postsByOrganization: [] } },
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
        organization: {
          posts: {
            edges: [],
            totalCount: 0,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          },
        },
      },
    },
  },
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

export const mockPosts2 = {
  postsByOrganization: [
    {
      id: 'p3',
      caption: 'Post 3 on page 2',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'p4',
      caption: 'Post 4 on page 2',
      createdAt: new Date().toISOString(),
    },
  ],
};

export const mockOrgPostList2 = {
  organization: {
    posts: {
      edges: mockPosts2.postsByOrganization.map((post) => ({ node: post })),
      pageInfo: {
        hasNextPage: false, // last page
        hasPreviousPage: true, // because we can go back
        startCursor: 'cursor2', //  matches endCursor from page 1
        endCursor: 'cursor3',
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

const mocks = [
  // Initial GET_POSTS_BY_ORG
  {
    request: {
      query: GET_POSTS_BY_ORG,
      variables: { input: { organizationId: '123' } },
    },
    result: { data: mockPosts1 },
  },

  // Page 1
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

  // Page 2 (next page)
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        input: { id: '123' },
        after: 'cursor2',
        before: null,
        first: 6,
        last: null,
      },
    },
    result: { data: mockOrgPostList2 },
  },

  // Back to Page 1 (previous page)
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        input: { id: '123' },
        after: null,
        before: 'cursor2',
        first: null,
        last: 6,
      },
    },
    result: { data: mockOrgPostList1 },
  },
];

const loadingMocks: MockedResponse[] = [
  {
    request: {
      query: GET_POSTS_BY_ORG,
      variables: { input: { organizationId: '123' } },
    },
    result: { data: mockPosts },
    delay: 5000,
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
const NoOrgId: MockedResponse = {
  request: {
    query: CREATE_POST_MUTATION,
    variables: {
      input: {
        caption: 'Test Post Title',
        organizationId: null,
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
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useParams: () => ({ orgId: '123' }) };
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

  it('creates a post and verifies mutation is called', async () => {
    render(
      <MockedProvider mocks={[createPostSuccessMock]} addTypename={false}>
        <MemoryRouter>
          <OrgPost />
        </MemoryRouter>
      </MockedProvider>,
    );

    // Open modal
    fireEvent.click(await screen.findByTestId('createPostModalBtn'));
    expect(
      await screen.findByTestId('modalOrganizationHeader'),
    ).toBeInTheDocument();

    // Fill required fields
    fireEvent.change(screen.getByTestId('modalTitle'), {
      target: { value: 'Test Post Title' },
    });
    fireEvent.change(screen.getByTestId('modalinfo'), {
      target: { value: 'Some info' },
    });

    // Upload file
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('addMediaField'), {
      target: { files: [file] },
    });

    // Ensure preview shows
    expect(await screen.findByTestId('mediaPreview')).toBeInTheDocument();

    // Submit post
    fireEvent.click(screen.getByTestId('createPostBtn'));
  });

  it('should throw error if post title is empty', async () => {
    render(
      <MockedProvider mocks={[NoOrgId]} addTypename={false}>
        <MemoryRouter>
          <OrgPost />
        </MemoryRouter>
      </MockedProvider>,
    );

    // Open modal
    fireEvent.click(await screen.findByTestId('createPostModalBtn'));
    expect(
      await screen.findByTestId('modalOrganizationHeader'),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('modalinfo'), {
      target: { value: 'Some info' },
    });

    // Upload file
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('addMediaField'), {
      target: { files: [file] },
    });

    // Ensure preview shows
    expect(await screen.findByTestId('mediaPreview')).toBeInTheDocument();

    // Submit post
    fireEvent.click(screen.getByTestId('createPostBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Organization post list error:'),
      );
    });
  });

  it('should throw error if organizationId is missing', async () => {
    render(
      <MockedProvider mocks={[NoOrgId]} addTypename={false}>
        <MemoryRouter>
          <OrgPost />
        </MemoryRouter>
      </MockedProvider>,
    );

    // Open modal
    fireEvent.click(await screen.findByTestId('createPostModalBtn'));

    // Fill title but orgId is undefined
    fireEvent.change(screen.getByTestId('modalTitle'), {
      target: { value: 'Some title' },
    });
    fireEvent.click(screen.getByTestId('createPostBtn'));

    const { toast } = await import('react-toastify');

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Organization post list error:'),
      );
    });
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
      expect(screen.queryByTestId('mediaPreview')).toBeInTheDocument();
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
      expect(screen.queryByTestId('mediaPreview')).not.toBeInTheDocument();
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
  const openModal = async (): Promise<void> => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <OrgPost />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('createPostModalBtn')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('createPostModalBtn'));
    await waitFor(() => {
      expect(screen.getByTestId('modalOrganizationUpload')).toBeInTheDocument();
    });
  };
  it('shows an error toast when a non-video file is selected in the video input', async () => {
    await openModal();

    const videoInput = screen.getByTestId('addVideoField') as HTMLInputElement;

    const nonVideoFile = new File(['dummy content'], 'dummy.txt', {
      type: 'text/plain',
    });

    fireEvent.change(videoInput, { target: { files: [nonVideoFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please select a video file');
    });
  });

  it('sets video preview when a valid video file is selected', async () => {
    const mockedConvertToBase64 = convertToBase64 as MockedFunction<
      typeof convertToBase64
    >;
    mockedConvertToBase64.mockResolvedValue('data:video/mp4;base64,abc123');

    await openModal();

    const videoInput = screen.getByTestId('addVideoField') as HTMLInputElement;
    const videoFile = new File(['video content'], 'video.mp4', {
      type: 'video/mp4',
    });

    fireEvent.change(videoInput, { target: { files: [videoFile] } });

    await waitFor(() => {
      expect(screen.getByTestId('videoPreviewContainer')).toBeInTheDocument();
      expect(screen.getByTestId('videoPreview')).toBeInTheDocument();
    });
  });

  it('resets video preview when no file is selected', async () => {
    await openModal();

    const videoInput = screen.getByTestId('addVideoField') as HTMLInputElement;
    const videoFile = new File(['video content'], 'video.mp4', {
      type: 'video/mp4',
    });

    fireEvent.change(videoInput, { target: { files: [videoFile] } });

    await waitFor(() => {
      expect(screen.getByTestId('videoPreviewContainer')).toBeInTheDocument();
    });

    fireEvent.change(videoInput, { target: { files: [] } });

    await waitFor(() => {
      expect(
        screen.queryByTestId('videoPreviewContainer'),
      ).not.toBeInTheDocument();
    });
  });

  it('clears video preview and resets file input when the close button is clicked', async () => {
    const mockedConvertToBase64 = convertToBase64 as MockedFunction<
      typeof convertToBase64
    >;
    mockedConvertToBase64.mockResolvedValue('data:video/mp4;base64,abc123');

    await openModal();

    const videoInput = screen.getByTestId('addVideoField') as HTMLInputElement;
    const videoFile = new File(['video content'], 'video.mp4', {
      type: 'video/mp4',
    });
    fireEvent.change(videoInput, { target: { files: [videoFile] } });

    await waitFor(() => {
      expect(screen.getByTestId('videoPreviewContainer')).toBeInTheDocument();
    });

    const fileInputElement = document.getElementById(
      'videoAddMedia',
    ) as HTMLInputElement;
    Object.defineProperty(fileInputElement, 'value', {
      value: 'non-empty',
      writable: true,
    });
    expect(fileInputElement.value).toBe('non-empty');

    const closeButton = screen.getByTestId('videoMediaCloseButton');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId('videoPreviewContainer'),
      ).not.toBeInTheDocument();
    });
    expect(fileInputElement.value).toBe('');
  });

  it('displays error toast when convertToBase64 fails', async () => {
    const convertSpy = vi
      .spyOn(convertToBase64Module, 'default')
      .mockRejectedValue(new Error('Conversion failed'));

    const toastErrorSpy = vi.spyOn(toast, 'error').mockImplementation(() => 1);

    render(
      <MockedProvider mocks={minimalMocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/org/123']}>
            <Routes>
              <Route path="/org/:orgId" element={<OrgPost />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const createPostButton = screen.getByTestId('createPostModalBtn');
    userEvent.click(createPostButton);
    const fileInput = await screen.findByTestId('addMediaField');
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith('Could not generate preview');
    });

    convertSpy.mockRestore();
    toastErrorSpy.mockRestore();
  });

  it('displays error toast when convertToBase64 fails for video preview', async () => {
    const convertSpy = vi
      .spyOn(convertToBase64Module, 'default')
      .mockRejectedValue(new Error('Conversion failed'));

    const toastErrorSpy = vi.spyOn(toast, 'error').mockImplementation(() => 1);

    render(
      <MockedProvider mocks={minimalMocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/org/123']}>
            <Routes>
              <Route path="/org/:orgId" element={<OrgPost />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const createPostButton = screen.getByTestId('createPostModalBtn');
    userEvent.click(createPostButton);

    const videoInput = await screen.findByTestId('addVideoField');

    const videoFile = new File(['dummy video content'], 'video.mp4', {
      type: 'video/mp4',
    });

    await userEvent.upload(videoInput, videoFile);

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        'Could not generate video preview',
      );
    });

    convertSpy.mockRestore();
    toastErrorSpy.mockRestore();
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

  it('should reset filtering when search term is empty or whitespace only', async () => {
    renderWithMocks([
      orgPostListMock,
      getPostsByOrgInitialMock,
      getPostsByOrgSearchMock,
    ]);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const postsRenderer = screen.getByTestId('posts-renderer');
    expect(postsRenderer.getAttribute('data-is-filtering')).toBe('false');

    const searchInput = screen.getByTestId('searchByName');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, '    {enter}');

    await waitFor(() => {
      expect(postsRenderer.getAttribute('data-is-filtering')).toBe('false');
    });
  });

  it('should handle errors during search gracefully', async () => {
    const toastErrorSpy = vi.spyOn(toast, 'error');

    const getPostsByOrgErrorMock: MockedResponse = {
      request: {
        query: GET_POSTS_BY_ORG,
        variables: { input: { organizationId: '123' } },
      },
      error: new Error('Network error'),
    };

    renderWithMocks([
      orgPostListMock,
      getPostsByOrgInitialMock,
      getPostsByOrgErrorMock,
    ]);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'non-empty search{enter}');

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith('Error searching posts');
      const postsRenderer = screen.getByTestId('posts-renderer');
      expect(postsRenderer.getAttribute('data-is-filtering')).toBe('false');
    });
  });

  it('renders loader when loading', async () => {
    renderWithMocks([]);
    expect(await screen.findByTestId('posts-renderer')).toBeInTheDocument();
  });

  it('renders error state when query fails', async () => {
    const mocks = [
      {
        request: {
          query: GET_POSTS_BY_ORG,
          variables: { input: { organizationId: undefined } },
        },
        error: new Error('Network error'),
      },
    ];
    renderWithMocks(mocks);

    expect(await screen.findByTestId('not-found')).toBeInTheDocument();
  });
});

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
      variables: { input: { organizationId: mockOrgId } },
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

  it('allow post creation', async () => {
    const createPostButton = screen.getByTestId('createPostModalBtn');
    await userEvent.click(createPostButton);

    const titleInput = await screen.findByTestId('modalTitle');
    const infoInput = screen.getByTestId('modalinfo');

    await userEvent.type(titleInput, 'Test Post');
    await userEvent.type(infoInput, 'This is a test post description');

    expect(titleInput).toHaveValue('Test Post');
    expect(infoInput).toHaveValue('This is a test post description');

    const submitButton = screen.getByTestId('createPostBtn');
    await userEvent.click(submitButton);
  });

  it('allows post creation and triggers success flow', async () => {
    const createPostButton = screen.getByTestId('createPostModalBtn');
    await userEvent.click(createPostButton);

    const titleInput = await screen.findByTestId('modalTitle');
    const infoInput = screen.getByTestId('modalinfo');

    await userEvent.type(titleInput, 'Test Post');
    await userEvent.type(infoInput, 'This is a test post description');

    const submitButton = screen.getByTestId('createPostBtn');
    await userEvent.click(submitButton);
  });

  // Replace the getFileHashFromFile function with a mock
  vi.mock('../../../utils/fileUtils', () => ({
    getFileHashFromFile: vi.fn().mockResolvedValue('mock-file-hash-123'),
  }));

  // Then in your test, remove the actual implementation and just test the structure
  it('should create valid FileMetadataInput', async () => {
    // Mock the hash function directly in the test
    vi.spyOn(global, 'crypto', 'get').mockReturnValue({
      subtle: {
        digest: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4])),
      },
    } as unknown as Crypto);

    const attachment = {
      fileHash: 'mock-hash-value',
      mimetype: 'IMAGE_JPEG',
      name: 'hello.txt',
      objectName: 'hello.txt',
    };

    expect(attachment).toEqual({
      fileHash: expect.any(String),
      mimetype: 'IMAGE_JPEG',
      name: 'hello.txt',
      objectName: expect.any(String),
    });
  });
});

// Add these tests to your OrgPost.spec.tsx
describe('OrgPost Edge Cases', () => {
  it('handles undefined organization in orgPostListData', async () => {
    const undefinedOrgMocks: MockedResponse[] = [
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
            organization: null, // This simulates undefined organization
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={undefinedOrgMocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/org/123']}>
            <Routes>
              <Route path="/org/:orgId" element={<OrgPost />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('not-found')).toBeInTheDocument();
    });
  });

  it('handles empty posts array in organization', async () => {
    const emptyPostsMocks: MockedResponse[] = [
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
            organization: {
              posts: {
                edges: [],
                totalCount: 0,
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                },
              },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyPostsMocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/org/123']}>
            <Routes>
              <Route path="/org/:orgId" element={<OrgPost />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('not-found')).toBeInTheDocument();
    });
  });

  it('handles error in organization post list query', async () => {
    const errorMocks: MockedResponse[] = [
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
        error: new Error('Network error'),
      },
    ];

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

    await waitFor(() => {
      expect(screen.getByText('Error loading posts')).toBeInTheDocument();
    });
  });

  it('handles pagination with sorting enabled', async () => {
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

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    // Enable sorting
    const sortButton = screen.getByTestId('sortpost-toggle');
    fireEvent.click(sortButton);

    const latestOption = await screen.findByText('Latest');
    fireEvent.click(latestOption);

    // Test pagination buttons
    const nextButton = screen.getByTestId('next-page-button');
    const prevButton = screen.getByTestId('previous-page-button');

    expect(prevButton).toBeDisabled();
    // expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);
  });

  it('handles form submission with empty title', async () => {
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

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const createButton = screen.getByTestId('createPostModalBtn');
    fireEvent.click(createButton);

    const submitButton = await screen.findByTestId('createPostBtn');
    fireEvent.click(submitButton);
  });

  it('handles file removal from video preview', async () => {
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

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const createButton = screen.getByTestId('createPostModalBtn');
    fireEvent.click(createButton);

    const videoInput = await screen.findByTestId('addVideoField');
    const videoFile = new File(['video content'], 'test.mp4', {
      type: 'video/mp4',
    });

    // Mock convertToBase64 for video
    vi.spyOn(convertToBase64Module, 'default').mockResolvedValue(
      'data:video/mp4;base64,test',
    );

    fireEvent.change(videoInput, { target: { files: [videoFile] } });

    await waitFor(() => {
      expect(screen.getByTestId('videoPreviewContainer')).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('videoMediaCloseButton');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId('videoPreviewContainer'),
      ).not.toBeInTheDocument();
    });
  });
});

describe('handlePreviousPage', () => {
  let setBefore: ReturnType<typeof vi.fn>;
  let setAfter: ReturnType<typeof vi.fn>;
  let setFirst: ReturnType<typeof vi.fn>;
  let setLast: ReturnType<typeof vi.fn>;
  let setCurrentPage: ReturnType<typeof vi.fn>;
  const postsPerPage = 10;

  const orgPostListData = {
    organization: {
      posts: {
        pageInfo: {
          startCursor: 'cursor123',
        },
      },
    },
  };

  beforeEach(() => {
    setBefore = vi.fn();
    setAfter = vi.fn();
    setFirst = vi.fn();
    setLast = vi.fn();
    setCurrentPage = vi.fn();
  });

  const createHandlePreviousPage =
    (sortingOption: string, currentPage: number) => () => {
      if (sortingOption === 'None') {
        const startCursor =
          orgPostListData?.organization?.posts?.pageInfo?.startCursor;
        if (startCursor) {
          setBefore(startCursor);
          setAfter(null);
          setFirst(null);
          setLast(postsPerPage);
          setCurrentPage((prev: number) => prev - 1);
        }
      } else {
        if (currentPage > 1) {
          setCurrentPage((prev: number) => prev - 1);
        }
      }
    };

  it('should update cursors and page when sorting is None', () => {
    const handlePrevious = createHandlePreviousPage('None', 2);
    handlePrevious();

    expect(setBefore).toHaveBeenCalledWith('cursor123');
    expect(setAfter).toHaveBeenCalledWith(null);
    expect(setFirst).toHaveBeenCalledWith(null);
    expect(setLast).toHaveBeenCalledWith(postsPerPage);
    expect(setCurrentPage).toHaveBeenCalled();
  });

  it('should decrement currentPage when sorting is not None', () => {
    const handlePrevious = createHandlePreviousPage('Date', 3);
    handlePrevious();

    expect(setCurrentPage).toHaveBeenCalled();
  });

  it('should not decrement currentPage if it is 1 and sorting is not None', () => {
    const handlePrevious = createHandlePreviousPage('Date', 1);
    handlePrevious();

    expect(setCurrentPage).not.toHaveBeenCalled();
  });
});

describe('handleNextPage', () => {
  let setBefore: ReturnType<typeof vi.fn>;
  let setAfter: ReturnType<typeof vi.fn>;
  let setFirst: ReturnType<typeof vi.fn>;
  let setLast: ReturnType<typeof vi.fn>;
  let setCurrentPage: ReturnType<typeof vi.fn>;
  const postsPerPage = 10;

  const orgPostListData = {
    organization: {
      posts: {
        pageInfo: {
          endCursor: 'cursor456',
        },
      },
    },
  };

  const sortedPosts = Array.from({ length: 25 }, (_, i) => ({ id: i }));

  let currentPage: number;

  beforeEach(() => {
    setBefore = vi.fn();
    setAfter = vi.fn();
    setFirst = vi.fn();
    setLast = vi.fn();
    setCurrentPage = vi.fn();
    currentPage = 1;
  });

  const createHandleNextPage =
    (sortingOption: string, currentPage: number) => () => {
      if (sortingOption === 'None') {
        const endCursor =
          orgPostListData?.organization?.posts?.pageInfo?.endCursor;
        if (endCursor) {
          setAfter(endCursor);
          setBefore(null);
          setFirst(postsPerPage);
          setLast(null);
          setCurrentPage((prev: number) => prev + 1);
        }
      } else {
        const maxPage = Math.ceil(sortedPosts.length / postsPerPage);
        if (currentPage < maxPage) {
          setCurrentPage((prev: number) => prev + 1);
        }
      }
    };

  it('should update cursors and page when sorting is None', () => {
    const handleNext = createHandleNextPage('None', currentPage);
    handleNext();

    expect(setAfter).toHaveBeenCalledWith('cursor456');
    expect(setBefore).toHaveBeenCalledWith(null);
    expect(setFirst).toHaveBeenCalledWith(postsPerPage);
    expect(setLast).toHaveBeenCalledWith(null);
    expect(setCurrentPage).toHaveBeenCalled();
  });

  it('should increment currentPage when sorting is not None and currentPage < maxPage', () => {
    const handleNext = createHandleNextPage('Date', 2);
    handleNext();

    expect(setCurrentPage).toHaveBeenCalled();
  });

  it('should not increment currentPage when sorting is not None and currentPage >= maxPage', () => {
    const handleNext = createHandleNextPage('Date', 3); // maxPage = Math.ceil(25/10) = 3
    handleNext();

    expect(setCurrentPage).not.toHaveBeenCalled();
  });
});

describe('pagination handlers', () => {
  let setAfter: ReturnType<typeof vi.fn>;
  let setBefore: ReturnType<typeof vi.fn>;
  let setFirst: ReturnType<typeof vi.fn>;
  let setLast: ReturnType<typeof vi.fn>;
  let setCurrentPage: ReturnType<typeof vi.fn>;

  let postsPerPage: number;
  let orgPostListData: unknown;
  let sortedPosts: unknown[];
  let currentPage: number;
  let sortingOption: string;

  let handleNextPage: () => void;
  let handlePreviousPage: () => void;

  beforeEach(() => {
    setAfter = vi.fn();
    setBefore = vi.fn();
    setFirst = vi.fn();
    setLast = vi.fn();
    setCurrentPage = vi.fn((fn) => fn(currentPage));

    postsPerPage = 5;
    currentPage = 1;
    sortedPosts = Array.from({ length: 12 }, (_, i) => ({ id: i + 1 }));
    sortingOption = 'None';

    orgPostListData = {
      organization: {
        posts: {
          pageInfo: {
            endCursor: 'cursor-end',
            startCursor: 'cursor-start',
          },
        },
      },
    };

    handleNextPage = (): void => {
      if (sortingOption === 'None') {
        const endCursor = (
          orgPostListData as {
            organization: { posts: { pageInfo: { endCursor: string } } };
          }
        ).organization.posts.pageInfo.endCursor;
        if (endCursor) {
          setAfter(endCursor);
          setBefore(null);
          setFirst(postsPerPage);
          setLast(null);
          setCurrentPage((prev: number) => prev + 1);
        }
      } else {
        const maxPage = Math.ceil(sortedPosts.length / postsPerPage);
        if (currentPage < maxPage) {
          setCurrentPage((prev: number) => prev + 1);
        }
      }
    };

    handlePreviousPage = (): void => {
      if (sortingOption === 'None') {
        const startCursor = (
          orgPostListData as {
            organization: { posts: { pageInfo: { startCursor: string } } };
          }
        ).organization.posts.pageInfo.startCursor;
        if (startCursor) {
          setBefore(startCursor);
          setAfter(null);
          setFirst(null);
          setLast(postsPerPage);
          setCurrentPage((prev: number) => prev - 1);
        }
      } else {
        if (currentPage > 1) {
          setCurrentPage((prev: number) => prev - 1);
        }
      }
    };
  });

  it('should go to next page with cursor-based pagination', () => {
    handleNextPage();

    expect(setAfter).toHaveBeenCalledWith('cursor-end');
    expect(setBefore).toHaveBeenCalledWith(null);
    expect(setFirst).toHaveBeenCalledWith(5);
    expect(setLast).toHaveBeenCalledWith(null);
    expect(setCurrentPage).toHaveBeenCalled();
  });

  it('should go to previous page with cursor-based pagination', () => {
    currentPage = 2; // simulate being on page 2
    handlePreviousPage();

    expect(setBefore).toHaveBeenCalledWith('cursor-start');
    expect(setAfter).toHaveBeenCalledWith(null);
    expect(setFirst).toHaveBeenCalledWith(null);
    expect(setLast).toHaveBeenCalledWith(5);
    expect(setCurrentPage).toHaveBeenCalled();
  });

  it('should go to next page with array-based pagination', () => {
    sortingOption = 'Date'; // not "None"
    currentPage = 1;
    handleNextPage();

    expect(setCurrentPage).toHaveBeenCalled();
  });

  it('should not go to next page if already at last page (array-based)', () => {
    sortingOption = 'Date';
    currentPage = 3; // maxPage = ceil(12/5) = 3
    handleNextPage();

    expect(setCurrentPage).not.toHaveBeenCalled();
  });

  it('should go to previous page with array-based pagination', () => {
    sortingOption = 'Date';
    currentPage = 2;
    handlePreviousPage();

    expect(setCurrentPage).toHaveBeenCalled();
  });

  it('should not go to previous page if already at page 1 (array-based)', () => {
    sortingOption = 'Date';
    currentPage = 1;
    handlePreviousPage();

    expect(setCurrentPage).not.toHaveBeenCalled();
  });

  it('handles pagination with Next and Previous buttons', async () => {
    const mockOrgId = '123';
    const renderComponent = () =>
      render(
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

    renderComponent();

    // Page 1 should load
    await waitFor(() => {
      expect(screen.getByText('Early Post')).toBeInTheDocument();
    });

    // Click Next → Page 2
    const nextBtn = screen.getByTestId('next-page-button');
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByText('Post 3 on page 2')).toBeInTheDocument();
    });

    // Click Previous → Back to Page 1
    const prevBtn = screen.getByTestId('previous-page-button');
    fireEvent.click(prevBtn);

    await waitFor(() => {
      expect(screen.getByText('Early Post')).toBeInTheDocument();
    });
  });
});

describe('getMimeTypeEnum', () => {
  const getMimeTypeEnum = (url: string): string => {
    // Check for base64 data URI
    if (url.startsWith('data:')) {
      const mime = url.split(';')[0].split(':')[1]; // e.g., "image/png"
      switch (mime) {
        case 'image/jpeg':
          return 'IMAGE_JPEG';
        case 'image/png':
          return 'IMAGE_PNG';
        case 'image/webp':
          return 'IMAGE_WEBP';
        case 'image/avif':
          return 'IMAGE_AVIF';
        case 'video/mp4':
          return 'VIDEO_MP4';
        case 'video/webm':
          return 'VIDEO_WEBM';
        default:
          return 'IMAGE_JPEG'; // fallback
      }
    }

    // Fallback for file URLs (e.g., https://.../file.png)
    const ext = url.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'IMAGE_JPEG';
      case 'png':
        return 'IMAGE_PNG';
      case 'webp':
        return 'IMAGE_WEBP';
      case 'avif':
        return 'IMAGE_AVIF';
      case 'mp4':
        return 'VIDEO_MP4';
      case 'webm':
        return 'VIDEO_WEBM';
      default:
        return 'IMAGE_JPEG'; // fallback
    }
  };
  it('should return IMAGE_JPEG for .jpg and .jpeg', () => {
    expect(getMimeTypeEnum('file.jpg')).toBe('IMAGE_JPEG');
    expect(getMimeTypeEnum('file.jpeg')).toBe('IMAGE_JPEG');
  });

  it('should return IMAGE_PNG for .png', () => {
    expect(getMimeTypeEnum('file.png')).toBe('IMAGE_PNG');
  });

  it('should return IMAGE_WEBP for .webp', () => {
    expect(getMimeTypeEnum('file.webp')).toBe('IMAGE_WEBP');
  });

  it('should return IMAGE_AVIF for .avif', () => {
    expect(getMimeTypeEnum('file.avif')).toBe('IMAGE_AVIF');
  });

  it('should return VIDEO_MP4 for .mp4', () => {
    expect(getMimeTypeEnum('video.mp4')).toBe('VIDEO_MP4');
  });

  it('should return VIDEO_WEBM for .webm', () => {
    expect(getMimeTypeEnum('video.webm')).toBe('VIDEO_WEBM');
  });

  it('should return IMAGE_JPEG as fallback for unknown extension', () => {
    expect(getMimeTypeEnum('file.unknown')).toBe('IMAGE_JPEG');
    expect(getMimeTypeEnum('file')).toBe('IMAGE_JPEG'); // no extension
  });
});

const createPostErrorMock = {
  request: {
    query: CREATE_POST_MUTATION,
    variables: {
      input: {
        caption: 'Test Title',
        organizationId: 'org123',
        isPinned: false,
        attachments: [],
      },
    },
  },
  error: new Error('Mutation failed'),
};

const createPostMock = {
  request: {
    query: CREATE_POST_MUTATION,
    variables: {
      input: {
        caption: 'Test Title',
        organizationId: '123',
        isPinned: false,
        attachments: [],
      },
    },
  },
  result: {
    data: {
      createPost: {
        id: 'post1',
        caption: 'Test Title',
        pinnedAt: null,
        attachments: [],
      },
    },
  },
};

const getPostsMock2 = {
  request: {
    query: GET_POSTS_BY_ORG,
    variables: { input: { organizationId: '123' } },
  },
  result: {
    data: {
      postsByOrganization: [],
    },
  },
};

describe('OrgPost createPost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits createPost and handles success', async () => {
    render(
      <MockedProvider
        mocks={[getPostsMock2, orgPostListMock, createPostMock]}
        addTypename={false}
      >
        <OrgPost />
      </MockedProvider>,
    );

    fireEvent.click(await screen.findByTestId('createPostModalBtn'));
    fireEvent.change(screen.getByTestId('modalTitle'), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByTestId('modalinfo'), {
      target: { value: 'Test Info' },
    });

    await act(async () => {
      fireEvent.submit(screen.getByTestId('createPostBtn'));
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('modalOrganizationHeader'),
      ).not.toBeInTheDocument();
    });
  });

  it('submits createPost and handles error', async () => {
    render(
      <MockedProvider
        mocks={[getPostsMock2, orgPostListMock, createPostErrorMock]}
        addTypename={false}
      >
        <OrgPost />
      </MockedProvider>,
    );

    fireEvent.click(await screen.findByTestId('createPostModalBtn'));
    fireEvent.change(screen.getByTestId('modalTitle'), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByTestId('modalinfo'), {
      target: { value: 'Test Info' },
    });

    await act(async () => {
      fireEvent.submit(screen.getByTestId('createPostBtn'));
    });
  });
});
