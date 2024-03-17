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
        userId: '1',
      },
    },
    result: {
      data: {
        user: {
          __typename: 'UserData',
          appUserProfile: {
            __typename: 'AppUserProfile',
            _id: '1',
            adminFor: [
              { __typename: 'Organization', _id: '65e0df0906dd1228350cfd4a' },
              { __typename: 'Organization', _id: '65e0e2abb92c9f3e29503d4e' },
            ],
            createdEvents: [
              { __typename: 'Event', _id: '65e32a5b2a1f4288ca1f086a' },
            ],
            eventAdmin: [
              { __typename: 'Event', _id: '65e32a5b2a1f4288ca1f086a' },
            ],
            createdOrganizations: [
              { __typename: 'Organization', _id: '65e0df0906dd1228350cfd4a' },
              { __typename: 'Organization', _id: '65e0e2abb92c9f3e29503d4e' },
            ],
            pluginCreationAllowed: true,
            appLanguageCode: 'fr',
            isSuperAdmin: true,
          },
          user: {
            __typename: 'User',
            _id: '1',
            firstName: 'Aditya',
            lastName: 'Agarwal',
            createdAt: '2024-02-26T10:36:33.098Z',
            image: null,
            email: 'adi79@gmail.com',
            adminApproved: true,
            joinedOrganizations: [
              { __typename: 'Organization', _id: '65e0df0906dd1228350cfd4a' },
              { __typename: 'Organization', _id: '65e0e2abb92c9f3e29503d4e' },
            ],
            membershipRequests: [],
            registeredEvents: [
              { __typename: 'Event', _id: '65e32a5b2a1f4288ca1f086a' },
            ],
            organizationsBlockedBy: [],
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_MUTATION,
      variable: {
        data: {
          firstName: 'Adi',
          lastName: 'Agarwal',
          email: 'adi79@gmail.com',
          appLanguageCode: 'en',
        },
        file: null,
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
    firstName: 'Adi',
    lastName: 'Agarwal',
    email: 'adi79@gmail.com',
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

    userEvent.clear(screen.getByPlaceholderText(/First Name/i));

    userEvent.type(
      screen.getByPlaceholderText(/First Name/i),
      formData.firstName
    );

    userEvent.clear(screen.getByPlaceholderText(/Last Name/i));

    userEvent.type(
      screen.getByPlaceholderText(/Last Name/i),
      formData.lastName
    );

    userEvent.clear(screen.getByPlaceholderText(/Email/i));

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

    userEvent.clear(screen.getByPlaceholderText(/First Name/i));
    userEvent.clear(screen.getByPlaceholderText(/Last Name/i));
    userEvent.clear(screen.getByPlaceholderText(/Email/i));

    userEvent.click(screen.getByText(/Save Changes/i));

    expect(toast.warning).toHaveBeenCalledWith('First Name cannot be blank!');
    expect(toast.warning).toHaveBeenCalledWith('Last Name cannot be blank!');
    expect(toast.warning).toHaveBeenCalledWith('Email cannot be blank!');
  });
});
