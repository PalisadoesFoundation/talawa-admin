import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
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

const mockOnClose = vi.fn();
const mockRefetchAgendaFolder = vi.fn();

const MOCK_AGENDA_ITEM_ID = 'item123';
const MOCKS_SUCCESS: MockedResponse[] = [
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

const MOCKS_ERROR: MockedResponse[] = [
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
  mocks: MockedResponse[] = [],
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
          refetchAgendaFolder={mockRefetchAgendaFolder}
        />
      </I18nextProvider>
    </MockedProvider>,
  );
};

describe('AgendaItemsDeleteModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  describe('Rendering', () => {
    it('should render the modal when isOpen is true', () => {
      renderModal();

      expect(screen.getByTestId('deleteAgendaItemModal')).toBeInTheDocument();
      expect(screen.getByText('Delete Agenda Item')).toBeInTheDocument();
      expect(
        screen.getByText('Do you want to remove this agenda item?'),
      ).toBeInTheDocument();
    });

    it('should not render the modal when isOpen is false', () => {
      renderModal([], false);

      expect(
        screen.queryByTestId('deleteAgendaItemModal'),
      ).not.toBeInTheDocument();
    });

    it('should render modal with correct title', () => {
      renderModal();

      expect(screen.getByText('Delete Agenda Item')).toBeInTheDocument();
    });

    it('should render delete confirmation message', () => {
      renderModal();

      expect(
        screen.getByText('Do you want to remove this agenda item?'),
      ).toBeInTheDocument();
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

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('should call deleteAgendaItemHandler when "Delete" button is clicked', async () => {
      renderModal(MOCKS_SUCCESS);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalledWith(
            'Agenda Item deleted successfully',
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
            'Agenda Item deleted successfully',
          );
          expect(mockRefetchAgendaFolder).toHaveBeenCalledTimes(1);
          expect(mockOnClose).toHaveBeenCalledTimes(1);
        },
        { timeout: 5000 },
      );
    });

    it('should call refetchAgendaFolder after successful deletion', async () => {
      renderModal(MOCKS_SUCCESS);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockRefetchAgendaFolder).toHaveBeenCalledTimes(1);
      });
    });

    it('should close modal after successful deletion', async () => {
      renderModal(MOCKS_SUCCESS);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('should display success notification after successful deletion', async () => {
      renderModal(MOCKS_SUCCESS);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'Agenda Item deleted successfully',
        );
      });
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
            refetchAgendaFolder={mockRefetchAgendaFolder}
          />
        </I18nextProvider>,
      );

      await userEvent.click(screen.getByTestId('modal-delete-btn'));

      await waitFor(() => {
        expect(NotificationToast.error).not.toHaveBeenCalled();
        expect(NotificationToast.success).not.toHaveBeenCalled();
        expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle error when deletion fails', async () => {
      renderModal(MOCKS_ERROR);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Failed to delete agenda item',
        );
      });
    });

    it('should not call onClose when deletion fails', async () => {
      renderModal(MOCKS_ERROR);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
      });
    });

    it('should not call refetchAgendaFolder when deletion fails', async () => {
      renderModal(MOCKS_ERROR);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalled();
        expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
      });
    });

    it('should handle Error instance in catch block', async () => {
      renderModal(MOCKS_ERROR);

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Failed to delete agenda item',
        );
      });
    });

    it('should handle non-Error instance in catch block', async () => {
      const MOCKS_NON_ERROR: MockedResponse[] = [
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
      await waitFor(() => {
        expect(mockOnClose).not.toHaveBeenCalled();
        expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
      });
    });
  });

  describe('Modal Props', () => {
    it('applies correct accessibility attributes and classes', () => {
      renderModal();

      const modal = screen.getByTestId('deleteAgendaItemModal');
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveClass('modal-dialog-centered');

      const modalContainer = modal.parentElement;
      expect(modalContainer).toHaveAttribute('aria-modal', 'true');
    });
  });

  describe('Different Agenda Item IDs', () => {
    it('should handle deletion with different agenda item ID', async () => {
      const differentItemId = 'different-item-456';

      const mocks: MockedResponse[] = [
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

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'Agenda Item deleted successfully',
        );
      });
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

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
      });
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
      const trackedRefetch = vi.fn(() => callOrder.push('refetchAgendaFolder'));

      const MOCKS_SUCCESS_TRACKED: MockedResponse[] = [
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
          // Add a delay to ensure async operations are tracked
          delay: 10,
        },
      ];

      render(
        <MockedProvider mocks={MOCKS_SUCCESS_TRACKED} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <AgendaItemsDeleteModal
              isOpen={true}
              onClose={trackedOnClose}
              agendaItemId={MOCK_AGENDA_ITEM_ID}
              refetchAgendaFolder={trackedRefetch}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      const deleteButton = screen.getByTestId('modal-delete-btn');
      await userEvent.click(deleteButton);

      // Wait for the mutation to complete and side effects to trigger
      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
        expect(callOrder).toEqual(['refetchAgendaFolder', 'onClose']);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty agenda item ID', async () => {
      const mocks: MockedResponse[] = [
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

      const mocks: MockedResponse[] = [
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
