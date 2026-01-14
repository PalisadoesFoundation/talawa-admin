import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { I18nextProvider } from 'react-i18next';

import i18nForTest from 'utils/i18nForTest';
import OrganizationCard from './OrganizationCard';

const mockMutationFn = vi.fn().mockResolvedValue({ data: {} });

vi.mock('@apollo/client', async () => {
  const actual =
    await vi.importActual<typeof import('@apollo/client')>('@apollo/client');
  return {
    ...actual,
    useMutation: () => [mockMutationFn, { loading: false, error: undefined }],
  };
});

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const baseProps = {
  id: 'org-1',
  name: 'Test Organization',
  description: 'Organization description',
  addressLine1: 'Test Address',
  role: 'MEMBER',
  membersCount: 10,
  adminsCount: 2,
  isJoined: false,
  membershipRequestStatus: '',
  membershipRequests: [],
};

const renderWithI18n = (ui: React.ReactElement) =>
  render(<I18nextProvider i18n={i18nForTest}>{ui}</I18nextProvider>);

describe('OrganizationCard [PR-2]', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders organization content', () => {
    renderWithI18n(<OrganizationCard {...baseProps} />);

    expect(screen.getByText('Test Organization')).toBeInTheDocument();
    expect(screen.getByText('Organization description')).toBeInTheDocument();
    expect(screen.getByText('Test Address')).toBeInTheDocument();
  });

  it('renders admins and members counts', () => {
    renderWithI18n(<OrganizationCard {...baseProps} />);
    expect(
      screen.getByText(new RegExp(`Admins\\s*:\\s*${baseProps.adminsCount}`)),
    ).toBeInTheDocument();

    expect(
      screen.getByText(new RegExp(`Members\\s*:\\s*${baseProps.membersCount}`)),
    ).toBeInTheDocument();
  });

  it('shows Join button when not joined', () => {
    renderWithI18n(<OrganizationCard {...baseProps} />);

    expect(screen.getByTestId('joinBtn')).toBeInTheDocument();
  });

  it('shows Withdraw button when request is pending', () => {
    renderWithI18n(
      <OrganizationCard
        {...baseProps}
        membershipRequestStatus="pending"
        membershipRequests={[{ id: 'req-1', user: { id: 'u1' } }]}
      />,
    );

    expect(screen.getByTestId('withdrawBtn')).toBeInTheDocument();
  });

  it('shows Visit button when joined', () => {
    renderWithI18n(<OrganizationCard {...baseProps} isJoined />);

    expect(screen.getByTestId('manageBtn')).toBeInTheDocument();
  });

  it('calls mutation and shows success toast on join click', async () => {
    renderWithI18n(<OrganizationCard {...baseProps} />);

    fireEvent.click(screen.getByTestId('joinBtn'));

    await waitFor(() => {
      expect(mockMutationFn).toHaveBeenCalledWith({
        variables: { organizationId: 'org-1' },
      });
    });

    expect(NotificationToast.success).toHaveBeenCalledWith(
      i18nForTest.t('organizationCard.join_success'),
    );
  });

  it('calls mutation and shows success toast on withdraw click', async () => {
    renderWithI18n(
      <OrganizationCard
        {...baseProps}
        membershipRequestStatus="pending"
        membershipRequests={[{ id: 'req-1', user: { id: 'u1' } }]}
      />,
    );

    fireEvent.click(screen.getByTestId('withdrawBtn'));

    await waitFor(() => {
      expect(mockMutationFn).toHaveBeenCalledWith({
        variables: {
          membershipRequestId: 'req-1',
        },
      });
    });

    expect(NotificationToast.success).toHaveBeenCalledWith(
      i18nForTest.t('organizationCard.withdraw_success'),
    );
  });

  it('shows error toast when withdraw mutation fails', async () => {
    mockMutationFn.mockRejectedValueOnce(new Error('Mutation failed'));

    renderWithI18n(
      <OrganizationCard
        {...baseProps}
        membershipRequestStatus="pending"
        membershipRequests={[{ id: 'req-1', user: { id: 'u1' } }]}
      />,
    );

    fireEvent.click(screen.getByTestId('withdrawBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        i18nForTest.t('organizationCard.withdraw_error'),
      );
    });
  });

  it('shows error toast when join mutation fails', async () => {
    mockMutationFn.mockRejectedValueOnce(new Error('Mutation failed'));

    renderWithI18n(<OrganizationCard {...baseProps} />);

    fireEvent.click(screen.getByTestId('joinBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        i18nForTest.t('organizationCard.join_error'),
      );
    });
  });

  it('does not call mutation when withdraw clicked but no pending request exists', async () => {
    renderWithI18n(
      <OrganizationCard
        {...baseProps}
        membershipRequestStatus="pending"
        membershipRequests={[]}
      />,
    );

    fireEvent.click(screen.getByTestId('withdrawBtn'));

    await waitFor(() => {
      expect(mockMutationFn).not.toHaveBeenCalled();
    });

    expect(NotificationToast.success).not.toHaveBeenCalled();
    expect(NotificationToast.error).not.toHaveBeenCalled();
  });

  it('renders with default values when optional props are missing', () => {
    const minimalProps = {
      id: 'org-minimal',
      name: 'Minimal Org',
      description: 'Desc',
      addressLine1: 'Address',
      role: 'MEMBER',
      membersCount: 5,
      adminsCount: 1,
    };
    renderWithI18n(<OrganizationCard {...minimalProps} />);
    expect(screen.getByTestId('joinBtn')).toBeInTheDocument();
    expect(screen.queryByTestId('withdrawBtn')).toBeNull();
  });
});
