import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useParams } from 'react-router';

import Security from './Security';
import {
  UPDATE_USER_PASSWORD,
  ADMIN_UPDATE_USER_PASSWORD,
} from 'GraphQl/Mutations/mutations';

import i18nForTest from 'utils/i18nForTest';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { validatePassword } from 'utils/passwordValidator';

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

const mockGetItem = vi.fn();

vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: mockGetItem,
  }),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('utils/passwordValidator', () => ({
  validatePassword: vi.fn(),
}));

interface InterfacePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  values: {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hidePreviousPassword: boolean;
}

vi.mock('shared-components/Auth/PasswordUpdate/PasswordUpdateModal', () => ({
  default: ({
    open,
    onClose,
    onSubmit,
    values,
    onChange,
    hidePreviousPassword,
  }: InterfacePasswordModalProps) =>
    open ? (
      <div data-testid="passwordModal">
        <input
          name="oldPassword"
          data-testid="oldPassword"
          value={values.oldPassword}
          onChange={onChange}
        />

        <input
          name="newPassword"
          data-testid="newPassword"
          value={values.newPassword}
          onChange={onChange}
        />

        <input
          name="confirmNewPassword"
          data-testid="confirmPassword"
          value={values.confirmNewPassword}
          onChange={onChange}
        />

        <button onClick={onSubmit}>submit</button>
        <button onClick={onClose}>close</button>

        <span data-testid="hidePrevious">
          {hidePreviousPassword ? 'true' : 'false'}
        </span>
      </div>
    ) : null,
}));

const renderSecurity = (mocks: MockedResponse[] = []) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <I18nextProvider i18n={i18nForTest}>
        <Security />
      </I18nextProvider>
    </MockedProvider>,
  );

