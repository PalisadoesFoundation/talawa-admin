import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import AgendaItemsDeleteModal from './AgendaItemsDeleteModal';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';

let mockToggleDeleteModal: ReturnType<typeof vi.fn>;
let mockDeleteAgendaItemHandler: ReturnType<typeof vi.fn>;
const mockT = (key: string): string => key;
const mockTCommon = (key: string): string => key;

describe('AgendaItemsDeleteModal', () => {
  beforeEach(() => {
    mockToggleDeleteModal = vi.fn();
    mockDeleteAgendaItemHandler = vi.fn();
    // Reset any manual timers
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (
    isOpen = true,
    toggleDelete = mockToggleDeleteModal,
    deleteHandler = mockDeleteAgendaItemHandler,
  ): RenderResult => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AgendaItemsDeleteModal
              agendaItemDeleteModalIsOpen={isOpen}
              toggleDeleteModal={toggleDelete}
              deleteAgendaItemHandler={deleteHandler}
              t={mockT}
              tCommon={mockTCommon}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );
  };

  // Basic Rendering Tests
  test('renders modal correctly when open', () => {
    renderComponent();
    expect(screen.getByText('deleteAgendaItem')).toBeInTheDocument();
    expect(screen.getByText('deleteAgendaItemMsg')).toBeInTheDocument();
    expect(screen.getByTestId('deleteAgendaItemCloseBtn')).toBeInTheDocument();
    expect(screen.getByTestId('deleteAgendaItemBtn')).toBeInTheDocument();
    expect(screen.getByText('no')).toBeInTheDocument();
    expect(screen.getByText('yes')).toBeInTheDocument();
  });

  test('modal should not be rendered when agendaItemDeleteModalIsOpen is false', () => {
    renderComponent(false);
    expect(screen.queryByText('deleteAgendaItem')).not.toBeInTheDocument();
    expect(screen.queryByTestId('deleteAgendaItemBtn')).not.toBeInTheDocument();
  });

  // Interaction Tests
  describe('User Interactions', () => {
    test('calls toggleDeleteModal when close button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();
      const closeButton = screen.getByTestId('deleteAgendaItemCloseBtn');
      await user.click(closeButton);
      expect(mockToggleDeleteModal).toHaveBeenCalledTimes(1);
    });

    test('calls deleteAgendaItemHandler when confirm button is clicked', async () => {
      renderComponent();
      const confirmButton = screen.getByTestId('deleteAgendaItemBtn');
      const user = userEvent.setup();
      await user.click(confirmButton);
      expect(mockDeleteAgendaItemHandler).toHaveBeenCalledTimes(1);
    });
  });

  test('calls toggleDeleteModal when modal header close button is clicked', async () => {
    renderComponent();
    const closeButton = screen.getByTestId('modalCloseBtn');
    await userEvent.click(closeButton);
    expect(mockToggleDeleteModal).toHaveBeenCalledTimes(1);
  });

  // Edge Cases
  test('handles rapid button clicks correctly', async () => {
    renderComponent();
    const confirmButton = screen.getByTestId('deleteAgendaItemBtn');
    const closeButton = screen.getByTestId('deleteAgendaItemCloseBtn');
    const user = userEvent.setup();

    // Simulate rapid clicks
    await user.click(confirmButton);
    await user.click(closeButton);
    await user.click(confirmButton);

    expect(mockDeleteAgendaItemHandler).toHaveBeenCalledTimes(2);
    expect(mockToggleDeleteModal).toHaveBeenCalledTimes(1);
  });

  test('handles keyboard events correctly', async () => {
    renderComponent();

    // Clear any previous calls to ensure clean state
    mockDeleteAgendaItemHandler.mockClear();
    mockToggleDeleteModal.mockClear();

    // Test Escape key - BaseModal has keyboard=true by default, so it will close
    screen.getByTestId('deleteAgendaItemModal');
    await userEvent.keyboard('{Escape}');

    // Verify Escape key triggers the close handler but NOT the delete handler
    expect(mockToggleDeleteModal).toHaveBeenCalled();
    expect(mockDeleteAgendaItemHandler).not.toHaveBeenCalled();

    // Test click on confirm button
    const confirmButton = screen.getByTestId('deleteAgendaItemBtn');
    confirmButton.focus();

    await userEvent.click(confirmButton);
    expect(mockDeleteAgendaItemHandler).toHaveBeenCalled();
  });

  test('handles multiple modal instances correctly', () => {
    // Render two instances of the modal
    render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AgendaItemsDeleteModal
              agendaItemDeleteModalIsOpen={true}
              toggleDeleteModal={mockToggleDeleteModal}
              deleteAgendaItemHandler={mockDeleteAgendaItemHandler}
              t={mockT}
              tCommon={mockTCommon}
            />
            <AgendaItemsDeleteModal
              agendaItemDeleteModalIsOpen={true}
              toggleDeleteModal={mockToggleDeleteModal}
              deleteAgendaItemHandler={mockDeleteAgendaItemHandler}
              t={mockT}
              tCommon={mockTCommon}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );

    // Verify both modals are rendered
    const deleteButtons = screen.getAllByTestId('deleteAgendaItemBtn');
    expect(deleteButtons).toHaveLength(2);
  });

  test('handles modal state transitions correctly', async () => {
    const { rerender } = renderComponent(true);

    // Verify initial open state
    expect(screen.getByTestId('deleteAgendaItemModal')).toBeInTheDocument();

    // Rerender with closed state
    rerender(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AgendaItemsDeleteModal
              agendaItemDeleteModalIsOpen={false}
              toggleDeleteModal={mockToggleDeleteModal}
              deleteAgendaItemHandler={mockDeleteAgendaItemHandler}
              t={mockT}
              tCommon={mockTCommon}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId('deleteAgendaItemModal'),
      ).not.toBeInTheDocument();
    });
  });

  // Accessibility Tests
  test('meets accessibility requirements', () => {
    renderComponent();

    // Verify modal has correct test id
    const modal = screen.getByTestId('deleteAgendaItemModal');
    expect(modal).toBeInTheDocument();

    const buttons = within(modal as HTMLElement).getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAccessibleName();
    });
  });
});
