import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { ORGANIZATION_POST_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import * as getOrganizationId from 'utils/getOrganizationId';
import i18nForTest from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import Home from './Home';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
  },
}));

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
                image: '',
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
              pinned: true,
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
        title: '',
        text: 'This is a test',
        organizationId: '',
        file: '',
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

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

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
      </MockedProvider>,
    );

    await wait();

    expect(getOrganizationIdSpy).toHaveBeenCalled();
  });
  test('Should render the main heading', async () => {
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

    const mainHeading = screen.getByText('POSTS');
    expect(mainHeading).toBeInTheDocument();
  });

  test('Should render the sub heading', async () => {
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

    const mainHeading = screen.getByText('Feed');
    expect(mainHeading).toBeInTheDocument();
  });

  test('Should display "Start a Post" text', async () => {
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

    const startPostText = screen.getByText('Start a Post');
    expect(startPostText).toBeInTheDocument();
  });

  test('Should update postContent state on input change', async () => {
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

    const postInput = screen.getByTestId('postInput');
    userEvent.type(postInput, 'Testing post content');
    expect(postInput).toHaveValue('Testing post content');
  });

  test('Scroll right button should be in document for pinned posts.', async () => {
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

    const scrollRightButton = screen.getByTestId('scrollRightButton');
    expect(scrollRightButton).toBeInTheDocument();
  });
});
