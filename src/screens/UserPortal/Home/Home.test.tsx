import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import {
  ORGANIZATION_POST_CONNECTION_LIST,
  ADVERTISEMENTS_GET,
} from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Home from './Home';
import userEvent from '@testing-library/user-event';
import * as getOrganizationId from 'utils/getOrganizationId';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import {
  REACT_ADMIN_FRONTEND_HOST,
  REACT_APP_CUSTOM_PORT,
} from 'Constant/constant';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
  },
}));

const EMPTY_MOCKS = [
  {
    request: {
      query: ADVERTISEMENTS_GET,
    },
    result: {
      data: {
        getAdvertisements: [],
      },
    },
  },
];

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_POST_CONNECTION_LIST,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        postsByOrganizationConnection: {
          edges: [
            {
              _id: '6411e53835d7ba2344a78e21',
              title: 'postone',
              text: 'THis is the frist post',
              imageUrl: null,
              videoUrl: null,
              creator: {
                _id: '640d98d9eb6a743d75341067',
                firstName: 'Aditya',
                lastName: 'Shelke',
                email: 'adidacreator1@gmail.com',
              },
              createdAt: dayjs(new Date()).add(1, 'day'),
              likeCount: 0,
              commentCount: 0,
              comments: [],
              likedBy: [],
              pinned: false,
            },
            {
              _id: '6411e54835d7ba2344a78e29',
              title: 'posttwo',
              text: 'THis is the post two',
              imageUrl: null,
              videoUrl: null,
              creator: {
                _id: '640d98d9eb6a743d75341067',
                firstName: 'Aditya',
                lastName: 'Shelke',
                email: 'adidacreator1@gmail.com',
              },
              createdAt: dayjs(new Date()).add(1, 'day'),
              likeCount: 0,
              commentCount: 2,
              comments: [
                {
                  _id: '64eb13beca85de60ebe0ed0e',
                  creator: {
                    _id: '63d6064458fce20ee25c3bf7',
                    firstName: 'Noble',
                    lastName: 'Mittal',
                    email: 'test@gmail.com',
                    __typename: 'User',
                  },
                  likeCount: 1,
                  likedBy: [
                    {
                      _id: 1,
                    },
                  ],
                  text: 'First comment from Talawa user portal.',
                  __typename: 'Comment',
                },
                {
                  _id: '64eb483aca85de60ebe0ef99',
                  creator: {
                    _id: '63d6064458fce20ee25c3bf7',
                    firstName: 'Noble',
                    lastName: 'Mittal',
                    email: 'test@gmail.com',
                    createdAt: '2023-02-18T09:22:27.969Z',

                    __typename: 'User',
                  },
                  likeCount: 0,
                  likedBy: [],
                  text: 'Great View',
                  __typename: 'Comment',
                },
              ],
              likedBy: [
                {
                  _id: '63d6064458fce20ee25c3bf7',
                  firstName: 'test',
                  lastName: 'abc',
                },
              ],
              pinned: false,
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
      query: ADVERTISEMENTS_GET,
      variables: {},
    },
    result: {
      data: {
        getAdvertisements: [
          {
            _id: '1234',
            name: 'Ad 1',
            type: 'Type 1',
            orgId: 'orgId',
            link: 'Link 1',
            endDate: '2024-12-31',
            startDate: '2022-01-01',
          },
          {
            _id: '2345',
            name: 'Ad 2',
            type: 'Type 1',
            orgId: 'orgId',
            link: 'Link 2',
            endDate: '2024-09-31',
            startDate: '2023-04-01',
          },
          {
            _id: '3456',
            name: 'name3',
            type: 'Type 2',
            orgId: 'orgId',
            link: 'link3',
            startDate: '2023-01-30',
            endDate: '2023-12-31',
          },
          {
            _id: '4567',
            name: 'name4',
            type: 'Type 2',
            orgId: 'org1',
            link: 'link4',
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

beforeEach(() => {
  const url = REACT_APP_CUSTOM_PORT
    ? `${REACT_ADMIN_FRONTEND_HOST}:${REACT_APP_CUSTOM_PORT}/user/organization/id=orgId`
    : `${REACT_ADMIN_FRONTEND_HOST}/user/organization/id=orgId`;
  Object.defineProperty(window, 'location', {
    value: {
      href: url,
    },
    writable: true,
  });
});

let originalLocation: Location;

beforeAll(() => {
  originalLocation = window.location;
});

afterAll(() => {
  window.location = originalLocation;
});

describe('Testing Home Screen [User Portal]', () => {
  jest.mock('utils/getOrganizationId');

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
    const getOrganizationIdSpy = jest
      .spyOn(getOrganizationId, 'default')
      .mockImplementation(() => {
        return '';
      });

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Home />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(getOrganizationIdSpy).toHaveBeenCalled();
  });

  test('Screen should be rendered properly when user types on the Post Input', async () => {
    const getOrganizationIdSpy = jest
      .spyOn(getOrganizationId, 'default')
      .mockImplementation(() => {
        return '';
      });

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Home />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(getOrganizationIdSpy).toHaveBeenCalled();

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
      </MockedProvider>
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
      </MockedProvider>
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
      </MockedProvider>
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
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('startPostBtn'));
    const modalHeader = screen.getByTestId('startPostModal');
    expect(modalHeader).toBeInTheDocument();

    userEvent.type(screen.getByTestId('postInput'), 'some content');
    userEvent.upload(
      screen.getByTestId('postImageInput'),
      new File(['image content'], 'image.png', { type: 'image/png' })
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
      </MockedProvider>
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
      </MockedProvider>
    );

    expect(screen.queryByText('Ad 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Ad 2')).not.toBeInTheDocument();
  });
});
