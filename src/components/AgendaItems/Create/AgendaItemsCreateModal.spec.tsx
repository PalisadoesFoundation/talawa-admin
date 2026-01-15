import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';

// eslint-disable-next-line no-restricted-imports -- Test file needs direct access for mocking
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AgendaItemsCreateModal from './AgendaItemsCreateModal';
// eslint-disable-next-line no-restricted-imports -- Test file needs direct access for mocking
import { toast } from 'react-toastify';
import convertToBase64 from 'utils/convertToBase64';
import type { MockedFunction } from 'vitest';
import { describe, test, expect, vi } from 'vitest';
import { mockFormState1, mockAgendaItemCategories } from '../AgendaItemsMocks';

let mockHideCreateModal: ReturnType<typeof vi.fn>;
let mockSetFormState: ReturnType<typeof vi.fn>;
let mockCreateAgendaItemHandler: ReturnType<typeof vi.fn>;
const mockT = (key: string): string => key;

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('utils/convertToBase64');
let mockedConvertToBase64: MockedFunction<typeof convertToBase64>;

describe('AgendaItemsCreateModal', () => {
  beforeEach(() => {
    mockHideCreateModal = vi.fn();
    mockSetFormState = vi.fn();
    mockCreateAgendaItemHandler = vi.fn();
    mockedConvertToBase64 = convertToBase64 as MockedFunction<
      typeof convertToBase64
    >;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders modal correctly', () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsCreateModal
                  agendaItemCreateModalIsOpen
                  hideCreateModal={mockHideCreateModal}
                  formState={mockFormState1}
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
    const mockFormState1 = {
      title: 'Test Title',
      description: 'Test Description',
      duration: '20',
      attachments: ['Test Attachment'],
      urls: ['https://example.com'],
      agendaItemCategoryIds: ['1'],
    };
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsCreateModal
                  agendaItemCreateModalIsOpen
                  hideCreateModal={mockHideCreateModal}
                  formState={mockFormState1}
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
      ...mockFormState1,
      title: 'New title',
    });
    expect(mockSetFormState).toHaveBeenCalledWith({
      ...mockFormState1,
      description: 'New description',
    });

    expect(mockSetFormState).toHaveBeenCalledWith({
      ...mockFormState1,
      duration: '30',
    });

    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalledWith({
        ...mockFormState1,
        urls: [],
      });
    });

    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalledWith({
        ...mockFormState1,
        attachments: [],
      });
    });
  });
  test('handleAddUrl correctly adds valid URL', async () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsCreateModal
                agendaItemCreateModalIsOpen
                hideCreateModal={mockHideCreateModal}
                formState={mockFormState1}
                setFormState={mockSetFormState}
                createAgendaItemHandler={mockCreateAgendaItemHandler}
                t={mockT}
                agendaItemCategories={[]}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    const urlInput = screen.getByTestId('urlInput');
    const linkBtn = screen.getByTestId('linkBtn');

    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    fireEvent.click(linkBtn);

    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalledWith({
        ...mockFormState1,
        urls: [...mockFormState1.urls, 'https://example.com'],
      });
    });
  });

  test('shows error toast for invalid URL', async () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsCreateModal
                  agendaItemCreateModalIsOpen
                  hideCreateModal={mockHideCreateModal}
                  formState={mockFormState1}
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

    const urlInput = screen.getByTestId('urlInput');
    const linkBtn = screen.getByTestId('linkBtn');

    fireEvent.change(urlInput, { target: { value: 'invalid-url' } });
    fireEvent.click(linkBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'invalidUrl',
        expect.any(Object),
      );
    });
  });

  test('shows error toast for file size exceeding limit', async () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsCreateModal
                  agendaItemCreateModalIsOpen
                  hideCreateModal={mockHideCreateModal}
                  formState={mockFormState1}
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

    const fileInput = screen.getByTestId('attachment');
    const largeFile = new File(
      ['a'.repeat(11 * 1024 * 1024)],
      'large-file.jpg',
    ); // 11 MB file

    Object.defineProperty(fileInput, 'files', {
      value: [largeFile],
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'fileSizeExceedsLimit',
        expect.any(Object),
      );
    });
  });

  test('adds files correctly when within size limit', async () => {
    mockedConvertToBase64.mockResolvedValue('base64-file');

    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsCreateModal
                  agendaItemCreateModalIsOpen
                  hideCreateModal={mockHideCreateModal}
                  formState={mockFormState1}
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

    const fileInput = screen.getByTestId('attachment');
    const smallFile = new File(['small-file-content'], 'small-file.jpg'); // Small file

    Object.defineProperty(fileInput, 'files', {
      value: [smallFile],
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalledWith({
        ...mockFormState1,
        attachments: [...mockFormState1.attachments, 'base64-file'],
      });
    });
  });
  test('renders autocomplete and selects categories correctly', async () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsCreateModal
                  agendaItemCreateModalIsOpen
                  hideCreateModal={mockHideCreateModal}
                  formState={mockFormState1}
                  setFormState={mockSetFormState}
                  createAgendaItemHandler={mockCreateAgendaItemHandler}
                  t={mockT}
                  agendaItemCategories={mockAgendaItemCategories}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    const autocomplete = screen.getByTestId('categorySelect');
    expect(autocomplete).toBeInTheDocument();

    const input = within(autocomplete).getByRole('combobox');
    fireEvent.mouseDown(input);

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(mockAgendaItemCategories.length);

    fireEvent.click(options[0]);
    fireEvent.click(options[1]);
  });
});
