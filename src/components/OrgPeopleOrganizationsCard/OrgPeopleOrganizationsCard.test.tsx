import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import OrgPeopleOrganizationsCard from './OrgPeopleOrganizationsCard';
import {
  ADD_MEMBER_MUTATION,
  BLOCK_USER_MUTATION,
  REMOVE_MEMBER_MUTATION,
  UNBLOCK_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { BrowserRouter } from 'react-router-dom';
import { StaticMockLink } from 'utils/StaticMockLink';
import useLocalStorage from 'utils/useLocalstorage';
import { toast } from 'react-toastify';

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
];
const link = new StaticMockLink(MOCKS, true);
const { getItem, setItem } = useLocalStorage();

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Testing Organization People Card', () => {
  const props = {
    toggleRemoveModal: () => true,
    id: '1',
    userId: '123',
    _id: 'orgid',
    image: '',
    name: 'OrgName',
    description: 'OrgDescription',
    blockedUsers: [],
    members: [],
    admins: [],
    resetAndRefetch: () => jest.fn(),
  };
  global.alert = jest.fn();

  test('Should render components properly', async () => {
    global.confirm = (): boolean => true;

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleOrganizationsCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId(/dropdown-role/i));
  });

  test('Should update role to admin of user on click in dropdown', async () => {
    const roleProps = {
      toggleRemoveModal: () => true,
      id: '1',
      userId: '123',
      _id: 'orgid',
      image: '',
      name: 'OrgName',
      description: 'OrgDescription',
      blockedUsers: [],
      members: [{ _id: '123' }],
      admins: [],
      resetAndRefetch: () => jest.fn(),
    };
    const beforeUserId = getItem('userId');
    setItem('userId', '1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleOrganizationsCard {...roleProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId(/dropdown-role/i));
    await wait();
    userEvent.click(screen.getByTestId(/admin-item/i));
    await wait();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    await wait();
    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Should throw error on update role to user if not able to update', async () => {
    const roleProps = {
      toggleRemoveModal: () => true,
      id: '1',
      userId: '123',
      _id: 'orgid',
      image: '',
      name: 'OrgName',
      description: 'OrgDescription',
      blockedUsers: [],
      members: [{ _id: '123' }],
      admins: [],
      resetAndRefetch: () => jest.fn(),
    };
    const beforeUserId = getItem('userId');
    setItem('userId', '1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleOrganizationsCard {...roleProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId(/dropdown-role/i));
    await wait();
    userEvent.click(screen.getByTestId(/user-item/i));
    await wait();

    expect(toast.error).toHaveBeenCalled();

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Should update role to user of admin on click in dropdown', async () => {
    const roleProps = {
      toggleRemoveModal: () => true,
      id: '1',
      userId: '123',
      _id: 'orgid',
      image: '',
      name: 'OrgName',
      description: 'OrgDescription',
      blockedUsers: [],
      members: [{ _id: '123' }],
      admins: [{ _id: '123' }],
      resetAndRefetch: () => jest.fn(),
    };
    const beforeUserId = getItem('userId');
    setItem('userId', '1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleOrganizationsCard {...roleProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId(/dropdown-role/i));
    await wait();
    userEvent.click(screen.getByTestId(/user-item/i));
    await wait();

    expect(screen.getByText('User')).toBeInTheDocument();
    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Should throw error on update role to admin if not able to update', async () => {
    const roleProps = {
      toggleRemoveModal: () => true,
      id: '1',
      userId: '123',
      _id: 'orgid',
      image: '',
      name: 'OrgName',
      description: 'OrgDescription',
      blockedUsers: [],
      members: [{ _id: '123' }],
      admins: [],
      resetAndRefetch: () => jest.fn(),
    };
    const beforeUserId = getItem('userId');
    setItem('userId', '1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleOrganizationsCard {...roleProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId(/dropdown-role/i));
    await wait();
    userEvent.click(screen.getByTestId(/admin-item/i));
    await wait();

    expect(toast.error).toHaveBeenCalled();

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Should add member on click in dropdown if not member', async () => {
    const memberProps = {
      toggleRemoveModal: () => true,
      id: '1',
      userId: '123',
      _id: 'orgid',
      image: '',
      name: 'OrgName',
      description: 'OrgDescription',
      blockedUsers: [],
      members: [],
      admins: [],
      resetAndRefetch: () => jest.fn(),
    };
    const beforeUserId = getItem('userId');
    setItem('userId', '1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleOrganizationsCard {...memberProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.getByText('No')).toBeInTheDocument();
    await wait();
    userEvent.click(screen.getByTestId(/dropdown-member/i));
    await wait();
    userEvent.click(screen.getByTestId(/accept-item/i));
    await wait();

    const dropdown = screen.getByTestId('dropdown-member');
    expect(dropdown.innerHTML).toMatch(/Yes/i);

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Should throw error on add member user if not able to add', async () => {
    const roleProps = {
      toggleRemoveModal: () => true,
      id: '1',
      userId: '123',
      _id: 'orgid',
      image: '',
      name: 'OrgName',
      description: 'OrgDescription',
      blockedUsers: [{ _id: '123' }],
      members: [],
      admins: [],
      resetAndRefetch: () => jest.fn(),
    };
    const beforeUserId = getItem('userId');
    setItem('userId', '1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleOrganizationsCard {...roleProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId(/dropdown-member/i));
    await wait();
    userEvent.click(screen.getByTestId(/accept-item/i));
    await wait();

    expect(toast.error).toHaveBeenCalled();

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Should remove member on click in dropdown if member', async () => {
    const memberProps = {
      toggleRemoveModal: () => true,
      id: '1',
      userId: '123',
      _id: 'orgid',
      image: '',
      name: 'OrgName',
      description: 'OrgDescription',
      blockedUsers: [],
      members: [{ _id: '123' }],
      admins: [],
      resetAndRefetch: () => jest.fn(),
    };
    const beforeUserId = getItem('userId');
    setItem('userId', '1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleOrganizationsCard {...memberProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.getByText('Yes')).toBeInTheDocument();

    await wait();
    userEvent.click(screen.getByTestId(/dropdown-member/i));
    await wait();
    userEvent.click(screen.getByTestId(/reject-item/i));
    await wait();

    const dropdown = screen.getByTestId('dropdown-member');
    expect(dropdown.innerHTML).toMatch(/No/i);

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Should throw error on remove member user if not able to remove', async () => {
    const roleProps = {
      toggleRemoveModal: () => true,
      id: '1',
      userId: '123',
      _id: 'orgid',
      image: '',
      name: 'OrgName',
      description: 'OrgDescription',
      blockedUsers: [{ _id: '123' }],
      members: [],
      admins: [],
      resetAndRefetch: () => jest.fn(),
    };
    const beforeUserId = getItem('userId');
    setItem('userId', '1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleOrganizationsCard {...roleProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId(/dropdown-member/i));
    await wait();
    userEvent.click(screen.getByTestId(/reject-item/i));
    await wait();

    expect(toast.error).toHaveBeenCalled();

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Should block user on click in dropdown if member', async () => {
    const roleProps = {
      toggleRemoveModal: () => true,
      id: '1',
      userId: '123',
      _id: 'orgid',
      image: '',
      name: 'OrgName',
      description: 'OrgDescription',
      blockedUsers: [],
      members: [{ _id: '123' }],
      admins: [],
      resetAndRefetch: () => jest.fn(),
    };
    const beforeUserId = getItem('userId');
    setItem('userId', '1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleOrganizationsCard {...roleProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId(/dropdown-status/i));
    await wait();
    userEvent.click(screen.getByTestId(/block-item/i));
    await wait();
    const dropdown = screen.getByTestId('dropdown-status');
    expect(dropdown.innerHTML).toMatch(/Blocked/i);
    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Should throw error on block user if not able to block', async () => {
    const roleProps = {
      toggleRemoveModal: () => true,
      id: '1',
      userId: '123',
      _id: 'orgid',
      image: '',
      name: 'OrgName',
      description: 'OrgDescription',
      blockedUsers: [{ _id: '123' }],
      members: [],
      admins: [],
      resetAndRefetch: () => jest.fn(),
    };
    const beforeUserId = getItem('userId');
    setItem('userId', '1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleOrganizationsCard {...roleProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId(/dropdown-status/i));
    await wait();
    userEvent.click(screen.getByTestId(/block-item/i));
    await wait();

    expect(toast.error).toHaveBeenCalled();

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Should unblock user on click in dropdown if blocked', async () => {
    const roleProps = {
      toggleRemoveModal: () => true,
      id: '1',
      userId: '123',
      _id: 'orgid',
      image: '',
      name: 'OrgName',
      description: 'OrgDescription',
      blockedUsers: [{ _id: '123' }],
      members: [],
      admins: [],
      resetAndRefetch: () => jest.fn(),
    };
    const beforeUserId = getItem('userId');
    setItem('userId', '1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleOrganizationsCard {...roleProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId(/dropdown-status/i));
    await wait();
    userEvent.click(screen.getByTestId(/UnblockItem/i));
    await wait();
    const dropdown = screen.getByTestId('dropdown-status');
    expect(dropdown.innerHTML).toMatch(/Active/i);

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Should throw error on add user if user is blocked', async () => {
    const memberProps = {
      toggleRemoveModal: () => true,
      id: '1',
      userId: '123',
      _id: 'orgid',
      image: '',
      name: 'OrgName',
      description: 'OrgDescription',
      blockedUsers: [{ _id: '123' }],
      members: [],
      admins: [],
      resetAndRefetch: () => jest.fn(),
    };
    const beforeUserId = getItem('userId');
    setItem('userId', '1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgPeopleOrganizationsCard {...memberProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getByTestId(/dropdown-member/i));
    await wait();
    userEvent.click(screen.getByTestId(/accept-item/i));
    await wait();

    expect(toast.error).toHaveBeenCalled();

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });
  
});
