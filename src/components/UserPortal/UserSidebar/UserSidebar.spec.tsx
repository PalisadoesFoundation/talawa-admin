import React, { act } from 'react';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen } from '@testing-library/react';
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
import { vi } from 'vitest';

/**
 * Unit tests for UserSidebar component:
 *
 * 1. **Rendering with user data**: Verifies correct rendering when user data is fetched.
 * 2. **Logo and title**: Ensures logo, title, and left drawer are visible.
 * 3. **Empty organizations list**: Tests rendering when the user has no joined organizations.
 * 4. **Organization image rendering**: Verifies rendering when organizations have an image.
 * 5. **User profile and links**: Ensures user details and links like 'My Organizations' and 'Settings' are visible.
 * 6. **Responsive rendering**: Tests correct rendering and drawer toggle on smaller screens.
 * 7. **Active button style**: Verifies button style changes when clicked.
 * 8. **Translation display**: Ensures translated text is shown.
 * 9. **Sidebar closure on mobile**: Verifies sidebar closes when a link is clicked on mobile view.
 * 10. **Drawer visibility on small screens**: Tests drawer visibility toggle based on `hideDrawer` prop.
 * 11. **Drawer state change**: Verifies drawer visibility changes when `hideDrawer` prop changes.
 *
 * `fireEvent` simulates user actions, and `vi.fn()` mocks callback functions.
 */

const { setItem } = useLocalStorage();

const resizeWindow = (width: number): void => {
  act(() => {
    window.innerWidth = width;
    fireEvent(window, new Event('resize'));
  });
};

const props = {
  hideDrawer: true,
  setHideDrawer: vi.fn(),
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

describe('UserSidebar Component Tests in User Portal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('UserSidebar component renders correctly with user data present', async () => {
    await act(async () => {
      renderUserSidebar('properId', link);
      await wait();
    });
    expect(screen.getByText('Talawa User Portal')).toBeInTheDocument();
  });

  it('Displays the logo and title text of the User Portal', async () => {
    await act(async () => {
      renderUserSidebar('properId', link);
      await wait();
    });
    expect(screen.getByText('Talawa User Portal')).toBeInTheDocument();
    expect(screen.getByTestId('leftDrawerContainer')).toBeVisible();
  });

  it('UserSidebar renders correctly when joinedOrganizations list is empty', async () => {
    await act(async () => {
      renderUserSidebar('orgEmpty', link);
      await wait();
    });
    expect(screen.getByText('My Organizations')).toBeInTheDocument();
  });

  it('Renders UserSidebar component with organization image when present', async () => {
    await act(async () => {
      renderUserSidebar('imagePresent', link);
      await wait();
    });
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('User profile data renders with all expected navigation links visible', async () => {
    await act(async () => {
      renderUserSidebar('properId', link);
      await wait();
    });

    const expectedLinks = ['My Organizations', 'Settings'];
    expectedLinks.forEach((link) => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('UserSidebar renders correctly on smaller screens and toggles drawer visibility', async () => {
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

  it('Active route button style changes correctly upon click', async () => {
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

  it('Translation hook displays expected text in UserSidebar', async () => {
    await act(async () => {
      renderUserSidebar('properId', link);
      await wait();
    });
    expect(
      screen.getByText(i18nForTest.t('common:settings')),
    ).toBeInTheDocument();
  });

  it('handleLinkClick function closes the sidebar on mobile view when a link is clicked', async () => {
    resizeWindow(800);
    await act(async () => {
      renderUserSidebar('properId', link);
      await wait();
    });
    const settingsBtn = screen.getByTestId('settingsBtn');
    fireEvent.click(settingsBtn);
    expect(props.setHideDrawer).toHaveBeenCalledWith(true);
  });

  describe('UserSidebar Drawer Visibility Tests on Smaller Screens', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('Clicking a link closes the drawer when window width is 820px or less', () => {
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

      const linkElement = screen.getByText('My Organizations'); // Adjust text if different
      fireEvent.click(linkElement);

      expect(props.setHideDrawer).toHaveBeenCalledWith(true);
    });

    describe('UserSidebar Drawer State Tests', () => {
      it('Drawer visibility changes based on hideDrawer prop', () => {
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

        expect(screen.getByTestId('leftDrawerContainer')).toHaveClass(
          styles.hideElemByDefault,
        );

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
