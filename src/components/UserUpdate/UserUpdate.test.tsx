import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import UserUpdate from './UserUpdate';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';

const MOCKS = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        user: {
          __typename: 'User',
          image: null,
          firstName: '',
          lastName: '',
          email: '',
          role: 'SUPERADMIN',
          appLanguageCode: 'en',
          userType: 'SUPERADMIN',
          pluginCreationAllowed: true,
          adminApproved: true,
          createdAt: '2023-02-18T09:22:27.969Z',
          adminFor: [],
          createdOrganizations: [],
          joinedOrganizations: [],
          organizationUserBelongsTo: null,
          organizationsBlockedBy: [],
          createdEvents: [],
          registeredEvents: [],
          eventAdmin: [],
          membershipRequests: [],
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_MUTATION,
      variable: {
        firstName: '',
        lastName: '',
        email: '',
      },
    },
    result: {
      data: {
        users: [
          {
            _id: '1',
          },
        ],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 5): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing User Update', () => {
  const props = {
    key: '123',
    id: '1',
    toggleStateValue: jest.fn(),
  };

  const formData = {
    firstName: 'Ansh',
    lastName: 'Goyal',
    email: 'ansh@gmail.com',
    image: new File(['hello'], 'hello.png', { type: 'image/png' }),
  };

  global.alert = jest.fn();

  test('should render props and text elements test for the page component', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <Router>
            <UserUpdate {...props} />
          </Router>
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/First Name/i),
      formData.firstName
    );
    userEvent.type(
      screen.getByPlaceholderText(/Last Name/i),
      formData.lastName
    );
    userEvent.type(screen.getByPlaceholderText(/Email/i), formData.email);
    userEvent.selectOptions(screen.getByTestId('applangcode'), 'Français');
    userEvent.upload(screen.getByLabelText(/Display Image:/i), formData.image);
    await wait();

    userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByPlaceholderText(/First Name/i)).toHaveValue(
      formData.firstName
    );
    expect(screen.getByPlaceholderText(/Last Name/i)).toHaveValue(
      formData.lastName
    );
    expect(screen.getByPlaceholderText(/Email/i)).toHaveValue(formData.email);

    expect(screen.getByText(/Cancel/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Display Image/i)).toBeInTheDocument();
  });
  test('should display warnings for blank form submission', async () => {
    jest.spyOn(toast, 'warning');

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <Router>
            <UserUpdate {...props} />
          </Router>
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByText(/Save Changes/i));

    expect(toast.warning).toHaveBeenCalledWith('First Name cannot be blank!');
    expect(toast.warning).toHaveBeenCalledWith('Last Name cannot be blank!');
    expect(toast.warning).toHaveBeenCalledWith('Email cannot be blank!');
  });
});
