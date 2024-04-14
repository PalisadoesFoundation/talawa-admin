import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { act, render, waitFor } from '@testing-library/react';
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
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

const MOCKS = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: 'properId',
      },
    },
    result: {
      data: {
        user: {
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
        },
      },
    },
  },
  {
    request: {
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
                  address: {
                    city: 'abc',
                    countryCode: '123',
                    postalCode: '456',
                    state: 'def',
                    dependentLocality: 'ghi',
                    line1: 'asdfg',
                    line2: 'dfghj',
                    sortingCode: '4567',
                  },
                  createdAt: '1234567890',
                  userRegistrationRequired: true,
                  creator: {
                    __typename: 'User',
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                  members: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  admins: [
                    {
                      _id: '45gj5678jk45678fvgbhnr4rtgh',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  membershipRequests: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
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
      },
    },
    result: {
      data: {
        user: {
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
        },
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: 'imagePresent',
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
                  image: 'dadsa',
                  description: 'New Desc',
                  address: {
                    city: 'abc',
                    countryCode: '123',
                    postalCode: '456',
                    state: 'def',
                    dependentLocality: 'ghi',
                    line1: 'asdfg',
                    line2: 'dfghj',
                    sortingCode: '4567',
                  },
                  createdAt: '1234567890',
                  userRegistrationRequired: true,
                  creator: {
                    __typename: 'User',
                    firstName: 'John',
                    lastName: 'Doe',
                  },
                  members: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  admins: [
                    {
                      _id: '45gj5678jk45678fvgbhnr4rtgh',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  membershipRequests: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
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
        id: 'orgEmpty',
      },
    },
    result: {
      data: {
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
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: 'orgEmpty',
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              joinedOrganizations: [],
            },
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
  });
});
