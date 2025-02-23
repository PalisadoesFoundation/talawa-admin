import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
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

vi.mock('react-router-dom', () => ({
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
});
