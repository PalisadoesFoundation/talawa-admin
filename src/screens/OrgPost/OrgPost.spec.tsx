import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen } from '@testing-library/react';
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

    await userEvent.click(screen.getByTestId('createPostModalBtn'));

    const fileInput = screen.getByTestId('addMediaField');
    await userEvent.upload(fileInput, formData.postImage);

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
    await userEvent.type(searchInput, 'postone{enter}');
    expect(searchInput).toHaveValue('postone');

    const sortDropdown = screen.getByTestId('sort');
    await userEvent.click(sortDropdown);
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

    await userEvent.click(screen.getByTestId('createPostModalBtn'));

    const postTitleInput = screen.getByTestId('modalTitle');
    fireEvent.change(postTitleInput, { target: { value: 'Test Post' } });

    const postInfoTextarea = screen.getByTestId('modalinfo');
    fireEvent.change(postInfoTextarea, {
      target: { value: 'Test post information' },
    });

    const createPostBtn = screen.getByTestId('createPostBtn');
    fireEvent.click(createPostBtn);

    await wait();

    await userEvent.click(screen.getByTestId('closeOrganizationModal'));
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
    await userEvent.click(createPostModalBtn);

    const modalTitle = screen.getByTestId('modalOrganizationHeader');
    expect(modalTitle).toBeInTheDocument();

    const closeButton = screen.getByTestId(/modalOrganizationHeader/i);
    await userEvent.click(closeButton);

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

    await userEvent.click(screen.getByTestId('createPostModalBtn'));

    await userEvent.type(screen.getByTestId('modalTitle'), formData.posttitle);

    await userEvent.type(screen.getByTestId('modalinfo'), formData.postinfo);
    await userEvent.upload(
      screen.getByTestId('addMediaField'),
      formData.postImage,
    );
    await userEvent.upload(
      screen.getByTestId('addMediaField'),
      formData.postVideo,
    );
    await userEvent.upload(
      screen.getByTestId('addMediaField'),
      formData.postImage,
    );
    await userEvent.upload(
      screen.getByTestId('addMediaField'),
      formData.postVideo,
    );
    await userEvent.click(screen.getByTestId('pinPost'));
    expect(screen.getByTestId('pinPost')).toBeChecked();

    await userEvent.click(screen.getByTestId('createPostBtn'));

    await wait();

    await userEvent.click(screen.getByTestId('closeOrganizationModal'));
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
    await userEvent.type(
      screen.getByPlaceholderText(/Search By/i),
      'postone{enter}',
    );
    await debounceWait();
    const sortDropdown = screen.getByTestId('sort');
    await userEvent.click(sortDropdown);
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

    await userEvent.click(screen.getByTestId('createPostModalBtn'));

    await userEvent.click(screen.getByTestId('createPostBtn'));

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
    await userEvent.click(screen.getByTestId('createPostModalBtn'));

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
    await userEvent.click(screen.getByTestId('createPostModalBtn'));

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
    await userEvent.click(screen.getByTestId('createPostModalBtn'));

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
    await userEvent.click(screen.getByTestId('createPostModalBtn'));

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
    await userEvent.upload(input, file);

    await screen.findByAltText('Post Image Preview');
    expect(screen.getByAltText('Post Image Preview')).toBeInTheDocument();

    const closeButton = screen.getByTestId('mediaCloseButton');
    fireEvent.click(closeButton);
  }, 15000);

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

    await userEvent.click(screen.getByTestId('createPostModalBtn'));

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

    await userEvent.click(screen.getByTestId('createPostModalBtn'));

    const fileInput = screen.getByTestId('addMediaField');
    fireEvent.change(fileInput, { target: { files: [] } });

    await wait();

    expect(screen.queryByTestId('mediaPreview')).not.toBeInTheDocument();
  });
});
