import React, { act } from 'react';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import styles from './UserSidebar.module.css';
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

const resizeWindow = (width: number): void => {
  act(() => {
    window.innerWidth = width;
    fireEvent(window, new Event('resize'));
  });
};

const props = {
  hideDrawer: true,
  setHideDrawer: jest.fn(),
};

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
            <UserSidebar {...props} />
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

  test('Component should render properly with user data', async () => {
    await act(async () => {
      renderUserSidebar('properId', link);
      await wait();
    });
    expect(screen.getByText('Talawa User Portal')).toBeInTheDocument();
  });

  test('Logo and title are displayed', async () => {
    await act(async () => {
      renderUserSidebar('properId', link);
      await wait();
    });
    expect(screen.getByText('Talawa User Portal')).toBeInTheDocument();
    expect(screen.getByTestId('leftDrawerContainer')).toBeVisible();
  });

  test('Component should render properly when joinedOrganizations list is empty', async () => {
    await act(async () => {
      renderUserSidebar('orgEmpty', link);
      await wait();
    });
    expect(screen.getByText('My Organizations')).toBeInTheDocument();
  });

  test('Component should render with organization image present', async () => {
    await act(async () => {
      renderUserSidebar('imagePresent', link);
      await wait();
    });
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('Component renders correctly on smaller screen and toggles drawer', async () => {
    await act(async () => {
      resizeWindow(800);
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <UserSidebar {...props} />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    const orgsBtn = screen.getByTestId('orgsBtn');
    act(() => orgsBtn.click());
    expect(props.setHideDrawer).toHaveBeenCalledWith(true);
  });

  test('Button styles change correctly on active route', async () => {
    await act(async () => {
      renderUserSidebar('properId', link);
      await wait();
    });

    const orgsBtn = screen.getByTestId('orgsBtn');
    const settingsBtn = screen.getByTestId('settingsBtn');

    fireEvent.click(orgsBtn);
    expect(orgsBtn).toHaveClass('text-white btn btn-success');
    fireEvent.click(settingsBtn);
    expect(settingsBtn).toHaveClass('text-white btn btn-success');
  });

  test('Translation hook displays the correct text', async () => {
    await act(async () => {
      renderUserSidebar('properId', link);
      await wait();
    });
    expect(
      screen.getByText(i18nForTest.t('common:settings')),
    ).toBeInTheDocument();
  });

  test('handleLinkClick closes the sidebar on mobile view', async () => {
    resizeWindow(800);
    await act(async () => {
      renderUserSidebar('properId', link);
      await wait();
    });
    const chatBtn = screen.getByTestId('chatBtn');
    fireEvent.click(chatBtn);
    expect(props.setHideDrawer).toHaveBeenCalledWith(true);
  });
  describe('UserSidebar Drawer Visibility Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('Clicking a link when window width <= 820px should close the drawer', () => {
      // Set window width to 820px
      act(() => {
        window.innerWidth = 820;
        window.dispatchEvent(new Event('resize'));
      });

      render(
        <MockedProvider addTypename={false}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <UserSidebar {...props} />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      // Simulate link click to trigger handleLinkClick
      const linkElement = screen.getByText('My Organizations'); // Adjust text if different
      fireEvent.click(linkElement);

      // Check if setHideDrawer was called with `true`
      expect(props.setHideDrawer).toHaveBeenCalledWith(true);
    });

    describe('UserSidebar', () => {
      test('Drawer visibility based on hideDrawer prop', () => {
        const { rerender } = render(
          <MockedProvider addTypename={false}>
            <BrowserRouter>
              <Provider store={store}>
                <I18nextProvider i18n={i18nForTest}>
                  <UserSidebar {...props} hideDrawer={null} />
                </I18nextProvider>
              </Provider>
            </BrowserRouter>
          </MockedProvider>,
        );

        // Check for `hideElemByDefault` class when hideDrawer is null
        expect(screen.getByTestId('leftDrawerContainer')).toHaveClass(
          styles.hideElemByDefault,
        );

        // Rerender with hideDrawer set to true and verify `inactiveDrawer`
        rerender(
          <MockedProvider addTypename={false}>
            <BrowserRouter>
              <Provider store={store}>
                <I18nextProvider i18n={i18nForTest}>
                  <UserSidebar {...props} hideDrawer={true} />
                </I18nextProvider>
              </Provider>
            </BrowserRouter>
          </MockedProvider>,
        );
        expect(screen.getByTestId('leftDrawerContainer')).toHaveClass(
          styles.inactiveDrawer,
        );

        // Rerender with hideDrawer set to false and verify `activeDrawer`
        rerender(
          <MockedProvider addTypename={false}>
            <BrowserRouter>
              <Provider store={store}>
                <I18nextProvider i18n={i18nForTest}>
                  <UserSidebar {...props} hideDrawer={false} />
                </I18nextProvider>
              </Provider>
            </BrowserRouter>
          </MockedProvider>,
        );
        expect(screen.getByTestId('leftDrawerContainer')).toHaveClass(
          styles.activeDrawer,
        );
      });
    });
  });
});
