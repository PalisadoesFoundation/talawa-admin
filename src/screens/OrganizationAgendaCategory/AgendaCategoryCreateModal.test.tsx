import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AgendaCategoryCreateModal from './AgendaCategoryCreateModal';

const mockFormState = {
  name: 'Test Name',
  description: 'Test Description',
  createdBy: 'Test User',
};
const mockHideCreateModal = jest.fn();
const mockSetFormState = jest.fn();
const mockCreateAgendaCategoryHandler = jest.fn();
const mockT = (key: string): string => key;

describe('AgendaCategoryCreateModal', () => {
  test('renders modal correctly', () => {
    render(
      <MockedProvider addTypename={false}>
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
      screen.getByTestId('createAgendaCategoryModalCloseBtn'),
    ).toBeInTheDocument();
  });
  test('tests the condition for formState.name and formState.description', () => {
    const mockFormState = {
      name: 'Test Name',
      description: 'Test Description',
      createdBy: 'Test User',
    };
    render(
      <MockedProvider addTypename={false}>
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
  test('calls createAgendaCategoryHandler when form is submitted', () => {
    render(
      <MockedProvider addTypename={false}>
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

    fireEvent.submit(screen.getByTestId('createAgendaCategoryFormSubmitBtn'));
    expect(mockCreateAgendaCategoryHandler).toHaveBeenCalledTimes(1);
  });
});
