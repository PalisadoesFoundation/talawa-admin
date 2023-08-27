import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { act, render, screen, fireEvent } from '@testing-library/react';
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
              pinned: false,
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
              pinned: false,
              likedBy: [],
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

  const formDataEmpty = {
    posttitle: '   ',
    postinfo: '   ',
    postImage: new File(['hello'], 'hello.png', { type: 'image/png' }),
    postVideo: new File(['hello'], 'hello.mp4', { type: 'video/mp4' }),
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
      likeCount: 0,
      commentCount: 0,
      pinned: false,
      likedBy: [],
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

  // test('Create Post should throw error when empty strings have been entered', async () => {
  //   const { container } = render(
  //     <MockedProvider addTypename={false} link={link}>
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <I18nextProvider i18n={i18nForTest}>
  //             <ToastContainer />
  //             <OrgPost />
  //           </I18nextProvider>
  //         </Provider>
  //       </BrowserRouter>
  //     </MockedProvider>
  //   );

  //   await wait();

  //   userEvent.click(screen.getByTestId('createPostModalBtn'));

  //   userEvent.type(
  //     screen.getByPlaceholderText(/Post Title/i),
  //     formDataEmpty.posttitle
  //   );

  //   userEvent.type(
  //     screen.getByPlaceholderText(/What do you to talk about?/i),
  //     formDataEmpty.postinfo
  //   );

  //   userEvent.upload(
  //     screen.getByLabelText(/Post Image:/i),
  //     formDataEmpty.postImage
  //   );

  //   userEvent.click(screen.getByTestId('createPostBtn'));

  //   await wait();

  //   expect(container.textContent).toMatch(
  //     'Text fields cannot be empty strings'
  //   );
  // }, 15000);

  // test('Testing search functionality', async () => {
  //   render(
  //     <MockedProvider addTypename={false} link={link}>
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <I18nextProvider i18n={i18nForTest}>
  //             <OrgPost />
  //           </I18nextProvider>
  //         </Provider>
  //       </BrowserRouter>
  //     </MockedProvider>
  //   );
  //   async function debounceWait(ms = 200): Promise<void> {
  //     await act(() => {
  //       return new Promise((resolve) => {
  //         setTimeout(resolve, ms);
  //       });
  //     });
  //   }
  //   await debounceWait();
  //   userEvent.type(screen.getByPlaceholderText(/Search By/i), 'postone');
  //   await debounceWait();
  // });

  // test('Testing when post data is not present', async () => {
  //   window.location.assign('/orglist');

  //   render(
  //     <MockedProvider addTypename={false} link={link2}>
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <I18nextProvider i18n={i18nForTest}>
  //             <OrgPost />
  //           </I18nextProvider>
  //         </Provider>
  //       </BrowserRouter>
  //     </MockedProvider>
  //   );

  //   await wait();
  //   expect(window.location).toBeAt('/orglist');
  // });
  // test('Clicking the close button in the post modal should close the modal', async () => {
  //   render(
  //     <MockedProvider addTypename={false} mocks={MOCKS} link={link}>
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <I18nextProvider i18n={i18nForTest}>
  //             <ToastContainer />
  //             <OrgPost />
  //           </I18nextProvider>
  //         </Provider>
  //       </BrowserRouter>
  //     </MockedProvider>
  //   );

  //   await wait();

  //   userEvent.click(screen.getByTestId('createPostModalBtn'));

  //   // Fill in post form fields...

  //   userEvent.click(screen.getByTestId('closePostModalBtn'));

  //   await wait();

  //   expect(screen.queryByTestId('createPostModalBtn')).toBeInTheDocument();
  // });
  // test('After creating a post, the data should be refetched', async () => {
  //   const refetchMock = jest.fn();

  //   render(
  //     <MockedProvider addTypename={false} mocks={MOCKS} link={link}>
  //       <BrowserRouter>
  //         <Provider store={store}>
  //           <I18nextProvider i18n={i18nForTest}>
  //             <ToastContainer />
  //             <OrgPost />
  //           </I18nextProvider>
  //         </Provider>
  //       </BrowserRouter>
  //     </MockedProvider>
  //   );

  //   await wait();

  //   userEvent.click(screen.getByTestId('createPostModalBtn'));

  //   // Fill in post form fields...

  //   userEvent.click(screen.getByTestId('createPostBtn'));

  //   await wait();

  //   expect(refetchMock).toHaveBeenCalledTimes(0);
  // });

  // test('Create', async () => {
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
  //     </MockedProvider>
  //   );

  //   await wait();
  //   userEvent.click(screen.getByTestId('createPostModalBtn'));

  //   const postTitleInput = screen.getByTestId('posttitle');
  //   fireEvent.change(postTitleInput, { target: { value: 'Test Post' } });

  //   const postInfoTextarea = screen.getByTestId('info');
  //   fireEvent.change(postInfoTextarea, {
  //     target: { value: 'Test post information' },
  //   });

  //   const createPostBtn = screen.getByTestId('createPostBtn');
  //   fireEvent.click(createPostBtn);
  // }, 15000);

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
});
