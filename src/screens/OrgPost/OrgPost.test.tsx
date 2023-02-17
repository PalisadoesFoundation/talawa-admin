import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';

import OrgPost from './OrgPost';
import { store } from 'state/store';
import { ORGANIZATION_POST_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_POST_CONNECTION_LIST,
    },
    result: {
      data: {
        postsByOrganization: [
          {
            _id: 1,
            title: 'Akatsuki',
            text: 'Capture Jinchuriki',
            imageUrl: '',
            videoUrl: '',
            creator: {
              _id: '583',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
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

async function wait(ms = 0) {
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
  };

  test('correct mock data should be queried', async () => {
    const dataQuery1 = MOCKS[0]?.result?.data?.postsByOrganization;

    expect(dataQuery1).toEqual([
      {
        _id: 1,
        title: 'Akatsuki',
        text: 'Capture Jinchuriki',
        imageUrl: '',
        videoUrl: '',
        creator: {
          _id: '583',
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@gmail.com',
        },
      },
    ]);
  });

  test('should render props and text elements test for the screen', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgPost />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.textContent).not.toBe('Loading data...');

    await wait();

    expect(container.textContent).toMatch('Posts by Title');
    expect(container.textContent).toMatch('Posts by Text');
    expect(container.textContent).toMatch('Posts by Text');
    expect(container.textContent).toMatch('Posts');
    expect(container.textContent).toMatch('+ Create Post');
  });

  test('Testing create post functionality', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
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

    userEvent.type(
      screen.getByPlaceholderText('Post Title'),
      formData.posttitle
    );
    userEvent.type(
      screen.getByPlaceholderText('What do you want to talk about?'),
      formData.postinfo
    );

    userEvent.click(screen.getByTestId('createPostBtn'));

    await wait();

    userEvent.click(screen.getByTestId('closePostModalBtn'));
  });

  test('Testing search functionality', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
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

    userEvent.type(
      screen.getByPlaceholderText('Search by Title'),
      formData.posttitle
    );
    userEvent.type(
      screen.getByPlaceholderText('Search by Text'),
      formData.postinfo
    );
  });

  test('Testing when post data is not present', async () => {
    window.location.assign('/orglist');

    render(
      <MockedProvider addTypename={false}>
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
    expect(window.location).toBeAt('/orglist');
  });
});
