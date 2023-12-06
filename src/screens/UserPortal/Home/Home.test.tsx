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
import dayjs from 'dayjs';

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

const setupComponent = async (): Promise<void> => {
  jest.spyOn(getOrganizationId, 'default').mockReturnValue('');
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
};

const typeInPostInput = (text: string): void => {
  userEvent.type(screen.getByTestId('postInput'), text);
};

const expectErrorToast = (message: string): void => {
  expect(toast.error).toHaveBeenCalledWith(message);
};

describe('Testing Home Screen [User Portal]', () => {
  test('should render the screen properly', async () => {
    await setupComponent();
    expect(getOrganizationId.default).toHaveBeenCalled();
  });

  test('should render the screen properly when user types on the Post Input', async () => {
    await setupComponent();
    expect(getOrganizationId.default).toHaveBeenCalled();

    const randomPostInput = 'This is a test';
    typeInPostInput(randomPostInput);

    expect(screen.queryByText(randomPostInput)).toBeInTheDocument();
  });

  test('should show an error toast when user tries to create a post with an empty body', async () => {
    await setupComponent();
    expect(getOrganizationId.default).toHaveBeenCalled();

    userEvent.click(screen.getByTestId('postAction'));

    expectErrorToast("Can't create a post with an empty body.");
  });

  test('should show an info toast when user tries to create a post with a valid body', async () => {
    await setupComponent();
    expect(getOrganizationId.default).toHaveBeenCalled();

    const randomPostInput = 'This is a test';
    typeInPostInput(randomPostInput);

    expect(screen.queryByText(randomPostInput)).toBeInTheDocument();

    userEvent.click(screen.getByTestId('postAction'));

    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.info).toHaveBeenCalledWith(
      'Processing your post. Please wait.'
    );
  });
});
