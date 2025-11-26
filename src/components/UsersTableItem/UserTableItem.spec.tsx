import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { toast } from 'react-toastify';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import { MOCKS, MOCKS2, MOCKS_UPDATE } from './UserTableItemMocks';
import UsersTableItem from './UsersTableItem';
import { BrowserRouter } from 'react-router';
const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS2, true);
const link3 = new StaticMockLink(MOCKS_UPDATE, true);

import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type * as RouterTypes from 'react-router';

const { mockLocalStorageStore } = vi.hoisted(() => ({
  mockLocalStorageStore: {} as Record<string, unknown>,
}));

// Mock useLocalStorage
vi.mock('utils/useLocalstorage', () => {
  return {
    default: () => ({
      getItem: (key: string) => mockLocalStorageStore[key] || null,
      setItem: (key: string, value: unknown) => {
        mockLocalStorageStore[key] =
          typeof value === 'string' ? value : JSON.stringify(value);
      },
      removeItem: (key: string) => {
        delete mockLocalStorageStore[key];
      },
      clear: () => {
        for (const key in mockLocalStorageStore)
          delete mockLocalStorageStore[key];
      },
    }),
    setItem: (prefix: string, key: string, value: unknown) => {
      const prefixedKey = `${prefix}_${key}`;
      mockLocalStorageStore[prefixedKey] =
        typeof value === 'string' ? value : JSON.stringify(value);
    },
    removeItem: (prefix: string, key: string) => {
      const prefixedKey = `${prefix}_${key}`;
      delete mockLocalStorageStore[prefixedKey];
    },
  };
});

const originalLocalStorage = window.localStorage;

// Mock global localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key: string) => mockLocalStorageStore[key] || null,
    setItem: (key: string, value: string) => {
      mockLocalStorageStore[key] = value;
    },
    removeItem: (key: string) => {
      delete mockLocalStorageStore[key];
    },
    clear: () => {
      for (const key in mockLocalStorageStore)
        delete mockLocalStorageStore[key];
    },
  },
  writable: true,
});

afterAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: originalLocalStorage,
    writable: true,
  });
});

// Direct wrapper functions for test usage
const setMockStorageItem = (key: string, value: unknown): void => {
  mockLocalStorageStore[key] =
    typeof value === 'string' ? value : JSON.stringify(value);
};

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
const resetAndRefetchMock = vi.fn();

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

Object.defineProperty(window, 'location', {
  value: {
    replace: vi.fn(),
  },
  writable: true,
});

let mockNavgatePush: ReturnType<typeof vi.fn>;

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as typeof RouterTypes;
  return {
    ...actual,
    useNavigate: () => mockNavgatePush,
  };
});

beforeEach(() => {
  mockNavgatePush = vi.fn();
  setMockStorageItem('SuperAdmin', true);
  setMockStorageItem('id', '123');
});

afterEach(async () => {
  vi.restoreAllMocks();
  const { clear } = (
    await import('utils/useLocalstorage')
  ).default() as unknown as {
    clear: () => void;
  };
  clear();
});

