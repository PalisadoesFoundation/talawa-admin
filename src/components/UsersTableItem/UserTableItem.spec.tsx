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
import { BrowserRouter } from 'react-router-dom';
const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS2, true);
const link3 = new StaticMockLink(MOCKS_UPDATE, true);
import useLocalStorage from 'utils/useLocalstorage';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type * as RouterTypes from 'react-router-dom';

const { setItem } = useLocalStorage();

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
  },
}));

Object.defineProperty(window, 'location', {
  value: {
    replace: vi.fn(),
  },
  writable: true,
});

const mockNavgatePush = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual(
    'react-router-dom',
  )) as typeof RouterTypes;
  return {
    ...actual,
    useNavigate: () => mockNavgatePush,
  };
});

beforeEach(() => {
  setItem('SuperAdmin', true);
  setItem('id', '123');
});

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
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
        user: {
          _id: '123',
          firstName: 'John',
          lastName: 'Doe',
          image: null,
          email: 'john@example.com',
          createdAt: '2023-09-29T15:39:36.355Z',
          organizationsBlockedBy: [
            {
              _id: 'xyz',
              name: 'XYZ',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-01-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
            {
              _id: 'mno',
              name: 'MNO',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-01-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
          ],
          joinedOrganizations: [
            {
              _id: 'abc',
              name: 'Joined Organization 1',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-06-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
            {
              _id: 'def',
              name: 'Joined Organization 2',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-07-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
          ],
          registeredEvents: [],
          membershipRequests: [],
        },
        appUserProfile: {
          _id: '123',
          isSuperAdmin: true,
          createdOrganizations: [],
          createdEvents: [],
          eventAdmin: [],
          adminFor: [
            {
              _id: 'abc',
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
    expect(
      screen.getByTestId(`showBlockedByOrgsBtn${123}`),
    ).toBeInTheDocument();
  });

  test('Should render elements correctly when JoinedOrgs and BlockedByOrgs are empty', async () => {
    const props: {
      user: InterfaceQueryUserListItem;
      index: number;
      loggedInUserId: string;
      resetAndRefetch: () => void;
    } = {
      user: {
        user: {
          _id: '123',
          firstName: 'John',
          lastName: 'Doe',
          image: null,
          email: 'john@example.com',
          createdAt: '2023-09-29T15:39:36.355Z',
          organizationsBlockedBy: [],
          joinedOrganizations: [],
          registeredEvents: [],
          membershipRequests: [],
        },
        appUserProfile: {
          _id: '123',
          isSuperAdmin: true,
          createdOrganizations: [],
          createdEvents: [],
          eventAdmin: [],
          adminFor: [
            {
              _id: 'abc',
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
    const showJoinedOrgsBtn = screen.getByTestId(`showJoinedOrgsBtn${123}`); // 123 is userId
    const showBlockedByOrgsBtn = screen.getByTestId(
      `showBlockedByOrgsBtn${123}`,
    ); // 123 is userId

    // Open JoinedOrgs Modal -> Expect modal to contain text and no search box -> Close Modal
    fireEvent.click(showJoinedOrgsBtn);
    expect(
      screen.queryByTestId(`searchByNameJoinedOrgs`),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/John Doe has not joined any organization/i),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId(`closeJoinedOrgsBtn${123}`));

    // Open BlockedByOrgs Modal -> Expect modal to contain text and no search box -> Close Modal
    fireEvent.click(showBlockedByOrgsBtn);
    expect(
      screen.queryByTestId(`searchByNameOrgsBlockedBy`),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/John Doe is not blocked by any organization/i),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId(`closeBlockedByOrgsBtn${123}`));
  });

  test('Should render props and text elements test for the Joined Organizations Modal properly', async () => {
    const props: {
      user: InterfaceQueryUserListItem;
      index: number;
      loggedInUserId: string;
      resetAndRefetch: () => void;
    } = {
      user: {
        user: {
          _id: '123',
          firstName: 'John',
          lastName: 'Doe',
          image: null,
          email: 'john@example.com',
          createdAt: '2023-09-29T15:39:36.355Z',
          organizationsBlockedBy: [
            {
              _id: 'xyz',
              name: 'XYZ',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-01-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
            {
              _id: 'mno',
              name: 'MNO',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-01-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
          ],
          joinedOrganizations: [
            {
              _id: 'abc',
              name: 'Joined Organization 1',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-06-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
            {
              _id: 'def',
              name: 'Joined Organization 2',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-07-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
          ],
          registeredEvents: [],
          membershipRequests: [],
        },
        appUserProfile: {
          _id: '123',
          isSuperAdmin: true,
          createdOrganizations: [],
          createdEvents: [],
          eventAdmin: [],
          adminFor: [
            {
              _id: 'abc',
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
    fireEvent.keyUp(inputBox, {
      target: { value: 'Joined Organization 1' },
    });
    fireEvent.click(searchBtn);
    expect(screen.getByText(/Joined Organization 1/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Joined Organization 2/i),
    ).not.toBeInTheDocument();

    // Search for an Organization which does not exist
    fireEvent.keyUp(inputBox, {
      key: 'Enter',
      target: { value: 'Joined Organization 3' },
    });
    expect(
      screen.getByText(`No results found for "Joined Organization 3"`),
    ).toBeInTheDocument();

    // Now clear the search box
    fireEvent.keyUp(inputBox, { key: 'Enter', target: { value: '' } });
    fireEvent.keyUp(inputBox, { target: { value: '' } });
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

  test('Should render props and text elements test for the Blocked By Organizations Modal properly', async () => {
    const props: {
      user: InterfaceQueryUserListItem;
      index: number;
      loggedInUserId: string;
      resetAndRefetch: () => void;
    } = {
      user: {
        user: {
          _id: '123',
          firstName: 'John',
          lastName: 'Doe',
          image: null,
          email: 'john@example.com',
          createdAt: '2023-09-29T15:39:36.355Z',
          organizationsBlockedBy: [
            {
              _id: 'xyz',
              name: 'XYZ',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-01-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
            {
              _id: 'mno',
              name: 'MNO',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-03-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
          ],
          joinedOrganizations: [
            {
              _id: 'abc',
              name: 'Joined Organization 1',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-06-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
            {
              _id: 'def',
              name: 'Joined Organization 2',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-07-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
          ],
          registeredEvents: [],
          membershipRequests: [],
        },
        appUserProfile: {
          _id: '123',
          isSuperAdmin: true,
          createdOrganizations: [],
          createdEvents: [],
          eventAdmin: [],
          adminFor: [
            {
              _id: 'xyz',
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
    const showBlockedByOrgsBtn = screen.getByTestId(
      `showBlockedByOrgsBtn${123}`,
    );
    expect(showBlockedByOrgsBtn).toBeInTheDocument();
    fireEvent.click(showBlockedByOrgsBtn);
    expect(screen.getByTestId('modal-blocked-org-123')).toBeInTheDocument();

    // Close using escape key and reopen
    fireEvent.keyDown(screen.getByTestId('modal-blocked-org-123'), {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
    expect(
      screen.queryByRole('dialog')?.className.includes('show'),
    ).toBeFalsy();
    fireEvent.click(showBlockedByOrgsBtn);
    // Close using close button and reopen
    fireEvent.click(screen.getByTestId(`closeBlockedByOrgsBtn${123}`));
    expect(
      screen.queryByRole('dialog')?.className.includes('show'),
    ).toBeFalsy();

    fireEvent.click(showBlockedByOrgsBtn);

    // Expect the following to exist in modal

    const inputBox = screen.getByTestId(`searchByNameOrgsBlockedBy`);
    expect(inputBox).toBeInTheDocument();
    expect(screen.getByText(/XYZ/i)).toBeInTheDocument();
    expect(screen.getByText(/MNO/i)).toBeInTheDocument();
    const elementsWithKingston = screen.getAllByText(/Kingston/i);
    elementsWithKingston.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
    expect(screen.getByText(/29-01-2023/i)).toBeInTheDocument();
    expect(screen.getByText(/29-03-2023/i)).toBeInTheDocument();
    expect(screen.getByTestId('removeUserFromOrgBtnxyz')).toBeInTheDocument();
    expect(screen.getByTestId('removeUserFromOrgBtnmno')).toBeInTheDocument();
    // Click on Creator Link
    fireEvent.click(screen.getByTestId(`creatorxyz`));
    expect(toast.success).toHaveBeenCalledWith('Profile Page Coming Soon !');

    // Search for Blocked Organization 1
    const searchBtn = screen.getByTestId(`searchBtnOrgsBlockedBy`);
    fireEvent.keyUp(inputBox, {
      target: { value: 'XYZ' },
    });
    fireEvent.click(searchBtn);
    expect(screen.getByText(/XYZ/i)).toBeInTheDocument();
    expect(screen.queryByText(/MNO/i)).not.toBeInTheDocument();

    // Search for an Organization which does not exist
    fireEvent.keyUp(inputBox, {
      key: 'Enter',
      target: { value: 'Blocked Organization 3' },
    });
    expect(
      screen.getByText(`No results found for "Blocked Organization 3"`),
    ).toBeInTheDocument();

    // Now clear the search box
    fireEvent.keyUp(inputBox, { key: 'Enter', target: { value: '' } });
    fireEvent.keyUp(inputBox, { target: { value: '' } });
    fireEvent.click(searchBtn);

    // Click on Organization Link
    fireEvent.click(screen.getByText(/XYZ/i));
    expect(window.location.replace).toHaveBeenCalledWith('/orgdash/xyz');
    expect(mockNavgatePush).toHaveBeenCalledWith('/orgdash/xyz');
    fireEvent.click(screen.getByTestId(`closeBlockedByOrgsBtn${123}`));
  });

  test('Remove user from Organization should function properly in Organizations Joined Modal', async () => {
    const props: {
      user: InterfaceQueryUserListItem;
      index: number;
      loggedInUserId: string;
      resetAndRefetch: () => void;
    } = {
      user: {
        user: {
          _id: '123',
          firstName: 'John',
          lastName: 'Doe',
          image: null,
          email: 'john@example.com',
          createdAt: '2023-09-29T15:39:36.355Z',
          organizationsBlockedBy: [
            {
              _id: 'xyz',
              name: 'XYZ',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-01-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
            {
              _id: 'mno',
              name: 'MNO',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-01-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
          ],
          joinedOrganizations: [
            {
              _id: 'abc',
              name: 'Joined Organization 1',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-06-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
            {
              _id: 'def',
              name: 'Joined Organization 2',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-07-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
          ],
          registeredEvents: [],
          membershipRequests: [],
        },
        appUserProfile: {
          _id: '123',
          isSuperAdmin: true,
          createdOrganizations: [],
          createdEvents: [],
          eventAdmin: [],
          adminFor: [
            {
              _id: 'abc',
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

  test('Remove user from Organization should function properly in Organizations Blocked by Modal', async () => {
    const props: {
      user: InterfaceQueryUserListItem;
      index: number;
      loggedInUserId: string;
      resetAndRefetch: () => void;
    } = {
      user: {
        user: {
          _id: '123',
          firstName: 'John',
          lastName: 'Doe',
          image: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
          email: 'john@example.com',
          createdAt: '2022-09-29T15:39:36.355Z',
          organizationsBlockedBy: [
            {
              _id: 'xyz',
              name: 'Blocked Organization 1',
              image:
                'https://api.dicebear.com/5.x/initials/svg?seed=Blocked%20Organization%201',
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-08-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image:
                  'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
                email: 'john@example.com',
              },
            },
            {
              _id: 'mno',
              name: 'Blocked Organization 2',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-09-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
          ],
          joinedOrganizations: [
            {
              _id: 'abc',
              name: 'Joined Organization 1',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-08-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
            {
              _id: 'def',
              name: 'Joined Organization 2',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-09-19T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: 'john@example.com',
              },
            },
          ],
          registeredEvents: [],
          membershipRequests: [],
        },
        appUserProfile: {
          _id: '123',
          isSuperAdmin: true,
          createdOrganizations: [],
          createdEvents: [],
          eventAdmin: [],
          adminFor: [
            {
              _id: 'abc',
            },
            {
              _id: 'xyz',
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
    const showBlockedByOrgsBtn = screen.getByTestId(
      `showBlockedByOrgsBtn${123}`,
    );
    expect(showBlockedByOrgsBtn).toBeInTheDocument();
    fireEvent.click(showBlockedByOrgsBtn);
    expect(screen.getByTestId('modal-blocked-org-123')).toBeInTheDocument();
    fireEvent.click(showBlockedByOrgsBtn);
    fireEvent.click(screen.getByTestId(`removeUserFromOrgBtn${'xyz'}`));
    expect(screen.getByTestId('modal-remove-user-123')).toBeInTheDocument();

    // Close using escape key and reopen
    fireEvent.keyDown(screen.getByTestId('modal-blocked-org-123'), {
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
    fireEvent.click(showBlockedByOrgsBtn);
    // Close using close button and reopen
    fireEvent.click(screen.getByTestId('closeRemoveUserModal123'));
    expect(
      screen
        .queryAllByRole('dialog')
        .some((el) => el.className.includes('show')),
    ).toBeTruthy();

    fireEvent.click(showBlockedByOrgsBtn);
    fireEvent.click(screen.getByTestId(`removeUserFromOrgBtn${'xyz'}`));
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
        user: {
          _id: '123',
          firstName: 'John',
          lastName: 'Doe',
          image: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
          email: '',
          createdAt: '2022-09-29T15:39:36.355Z',
          organizationsBlockedBy: [
            {
              _id: 'xyz',
              name: 'Blocked Organization 1',
              image:
                'https://api.dicebear.com/5.x/initials/svg?seed=Blocked%20Organization%201',
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-08-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image:
                  'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
                email: '',
              },
            },
          ],
          joinedOrganizations: [
            {
              _id: 'abc',
              name: 'Joined Organization 1',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-08-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: '',
              },
            },
          ],
          registeredEvents: [],
          membershipRequests: [],
        },
        appUserProfile: {
          _id: '123',
          isSuperAdmin: true,
          createdOrganizations: [],
          createdEvents: [],
          eventAdmin: [],
          adminFor: [
            {
              _id: 'abc',
            },
            {
              _id: 'xyz',
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

    await wait();
    const showBlockedByOrgsBtn = screen.getByTestId(
      `showBlockedByOrgsBtn${123}`,
    );
    expect(showBlockedByOrgsBtn).toBeInTheDocument();
    fireEvent.click(showBlockedByOrgsBtn);
    expect(screen.getByTestId('modal-blocked-org-123')).toBeInTheDocument();
  });

  test('change role button should function properly', async () => {
    const props: {
      user: InterfaceQueryUserListItem;
      index: number;
      loggedInUserId: string;
      resetAndRefetch: () => void;
    } = {
      user: {
        user: {
          _id: '123',
          firstName: 'John',
          lastName: 'Doe',
          image: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
          email: '',
          createdAt: '2022-09-29T15:39:36.355Z',
          organizationsBlockedBy: [
            {
              _id: 'xyz',
              name: 'Blocked Organization 1',
              image:
                'https://api.dicebear.com/5.x/initials/svg?seed=Blocked%20Organization%201',
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-08-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image:
                  'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
                email: '',
              },
            },
          ],
          joinedOrganizations: [
            {
              _id: 'abc',
              name: 'Joined Organization 1',
              image: null,
              address: {
                city: 'Kingston',
                countryCode: 'JM',
                dependentLocality: 'Sample Dependent Locality',
                line1: '123 Jamaica Street',
                line2: 'Apartment 456',
                postalCode: 'JM12345',
                sortingCode: 'ABC-123',
                state: 'Kingston Parish',
              },
              createdAt: '2023-08-29T15:39:36.355Z',
              creator: {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                image: null,
                email: '',
              },
            },
          ],
          registeredEvents: [],

          membershipRequests: [],
        },
        appUserProfile: {
          _id: '123',
          isSuperAdmin: false,
          createdOrganizations: [],
          createdEvents: [],
          eventAdmin: [],
          adminFor: [
            {
              _id: 'abc',
            },
            {
              _id: 'xyz',
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
    userEvent.selectOptions(changeRoleBtn, 'ADMIN');
    await wait();
    userEvent.selectOptions(changeRoleBtn, 'USER');
    await wait();
    expect(changeRoleBtn.value).toBe(`USER?abc`);
    await wait();
  });
});
