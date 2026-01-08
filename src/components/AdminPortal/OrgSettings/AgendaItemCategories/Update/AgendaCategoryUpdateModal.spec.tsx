import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import AgendaCategoryUpdateModal from './AgendaCategoryUpdateModal';
import { vi } from 'vitest';

/**
 * Unit tests for `AgendaCategoryUpdateModal`:
 *
 * - **Rendering**: Verifies key elements (e.g., text, buttons) render correctly.
 * - **Close Button**: Ensures `hideUpdateModal` is called on close.
 * - **Form Inputs**: Confirms `setFormState` updates with new `name` and `description`.
 * - **Submission**: Checks `updateAgendaCategoryHandler` triggers on submit.
 * - **Integration**: Validates compatibility with Redux, routing, i18n, and MUI date-picker.
 * - **Mocks**: Ensures handlers (`setFormState`, `hideUpdateModal`, `updateAgendaCategoryHandler`) are called with correct arguments.
 *
 * This suite ensures component reliability and behavior consistency.
 */

const mockFormState = {
  name: 'Test Name',
  description: 'Test Description',
  createdBy: 'Test User',
};
let mockHideUpdateModal: ReturnType<typeof vi.fn>;
let mockSetFormState: ReturnType<typeof vi.fn>;
let mockUpdateAgendaCategoryHandler: ReturnType<typeof vi.fn>;
const mockT = (key: string): string => key;

describe('AgendaCategoryUpdateModal', () => {
  beforeEach(() => {
    mockHideUpdateModal = vi.fn();
    mockSetFormState = vi.fn();
    mockUpdateAgendaCategoryHandler = vi.fn();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders modal correctly', () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaCategoryUpdateModal
                  agendaCategoryUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateAgendaCategoryHandler={mockUpdateAgendaCategoryHandler}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    expect(screen.getByText('updateAgendaCategory')).toBeInTheDocument();
    expect(screen.getByTestId('editAgendaCategoryBtn')).toBeInTheDocument();
    expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
  });

  it('calls hideUpdateModal when close button is clicked', async () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <BrowserRouter>
                <AgendaCategoryUpdateModal
                  agendaCategoryUpdateModalIsOpen={true}
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateAgendaCategoryHandler={mockUpdateAgendaCategoryHandler}
                  t={mockT}
                />
              </BrowserRouter>
            </LocalizationProvider>
          </I18nextProvider>
        </Provider>
      </MockedProvider>,
    );

    await userEvent.click(screen.getByTestId('modalCloseBtn'));
    expect(mockHideUpdateModal).toHaveBeenCalledTimes(1);
  });

  it('tests the condition for formState.name and formState.description', () => {
    const mockFormState = {
      name: 'Test Name',
      description: 'Test Description',
      createdBy: 'Test User',
    };
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaCategoryUpdateModal
                  agendaCategoryUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateAgendaCategoryHandler={mockUpdateAgendaCategoryHandler}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    const nameInput = screen.getByLabelText('name');
    fireEvent.change(nameInput, {
      target: { value: 'New name' },
    });
    const descriptionInput = screen.getByLabelText('description');
    fireEvent.change(descriptionInput, {
      target: { value: 'New description' },
    });
    expect(mockSetFormState).toHaveBeenCalledWith({
      ...mockFormState,
      name: 'New name',
    });
    expect(mockSetFormState).toHaveBeenCalledWith({
      ...mockFormState,
      description: 'New description',
    });
  });

  it('calls updateAgendaCategoryHandler when form is submitted', () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaCategoryUpdateModal
                  agendaCategoryUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateAgendaCategoryHandler={mockUpdateAgendaCategoryHandler}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    fireEvent.submit(screen.getByTestId('editAgendaCategoryBtn'));
    expect(mockUpdateAgendaCategoryHandler).toHaveBeenCalledTimes(1);
  });
});
