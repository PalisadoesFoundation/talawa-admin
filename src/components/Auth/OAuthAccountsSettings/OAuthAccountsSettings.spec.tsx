import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OAuthAccountsSettings from './OAuthAccountsSettings';
import { formatDate } from 'utils/dateFormatter';
import i18nForTest from 'utils/i18nForTest';

const mockUseQuery = vi.hoisted(() => vi.fn());
const mockUseMutation = vi.hoisted(() => vi.fn());
const mockUseLocation = vi.hoisted(() => vi.fn());
const mockUseParams = vi.hoisted(() => vi.fn());
const mockUseLocalStorage = vi.hoisted(() => vi.fn());
const mockNotificationSuccess = vi.hoisted(() => vi.fn());
const mockNotificationError = vi.hoisted(() => vi.fn());
const enabledProvidersMock = vi.hoisted(() => [
  {
    id: 'GOOGLE',
    displayName: 'Google',
    scopes: ['openid', 'profile', 'email'],
    clientId: 'test-google-client-id',
    redirectUri: 'http://localhost/google/callback',
    enabled: true,
  },
  {
    id: 'GITHUB',
    displayName: 'GitHub',
    scopes: ['user:email'],
    clientId: 'test-github-client-id',
    redirectUri: 'http://localhost/github/callback',
    enabled: true,
  },
]);
const mockGetEnabledProviders = vi.hoisted(() =>
  vi.fn(() => enabledProvidersMock),
);
const linkedAtDate = dayjs().subtract(6, 'day').startOf('day').toISOString();
const lastUsedAtDate = dayjs().subtract(2, 'day').startOf('day').toISOString();
const oauthAccounts = [
  {
    provider: 'GOOGLE',
    email: 'google.user@example.com',
    linkedAt: linkedAtDate,
    lastUsedAt: lastUsedAtDate,
  },
  {
    provider: 'GITHUB',
    email: 'github.user@example.com',
    linkedAt: linkedAtDate,
    lastUsedAt: lastUsedAtDate,
  },
];
const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation?.OAuthAccountsSettings ??
      null,
  ),
);

vi.mock('@apollo/client', () => ({
  useQuery: mockUseQuery,
  useMutation: mockUseMutation,
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLocation: mockUseLocation,
    useParams: mockUseParams,
  };
});

vi.mock('utils/useLocalstorage', () => ({
  default: mockUseLocalStorage,
}));

vi.mock('config/oauthProviders', () => ({
  getEnabledProviders: mockGetEnabledProviders,
}));

vi.mock('components/Auth/OAuthButton/GoogleOAuthButton', () => ({
  default: ({ mode }: { mode: string }) => (
    <button data-testid="google-link-button" data-mode={mode} type="button">
      Google
    </button>
  ),
}));

vi.mock('components/Auth/OAuthButton/GitHubOAuthButton', () => ({
  default: ({ mode }: { mode: string }) => (
    <button data-testid="github-link-button" data-mode={mode} type="button">
      GitHub
    </button>
  ),
}));

vi.mock('shared-components/LoadingState/LoadingState', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="loading-state">{children}</div>
  ),
}));

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: mockNotificationSuccess,
    error: mockNotificationError,
  },
}));

