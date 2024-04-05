import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { toast } from 'react-toastify';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import { MOCKS } from './UserTableItemMocks';
import UsersTableItem from './UsersTableItem';
<<<<<<< HEAD
import { BrowserRouter } from 'react-router-dom';
const link = new StaticMockLink(MOCKS, true);
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();
=======

const link = new StaticMockLink(MOCKS, true);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
const resetAndRefetchMock = jest.fn();

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

Object.defineProperty(window, 'location', {
  value: {
    replace: jest.fn(),
  },
  writable: true,
});

<<<<<<< HEAD
const mockNavgatePush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavgatePush,
}));

beforeEach(() => {
  setItem('SuperAdmin', true);
  setItem('id', '123');
=======
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

beforeEach(() => {
  localStorage.setItem('UserType', 'SUPERADMIN');
  localStorage.setItem('id', '123');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('Testing User Table Item', () => {
  console.error = jest.fn((message) => {
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
<<<<<<< HEAD
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
=======
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        image: null,
        email: 'john@example.com',
        userType: 'SUPERADMIN',
        adminApproved: true,
        adminFor: [
          {
            _id: 'abc',
          },
        ],
        createdAt: '2023-09-29T15:39:36.355Z',
        organizationsBlockedBy: [
          {
            _id: 'xyz',
            name: 'XYZ',
            image: null,
            location: 'Jamaica',
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
            location: 'Jamaica',
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
            location: 'Jamaica',
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
            location: 'Jamaica',
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
      index: 0,
      loggedInUserId: '123',
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
<<<<<<< HEAD
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
=======
        <I18nextProvider i18n={i18nForTest}>
          <UsersTableItem {...props} />
        </I18nextProvider>
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();
    expect(screen.getByText(/1/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
<<<<<<< HEAD
    expect(screen.getByTestId(`showJoinedOrgsBtn${123}`)).toBeInTheDocument();
    expect(
      screen.getByTestId(`showBlockedByOrgsBtn${123}`),
=======
    expect(screen.getByTestId(`changeRole${123}`)).toBeInTheDocument();
    expect(screen.getByTestId(`changeRole${123}`)).toHaveValue(
      `SUPERADMIN?${123}`
    );
    expect(screen.getByTestId(`showJoinedOrgsBtn${123}`)).toBeInTheDocument();
    expect(
      screen.getByTestId(`showBlockedByOrgsBtn${123}`)
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        image: null,
        email: 'john@example.com',
        userType: 'SUPERADMIN',
        adminApproved: true,
        adminFor: [
          {
            _id: 'abc',
          },
        ],
        createdAt: '2023-09-29T15:39:36.355Z',
        organizationsBlockedBy: [],
        joinedOrganizations: [],
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();
    const showJoinedOrgsBtn = screen.getByTestId(`showJoinedOrgsBtn${123}`); // 123 is userId
    const showBlockedByOrgsBtn = screen.getByTestId(
<<<<<<< HEAD
      `showBlockedByOrgsBtn${123}`,
=======
      `showBlockedByOrgsBtn${123}`
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    ); // 123 is userId

    // Open JoinedOrgs Modal -> Expect modal to contain text and no search box -> Close Modal
    fireEvent.click(showJoinedOrgsBtn);
    expect(
<<<<<<< HEAD
      screen.queryByTestId(`searchByNameJoinedOrgs`),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/John Doe has not joined any organization/i),
=======
      screen.queryByTestId(`searchByNameJoinedOrgs`)
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/John Doe has not joined any organization/i)
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId(`closeJoinedOrgsBtn${123}`));

    // Open BlockedByOrgs Modal -> Expect modal to contain text and no search box -> Close Modal
    fireEvent.click(showBlockedByOrgsBtn);
    expect(
<<<<<<< HEAD
      screen.queryByTestId(`searchByNameOrgsBlockedBy`),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/John Doe is not blocked by any organization/i),
=======
      screen.queryByTestId(`searchByNameOrgsBlockedBy`)
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/John Doe is not blocked by any organization/i)
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        image: null,
        email: 'john@example.com',
        userType: 'SUPERADMIN',
        adminApproved: true,
        adminFor: [
          {
            _id: 'abc',
          },
        ],
        createdAt: '2022-09-29T15:39:36.355Z',
        organizationsBlockedBy: [
          {
            _id: 'xyz',
            name: 'Blocked Organization 1',
            image: null,
            location: 'Jamaica',
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
            _id: 'mno',
            name: 'Blocked Organization 2',
            image: null,
            location: 'Jamaica',
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
            image:
              'https://api.dicebear.com/5.x/initials/svg?seed=Joined%20Organization%201',
            location: 'Jamaica',
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
            _id: 'def',
            name: 'Joined Organization 2',
            image: null,
            location: 'Jamaica',
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      screen.queryByRole('dialog')?.className.includes('show'),
=======
      screen.queryByRole('dialog')?.className.includes('show')
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    ).toBeFalsy();
    fireEvent.click(showJoinedOrgsBtn);
    // Close using close button and reopen
    fireEvent.click(screen.getByTestId(`closeJoinedOrgsBtn${123}`));
    expect(
<<<<<<< HEAD
      screen.queryByRole('dialog')?.className.includes('show'),
=======
      screen.queryByRole('dialog')?.className.includes('show')
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    ).toBeFalsy();

    fireEvent.click(showJoinedOrgsBtn);

    // Expect the following to exist in modal
    const inputBox = screen.getByTestId(`searchByNameJoinedOrgs`);
    expect(inputBox).toBeInTheDocument();
    expect(screen.getByText(/Joined Organization 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Joined Organization 2/i)).toBeInTheDocument();
<<<<<<< HEAD
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
=======
    expect(screen.getAllByText(/Jamaica/i)).toHaveLength(2);
    expect(screen.getByText(/29-08-2023/i)).toBeInTheDocument();
    expect(screen.getByText(/19-09-2023/i)).toBeInTheDocument();
    expect(screen.getByTestId('removeUserFromOrgBtnabc')).toBeInTheDocument();
    expect(screen.getByTestId('removeUserFromOrgBtndef')).toBeInTheDocument();
    expect(screen.getByTestId(`changeRoleInOrgabc`)).toHaveValue('ADMIN?abc');
    expect(screen.getByTestId(`changeRoleInOrgdef`)).toHaveValue('USER?def');

    // Search for Joined Organization 1
    fireEvent.change(inputBox, { target: { value: 'Joined Organization 1' } });
    expect(screen.getByText(/Joined Organization 1/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Joined Organization 2/i)
    ).not.toBeInTheDocument();

    // Search for an Organization which does not exist
    fireEvent.change(inputBox, { target: { value: 'Joined Organization 3' } });
    expect(
      screen.getByText(`No results found for "Joined Organization 3"`)
    ).toBeInTheDocument();

    // Now clear the search box
    fireEvent.change(inputBox, { target: { value: '' } });

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    // Click on Creator Link
    fireEvent.click(screen.getByTestId(`creatorabc`));
    expect(toast.success).toBeCalledWith('Profile Page Coming Soon !');

    // Click on Organization Link
    fireEvent.click(screen.getByText(/Joined Organization 1/i));
<<<<<<< HEAD
    expect(window.location.replace).toBeCalledWith('/orgdash/abc');
    expect(mockNavgatePush).toBeCalledWith('/orgdash/abc');
=======
    expect(window.location.replace).toBeCalledWith('/orgdash/id=abc');
    expect(mockHistoryPush).toBeCalledWith('/orgdash/id=abc');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        image: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
        email: 'john@example.com',
        userType: 'SUPERADMIN',
        adminApproved: true,
        adminFor: [
          {
            _id: 'abc',
          },
          {
            _id: 'xyz',
          },
        ],
        createdAt: '2022-09-29T15:39:36.355Z',
        organizationsBlockedBy: [
          {
            _id: 'xyz',
            name: 'Blocked Organization 1',
            image:
              'https://api.dicebear.com/5.x/initials/svg?seed=Blocked%20Organization%201',
            location: 'Jamaica',
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
            location: 'Jamaica',
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
            location: 'Jamaica',
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
            location: 'Jamaica',
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
      index: 0,
      loggedInUserId: '123',
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
<<<<<<< HEAD
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
=======
        <I18nextProvider i18n={i18nForTest}>
          <UsersTableItem {...props} />
        </I18nextProvider>
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();
    const showBlockedByOrgsBtn = screen.getByTestId(
<<<<<<< HEAD
      `showBlockedByOrgsBtn${123}`,
=======
      `showBlockedByOrgsBtn${123}`
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      screen.queryByRole('dialog')?.className.includes('show'),
=======
      screen.queryByRole('dialog')?.className.includes('show')
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    ).toBeFalsy();
    fireEvent.click(showBlockedByOrgsBtn);
    // Close using close button and reopen
    fireEvent.click(screen.getByTestId(`closeBlockedByOrgsBtn${123}`));
    expect(
<<<<<<< HEAD
      screen.queryByRole('dialog')?.className.includes('show'),
=======
      screen.queryByRole('dialog')?.className.includes('show')
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    ).toBeFalsy();

    fireEvent.click(showBlockedByOrgsBtn);

    // Expect the following to exist in modal

    const inputBox = screen.getByTestId(`searchByNameOrgsBlockedBy`);
    expect(inputBox).toBeInTheDocument();
<<<<<<< HEAD
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
=======
    expect(screen.getByText(/Blocked Organization 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Blocked Organization 2/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Jamaica/i)).toHaveLength(2);
    expect(screen.getByText(/29-08-2023/i)).toBeInTheDocument();
    expect(screen.getByText(/29-09-2023/i)).toBeInTheDocument();
    expect(screen.getByTestId('removeUserFromOrgBtnxyz')).toBeInTheDocument();
    expect(screen.getByTestId('removeUserFromOrgBtnmno')).toBeInTheDocument();
    expect(screen.getByTestId(`changeRoleInOrgxyz`)).toHaveValue('ADMIN?xyz');
    expect(screen.getByTestId(`changeRoleInOrgmno`)).toHaveValue('USER?mno');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    // Click on Creator Link
    fireEvent.click(screen.getByTestId(`creatorxyz`));
    expect(toast.success).toBeCalledWith('Profile Page Coming Soon !');

    // Search for Blocked Organization 1
<<<<<<< HEAD
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
    expect(window.location.replace).toBeCalledWith('/orgdash/xyz');
    expect(mockNavgatePush).toBeCalledWith('/orgdash/xyz');
=======
    fireEvent.change(inputBox, { target: { value: 'Blocked Organization 1' } });
    expect(screen.getByText(/Blocked Organization 1/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Blocked Organization 2/i)
    ).not.toBeInTheDocument();

    // Search for an Organization which does not exist
    fireEvent.change(inputBox, { target: { value: 'Blocked Organization 3' } });
    expect(
      screen.getByText(`No results found for "Blocked Organization 3"`)
    ).toBeInTheDocument();

    // Now clear the search box
    fireEvent.change(inputBox, { target: { value: '' } });

    // Click on Organization Link
    fireEvent.click(screen.getByText(/Blocked Organization 1/i));
    expect(window.location.replace).toBeCalledWith('/orgdash/id=xyz');
    expect(mockHistoryPush).toBeCalledWith('/orgdash/id=xyz');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        image: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
        email: 'john@example.com',
        userType: 'SUPERADMIN',
        adminApproved: true,
        adminFor: [
          {
            _id: 'abc',
          },
          {
            _id: 'xyz',
          },
        ],
        createdAt: '2022-09-29T15:39:36.355Z',
        organizationsBlockedBy: [
          {
            _id: 'xyz',
            name: 'Blocked Organization 1',
            image:
              'https://api.dicebear.com/5.x/initials/svg?seed=Blocked%20Organization%201',
            location: 'Jamaica',
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
            location: 'Jamaica',
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
            location: 'Jamaica',
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
            location: 'Jamaica',
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
      index: 0,
      loggedInUserId: '123',
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
<<<<<<< HEAD
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
=======
        <I18nextProvider i18n={i18nForTest}>
          <UsersTableItem {...props} />
        </I18nextProvider>
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
        .some((el) => el.className.includes('show')),
=======
        .some((el) => el.className.includes('show'))
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    ).toBeTruthy();
    fireEvent.click(showJoinedOrgsBtn);
    // Close using close button and reopen
    fireEvent.click(screen.getByTestId('closeRemoveUserModal123'));
    expect(
      screen
        .queryAllByRole('dialog')
<<<<<<< HEAD
        .some((el) => el.className.includes('show')),
=======
        .some((el) => el.className.includes('show'))
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        image: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
        email: 'john@example.com',
        userType: 'SUPERADMIN',
        adminApproved: true,
        adminFor: [
          {
            _id: 'abc',
          },
          {
            _id: 'xyz',
          },
        ],
        createdAt: '2022-09-29T15:39:36.355Z',
        organizationsBlockedBy: [
          {
            _id: 'xyz',
            name: 'Blocked Organization 1',
            image:
              'https://api.dicebear.com/5.x/initials/svg?seed=Blocked%20Organization%201',
            location: 'Jamaica',
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
            location: 'Jamaica',
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
            location: 'Jamaica',
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
            location: 'Jamaica',
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
      index: 0,
      loggedInUserId: '123',
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider addTypename={false} link={link}>
<<<<<<< HEAD
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <UsersTableItem {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
=======
        <I18nextProvider i18n={i18nForTest}>
          <UsersTableItem {...props} />
        </I18nextProvider>
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();
    const showBlockedByOrgsBtn = screen.getByTestId(
<<<<<<< HEAD
      `showBlockedByOrgsBtn${123}`,
=======
      `showBlockedByOrgsBtn${123}`
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
        .some((el) => el.className.includes('show')),
=======
        .some((el) => el.className.includes('show'))
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    ).toBeTruthy();
    fireEvent.click(showBlockedByOrgsBtn);
    // Close using close button and reopen
    fireEvent.click(screen.getByTestId('closeRemoveUserModal123'));
    expect(
      screen
        .queryAllByRole('dialog')
<<<<<<< HEAD
        .some((el) => el.className.includes('show')),
=======
        .some((el) => el.className.includes('show'))
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    ).toBeTruthy();

    fireEvent.click(showBlockedByOrgsBtn);
    fireEvent.click(screen.getByTestId(`removeUserFromOrgBtn${'xyz'}`));
    const confirmRemoveBtn = screen.getByTestId(`confirmRemoveUser123`);
    expect(confirmRemoveBtn).toBeInTheDocument();

    fireEvent.click(confirmRemoveBtn);
  });
<<<<<<< HEAD
=======

  test('Should be able to change userType of a user if not self', async () => {
    const props: {
      user: InterfaceQueryUserListItem;
      index: number;
      loggedInUserId: string;
      resetAndRefetch: () => void;
    } = {
      user: {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        image: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
        email: 'john@example.com',
        userType: 'USER',
        adminApproved: true,
        adminFor: [
          {
            _id: 'abc',
          },
          {
            _id: 'xyz',
          },
        ],
        createdAt: '2022-09-29T15:39:36.355Z',
        organizationsBlockedBy: [
          {
            _id: 'xyz',
            name: 'Blocked Organization 1',
            image:
              'https://api.dicebear.com/5.x/initials/svg?seed=Blocked%20Organization%201',
            location: 'Jamaica',
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
            location: 'Jamaica',
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
            location: 'Jamaica',
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
            location: 'Jamaica',
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
      },
      index: 0,
      loggedInUserId: '456',
      resetAndRefetch: resetAndRefetchMock,
    };

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
          <UsersTableItem {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();
    fireEvent.select(screen.getByTestId(`changeRole123`), {
      target: { value: 'ADMIN?123' },
    });
  });

  test('Should be not able to change userType of self', async () => {
    const props: {
      user: InterfaceQueryUserListItem;
      index: number;
      loggedInUserId: string;
      resetAndRefetch: () => void;
    } = {
      user: {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        image: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
        email: 'john@example.com',
        userType: 'ADMIN',
        adminApproved: true,
        adminFor: [
          {
            _id: 'abc',
          },
          {
            _id: 'xyz',
          },
        ],
        createdAt: '2022-09-29T15:39:36.355Z',
        organizationsBlockedBy: [
          {
            _id: 'xyz',
            name: 'Blocked Organization 1',
            image:
              'https://api.dicebear.com/5.x/initials/svg?seed=Blocked%20Organization%201',
            location: 'Jamaica',
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
            location: 'Jamaica',
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
            location: 'Jamaica',
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
            location: 'Jamaica',
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
      </MockedProvider>
    );

    await wait();
    expect(screen.getByTestId(`changeRole123`)).toBeDisabled();
    expect(screen.getByTestId(`changeRole123`)).toHaveValue('ADMIN?123');
  });
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
});
