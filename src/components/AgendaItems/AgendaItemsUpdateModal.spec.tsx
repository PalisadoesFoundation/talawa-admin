import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AgendaItemsUpdateModal from './AgendaItemsUpdateModal';
import { toast } from 'react-toastify';
import convertToBase64 from 'utils/convertToBase64';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

const mockFormState = {
  title: 'Test Title',
  description: 'Test Description',
  duration: '20',
  attachments: ['Test Attachment'],
  urls: ['https://example.com'],
  agendaItemCategoryIds: ['category'],
  agendaItemCategoryNames: ['category'],
  createdBy: {
    firstName: 'Test',
    lastName: 'User',
  },
};

const mockHideUpdateModal = vi.fn();
const mockSetFormState = vi.fn();
const mockUpdateAgendaItemHandler = vi.fn();
const mockT = (key: string, options?: Record<string, unknown>): string => {
  if (options) return `${key} ${JSON.stringify(options)}`;
  return key;
};

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock('utils/convertToBase64', () => ({
  default: vi.fn().mockResolvedValue('base64-file'),
}));

describe('AgendaItemsUpdateModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test('renders modal correctly', () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateAgendaItemHandler={mockUpdateAgendaItemHandler}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    expect(screen.getByText('updateAgendaItem')).toBeInTheDocument();
    expect(screen.getByTestId('updateAgendaItemBtn')).toBeInTheDocument();
    expect(
      screen.getByTestId('updateAgendaItemModalCloseBtn'),
    ).toBeInTheDocument();
  });

  test('calls hideUpdateModal when close button is clicked', async () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateAgendaItemHandler={mockUpdateAgendaItemHandler}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('updateAgendaItemModalCloseBtn'));

    await waitFor(() => {
      expect(mockHideUpdateModal).toHaveBeenCalled();
    });
  });

  test('updates form state when title is changed', async () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateAgendaItemHandler={mockUpdateAgendaItemHandler}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    const titleInput = screen.getByLabelText('title');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalledWith({
        ...mockFormState,
        title: 'New Title',
      });
    });
  });

  test('shows error toast for invalid URL', async () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateAgendaItemHandler={mockUpdateAgendaItemHandler}
                  t={mockT}
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
      expect(toast.error).toHaveBeenCalledWith('invalidUrl');
    });
  });

  test('shows error toast for file size exceeding limit', async () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateAgendaItemHandler={mockUpdateAgendaItemHandler}
                  t={mockT}
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

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('fileSizeExceedsLimit');
    });
  });

  test('adds files correctly when within size limit', async () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateAgendaItemHandler={mockUpdateAgendaItemHandler}
                  t={mockT}
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

    fireEvent.change(fileInput, { target: { files: [smallFile] } });

    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalledWith({
        ...mockFormState,
        attachments: [...mockFormState.attachments, 'base64-file'],
      });
    });
  });

  test('calls updateAgendaItemHandler on form submission', async () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateAgendaItemHandler={mockUpdateAgendaItemHandler}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('updateAgendaItemBtn'));

    await waitFor(() => {
      expect(mockUpdateAgendaItemHandler).toHaveBeenCalled();
    });
  });

  test('shows error toast when form is submitted with empty title', async () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={{ ...mockFormState, title: '' }} // Empty title
                  setFormState={mockSetFormState}
                  updateAgendaItemHandler={mockUpdateAgendaItemHandler}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('updateAgendaItemBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Title is required');
    });
  });

  test('shows error toast when file conversion fails', async () => {
    vi.mocked(convertToBase64).mockRejectedValue(
      new Error('Conversion failed'),
    );

    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateAgendaItemHandler={mockUpdateAgendaItemHandler}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    const fileInput = screen.getByTestId('attachment');
    const smallFile = new File(['small-file-content'], 'small-file.jpg');

    Object.defineProperty(fileInput, 'files', {
      value: [smallFile],
    });

    fireEvent.change(fileInput, { target: { files: [smallFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to convert file');
    });
  });

  test('handles multiple URLs correctly', async () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateAgendaItemHandler={mockUpdateAgendaItemHandler}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    const urlInput = screen.getByTestId('urlInput');
    const linkBtn = screen.getByTestId('linkBtn');

    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    fireEvent.click(linkBtn);

    fireEvent.change(urlInput, { target: { value: 'https://another.com' } });
    fireEvent.click(linkBtn);

    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalledWith({
        ...mockFormState,
        urls: [
          ...mockFormState.urls,
          'https://example.com',
          'https://another.com',
        ],
      });
    });
  });

  test('handles multiple attachments correctly', async () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState}
                  setFormState={mockSetFormState}
                  updateAgendaItemHandler={mockUpdateAgendaItemHandler}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    const fileInput = screen.getByTestId('attachment');
    const smallFile1 = new File(['small-file-content-1'], 'small-file-1.jpg');
    const smallFile2 = new File(['small-file-content-2'], 'small-file-2.jpg');

    Object.defineProperty(fileInput, 'files', {
      value: [smallFile1, smallFile2],
    });

    fireEvent.change(fileInput, {
      target: { files: [smallFile1, smallFile2] },
    });

    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalledWith({
        ...mockFormState,
        attachments: [
          ...mockFormState.attachments,
          'base64-file',
          'base64-file',
        ],
      });
    });
  });

  test('shows error toast for invalid duration', async () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={{ ...mockFormState, duration: '-10' }} // Invalid duration
                  setFormState={mockSetFormState}
                  updateAgendaItemHandler={mockUpdateAgendaItemHandler}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('updateAgendaItemBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Duration must be a positive number',
      );
    });
  });
});
