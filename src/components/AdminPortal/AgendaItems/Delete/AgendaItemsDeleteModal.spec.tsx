import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockLink } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';

import AgendaItemsDeleteModal from './AgendaItemsDeleteModal';
import { DELETE_AGENDA_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import i18nForTest from 'utils/i18nForTest';

// Mock NotificationToast
vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockT = (key: string): string => key;
const mockOnClose = vi.fn();
const mockRefetchAgendaFolder = vi.fn();

const MOCK_AGENDA_ITEM_ID = 'item123';
const mockTCommon = (key: string): string => key;
const MOCKS_SUCCESS: MockLink.MockedResponse[] = [
  {
    request: {
      query: DELETE_AGENDA_ITEM_MUTATION,
      variables: {
        input: {
          id: MOCK_AGENDA_ITEM_ID,
        },
      },
    },
    result: {
      data: {
        deleteAgendaItem: {
          id: MOCK_AGENDA_ITEM_ID,
        },
      },
    },
  },
];

const MOCKS_ERROR: MockLink.MockedResponse[] = [
  {
    request: {
      query: DELETE_AGENDA_ITEM_MUTATION,
      variables: {
        input: {
          id: MOCK_AGENDA_ITEM_ID,
        },
      },
    },
    error: new Error('Failed to delete agenda item'),
  },
];

const renderModal = (
  mocks: MockLink.MockedResponse[] = [],
  isOpen = true,
  agendaItemId = MOCK_AGENDA_ITEM_ID,
) => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <I18nextProvider i18n={i18nForTest}>
        <AgendaItemsDeleteModal
          isOpen={isOpen}
          onClose={mockOnClose}
          agendaItemId={agendaItemId}
          t={mockT}
          tCommon={mockTCommon}
          refetchAgendaFolder={mockRefetchAgendaFolder}
        />
      </I18nextProvider>
    </MockedProvider>,
  );
};

