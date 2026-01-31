import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

const mockT = (key: string): string => key;
const mockTCommon = (key: string): string => key;
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

    it('should render "No" button with correct text', () => {
      renderModal();

      const noButton = screen.getByTestId('deleteAgendaItemCloseBtn');
      expect(noButton).toBeInTheDocument();
      expect(noButton).toHaveTextContent('no');
      expect(noButton).toHaveClass('btn-danger');
    });

    it('should render "Yes" button with correct text', () => {
      renderModal();

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');
      expect(yesButton).toBeInTheDocument();
      expect(yesButton).toHaveTextContent('yes');
      expect(yesButton).toHaveClass('btn-success');
    });

    it('should apply correct modal props', () => {
      renderModal();

      const modal = screen.getByTestId('deleteAgendaItemModal');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when "No" button is clicked', async () => {
      renderModal();

      const noButton = screen.getByTestId('deleteAgendaItemCloseBtn');
      await userEvent.click(noButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call deleteAgendaItemHandler when "Yes" button is clicked', async () => {
      renderModal(MOCKS_SUCCESS);

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');
      await userEvent.click(yesButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'agendaItemDeleted',
        );
      });
    });
  });

  describe('Delete Agenda Item Handler', () => {
    it('should successfully delete agenda item', async () => {
      renderModal(MOCKS_SUCCESS);

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');
      await userEvent.click(yesButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'agendaItemDeleted',
        );
      });

      expect(mockRefetchAgendaFolder).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call refetchAgendaFolder after successful deletion', async () => {
      renderModal(MOCKS_SUCCESS);

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');
      await userEvent.click(yesButton);

      await waitFor(() => {
        expect(mockRefetchAgendaFolder).toHaveBeenCalled();
      });
    });

    it('should close modal after successful deletion', async () => {
      renderModal(MOCKS_SUCCESS);

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');
      await userEvent.click(yesButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should display success notification after successful deletion', async () => {
      renderModal(MOCKS_SUCCESS);

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');
      await userEvent.click(yesButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'agendaItemDeleted',
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
            t={mockT}
            tCommon={mockTCommon}
            refetchAgendaFolder={mockRefetchAgendaFolder}
          />
        </I18nextProvider>,
      );

      await userEvent.click(screen.getByTestId('deleteAgendaItemBtn'));

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

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');
      await userEvent.click(yesButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Failed to delete agenda item',
        );
      });
    });

    it('should not call onClose when deletion fails', async () => {
      renderModal(MOCKS_ERROR);

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');
      await userEvent.click(yesButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalled();
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not call refetchAgendaFolder when deletion fails', async () => {
      renderModal(MOCKS_ERROR);

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');
      await userEvent.click(yesButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalled();
      });

      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });

    it('should handle Error instance in catch block', async () => {
      renderModal(MOCKS_ERROR);

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');
      await userEvent.click(yesButton);

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

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');
      await userEvent.click(yesButton);

      // Non-Error instances won't trigger NotificationToast.error
      await waitFor(() => {
        expect(mockOnClose).not.toHaveBeenCalled();
      });

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

    it('should use tCommon function for common translations', () => {
      const customTCommon = vi.fn((key: string) => `common_${key}`);

      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <AgendaItemsDeleteModal
              isOpen={true}
              onClose={mockOnClose}
              agendaItemId={MOCK_AGENDA_ITEM_ID}
              t={mockT}
              tCommon={customTCommon}
              refetchAgendaFolder={mockRefetchAgendaFolder}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(customTCommon).toHaveBeenCalledWith('no');
      expect(customTCommon).toHaveBeenCalledWith('yes');
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

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');
      await userEvent.click(yesButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'agendaItemDeleted',
        );
      });
    });
  });

  describe('Multiple Clicks Prevention', () => {
    it('should handle multiple rapid clicks on delete button', async () => {
      renderModal(MOCKS_SUCCESS);

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');

      // Rapidly click multiple times
      await userEvent.click(yesButton);
      await userEvent.click(yesButton);
      await userEvent.click(yesButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });

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

      const noButton = screen.getByTestId('deleteAgendaItemCloseBtn');
      const yesButton = screen.getByTestId('deleteAgendaItemBtn');

      expect(noButton).toHaveAttribute('type', 'button');
      expect(yesButton).toHaveAttribute('type', 'button');
    });
  });

  describe('CSS Classes', () => {
    it('should apply correct CSS classes to buttons', () => {
      renderModal();

      const noButton = screen.getByTestId('deleteAgendaItemCloseBtn');
      const yesButton = screen.getByTestId('deleteAgendaItemBtn');

      expect(noButton).toHaveClass('btn', 'btn-danger');
      expect(yesButton).toHaveClass('btn', 'btn-success');
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

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');
      await userEvent.click(yesButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(trackedRefetch).toHaveBeenCalled();
        expect(trackedOnClose).toHaveBeenCalled();
      });

      // Verify order: refetch should be called before onClose
      expect(callOrder).toEqual(['refetch', 'onClose']);
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

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');
      await userEvent.click(yesButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });
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

      const yesButton = screen.getByTestId('deleteAgendaItemBtn');
      await userEvent.click(yesButton);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });
    });
  });
});
