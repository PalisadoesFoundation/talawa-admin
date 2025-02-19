import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import AgendaItemsDeleteModal from './AgendaItemsDeleteModal';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

const mockToggleDeleteModal = vi.fn();
const mockDeleteAgendaItemHandler = vi.fn();
const mockT = (key: string): string => key;
const mockTCommon = (key: string): string => key;

describe('AgendaItemsDeleteModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset any manual timers
    vi.useRealTimers();
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
  test('calls toggleDeleteModal when close button is clicked', async () => {
    renderComponent();
    const closeButton = screen.getByTestId('deleteAgendaItemCloseBtn');
    await userEvent.click(closeButton);
    expect(mockToggleDeleteModal).toHaveBeenCalledTimes(1);
  });

  test('calls deleteAgendaItemHandler when confirm button is clicked', async () => {
    renderComponent();
    const confirmButton = screen.getByTestId('deleteAgendaItemBtn');
    await userEvent.click(confirmButton);
    expect(mockDeleteAgendaItemHandler).toHaveBeenCalledTimes(1);
  });

  test('calls toggleDeleteModal when modal header close button is clicked', async () => {
    renderComponent();
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);
    expect(mockToggleDeleteModal).toHaveBeenCalledTimes(1);
  });

  // Edge Cases
  test('handles rapid button clicks correctly', async () => {
    renderComponent();
    const confirmButton = screen.getByTestId('deleteAgendaItemBtn');
    const closeButton = screen.getByTestId('deleteAgendaItemCloseBtn');

    // Simulate rapid clicks
    await userEvent.click(confirmButton);
    await userEvent.click(closeButton);
    await userEvent.click(confirmButton);

    expect(mockDeleteAgendaItemHandler).toHaveBeenCalledTimes(2);
    expect(mockToggleDeleteModal).toHaveBeenCalledTimes(1);
  });

  test('handles keyboard events correctly', async () => {
    renderComponent();

    // Test Escape key
    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Escape',
      code: 'Escape',
    });
    expect(mockToggleDeleteModal).not.toHaveBeenCalled(); // Should not close as backdrop is static

    // Test Enter key on confirm button
    const confirmButton = screen.getByTestId('deleteAgendaItemBtn');
    confirmButton.focus();

    fireEvent.click(confirmButton);
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
    expect(screen.getByRole('dialog')).toBeInTheDocument();

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

    // Wait for the modal to be removed from the DOM
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  // Accessibility Tests
  test('meets accessibility requirements', () => {
    renderComponent();

    // Verify modal has correct ARIA attributes
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Verify buttons have accessible names
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAccessibleName();
    });
  });
});
