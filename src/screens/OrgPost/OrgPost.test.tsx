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
import { StaticMockLink } from 'utils/StaticMockLink';

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
              text: 'THis is the frist post',
              imageUrl: null,
              videoUrl: null,
              creator: {
                _id: '640d98d9eb6a743d75341067',
                firstName: 'Aditya',
                lastName: 'Shelke',
                email: 'adidacreator1@gmail.com',
              },
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
];
const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink([], true);

async function wait(ms = 500) {
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
  };

  test('correct mock data should be queried', async () => {
    const dataQuery1 =
      MOCKS[0]?.result?.data?.postsByOrganizationConnection.edges[0];

    expect(dataQuery1).toEqual({
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
    });
  });

  test('should render props and text  elements test for the screen', async () => {
    const { container } = render(
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

    expect(container.textContent).not.toBe('Loading data...');

    await wait();

    expect(container.textContent).toMatch('Search Post');
    expect(container.textContent).toMatch('Posts');
    expect(container.textContent).toMatch('+ Create Post');
  });
  // Test : Render two radio buttons
  test('should render two radio buttons', async () => {
    const { container } = render(
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

    expect(container.textContent).not.toBe('Loading data...');

    await wait();

    expect(container.textContent).toMatch('Title');
    expect(container.textContent).toMatch('Text');
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

    userEvent.type(
      screen.getByPlaceholderText(/Post Title/i),
      formData.posttitle
    );

    userEvent.type(
      screen.getByPlaceholderText(/What do you to talk about?/i),
      formData.postinfo
    );
    userEvent.upload(screen.getByLabelText(/Post Image:/i), formData.postImage);

    userEvent.click(screen.getByTestId('createPostBtn'));

    await wait();

    userEvent.click(screen.getByTestId('closePostModalBtn'));
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
    async function debounceWait(ms = 200) {
      await act(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      });
    }
    await debounceWait();
    userEvent.type(screen.getByPlaceholderText(/Search By/i), 'postone');
    await debounceWait();
  });

  test('Testing when post data is not present', async () => {
    window.location.assign('/orglist');

    render(
      <MockedProvider addTypename={false} link={link2}>
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
