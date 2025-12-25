import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { describe, it, expect, vi, afterEach } from 'vitest';
import { toast } from 'react-toastify';

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

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, fallback?: string | { defaultValue: string }) =>
      typeof fallback === 'string'
        ? fallback
        : (fallback?.defaultValue ?? _key),
  }),
}));

vi.mock('react-toastify', () => ({
  toast: {
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

describe('OrganizationCard [PR-2]', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders organization content', () => {
    render(<OrganizationCard {...baseProps} />);

    expect(screen.getByText('Test Organization')).toBeInTheDocument();
    expect(screen.getByText('Organization description')).toBeInTheDocument();
    expect(screen.getByText('Test Address')).toBeInTheDocument();
  });

  it('renders admins and members counts', () => {
    render(<OrganizationCard {...baseProps} />);

    expect(screen.getByText(/Admins/i)).toBeInTheDocument();
    expect(screen.getByText(/Members/i)).toBeInTheDocument();
  });

  it('shows Join button when not joined', () => {
    render(<OrganizationCard {...baseProps} />);

    expect(screen.getByTestId('joinBtn')).toBeInTheDocument();
  });

  it('shows Withdraw button when request is pending', () => {
    render(
      <OrganizationCard
        {...baseProps}
        membershipRequestStatus="pending"
        membershipRequests={[{ id: 'req-1', user: { id: 'u1' } }]}
      />,
    );

    expect(screen.getByTestId('withdrawBtn')).toBeInTheDocument();
  });

  it('shows Visit button when joined', () => {
    render(<OrganizationCard {...baseProps} isJoined />);

    expect(screen.getByTestId('manageBtn')).toBeInTheDocument();
  });

  it('calls toast and mutation on join click', async () => {
    render(<OrganizationCard {...baseProps} />);

    fireEvent.click(screen.getByTestId('joinBtn'));

    await waitFor(() => {
      expect(mockMutationFn).toHaveBeenCalledWith({
        variables: { organizationId: 'org-1' },
      });
    });

    expect(toast.success).toHaveBeenCalled();
  });

  it('calls toast and mutation on withdraw click', async () => {
    render(
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

    expect(toast.success).toHaveBeenCalled();
  });

  it('shows error toast when join mutation fails', async () => {
    mockMutationFn.mockRejectedValueOnce(new Error('Mutation failed'));

    render(<OrganizationCard {...baseProps} />);

    fireEvent.click(screen.getByTestId('joinBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to send membership request',
      );
    });
  });

  it('shows error toast when withdraw mutation fails', async () => {
    mockMutationFn.mockRejectedValueOnce(new Error('Mutation failed'));

    render(
      <OrganizationCard
        {...baseProps}
        membershipRequestStatus="pending"
        membershipRequests={[{ id: 'req-1', user: { id: 'u1' } }]}
      />,
    );

    fireEvent.click(screen.getByTestId('withdrawBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to withdraw request');
    });
  });
});
