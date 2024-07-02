import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AgendaItemsCreateModal from './AgendaItemsCreateModal';

const mockFormState = {
  title: 'Test Title',
  description: 'Test Description',
  duration: '20',
  attachments: ['Test Attachment'],
  urls: ['https://example.com'],
  agendaItemCategoryIds: ['category'],
};
const mockHideCreateModal = jest.fn();
const mockSetFormState = jest.fn();
const mockCreateAgendaItemHandler = jest.fn();
const mockT = (key: string): string => key;
// const mockAgendaItemCategories = [
//   {
//     name: 'Test Name',
//     description: 'Test Description',
//     createdBy: 'Test User',
//   },
// ];

describe('AgendaItemsCreateModal', () => {
  test('renders modal correctly', () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsCreateModal
                  agendaItemCreateModalIsOpen
                  hideCreateModal={mockHideCreateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  createAgendaItemHandler={mockCreateAgendaItemHandler}
                  t={mockT}
                  agendaItemCategories={[]}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    expect(screen.getByText('agendaItemDetails')).toBeInTheDocument();
    expect(screen.getByTestId('createAgendaItemFormBtn')).toBeInTheDocument();
    expect(
      screen.getByTestId('createAgendaItemModalCloseBtn'),
    ).toBeInTheDocument();
  });

  test('tests the condition for formState', async () => {
    const mockFormState = {
      title: 'Test Title',
      description: 'Test Description',
      duration: '20',
      attachments: ['Test Attachment'],
      urls: ['https://example.com'],
      agendaItemCategoryIds: ['1'],
    };
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsCreateModal
                  agendaItemCreateModalIsOpen
                  hideCreateModal={mockHideCreateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  createAgendaItemHandler={mockCreateAgendaItemHandler}
                  t={mockT}
                  agendaItemCategories={[]}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    fireEvent.change(screen.getByLabelText('title'), {
      target: { value: 'New title' },
    });

    fireEvent.change(screen.getByLabelText('description'), {
      target: { value: 'New description' },
    });

    fireEvent.change(screen.getByLabelText('duration'), {
      target: { value: '30' },
    });

    fireEvent.click(screen.getByTestId('deleteUrl'));
    fireEvent.click(screen.getByTestId('deleteAttachment'));

    expect(mockSetFormState).toHaveBeenCalledWith({
      ...mockFormState,
      title: 'New title',
    });
    expect(mockSetFormState).toHaveBeenCalledWith({
      ...mockFormState,
      description: 'New description',
    });

    expect(mockSetFormState).toHaveBeenCalledWith({
      ...mockFormState,
      duration: '30',
    });

    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalledWith({
        ...mockFormState,
        urls: [],
      });
    });

    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalledWith({
        ...mockFormState,
        attachments: [],
      });
    });
  });
});
