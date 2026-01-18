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

  test('filters out empty URLs and attachments on mount', async () => {
    // URLs use trim() !== '', attachments use att !== ''
    const mockFormStateWithEmptyEntries = {
      title: 'Test Title',
      description: 'Test Description',
      duration: '20',
      attachments: ['valid-attachment', ''],
      urls: ['https://valid.com', '', '   '],
      agendaItemCategoryIds: [],
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
                  formState={mockFormStateWithEmptyEntries}
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

    // The useEffect should filter out empty entries
    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalledWith(expect.any(Function));
    });

    // Verify the filter function was called with the correct logic
    const setFormStateCalls = mockSetFormState.mock.calls;
    const filterCall = setFormStateCalls.find(
      (call) => typeof call[0] === 'function',
    );
    if (filterCall) {
      const filterFn = filterCall[0];
      const result = filterFn(mockFormStateWithEmptyEntries);
      // URLs filter uses trim(), so whitespace-only strings are filtered
      expect(result.urls).toEqual(['https://valid.com']);
      // Attachments filter only checks !== '', so only empty strings are filtered
      expect(result.attachments).toEqual(['valid-attachment']);
    }
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
    expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
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

  test('handles case when uploadFileToMinio returns null', async () => {
    // Mock uploadFileToMinio to return null (no result)
    sharedMocks.uploadFileToMinio.mockResolvedValue(null);

    const cleanFormState = {
      ...mockFormState1,
      attachments: [],
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

    // Wait for upload to be called
    await waitFor(() => {
      expect(sharedMocks.uploadFileToMinio).toHaveBeenCalledWith(
        smallFile,
        'agendaItem',
      );
    });

    // Verify that no error toast was shown (upload didn't throw)
    expect(sharedMocks.NotificationToast.error).not.toHaveBeenCalledWith(
      'fileUploadError',
    );
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

  test('revokes object URLs on component unmount', async () => {
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:http://localhost/test-url');

    const mockMinioResult = {
      objectName: 'agendaItem/test.jpg',
      fileHash: 'hash123',
    };
    sharedMocks.uploadFileToMinio.mockResolvedValue(mockMinioResult);

    const cleanFormState = {
      ...mockFormState1,
      attachments: [],
    };

    const { unmount } = render(
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
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    Object.defineProperty(fileInput, 'files', {
      value: [testFile],
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(sharedMocks.uploadFileToMinio).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(createObjectURLSpy).toHaveBeenCalled();
    });

    // Unmount the component
    unmount();

    // Verify cleanup effect runs - revokeObjectURL should be called
    expect(revokeObjectURLSpy).toHaveBeenCalledWith(
      'blob:http://localhost/test-url',
    );

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });

  test('handles delete attachment button correctly', async () => {
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:http://localhost/preview-url');

    const mockMinioResult = {
      objectName: 'agendaItem/test.jpg',
      fileHash: 'hash123',
    };
    sharedMocks.uploadFileToMinio.mockResolvedValue(mockMinioResult);

    const cleanFormState = {
      ...mockFormState1,
      attachments: [],
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
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    Object.defineProperty(fileInput, 'files', {
      value: [testFile],
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(sharedMocks.uploadFileToMinio).toHaveBeenCalled();
    });

    // Wait for the delete button to appear
    await waitFor(() => {
      expect(screen.getByTestId('deleteAttachment')).toBeInTheDocument();
    });

    // Click the delete button
    fireEvent.click(screen.getByTestId('deleteAttachment'));

    // Verify revokeObjectURL is called when removing attachment
    await waitFor(() => {
      expect(revokeObjectURLSpy).toHaveBeenCalledWith(
        'blob:http://localhost/preview-url',
      );
    });

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });

  test('renders video preview for video file uploads', async () => {
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:http://localhost/video-preview');

    const mockMinioResult = {
      objectName: 'agendaItem/test.mp4',
      fileHash: 'videohash123',
    };
    sharedMocks.uploadFileToMinio.mockResolvedValue(mockMinioResult);

    const cleanFormState = {
      ...mockFormState1,
      attachments: [],
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
    // Use video MIME type to trigger video preview rendering (lines 320-321)
    const videoFile = new File(['video content'], 'test.mp4', {
      type: 'video/mp4',
    });

    Object.defineProperty(fileInput, 'files', {
      value: [videoFile],
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(sharedMocks.uploadFileToMinio).toHaveBeenCalled();
    });

    // Wait for video element to appear (covers lines 320-321)
    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    });

    createObjectURLSpy.mockRestore();
  });
});
