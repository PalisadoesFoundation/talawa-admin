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
// Mock toast functions
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
