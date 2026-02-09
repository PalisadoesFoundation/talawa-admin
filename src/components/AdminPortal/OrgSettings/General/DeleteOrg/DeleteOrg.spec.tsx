import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useParams, useNavigate } from 'react-router';
import type { DocumentNode } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import DeleteOrg from './DeleteOrg';
import { errorHandler } from 'utils/errorHandler';
import { describe, beforeEach, it, expect, vi, type Mock } from 'vitest';
import {
  DELETE_ORGANIZATION_MUTATION,
  REMOVE_SAMPLE_ORGANIZATION_MUTATION,
} from 'GraphQl/Mutations/mutations';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    tCommon: (key: string) => key,
  }),
}));

vi.mock('react-router', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('@apollo/client', () => ({
  useMutation: vi.fn(),
  useQuery: vi.fn(),
}));

vi.mock('utils/useLocalstorage', () => ({
  default: vi.fn(() => ({
    getItem: vi.fn(),
  })),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

describe('DeleteOrg Component', () => {
  const navigateMock = vi.fn();
  const deleteOrgMutationMock = vi.fn();
  const removeSampleOrgMutationMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();

    (useParams as Mock).mockReturnValue({ orgId: '1' });
    (useNavigate as Mock).mockReturnValue(navigateMock);
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn().mockReturnValue('true'),
    });
    (useQuery as Mock).mockReturnValue({
      data: { isSampleOrganization: false },
      loading: false,
    });
    (useMutation as Mock).mockImplementation((mutation: DocumentNode) => {
      if (mutation === DELETE_ORGANIZATION_MUTATION) {
        return [deleteOrgMutationMock, { loading: false }];
      } else if (mutation === REMOVE_SAMPLE_ORGANIZATION_MUTATION) {
        return [removeSampleOrgMutationMock, { loading: false }];
      }
      return [vi.fn(), { loading: false }];
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders delete button and opens confirmation modal', async () => {
    render(<DeleteOrg />);
    await userEvent.click(screen.getByTestId('openDeleteModalBtn'));
    expect(screen.getByTestId('orgDeleteModal')).toBeInTheDocument();
  });

  it('deletes organization successfully', async () => {
    deleteOrgMutationMock.mockResolvedValue({});

    render(<DeleteOrg />);
    await userEvent.click(screen.getByTestId('openDeleteModalBtn'));
    await userEvent.click(screen.getByTestId('deleteOrganizationBtn'));

    await waitFor(() => {
      expect(deleteOrgMutationMock).toHaveBeenCalledWith({
        variables: { input: { id: '1' } },
      });
      expect(navigateMock).toHaveBeenCalledWith('/admin/orglist');
    });
  });

  it('handles error during organization deletion', async () => {
    const error = new Error('Deletion failed');
    deleteOrgMutationMock.mockRejectedValue(error);

    render(<DeleteOrg />);
    await userEvent.click(screen.getByTestId('openDeleteModalBtn'));
    await userEvent.click(screen.getByTestId('deleteOrganizationBtn'));

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalledWith(expect.any(Function), error);
    });
  });

  it('closes modal when close button is clicked', async () => {
    render(<DeleteOrg />);
    await userEvent.click(screen.getByTestId('openDeleteModalBtn'));
    expect(screen.getByTestId('orgDeleteModal')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('closeDelOrgModalBtn'));

    await waitFor(() => {
      expect(screen.queryByTestId('orgDeleteModal')).not.toBeInTheDocument();
    });
  });

  it('handles undefined organization ID', async () => {
    (useParams as Mock).mockReturnValue({ orgId: undefined });
    deleteOrgMutationMock.mockResolvedValue({});

    render(<DeleteOrg />);
    await userEvent.click(screen.getByTestId('openDeleteModalBtn'));
    await userEvent.click(screen.getByTestId('deleteOrganizationBtn'));

    await waitFor(() => {
      expect(deleteOrgMutationMock).toHaveBeenCalledWith({
        variables: { input: { id: '' } },
      });
    });
  });

  it('renders delete button even when SuperAdmin is false', () => {
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn().mockReturnValue(false),
    });

    render(<DeleteOrg />);
    // Should still render because of || true fallback
    expect(screen.getByTestId('openDeleteModalBtn')).toBeInTheDocument();
  });

  it('handles query loading state', () => {
    (useQuery as Mock).mockReturnValue({
      data: undefined,
      loading: true,
    });

    render(<DeleteOrg />);
    // Component should still render when loading
    expect(screen.getByTestId('openDeleteModalBtn')).toBeInTheDocument();
  });

  it('handles undefined query data', () => {
    (useQuery as Mock).mockReturnValue({
      data: undefined,
      loading: false,
    });

    render(<DeleteOrg />);
    const deleteButton = screen.getByTestId('openDeleteModalBtn');
    // Should render with default text when data is undefined
    expect(deleteButton).toHaveTextContent('delete');
  });
});
