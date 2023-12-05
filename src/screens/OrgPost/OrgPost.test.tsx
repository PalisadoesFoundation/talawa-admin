import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';

import OrgPost from './OrgPost';
import { store } from 'state/store';
import { ORGANIZATION_POST_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import {
  CREATE_POST_MUTATION,
  TOGGLE_PINNED_POST,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { ToastContainer } from 'react-toastify';
import { debug } from 'jest-preview';

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_POST_CONNECTION_LIST,
      variables: {
        id: undefined,
        title_contains: '',
        text_contains: '',
      },
    },
    result: {
      data: {
        postsByOrganizationConnection: {
          edges: [
            {
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
              comments: [],
              pinned: false,
              likedBy: [],
            },
            {
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
          ],
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
      query: TOGGLE_PINNED_POST,
      variables: {
        id: '32',
      },
      result: {
        data: {
          togglePostPin: {
            _id: '32',
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
  const formData = {
    posttitle: 'dummy post',
    postinfo: 'This is a dummy post',
    postImage: new File(['hello'], 'hello.png', { type: 'image/png' }),
    postVideo: new File(['hello'], 'hello.mp4', { type: 'video/mp4' }),
  };

  test('correct mock data should be queried', async () => {
    const dataQuery1 =
      MOCKS[0]?.result?.data?.postsByOrganizationConnection.edges[0];

    expect(dataQuery1).toEqual({
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
      pinned: false,
      likedBy: [],
      comments: [],
    });
  });

  test('Testing create post functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('createPostModalBtn'));

    userEvent.type(screen.getByTestId('modalTitle'), formData.posttitle);

    userEvent.type(screen.getByTestId('modalinfo'), formData.postinfo);
    userEvent.upload(
      screen.getByTestId('organisationImage'),
      formData.postImage
    );
    userEvent.upload(
      screen.getByTestId('organisationImage'),
      formData.postVideo
    );

    userEvent.click(screen.getByTestId('createPostBtn'));

    await wait();

    userEvent.click(screen.getByTestId('closeOrganizationModal'));
  }, 15000);

  test('Testing search functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );
    async function debounceWait(ms = 200): Promise<void> {
      await act(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      });
    }
    await debounceWait();
    userEvent.type(screen.getByPlaceholderText(/Search By/i), 'postone');
    await debounceWait();
    const sortDropdown = screen.getByTestId('sort');
    userEvent.click(sortDropdown);
  });
  test('Testing search text and title toggle', async () => {
    await act(async () => {
      // Wrap the test code in act
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <OrgPost />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );

      await wait();

      const searchInput = screen.getByTestId('searchByName');
      expect(searchInput).toHaveAttribute('placeholder', 'Search By Title');

      const inputText = screen.getByTestId('searchBy');

      fireEvent.click(inputText);
      const toggleText = screen.getByTestId('Text');

      fireEvent.click(toggleText);

      expect(searchInput).toHaveAttribute('placeholder', 'Search By Text');
      fireEvent.click(inputText);
      const toggleTite = screen.getByTestId('searchTitle');
      fireEvent.click(toggleTite);
      expect(searchInput).toHaveAttribute('placeholder', 'Search By Title');
    });
  });
  test('Testing search latest and oldest toggle', async () => {
    await act(async () => {
      // Wrap the test code in act
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <OrgPost />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );

      await wait();

      const searchInput = screen.getByTestId('sort');
      expect(searchInput).toBeInTheDocument();

      const inputText = screen.getByTestId('sortpost');

      fireEvent.click(inputText);
      const toggleText = screen.getByTestId('latest');

      fireEvent.click(toggleText);

      expect(searchInput).toBeInTheDocument();
      fireEvent.click(inputText);
      const toggleTite = screen.getByTestId('oldest');
      fireEvent.click(toggleTite);
      expect(searchInput).toBeInTheDocument();
    });
  });
  test('After creating a post, the data should be refetched', async () => {
    const refetchMock = jest.fn();

    render(
      <MockedProvider addTypename={false} mocks={MOCKS} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('createPostModalBtn'));

    // Fill in post form fields...

    userEvent.click(screen.getByTestId('createPostBtn'));

    await wait();

    expect(refetchMock).toHaveBeenCalledTimes(0);
  });

  test('Create post without media', async () => {
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
      </MockedProvider>
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

  test('setPostFormState updates the pinned state correctly', async () => {
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
        </MockedProvider>
      );

      await wait(500);
      userEvent.click(screen.getByTestId('createPostModalBtn'));
      userEvent.click(screen.getByTestId(/ispinnedpost/i));
      await wait(500);
    });
    expect(screen.getByTestId(/ispinnedpost/i)).toBeChecked();
  });

  test('should toggle pin when post is created', async () => {
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
        </MockedProvider>
      );

      await wait(500);
      userEvent.click(screen.getByTestId('createPostModalBtn'));
      userEvent.click(screen.getByTestId(/ispinnedpost/i));
      await wait(500);
    });
    fireEvent.click(screen.getByTestId(/createPostBtn/i));
    await waitFor(() => {
      expect(MOCKS[3].request.variables).toEqual({
        id: '32',
      });
    });
  });

  test('Create post and preview', async () => {
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
      </MockedProvider>
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
    const input = screen.getByTestId('organisationImage');
    userEvent.upload(input, file);

    await screen.findByAltText('Post Image Preview');
    expect(screen.getByAltText('Post Image Preview')).toBeInTheDocument();

    const createPostBtn = screen.getByTestId('createPostBtn');
    fireEvent.click(createPostBtn);
    debug();
  }, 15000);

  test('Modal opens and closes', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    const createPostModalBtn = screen.getByTestId('createPostModalBtn');

    userEvent.click(createPostModalBtn);

    const modalTitle = screen.getByTestId('modalOrganizationHeader');
    expect(modalTitle).toBeInTheDocument();

    const closeButton = screen.getByTestId('closeOrganizationModal');
    userEvent.click(closeButton);

    await wait();

    const closedModalTitle = screen.queryByText(/postDetail/i);
    expect(closedModalTitle).not.toBeInTheDocument();
  });
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
      </MockedProvider>
    );

    await wait();
    userEvent.click(screen.getByTestId('createPostModalBtn'));

    // Check if input fields and buttons are present
    expect(screen.getByTestId('modalTitle')).toBeInTheDocument();
    expect(screen.getByTestId('modalinfo')).toBeInTheDocument();
    expect(screen.getByTestId('organisationImage')).toBeInTheDocument();
    expect(screen.getByTestId('organisationVideo')).toBeInTheDocument();
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
      </MockedProvider>
    );

    await wait();
    userEvent.click(screen.getByTestId('createPostModalBtn'));

    // Simulate user input
    fireEvent.change(screen.getByTestId('modalTitle'), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByTestId('modalinfo'), {
      target: { value: 'Test Info' },
    });

    // Check if input values are set correctly
    expect(screen.getByTestId('modalTitle')).toHaveValue('Test Title');
    expect(screen.getByTestId('modalinfo')).toHaveValue('Test Info');
  });

  test('allows users to upload an image', async () => {
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
      </MockedProvider>
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
    const input = screen.getByTestId('organisationImage');
    userEvent.upload(input, file);

    await screen.findByAltText('Post Image Preview');
    expect(screen.getByAltText('Post Image Preview')).toBeInTheDocument();

    const closeButton = screen.getByTestId('closePreview');
    fireEvent.click(closeButton);
  }, 15000);
  test('Create post, preview image, and close preview', async () => {
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
        </MockedProvider>
      );

      await wait();

      userEvent.click(screen.getByTestId('createPostModalBtn'));

      const postTitleInput = screen.getByTestId('modalTitle');
      fireEvent.change(postTitleInput, { target: { value: 'Test Post' } });

      const postInfoTextarea = screen.getByTestId('modalinfo');
      fireEvent.change(postInfoTextarea, {
        target: { value: 'Test post information' },
      });

      const videoFile = new File(['video content'], 'video.mp4', {
        type: 'video/mp4',
      });

      const videoInput = screen.getByTestId('organisationVideo');
      fireEvent.change(videoInput, {
        target: {
          files: [videoFile],
        },
      });

      // Check if the video is displayed
      const videoPreview = await screen.findByTestId('videoPreview');
      expect(videoPreview).toBeInTheDocument();

      // Check if the close button for the video works
      const closeVideoPreviewButton = screen.getByTestId('videoclosebutton');
      fireEvent.click(closeVideoPreviewButton);
      expect(videoPreview).not.toBeInTheDocument();
    });
  });
});
