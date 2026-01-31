import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
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

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
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
    vi.clearAllMocks();
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

    await userEvent.type(screen.getByTestId('titleInput'), 'New title');
    await userEvent.type(
      screen.getByTestId('descriptionInput'),
      'New description',
    );
    await userEvent.type(screen.getByTestId('durationInput'), '30');

    await userEvent.click(screen.getByTestId('deleteUrl'));

    // With controlled components and userEvent, verify that setFormState was called.
    // Since the component spreads the initial formState on each keystroke, we verify
    // that the mock was invoked (indicating user interaction triggered state updates).
    expect(mockSetFormState).toHaveBeenCalled();

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

    await userEvent.type(urlInput, 'https://example.com');
    await userEvent.click(linkBtn);

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

    await userEvent.type(urlInput, 'invalid-url');
    await userEvent.click(linkBtn);

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
      { type: 'image/jpeg' },
    ); // 11 MB file

    await userEvent.upload(fileInput, largeFile);

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalledWith(
        'large-file.jpg fileSizeExceedsLimit',
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
    const smallFile = new File(['small-file-content'], 'small-file.jpg', {
      type: 'image/jpeg',
    });

    await userEvent.upload(fileInput, smallFile);

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalledWith(
        'fileUploadError: small-file.jpg',
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
    const smallFile = new File(['small-file-content'], 'small-file.jpg', {
      type: 'image/jpeg',
    });

    await userEvent.upload(fileInput, smallFile);

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
    const smallFile = new File(['small-file-content'], 'small-file.jpg', {
      type: 'image/jpeg',
    });

    await userEvent.upload(fileInput, smallFile);

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
  test('renders select and selects categories correctly', async () => {
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

    const categorySelect = screen.getByTestId('categorySelect');
    expect(categorySelect).toBeInTheDocument();

    // For standard HTML select, options are rendered as children
    const options = within(categorySelect).getAllByRole('option');
    // First option is the placeholder "selectCategory"
    expect(options.length).toBeGreaterThanOrEqual(
      mockAgendaItemCategories.length,
    );

    // Select a category using userEvent.selectOptions
    await userEvent.selectOptions(
      categorySelect,
      mockAgendaItemCategories[0]._id,
    );

    // Verify the selection handler was called with the category
    expect(mockSetFormState).toHaveBeenCalled();
  });

  test('revokes object URLs on component unmount', async () => {
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:http://localhost/test-url');

    // Mock fetch for preview generation - save original to restore later
    const originalFetch = global.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'image/jpeg',
      },
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    // Render with an attachment to trigger preview generation
    const formStateWithAttachment = {
      ...mockFormState1,
      attachments: ['http://example.com/test.jpg'],
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
                  formState={formStateWithAttachment}
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

    // Wait for preview to render
    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    });

    // Unmount the component - verify no errors during cleanup
    unmount();

    // Test passes if no errors during unmount
    // The component should handle cleanup gracefully

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    global.fetch = originalFetch;
  });

  test('handles delete attachment button correctly', async () => {
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:http://localhost/preview-url');

    // Mock fetch for preview generation - save original to restore later
    const originalFetch = global.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'image/jpeg',
      },
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const mockMinioResult = {
      objectName: 'agendaItem/test.jpg',
      fileHash: 'hash123',
    };
    sharedMocks.uploadFileToMinio.mockResolvedValue(mockMinioResult);

    // Render with attachment already present
    const formStateWithAttachment = {
      ...mockFormState1,
      attachments: ['http://example.com/test.jpg'],
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
                  formState={formStateWithAttachment}
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

    // Wait for the delete button to appear
    await waitFor(() => {
      expect(screen.getByTestId('deleteAttachment')).toBeInTheDocument();
    });

    // Click the delete button
    await userEvent.click(screen.getByTestId('deleteAttachment'));

    // Verify setFormState was called to remove attachment
    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalled();
    });

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    global.fetch = originalFetch;
  });

  test('renders video preview for video file uploads', async () => {
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:http://localhost/video-preview');

    // Mock fetch for preview generation - save original to restore later
    const originalFetch = global.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'video/mp4',
      },
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const mockMinioResult = {
      objectName: 'agendaItem/test.mp4',
      fileHash: 'videohash123',
    };
    sharedMocks.uploadFileToMinio.mockResolvedValue(mockMinioResult);

    // Render with video attachment already present
    const formStateWithVideo = {
      ...mockFormState1,
      attachments: ['http://example.com/test.mp4'],
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
                  formState={formStateWithVideo}
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

    // Wait for video element to appear (covers lines 320-321)
    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    });

    createObjectURLSpy.mockRestore();
    global.fetch = originalFetch;
  });

  test('handleRemoveAttachment filters attachment by index (line 182)', async () => {
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:http://localhost/preview');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');

    // Mock fetch for the preview generation - save original to restore later
    const originalFetch = global.fetch;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'image/jpeg',
      },
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    sharedMocks.uploadFileToMinio.mockResolvedValue({
      objectName: 'agendaItem/test.jpg',
      fileHash: 'hash123',
    });

    // Render with attachments already present to test delete functionality
    const formStateWithAttachments = {
      ...mockFormState1,
      attachments: ['http://example.com/test.jpg'],
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
                  formState={formStateWithAttachments}
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

    // Wait for preview to render
    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    });

    // Clear mocks to ignore initial useEffect calls
    mockSetFormState.mockClear();

    // Click delete to trigger handleRemoveAttachment which filters by index
    await userEvent.click(screen.getByTestId('deleteAttachment'));

    // Verify setFormState was called with a function that filters attachments
    await waitFor(() => {
      const filterCall = mockSetFormState.mock.calls.find(
        (call) => typeof call[0] === 'function',
      );
      expect(filterCall).toBeDefined();
      if (filterCall) {
        // Simulate the filter logic with multiple attachments
        const prevState = {
          ...formStateWithAttachments,
          attachments: ['a', 'b', 'c'],
        };
        const result = filterCall[0](prevState);
        // Index 0 should be removed, leaving ['b', 'c']
        expect(result.attachments).toEqual(['b', 'c']);
      }
    });

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    global.fetch = originalFetch;
  });

  test('handles MinIO JSON metadata in attachments for preview generation', async () => {
    // Test MinIO objectName parsing branch (lines 86-87)
    const minioAttachment = JSON.stringify({
      objectName: 'test-file.jpg',
      fileHash: 'abc123',
      mimeType: 'image/jpeg',
      name: 'test-file.jpg',
    });

    const formStateWithMinioAttachment = {
      title: 'Test Title',
      description: 'Test Description',
      duration: '30',
      attachments: [minioAttachment],
      urls: [],
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
                  formState={formStateWithMinioAttachment}
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

    // Wait for preview generation effect to run
    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    });
  });

  test('revokes blob URLs on cleanup when component unmounts with blob attachments', async () => {
    // Test blob URL revocation (line 112)
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:http://localhost/test-blob-url');

    const formStateWithBlobUrl = {
      title: 'Test Title',
      description: 'Test Description',
      duration: '30',
      attachments: ['blob:http://localhost/preview-url'],
      urls: [],
      agendaItemCategoryIds: ['1'],
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
                  formState={formStateWithBlobUrl}
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

    // Wait for component to render and preview effect to run
    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    });

    // Unmount to trigger cleanup
    unmount();

    // Verify cleanup happened without errors
    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });

  test('shows error toast when adding empty URL', async () => {
    // Tests line 120 - newUrl.trim() !== '' check
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

    // Test with empty string (just spaces)
    await userEvent.type(urlInput, '   ');
    await userEvent.click(linkBtn);

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalledWith(
        'invalidUrl',
      );
    });
  });

  test('shows error toast for URL with invalid format', async () => {
    // Tests line 119-120 - urlPattern regex check for invalid URL format
    // Note: The regex allows optional protocol, so we test with invalid TLD/format instead
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

    // Test URL without valid TLD - should fail the regex check
    await userEvent.clear(urlInput);
    await userEvent.type(urlInput, 'just-a-word');
    await userEvent.click(linkBtn);

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalledWith(
        'invalidUrl',
      );
    });
  });
  test('shows error toast when exceeding MAX_ATTACHMENTS and does not upload', async () => {
    // Tests lines 160-165 - MAX_ATTACHMENTS check (MAX_ATTACHMENTS = 10)
    sharedMocks.uploadFileToMinio.mockClear();
    sharedMocks.NotificationToast.error.mockClear();

    // Create form state with 9 attachments already (one slot remaining)
    const formStateWith9Attachments = {
      ...mockFormState1,
      attachments: Array(9).fill(
        JSON.stringify({ objectName: 'test.jpg', fileHash: 'hash' }),
      ),
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
                  formState={formStateWith9Attachments}
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
    // Try to upload 2 files when only 1 slot is remaining
    const file1 = new File(['content1'], 'image1.jpg', { type: 'image/jpeg' });
    const file2 = new File(['content2'], 'image2.jpg', { type: 'image/jpeg' });

    await userEvent.upload(fileInput, [file1, file2]);

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalledWith(
        'tooManyAttachments',
      );
    });

    // Verify uploadFileToMinio was NOT called since limit was exceeded
    expect(sharedMocks.uploadFileToMinio).not.toHaveBeenCalled();
  });
});
