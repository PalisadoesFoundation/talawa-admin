import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { OAuthSection } from './OAuthSection';
import { vi, describe, it, expect, afterEach } from 'vitest';

const mockOAuthProviders = vi.hoisted(
  () =>
    ({
      GOOGLE: { enabled: true },
      GITHUB: { enabled: true },
    }) as Record<string, { enabled: boolean }>,
);

// Mock child OAuth buttons to keep this a unit test
vi.mock('../OAuthButton/GoogleOAuthButton', () => ({
  default: ({ mode }: { mode: string }) => (
    <button data-testid="google-oauth-button" data-mode={mode} type="button">
      Google
    </button>
  ),
}));

vi.mock('../OAuthButton/GitHubOAuthButton', () => ({
  default: ({ mode }: { mode: string }) => (
    <button data-testid="github-oauth-button" data-mode={mode} type="button">
      GitHub
    </button>
  ),
}));

vi.mock('config/oauthProviders', () => ({
  OAUTH_PROVIDERS: mockOAuthProviders,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

afterEach(() => {
  mockOAuthProviders.GOOGLE.enabled = true;
  mockOAuthProviders.GITHUB.enabled = true;
  delete mockOAuthProviders.UNKNOWN;
  vi.restoreAllMocks();
  cleanup();
});

describe('OAuthSection', () => {
  // Smoke test
  it('renders without crashing', () => {
    render(<OAuthSection mode="login" />);
    expect(screen.getByTestId('google-oauth-button')).toBeInTheDocument();
    expect(screen.getByTestId('github-oauth-button')).toBeInTheDocument();
  });

  // Divider
  it('renders the translated divider text', () => {
    render(<OAuthSection mode="login" />);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  // Both child buttons are rendered
  it('renders the Google OAuth button', () => {
    render(<OAuthSection mode="login" />);
    expect(screen.getByTestId('google-oauth-button')).toBeInTheDocument();
  });

  it('renders the GitHub OAuth button', () => {
    render(<OAuthSection mode="login" />);
    expect(screen.getByTestId('github-oauth-button')).toBeInTheDocument();
  });

  it('renders only the GitHub button when Google is disabled', () => {
    mockOAuthProviders.GOOGLE.enabled = false;

    render(<OAuthSection mode="login" />);

    expect(screen.queryByTestId('google-oauth-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('github-oauth-button')).toBeInTheDocument();
  });

  it('renders only the Google button when GitHub is disabled', () => {
    mockOAuthProviders.GITHUB.enabled = false;

    render(<OAuthSection mode="login" />);

    expect(screen.getByTestId('google-oauth-button')).toBeInTheDocument();
    expect(screen.queryByTestId('github-oauth-button')).not.toBeInTheDocument();
  });

  it('renders nothing when all OAuth providers are disabled', () => {
    mockOAuthProviders.GOOGLE.enabled = false;
    mockOAuthProviders.GITHUB.enabled = false;

    const { container } = render(<OAuthSection mode="login" />);

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText('OR')).not.toBeInTheDocument();
  });

  it('ignores enabled providers without a matching button component', () => {
    mockOAuthProviders.UNKNOWN = { enabled: true };

    render(<OAuthSection mode="login" />);

    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByTestId('google-oauth-button')).toBeInTheDocument();
    expect(screen.getByTestId('github-oauth-button')).toBeInTheDocument();
  });

  // Mode forwarding — login
  it('passes mode="login" to both child buttons', () => {
    render(<OAuthSection mode="login" />);
    expect(screen.getByTestId('google-oauth-button')).toHaveAttribute(
      'data-mode',
      'login',
    );
    expect(screen.getByTestId('github-oauth-button')).toHaveAttribute(
      'data-mode',
      'login',
    );
  });

  // Mode forwarding — register
  it('passes mode="register" to both child buttons', () => {
    render(<OAuthSection mode="register" />);
    expect(screen.getByTestId('google-oauth-button')).toHaveAttribute(
      'data-mode',
      'register',
    );
    expect(screen.getByTestId('github-oauth-button')).toHaveAttribute(
      'data-mode',
      'register',
    );
  });

  // Mode forwarding — link
  it('passes mode="link" to both child buttons', () => {
    render(<OAuthSection mode="link" />);
    expect(screen.getByTestId('google-oauth-button')).toHaveAttribute(
      'data-mode',
      'link',
    );
    expect(screen.getByTestId('github-oauth-button')).toHaveAttribute(
      'data-mode',
      'link',
    );
  });

  // Both buttons rendered together
  it('renders exactly two OAuth buttons', () => {
    render(<OAuthSection mode="login" />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });
});
