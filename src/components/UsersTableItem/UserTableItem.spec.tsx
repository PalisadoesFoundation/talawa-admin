import React, { act } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
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
import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest';
import type * as RouterTypes from 'react-router';

dayjs.extend(utc);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
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

let mockNavigatePush: ReturnType<typeof vi.fn>;

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as typeof RouterTypes;
  return {
    ...actual,
    useNavigate: () => mockNavigatePush,
  };
});

beforeEach(() => {
  mockNavigatePush = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Testing User Table Item', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let resetAndRefetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    user = userEvent.setup();
    resetAndRefetchMock = vi.fn();
    vi.spyOn(console, 'error').mockImplementation((message: unknown) => {
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
                createdAt: dayjs.utc().subtract(3, 'month').toISOString(),
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
                createdAt: dayjs.utc().subtract(2, 'month').toISOString(),
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
    const joinedOrgCreatedAt1 = dayjs.utc().subtract(3, 'month').toISOString();
    const joinedOrgCreatedAt2 = dayjs.utc().subtract(2, 'month').toISOString();
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
                createdAt: joinedOrgCreatedAt1,
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
                createdAt: joinedOrgCreatedAt2,
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
    await user.click(showJoinedOrgsBtn);
    expect(screen.getByTestId('modal-joined-org-123')).toBeInTheDocument();
    // Close using escape key and reopen
    await user.keyboard('{Escape}');
    expect(
      screen.queryByTestId('modal-joined-org-123')?.className.includes('show'),
    ).toBeFalsy();
    await user.click(showJoinedOrgsBtn);
    // Close using close button and reopen
    await user.click(screen.getByTestId(`closeJoinedOrgsBtn${123}`));
    expect(
      screen.queryByTestId('modal-joined-org-123')?.className.includes('show'),
    ).toBeFalsy();
    await user.click(showJoinedOrgsBtn);
    // Expect the following to exist in modal
    const inputBox = screen.getByTestId(`searchByNameJoinedOrgs`);
    expect(inputBox).toBeInTheDocument();
    expect(screen.getByText(/Joined Organization 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Joined Organization 2/i)).toBeInTheDocument();
    const elementsWithKingston = screen.getAllByText(/Kingston/i);
    elementsWithKingston.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
    expect(
      screen.getByText(
        new RegExp(dayjs(joinedOrgCreatedAt1).format('DD-MM-YYYY')),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(dayjs(joinedOrgCreatedAt2).format('DD-MM-YYYY')),
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('removeUserFromOrgBtnabc')).toBeInTheDocument();
    expect(screen.getByTestId('removeUserFromOrgBtndef')).toBeInTheDocument();

    // Search for Joined Organization 1
    const searchBtn = screen.getByTestId(`searchBtnJoinedOrgs`);
    await user.clear(inputBox);
    await user.type(inputBox, 'Joined Organization 1');
    await user.click(searchBtn);
    expect(screen.getByText(/Joined Organization 1/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Joined Organization 2/i),
    ).not.toBeInTheDocument();
    // Search for an Organization which does not exist
    await user.clear(inputBox);
    await user.type(inputBox, 'Joined Organization 3');
    expect(
      screen.getByText(/no results found for.*Joined Organization 3/i),
    ).toBeInTheDocument();

    // Now clear the search box
    await user.clear(inputBox);
    await user.click(searchBtn);
    // Click on Creator Link
    await user.click(screen.getByTestId(`creatorabc`));
    expect(NotificationToast.success).toHaveBeenCalledWith(
      'Profile Page Coming Soon!',
    );
    // Click on Organization Link
    await user.click(screen.getByText(/Joined Organization 1/i));
    expect(mockNavigatePush).toHaveBeenCalledWith('/admin/orgdash/abc');
    await user.click(screen.getByTestId(`closeJoinedOrgsBtn${123}`));
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
                createdAt: dayjs.utc().subtract(3, 'month').toISOString(),
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
                createdAt: dayjs.utc().subtract(2, 'month').toISOString(),
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
    await user.click(showJoinedOrgsBtn);
    expect(screen.getByTestId('modal-joined-org-123')).toBeInTheDocument();
    await user.click(showJoinedOrgsBtn);
    await user.click(screen.getByTestId(`removeUserFromOrgBtn${'abc'}`));
    await waitFor(() => {
      expect(screen.getByTestId('modal-remove-user-123')).toBeInTheDocument();
    });
    const confirmRemoveBtn = screen.getByTestId(`confirmRemoveUser123`);
    expect(confirmRemoveBtn).toBeInTheDocument();
    await user.click(confirmRemoveBtn);
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
                createdAt: dayjs.utc().subtract(3, 'month').toISOString(),
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
                createdAt: dayjs.utc().subtract(2, 'month').toISOString(),
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
    await user.click(showJoinedOrgsBtn);
    await user.click(screen.getByTestId(`removeUserFromOrgBtn${'abc'}`));
    const confirmRemoveBtn = screen.getByTestId(`confirmRemoveUser123`);
    await user.click(confirmRemoveBtn);
    await wait();
    expect(NotificationToast.error).toHaveBeenCalled();
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
                createdAt: dayjs.utc().subtract(3, 'month').toISOString(),
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
                createdAt: dayjs.utc().subtract(2, 'month').toISOString(),
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
    await user.click(showJoinedOrgs);
    const changeRoleBtn = screen.getByTestId(
      `changeRoleInOrg${'abc'}`,
    ) as HTMLSelectElement;
    expect(changeRoleBtn).toBeInTheDocument();
    await userEvent.selectOptions(changeRoleBtn, 'ADMIN');
    await wait();
    expect(changeRoleBtn.value).toBe(`ADMIN?abc`);
    await wait();
  });

  test('change role button should trigger success toast when mutation succeeds', async () => {
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
                createdAt: dayjs.utc().subtract(3, 'month').toISOString(),
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
    const showJoinedOrgs = screen.getByTestId(`showJoinedOrgsBtn${123}`);
    await user.click(showJoinedOrgs);
    const changeRoleBtn = screen.getByTestId(
      `changeRoleInOrg${'abc'}`,
    ) as HTMLSelectElement;
    // Select USER role which has a success mock in MOCKS
    await userEvent.selectOptions(changeRoleBtn, 'USER');
    await wait();
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
      expect(resetAndRefetchMock).toHaveBeenCalled();
    });
  });

  test('Should render Blocked Organizations Modal properly', async () => {
    const blockedOrgCreatedAt = dayjs.utc().subtract(1, 'month').toISOString();
    const blockedOrgCreatedAt2 = dayjs.utc().toISOString();
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
                createdAt: blockedOrgCreatedAt,
                organization: {
                  name: 'Blocked Organization 1',
                  avatarURL: 'image.png',
                  city: 'Toronto',
                  state: 'ON',
                  createdAt: blockedOrgCreatedAt,
                  creator: {
                    name: 'Jane Smith',
                  },
                },
              },
            },
            {
              node: {
                id: 'jkl',
                createdAt: blockedOrgCreatedAt2,
                organization: {
                  name: 'Blocked Organization 2',
                  avatarURL: 'image.png',
                  city: 'Toronto',
                  state: 'ON',
                  createdAt: blockedOrgCreatedAt2,
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
      <MockedProvider link={link}>
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
    await user.click(showBlockedOrgsBtn);
    expect(screen.getByTestId('modal-blocked-org-123')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(
      screen.queryByTestId('modal-blocked-org-123')?.className.includes('show'),
    ).toBeFalsy();
    await user.click(showBlockedOrgsBtn);
    await user.click(screen.getByTestId(`closeUnblockOrgsBtn${123}`));
    expect(
      screen.queryByTestId('modal-blocked-org-123')?.className.includes('show'),
    ).toBeFalsy();
    await user.click(showBlockedOrgsBtn);
    const inputBox = screen.getByTestId(`searchByNameBlockedOrgs`);
    expect(inputBox).toBeInTheDocument();
    expect(screen.getByText(/Blocked Organization 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Blocked Organization 2/i)).toBeInTheDocument();
    const elementsWithToronto = screen.getAllByText(/Toronto/i);
    elementsWithToronto.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
    expect(
      screen.getByText(
        new RegExp(dayjs(blockedOrgCreatedAt).format('DD-MM-YYYY')),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(dayjs(blockedOrgCreatedAt2).format('DD-MM-YYYY')),
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('unblockUserFromOrgBtnghi')).toBeInTheDocument();
    expect(screen.getByTestId('unblockUserFromOrgBtnjkl')).toBeInTheDocument();
    const searchBtn = screen.getByTestId(`searchBtnBlockedOrgs`);
    await user.clear(inputBox);
    await user.type(inputBox, 'Blocked Organization 1');
    await user.click(searchBtn);
    expect(screen.getByText(/Blocked Organization 1/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Blocked Organization 2/i),
    ).not.toBeInTheDocument();
    await user.clear(inputBox);
    await user.type(inputBox, 'Blocked Organization 3');
    await user.type(inputBox, '{Enter}');
    expect(
      screen.getByText(/no results found for.*Blocked Organization 3/i),
    ).toBeInTheDocument();

    await user.clear(inputBox);
    await user.type(inputBox, '{Enter}');
    await user.clear(inputBox);
    await user.click(searchBtn);
    // Click on Creator Link
    await user.click(screen.getByTestId(`creatorghi`));
    expect(NotificationToast.success).toHaveBeenCalledWith(
      'Profile Page Coming Soon!',
    );
    // Click on Organization Link
    await user.click(screen.getByText(/Blocked Organization 1/i));
    expect(mockNavigatePush).toHaveBeenCalledWith('/admin/orgdash/ghi');
    await user.click(screen.getByTestId(`closeUnblockOrgsBtn${123}`));
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
                createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
                organization: {
                  name: 'Blocked Organization 1',
                  avatarURL: 'image.png',
                  city: 'Toronto',
                  state: 'ON',
                  createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
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
      <MockedProvider link={link2}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    const showBlockedOrgsBtn = screen.getByTestId(`showBlockedOrgsBtn${123}`);
    await user.click(showBlockedOrgsBtn);
    await user.click(screen.getByTestId(`unblockUserFromOrgBtn${'ghi'}`));
    const confirmUnblockBtn = screen.getByTestId(`confirmUnblockUser${123}`);
    await user.click(confirmUnblockBtn);
    await wait();
    expect(NotificationToast.error).toHaveBeenCalled();
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
                createdAt: dayjs.utc().subtract(3, 'month').toISOString(),
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
      <MockedProvider link={link2}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    const showJoinedOrgs = screen.getByTestId(`showJoinedOrgsBtn${123}`);
    await user.click(showJoinedOrgs);
    const changeRoleBtn = screen.getByTestId(
      `changeRoleInOrg${'abc'}`,
    ) as HTMLSelectElement;
    await userEvent.selectOptions(changeRoleBtn, 'ADMIN');
    await wait();
    expect(NotificationToast.error).toHaveBeenCalled();
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
    await user.click(showJoinedOrgsBtn);
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    const showBlockedOrgsBtn = screen.getByTestId(`showBlockedOrgsBtn${123}`);
    await user.click(showBlockedOrgsBtn);
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
                createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
                organization: {
                  name: 'Blocked Organization 1',
                  avatarURL: 'image.png',
                  city: 'Toronto',
                  state: 'ON',
                  createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
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
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    const showBlockedOrgsBtn = screen.getByTestId(`showBlockedOrgsBtn${123}`);
    await user.click(showBlockedOrgsBtn);
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
                createdAt: dayjs.utc().subtract(3, 'month').toISOString(),
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
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    await user.click(screen.getByTestId(`showJoinedOrgsBtn${123}`));
    await user.click(screen.getByTestId(`removeUserFromOrgBtn${'abc'}`));
    const confirmBtn = screen.getByTestId(`confirmRemoveUser${123}`);
    await user.click(confirmBtn);
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
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
                createdAt: dayjs.utc().subtract(3, 'month').toISOString(),
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
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    await user.click(screen.getByTestId(`showJoinedOrgsBtn${123}`));
    expect(screen.getByText('ADMIN', { selector: 'td' })).toBeInTheDocument();
    const select = screen.getByTestId(
      `changeRoleInOrg${'abc'}`,
    ) as HTMLSelectElement;
    expect(select.disabled).toBe(true);
    expect(select.value).toBe('ADMIN?abc');
    // Attempted changes should not trigger mutation due to disabled select
    await wait();
    expect(select.value).toBe('ADMIN?abc');
    expect(NotificationToast.success).not.toHaveBeenCalled();
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
        createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
        updatedAt: dayjs.utc().subtract(1, 'month').toISOString(),
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
                createdAt: dayjs.utc().subtract(3, 'month').toISOString(),
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
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    await user.click(screen.getByTestId(`showJoinedOrgsBtn${123}`));
    expect(screen.getByTestId(`modal-joined-org-${123}`)).toBeInTheDocument();
    await user.click(screen.getByTestId(`removeUserFromOrgBtn${'abc'}`));
    expect(screen.getByTestId(`modal-remove-user-${123}`)).toBeInTheDocument();
    // Cancel remove
    await user.click(screen.getByTestId(`closeRemoveUserModal${123}`));
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
                createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
                organization: {
                  name: 'Blocked Organization 1',
                  avatarURL: 'image.png',
                  city: 'Toronto',
                  state: 'ON',
                  createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
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
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await user.click(screen.getByTestId(`showBlockedOrgsBtn${123}`));
    await user.click(screen.getByTestId(`unblockUserFromOrgBtnghi`));
    await user.click(screen.getByTestId(`confirmUnblockUser${123}`));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
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
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await user.click(screen.getByTestId(`showBlockedOrgsBtn123`));

    const input = screen.getByTestId('searchByNameBlockedOrgs');
    await user.clear(input);
    await user.click(screen.getByTestId('searchBtnBlockedOrgs'));

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
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await user.click(screen.getByTestId(`showBlockedOrgsBtn123`));
    await user.click(screen.getByTestId(`unblockUserFromOrgBtnghi`));

    await user.click(screen.getByTestId(`closeUnblockUserModal123`));

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
        createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
        updatedAt: dayjs.utc().subtract(1, 'month').toISOString(),
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
                createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
                organization: {
                  name: 'Blocked Organization 1',
                  avatarURL: 'blocked-org.png',
                  city: 'Toronto',
                  state: 'Ontario',
                  createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
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
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    await user.click(screen.getByTestId(`showBlockedOrgsBtn${123}`));
    expect(screen.getByTestId(`modal-blocked-org-${123}`)).toBeInTheDocument();
    await user.click(screen.getByTestId(`unblockUserFromOrgBtn${'ghi'}`));
    expect(screen.getByTestId(`modal-unblock-user-${123}`)).toBeInTheDocument();
    // Cancel unblock
    await user.click(screen.getByTestId(`closeUnblockUserModal${123}`));
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

  test('Should trigger onClear callback when clear button is clicked in SearchBar', async () => {
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
                createdAt: dayjs.utc().subtract(3, 'month').toISOString(),
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
                createdAt: dayjs.utc().subtract(2, 'month').toISOString(),
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

    // Open the joined organizations modal
    await user.click(screen.getByTestId(`showJoinedOrgsBtn${123}`));
    expect(screen.getByTestId('modal-joined-org-123')).toBeInTheDocument();

    // Type something in the search input
    const inputBox = screen.getByTestId('searchByNameJoinedOrgs');
    await user.clear(inputBox);
    await user.type(inputBox, 'Test Search');

    // Find and click the clear button
    const clearButton = screen.getByLabelText('Clear');
    expect(clearButton).toBeInTheDocument();
    await user.click(clearButton);

    // After clearing, both organizations should be visible again
    await waitFor(() => {
      expect(screen.getByText(/Joined Organization 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Joined Organization 2/i)).toBeInTheDocument();
    });
  });

  test('Should close unblock user modal when clicking onHide (Escape key)', async () => {
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
                createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
                organization: {
                  name: 'Blocked Organization 1',
                  avatarURL: 'image.png',
                  city: 'Toronto',
                  state: 'ON',
                  createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
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
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    // Open blocked organizations modal
    await user.click(screen.getByTestId(`showBlockedOrgsBtn${123}`));
    expect(screen.getByTestId('modal-blocked-org-123')).toBeInTheDocument();

    // Click unblock button to open unblock user modal
    await user.click(screen.getByTestId(`unblockUserFromOrgBtn${'ghi'}`));
    expect(screen.getByTestId('modal-unblock-user-123')).toBeInTheDocument();

    // Press Escape to close the modal (triggers onHide)
    await user.keyboard('{Escape}');

    // The modal should be closed or the blocked organizations modal should be visible
    await waitFor(() => {
      expect(
        screen.getByTestId(`modal-blocked-org-${123}`),
      ).toBeInTheDocument();
    });
  });

  test('Should render Avatar fallback when org has no avatarURL in joined organizations', async () => {
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
        avatarURL: null,
        birthDate: null,
        city: null,
        countryCode: null,
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
                name: 'Org Without Avatar',
                avatarURL: undefined,
                city: 'Kingston',
                createdAt: dayjs.utc().subtract(3, 'month').toISOString(),
                creator: {
                  id: '456',
                  name: 'Creator Without Avatar',
                  emailAddress: 'creator@example.com',
                  avatarURL: undefined,
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

    await user.click(screen.getByTestId(`showJoinedOrgsBtn${123}`));
    expect(screen.getByTestId('modal-joined-org-123')).toBeInTheDocument();

    // Verify org name and creator name are displayed (Avatar component used as fallback)
    expect(screen.getByText(/Org Without Avatar/i)).toBeInTheDocument();
    expect(screen.getByText(/Creator Without Avatar/i)).toBeInTheDocument();
  });

  test('Should render Avatar fallback when org has no avatarURL in blocked organizations', async () => {
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
        avatarURL: null,
        birthDate: null,
        city: null,
        countryCode: null,
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
                createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
                organization: {
                  name: 'Blocked Org Without Avatar',
                  avatarURL: undefined,
                  city: 'Toronto',
                  state: 'ON',
                  createdAt: dayjs.utc().subtract(1, 'month').toISOString(),
                  creator: {
                    name: 'Blocked Creator',
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
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    await user.click(screen.getByTestId(`showBlockedOrgsBtn${123}`));
    expect(screen.getByTestId('modal-blocked-org-123')).toBeInTheDocument();

    // Verify org name and creator name are displayed (Avatar component used as fallback)
    expect(screen.getByText(/Blocked Org Without Avatar/i)).toBeInTheDocument();
    expect(screen.getByText(/Blocked Creator/i)).toBeInTheDocument();
  });
  test('Should clear search when clear button is clicked in blocked organizations modal', async () => {
    const props = {
      user: {
        id: '123',
        name: 'John Doe',
        emailAddress: 'john@example.com',
        avatarURL: null,
        birthDate: null,
        city: null,
        countryCode: null,
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
                createdAt: dayjs.utc().toISOString(),
                organization: {
                  name: 'Blocked Org 1',
                  avatarURL: undefined,
                  city: 'Toronto',
                  state: 'ON',
                  createdAt: dayjs.utc().toISOString(),
                  creator: {
                    name: 'Creator 1',
                  },
                },
              },
            },
            {
              node: {
                id: 'jkl',
                createdAt: dayjs.utc().toISOString(),
                organization: {
                  name: 'Blocked Org 2',
                  avatarURL: undefined,
                  city: 'Toronto',
                  state: 'ON',
                  createdAt: dayjs.utc().toISOString(),
                  creator: {
                    name: 'Creator 2',
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
      <MockedProvider link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await user.click(screen.getByTestId(`showBlockedOrgsBtn${123}`));

    const searchInput = screen.getByTestId('searchByNameBlockedOrgs');
    await user.clear(searchInput);
    await user.type(searchInput, 'Blocked Org 1');
    await user.type(searchInput, '{Enter}');

    expect(screen.getByText(/Blocked Org 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Blocked Org 2/i)).not.toBeInTheDocument();

    const clearBtn = screen.getByTestId('clearBtnBlockedOrgs');
    await user.click(clearBtn);

    expect(screen.getByText(/Blocked Org 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Blocked Org 2/i)).toBeInTheDocument();
  });
});
