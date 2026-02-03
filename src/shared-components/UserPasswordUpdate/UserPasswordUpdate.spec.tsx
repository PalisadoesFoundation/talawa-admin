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
    newPassword: 'ThePalisadoesFoundation1!',
    wrongPassword: 'This is wrong password',
    confirmNewPassword: 'ThePalisadoesFoundation1!',
  };

  const onCancelMock = vi.fn();
  const onSuccessMock = vi.fn();

  global.alert = vi.fn();

  it('should render all fields in User Mode (requirePreviousPassword=true)', async () => {
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate onCancel={onCancelMock} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    expect(
      screen.getByPlaceholderText(/Previous Password/i),
    ).toBeInTheDocument();
    expect(
      screen.getAllByPlaceholderText(/New Password/i)[0],
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Confirm New Password/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Save Changes/i)).toBeTruthy();
    expect(screen.getByText(/Cancel/i)).toBeTruthy();
  });

  it('should NOT render Previous Password in Admin Mode (requirePreviousPassword=false)', async () => {
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate
            requirePreviousPassword={false}
            userId="admin-target-user-id"
            onCancel={onCancelMock}
          />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    expect(
      screen.queryByPlaceholderText(/Previous Password/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByPlaceholderText(/New Password/i)[0],
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Confirm New Password/i),
    ).toBeInTheDocument();
  });

  it('displays an error when the password field is empty', async () => {
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate onCancel={onCancelMock} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await userEvent.click(screen.getByText(/Save Changes/i));

    await wait();
    expect(NotificationToast.error).toHaveBeenCalledWith(
      `Password cannot be empty`,
    );
  });

  it('displays an error when new and confirm password field does not match', async () => {
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate onCancel={onCancelMock} />
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

    await wait();
    expect(NotificationToast.error).toHaveBeenCalledWith(
      'Passwords do not match',
    );
  });

  it('Successfully update old password and reset form (User Mode)', async () => {
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate
            onCancel={onCancelMock}
            onSuccess={onSuccessMock}
          />
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

    expect(onSuccessMock).toHaveBeenCalled();

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

  it('Successfully update password (Admin Mode)', async () => {
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate
            requirePreviousPassword={false}
            userId="admin-target-user-id"
            onCancel={onCancelMock}
            onSuccess={onSuccessMock}
          />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    const newPasswordInput = screen.getAllByPlaceholderText(/New Password/i)[0];
    const confirmPasswordInput =
      screen.getByPlaceholderText(/Confirm New Password/i);

    await userEvent.type(newPasswordInput, formData.newPassword);
    await userEvent.type(confirmPasswordInput, formData.confirmNewPassword);

    await userEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'Password updated Successfully',
      );
    });

    expect(onSuccessMock).toHaveBeenCalled();
  });

  it('wrong old password (User Mode)', async () => {
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate onCancel={onCancelMock} />
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
        'Invalid previous password',
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
            newPassword: 'ThePalisadoesFoundation1!',
            confirmNewPassword: 'ThePalisadoesFoundation1!',
          },
        },
        error: new Error('Network error'),
      },
    ];

    render(
      <MockedProvider mocks={networkErrorMock}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate onCancel={onCancelMock} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await userEvent.type(
      screen.getByPlaceholderText(/Previous Password/i),
      'NetworkErrorTest',
    );
    await userEvent.type(
      screen.getAllByPlaceholderText(/New Password/i)[0],
      'ThePalisadoesFoundation1!',
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Confirm New Password/i),
      'ThePalisadoesFoundation1!',
    );

    await userEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(
      () => {
        expect(NotificationToast.error).toHaveBeenCalledWith('Network error');
      },
      { timeout: 3000 },
    );
  });

  it('resets form and calls onCancel when cancel button is clicked', async () => {
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate onCancel={onCancelMock} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    const prevPasswordInput = screen.getByPlaceholderText(/Previous Password/i);
    const newPasswordInput = screen.getAllByPlaceholderText(/New Password/i)[0];
    const confirmPasswordInput =
      screen.getByPlaceholderText(/Confirm New Password/i);

    // Fill in the form
    await userEvent.type(prevPasswordInput, 'test1234');
    await userEvent.type(newPasswordInput, 'test4567');
    await userEvent.type(confirmPasswordInput, 'test4567');

    // Click cancel
    await userEvent.click(screen.getByText(/Cancel/i));

    expect(onCancelMock).toHaveBeenCalled();

    // Verify form fields are reset
    await waitFor(() => {
      expect(prevPasswordInput).toHaveValue('');
      expect(newPasswordInput).toHaveValue('');
      expect(confirmPasswordInput).toHaveValue('');
    });
  });
});
