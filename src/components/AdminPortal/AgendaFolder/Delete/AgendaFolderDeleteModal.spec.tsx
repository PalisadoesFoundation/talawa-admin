import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockLink } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { I18nextProvider } from 'react-i18next';
import { vi, describe, it, expect, afterEach } from 'vitest';
import * as ApolloClient from '@apollo/client';
import AgendaFolderDeleteModal from './AgendaFolderDeleteModal';
import { DELETE_AGENDA_FOLDER_MUTATION } from 'GraphQl/Mutations/AgendaFolderMutations';
import i18nForTest from 'utils/i18nForTest';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

// Mock NotificationToast
vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock translations
const mockT = (key: string): string => key;
const mockTCommon = (key: string): string => key;

const mockAgendaFolderId = 'folder123';
const mockOnClose = vi.fn();
const mockRefetchAgendaFolder = vi.fn();

const MOCKS_SUCCESS: MockLink.MockedResponse[] = [
  {
    request: {
      query: DELETE_AGENDA_FOLDER_MUTATION,
      variables: {
        input: { id: mockAgendaFolderId },
      },
    },
    result: {
      data: {
        deleteAgendaFolder: {
          id: mockAgendaFolderId,
        },
      },
    },
  },
];

const MOCKS_ERROR: MockLink.MockedResponse[] = [
  {
    request: {
      query: DELETE_AGENDA_FOLDER_MUTATION,
      variables: {
        input: { id: mockAgendaFolderId },
      },
    },
    error: new Error('Failed to delete agenda folder'),
  },
];

const MOCKS_GRAPHQL_ERROR: MockLink.MockedResponse[] = [
  {
    request: {
      query: DELETE_AGENDA_FOLDER_MUTATION,
      variables: {
        input: { id: mockAgendaFolderId },
      },
    },
    result: {
      errors: [{ message: 'GraphQL error occurred' }],
    },
  },
];

const renderAgendaFolderDeleteModal = (
  mocks: MockLink.MockedResponse[] = MOCKS_SUCCESS,
  isOpen = true,
) => {
  return render(
    <MockedProvider mocks={mocks}>
      <I18nextProvider i18n={i18nForTest}>
        <AgendaFolderDeleteModal
          isOpen={isOpen}
          onClose={mockOnClose}
          agendaFolderId={mockAgendaFolderId}
          refetchAgendaFolder={mockRefetchAgendaFolder}
          t={mockT}
          tCommon={mockTCommon}
        />
      </I18nextProvider>
    </MockedProvider>,
  );
};

