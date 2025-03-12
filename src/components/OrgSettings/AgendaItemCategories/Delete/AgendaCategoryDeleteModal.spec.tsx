import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AgendaCategoryDeleteModal from './AgendaCategoryDeleteModal';
import { vi } from 'vitest'; // Use Vitest's mocking utility

/**
 * This file contains unit tests for the `AgendaCategoryDeleteModal` component.
 *
 * The tests cover:
 * - Rendering of the modal when open.
 * - Ensuring the modal is not rendered when closed.
 * - Verifying that the `toggleDeleteModal` function is called when the "No" button is clicked.
 * - Verifying that the `deleteAgendaCategoryHandler` function is called when the "Yes" button is clicked.
 */

// Mock functions
const mockToggleDeleteModal = vi.fn();
const mockDeleteAgendaCategoryHandler = vi.fn();
const mockT = (key: string): string => key;

const renderComponent = (isOpen: boolean): ReturnType<typeof render> => {
  return render(
    <MockedProvider addTypename={false}>
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <AgendaCategoryDeleteModal
                agendaCategoryDeleteModalIsOpen={isOpen}
                toggleDeleteModal={mockToggleDeleteModal}
                deleteAgendaCategoryHandler={mockDeleteAgendaCategoryHandler}
                t={mockT}
                tCommon={mockT}
              />
            </LocalizationProvider>
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('AgendaCategoryDeleteModal Component', () => {
  test('renders modal when open', () => {
    renderComponent(true);
    expect(screen.getByText('deleteAgendaCategory')).toBeInTheDocument();
    expect(screen.getByText('deleteAgendaCategoryMsg')).toBeInTheDocument();
  });

  test('modal is not rendered when closed', () => {
    renderComponent(false);
    expect(screen.queryByText('deleteAgendaCategory')).not.toBeInTheDocument();
  });

  test("calls toggleDeleteModal when 'No' button is clicked", () => {
    renderComponent(true);
    fireEvent.click(screen.getByTestId('deleteAgendaCategoryCloseBtn'));
    expect(mockToggleDeleteModal).toHaveBeenCalledTimes(1);
  });

  test("calls deleteAgendaCategoryHandler when 'Yes' button is clicked", () => {
    renderComponent(true);
    fireEvent.click(screen.getByTestId('deleteAgendaCategoryBtn'));
    expect(mockDeleteAgendaCategoryHandler).toHaveBeenCalledTimes(1);
  });
});
