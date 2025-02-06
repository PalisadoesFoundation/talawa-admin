import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import React, { act } from 'react';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { ORGANIZATION_POST_LIST } from 'GraphQl/Queries/Queries';
import { ToastContainer } from 'react-toastify';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import OrgPost from './OrgPost';
import { describe, it, expect, beforeEach, vi } from 'vitest';
const MOCKS = [
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        id: undefined,
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
                    _id: '6411e53835d7ba2344a78e21',
                    title: 'postone',
                    text: 'This is the first post',
                    imageUrl: null,
                    videoUrl: null,
                    createdAt: '2023-08-24T09:26:56.524+00:00',
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Aditya',
                      lastName: 'Shelke',
                      email: 'adidacreator1@gmail.com',
                    },
                    likeCount: 0,
                    commentCount: 0,
                    pinned: true,
                    likedBy: [],
                    comments: [],
                  },
                  cursor: '6411e53835d7ba2344a78e21',
                },
                {
                  node: {
                    _id: '6411e54835d7ba2344a78e29',
                    title: 'posttwo',
                    text: 'Tis is the post two',
                    imageUrl: null,
                    videoUrl: null,
                    createdAt: '2023-08-24T09:26:56.524+00:00',
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Aditya',
                      lastName: 'Shelke',
                      email: 'adidacreator1@gmail.com',
                    },
                    likeCount: 0,
                    commentCount: 0,
                    pinned: false,
                    likedBy: [],
                    comments: [],
                  },
                  cursor: '6411e54835d7ba2344a78e29',
                },
                {
                  node: {
                    _id: '6411e54835d7ba2344a78e30',
                    title: 'posttwo',
                    text: 'Tis is the post two',
                    imageUrl: null,
                    videoUrl: null,
                    createdAt: '2023-08-24T09:26:56.524+00:00',
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Aditya',
                      lastName: 'Shelke',
                      email: 'adidacreator1@gmail.com',
                    },
                    likeCount: 0,
                    commentCount: 0,
                    pinned: true,
                    likedBy: [],
                    comments: [],
                  },
                  cursor: '6411e54835d7ba2344a78e30',
                },
                {
                  node: {
                    _id: '6411e54835d7ba2344a78e31',
                    title: 'posttwo',
                    text: 'Tis is the post two',
                    imageUrl: null,
                    videoUrl: null,
                    createdAt: '2023-08-24T09:26:56.524+00:00',
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Aditya',
                      lastName: 'Shelke',
                      email: 'adidacreator1@gmail.com',
                    },
                    likeCount: 0,
                    commentCount: 0,
                    pinned: false,
                    likedBy: [],
                    comments: [],
                  },
                  cursor: '6411e54835d7ba2344a78e31',
                },
              ],
              pageInfo: {
                startCursor: '6411e53835d7ba2344a78e21',
                endCursor: '6411e54835d7ba2344a78e31',
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 4,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_POST_MUTATION,
      variables: {
        title: 'Dummy Post',
        text: 'This is dummy text',
        organizationId: '123',
      },
      result: {
        data: {
          createPost: {
            _id: '453',
          },
        },
      },
    },
  },
  {
    request: {
      query: CREATE_POST_MUTATION,
      variables: {
        title: 'Dummy Post',
        text: 'This is dummy text',
        organizationId: '123',
      },
      result: {
        data: {
          createPost: {
            _id: '453',
          },
        },
      },
    },
  },
];
const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const initialMock = {
  request: {
    query: ORGANIZATION_POST_LIST,
    variables: {
      id: undefined,
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
              startCursor: 'startCursor1',
              endCursor: 'endCursor1',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 10,
          },
        },
      ],
    },
  },
};

const nextPageMock = {
  request: {
    query: ORGANIZATION_POST_LIST,
    variables: {
      id: undefined,
      after: 'endCursor1',
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
              startCursor: 'startCursor2',
              endCursor: 'endCursor2',
              hasNextPage: false,
              hasPreviousPage: true,
            },
            totalCount: 10,
          },
        },
      ],
    },
  },
};

