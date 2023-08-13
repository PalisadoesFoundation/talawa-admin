import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import { ORGANIZATION_POST_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
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
              },
              likeCount: 0,
              commentCount: 0,
              likedBy: [],
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
              likeCount: 0,
              commentCount: 0,
              likedBy: [
                {
                  _id: '63d6064458fce20ee25c3bf7',
                  firstName: 'test',
                  lastName: 'abc',
                },
              ],
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

    const randomPostInput = 'This is a test';
    userEvent.type(screen.getByTestId('postInput'), randomPostInput);

    expect(screen.queryByText(randomPostInput)).toBeInTheDocument();
  });

  test('Error toast should be visible when user tries to create a post with an empty body', async () => {
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

    userEvent.click(screen.getByTestId('postAction'));

    expect(toast.error).toBeCalledWith(
      "Can't create a post with an empty body."
    );
  });

  test('Info toast should be visible when user tries to create a post with a valid body', async () => {
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

    const randomPostInput = 'This is a test';
    userEvent.type(screen.getByTestId('postInput'), randomPostInput);
    expect(screen.queryByText(randomPostInput)).toBeInTheDocument();

    userEvent.click(screen.getByTestId('postAction'));

    expect(toast.error).not.toBeCalledWith();
    expect(toast.info).toBeCalledWith('Processing your post. Please wait.');
  });
});
