import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';

import { UPDATE_USER_PASSWORD_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import UserPasswordUpdate from './UserPasswordUpdate';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';

const MOCKS = [
  {
    request: {
      query: UPDATE_USER_PASSWORD_MUTATION,
      variable: {
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

async function wait(ms = 5) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing User Password Update', () => {
  const props = {
    key: '123',
    id: '1',
  };

  const formData = {
    previousPassword: 'anshgoyal',
    newPassword: 'anshgoyalansh',
    confirmNewPassword: 'anshgoyalansh',
  };

  global.alert = jest.fn();

  // Mock the toast function
  jest.mock('react-toastify', () => ({
    toast: {
      error: jest.fn(),
    },
  }));

  test('should render props and text elements test for the page component', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Previous Password/i),
      formData.previousPassword
    );
    userEvent.type(
      screen.getAllByPlaceholderText(/New Password/i)[0],
      formData.newPassword
    );
    userEvent.type(
      screen.getByPlaceholderText(/Confirm New Password/i),
      formData.confirmNewPassword
    );

    userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByText(/Cancel/i)).toBeTruthy();
    expect(
      screen.getByPlaceholderText(/Previous Password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Confirm New Password/i)
    ).toBeInTheDocument();
  });

  it('displays an error toast if form fields are empty', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    const previousPasswordField =
      screen.getByPlaceholderText(/Previous Password/i);
    const newPasswordField = screen.getAllByPlaceholderText(/New Password/i)[0];
    const confirmNewPasswordField =
      screen.getByPlaceholderText(/Confirm New Password/i);

    // Mock toast.error
    const errorMock = jest.fn();
    jest.spyOn(toast, 'error').mockImplementation(errorMock);

    // Act
    fireEvent.change(previousPasswordField, { target: { value: '' } });
    fireEvent.change(newPasswordField, { target: { value: '' } });
    fireEvent.change(confirmNewPasswordField, { target: { value: '' } });
    const saveChangesButton = screen.getByText(/Save Changes/i);
    fireEvent.click(saveChangesButton);

    // Wait for toast to appear
    await waitFor(() => expect(errorMock).toHaveBeenCalledTimes(1));

    // Assert
    expect(errorMock).toHaveBeenCalledWith(
      'The password field cannot be empty.'
    );
  });

  it('displays an error toast if New and Confirm password do not match.', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    const previousPasswordField =
      screen.getByPlaceholderText(/Previous Password/i);
    const newPasswordField = screen.getAllByPlaceholderText(/New Password/i)[0];
    const confirmNewPasswordField =
      screen.getByPlaceholderText(/Confirm New Password/i);

    // Mock toast.error
    const errorMock = jest.fn();
    jest.spyOn(toast, 'error').mockImplementation(errorMock);

    // Act
    fireEvent.change(previousPasswordField, { target: { value: 'password' } });
    fireEvent.change(newPasswordField, { target: { value: 'newpassword' } });
    fireEvent.change(confirmNewPasswordField, {
      target: { value: 'newpassword123' },
    });
    const saveChangesButton = screen.getByText(/Save Changes/i);
    fireEvent.click(saveChangesButton);

    // Wait for toast to appear
    await waitFor(() => expect(errorMock).toHaveBeenCalledTimes(1));

    // Assert
    expect(errorMock).toHaveBeenCalledWith(
      'New and Confirm password do not match.'
    );
  });
});


