import React, { act } from 'react';
import type { RenderResult } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import {
  ORGANIZATION_ADVERTISEMENT_LIST,
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Home from './Posts';
import { DELETE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

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
                {
                  node: {
                    _id: '2345',
                    name: 'Ad 2',
                    type: 'Type 1',
                    organization: {
                      _id: 'orgId',
                    },
                    mediaUrl: 'Link 2',
                    endDate: '2024-09-31',
                    startDate: '2023-04-01',
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
              totalCount: 2,
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
});

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
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
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('Testing Home Screen: User Portal', () => {
  test('Check if HomeScreen renders properly', async () => {
    renderHomeScreen();
    await wait();
    const startPostBtn = await screen.findByTestId('postBtn');
    expect(startPostBtn).toBeInTheDocument();
  });

  test('Check if pinned post is displayed at the top', async () => {
    renderHomeScreen();
    await wait();
    const pinnedPost = await screen.findByText('post one');
    const postsContainer = screen.getByTestId('postsContainer');
    expect(
      within(postsContainer).getAllByText('post one')[0],
    ).toBeInTheDocument();
    expect(postsContainer.firstChild).toContainElement(pinnedPost);
  });

  test('Check if a post can be liked', async () => {
    renderHomeScreen();
    await wait();
    const likeBtn = await screen.findByTestId(
      'likeBtn-6411e54835d7ba2344a78e29',
    );
    userEvent.click(likeBtn);
    expect(likeBtn).toHaveTextContent('3');
  });

  test('Check if comments are displayed under a post', async () => {
    renderHomeScreen();
    await wait();
    const commentsToggle = await screen.findByTestId(
      'commentsToggle-6411e54835d7ba2344a78e29',
    );
    userEvent.click(commentsToggle);
    const comment = await screen.findByText('This is the post two');
    expect(comment).toBeInTheDocument();
  });

  test('Check if a post can be deleted', async () => {
    renderHomeScreen();
    await wait();
    const deleteBtn = await screen.findByTestId(
      'deleteBtn-6411e54835d7ba2344a78e29',
    );
    userEvent.click(deleteBtn);
    await waitFor(() => {
      expect(screen.queryByText('post two')).not.toBeInTheDocument();
    });
  });

  test('Check if advertisements are displayed correctly', async () => {
    renderHomeScreen();
    await wait();
    const ad1 = await screen.findByText('Ad 1');
    const ad2 = await screen.findByText('Ad 2');
    expect(ad1).toBeInTheDocument();
    expect(ad2).toBeInTheDocument();
  });

  test('Check if user can create a new post', async () => {
    renderHomeScreen();
    await wait();
    const startPostBtn = await screen.findByTestId('postBtn');
    userEvent.click(startPostBtn);
    const titleInput = screen.getByPlaceholderText('Enter title');
    const textInput = screen.getByPlaceholderText('Enter text');
    userEvent.type(titleInput, 'New Post Title');
    userEvent.type(textInput, 'This is the content of the new post');
    const submitBtn = screen.getByTestId('submitPostBtn');
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByText('New Post Title')).toBeInTheDocument();
    });
  });

  test('Check if multiple pinned posts are sorted correctly', async () => {
    renderHomeScreen();
    await wait();
    const postsContainer = screen.getByTestId('postsContainer');
    const pinnedPosts = within(postsContainer).getAllByTestId(/^pinnedPost-/);
    expect(pinnedPosts[0]).toHaveTextContent('Most recent pinned post');
  });

  test('Check if pagination works', async () => {
    renderHomeScreen();
    await wait();
    const nextPageBtn = await screen.findByTestId('nextPageBtn');
    expect(nextPageBtn).toBeInTheDocument();
    userEvent.click(nextPageBtn);
    await waitFor(() => {
      expect(screen.queryByText('post one')).not.toBeInTheDocument();
    });
  });
});