describe('OAuthAccountsSettings', () => {
  const mockGetItem = vi.fn();
  const mockRefetch = vi.fn().mockResolvedValue(undefined);
  const mockUnlinkMutation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    mockUseLocation.mockReturnValue({ state: undefined });
    mockUseParams.mockReturnValue({});
    mockGetItem.mockReturnValue(null);
    mockUseLocalStorage.mockReturnValue({
      getItem: mockGetItem,
      setItem: vi.fn(),
      removeItem: vi.fn(),
      getStorageKey: vi.fn(),
      clearAllItems: vi.fn(),
    });

    mockUseQuery.mockReturnValue({
      data: { user: { oauthAccounts: [] } },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    });

    mockUnlinkMutation.mockResolvedValue({});
    mockUseMutation.mockReturnValue([mockUnlinkMutation]);
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
    vi.restoreAllMocks();
  });

  it('shows no user id message when no id can be resolved', () => {
    render(
      <I18nextProvider i18n={i18nForTest}>
        <OAuthAccountsSettings />
      </I18nextProvider>,
    );

    expect(
      screen.getByText(translations.userIdNotAvailable),
    ).toBeInTheDocument();
    expect(mockUseQuery).toHaveBeenCalledWith(expect.anything(), {
      variables: { input: { id: '' } },
      fetchPolicy: 'no-cache',
      skip: true,
    });
  });

  it('renders loading state', () => {
    mockUseParams.mockReturnValue({ userId: 'user-1' });
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
      refetch: mockRefetch,
    });

    render(
      <I18nextProvider i18n={i18nForTest}>
        <OAuthAccountsSettings />
      </I18nextProvider>,
    );

    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  it('renders query error state', () => {
    mockUseParams.mockReturnValue({ userId: 'user-2' });
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: new Error('query failed'),
      refetch: mockRefetch,
    });

    render(
      <I18nextProvider i18n={i18nForTest}>
        <OAuthAccountsSettings />
      </I18nextProvider>,
    );

    expect(
      screen.getByText(translations.unableToLoadOAuthAccounts),
    ).toBeInTheDocument();
  });

  it('renders both link buttons when no connected accounts exist', () => {
    mockUseLocation.mockReturnValue({ state: { id: 'state-user-id' } });

    render(
      <I18nextProvider i18n={i18nForTest}>
        <OAuthAccountsSettings />
      </I18nextProvider>,
    );

    expect(
      screen.getByText(translations.missingOauthProviders),
    ).toBeInTheDocument();
    expect(screen.getByTestId('google-link-button')).toHaveAttribute(
      'data-mode',
      'link',
    );
    expect(screen.getByTestId('github-link-button')).toHaveAttribute(
      'data-mode',
      'link',
    );
    expect(
      screen.getByText(translations.connectedOauthAccounts),
    ).toBeInTheDocument();
    expect(
      screen.getByText(translations.noConnectedOauthAccounts),
    ).toBeInTheDocument();

    expect(mockUseQuery).toHaveBeenCalledWith(expect.anything(), {
      variables: { input: { id: 'state-user-id' } },
      fetchPolicy: 'no-cache',
      skip: false,
    });
  });

  it('shows already linked message when both providers are connected', () => {
    mockUseParams.mockReturnValue({ userId: 'user-3' });
    mockUseQuery.mockReturnValue({
      data: {
        user: {
          oauthAccounts: oauthAccounts,
        },
      },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    });

    render(
      <I18nextProvider i18n={i18nForTest}>
        <OAuthAccountsSettings id="id-prop-ignored" />
      </I18nextProvider>,
    );

    expect(
      screen.getByText(translations.bothGoogleAndGitHubLinked),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('google-link-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('github-link-button')).not.toBeInTheDocument();
    expect(screen.getAllByText(translations.Unlink)).toHaveLength(2);
  });

  it('renders only GitHub link button when Google is connected (case-insensitive)', () => {
    mockGetItem.mockImplementation((key: string) => {
      if (key === 'id') return 'stored-id';
      return null;
    });
    mockUseQuery.mockReturnValue({
      data: {
        user: {
          oauthAccounts: oauthAccounts.filter(
            (account) => account.provider === 'GOOGLE',
          ),
        },
      },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    });

    render(
      <I18nextProvider i18n={i18nForTest}>
        <OAuthAccountsSettings />
      </I18nextProvider>,
    );

    expect(screen.queryByTestId('google-link-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('github-link-button')).toBeInTheDocument();
    expect(screen.getByText('GOOGLE')).toBeInTheDocument();
    expect(
      screen.getByText('Email: google.user@example.com'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Linked at: ${formatDate(linkedAtDate)}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Last used: ${formatDate(lastUsedAtDate)}`),
    ).toBeInTheDocument();
  });

  it('skips rendering a connected account entry when provider is missing', () => {
    mockUseParams.mockReturnValue({ userId: 'user-8' });
    mockUseQuery.mockReturnValue({
      data: {
        user: {
          oauthAccounts: [{ provider: undefined }],
        },
      },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    });

    render(
      <I18nextProvider i18n={i18nForTest}>
        <OAuthAccountsSettings />
      </I18nextProvider>,
    );

    expect(
      screen.getByText(translations.connectedOauthAccounts),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: translations.Unlink }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(translations.noConnectedOauthAccounts),
    ).not.toBeInTheDocument();
  });

  it('unlinks a provider and shows success toast', async () => {
    mockUseParams.mockReturnValue({ userId: 'user-4' });
    mockUseQuery.mockReturnValue({
      data: {
        user: {
          oauthAccounts: [oauthAccounts[0]],
        },
      },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    });

    render(
      <I18nextProvider i18n={i18nForTest}>
        <OAuthAccountsSettings />
      </I18nextProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: translations.Unlink }),
    );

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith(
        translations.unlinkConfirmation.replace('{{provider}}', 'GOOGLE'),
      );
      expect(mockUnlinkMutation).toHaveBeenCalledWith({
        variables: { provider: 'GOOGLE' },
      });
      expect(mockRefetch).toHaveBeenCalled();
      expect(mockNotificationSuccess).toHaveBeenCalledWith(
        'Successfully unlinked GOOGLE.',
      );
    });
  });

  it('does not unlink when confirmation is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    mockUseParams.mockReturnValue({ userId: 'user-7' });
    mockUseQuery.mockReturnValue({
      data: {
        user: {
          oauthAccounts: [oauthAccounts[0]],
        },
      },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    });

    render(
      <I18nextProvider i18n={i18nForTest}>
        <OAuthAccountsSettings />
      </I18nextProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: translations.Unlink }),
    );

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith(
        translations.unlinkConfirmation.replace('{{provider}}', 'GOOGLE'),
      );
      expect(mockUnlinkMutation).not.toHaveBeenCalled();
      expect(mockRefetch).not.toHaveBeenCalled();
      expect(mockNotificationSuccess).not.toHaveBeenCalled();
      expect(mockNotificationError).not.toHaveBeenCalled();
    });
  });

  it('shows thrown error message when unlink fails with Error', async () => {
    mockUseParams.mockReturnValue({ userId: 'user-5' });
    mockUseQuery.mockReturnValue({
      data: {
        user: {
          oauthAccounts: [oauthAccounts[0]],
        },
      },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    });
    mockUnlinkMutation.mockRejectedValue(new Error('unlink failed'));

    render(
      <I18nextProvider i18n={i18nForTest}>
        <OAuthAccountsSettings />
      </I18nextProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: translations.Unlink }),
    );

    await waitFor(() => {
      expect(mockNotificationError).toHaveBeenCalledWith('unlink failed');
    });
  });

  it('shows fallback error message when unlink fails with non-Error', async () => {
    mockUseParams.mockReturnValue({ userId: 'user-6' });
    mockUseQuery.mockReturnValue({
      data: {
        user: {
          oauthAccounts: [oauthAccounts[0]],
        },
      },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    });
    mockUnlinkMutation.mockRejectedValue('unknown error');

    render(
      <I18nextProvider i18n={i18nForTest}>
        <OAuthAccountsSettings />
      </I18nextProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: translations.Unlink }),
    );

    await waitFor(() => {
      expect(mockNotificationError).toHaveBeenCalledWith(
        'Failed to unlink GOOGLE.',
      );
    });
  });
});
