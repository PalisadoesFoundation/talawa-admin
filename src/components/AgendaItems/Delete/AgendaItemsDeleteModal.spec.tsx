import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import AgendaItemsDeleteModal from './AgendaItemsDeleteModal';
import { describe, test, expect, vi, beforeEach } from 'vitest';

const mockToggleDeleteModal = vi.fn();
const mockDeleteAgendaItemHandler = vi.fn();
const mockT = (key: string): string => key;
const mockTCommon = (key: string): string => key;

describe('AgendaItemsDeleteModal', () => {
  // Clear all mock function calls before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to render the component with necessary providers and props
  const renderComponent = (isOpen = true): RenderResult => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AgendaItemsDeleteModal
              agendaItemDeleteModalIsOpen={isOpen}
              toggleDeleteModal={mockToggleDeleteModal}
              deleteAgendaItemHandler={mockDeleteAgendaItemHandler}
              t={mockT}
              tCommon={mockTCommon}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );
  };

  // Test case: Verify that all expected elements are rendered when modal is open
  test('renders modal correctly when open', () => {
    renderComponent();
    // Check for presence of modal title, message, and buttons
    expect(screen.getByText('deleteAgendaItem')).toBeInTheDocument();
    expect(screen.getByText('deleteAgendaItemMsg')).toBeInTheDocument();
    expect(screen.getByTestId('deleteAgendaItemCloseBtn')).toBeInTheDocument();
    expect(screen.getByTestId('deleteAgendaItemBtn')).toBeInTheDocument();
    expect(screen.getByText('no')).toBeInTheDocument();
    expect(screen.getByText('yes')).toBeInTheDocument();
  });

  // Test case: Verify that close button click triggers toggleDeleteModal
  test('calls toggleDeleteModal when close button is clicked', () => {
    renderComponent();
    const closeButton = screen.getByTestId('deleteAgendaItemCloseBtn');
    fireEvent.click(closeButton);
    expect(mockToggleDeleteModal).toHaveBeenCalledTimes(1);
  });

  // Test case: Verify that confirm button click triggers deleteAgendaItemHandler
  test('calls deleteAgendaItemHandler when confirm button is clicked', () => {
    renderComponent();
    const confirmButton = screen.getByTestId('deleteAgendaItemBtn');
    fireEvent.click(confirmButton);
    expect(mockDeleteAgendaItemHandler).toHaveBeenCalledTimes(1);
  });

  // Test case: Verify that modal header close button click triggers toggleDeleteModal
  test('calls toggleDeleteModal when modal header close button is clicked', () => {
    renderComponent();
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockToggleDeleteModal).toHaveBeenCalledTimes(1);
  });

  // Test case: Verify that modal is not rendered when isOpen is false
  test('modal should not be rendered when agendaItemDeleteModalIsOpen is false', () => {
    renderComponent(false);
    const modalTitle = screen.queryByText('deleteAgendaItem');
    expect(modalTitle).not.toBeInTheDocument();
  });
});
