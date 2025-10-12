import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router';
import type { DocumentNode } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
import DeleteOrg from './DeleteOrg';
import { toast } from 'react-toastify';
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

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
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

  it('renders delete button and opens confirmation modal', () => {
    render(<DeleteOrg />);
    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    expect(screen.getByTestId('orgDeleteModal')).toBeInTheDocument();
  });

  it('deletes regular organization successfully', async () => {
    deleteOrgMutationMock.mockResolvedValue({});

    render(<DeleteOrg />);
    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    fireEvent.click(screen.getByTestId('deleteOrganizationBtn'));

    await waitFor(() => {
      expect(deleteOrgMutationMock).toHaveBeenCalledWith({
        variables: { input: { id: '1' } },
      });
      expect(navigateMock).toHaveBeenCalledWith('/orglist');
    });
  });

  it('handles error during regular organization deletion', async () => {
    const error = new Error('Deletion failed');
    deleteOrgMutationMock.mockRejectedValue(error);

    render(<DeleteOrg />);
    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    fireEvent.click(screen.getByTestId('deleteOrganizationBtn'));

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalledWith(expect.any(Function), error);
    });
  });

  it('handles error during sample organization deletion', async () => {
    (useQuery as Mock).mockReturnValue({
      data: { isSampleOrganization: true },
      loading: false,
    });
    const error = new Error('Sample deletion failed');
    removeSampleOrgMutationMock.mockRejectedValue(error);

    render(<DeleteOrg />);
    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    fireEvent.click(screen.getByTestId('deleteOrganizationBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(error.message);
    });
  });

  it('deletes sample organization successfully', async () => {
    (useQuery as Mock).mockReturnValue({
      data: { isSampleOrganization: true },
      loading: false,
    });
    removeSampleOrgMutationMock.mockResolvedValue({});

    render(<DeleteOrg />);
    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    fireEvent.click(screen.getByTestId('deleteOrganizationBtn'));

    await waitFor(() => {
      expect(removeSampleOrgMutationMock).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        'successfullyDeletedSampleOrganization',
      );
    });

    // Wait for the setTimeout to execute
    await waitFor(
      () => {
        expect(navigateMock).toHaveBeenCalledWith('/orglist');
      },
      { timeout: 1100 },
    );
  });

  it('renders delete button with different text for sample organization', () => {
    (useQuery as Mock).mockReturnValue({
      data: { isSampleOrganization: true },
      loading: false,
    });

    render(<DeleteOrg />);
    const deleteButton = screen.getByTestId('openDeleteModalBtn');
    expect(deleteButton).toHaveTextContent('deleteSampleOrganization');
  });

  it('renders delete button with default text for regular organization', () => {
    (useQuery as Mock).mockReturnValue({
      data: { isSampleOrganization: false },
      loading: false,
    });

    render(<DeleteOrg />);
    const deleteButton = screen.getByTestId('openDeleteModalBtn');
    expect(deleteButton).toHaveTextContent('delete');
  });

  it('renders when canDelete is true due to OR condition', () => {
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn().mockReturnValue(false),
    });

    render(<DeleteOrg />);
    // Due to canDelete = getItem('SuperAdmin') || true, it will always render
    expect(screen.getByTestId('openDeleteModalBtn')).toBeInTheDocument();
  });

  it('renders when SuperAdmin is true', () => {
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn().mockReturnValue(true),
    });

    render(<DeleteOrg />);
    expect(screen.getByTestId('openDeleteModalBtn')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', async () => {
    render(<DeleteOrg />);
    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    expect(screen.getByTestId('orgDeleteModal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('closeDelOrgModalBtn'));

    await waitFor(() => {
      expect(screen.queryByTestId('orgDeleteModal')).not.toBeInTheDocument();
    });
  });

  it('closes modal when modal backdrop is clicked', async () => {
    render(<DeleteOrg />);
    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    expect(screen.getByTestId('orgDeleteModal')).toBeInTheDocument();

    // Simulate clicking outside the modal (onHide callback)
    const modal = screen.getByTestId('orgDeleteModal').parentElement;
    if (modal) {
      fireEvent.click(modal);
    }

    await waitFor(() => {
      expect(screen.queryByTestId('orgDeleteModal')).not.toBeInTheDocument();
    });
  });

  it('handles undefined organization ID', async () => {
    (useParams as Mock).mockReturnValue({ orgId: undefined });
    deleteOrgMutationMock.mockResolvedValue({});

    render(<DeleteOrg />);
    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    fireEvent.click(screen.getByTestId('deleteOrganizationBtn'));

    await waitFor(() => {
      expect(deleteOrgMutationMock).toHaveBeenCalledWith({
        variables: { input: { id: '' } },
      });
    });
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
