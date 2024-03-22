import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

<<<<<<< HEAD
=======
import {
  ADVERTISEMENTS_GET,
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Home from './Home';
>>>>>>> develop-userTypeFix
import userEvent from '@testing-library/user-event';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import {
  ADVERTISEMENTS_GET,
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
<<<<<<< HEAD
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Home from './Home';
=======
import { REACT_APP_CUSTOM_PORT } from 'Constant/constant';
>>>>>>> develop-userTypeFix

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: 'orgId' }),
}));

const EMPTY_MOCKS = [
  {
    request: {
      query: ADVERTISEMENTS_GET,
    },
    result: {
      data: {
        advertisementsConnection: [],
      },
    },
  },
];

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        id: '',
        first: 10,
        after: null,
        before: null,
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
                    comments: [],
                    pinned: true,
                    likedBy: [],
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
      query: ADVERTISEMENTS_GET,
      variables: {},
    },
    result: {
      data: {
        advertisementsConnection: [
          {
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
          {
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
          {
            _id: '3456',
            name: 'name3',
            type: 'Type 2',
            organization: {
              _id: 'orgId',
            },
            mediaUrl: 'link3',
            startDate: '2023-01-30',
            endDate: '2023-12-31',
          },
          {
            _id: '4567',
            name: 'name4',
            type: 'Type 2',
            organization: {
<<<<<<< HEAD
              _id: 'orgId',
=======
              _id: 'orgId1',
>>>>>>> develop-userTypeFix
            },
            mediaUrl: 'link4',
            startDate: '2023-01-30',
            endDate: '2023-12-01',
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(EMPTY_MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Home Screen [User Portal]', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  test('Screen should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Home />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });

  test('Screen should be rendered properly when user types on the Post Input', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Home />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('startPostBtn'));

    const randomPostInput = 'This is a test';
    userEvent.type(screen.getByTestId('postInput'), randomPostInput);

    expect(screen.queryByText(randomPostInput)).toBeInTheDocument();
  });

  test('Error toast should be visible when user tries to create a post with an empty body', async () => {
    const toastSpy = jest.spyOn(toast, 'error');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Home />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId('startPostBtn'));

    userEvent.click(screen.getByTestId('createPostBtn'));

    expect(toastSpy).toBeCalledWith("Can't create a post with an empty body.");
  });

  test('Info toast should be visible when user tries to create a post with a valid body', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Home />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('startPostBtn'));

    const randomPostInput = 'This is a test';
    userEvent.type(screen.getByTestId('postInput'), randomPostInput);
    expect(screen.queryByText(randomPostInput)).toBeInTheDocument();

    userEvent.click(screen.getByTestId('createPostBtn'));

    expect(toast.error).not.toBeCalledWith();
    expect(toast.info).toBeCalledWith('Processing your post. Please wait.');
  });

  test('Modal should open on clicking on start a post button', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Home />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('startPostBtn'));
    const startPostModal = screen.getByTestId('startPostModal');
    expect(startPostModal).toBeInTheDocument();
  });

  test('modal closes on clicking on the close button', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Home />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('startPostBtn'));
    const modalHeader = screen.getByTestId('startPostModal');
    expect(modalHeader).toBeInTheDocument();

    userEvent.type(screen.getByTestId('postInput'), 'some content');
    userEvent.upload(
      screen.getByTestId('postImageInput'),
      new File(['image content'], 'image.png', { type: 'image/png' }),
    );

    // Check that the content and image have been added
    expect(screen.getByTestId('postInput')).toHaveValue('some content');
    await screen.findByAltText('Post Image Preview');
    expect(screen.getByAltText('Post Image Preview')).toBeInTheDocument();

    const closeButton = within(modalHeader).getByRole('button', {
      name: /close/i,
    });
    userEvent.click(closeButton);

    const closedModalText = screen.queryByText(/somethingOnYourMind/i);
    expect(closedModalText).not.toBeInTheDocument();

    expect(screen.getByTestId('postInput')).toHaveValue('');
    expect(screen.getByTestId('postImageInput')).toHaveValue('');
  });

  test('triggers file input when the icon is clicked', () => {
    const clickSpy = jest.spyOn(HTMLInputElement.prototype, 'click');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Home />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    userEvent.click(screen.getByTestId('startPostBtn'));

    // Check if the file input is hidden initially
    const postImageInput = screen.getByTestId('postImageInput');
    expect(postImageInput).toHaveAttribute('type', 'file');
    expect(postImageInput).toHaveStyle({ display: 'none' });

    // Trigger icon click event
    const iconButton = screen.getByTestId('addMediaBtn');
    fireEvent.click(iconButton);

    // Check if the file input is triggered to open
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  test('promoted post is not rendered if there is no ad content', () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Home />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.queryByText('Ad 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Ad 2')).not.toBeInTheDocument();
  });
});