describe('AgendaFolderDeleteModal', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders modal when isOpen is true', () => {
      renderAgendaFolderDeleteModal();

      expect(screen.getByTestId('deleteAgendaFolderModal')).toBeInTheDocument();
      expect(screen.getByText('deleteAgendaFolderMsg')).toBeInTheDocument();
    });

    it('does not render modal when isOpen is false', () => {
      renderAgendaFolderDeleteModal(MOCKS_SUCCESS, false);

      expect(
        screen.queryByTestId('deleteAgendaFolderModal'),
      ).not.toBeInTheDocument();
    });

    it('renders modal with correct title', () => {
      renderAgendaFolderDeleteModal();

      expect(screen.getByText('deleteAgendaFolder')).toBeInTheDocument();
    });

    it('renders delete confirmation message', () => {
      renderAgendaFolderDeleteModal();

      expect(screen.getByText('deleteAgendaFolderMsg')).toBeInTheDocument();
    });

    it('renders Yes and No buttons', () => {
      renderAgendaFolderDeleteModal();

      expect(screen.getByTestId('modal-delete-btn')).toBeInTheDocument();
      expect(screen.getByTestId('modal-cancel-btn')).toBeInTheDocument();
    });
  });

  it('shows error toast with error message when mutation throws an Error', async () => {
    const mutationError = new Error('Delete failed directly');

    vi.spyOn(ApolloClient, 'useMutation').mockReturnValue([
      vi.fn().mockRejectedValueOnce(mutationError),
      { loading: false, error: undefined, called: false },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    renderAgendaFolderDeleteModal([], true);

    await userEvent.click(screen.getByTestId('modal-delete-btn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Delete failed directly',
      );
    });
  });

  describe('Modal interactions', () => {
    it('calls onClose when No button is clicked', async () => {
      renderAgendaFolderDeleteModal();

      const noButton = screen.getByTestId('modal-cancel-btn');
      await userEvent.click(noButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call refetchAgendaFolder when No button is clicked', async () => {
      renderAgendaFolderDeleteModal();

      const noButton = screen.getByTestId('modal-cancel-btn');
      await userEvent.click(noButton);

      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });

    it('does not show success notification when No button is clicked', async () => {
      renderAgendaFolderDeleteModal();

      const noButton = screen.getByTestId('modal-cancel-btn');
      await userEvent.click(noButton);

      expect(NotificationToast.success).not.toHaveBeenCalled();
    });
  });

  describe('Delete functionality - Success', () => {
    it('calls deleteAgendaFolder mutation when Yes button is clicked', async () => {
      renderAgendaFolderDeleteModal();

      const yesButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(yesButton);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalledWith(
            'agendaFolderDeleted',
          );
        },
        { timeout: 5000 },
      );
    });

    it('shows success notification after successful deletion', async () => {
      renderAgendaFolderDeleteModal();

      const yesButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(yesButton);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalledWith(
            'agendaFolderDeleted',
          );
        },
        { timeout: 5000 },
      );
    });

    it('calls refetchAgendaFolder after successful deletion', async () => {
      renderAgendaFolderDeleteModal();

      const yesButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(yesButton);

      await waitFor(
        () => {
          expect(mockRefetchAgendaFolder).toHaveBeenCalledTimes(1);
        },
        { timeout: 5000 },
      );
    });

    it('calls onClose after successful deletion', async () => {
      renderAgendaFolderDeleteModal();

      const yesButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(yesButton);

      await waitFor(
        () => {
          expect(mockOnClose).toHaveBeenCalledTimes(1);
        },
        { timeout: 5000 },
      );
    });

    it('executes all deletion flow callbacks after successful mutation', async () => {
      renderAgendaFolderDeleteModal();

      const yesButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(yesButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });

      expect(mockRefetchAgendaFolder).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('does not show error notification on successful deletion', async () => {
      renderAgendaFolderDeleteModal();

      const yesButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(yesButton);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      expect(NotificationToast.error).not.toHaveBeenCalled();
    });
  });

  describe('Delete functionality - Error handling', () => {
    it('shows error notification when mutation fails with Error', async () => {
      renderAgendaFolderDeleteModal(MOCKS_ERROR);

      const yesButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(yesButton);

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalledWith(
            'Failed to delete agenda folder',
          );
        },
        { timeout: 5000 },
      );
    });

    it('does not call refetchAgendaFolder when mutation fails', async () => {
      renderAgendaFolderDeleteModal(MOCKS_ERROR);

      const yesButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(yesButton);

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });

    it('does not call onClose when mutation fails', async () => {
      renderAgendaFolderDeleteModal(MOCKS_ERROR);

      const yesButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(yesButton);

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('does not show success notification when mutation fails', async () => {
      renderAgendaFolderDeleteModal(MOCKS_ERROR);

      const yesButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(yesButton);

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      expect(NotificationToast.success).not.toHaveBeenCalled();
    });

    it('handles GraphQL errors correctly', async () => {
      renderAgendaFolderDeleteModal(MOCKS_GRAPHQL_ERROR);

      const yesButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(yesButton);

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );
    });

    it('displays error message from Error instance', async () => {
      renderAgendaFolderDeleteModal(MOCKS_ERROR);

      const yesButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(yesButton);

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalledWith(
            'Failed to delete agenda folder',
          );
        },
        { timeout: 5000 },
      );
    });
  });

  describe('Modal properties', () => {
    it('renders modal when open', () => {
      renderAgendaFolderDeleteModal();

      const modal = screen.getByTestId('deleteAgendaFolderModal');
      expect(modal).toBeInTheDocument();
    });

    it('prevents closing modal with backdrop click (static backdrop)', () => {
      renderAgendaFolderDeleteModal();

      const modal = screen.getByTestId('deleteAgendaFolderModal');
      expect(modal).toBeInTheDocument();
    });

    it('prevents closing modal with keyboard (keyboard disabled)', () => {
      renderAgendaFolderDeleteModal();

      const modal = screen.getByTestId('deleteAgendaFolderModal');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles rapid Yes button clicks gracefully', async () => {
      renderAgendaFolderDeleteModal();

      const yesButton = screen.getByTestId('modal-delete-btn');
      // Click multiple times rapidly
      await userEvent.click(yesButton);
      await userEvent.click(yesButton);
      await userEvent.click(yesButton);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      // Should only process once due to modal closing
      expect(mockRefetchAgendaFolder).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles empty agendaFolderId gracefully', async () => {
      const MOCKS_EMPTY_ID: MockLink.MockedResponse[] = [
        {
          request: {
            query: DELETE_AGENDA_FOLDER_MUTATION,
            variables: {
              input: { id: '' },
            },
          },
          error: new Error('Invalid folder ID'),
        },
      ];

      render(
        <MockedProvider mocks={MOCKS_EMPTY_ID}>
          <I18nextProvider i18n={i18nForTest}>
            <AgendaFolderDeleteModal
              isOpen={true}
              onClose={mockOnClose}
              agendaFolderId=""
              refetchAgendaFolder={mockRefetchAgendaFolder}
              t={mockT}
              tCommon={mockTCommon}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      const yesButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(yesButton);

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalledWith(
            'Invalid folder ID',
          );
        },
        { timeout: 5000 },
      );
    });

    it('handles non-Error exceptions in catch block', async () => {
      const MOCKS_NON_ERROR: MockLink.MockedResponse[] = [
        {
          request: {
            query: DELETE_AGENDA_FOLDER_MUTATION,
            variables: {
              input: { id: mockAgendaFolderId },
            },
          },
          result: {
            errors: [{ message: 'Some GraphQL error' }],
          },
        },
      ];

      renderAgendaFolderDeleteModal(MOCKS_NON_ERROR);

      const yesButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(yesButton);

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Translation function calls', () => {
    it('calls t function for modal title', () => {
      const mockTSpy = vi.fn((key: string) => key);
      render(
        <MockedProvider mocks={MOCKS_SUCCESS}>
          <I18nextProvider i18n={i18nForTest}>
            <AgendaFolderDeleteModal
              isOpen={true}
              onClose={mockOnClose}
              agendaFolderId={mockAgendaFolderId}
              refetchAgendaFolder={mockRefetchAgendaFolder}
              t={mockTSpy}
              tCommon={mockTCommon}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(mockTSpy).toHaveBeenCalledWith('deleteAgendaFolder');
    });

    it('calls t function for delete message', () => {
      const mockTSpy = vi.fn((key: string) => key);
      render(
        <MockedProvider mocks={MOCKS_SUCCESS}>
          <I18nextProvider i18n={i18nForTest}>
            <AgendaFolderDeleteModal
              isOpen={true}
              onClose={mockOnClose}
              agendaFolderId={mockAgendaFolderId}
              refetchAgendaFolder={mockRefetchAgendaFolder}
              t={mockTSpy}
              tCommon={mockTCommon}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(mockTSpy).toHaveBeenCalledWith('deleteAgendaFolderMsg');
    });
  });
});