describe('Testing User Table Item', () => {
  console.error = vi.fn((message) => {
    if (message.includes('validateDOMNesting')) {
      return;
    }
    // Log other console errors
    console.warn(message);
  });
  test('Should render props and text elements test for the page component', async () => {
    const props: {
      user: InterfaceQueryUserListItem;
      index: number;
      loggedInUserId: string;
      resetAndRefetch: () => void;
    } = {
      user: {
        id: '123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        avatarURL: 'image.png',
        birthDate: null,
        city: null,
        countryCode: null,
        createdAt: '2023-09-29T15:39:36.355Z',
        updatedAt: '2023-09-29T15:39:36.355Z',
        educationGrade: null,
        employmentStatus: null,
        isEmailAddressVerified: true,
        maritalStatus: null,
        natalSex: null,
        naturalLanguageCode: null,
        postalCode: null,
        role: null,
        state: null,
        mobilePhoneNumber: null,
        homePhoneNumber: null,
        workPhoneNumber: null,

        createdOrganizations: [],

        organizationsWhereMember: {
          edges: [
            {
              node: {
                id: 'abc',
                name: 'Joined Organization 1',
                avatarURL: 'image.png',
                city: 'Kingston',
                createdAt: '2023-06-29T15:39:36.355Z',
                creator: {
                  id: '123',
                  name: 'John Doe',
                  emailAddress: 'john@example.com',
                  avatarURL: 'image.png',
                },
              },
            },
            {
              node: {
                id: 'def',
                name: 'Joined Organization 2',
                avatarURL: 'image.png',
                city: 'Kingston',
                createdAt: '2023-07-29T15:39:36.355Z',
                creator: {
                  id: '123',
                  name: 'John Doe',
                  emailAddress: 'john@example.com',
                  avatarURL: 'image.png',
                },
              },
            },
          ],
        },
      },
      index: 0,
      loggedInUserId: '123',
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(screen.getByText(/1/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByTestId(`showJoinedOrgsBtn${123}`)).toBeInTheDocument();
  });

  test('Should render props and text elements test for the Joined Organizations Modal properly', async () => {
    const props: {
      user: InterfaceQueryUserListItem;
      index: number;
      loggedInUserId: string;
      resetAndRefetch: () => void;
    } = {
      user: {
        id: '123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        avatarURL: 'image.png',
        birthDate: null,
        city: null,
        countryCode: null,
        createdAt: '2023-09-29T15:39:36.355Z',
        updatedAt: '2023-09-29T15:39:36.355Z',
        educationGrade: null,
        employmentStatus: null,
        isEmailAddressVerified: true,
        maritalStatus: null,
        natalSex: null,
        naturalLanguageCode: null,
        postalCode: null,
        role: null,
        state: null,
        mobilePhoneNumber: null,
        homePhoneNumber: null,
        workPhoneNumber: null,

        createdOrganizations: [],

        organizationsWhereMember: {
          edges: [
            {
              node: {
                id: 'abc',
                name: 'Joined Organization 1',
                avatarURL: 'image.png',
                city: 'Kingston',
                createdAt: '2023-06-29T15:39:36.355Z',
                creator: {
                  id: '123',
                  name: 'John Doe',
                  emailAddress: 'john@example.com',
                  avatarURL: 'image.png',
                },
              },
            },
            {
              node: {
                id: 'def',
                name: 'Joined Organization 2',
                avatarURL: 'image.png',
                city: 'Kingston',
                createdAt: '2023-07-29T15:39:36.355Z',
                creator: {
                  id: '123',
                  name: 'John Doe',
                  emailAddress: 'john@example.com',
                  avatarURL: 'image.png',
                },
              },
            },
          ],
        },
      },
      index: 0,
      loggedInUserId: '123',
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UsersTableItem {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    const showJoinedOrgsBtn = screen.getByTestId(`showJoinedOrgsBtn${123}`);
    expect(showJoinedOrgsBtn).toBeInTheDocument();
    fireEvent.click(showJoinedOrgsBtn);
    expect(screen.getByTestId('modal-joined-org-123')).toBeInTheDocument();

    // Close using escape key and reopen
    fireEvent.keyDown(screen.getByTestId('modal-joined-org-123'), {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
    expect(
      screen.queryByRole('dialog')?.className.includes('show'),
    ).toBeFalsy();
    fireEvent.click(showJoinedOrgsBtn);
    // Close using close button and reopen
    fireEvent.click(screen.getByTestId(`closeJoinedOrgsBtn${123}`));
    expect(
      screen.queryByRole('dialog')?.className.includes('show'),
    ).toBeFalsy();

    fireEvent.click(showJoinedOrgsBtn);

    // Expect the following to exist in modal
    const inputBox = screen.getByTestId(`searchByNameJoinedOrgs`);
    expect(inputBox).toBeInTheDocument();
    expect(screen.getByText(/Joined Organization 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Joined Organization 2/i)).toBeInTheDocument();
    const elementsWithKingston = screen.getAllByText(/Kingston/i);
    elementsWithKingston.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
    expect(screen.getByText(/29-06-2023/i)).toBeInTheDocument();
    expect(screen.getByText(/29-07-2023/i)).toBeInTheDocument();
    expect(screen.getByTestId('removeUserFromOrgBtnabc')).toBeInTheDocument();
    expect(screen.getByTestId('removeUserFromOrgBtndef')).toBeInTheDocument();

    // Search for Joined Organization 1
    const searchBtn = screen.getByTestId(`searchBtnJoinedOrgs`);
    fireEvent.change(inputBox, {
      target: { value: 'Joined Organization 1' },
    });
    fireEvent.click(searchBtn);
    expect(screen.getByText(/Joined Organization 1/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Joined Organization 2/i),
    ).not.toBeInTheDocument();

    // Search for an Organization which does not exist
    fireEvent.change(inputBox, {
      target: { value: 'Joined Organization 3' },
    });
    expect(
      screen.getByText(`No results found for "Joined Organization 3"`),
    ).toBeInTheDocument();

    // Now clear the search box
    fireEvent.change(inputBox, { target: { value: '' } });
    fireEvent.click(searchBtn);
    // Click on Creator Link
    fireEvent.click(screen.getByTestId(`creatorabc`));
    expect(toast.success).toHaveBeenCalledWith('Profile Page Coming Soon !');

    // Click on Organization Link
    fireEvent.click(screen.getByText(/Joined Organization 1/i));
    expect(window.location.replace).toHaveBeenCalledWith('/orgdash/abc');
    expect(mockNavgatePush).toHaveBeenCalledWith('/orgdash/abc');
    fireEvent.click(screen.getByTestId(`closeJoinedOrgsBtn${123}`));
  });

  test('Remove user from Organization should function properly in Organizations Joined Modal', async () => {
    const props: {
      user: InterfaceQueryUserListItem;
      index: number;
      loggedInUserId: string;
      resetAndRefetch: () => void;
    } = {
      user: {
        id: '123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        avatarURL: 'image.png',
        birthDate: null,
        city: null,
        countryCode: null,
        createdAt: '2023-09-29T15:39:36.355Z',
        updatedAt: '2023-09-29T15:39:36.355Z',
        educationGrade: null,
        employmentStatus: null,
        isEmailAddressVerified: true,
        maritalStatus: null,
        natalSex: null,
        naturalLanguageCode: null,
        postalCode: null,
        role: null,
        state: null,
        mobilePhoneNumber: null,
        homePhoneNumber: null,
        workPhoneNumber: null,

        createdOrganizations: [],

        organizationsWhereMember: {
          edges: [
            {
              node: {
                id: 'abc',
                name: 'Joined Organization 1',
                avatarURL: 'image.png',
                city: 'Kingston',
                createdAt: '2023-06-29T15:39:36.355Z',
                creator: {
                  id: '123',
                  name: 'John Doe',
                  emailAddress: 'john@example.com',
                  avatarURL: 'image.png',
                },
              },
            },
            {
              node: {
                id: 'def',
                name: 'Joined Organization 2',
                avatarURL: 'image.png',
                city: 'Kingston',
                createdAt: '2023-07-29T15:39:36.355Z',
                creator: {
                  id: '123',
                  name: 'John Doe',
                  emailAddress: 'john@example.com',
                  avatarURL: 'image.png',
                },
              },
            },
          ],
        },
      },
      index: 0,
      loggedInUserId: '123',
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const showJoinedOrgsBtn = screen.getByTestId(`showJoinedOrgsBtn${123}`);
    expect(showJoinedOrgsBtn).toBeInTheDocument();
    fireEvent.click(showJoinedOrgsBtn);
    expect(screen.getByTestId('modal-joined-org-123')).toBeInTheDocument();
    fireEvent.click(showJoinedOrgsBtn);
    fireEvent.click(screen.getByTestId(`removeUserFromOrgBtn${'abc'}`));
    expect(screen.getByTestId('modal-remove-user-123')).toBeInTheDocument();

    // Close using escape key and reopen
    fireEvent.keyDown(screen.getByTestId('modal-joined-org-123'), {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
    expect(
      screen
        .queryAllByRole('dialog')
        .some((el) => el.className.includes('show')),
    ).toBeTruthy();
    fireEvent.click(showJoinedOrgsBtn);
    // Close using close button and reopen
    fireEvent.click(screen.getByTestId('closeRemoveUserModal123'));
    expect(
      screen
        .queryAllByRole('dialog')
        .some((el) => el.className.includes('show')),
    ).toBeTruthy();

    fireEvent.click(showJoinedOrgsBtn);
    fireEvent.click(screen.getByTestId(`removeUserFromOrgBtn${'abc'}`));
    const confirmRemoveBtn = screen.getByTestId(`confirmRemoveUser123`);
    expect(confirmRemoveBtn).toBeInTheDocument();

    fireEvent.click(confirmRemoveBtn);
  });

  test('handles errors in removeUser mutation', async () => {
    const props: {
      user: InterfaceQueryUserListItem;
      index: number;
      loggedInUserId: string;
      resetAndRefetch: () => void;
    } = {
      user: {
        id: '123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        avatarURL: 'image.png',
        birthDate: null,
        city: null,
        countryCode: null,
        createdAt: '2023-09-29T15:39:36.355Z',
        updatedAt: '2023-09-29T15:39:36.355Z',
        educationGrade: null,
        employmentStatus: null,
        isEmailAddressVerified: true,
        maritalStatus: null,
        natalSex: null,
        naturalLanguageCode: null,
        postalCode: null,
        role: null,
        state: null,
        mobilePhoneNumber: null,
        homePhoneNumber: null,
        workPhoneNumber: null,

        createdOrganizations: [],

        organizationsWhereMember: {
          edges: [
            {
              node: {
                id: 'abc',
                name: 'Joined Organization 1',
                avatarURL: 'image.png',
                city: 'Kingston',
                createdAt: '2023-06-29T15:39:36.355Z',
                creator: {
                  id: '123',
                  name: 'John Doe',
                  emailAddress: 'john@example.com',
                  avatarURL: 'image.png',
                },
              },
            },
            {
              node: {
                id: 'def',
                name: 'Joined Organization 2',
                avatarURL: 'image.png',
                city: 'Kingston',
                createdAt: '2023-07-29T15:39:36.355Z',
                creator: {
                  id: '123',
                  name: 'John Doe',
                  emailAddress: 'john@example.com',
                  avatarURL: 'image.png',
                },
              },
            },
          ],
        },
      },
      index: 0,
      loggedInUserId: '123',
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
  });

  test('change role button should function properly', async () => {
    const props: {
      user: InterfaceQueryUserListItem;
      index: number;
      loggedInUserId: string;
      resetAndRefetch: () => void;
    } = {
      user: {
        id: '123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        avatarURL: 'image.png',
        birthDate: null,
        city: null,
        countryCode: null,
        createdAt: '2023-09-29T15:39:36.355Z',
        updatedAt: '2023-09-29T15:39:36.355Z',
        educationGrade: null,
        employmentStatus: null,
        isEmailAddressVerified: true,
        maritalStatus: null,
        natalSex: null,
        naturalLanguageCode: null,
        postalCode: null,
        role: null,
        state: null,
        mobilePhoneNumber: null,
        homePhoneNumber: null,
        workPhoneNumber: null,

        createdOrganizations: [],

        organizationsWhereMember: {
          edges: [
            {
              node: {
                id: 'abc',
                name: 'Joined Organization 1',
                avatarURL: 'image.png',
                city: 'Kingston',
                createdAt: '2023-06-29T15:39:36.355Z',
                creator: {
                  id: '123',
                  name: 'John Doe',
                  emailAddress: 'john@example.com',
                  avatarURL: 'image.png',
                },
              },
            },
            {
              node: {
                id: 'def',
                name: 'Joined Organization 2',
                avatarURL: 'image.png',
                city: 'Kingston',
                createdAt: '2023-07-29T15:39:36.355Z',
                creator: {
                  id: '123',
                  name: 'John Doe',
                  emailAddress: 'john@example.com',
                  avatarURL: 'image.png',
                },
              },
            },
          ],
        },
      },
      index: 0,
      loggedInUserId: '123',
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider addTypename={false} link={link3}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const showJoinedOrgs = screen.getByTestId(`showJoinedOrgsBtn${123}`);
    expect(showJoinedOrgs).toBeInTheDocument();
    fireEvent.click(showJoinedOrgs);
    const changeRoleBtn = screen.getByTestId(
      `changeRoleInOrg${'abc'}`,
    ) as HTMLSelectElement;
    expect(changeRoleBtn).toBeInTheDocument();
    await userEvent.selectOptions(changeRoleBtn, 'ADMIN');
    await wait();
    await userEvent.selectOptions(changeRoleBtn, 'USER');
    await wait();
    expect(changeRoleBtn.value).toBe(`USER?abc`);
    await wait();
  });
});