describe('AgendaItemsDeleteModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the modal when isOpen is true', () => {
      renderModal();

      expect(screen.getByTestId('deleteAgendaItemModal')).toBeInTheDocument();
      expect(screen.getByText('deleteAgendaItem')).toBeInTheDocument();
      expect(screen.getByText('deleteAgendaItemMsg')).toBeInTheDocument();
    });

    it('should not render the modal when isOpen is false', () => {
      renderModal([], false);

      expect(
        screen.queryByTestId('deleteAgendaItemModal'),
      ).not.toBeInTheDocument();
    });

    it('should render modal with correct title', () => {
      renderModal();

      expect(screen.getByText('deleteAgendaItem')).toBeInTheDocument();
    });

    it('should render delete confirmation message', () => {
      renderModal();

      expect(screen.getByText('deleteAgendaItemMsg')).toBeInTheDocument();
    });

    it('should render "Cancel" button', () => {
      renderModal();

      const cancelButton = screen.getByTestId('modal-cancel-btn');
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton).toHaveTextContent(/cancel/i);
    });

    it('should render "Delete" button', () => {
      renderModal();

      const deleteButton = screen.getByTestId('modal-delete-btn');
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveTextContent(/delete/i);
    });

    it('should apply correct modal props', () => {
      renderModal();

      const modal = screen.getByTestId('deleteAgendaItemModal');
      expect(modal).toBeInTheDocument();
    });

    it('should render warning icon', () => {
      renderModal();

      const warningIcon = document.querySelector('.fa-exclamation-triangle');
      expect(warningIcon).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when "Cancel" button is clicked', async () => {
      renderModal();

      const cancelButton = screen.getByTestId('modal-cancel-btn');
      await userEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call deleteAgendaItemHandler when "Delete" button is clicked', async () => {
      renderModal(MOCKS_SUCCESS);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalledWith(
            'agendaItemDeleted',
          );
        },
        { timeout: 5000 },
      );
    });
  });

  describe('Delete Agenda Item Handler', () => {
    it('should successfully delete agenda item', async () => {
      renderModal(MOCKS_SUCCESS);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalledWith(
            'agendaItemDeleted',
          );
        },
        { timeout: 5000 },
      );

      expect(mockRefetchAgendaFolder).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call refetchAgendaFolder after successful deletion', async () => {
      renderModal(MOCKS_SUCCESS);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(mockRefetchAgendaFolder).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );
    });

    it('should close modal after successful deletion', async () => {
      renderModal(MOCKS_SUCCESS);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(mockOnClose).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );
    });

    it('should display success notification after successful deletion', async () => {
      renderModal(MOCKS_SUCCESS);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalledWith(
            'agendaItemDeleted',
          );
        },
        { timeout: 5000 },
      );
    });
  });

  describe('Branch coverage – non-Error rejection', () => {
    beforeEach(async () => {
      vi.resetModules();

      vi.doMock('@apollo/client', async () => {
        const actual =
          await vi.importActual<typeof import('@apollo/client')>(
            '@apollo/client',
          );

        return {
          ...actual,
          useMutation: () => [
            vi.fn().mockRejectedValueOnce('Network failure'), // ✅ non-Error
          ],
        };
      });
    });

    afterEach(() => {
      vi.doUnmock('@apollo/client');
      vi.resetModules();
    });

    it('does nothing when mutation throws non-Error value', async () => {
      const { default: AgendaItemsDeleteModal } =
        await import('./AgendaItemsDeleteModal');

      render(
        <I18nextProvider i18n={i18nForTest}>
          <AgendaItemsDeleteModal
            isOpen
            onClose={mockOnClose}
            agendaItemId={MOCK_AGENDA_ITEM_ID}
            t={mockT}
            tCommon={mockTCommon}
            refetchAgendaFolder={mockRefetchAgendaFolder}
          />
        </I18nextProvider>,
      );

      await userEvent.click(screen.getByTestId('modal-delete-btn'));

      await waitFor(
        () => {
          expect(NotificationToast.error).not.toHaveBeenCalled();
          expect(NotificationToast.success).not.toHaveBeenCalled();
          expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
          expect(mockOnClose).not.toHaveBeenCalled();
        },
        { timeout: 5000 },
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle error when deletion fails', async () => {
      renderModal(MOCKS_ERROR);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalledWith(
            'Failed to delete agenda item',
          );
        },
        { timeout: 5000 },
      );
    });

    it('should not call onClose when deletion fails', async () => {
      renderModal(MOCKS_ERROR);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not call refetchAgendaFolder when deletion fails', async () => {
      renderModal(MOCKS_ERROR);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });

    it('should handle Error instance in catch block', async () => {
      renderModal(MOCKS_ERROR);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalledWith(
            'Failed to delete agenda item',
          );
        },
        { timeout: 5000 },
      );
    });

    it('should handle non-Error instance in catch block', async () => {
      const MOCKS_NON_ERROR: MockLink.MockedResponse[] = [
        {
          request: {
            query: DELETE_AGENDA_ITEM_MUTATION,
            variables: {
              input: {
                id: MOCK_AGENDA_ITEM_ID,
              },
            },
          },
          error: { message: 'Non-error object' } as Error,
        },
      ];

      renderModal(MOCKS_NON_ERROR);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      // Non-Error instances won't trigger NotificationToast.error
      await waitFor(
        () => {
          expect(mockOnClose).not.toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });
  });

  describe('Modal Props', () => {
    it('should pass correct size prop to BaseModal', () => {
      renderModal();

      const modal = screen.getByTestId('deleteAgendaItemModal');
      expect(modal).toBeInTheDocument();
    });

    it('should set backdrop to static', () => {
      renderModal();

      const modal = screen.getByTestId('deleteAgendaItemModal');
      expect(modal).toBeInTheDocument();
      // BaseModal with backdrop="static" prevents closing on backdrop click
    });

    it('should set keyboard to false', () => {
      renderModal();

      const modal = screen.getByTestId('deleteAgendaItemModal');
      expect(modal).toBeInTheDocument();
      // BaseModal with keyboard={false} prevents closing on Escape key
    });
  });

  describe('Translation Functions', () => {
    it('should use t function for agenda-specific translations', () => {
      const customT = vi.fn((key: string) => `translated_${key}`);

      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <AgendaItemsDeleteModal
              isOpen={true}
              onClose={mockOnClose}
              agendaItemId={MOCK_AGENDA_ITEM_ID}
              t={customT}
              tCommon={mockTCommon}
              refetchAgendaFolder={mockRefetchAgendaFolder}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(customT).toHaveBeenCalledWith('deleteAgendaItem');
      expect(customT).toHaveBeenCalledWith('deleteAgendaItemMsg');
    });
  });

  describe('Different Agenda Item IDs', () => {
    it('should handle deletion with different agenda item ID', async () => {
      const differentItemId = 'different-item-456';

      const mocks: MockLink.MockedResponse[] = [
        {
          request: {
            query: DELETE_AGENDA_ITEM_MUTATION,
            variables: {
              input: {
                id: differentItemId,
              },
            },
          },
          result: {
            data: {
              deleteAgendaItem: {
                id: differentItemId,
              },
            },
          },
        },
      ];

      renderModal(mocks, true, differentItemId);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalledWith(
            'agendaItemDeleted',
          );
        },
        { timeout: 5000 },
      );
    });
  });

  describe('Multiple Clicks Prevention', () => {
    it('should handle multiple rapid clicks on delete button', async () => {
      renderModal(MOCKS_SUCCESS);

      const deleteButton = screen.getByTestId('modal-delete-btn');

      // Rapidly click multiple times
      await userEvent.click(deleteButton);
      await userEvent.click(deleteButton);
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      // Should still only close once
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Component Lifecycle', () => {
    it('should render correctly on initial mount', () => {
      const { container } = renderModal();

      expect(container).toBeInTheDocument();
      expect(screen.getByTestId('deleteAgendaItemModal')).toBeInTheDocument();
    });

    it('should update when isOpen prop changes', () => {
      const { rerender } = render(
        <MockedProvider mocks={[]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <AgendaItemsDeleteModal
              isOpen={false}
              onClose={mockOnClose}
              agendaItemId={MOCK_AGENDA_ITEM_ID}
              t={mockT}
              tCommon={mockTCommon}
              refetchAgendaFolder={mockRefetchAgendaFolder}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(
        screen.queryByTestId('deleteAgendaItemModal'),
      ).not.toBeInTheDocument();

      rerender(
        <MockedProvider mocks={[]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <AgendaItemsDeleteModal
              isOpen={true}
              onClose={mockOnClose}
              agendaItemId={MOCK_AGENDA_ITEM_ID}
              t={mockT}
              tCommon={mockTCommon}
              refetchAgendaFolder={mockRefetchAgendaFolder}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(screen.getByTestId('deleteAgendaItemModal')).toBeInTheDocument();
    });
  });

  describe('Button Types', () => {
    it('should render buttons with correct type attribute', () => {
      renderModal();

      const cancelButton = screen.getByTestId('modal-cancel-btn');
      const deleteButton = screen.getByTestId('modal-delete-btn');

      expect(cancelButton).toHaveAttribute('type', 'button');
      expect(deleteButton).toHaveAttribute('type', 'button');
    });
  });

  describe('CSS Classes', () => {
    it('should apply correct CSS classes to buttons', () => {
      renderModal();

      const cancelButton = screen.getByTestId('modal-cancel-btn');
      const deleteButton = screen.getByTestId('modal-delete-btn');

      expect(cancelButton).toHaveClass('btn', 'btn-secondary');
      expect(deleteButton).toHaveClass('btn', 'btn-danger');
    });
  });

  describe('Async Operation Flow', () => {
    it('should execute deletion flow in correct order', async () => {
      const callOrder: string[] = [];

      const trackedOnClose = vi.fn(() => callOrder.push('onClose'));
      const trackedRefetch = vi.fn(() => callOrder.push('refetch'));

      render(
        <MockedProvider mocks={MOCKS_SUCCESS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <AgendaItemsDeleteModal
              isOpen={true}
              onClose={trackedOnClose}
              agendaItemId={MOCK_AGENDA_ITEM_ID}
              t={mockT}
              tCommon={mockTCommon}
              refetchAgendaFolder={trackedRefetch}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      await waitFor(
        () => {
          expect(trackedRefetch).toHaveBeenCalled();
          expect(trackedOnClose).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      // Verify order: refetch should be called before onClose
      expect(callOrder).toEqual(['refetch', 'onClose']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty agenda item ID', async () => {
      const mocks: MockLink.MockedResponse[] = [
        {
          request: {
            query: DELETE_AGENDA_ITEM_MUTATION,
            variables: {
              input: {
                id: '',
              },
            },
          },
          result: {
            data: {
              deleteAgendaItem: {
                id: '',
              },
            },
          },
        },
      ];

      renderModal(mocks, true, '');

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );
    });

    it('should handle very long agenda item ID', async () => {
      const longId = 'a'.repeat(1000);

      const mocks: MockLink.MockedResponse[] = [
        {
          request: {
            query: DELETE_AGENDA_ITEM_MUTATION,
            variables: {
              input: {
                id: longId,
              },
            },
          },
          result: {
            data: {
              deleteAgendaItem: {
                id: longId,
              },
            },
          },
        },
      ];

      renderModal(mocks, true, longId);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );
    });
  });
});
