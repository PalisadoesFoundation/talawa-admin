import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import {
  ORGANIZATION_ADVERTISEMENT_LIST,
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Home from './Posts';
import useLocalStorage from 'utils/useLocalstorage';
import { DELETE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import { toast } from 'react-toastify';

import * as MinioUploadModule from 'utils/MinioUpload';
import * as MinioDownloadModule from 'utils/MinioDownload';
import { validateFile } from 'utils/fileValidation';

// Mock localStorage usage
const { setItem } = useLocalStorage();

// Mock toast notifications
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock react-router useParams
const mockUseParams = vi.fn().mockReturnValue({ orgId: 'orgId' });
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useNavigate: () => vi.fn(),
  };
});

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock-url');
const mockRevokeObjectURL = vi.fn();

global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

// Mock MinIO hooks
const mockUploadFileToMinio = vi
  .fn()
  .mockResolvedValue({ objectName: 'mocked-object-key' });
const mockGetFileFromMinio = vi
  .fn()
  .mockResolvedValue('https://dummy-presigned-url.com/mocked-object-key');

vi.spyOn(MinioUploadModule, 'useMinioUpload').mockReturnValue({
  uploadFileToMinio: mockUploadFileToMinio,
});
vi.spyOn(MinioDownloadModule, 'useMinioDownload').mockReturnValue({
  getFileFromMinio: mockGetFileFromMinio,
});

