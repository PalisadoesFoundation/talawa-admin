import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import UserPasswordUpdate from './UserPasswordUpdate';
import { StaticMockLink } from 'utils/StaticMockLink';
import { MOCKS } from './UserPasswordUpdateMocks';
import { vi } from 'vitest';
import { UPDATE_USER_PASSWORD_MUTATION } from 'GraphQl/Mutations/mutations';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 5): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing User Password Update', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  const formData = {
    previousPassword: 'Palisadoes',
    newPassword: 'ThePalisadoesFoundation',
    wrongPassword: 'This is wrong password',
    confirmNewPassword: 'ThePalisadoesFoundation',
  };

  global.alert = vi.fn();

  it('should render props and text elements it for the page component', async () => {
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate id="1" key="123" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    await userEvent.type(
      screen.getByPlaceholderText(/Previous Password/i),
      formData.previousPassword,
    );
    await userEvent.type(
      screen.getAllByPlaceholderText(/New Password/i)[0],
      formData.newPassword,
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Confirm New Password/i),
      formData.confirmNewPassword,
    );

    await userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByText(/Cancel/i)).toBeTruthy();
    expect(
      screen.getByPlaceholderText(/Previous Password/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Confirm New Password/i),
    ).toBeInTheDocument();
  });

  it('displays an error when the password field is empty', async () => {
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate id="1" key="123" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await userEvent.click(screen.getByText(/Save Changes/i));

    await wait();
    expect(NotificationToast.error).toHaveBeenCalledWith(
      `Password can't be empty`,
    );
  });

  it('displays an error when new and confirm password field does not match', async () => {
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate id="1" key="123" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    await userEvent.type(
      screen.getByPlaceholderText(/Previous Password/i),
      formData.previousPassword,
    );
    await userEvent.type(
      screen.getAllByPlaceholderText(/New Password/i)[0],
      formData.wrongPassword,
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Confirm New Password/i),
      formData.confirmNewPassword,
    );

    await userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByText(/Cancel/i)).toBeTruthy();
    await wait();
    expect(NotificationToast.error).toHaveBeenCalledWith(
      'New and Confirm password do not match.',
    );
  });

  it('Successfully update old password and reset form', async () => {
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate id="1" key="123" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    const prevPasswordInput = screen.getByPlaceholderText(/Previous Password/i);
    const newPasswordInput = screen.getAllByPlaceholderText(/New Password/i)[0];
    const confirmPasswordInput =
      screen.getByPlaceholderText(/Confirm New Password/i);

    await userEvent.type(prevPasswordInput, formData.previousPassword);
    await userEvent.type(newPasswordInput, formData.newPassword);
    await userEvent.type(confirmPasswordInput, formData.confirmNewPassword);

    await userEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'Password updated Successfully',
      );
    });

    // Verify form fields are reset after successful update
    await waitFor(
      () => {
        expect(prevPasswordInput).toHaveValue('');
        expect(newPasswordInput).toHaveValue('');
        expect(confirmPasswordInput).toHaveValue('');
      },
      { timeout: 1000 },
    );
  });

  it('wrong old password', async () => {
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate id="1" key="123" />
        </I18nextProvider>
      </MockedProvider>,
    );

    // await wait();

    await userEvent.type(
      screen.getByPlaceholderText(/Previous Password/i),
      formData.wrongPassword,
    );
    await userEvent.type(
      screen.getAllByPlaceholderText(/New Password/i)[0],
      formData.newPassword,
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Confirm New Password/i),
      formData.confirmNewPassword,
    );

    await userEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() =>
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'ApolloError: Invalid previous password',
      ),
    );
  });

  it('network error', async () => {
    const networkErrorMock = [
      {
        request: {
          query: UPDATE_USER_PASSWORD_MUTATION,
          variables: {
            previousPassword: 'NetworkErrorTest',
            newPassword: 'ThePalisadoesFoundation',
            confirmNewPassword: 'ThePalisadoesFoundation',
          },
        },
        error: new Error('Network error'),
      },
    ];

    render(
      <MockedProvider mocks={networkErrorMock}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate id="1" key="123" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await userEvent.type(
      screen.getByPlaceholderText(/Previous Password/i),
      'NetworkErrorTest',
    );
    await userEvent.type(
      screen.getAllByPlaceholderText(/New Password/i)[0],
      'ThePalisadoesFoundation',
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Confirm New Password/i),
      'ThePalisadoesFoundation',
    );

    await userEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(
      () => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'ApolloError: Network error',
        );
      },
      { timeout: 3000 },
    );
  });

  it('resets form when cancel button is clicked', async () => {
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate id="1" key="123" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    const prevPasswordInput = screen.getByPlaceholderText(/Previous Password/i);
    const newPasswordInput = screen.getAllByPlaceholderText(/New Password/i)[0];
    const confirmPasswordInput =
      screen.getByPlaceholderText(/Confirm New Password/i);

    // Fill in the form
    await userEvent.type(prevPasswordInput, 'test123');
    await userEvent.type(newPasswordInput, 'test456');
    await userEvent.type(confirmPasswordInput, 'test456');

    // Verify fields have values
    expect(prevPasswordInput).toHaveValue('test123');
    expect(newPasswordInput).toHaveValue('test456');
    expect(confirmPasswordInput).toHaveValue('test456');

    // Click cancel
    await userEvent.click(screen.getByText(/Cancel/i));

    // Verify form fields are reset
    await waitFor(() => {
      expect(prevPasswordInput).toHaveValue('');
      expect(newPasswordInput).toHaveValue('');
      expect(confirmPasswordInput).toHaveValue('');
    });
  });
});