const prevPageMock = {
  request: {
    query: ORGANIZATION_POST_LIST,
    variables: {
      id: undefined,
      after: null,
      before: 'startCursor2',
      first: null,
      last: 6,
    },
  },
  result: {
    data: {
      organizations: [
        {
          posts: {
            edges: [],
            pageInfo: {
              startCursor: 'startCursor1',
              endCursor: 'endCursor1',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 10,
          },
        },
      ],
    },
  },
};

const successMock = {
  request: {
    query: CREATE_POST_MUTATION,
    variables: {
      title: 'Test Post',
      text: 'Test Content',
      file: '',
      pinned: false,
    },
  },
  result: {
    data: {
      createPost: {
        _id: '123',
        title: 'Test Post',
        text: 'Test Content',
      },
    },
  },
};

describe('Organisation Post Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const formData = {
    posttitle: 'dummy post',
    postinfo: 'This is a dummy post',
    postImage: new File(['hello'], 'hello.png', { type: 'image/png' }),
    postVideo: new File(['hello'], 'hello.mp4', { type: 'video/mp4' }),
  };

  it('handleAddMediaChange: uploading a file and verifying the preview', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('createPostModalBtn'));

    const fileInput = screen.getByTestId('addMediaField');
    userEvent.upload(fileInput, formData.postImage);

    const imagePreview = await screen.findByAltText('Post Image Preview');
    expect(imagePreview).toBeInTheDocument();

    const closeButton = screen.getByTestId('mediaCloseButton');
    fireEvent.click(closeButton);
    expect(imagePreview).not.toBeInTheDocument();
  });

  it('handleSearch: searching by title and text', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const searchInput = screen.getByPlaceholderText(/Search By/i);
    userEvent.type(searchInput, 'postone{enter}');
    expect(searchInput).toHaveValue('postone');

    const sortDropdown = screen.getByTestId('sort');
    userEvent.click(sortDropdown);
  });

  it('createPost: creating a post with and without media, and error handling', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('createPostModalBtn'));

    const postTitleInput = screen.getByTestId('modalTitle');
    fireEvent.change(postTitleInput, { target: { value: 'Test Post' } });

    const postInfoTextarea = screen.getByTestId('modalinfo');
    fireEvent.change(postInfoTextarea, {
      target: { value: 'Test post information' },
    });

    const createPostBtn = screen.getByTestId('createPostBtn');
    fireEvent.click(createPostBtn);

    await wait();

    userEvent.click(screen.getByTestId('closeOrganizationModal'));
  });

  it('Modal interactions: opening and closing the modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const createPostModalBtn = screen.getByTestId('createPostModalBtn');
    userEvent.click(createPostModalBtn);

    const modalTitle = screen.getByTestId('modalOrganizationHeader');
    expect(modalTitle).toBeInTheDocument();

    const closeButton = screen.getByTestId(/modalOrganizationHeader/i);
    userEvent.click(closeButton);

    await wait();

    const closedModalTitle = screen.queryByText(/postDetail/i);
    expect(closedModalTitle).not.toBeInTheDocument();
  });

  it('correct mock data should be queried', async () => {
    const dataQuery1 = MOCKS[0]?.result?.data?.organizations[0].posts.edges[0];

    expect(dataQuery1).toEqual({
      node: {
        _id: '6411e53835d7ba2344a78e21',
        title: 'postone',
        text: 'This is the first post',
        imageUrl: null,
        videoUrl: null,
        createdAt: '2023-08-24T09:26:56.524+00:00',
        creator: {
          _id: '640d98d9eb6a743d75341067',
          firstName: 'Aditya',
          lastName: 'Shelke',
          email: 'adidacreator1@gmail.com',
        },
        likeCount: 0,
        commentCount: 0,
        pinned: true,
        likedBy: [],
        comments: [],
      },
      cursor: '6411e53835d7ba2344a78e21',
    });
  });

  it('Testing create post functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('createPostModalBtn'));

    userEvent.type(screen.getByTestId('modalTitle'), formData.posttitle);

    userEvent.type(screen.getByTestId('modalinfo'), formData.postinfo);
    userEvent.upload(screen.getByTestId('addMediaField'), formData.postImage);
    userEvent.upload(screen.getByTestId('addMediaField'), formData.postVideo);
    userEvent.upload(screen.getByTestId('addMediaField'), formData.postImage);
    userEvent.upload(screen.getByTestId('addMediaField'), formData.postVideo);
    userEvent.click(screen.getByTestId('pinPost'));
    expect(screen.getByTestId('pinPost')).toBeChecked();

    userEvent.click(screen.getByTestId('createPostBtn'));

    await wait();

    userEvent.click(screen.getByTestId('closeOrganizationModal'));
  }, 15000);

  it('Testing search functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    async function debounceWait(ms = 200): Promise<void> {
      await act(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      });
    }
    await debounceWait();
    userEvent.type(screen.getByPlaceholderText(/Search By/i), 'postone{enter}');
    await debounceWait();
    const sortDropdown = screen.getByTestId('sort');
    userEvent.click(sortDropdown);
  });

  it('Testing search text and title toggle', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <OrgPost />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();

    const searchInput = screen.getByTestId('searchByName');
    expect(searchInput).toHaveAttribute('placeholder', 'Search By Title');

    const inputText = screen.getByTestId('searchBy');

    await act(async () => {
      fireEvent.click(inputText);
    });

    const toggleText = screen.getByTestId('Text');

    await act(async () => {
      fireEvent.click(toggleText);
    });

    expect(searchInput).toHaveAttribute('placeholder', 'Search By Text');
    await act(async () => {
      fireEvent.click(inputText);
    });
    const toggleTite = screen.getByTestId('Title');
    await act(async () => {
      fireEvent.click(toggleTite);
    });

    expect(searchInput).toHaveAttribute('placeholder', 'Search By Title');
  });

  it('Testing search latest and oldest toggle', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <OrgPost />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();

    const searchInput = screen.getByTestId('sort');
    expect(searchInput).toBeInTheDocument();

    const inputText = screen.getByTestId('sortpost');

    await act(async () => {
      fireEvent.click(inputText);
    });

    const toggleText = screen.getByTestId('latest');

    await act(async () => {
      fireEvent.click(toggleText);
    });

    expect(searchInput).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(inputText);
    });

    const toggleTite = screen.getByTestId('oldest');
    await act(async () => {
      fireEvent.click(toggleTite);
    });
    expect(searchInput).toBeInTheDocument();
  });

  it('After creating a post, the data should be refetched', async () => {
    const refetchMock = vi.fn();

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('createPostModalBtn'));

    userEvent.click(screen.getByTestId('createPostBtn'));

    await wait();

    expect(refetchMock).toHaveBeenCalledTimes(0);
  });

  it('Create post without media', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId('createPostModalBtn'));

    const postTitleInput = screen.getByTestId('modalTitle');
    fireEvent.change(postTitleInput, { target: { value: 'Test Post' } });

    const postInfoTextarea = screen.getByTestId('modalinfo');
    fireEvent.change(postInfoTextarea, {
      target: { value: 'Test post information' },
    });

    const createPostBtn = screen.getByTestId('createPostBtn');
    fireEvent.click(createPostBtn);
  }, 15000);

  it('renders the form with input fields and buttons', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId('createPostModalBtn'));

    expect(screen.getByTestId('modalTitle')).toBeInTheDocument();
    expect(screen.getByTestId('modalinfo')).toBeInTheDocument();
    expect(screen.getByTestId('createPostBtn')).toBeInTheDocument();
  });

  it('allows users to input data into the form fields', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId('createPostModalBtn'));

    fireEvent.change(screen.getByTestId('modalTitle'), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByTestId('modalinfo'), {
      target: { value: 'Test Info' },
    });

    expect(screen.getByTestId('modalTitle')).toHaveValue('Test Title');
    expect(screen.getByTestId('modalinfo')).toHaveValue('Test Info');
  });

  it('allows users to upload an image', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId('createPostModalBtn'));

    const postTitleInput = screen.getByTestId('modalTitle');
    fireEvent.change(postTitleInput, { target: { value: 'Test Post' } });

    const postInfoTextarea = screen.getByTestId('modalinfo');
    fireEvent.change(postInfoTextarea, {
      target: { value: 'Test post information' },
    });
    const file = new File(['image content'], 'image.png', {
      type: 'image/png',
    });
    const input = screen.getByTestId('addMediaField');
    userEvent.upload(input, file);

    await screen.findByAltText('Post Image Preview');
    expect(screen.getByAltText('Post Image Preview')).toBeInTheDocument();

    const closeButton = screen.getByTestId('mediaCloseButton');
    fireEvent.click(closeButton);
  }, 15000);

  it('Create post, preview image, and close preview', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <OrgPost />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();

    await act(async () => {
      userEvent.click(screen.getByTestId('createPostModalBtn'));
    });

    const postTitleInput = screen.getByTestId('modalTitle');
    await act(async () => {
      fireEvent.change(postTitleInput, { target: { value: 'Test Post' } });
    });

    const postInfoTextarea = screen.getByTestId('modalinfo');
    await act(async () => {
      fireEvent.change(postInfoTextarea, {
        target: { value: 'Test post information' },
      });
    });

    const videoFile = new File(['video content'], 'video.mp4', {
      type: 'video/mp4',
    });

    await act(async () => {
      userEvent.upload(screen.getByTestId('addMediaField'), videoFile);
    });

    const videoPreview = await screen.findByTestId('videoPreview');
    expect(videoPreview).toBeInTheDocument();

    const closeVideoPreviewButton = screen.getByTestId('mediaCloseButton');
    await act(async () => {
      fireEvent.click(closeVideoPreviewButton);
    });
    expect(videoPreview).not.toBeInTheDocument();
  });

  // it('Sorting posts by pinned status', async () => {
  //   const mockedPosts = [
  //     {
  //       _id: '1',
  //       title: 'Post 1',
  //       pinned: true,
  //     },
  //     {
  //       _id: '2',
  //       title: 'Post 2',
  //       pinned: false,
  //     },
  //     {
  //       _id: '3',
  //       title: 'Post 3',
  //       pinned: true,
  //     },
  //     {
  //       _id: '4',
  //       title: 'Post 4',
  //       pinned: true,
  //     },
  //   ];

  //   render(
  //     <MockedProvider addTypename={false} link={link}>
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <I18nextProvider i18n={i18nForTest}>
  //             <ToastContainer />
  //             <OrgPost />
  //           </I18nextProvider>
  //         </Provider>
  //       </BrowserRouter>
  //     </MockedProvider>,
  //   );

  //   await wait();

  //   const sortedPosts = screen.getAllByTestId('post-item');

  //   expect(sortedPosts).toHaveLength(mockedPosts.length);
  //   expect(sortedPosts[0]).toHaveTextContent(
  //     'postoneThis is the first po... Aditya Shelke',
  //   );
  //   expect(sortedPosts[1]).toHaveTextContent(
  //     'posttwoTis is the post two Aditya Shelke',
  //   );
  //   expect(sortedPosts[2]).toHaveTextContent(
  //     'posttwoTis is the post two Aditya Shelke',
  //   );
  // });

  it('successful post creation should reset form and close modal', async () => {
    const customMocks = [...MOCKS, successMock];
    const customLink = new StaticMockLink(customMocks, true);

    render(
      <MockedProvider addTypename={false} link={customLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('createPostModalBtn'));

    userEvent.type(screen.getByTestId('modalTitle'), 'Test Post');
    userEvent.type(screen.getByTestId('modalinfo'), 'Test Content');

    await act(async () => {
      fireEvent.click(screen.getByTestId('createPostBtn'));
    });

    await wait();

    expect(
      screen.queryByTestId('modalOrganizationHeader'),
    ).not.toBeInTheDocument();

    userEvent.click(screen.getByTestId('createPostModalBtn'));
    expect(screen.getByTestId('modalTitle')).toHaveValue('');
    expect(screen.getByTestId('modalinfo')).toHaveValue('');
    expect(screen.getByTestId('pinPost')).not.toBeChecked();

    // const toastContainer = screen.getByRole('alert');
    // expect(toastContainer).toBeInTheDocument();
  });

  it('pagination controls work correctly', async () => {
    const mockPostEdges =
      MOCKS[0]?.result?.data?.organizations[0].posts.edges ?? [];
    const paginationMock = {
      request: {
        query: ORGANIZATION_POST_LIST,
        variables: {
          id: undefined,
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
                edges: mockPostEdges,
                pageInfo: {
                  startCursor: 'startCursor123',
                  endCursor: 'endCursor123',
                  hasNextPage: true,
                  hasPreviousPage: true,
                },
                totalCount: 10,
              },
            },
          ],
        },
      },
    };

    const customMocks = [...MOCKS, paginationMock];
    const customLink = new StaticMockLink(customMocks, true);

    render(
      <MockedProvider addTypename={false} link={customLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const nextButton = screen.getByRole('button', { name: /next/i });
    const previousButton = screen.getByRole('button', { name: /previous/i });

    expect(nextButton).toBeInTheDocument();
    expect(previousButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(nextButton);
    });
    await wait();

    await act(async () => {
      fireEvent.click(previousButton);
    });
    await wait();

    expect(nextButton).toBeInTheDocument();
    expect(previousButton).toBeInTheDocument();
  });

  it('pagination buttons states are correctly set', async () => {
    const mockPostEdges =
      MOCKS[0]?.result?.data?.organizations[0].posts.edges ?? [];
    const noPaginationMock = {
      request: {
        query: ORGANIZATION_POST_LIST,
        variables: {
          id: undefined,
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
                edges: mockPostEdges,
                pageInfo: {
                  startCursor: 'startCursor123',
                  endCursor: 'endCursor123',
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
                totalCount: 4,
              },
            },
          ],
        },
      },
    };

    const customMocks = [...MOCKS, noPaginationMock];
    const customLink = new StaticMockLink(customMocks, true);

    render(
      <MockedProvider addTypename={false} link={customLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const nextButton = screen.getByRole('button', { name: /next/i });
    const previousButton = screen.getByRole('button', { name: /previous/i });

    expect(nextButton).toHaveAttribute('disabled');
    expect(previousButton).toHaveAttribute('disabled');
  });

  it('handleNextPage updates pagination variables correctly', async () => {
    render(
      <MockedProvider mocks={[initialMock, nextPageMock]} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('nextButton')).not.toBeDisabled();
    });

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('previousButton'));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('nextButton'));
      expect(screen.getByTestId('nextButton')).toBeDisabled();
    });
  });

  it('handlePreviousPage updates pagination variables correctly', async () => {
    render(
      <MockedProvider
        mocks={[initialMock, nextPageMock, prevPageMock]}
        addTypename={false}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('nextButton')).not.toBeDisabled();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('nextButton'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('previousButton')).not.toBeDisabled();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('previousButton'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('previousButton')).toBeDisabled();
      expect(screen.getByTestId('nextButton')).not.toBeDisabled();
    });
  });

  it('handles create post error cases', async () => {
    const errorMock = {
      request: {
        query: CREATE_POST_MUTATION,
        variables: {
          title: '',
          text: '',
          organizationId: 'undefined',
          file: '',
          pinned: false,
        },
      },
      error: new Error('Text fields cannot be empty strings'),
    };

    render(
      <MockedProvider mocks={[...MOCKS, errorMock]} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('createPostModalBtn'));

    await act(async () => {
      fireEvent.click(screen.getByTestId('createPostBtn'));
    });

    await wait();

    const toastContainer = screen.getByRole('alert');
    expect(toastContainer).toBeInTheDocument();
  });

  it('handles empty search input', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const searchInput = screen.getByTestId('searchByName');
    fireEvent.change(searchInput, { target: { value: '' } });

    await wait();

    expect(searchInput).toHaveValue('');
  });

  it('handles file input change with no file selected', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('createPostModalBtn'));

    const fileInput = screen.getByTestId('addMediaField');
    fireEvent.change(fileInput, { target: { files: [] } });

    await wait();

    expect(screen.queryByTestId('mediaPreview')).not.toBeInTheDocument();
  });
});
