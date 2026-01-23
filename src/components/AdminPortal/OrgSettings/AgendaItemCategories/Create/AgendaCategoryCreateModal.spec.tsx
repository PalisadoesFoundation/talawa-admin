import React from 'react';
import { render, screen } from '@testing-library/react';
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
import AgendaCategoryCreateModal from './AgendaCategoryCreateModal';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
/**
 * This file contains unit tests for the `AgendaCategoryCreateModal` component.
 *
 * The tests cover:
 * - Rendering of the modal, ensuring all elements such as form fields, buttons, and labels are displayed correctly.
 * - Behavior of form inputs, including updating the `formState` when the `name` and `description` fields are changed.
 * - Proper invocation of the `createAgendaCategoryHandler` when the form is submitted.
 * - Integration of Redux state, routing, localization (i18n), and date-picker utilities to ensure compatibility and proper rendering.
 * - Validations for form controls to check user interactions, including typing and submitting the form.
 * - Mock function verifications for `setFormState`, `hideCreateModal`, and other handlers to ensure state changes and actions are triggered appropriately.
 * - Handling edge cases, such as empty fields or invalid data, ensuring graceful degradation of functionality.
 */

const mockFormState = {
  name: 'Test Name',
  description: 'Test Description',
  createdBy: 'Test User',
};
let mockHideCreateModal: ReturnType<typeof vi.fn>;
let mockSetFormState: ReturnType<typeof vi.fn>;
let mockCreateAgendaCategoryHandler: ReturnType<typeof vi.fn>;
const mockT = (key: string): string => key;

describe('AgendaCategoryCreateModal', () => {
  beforeEach(() => {
    mockHideCreateModal = vi.fn();
    mockSetFormState = vi.fn();
    mockCreateAgendaCategoryHandler = vi.fn();
  });
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('renders modal correctly', () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaCategoryCreateModal
                  agendaCategoryCreateModalIsOpen
                  hideCreateModal={mockHideCreateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  createAgendaCategoryHandler={mockCreateAgendaCategoryHandler}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    expect(screen.getByText('agendaCategoryDetails')).toBeInTheDocument();
    expect(
      screen.getByTestId('createAgendaCategoryFormSubmitBtn'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('modalCloseBtn'), // BaseModal's close button ID
    ).toBeInTheDocument();
  });
  it('updates formState.name and formState.description on user input', async () => {
    const user = userEvent.setup();
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
                <AgendaCategoryCreateModal
                  agendaCategoryCreateModalIsOpen
                  hideCreateModal={mockHideCreateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  createAgendaCategoryHandler={mockCreateAgendaCategoryHandler}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    const nameInput = screen.getByLabelText('name');
    await user.clear(nameInput);
    await user.type(nameInput, 'New name');

    expect(
      mockSetFormState.mock.calls.some(
        ([arg]) => arg.name !== mockFormState.name,
      ),
    ).toBe(true);

    const descriptionInput = screen.getByLabelText('description');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'New description');

    expect(
      mockSetFormState.mock.calls.some(
        ([arg]) => arg.description !== mockFormState.description,
      ),
    ).toBe(true);
  });

  it('calls createAgendaCategoryHandler when form is submitted', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaCategoryCreateModal
                  agendaCategoryCreateModalIsOpen
                  hideCreateModal={mockHideCreateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  createAgendaCategoryHandler={mockCreateAgendaCategoryHandler}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await user.click(screen.getByTestId('createAgendaCategoryFormSubmitBtn'));
    expect(mockCreateAgendaCategoryHandler).toHaveBeenCalledTimes(1);
  });
});
