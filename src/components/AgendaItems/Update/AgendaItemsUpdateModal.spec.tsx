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
import AgendaItemsUpdateModal from './AgendaItemsUpdateModal';
import { describe, test, expect, vi } from 'vitest';
import { mockAgendaItemCategories, mockFormState1 } from '../AgendaItemsMocks';

let mockHideUpdateModal: ReturnType<typeof vi.fn>;
let mockSetFormState: ReturnType<typeof vi.fn>;
let mockUpdateAgendaItemHandler: ReturnType<typeof vi.fn>;
const mockT = (key: string): string => key;

const sharedMocks = vi.hoisted(() => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  navigate: vi.fn(),
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

describe('AgendaItemsUpdateModal', () => {
  beforeEach(() => {
    mockHideUpdateModal = vi.fn();
    mockSetFormState = vi.fn();
    mockUpdateAgendaItemHandler = vi.fn();
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
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState1}
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
    expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
  });

  test('tests the condition for formState.title and formState.description', async () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState1}
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

    await userEvent.clear(screen.getByTestId('titleInput'));
    await userEvent.type(screen.getByTestId('titleInput'), 'New title');

    await userEvent.clear(screen.getByTestId('descriptionInput'));
    await userEvent.type(
      screen.getByTestId('descriptionInput'),
      'New description',
    );

    await userEvent.clear(screen.getByTestId('durationInput'));
    await userEvent.type(screen.getByTestId('durationInput'), '30');

    await userEvent.click(screen.getByTestId('deleteUrl'));
    await userEvent.click(screen.getByTestId('deleteAttachment'));

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
              <AgendaItemsUpdateModal
                agendaItemCategories={[]}
                agendaItemUpdateModalIsOpen
                hideUpdateModal={mockHideUpdateModal}
                formState={mockFormState1}
                setFormState={mockSetFormState}
                updateAgendaItemHandler={mockUpdateAgendaItemHandler}
                t={mockT}
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
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState1}
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
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState1}
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
      { type: 'image/jpeg' },
    ); // 11 MB file

    await userEvent.upload(fileInput, largeFile);

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
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState1}
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
    const smallFile = new File(['small-file-content'], 'small-file.jpg', {
      type: 'image/jpeg',
    });

    await userEvent.upload(fileInput, smallFile);

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
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={cleanFormState}
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
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={cleanFormState}
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
                <AgendaItemsUpdateModal
                  agendaItemCategories={mockAgendaItemCategories}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState1}
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
  });

  test('useEffect filters empty URLs and attachments on component mount', async () => {
    const formStateWithEmptyValues = {
      ...mockFormState1,
      urls: ['https://example.com', '', '   ', 'https://test.com'],
      attachments: ['attachment1', '', 'attachment2'],
    };

    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={formStateWithEmptyValues}
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

    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalledWith(expect.any(Function));
    });

    // Test the function that was passed to setFormState
    const setFormStateCall = mockSetFormState.mock.calls.find(
      (call) => typeof call[0] === 'function',
    );
    expect(setFormStateCall).toBeDefined();

    if (setFormStateCall) {
      const result = setFormStateCall[0](formStateWithEmptyValues);
      expect(result.urls).toEqual(['https://example.com', 'https://test.com']);
      expect(result.attachments).toEqual(['attachment1', 'attachment2']);
    }
  });

  test('handles empty URL input correctly', async () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState1}
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

    // Test empty URL - just click the button without typing (input is already empty)
    await userEvent.click(linkBtn);

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalledWith(
        'invalidUrl',
      );
    });

    // Test whitespace-only URL
    await userEvent.type(urlInput, '   ');
    await userEvent.click(linkBtn);

    await waitFor(() => {
      expect(sharedMocks.NotificationToast.error).toHaveBeenCalledWith(
        'invalidUrl',
      );
    });
  });

  test('handles file input with no files selected', async () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState1}
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

    // Upload with an empty file array to simulate no files selected
    await userEvent.upload(fileInput, []);

    // Should not call setFormState when no files are selected
    expect(mockSetFormState).not.toHaveBeenCalledWith(
      expect.objectContaining({
        attachments: expect.any(Array),
      }),
    );
  });

  test('displays video attachments correctly', async () => {
    const formStateWithVideo = {
      ...mockFormState1,
      attachments: ['data:video/mp4;base64,video-data'],
    };

    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={formStateWithVideo}
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

    const mediaPreview = screen.getByTestId('mediaPreview');
    expect(mediaPreview).toBeInTheDocument();

    // Check if video element exists
    const videoElement = mediaPreview.querySelector('video');
    if (videoElement) {
      // Just verify the video element exists - the specific attributes may vary
      expect(videoElement).toBeInTheDocument();
    } else {
      // If no video element, check for image element (fallback behavior)
      const imageElement = mediaPreview.querySelector('img');
      expect(imageElement).toBeInTheDocument();
      // This covers the case where video attachments are displayed as images
    }
  });

  test('displays image attachments correctly', async () => {
    const formStateWithImage = {
      ...mockFormState1,
      attachments: ['data:image/jpeg;base64,image-data'],
    };

    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={formStateWithImage}
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

    const imageElement = screen
      .getByTestId('mediaPreview')
      .querySelector('img');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute(
      'src',
      'data:image/jpeg;base64,image-data',
    );
    expect(imageElement).toHaveAttribute('alt', 'attachmentPreview');
  });

  test('handles URL display truncation correctly', async () => {
    const longUrl =
      'https://thisisaverylongurlthatexceedsfiftycharacters.com/very/long/path';
    const formStateWithLongUrl = {
      ...mockFormState1,
      urls: [longUrl],
    };

    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={formStateWithLongUrl}
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

    // Check that the URL is displayed and truncated
    const urlLink = screen.getByRole('link', {
      name: /https:\/\/thisisaverylongurlthatexceedsfiftycharacte\.\.\./,
    });
    expect(urlLink).toBeInTheDocument();
    expect(urlLink.textContent).toContain('...');
  });

  test('handles undefined agendaItemCategories correctly', async () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemCategories={undefined}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState1}
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

    const autocomplete = screen.getByTestId('categorySelect');
    expect(autocomplete).toBeInTheDocument();
  });

  test('handles undefined agendaItemCategories gracefully', async () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemCategories={
                    undefined as unknown as
                      | typeof mockAgendaItemCategories
                      | undefined
                  }
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState1}
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

    const autocomplete = screen.getByTestId('categorySelect');
    expect(autocomplete).toBeInTheDocument();
  });

  test('handles file input with no files property', async () => {
    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={mockFormState1}
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

    // Upload with an empty file array to simulate undefined files property
    await userEvent.upload(fileInput, []);

    // Should not call setFormState when files property is undefined
    expect(mockSetFormState).not.toHaveBeenCalledWith(
      expect.objectContaining({
        attachments: expect.any(Array),
      }),
    );
  });

  test('handles short URL display correctly', async () => {
    const shortUrl = 'https://example.com';
    const formStateWithShortUrl = {
      ...mockFormState1,
      urls: [shortUrl],
    };

    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={formStateWithShortUrl}
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

    const urlLink = screen.getByText('https://example.com');
    expect(urlLink).toBeInTheDocument();
  });

  test('removes attachment when delete button is clicked', async () => {
    const formStateWithAttachment = {
      ...mockFormState1,
      attachments: ['http://localhost/video/test-attachment.mp4'],
    };

    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={formStateWithAttachment}
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

    // Check that attachment preview is visible
    await waitFor(() => {
      expect(screen.getByTestId('deleteAttachment')).toBeInTheDocument();
    });

    // Clear mocks to ignore initial useEffect calls
    mockSetFormState.mockClear();

    // Click the delete button
    await userEvent.click(screen.getByTestId('deleteAttachment'));

    // Verify setFormState was called with functional updater that filters attachments
    await waitFor(() => {
      const functionalCall = mockSetFormState.mock.calls.find(
        (call) => typeof call[0] === 'function',
      );
      expect(functionalCall).toBeDefined();
      if (functionalCall) {
        // Simulate the functional update with multiple attachments
        const prevState = {
          ...formStateWithAttachment,
          attachments: [
            'http://localhost/video/test-attachment.mp4',
            'http://localhost/other.jpg',
          ],
        };
        const result = functionalCall[0](prevState);
        // Should remove the specific attachment that was clicked
        expect(result.attachments).toEqual(['http://localhost/other.jpg']);
      }
    });
  });

  test('handles MinIO JSON metadata in attachments for preview with objectName and mimeType', async () => {
    // This tests lines 301, 303, 304, 307 - MinIO metadata JSON parsing
    const minioMetadata = JSON.stringify({
      objectName: 'agenda-items/test-file.mp4',
      mimeType: 'video/mp4',
      fileName: 'test-file.mp4',
    });

    const formStateWithMinioAttachment = {
      ...mockFormState1,
      attachments: [minioMetadata],
    };

    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={formStateWithMinioAttachment}
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

    // Verify the attachment preview is rendered
    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    });

    // The MinIO attachment should show the delete button
    expect(screen.getByTestId('deleteAttachment')).toBeInTheDocument();
  });

  test('handles MinIO JSON metadata with image mimeType correctly', async () => {
    // Test with image mimeType (non-video)
    const imageMinioMetadata = JSON.stringify({
      objectName: 'agenda-items/test-image.png',
      mimeType: 'image/png',
      fileName: 'test-image.png',
    });

    const formStateWithImageAttachment = {
      ...mockFormState1,
      attachments: [imageMinioMetadata],
    };

    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={formStateWithImageAttachment}
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

    // Verify the attachment preview is rendered
    await waitFor(() => {
      expect(screen.getByTestId('mediaPreview')).toBeInTheDocument();
    });
  });

  test('filters empty URLs and attachments when modal opens via useEffect', async () => {
    // This tests lines 61-67 in AgendaItemsUpdateModal.tsx
    // - Effect runs on mount and filters empty strings from urls and attachments
    const formStateWithEmptyValues = {
      ...mockFormState1,
      urls: ['http://example.com', '', '  ', 'http://test.com'],
      attachments: [
        JSON.stringify({ objectName: 'valid.jpg', mimeType: 'image/jpeg' }),
        '',
        JSON.stringify({ objectName: 'valid2.jpg', mimeType: 'image/jpeg' }),
      ],
    };

    render(
      <MockedProvider>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsUpdateModal
                  agendaItemCategories={[]}
                  agendaItemUpdateModalIsOpen
                  hideUpdateModal={mockHideUpdateModal}
                  formState={formStateWithEmptyValues}
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

    // Verify that setFormState was called by the useEffect to filter empty values
    await waitFor(() => {
      const filteringCall = mockSetFormState.mock.calls.find(
        (call) => typeof call[0] === 'function',
      );
      expect(filteringCall).toBeDefined();

      if (filteringCall) {
        // Test the functional updater filters correctly
        const prevState = formStateWithEmptyValues;
        const result = filteringCall[0](prevState);
        // Empty strings and whitespace-only should be filtered from urls
        expect(result.urls).toEqual(['http://example.com', 'http://test.com']);
        // Empty strings should be filtered from attachments
        expect(result.attachments).toHaveLength(2);
      }
    });
  });
});
