import React from 'react';
<<<<<<< HEAD
import type { RenderResult } from '@testing-library/react';
import { act, render, waitFor } from '@testing-library/react';
=======
import { act, render } from '@testing-library/react';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import {
  USER_DETAILS,
  USER_JOINED_ORGANIZATIONS,
} from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import UserSidebar from './UserSidebar';
<<<<<<< HEAD
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

const MOCKS = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
<<<<<<< HEAD
        id: 'properId',
=======
        id: localStorage.getItem('userId'),
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
    },
    result: {
      data: {
        user: {
<<<<<<< HEAD
          user: {
            _id: 'properId',
            image: null,
            firstName: 'Noble',
            lastName: 'Mittal',
            email: 'noble@mittal.com',
            createdAt: '2023-02-18T09:22:27.969Z',
            joinedOrganizations: [],
            membershipRequests: [],
            registeredEvents: [],
            gender: '',
            birthDate: '2024-03-14',
            educationGrade: '',
            employmentStatus: '',
            maritalStatus: '',
            address: {
              line1: '',
              countryCode: '',
              city: '',
              state: '',
            },
            phone: {
              mobile: '',
            },
          },
          appUserProfile: {
            _id: 'properId',
            adminFor: [],
            createdOrganizations: [],
            createdEvents: [],
            eventAdmin: [],
            isSuperAdmin: true,
            pluginCreationAllowed: true,
            appLanguageCode: 'en',
          },
=======
          __typename: 'User',
          image: null,
          firstName: 'Noble',
          lastName: 'Mittal',
          email: 'noble@mittal.com',
          role: 'SUPERADMIN',
          appLanguageCode: 'en',
          userType: 'SUPERADMIN',
          pluginCreationAllowed: true,
          adminApproved: true,
          createdAt: '2023-02-18T09:22:27.969Z',
          adminFor: [],
          createdOrganizations: [],
          joinedOrganizations: [],
          organizationUserBelongsTo: null,
          organizationsBlockedBy: [],
          createdEvents: [],
          registeredEvents: [],
          eventAdmin: [],
          membershipRequests: [],
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        },
      },
    },
  },
  {
    request: {
<<<<<<< HEAD
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: 'properId',
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              joinedOrganizations: [
                {
                  __typename: 'Organization',
                  _id: '6401ff65ce8e8406b8f07af2',
                  name: 'Any Organization',
                  image: '',
                  description: 'New Desc',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: 'imagePresent',
=======
      query: USER_DETAILS,
      variables: {
        id: '2',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
    },
    result: {
      data: {
        user: {
<<<<<<< HEAD
          user: {
            _id: '2',
            image: 'adssda',
            firstName: 'Noble',
            lastName: 'Mittal',
            email: 'noble@mittal.com',
            createdAt: '2023-02-18T09:22:27.969Z',
            joinedOrganizations: [],
            membershipRequests: [],
            registeredEvents: [],
            gender: '',
            birthDate: '2024-03-14',
            educationGrade: '',
            employmentStatus: '',
            maritalStatus: '',
            address: {
              line1: '',
              countryCode: '',
              city: '',
              state: '',
            },
            phone: {
              mobile: '',
            },
          },
          appUserProfile: {
            _id: '2',
            adminFor: [],
            createdOrganizations: [],
            createdEvents: [],
            eventAdmin: [],
            isSuperAdmin: true,
            pluginCreationAllowed: true,
            appLanguageCode: 'en',
          },
=======
          __typename: 'User',
          image: 'adssda',
          firstName: 'Noble',
          lastName: 'Mittal',
          email: 'noble@mittal.com',
          role: 'SUPERADMIN',
          appLanguageCode: 'en',
          userType: 'SUPERADMIN',
          pluginCreationAllowed: true,
          adminApproved: true,
          createdAt: '2023-02-18T09:22:27.969Z',
          adminFor: [],
          createdOrganizations: [],
          joinedOrganizations: [],
          organizationUserBelongsTo: null,
          organizationsBlockedBy: [],
          createdEvents: [],
          registeredEvents: [],
          eventAdmin: [],
          membershipRequests: [],
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        },
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
<<<<<<< HEAD
        id: 'imagePresent',
=======
        id: localStorage.getItem('userId'),
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
    },
    result: {
      data: {
        users: [
          {
<<<<<<< HEAD
            user: {
              joinedOrganizations: [
                {
                  __typename: 'Organization',
                  _id: '6401ff65ce8e8406b8f07af2',
                  name: 'Any Organization',
                  image: 'dadsa',
                  description: 'New Desc',
                },
              ],
            },
=======
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af2',
                name: 'Any Organization',
                image: '',
                description: 'New Desc',
              },
            ],
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          },
        ],
      },
    },
  },
  {
    request: {
<<<<<<< HEAD
      query: USER_DETAILS,
      variables: {
        id: 'orgEmpty',
=======
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: '2',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
    },
    result: {
      data: {
<<<<<<< HEAD
        user: {
          user: {
            _id: 'orgEmpty',
            image: null,
            firstName: 'Noble',
            lastName: 'Mittal',
            email: 'noble@mittal.com',
            createdAt: '2023-02-18T09:22:27.969Z',
            joinedOrganizations: [],
            membershipRequests: [],
            registeredEvents: [],
            gender: '',
            birthDate: '2024-03-14',
            educationGrade: '',
            employmentStatus: '',
            maritalStatus: '',
            address: {
              line1: '',
              countryCode: '',
              city: '',
              state: '',
            },
            phone: {
              mobile: '',
            },
          },
          appUserProfile: {
            _id: 'orgEmpty',
            adminFor: [],
            createdOrganizations: [],
            createdEvents: [],
            eventAdmin: [],
            isSuperAdmin: true,
            pluginCreationAllowed: true,
            appLanguageCode: 'en',
          },
        },
=======
        users: [
          {
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af2',
                name: 'Any Organization',
                image: 'dadsa',
                description: 'New Desc',
              },
            ],
          },
        ],
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
<<<<<<< HEAD
        id: 'orgEmpty',
=======
        id: '3',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
    },
    result: {
      data: {
        users: [
          {
<<<<<<< HEAD
            user: {
              joinedOrganizations: [],
            },
=======
            joinedOrganizations: [],
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          },
        ],
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

<<<<<<< HEAD
const renderUserSidebar = (
  userId: string,
  link: StaticMockLink,
): RenderResult => {
  setItem('userId', userId);
  return render(
    <MockedProvider addTypename={false} link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <UserSidebar />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('Testing UserSidebar Component [User Portal]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Component should be rendered properly', async () => {
    renderUserSidebar('properId', link);
    await wait();
  });

  test('Component should be rendered properly when userImage is present', async () => {
    renderUserSidebar('imagePresent', link);
    await wait();
  });

  test('Component should be rendered properly when organizationImage is present', async () => {
    renderUserSidebar('imagePresent', link);
    await wait();
  });

  test('Component should be rendered properly when joinedOrganizations list is empty', async () => {
    renderUserSidebar('orgEmpty', link);
    await wait();
=======
describe('Testing UserSidebar Component [User Portal]', () => {
  test('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });

  test('Component should be rendered properly when userImage is not undefined', async () => {
    const beforeUserId = localStorage.getItem('userId');

    localStorage.setItem('userId', '2');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
    if (beforeUserId) {
      localStorage.setItem('userId', beforeUserId);
    }
  });

  test('Component should be rendered properly when organizationImage is not undefined', async () => {
    const beforeUserId = localStorage.getItem('userId');

    localStorage.setItem('userId', '2');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    if (beforeUserId) {
      localStorage.setItem('userId', beforeUserId);
    }
  });

  test('Component should be rendered properly when joinedOrganizations list is empty', async () => {
    const beforeUserId = localStorage.getItem('userId');

    localStorage.setItem('userId', '3');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserSidebar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    if (beforeUserId) {
      localStorage.setItem('userId', beforeUserId);
    }
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });
});
