import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import OrgPeopleOrganizationsCard from './OrgPeopleOrganizationsCard';
import {
  ADD_MEMBER_MUTATION,
  BLOCK_USER_MUTATION,
  REMOVE_MEMBER_MUTATION,
  UNBLOCK_USER_MUTATION,
  UPDATE_USER_ROLE_IN_ORG_MUTATION,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { BrowserRouter } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Provider } from 'react-redux';
import { store } from 'state/store';

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.orgPeopleOrganizationsCard,
  ),
);

const MOCKS = [
  {
    request: {
      query: REMOVE_MEMBER_MUTATION,
      variables: {
        userid: '123',
        orgid: 'orgid',
      },
    },
    result: {
      data: {
        removeMember: {
          _id: 'orgid',
        },
      },
    },
  },
  {
    request: {
      query: UNBLOCK_USER_MUTATION,
      variables: {
        userId: '123',
        orgId: 'orgid',
      },
    },
    result: {
      data: {
        unblockUser: {
          _id: '123',
        },
      },
    },
  },
  {
    request: {
      query: ADD_MEMBER_MUTATION,
      variables: {
        userid: '123',
        orgid: 'orgid',
      },
    },
    result: {
      data: {
        createMember: {
          organization: {
            _id: 'orgid',
            __typename: 'Organization',
          },
        },
      },
    },
  },
  {
    request: {
      query: BLOCK_USER_MUTATION,
      variables: {
        userId: '123',
        orgId: 'orgid',
      },
    },
    result: {
      data: {
        blockUser: {
          _id: '123',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_ROLE_IN_ORG_MUTATION,
      variables: {
        userId: '123',
        organizationId: 'orgid',
        role: 'ADMIN',
      },
    },
    result: {
      data: {
        updateUserRoleInOrganization: {
          _id: 'orgid',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_ROLE_IN_ORG_MUTATION,
      variables: {
        userId: '234',
        organizationId: 'orgid',
        role: 'ADMIN',
      },
    },
    result: {
      data: {
        updateUserRoleInOrganization: {
          _id: 'orgid',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_ROLE_IN_ORG_MUTATION,
      variables: {
        userId: '123',
        organizationId: 'orgid',
        role: 'USER',
      },
    },
    result: {
      data: {
        updateUserRoleInOrganization: {
          _id: 'orgid',
        },
      },
    },
  },
];

const MOCKS_WITH_ERROR = [
  {
    request: {
      query: REMOVE_MEMBER_MUTATION,
      variables: {
        userid: '123',
        orgid: 'orgid',
      },
    },
    error: new Error('Remove member failed'),
  },
  {
    request: {
      query: UNBLOCK_USER_MUTATION,
      variables: {
        userId: '123',
        orgId: 'orgid',
      },
    },
    error: new Error('Unblock user failed'),
  },
  {
    request: {
      query: ADD_MEMBER_MUTATION,
      variables: {
        userid: '123',
        orgid: 'orgid',
      },
    },
    error: new Error('Add member failed'),
  },
  {
    request: {
      query: BLOCK_USER_MUTATION,
      variables: {
        userId: '123',
        orgId: 'orgid',
      },
    },
    error: new Error('Block user failed'),
  },
  {
    request: {
      query: UPDATE_USER_ROLE_IN_ORG_MUTATION,
      variables: {
        organizationId: 'orgid',
        userId: '123',
        role: 'User',
      },
    },
    error: new Error('Role update failed'),
  },
  {
    request: {
      query: UPDATE_USER_ROLE_IN_ORG_MUTATION,
      variables: {
        organizationId: 'orgid',
        userId: '123',
        role: 'Admin',
      },
    },
    error: new Error('Role update failed'),
  },
  {
    request: {
      query: UPDATE_USER_ROLE_IN_ORG_MUTATION,
      variables: {
        organizationId: 'orgid',
        userId: '123',
        role: 'Super Admin',
      },
    },
    error: new Error('Role update failed'),
  },
];

const { getItem, setItem } = useLocalStorage();

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
}));

const defaultProps = {
  userId: '123',
  _id: 'orgid',
  admins: [{ _id: '123' }],
  blockedUsers: [],
  members: [{ _id: '123' }],
  resetAndRefetch: jest.fn(),
  image: '',
  name: 'Organization Name',
  description: 'Organization Description',
};

beforeEach(() => {
  toast.dismiss();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Testing Organization People Card', () => {
  test('Should render without crashing', async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <OrgPeopleOrganizationsCard {...defaultProps} />
              </BrowserRouter>
            </LocalizationProvider>
          </I18nextProvider>
        </MockedProvider>
      </Provider>,
    );

    expect(screen.getByText('Organization Name')).toBeInTheDocument();
    expect(screen.getByText('Organization Description')).toBeInTheDocument();
  });

  test('displays the correct role', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <OrgPeopleOrganizationsCard {...defaultProps} />
      </MockedProvider>,
    );

    const roleToggle = screen.getByTestId('dropdown-role');
    expect(roleToggle).toHaveTextContent('Admin');
  });

  test('displays the correct status', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <OrgPeopleOrganizationsCard {...defaultProps} />
      </MockedProvider>,
    );

    const statusToggle = screen.getByTestId('dropdown-status');
    expect(statusToggle).toHaveTextContent('Active');
  });

  test('displays org image', () => {
    const beforeUserId = getItem('userId');

    setItem('userId', '1');
    const imageProps = { ...defaultProps, image: 'image.png' };

    render(
      <Provider store={store}>
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <OrgPeopleOrganizationsCard {...imageProps} />
              </BrowserRouter>
            </LocalizationProvider>
          </I18nextProvider>
        </MockedProvider>
      </Provider>,
    );

    const image = screen.getByTestId('orgImage');
    expect(image).toBeInTheDocument();

    expect(image).toHaveAttribute('src', imageProps.image);

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('calls handleBlockUser on block user click', async () => {
    const beforeUserId = getItem('userId');

    setItem('userId', '1');
    const userProps = { ...defaultProps, blockedUsers: [{ _id: '2' }] };
    render(
      <Provider store={store}>
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <OrgPeopleOrganizationsCard {...userProps} />
              </BrowserRouter>
            </LocalizationProvider>
          </I18nextProvider>
        </MockedProvider>
      </Provider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('dropdown-status'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('block-item'));
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        translations.blockedSuccessfully,
      ),
    );
    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('unblocks user on block user click', async () => {
    const beforeUserId = getItem('userId');

    setItem('userId', '1');
    const userProps = { ...defaultProps, blockedUsers: [{ _id: '123' }] };
    render(
      <Provider store={store}>
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <OrgPeopleOrganizationsCard {...userProps} />
              </BrowserRouter>
            </LocalizationProvider>
          </I18nextProvider>
        </MockedProvider>
      </Provider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('dropdown-status'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('UnblockItem'));
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        translations.unBlockedSuccessfully,
      ),
    );
    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('calls addMember on add member click', async () => {
    const beforeUserId = getItem('userId');
    setItem('userId', '123');
    const userProps = { ...defaultProps, members: [{ _id: '2' }] };
    render(
      <Provider store={store}>
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <OrgPeopleOrganizationsCard {...userProps} />
              </BrowserRouter>
            </LocalizationProvider>
          </I18nextProvider>
        </MockedProvider>
      </Provider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('dropdown-member'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('accept-item'));
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        'Member added to the organization.',
      ),
    );

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('calls removeMember on remove member click', async () => {
    const beforeUserId = getItem('userId');
    setItem('userId', '123');

    const userProps = {
      ...defaultProps,
      members: [{ _id: '123' }],
      userId: '123',
    };

    render(
      <Provider store={store}>
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <OrgPeopleOrganizationsCard {...userProps} />
              </BrowserRouter>
            </LocalizationProvider>
          </I18nextProvider>
        </MockedProvider>
      </Provider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('dropdown-member'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('reject-item'));
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(translations.memberRemoved),
    );

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('should show error on adding a member who is already a member', async () => {
    const beforeUserId = getItem('userId');
    setItem('userId', '123');
    const userProps = { ...defaultProps, members: [{ _id: '123' }] };
    render(
      <Provider store={store}>
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <OrgPeopleOrganizationsCard {...userProps} />
              </BrowserRouter>
            </LocalizationProvider>
          </I18nextProvider>
        </MockedProvider>
      </Provider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('dropdown-member'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('accept-item'));
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'The user is already a member of this organization.',
      ),
    );

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('renders error of adding a blocked user', async () => {
    const beforeUserId = getItem('userId');
    setItem('userId', '123');

    const userProps = { ...defaultProps, blockedUsers: [{ _id: '123' }] };

    render(
      <Provider store={store}>
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <OrgPeopleOrganizationsCard {...userProps} />
              </BrowserRouter>
            </LocalizationProvider>
          </I18nextProvider>
        </MockedProvider>
      </Provider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('dropdown-member'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('accept-item'));
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(translations.blockedUser),
    );

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('renders error on removing a non member', async () => {
    const beforeUserId = getItem('userId');
    setItem('userId', '123');

    const userProps = { ...defaultProps, members: [], userId: '123' };

    render(
      <Provider store={store}>
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <OrgPeopleOrganizationsCard {...userProps} />
              </BrowserRouter>
            </LocalizationProvider>
          </I18nextProvider>
        </MockedProvider>
      </Provider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('dropdown-member'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('reject-item'));
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(translations.notMember),
    );

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test("renders error if can't remove a member", async () => {
    const beforeUserId = getItem('userId');

    const userProps = {
      ...defaultProps,
      members: [],
      admins: [],
      blockedUsers: [],
      userId: '123',
    };

    render(
      <Provider store={store}>
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <OrgPeopleOrganizationsCard {...userProps} />
              </BrowserRouter>
            </LocalizationProvider>
          </I18nextProvider>
        </MockedProvider>
      </Provider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('dropdown-member'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('reject-item'));
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(translations.notMember),
    );

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('displays error toast if mutation fails', async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={MOCKS_WITH_ERROR} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <OrgPeopleOrganizationsCard {...defaultProps} />
              </BrowserRouter>
            </LocalizationProvider>
          </I18nextProvider>
        </MockedProvider>
      </Provider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('dropdown-role'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('admin-item'));
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  test('displays error instance of Error if add member mutation fails', async () => {
    const errorInstance = new Error('Add member failed');
    const errorMemberProps = { ...defaultProps, members: [] };

    render(
      <Provider store={store}>
        <MockedProvider mocks={MOCKS_WITH_ERROR} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <OrgPeopleOrganizationsCard {...errorMemberProps} />
              </BrowserRouter>
            </LocalizationProvider>
          </I18nextProvider>
        </MockedProvider>
      </Provider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('dropdown-member'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('accept-item'));
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(errorInstance.message),
    );
  });

  test('updates role from user to admin', async () => {
    const beforeUserId = getItem('userId');
    const roleProps = {
      ...defaultProps,
      admins: [{ _id: '254' }],
      userId: '123',
      members: [{ _id: '123' }],
    };

    render(
      <Provider store={store}>
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <OrgPeopleOrganizationsCard {...roleProps} />
              </BrowserRouter>
            </LocalizationProvider>
          </I18nextProvider>
        </MockedProvider>
      </Provider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('dropdown-role'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('admin-item'));
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(translations.roleUpdated),
    );

    expect(screen.getByTestId('dropdown-role')).toHaveTextContent('ADMIN');

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('updates role from admin to user', async () => {
    const beforeUserId = getItem('userId');
    setItem('userId', '345');

    setItem('SuperAdmin', true);

    const roleProps = {
      ...defaultProps,
      admins: [{ _id: '345' }, { _id: '123' }],
      members: [{ _id: '123' }],
    };

    render(
      <Provider store={store}>
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <OrgPeopleOrganizationsCard {...roleProps} />
              </BrowserRouter>
            </LocalizationProvider>
          </I18nextProvider>
        </MockedProvider>
      </Provider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('dropdown-role'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('user-item'));
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(translations.roleUpdated),
    );

    expect(screen.getByTestId('dropdown-role')).toHaveTextContent('USER');

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });
});
