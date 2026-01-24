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
} from 'shared-components/DateRangePicker';

import AgendaItemsCreateModal from './AgendaItemsCreateModal';
import convertToBase64 from 'utils/convertToBase64';
import type { MockedFunction } from 'vitest';
import { describe, test, expect, vi } from 'vitest';
import { mockFormState1, mockAgendaItemCategories } from '../AgendaItemsMocks';

let mockHideCreateModal: ReturnType<typeof vi.fn>;
let mockSetFormState: ReturnType<typeof vi.fn>;
let mockCreateAgendaItemHandler: ReturnType<typeof vi.fn>;
const mockT = (key: string): string => key;

const mockNotificationToast = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  dismiss: vi.fn(),
}));

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: mockNotificationToast,
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
      expect(mockNotificationToast.error).toHaveBeenCalledWith('invalidUrl');
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
      expect(mockNotificationToast.error).toHaveBeenCalledWith(
        'fileSizeExceedsLimit',
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
  test('renders video attachment preview correctly', async () => {
    const mockFormStateWithVideo = {
      title: 'Test Title',
      description: 'Test Description',
      duration: '20',
      attachments: ['data:video/mp4;base64,AAAA'],
      urls: [],
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
                  formState={mockFormStateWithVideo}
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

    const mediaPreview = screen.getByTestId('mediaPreview');
    expect(mediaPreview).toBeInTheDocument();

    // Check that video element is rendered (not img)
    const videoElement = mediaPreview.querySelector('video');
    expect(videoElement).toBeInTheDocument();
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