describe('Security', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
    mockGetItem.mockReset();

    mockGetItem.mockImplementation((key: string) => {
      if (key === 'userId') return 'loggedInUser';
      return null;
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders change password button', () => {
      vi.mocked(useParams).mockReturnValue({});

      renderSecurity();

      expect(screen.getByTestId('changePasswordBtn')).toBeInTheDocument();
    });

    it('opens modal when button clicked', async () => {
      vi.mocked(useParams).mockReturnValue({});

      renderSecurity();

      await user.click(screen.getByTestId('changePasswordBtn'));

      expect(screen.getByTestId('passwordModal')).toBeInTheDocument();
    });

    it('treats user as admin when loggedInUserId is null', async () => {
      mockGetItem.mockImplementation(() => null);

      vi.mocked(useParams).mockReturnValue({ userId: 'otherUser' });

      renderSecurity();

      await user.click(screen.getByTestId('changePasswordBtn'));

      expect(screen.getByTestId('hidePrevious')).toHaveTextContent('true');
    });
  });

  describe('Form handling', () => {
    it('updates form fields on change', async () => {
      vi.mocked(useParams).mockReturnValue({});

      renderSecurity();

      await user.click(screen.getByTestId('changePasswordBtn'));

      await user.type(screen.getByTestId('newPassword'), 'abc123');

      expect(screen.getByTestId('newPassword')).toHaveValue('abc123');
    });

    it('closes modal and resets form', async () => {
      vi.mocked(useParams).mockReturnValue({});

      renderSecurity();

      await user.click(screen.getByTestId('changePasswordBtn'));

      await user.type(screen.getByTestId('newPassword'), '123');
      await user.click(screen.getByText('close'));

      expect(screen.queryByTestId('passwordModal')).not.toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('shows error when password empty', async () => {
      vi.mocked(useParams).mockReturnValue({});

      renderSecurity();

      await user.click(screen.getByTestId('changePasswordBtn'));

      await user.click(screen.getByText('submit'));

      expect(NotificationToast.error).toHaveBeenCalled();
    });

    it('shows error when passwords mismatch', async () => {
      vi.mocked(useParams).mockReturnValue({});

      renderSecurity();

      await user.click(screen.getByTestId('changePasswordBtn'));

      await user.type(screen.getByTestId('newPassword'), '123');
      await user.type(screen.getByTestId('confirmPassword'), '456');
      await user.click(screen.getByText('submit'));

      expect(NotificationToast.error).toHaveBeenCalled();
    });

    it('shows error when validator fails', async () => {
      vi.mocked(validatePassword).mockReturnValue(
        'passwordValidation.numberRequired',
      );

      vi.mocked(useParams).mockReturnValue({});

      renderSecurity();

      await user.click(screen.getByTestId('changePasswordBtn'));

      await user.type(screen.getByTestId('newPassword'), '123');
      await user.type(screen.getByTestId('confirmPassword'), '123');
      await user.click(screen.getByText('submit'));

      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  describe('User password update', () => {
    it('requires old password', async () => {
      vi.mocked(validatePassword).mockReturnValue(null);

      vi.mocked(useParams).mockReturnValue({});

      renderSecurity();

      await user.click(screen.getByTestId('changePasswordBtn'));

      await user.type(screen.getByTestId('newPassword'), '123');
      await user.type(screen.getByTestId('confirmPassword'), '123');
      await user.click(screen.getByText('submit'));

      expect(NotificationToast.error).toHaveBeenCalled();
    });

    it('updates password successfully', async () => {
      vi.mocked(validatePassword).mockReturnValue(null);

      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_USER_PASSWORD,
            variables: {
              input: {
                oldPassword: 'old123',
                newPassword: 'new123',
                confirmNewPassword: 'new123',
              },
            },
          },
          result: { data: { updateUserPassword: true } },
        },
      ];

      vi.mocked(useParams).mockReturnValue({});

      renderSecurity(mocks);

      await user.click(screen.getByTestId('changePasswordBtn'));

      await user.type(screen.getByTestId('oldPassword'), 'old123');
      await user.type(screen.getByTestId('newPassword'), 'new123');
      await user.type(screen.getByTestId('confirmPassword'), 'new123');
      await user.click(screen.getByText('submit'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });
    });
  });

  describe('Admin password update', () => {
    it('hides previous password', async () => {
      vi.mocked(useParams).mockReturnValue({ userId: 'otherUser' });

      renderSecurity();

      await user.click(screen.getByTestId('changePasswordBtn'));

      expect(screen.getByTestId('hidePrevious')).toHaveTextContent('true');
    });

    it('admin updates password successfully', async () => {
      vi.mocked(validatePassword).mockReturnValue(null);

      const mocks: MockedResponse[] = [
        {
          request: {
            query: ADMIN_UPDATE_USER_PASSWORD,
            variables: {
              input: {
                id: 'otherUser',
                newPassword: 'new123',
                confirmNewPassword: 'new123',
              },
            },
          },
          result: {
            data: {
              adminUpdateUserPassword: true,
            },
          },
        },
      ];

      vi.mocked(useParams).mockReturnValue({ userId: 'otherUser' });

      renderSecurity(mocks);

      await user.click(screen.getByTestId('changePasswordBtn'));

      await user.type(screen.getByTestId('newPassword'), 'new123');
      await user.type(screen.getByTestId('confirmPassword'), 'new123');
      await user.click(screen.getByText('submit'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });
    });
  });

  describe('Mutation errors', () => {
    it('shows error when mutation fails', async () => {
      vi.mocked(validatePassword).mockReturnValue(null);

      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_USER_PASSWORD,
            variables: {
              input: {
                oldPassword: 'old123',
                newPassword: 'new123',
                confirmNewPassword: 'new123',
              },
            },
          },
          error: new Error('Mutation failed'),
        },
      ];

      vi.mocked(useParams).mockReturnValue({});

      renderSecurity(mocks);

      await user.click(screen.getByTestId('changePasswordBtn'));

      await user.type(screen.getByTestId('oldPassword'), 'old123');
      await user.type(screen.getByTestId('newPassword'), 'new123');
      await user.type(screen.getByTestId('confirmPassword'), 'new123');
      await user.click(screen.getByText('submit'));

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith('Mutation failed');
      });
    });

    it('handles non-Error mutation failure gracefully', async () => {
      vi.mocked(validatePassword).mockReturnValue(null);

      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_USER_PASSWORD,
            variables: {
              input: {
                oldPassword: 'old123',
                newPassword: 'new123',
                confirmNewPassword: 'new123',
              },
            },
          },
          error: 'string-error' as unknown as Error,
        },
      ];

      vi.mocked(useParams).mockReturnValue({});

      renderSecurity(mocks);

      await user.click(screen.getByTestId('changePasswordBtn'));

      await user.type(screen.getByTestId('oldPassword'), 'old123');
      await user.type(screen.getByTestId('newPassword'), 'new123');
      await user.type(screen.getByTestId('confirmPassword'), 'new123');

      await user.click(screen.getByText('submit'));

      await waitFor(() => {
        expect(NotificationToast.error).not.toHaveBeenCalledWith(
          'string-error',
        );
      });
    });
  });
});