// Api mocks for GraphQL queries and mutations
const MOCKS = [
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        id: 'orgId',
        first: 10,
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
                    _id: '6411e53835d7ba2344a78e21',
                    title: 'post one',
                    text: 'This is the first post',
                    imageUrl: null,
                    videoUrl: null,
                    createdAt: '2024-03-03T09:26:56.524+00:00',
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Glen',
                      lastName: 'Dsza',
                      email: 'glendsza@gmail.com',
                    },
                    likeCount: 0,
                    commentCount: 0,
                    comments: [],
                    pinned: true,
                    likedBy: [],
                  },
                  cursor: '6411e53835d7ba2344a78e21',
                },
                {
                  node: {
                    _id: '6411e54835d7ba2344a78e29',
                    title: 'post two',
                    text: 'This is the post two',
                    imageUrl: null,
                    videoUrl: null,
                    createdAt: '2024-03-03T09:26:56.524+00:00',
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Glen',
                      lastName: 'Dsza',
                      email: 'glendsza@gmail.com',
                    },
                    likeCount: 2,
                    commentCount: 1,
                    pinned: false,
                    likedBy: [
                      {
                        _id: '640d98d9eb6a743d75341067',
                        firstName: 'Glen',
                        lastName: 'Dsza',
                      },
                      {
                        _id: '640d98d9eb6a743d75341068',
                        firstName: 'Glen2',
                        lastName: 'Dsza2',
                      },
                    ],
                    comments: [
                      {
                        _id: '6411e54835d7ba2344a78e29',
                        creator: {
                          _id: '640d98d9eb6a743d75341067',
                          firstName: 'Glen',
                          lastName: 'Dsza',
                          email: 'glendsza@gmail.com',
                        },
                        likeCount: 2,
                        likedBy: [
                          {
                            _id: '640d98d9eb6a743d75341067',
                            firstName: 'Glen',
                            lastName: 'Dsza',
                          },
                          {
                            _id: '640d98d9eb6a743d75341068',
                            firstName: 'Glen2',
                            lastName: 'Dsza2',
                          },
                        ],
                        text: 'This is the post two',
                        createdAt: '2024-03-03T09:26:56.524+00:00',
                      },
                    ],
                  },
                  cursor: '6411e54835d7ba2344a78e29',
                },
              ],
              pageInfo: {
                startCursor: '6411e53835d7ba2344a78e21',
                endCursor: '6411e54835d7ba2344a78e31',
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 2,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: { id: 'orgId', first: 6 },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'orgId',
            advertisements: {
              edges: [
                {
                  node: {
                    _id: '1234',
                    name: 'Ad 1',
                    type: 'Type 1',
                    organization: {
                      _id: 'orgId',
                    },
                    mediaUrl: 'Link 1',
                    endDate: '2024-12-31',
                    startDate: '2022-01-01',
                  },
                  cursor: '1234',
                },
              ],
              pageInfo: {
                startCursor: '6411e53835d7ba2344a78e21',
                endCursor: '6411e54835d7ba2344a78e31',
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
  {
    request: {
      query: DELETE_POST_MUTATION,
      variables: { id: '6411e54835d7ba2344a78e29' },
    },
    result: {
      data: {
        removePost: { _id: '6411e54835d7ba2344a78e29' },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

async function wait(ms = 100) {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

const renderHomeScreen = (): RenderResult =>
  render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/user/organization/orgId']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route path="/user/organization/:orgId" element={<Home />} />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('Home Screen: User Portal', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ orgId: 'orgId' });
  });

  it('renders Home screen properly', async () => {
    renderHomeScreen();
    await wait();
    expect(await screen.findByTestId('postBtn')).toBeInTheDocument();
  });

  it('creates local object URL for image preview instead of uploading to MinIO immediately', async () => {
    renderHomeScreen();
    await wait();

    const fileInput = screen.getByTestId('postImageInput');
    const file = new File(['image content'], 'image.png', {
      type: 'image/png',
    });

    await userEvent.upload(fileInput, file);
    await wait();

    // Should create local object URL, not upload to MinIO
    expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
    expect(mockUploadFileToMinio).not.toHaveBeenCalled(); // No immediate upload

    // Check that success toast was called (with translation key)
    expect(toast.success).toHaveBeenCalled();
  });

  it('cleans up object URL when modal is closed', async () => {
    renderHomeScreen();
    await wait();

    const fileInput = screen.getByTestId('postImageInput');
    const file = new File(['image content'], 'image.png', {
      type: 'image/png',
    });

    await userEvent.upload(fileInput, file);
    await wait();

    // Open modal
    const postBtn = screen.getByTestId('postBtn');
    await userEvent.click(postBtn);

    // Close modal
    const modal = screen.getByTestId('startPostModal');
    const closeButton = within(modal).getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Should revoke the object URL
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('cleans up previous object URL when selecting new file', async () => {
    renderHomeScreen();
    await wait();

    const fileInput = screen.getByTestId('postImageInput');

    // First file
    const file1 = new File(['content1'], 'image1.png', { type: 'image/png' });
    await userEvent.upload(fileInput, file1);
    await wait();

    // Second file - should revoke first URL
    const file2 = new File(['content2'], 'image2.png', { type: 'image/png' });
    await userEvent.upload(fileInput, file2);
    await wait();

    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    expect(mockCreateObjectURL).toHaveBeenCalledTimes(2);
  });

  it('opens post creation modal with preview when image is selected', async () => {
    renderHomeScreen();
    await wait();

    // Upload file first
    const fileInput = screen.getByTestId('postImageInput');
    const file = new File(['image content'], 'image.png', {
      type: 'image/png',
    });

    await userEvent.upload(fileInput, file);
    await wait();

    // Open modal
    const postBtn = screen.getByTestId('postBtn');
    await userEvent.click(postBtn);

    // Modal should show with preview
    expect(screen.getByTestId('startPostModal')).toBeInTheDocument();
    expect(screen.getByAltText('Post Image Preview')).toBeInTheDocument();
  });

  it('renders posts in PostCard correctly', async () => {
    setItem('userId', '640d98d9eb6a743d75341067');
    renderHomeScreen();
    await wait();

    expect(screen.queryByText('post one')).toBeInTheDocument();
    expect(screen.queryByText('This is the first post')).toBeInTheDocument();
    expect(screen.queryByText('post two')).toBeInTheDocument();
    expect(screen.queryByText('This is the post two')).toBeInTheDocument();
  });

  it('triggers delete and refetch post', async () => {
    setItem('userId', '640d98d9eb6a743d75341067');
    renderHomeScreen();
    await wait();

    const dropdowns = await screen.findAllByTestId('dropdown');
    await userEvent.click(dropdowns[1]);
    const deleteButton = await screen.findByTestId('deletePost');
    await userEvent.click(deleteButton);
  });
});

describe('HomeScreen with invalid orgId', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ orgId: undefined });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /user if orgId is missing', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <MemoryRouter initialEntries={['/user/organization/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route path="/user/organization/" element={<Home />} />
                <Route
                  path="/user"
                  element={<div data-testid="homeEl"></div>}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    const homeEl = await screen.findByTestId('homeEl');
    expect(homeEl).toBeInTheDocument();

    const postCardContainers = screen.queryAllByTestId('postCardContainer');
    expect(postCardContainers).toHaveLength(0);
  });
});
