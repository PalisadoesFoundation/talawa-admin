import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import UserPasswordUpdate from './UserPasswordUpdate';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast as mockToast } from 'react-toastify';
import { MOCKS } from './UserPasswordUpdateMocks';
import { vi } from 'vitest';
import { UPDATE_USER_PASSWORD_MUTATION } from 'GraphQl/Mutations/mutations';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
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
  const formData = {
    previousPassword: 'Palisadoes',
    newPassword: 'ThePalisadoesFoundation',
    wrongPassword: 'This is wrong password',
    confirmNewPassword: 'ThePalisadoesFoundation',
  };

  global.alert = vi.fn();

  it('should render props and text elements it for the page component', async () => {
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

  it('displays an error when the password field is empty', async () => {
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

  it('displays an error when new and confirm password field does not match', async () => {
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

  it('Successfully update old password', async () => {
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

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

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        'Password updated Successfully',
      );
    });

    await waitFor(
      () => {
        expect(mockReload).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  it('wrong old password', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate id="1" key="123" />
        </I18nextProvider>
      </MockedProvider>,
    );

    // await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Previous Password/i),
      formData.wrongPassword,
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

    await waitFor(() =>
      expect(mockToast.error).toHaveBeenCalledWith(
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
      <MockedProvider addTypename={false} mocks={networkErrorMock}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate id="1" key="123" />
        </I18nextProvider>
      </MockedProvider>,
    );

    userEvent.type(
      screen.getByPlaceholderText(/Previous Password/i),
      'NetworkErrorTest',
    );
    userEvent.type(
      screen.getAllByPlaceholderText(/New Password/i)[0],
      'ThePalisadoesFoundation',
    );
    userEvent.type(
      screen.getByPlaceholderText(/Confirm New Password/i),
      'ThePalisadoesFoundation',
    );

    userEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(
      () => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'ApolloError: Network error',
        );
      },
      { timeout: 3000 },
    );
  });

  it('reloads page when cancel button is clicked', async () => {
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    render(
      <MockedProvider addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <UserPasswordUpdate id="1" key="123" />
        </I18nextProvider>
      </MockedProvider>,
    );

    userEvent.click(screen.getByText(/Cancel/i));
    expect(mockReload).toHaveBeenCalled();
  });
});
