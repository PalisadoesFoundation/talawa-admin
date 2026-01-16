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

import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DatePicker';

import AgendaItemsCreateModal from './AgendaItemsCreateModal';
import { describe, test, expect, vi } from 'vitest';
import { mockFormState1, mockAgendaItemCategories } from '../AgendaItemsMocks';

let mockHideCreateModal: ReturnType<typeof vi.fn>;
let mockSetFormState: ReturnType<typeof vi.fn>;
let mockCreateAgendaItemHandler: ReturnType<typeof vi.fn>;
const mockT = (key: string): string => key;

// Use vi.hoisted() to create mocks that survive vi.mock hoisting
const sharedMocks = vi.hoisted(() => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  uploadFileToMinio: vi.fn(),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: sharedMocks.NotificationToast,
}));

vi.mock('utils/MinioUpload', () => ({
  useMinioUpload: () => ({
    uploadFileToMinio: sharedMocks.uploadFileToMinio,
  }),
}));

describe('AgendaItemsCreateModal', () => {
  beforeEach(() => {
    mockHideCreateModal = vi.fn();
    mockSetFormState = vi.fn();
    mockCreateAgendaItemHandler = vi.fn();
    vi.clearAllMocks();
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

    // The useEffect uses functional updater, so we need to verify it was called with a function
    // and that the function correctly filters URLs and attachments
    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalledWith(expect.any(Function));
    });

    // Find the useEffect filter call and verify it filters both URLs and attachments
    const filterCall = mockSetFormState.mock.calls.find(
      (call) => typeof call[0] === 'function',
    );
    expect(filterCall).toBeDefined();

    if (filterCall) {
      const result = filterCall[0](mockFormState1);
      // The filter should remove empty strings from urls and attachments
      expect(result.urls).not.toContain('');
      expect(result.attachments).not.toContain('');
    }
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
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalledWith(
        'invalidUrl',
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
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalledWith(
        'fileSizeExceedsLimit',
      );
    });
  });

  test('shows error toast when file upload to MinIO fails', async () => {
    // Mock uploadFileToMinio to reject with an error
    sharedMocks.uploadFileToMinio.mockRejectedValue(new Error('Upload failed'));

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
    const smallFile = new File(['small-file-content'], 'small-file.jpg');

    Object.defineProperty(fileInput, 'files', {
      value: [smallFile],
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalledWith(
        'fileUploadError',
      );
    });
  });

  test('adds files correctly when within size limit', async () => {
    const mockMinioResult = {
      objectName: 'agendaItem/small-file.jpg',
      fileHash: 'abc123hash',
    };
    sharedMocks.uploadFileToMinio.mockResolvedValue(mockMinioResult);

    // Create clean form state without old-format attachments to avoid JSON parse errors
    const cleanFormState = {
      ...mockFormState1,
      attachments: [], // Start fresh - no pre-existing plain string attachments
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
                  formState={cleanFormState}
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
    const smallFile = new File(['small-file-content'], 'small-file.jpg');

    Object.defineProperty(fileInput, 'files', {
      value: [smallFile],
    });

    fireEvent.change(fileInput);

    // Wait for MinIO upload to be called
    await waitFor(() => {
      expect(sharedMocks.uploadFileToMinio).toHaveBeenCalledWith(
        smallFile,
        'agendaItem',
      );
    });

    // Wait for state update after upload completes
    // Expect at least 2 calls: one from useEffect, one from upload
    await waitFor(() => {
      const calls = mockSetFormState.mock.calls.filter(
        (call) => typeof call[0] === 'function',
      );
      expect(calls.length).toBeGreaterThanOrEqual(2);
    });

    // Get the LAST functional updater call (the one after upload, not useEffect)
    const setFormStateCalls = mockSetFormState.mock.calls.filter(
      (call) => typeof call[0] === 'function',
    );
    const lastSetFormStateCall =
      setFormStateCalls[setFormStateCalls.length - 1];

    expect(lastSetFormStateCall).toBeDefined();

    if (lastSetFormStateCall) {
      const result = lastSetFormStateCall[0](cleanFormState);

      // Verify attachments array has content before accessing
      expect(result.attachments.length).toBeGreaterThan(0);

      const newAttachment = result.attachments[result.attachments.length - 1];
      expect(typeof newAttachment).toBe('string');
      const parsed = JSON.parse(newAttachment);
      expect(parsed).toMatchObject({
        objectName: expect.any(String),
        fileHash: expect.any(String),
      });
    }
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
