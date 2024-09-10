import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

import i18nForTest from 'utils/i18nForTest';
import { Provider } from 'react-redux';
import { MockedProvider } from '@apollo/react-testing';
import { store } from 'state/store';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { act } from 'react-dom/test-utils';
import { StaticMockLink } from 'utils/StaticMockLink';
import {
  LEAVE_ORGANIZATION,
  REVOKE_REFRESH_TOKEN,
} from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import LeaveConfirmModal, {
  InterfaceLeaveConfirmModalProps,
} from './LeaveConfirmModal';

const { setItem } = useLocalStorage();

const props: InterfaceLeaveConfirmModalProps = {
  show: true,
  onHide: jest.fn(),
  orgId: '123',
};

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

beforeEach(() => {
  setItem('FirstName', 'John');
  setItem('LastName', 'Doe');
  setItem(
    'UserImage',
    'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
  );
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

const MOCKS = [
  {
    request: {
      query: REVOKE_REFRESH_TOKEN,
    },
    result: {
      data: {
        revokeRefreshTokenForUser: true,
      },
    },
  },
  {
    request: {
      query: LEAVE_ORGANIZATION,
      variables: {
        organizationId: '2',
      },
    },
    result: {
      data: {
        leaveOrganization: {
          _id: 'edgwrgui4y28urfejwiwfw',
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: '123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '123',
            image: null,
            creator: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'JohnDoe@example.com',
            },
            name: 'Test Organization',
            description: 'Testing this organization',
            address: {
              city: 'Delhi',
              countryCode: 'IN',
              dependentLocality: 'Some Dependent Locality',
              line1: '123 Random Street',
              line2: 'Apartment 456',
              postalCode: '110001',
              sortingCode: 'ABC-123',
              state: 'Delhi',
            },
            userRegistrationRequired: true,
            visibleInSearch: true,
            members: [
              {
                _id: 'john123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'JohnDoe@example.com',
                createdAt: '4567890234',
              },
              {
                _id: 'jane123',
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'JaneDoe@example.com',
                createdAt: '4567890234',
              },
            ],
            admins: [
              {
                _id: 'john123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'JohnDoe@example.com',
                createdAt: '4567890234',
              },
            ],
            membershipRequests: [],
            blockedUsers: [],
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

describe('Testing LeaveConfirmModal for Leaving the organization', () => {
  test('Testing if the confirm button is working.', async () => {
    setItem('User', true);
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LeaveConfirmModal {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(screen.getByText(/People/i)).toBeInTheDocument();

    const peopelBtn = screen.getByTestId(/People/i);
    userEvent.click(peopelBtn);
    await wait();
    expect(window.location.pathname).toContain('user/people/123');
  });
});
