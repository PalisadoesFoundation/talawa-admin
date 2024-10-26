import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { UPDATE_USER_PASSWORD_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import UserPasswordUpdate from './UserPasswordUpdate';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast as mockToast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const MOCKS = [
  {
    request: {
      query: UPDATE_USER_PASSWORD_MUTATION,
      variables: {
        previousPassword: 'anshgoyal',
        newPassword: 'anshgoyalansh',
        confirmNewPassword: 'anshgoyalansh',
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

describe('Testing User Password Update', () => {
  const formData = {
    previousPassword: 'Palisadoes',
    newPassword: 'ThePalisadoesFoundation',
    wrongPassword: 'This is wrong password',
    confirmNewPassword: 'ThePalisadoesFoundation',
  };

  global.alert = jest.fn();

  test('should render props and text elements test for the page component', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate id="1" key="123" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Previous Password/i),
      formData.previousPassword,
    );
    userEvent.type(
      screen.getAllByPlaceholderText(/New Password/i)[0],
      formData.newPassword,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Confirm New Password/i),
      formData.confirmNewPassword,
    );

    userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByText(/Cancel/i)).toBeTruthy();
    expect(
      screen.getByPlaceholderText(/Previous Password/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Confirm New Password/i),
    ).toBeInTheDocument();
  });

  test('displays an error when the password field is empty', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate id="1" key="123" />
        </I18nextProvider>
      </MockedProvider>,
    );

    userEvent.click(screen.getByText(/Save Changes/i));

    await wait();
    expect(mockToast.error).toHaveBeenCalledWith(`Password can't be empty`);
  });

  test('displays an error when new and confirm password field does not match', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate id="1" key="123" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Previous Password/i),
      formData.previousPassword,
    );
    userEvent.type(
      screen.getAllByPlaceholderText(/New Password/i)[0],
      formData.wrongPassword,
    );
    userEvent.type(
      screen.getByPlaceholderText(/Confirm New Password/i),
      formData.confirmNewPassword,
    );

    userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByText(/Cancel/i)).toBeTruthy();
    await wait();
    expect(mockToast.error).toHaveBeenCalledWith(
      'New and Confirm password do not match.',
    );
  });
});
