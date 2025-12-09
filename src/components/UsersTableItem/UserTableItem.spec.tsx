import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { toast } from 'react-toastify';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import type { InterfaceQueryUserListItemForAdmin } from 'utils/interfaces';
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
async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
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
const setMockStorageItem = (key: string, value: unknown): void => {
  mockLocalStorageStore[key] =
    typeof value === 'string' ? value : JSON.stringify(value);
};
vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as typeof RouterTypes;
  return {
    ...actual,
    useNavigate: () => mockNavgatePush,
  };
});
beforeEach(() => {
  mockNavgatePush = vi.fn();
  setMockStorageItem('Admin', true);
  setMockStorageItem('id', '123');
});
afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
describe('Testing User Table Item', () => {
  let resetAndRefetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    resetAndRefetchMock = vi.fn();
    vi.spyOn(console, 'error').mockImplementation((message) => {
      if (
        typeof message === 'string' &&
        message.includes('validateDOMNesting')
      ) {
        return;
      }
      // Log other console errors
      console.warn(message);
    });
  });
  test('Should render props and text elements test for the page component', async () => {
    const props: {
      user: InterfaceQueryUserListItemForAdmin;
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
      <MockedProvider link={link}>
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
      user: InterfaceQueryUserListItemForAdmin;
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
      <MockedProvider link={link}>
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
      user: InterfaceQueryUserListItemForAdmin;
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
      <MockedProvider link={link}>
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
      user: InterfaceQueryUserListItemForAdmin;
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
      <MockedProvider link={link2}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    const showJoinedOrgsBtn = screen.getByTestId(`showJoinedOrgsBtn${123}`);
    fireEvent.click(showJoinedOrgsBtn);
    fireEvent.click(screen.getByTestId(`removeUserFromOrgBtn${'abc'}`));
    const confirmRemoveBtn = screen.getByTestId(`confirmRemoveUser123`);
    fireEvent.click(confirmRemoveBtn);
    await wait();
    expect(toast.error).toHaveBeenCalled();
  });
  test('change role button should function properly', async () => {
    const props: {
      user: InterfaceQueryUserListItemForAdmin;
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
      <MockedProvider link={link3}>
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
    expect(changeRoleBtn.value).toBe(`ADMIN?abc`);
    await wait();
  });
  test('Should render Blocked Organizations Modal properly', async () => {
    const props: {
      user: InterfaceQueryUserListItemForAdmin;
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
          edges: [],
        },
        orgsWhereUserIsBlocked: {
          edges: [
            {
              node: {
                id: 'ghi',
                createdAt: '2023-08-29T15:39:36.355Z',
                organization: {
                  name: 'Blocked Organization 1',
                  avatarURL: 'image.png',
                  city: 'Toronto',
                  state: 'ON',
                  createdAt: '2023-08-29T15:39:36.355Z',
                  creator: {
                    name: 'Jane Smith',
                  },
                },
              },
            },
            {
              node: {
                id: 'jkl',
                createdAt: '2023-09-29T15:39:36.355Z',
                organization: {
                  name: 'Blocked Organization 2',
                  avatarURL: 'image.png',
                  city: 'Toronto',
                  state: 'ON',
                  createdAt: '2023-09-29T15:39:36.355Z',
                  creator: {
                    name: 'Jane Smith',
                  },
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
    const showBlockedOrgsBtn = screen.getByTestId(`showBlockedOrgsBtn${123}`);
    expect(showBlockedOrgsBtn).toBeInTheDocument();
    fireEvent.click(showBlockedOrgsBtn);
    expect(screen.getByTestId('modal-blocked-org-123')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByTestId('modal-blocked-org-123'), {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
    expect(
      screen.queryByRole('dialog')?.className.includes('show'),
    ).toBeFalsy();
    fireEvent.click(showBlockedOrgsBtn);
    fireEvent.click(screen.getByTestId(`closeUnblockOrgsBtn${123}`));
    expect(
      screen.queryByRole('dialog')?.className.includes('show'),
    ).toBeFalsy();
    fireEvent.click(showBlockedOrgsBtn);
    const inputBox = screen.getByTestId(`searchByNameBlockedOrgs`);
    expect(inputBox).toBeInTheDocument();
    expect(screen.getByText(/Blocked Organization 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Blocked Organization 2/i)).toBeInTheDocument();
    const elementsWithToronto = screen.getAllByText(/Toronto/i);
    elementsWithToronto.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
    expect(screen.getByText(/29-08-2023/i)).toBeInTheDocument();
    expect(screen.getByText(/29-09-2023/i)).toBeInTheDocument();
    expect(screen.getByTestId('unblockUserFromOrgBtnghi')).toBeInTheDocument();
    expect(screen.getByTestId('unblockUserFromOrgBtnjkl')).toBeInTheDocument();
    const searchBtn = screen.getByTestId(`searchBtnBlockedOrgs`);
    fireEvent.keyUp(inputBox, {
      target: { value: 'Blocked Organization 1' },
    });
    fireEvent.click(searchBtn);
    expect(screen.getByText(/Blocked Organization 1/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Blocked Organization 2/i),
    ).not.toBeInTheDocument();
    fireEvent.keyUp(inputBox, {
      key: 'Enter',
      target: { value: 'Blocked Organization 3' },
    });
    expect(
      screen.getByText(`No results found for "Blocked Organization 3"`),
    ).toBeInTheDocument();
    fireEvent.keyUp(inputBox, { key: 'Enter', target: { value: '' } });
    fireEvent.keyUp(inputBox, { target: { value: '' } });
    fireEvent.click(searchBtn);
    // Click on Creator Link
    fireEvent.click(screen.getByTestId(`creatorghi`));
    expect(toast.success).toHaveBeenCalledWith('Profile Page Coming Soon !');
    // Click on Organization Link
    fireEvent.click(screen.getByText(/Blocked Organization 1/i));
    expect(window.location.replace).toHaveBeenCalledWith('/orgdash/ghi');
    expect(mockNavgatePush).toHaveBeenCalledWith('/orgdash/ghi');
    fireEvent.click(screen.getByTestId(`closeUnblockOrgsBtn${123}`));
  });
  test('handles errors in unblockUser mutation', async () => {
    const props: {
      user: InterfaceQueryUserListItemForAdmin;
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
          edges: [],
        },
        orgsWhereUserIsBlocked: {
          edges: [
            {
              node: {
                id: 'ghi',
                createdAt: '2023-08-29T15:39:36.355Z',
                organization: {
                  name: 'Blocked Organization 1',
                  avatarURL: 'image.png',
                  city: 'Toronto',
                  state: 'ON',
                  createdAt: '2023-08-29T15:39:36.355Z',
                  creator: {
                    name: 'Jane Smith',
                  },
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
    // Assuming MOCKS2 includes error for unblockUser mutation; adjust if needed
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    const showBlockedOrgsBtn = screen.getByTestId(`showBlockedOrgsBtn${123}`);
    fireEvent.click(showBlockedOrgsBtn);
    fireEvent.click(screen.getByTestId(`unblockUserFromOrgBtn${'ghi'}`));
    const confirmUnblockBtn = screen.getByTestId(`confirmUnblockUser${123}`);
    fireEvent.click(confirmUnblockBtn);
    await wait();
    expect(toast.error).toHaveBeenCalled();
  });
  test('handles errors in updateUserRole mutation', async () => {
    const props: {
      user: InterfaceQueryUserListItemForAdmin;
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
          ],
        },
      },
      index: 0,
      loggedInUserId: '123',
      resetAndRefetch: resetAndRefetchMock,
    };
    // Assuming link2 includes error for update role; adjust mocks accordingly
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    const showJoinedOrgs = screen.getByTestId(`showJoinedOrgsBtn${123}`);
    fireEvent.click(showJoinedOrgs);
    const changeRoleBtn = screen.getByTestId(
      `changeRoleInOrg${'abc'}`,
    ) as HTMLSelectElement;
    await userEvent.selectOptions(changeRoleBtn, 'ADMIN');
    await wait();
    expect(toast.error).toHaveBeenCalled();
  });
  test('Should handle no joined organizations', async () => {
    const props: {
      user: InterfaceQueryUserListItemForAdmin;
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
          edges: [],
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
    fireEvent.click(showJoinedOrgsBtn);
    expect(
      screen.getByText(/John Doe has not joined any organization/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('searchByNameJoinedOrgs'),
    ).not.toBeInTheDocument();
  });
  test('Should handle no blocked organizations', async () => {
    const props: {
      user: InterfaceQueryUserListItemForAdmin;
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
          edges: [],
        },
        orgsWhereUserIsBlocked: {
          edges: [],
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
    const showBlockedOrgsBtn = screen.getByTestId(`showBlockedOrgsBtn${123}`);
    fireEvent.click(showBlockedOrgsBtn);
    expect(
      screen.getByText(/John Doe is not blocked by any organization/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('searchByNameBlockedOrgs'),
    ).not.toBeInTheDocument();
  });
  test('Should handle admin role in blocked organizations modal', async () => {
    const props: {
      user: InterfaceQueryUserListItemForAdmin;
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
        role: 'administrator',
        state: null,
        mobilePhoneNumber: null,
        homePhoneNumber: null,
        workPhoneNumber: null,
        createdOrganizations: [],
        organizationsWhereMember: {
          edges: [],
        },
        orgsWhereUserIsBlocked: {
          edges: [
            {
              node: {
                id: 'ghi',
                createdAt: '2023-08-29T15:39:36.355Z',
                organization: {
                  name: 'Blocked Organization 1',
                  avatarURL: 'image.png',
                  city: 'Toronto',
                  state: 'ON',
                  createdAt: '2023-08-29T15:39:36.355Z',
                  creator: {
                    name: 'Jane Smith',
                  },
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
    const showBlockedOrgsBtn = screen.getByTestId(`showBlockedOrgsBtn${123}`);
    fireEvent.click(showBlockedOrgsBtn);
    expect(screen.getByText(/ADMIN/i)).toBeInTheDocument();
  });
  test('Should handle successful remove user with assertions', async () => {
    const props = {
      user: {
        id: '123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        role: null,
        organizationsWhereMember: {
          edges: [
            {
              node: {
                id: 'abc',
                name: 'Joined Organization 1',
                city: 'Kingston',
                createdAt: '2023-06-29T15:39:36.355Z',
                creator: {
                  id: '123',
                  name: 'John Doe',
                  avatarURL: 'image.png',
                },
              },
            },
          ],
        },
      } as InterfaceQueryUserListItemForAdmin,
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
    fireEvent.click(screen.getByTestId(`showJoinedOrgsBtn${123}`));
    fireEvent.click(screen.getByTestId(`removeUserFromOrgBtn${'abc'}`));
    const confirmBtn = screen.getByTestId(`confirmRemoveUser${123}`);
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
      expect(resetAndRefetchMock).toHaveBeenCalled();
      expect(
        screen.queryByTestId('modal-remove-user-123'),
      ).not.toBeInTheDocument();
    });
  });
  test('Should handle admin user role in joined organizations modal (disabled select)', async () => {
    const props = {
      user: {
        id: '123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        role: 'administrator',
        organizationsWhereMember: {
          edges: [
            {
              node: {
                id: 'abc',
                name: 'Admin Org',
                city: 'Kingston',
                createdAt: '2023-06-29T15:39:36.355Z',
                creator: { id: '123', name: 'John Doe' },
              },
            },
          ],
        },
      } as InterfaceQueryUserListItemForAdmin,
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
    fireEvent.click(screen.getByTestId(`showJoinedOrgsBtn${123}`));
    expect(screen.getByText('ADMIN', { selector: 'td' })).toBeInTheDocument();
    const select = screen.getByTestId(
      `changeRoleInOrg${'abc'}`,
    ) as HTMLSelectElement;
    expect(select.disabled).toBe(true);
    expect(select.value).toBe('ADMIN?abc');
    // Attempt to change (should not trigger mutation due to disabled)
    fireEvent.change(select, { target: { value: 'ADMIN?abc' } });
    await wait();
    expect(select.value).toBe('ADMIN?abc');
    expect(toast.success).not.toHaveBeenCalled();
    expect(resetAndRefetchMock).not.toHaveBeenCalled();
  });
  test('Should handle cancel remove user and reopen joined organizations modal', async () => {
    const props = {
      user: {
        id: '123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        avatarURL: 'profile.png',
        birthDate: null,
        city: 'New York',
        countryCode: 'US',
        createdAt: '2023-08-20T10:00:00.000Z',
        updatedAt: '2023-08-29T15:39:36.355Z',
        educationGrade: null,
        employmentStatus: null,
        isEmailAddressVerified: true,
        maritalStatus: null,
        natalSex: null,
        naturalLanguageCode: 'en',
        postalCode: '10001',
        role: null,
        state: 'NY',
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
                avatarURL: 'joined-org.png',
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
          ],
        },
        orgsWhereUserIsBlocked: {
          edges: [],
        },
      } as InterfaceQueryUserListItemForAdmin,
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
    fireEvent.click(screen.getByTestId(`showJoinedOrgsBtn${123}`));
    expect(screen.getByTestId(`modal-joined-org-${123}`)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId(`removeUserFromOrgBtn${'abc'}`));
    expect(screen.getByTestId(`modal-remove-user-${123}`)).toBeInTheDocument();
    // Cancel remove
    fireEvent.click(screen.getByTestId(`closeRemoveUserModal${123}`));
    // Should reopen joined modal
    await waitFor(() => {
      expect(screen.getByTestId(`modal-joined-org-${123}`)).toBeInTheDocument();
      expect(
        screen.queryByTestId(`modal-remove-user-${123}`),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText(/Joined Organization 1/i)).toBeInTheDocument();
  });

  test('should successfully unblock user and refetch data', async () => {
    const props = {
      user: {
        id: '123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        organizationsWhereMember: { edges: [] },
        orgsWhereUserIsBlocked: {
          edges: [
            {
              node: {
                id: 'ghi',
                createdAt: '2023-08-29T15:39:36.355Z',
                organization: {
                  name: 'Blocked Organization 1',
                  avatarURL: 'image.png',
                  city: 'Toronto',
                  state: 'ON',
                  createdAt: '2023-08-29T15:39:36.355Z',
                  creator: { name: 'Jane Smith' },
                },
              },
            },
          ],
        },
      } as unknown as InterfaceQueryUserListItemForAdmin,
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

    fireEvent.click(screen.getByTestId(`showBlockedOrgsBtn${123}`));
    fireEvent.click(screen.getByTestId(`unblockUserFromOrgBtnghi`));
    fireEvent.click(screen.getByTestId(`confirmUnblockUser${123}`));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
      expect(resetAndRefetchMock).toHaveBeenCalled();
    });
  });

  test('should reset blocked orgs when search value is empty', async () => {
    const props: {
      user: InterfaceQueryUserListItemForAdmin;
      index: number;
      loggedInUserId: string;
      resetAndRefetch: () => void;
    } = {
      user: {
        id: '123',
        name: 'John',
        emailAddress: 'john@test.com',

        avatarURL: null,
        birthDate: null,
        city: null,
        state: null,
        countryCode: null,
        postalCode: null,
        mobilePhoneNumber: null,
        homePhoneNumber: null,
        workPhoneNumber: null,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        educationGrade: null,
        employmentStatus: null,
        maritalStatus: null,
        natalSex: null,
        naturalLanguageCode: null,
        isEmailAddressVerified: true,

        createdOrganizations: [],

        role: null,

        organizationsWhereMember: {
          edges: [],
        },

        orgsWhereUserIsBlocked: {
          edges: [
            {
              node: {
                id: '1',
                createdAt: new Date().toISOString(),
                organization: {
                  name: 'Blocked Org',
                  city: '',
                  state: '',
                  createdAt: new Date().toISOString(),
                  creator: {
                    name: 'A',
                  },
                },
              },
            },
          ],
        },
      },

      index: 0,
      loggedInUserId: '123',
      resetAndRefetch: vi.fn(),
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
    fireEvent.click(screen.getByTestId(`showBlockedOrgsBtn123`));

    const input = screen.getByTestId('searchByNameBlockedOrgs');
    fireEvent.keyUp(input, { target: { value: '' } });
    fireEvent.click(screen.getByTestId('searchBtnBlockedOrgs'));

    expect(screen.getByText(/Blocked Org/i)).toBeInTheDocument();
  });

  test('should reopen blocked org modal when cancel unblock (Blocked path)', async () => {
    const props: {
      user: InterfaceQueryUserListItemForAdmin;
      index: number;
      loggedInUserId: string;
      resetAndRefetch: () => void;
    } = {
      user: {
        id: '123',
        name: 'John',
        emailAddress: 'john@test.com',

        avatarURL: null,
        birthDate: null,
        city: null,
        state: null,
        countryCode: null,
        postalCode: null,
        mobilePhoneNumber: null,
        homePhoneNumber: null,
        workPhoneNumber: null,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        educationGrade: null,
        employmentStatus: null,
        maritalStatus: null,
        natalSex: null,
        naturalLanguageCode: null,
        isEmailAddressVerified: true,

        createdOrganizations: [],

        role: null,

        organizationsWhereMember: {
          edges: [],
        },

        orgsWhereUserIsBlocked: {
          edges: [
            {
              node: {
                id: 'ghi',
                createdAt: new Date().toISOString(),
                organization: {
                  name: 'Blocked Org',
                  city: '',
                  state: '',
                  createdAt: new Date().toISOString(),
                  creator: {
                    name: 'A',
                  },
                },
              },
            },
          ],
        },
      },

      index: 0,
      loggedInUserId: '123',
      resetAndRefetch: vi.fn(),
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
    fireEvent.click(screen.getByTestId(`showBlockedOrgsBtn123`));
    fireEvent.click(screen.getByTestId(`unblockUserFromOrgBtnghi`));

    fireEvent.click(screen.getByTestId(`closeUnblockUserModal123`));

    // ✅ Confirms: setShowBlockedOrganizations(true)
    expect(screen.getByTestId(`modal-blocked-org-123`)).toBeInTheDocument();
  });

  test('Should handle cancel unblock user and reopen blocked organizations modal', async () => {
    const props = {
      user: {
        id: '123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        avatarURL: 'profile.png',
        birthDate: null,
        city: 'New York',
        countryCode: 'US',
        createdAt: '2023-08-20T10:00:00.000Z',
        updatedAt: '2023-08-29T15:39:36.355Z',
        educationGrade: null,
        employmentStatus: null,
        isEmailAddressVerified: true,
        maritalStatus: null,
        natalSex: null,
        naturalLanguageCode: 'en',
        postalCode: '10001',
        role: null,
        state: 'NY',
        mobilePhoneNumber: null,
        homePhoneNumber: null,
        workPhoneNumber: null,
        createdOrganizations: [],
        organizationsWhereMember: {
          edges: [],
        },
        orgsWhereUserIsBlocked: {
          edges: [
            {
              node: {
                id: 'ghi',
                createdAt: '2023-08-29T15:39:36.355Z',
                organization: {
                  name: 'Blocked Organization 1',
                  avatarURL: 'blocked-org.png',
                  city: 'Toronto',
                  state: 'Ontario',
                  createdAt: '2023-08-29T15:39:36.355Z',
                  creator: {
                    name: 'Jane Smith',
                  },
                },
              },
            },
          ],
        },
      } as InterfaceQueryUserListItemForAdmin,
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
    fireEvent.click(screen.getByTestId(`showBlockedOrgsBtn${123}`));
    expect(screen.getByTestId(`modal-blocked-org-${123}`)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId(`unblockUserFromOrgBtn${'ghi'}`));
    expect(screen.getByTestId(`modal-unblock-user-${123}`)).toBeInTheDocument();
    // Cancel unblock
    fireEvent.click(screen.getByTestId(`closeUnblockUserModal${123}`));
    // Should reopen blocked modal
    await waitFor(() => {
      expect(
        screen.getByTestId(`modal-blocked-org-${123}`),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId(`modal-unblock-user-${123}`),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText(/Blocked Organization 1/i)).toBeInTheDocument();
  });
});
