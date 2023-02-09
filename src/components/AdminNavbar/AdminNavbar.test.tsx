import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'jest-localstorage-mock';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';

import AdminNavbar from './AdminNavbar';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { UPDATE_SPAM_NOTIFICATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';

const MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            _id: 1,
            image: '',
            name: 'Dummy Organization',
            description: 'This is a Dummy Organization',
            creator: {
              firstName: '',
              lastName: '',
              email: '',
            },
            location: 'New Delhi',
            apiUrl: 'www.dummyWebsite.com',
            members: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
            },
            admins: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
            },
            membershipRequests: {
              _id: '456',
              user: {
                firstName: 'Sam',
                lastName: 'Smith',
                email: 'samsmith@gmail.com',
              },
            },
            blockedUsers: {
              _id: '789',
              firstName: 'Steve',
              lastName: 'Smith',
              email: 'stevesmith@gmail.com',
            },
            tags: ['Shelter', 'NGO', 'Open Source'],
            isPublic: true,
            visibleInSearch: false,
            spamCount: [
              {
                _id: '6954',
                user: {
                  _id: '878',
                  firstName: 'Joe',
                  lastName: 'Root',
                  email: 'joeroot@gmail.com',
                },
                isReaded: false,
                groupchat: {
                  _id: '321',
                  title: 'Dummy',
                },
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: UPDATE_SPAM_NOTIFICATION_MUTATION,
      variables: { orgId: undefined, spamId: '6954', isReaded: true },
    },
    result: {
      data: {
        updateSpamNotification: {
          _id: '900',
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

describe('Testing Admin Navbar', () => {
  // eslint-disable-next-line jest/expect-expect

  const targets = [
    {
      name: 'Dashboard',
      comp_id: 'orgdash',
      component: 'OrganizationDashboard',
    },
    { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
    { name: 'People', comp_id: 'orgpeople', component: 'OrganizationPeople' },
    { name: 'Events', comp_id: 'orgevents', component: 'OrganizationEvents' },
    { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
    {
      name: 'Contributions',
      comp_id: 'orgcontribution',
      component: 'OrgContribution',
    },
    {
      name: 'Plugins',
      comp_id: 'plugin',
      component: 'AddOnStore',
      subTargets: [
        {
          name: 'Plugin Store',
          comp_id: 'orgstore',
          url: '/plugin',
          component: 'AddOnStore',
          icon: 'fa-store',
        },
      ],
    },
  ];

  const props = {
    targets,
    url_1: 'string',
  };

  test('should render following text elements', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <AdminNavbar {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    fireEvent.click(screen.getByText('Plugins'));
    fireEvent.click(screen.getByTestId('logoutDropdown'));

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('People')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Contributions')).toBeInTheDocument();
    expect(screen.getByText('Plugins')).toBeInTheDocument();
    expect(screen.getByTestId('dropdownIcon')).toBeTruthy();
    expect(screen.getByText('Plugin Store')).toBeInTheDocument();
    expect(screen.getByTestId('logoutDropdown')).toBeTruthy();
    expect(screen.getByText('Notification')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    userEvent.click(screen.getByText('Logout'));
  });

  test('Testing the notification functionality', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <AdminNavbar {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('NotificationsIcon'));
  });

  test('Testing, if spam id is present in local storage', async () => {
    localStorage.setItem('spamId', '6954');

    render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <AdminNavbar {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });

  test('Testing, if no mock data provided', async () => {
    window.location.assign('/orglist');

    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <AdminNavbar {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    expect(window.location).toBeAt('/orglist');
  });

  test('Testing change language functionality', async () => {
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <AdminNavbar {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('logoutDropdown'));
    userEvent.click(screen.getByTestId('languageDropdown'));
    userEvent.click(screen.getByTestId('changeLanguageBtn1'));
  });

  test('Testing when language cookie is not set', async () => {
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'i18next=',
    });

    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <AdminNavbar {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });
});
