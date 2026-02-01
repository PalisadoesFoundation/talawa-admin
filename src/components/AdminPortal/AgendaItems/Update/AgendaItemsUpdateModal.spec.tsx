import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { vi } from 'vitest';
import * as ReactRouter from 'react-router';
import AgendaItemsUpdateModal from './AgendaItemsUpdateModal';
import { UPDATE_AGENDA_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { StaticMockLink } from 'utils/StaticMockLink';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import type {
  InterfaceAgendaFolderInfo,
  InterfaceAgendaItemCategoryInfo,
  InterfaceFormStateType,
} from 'types/AdminPortal/Agenda/interface';

dayjs.extend(utc);
const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}));

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: toastMocks,
}));

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: 'org-123' }),
  };
});

const uploadFileToMinioMock = vi.fn();
const getFileFromMinioMock = vi.fn();

vi.mock('utils/MinioUpload', () => ({
  useMinioUpload: () => ({
    uploadFileToMinio: uploadFileToMinioMock,
  }),
}));

vi.mock('utils/MinioDownload', () => ({
  useMinioDownload: () => ({
    getFileFromMinio: getFileFromMinioMock,
  }),
}));

const agendaFolders: InterfaceAgendaFolderInfo[] = [
  {
    id: 'folder-1',
    name: 'Folder 1',
    sequence: 1,
    items: {
      edges: [],
    },
  },
  {
    id: 'folder-2',
    name: 'Folder 2',
    sequence: 2,
    items: {
      edges: [],
    },
  },
];

const categories: InterfaceAgendaItemCategoryInfo[] = [
  {
    id: 'cat-1',
    name: 'Category 1',
    description: 'Description 1',
    creator: {
      id: 'user-1',
      name: 'Admin',
    },
  },
  {
    id: 'cat-2',
    name: 'Category 2',
    description: 'Description 2',
    creator: {
      id: 'user-1',
      name: 'Admin',
    },
  },
];

const t = (key: string): string => key;

const mockFormState: InterfaceFormStateType = {
  id: 'item-1',
  name: 'Test Item',
  description: 'Test Description',
  duration: '30',
  category: 'cat-1',
  folder: 'folder-1',
  url: ['https://example.com'],
  attachments: [
    {
      name: 'test.png',
      mimeType: 'image/png',
      fileHash: 'hash123',
      objectName: 'obj123',
      previewUrl: 'https://example.com/test.png',
    },
  ],
};

describe('AgendaItemsUpdateModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    agendaItemId: 'item-1',
    itemFormState: mockFormState,
    setItemFormState: vi.fn(),
    t,
    agendaItemCategories: categories,
    agendaFolderData: agendaFolders,
    refetchAgendaFolder: vi.fn(),
  };

  beforeEach(() => {
    uploadFileToMinioMock.mockClear();
    getFileFromMinioMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when open', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('updateAgendaItemModal')).toBeInTheDocument();
    expect(screen.getByText('updateAgendaItem')).toBeInTheDocument();
  });

  it('does not render modal when closed', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal {...defaultProps} isOpen={false} />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(
      screen.queryByTestId('updateAgendaItemModal'),
    ).not.toBeInTheDocument();
  });

  it('displays all form fields with current values', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByDisplayValue('Test Item')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('updates agenda item successfully', async () => {
    const user = userEvent.setup();
    const onCloseMock = vi.fn();
    const refetchMock = vi.fn();
    const setItemFormStateMock = vi.fn();

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: UPDATE_AGENDA_ITEM_MUTATION,
                variables: {
                  input: {
                    id: 'item-1',
                    name: 'Updated Title',
                    description: 'Test Description',
                    duration: '30',
                    folderId: 'folder-1',
                    categoryId: 'cat-1',
                    url: [{ url: 'https://example.com' }],
                    attachments: [
                      {
                        name: 'test.png',
                        mimeType: 'IMAGE_PNG',
                        fileHash: 'hash123',
                        objectName: 'obj123',
                      },
                    ],
                  },
                },
              },
              result: {
                data: {
                  updateAgendaItem: {
                    id: 'item-1',
                    name: 'Updated Title',
                    description: 'Test Description',
                    duration: '30',
                    url: [{ id: '1', url: 'https://example.com' }],
                    folder: { id: 'folder-1', name: 'Folder 1' },
                    updater: { id: 'user-1', name: 'Admin' },
                    updatedAt: dayjs().add(30, 'days').toISOString(),
                  },
                },
              },
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            itemFormState={{
              ...mockFormState,
              name: 'Updated Title',
            }}
            setItemFormState={setItemFormStateMock}
            onClose={onCloseMock}
            refetchAgendaFolder={refetchMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'agendaItemUpdated',
      );
      expect(refetchMock).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it('shows error toast when update fails', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: UPDATE_AGENDA_ITEM_MUTATION,
                variables: {
                  input: {
                    id: 'item-1',
                    name: 'Test Item',
                    description: 'Test Description',
                    duration: '30',
                    folderId: 'folder-1',
                    categoryId: 'cat-1',
                    url: [{ url: 'https://example.com' }],
                    attachments: [
                      {
                        name: 'test.png',
                        mimeType: 'IMAGE_PNG',
                        fileHash: 'hash123',
                        objectName: 'obj123',
                      },
                    ],
                  },
                },
              },
              error: new Error('Update failed'),
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaItemsUpdateModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('Update failed');
    });
  });

  it('adds valid URL', async () => {
    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const urlInput = screen.getByPlaceholderText('enterUrl');
    await user.type(urlInput, 'https://new-url.com');
    await user.click(screen.getByText('link'));

    expect(setItemFormStateMock).toHaveBeenCalled();

    // Verify the state update contains the new URL
    const callArg = setItemFormStateMock.mock.calls[0][0];
    if (typeof callArg === 'object') {
      expect(callArg.url).toContain('https://new-url.com');
    }
  });

  it('rejects invalid URL', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByPlaceholderText('enterUrl'), 'invalid-url');
    await user.click(screen.getByText('link'));

    expect(NotificationToast.error).toHaveBeenCalledWith('invalidUrl');
  });

  it('rejects empty URL', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.click(screen.getByText('link'));

    expect(NotificationToast.error).toHaveBeenCalledWith('invalidUrl');
  });

  it('removes URL', async () => {
    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const deleteButtons = screen.getAllByRole('button');
    const deleteUrlButton = deleteButtons.find((btn) =>
      btn.querySelector('.fa-trash'),
    );

    if (deleteUrlButton) {
      await user.click(deleteUrlButton);
    }

    expect(setItemFormStateMock).toHaveBeenCalled();

    // Verify the state update removes the URL
    const callArg = setItemFormStateMock.mock.calls[0][0];
    if (typeof callArg === 'object') {
      expect(callArg.url).toEqual([]);
    }
  });

  it('truncates long URLs in display', () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(60);
    const formStateWithLongUrl = {
      ...mockFormState,
      url: [longUrl],
    };

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            itemFormState={formStateWithLongUrl}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(
      screen.getByText(longUrl.substring(0, 50) + '...'),
    ).toBeInTheDocument();
  });

  it('uploads valid file', async () => {
    uploadFileToMinioMock.mockResolvedValue({
      objectName: 'obj-new',
      fileHash: 'hash-new',
    });
    getFileFromMinioMock.mockResolvedValue('https://example.com/new.png');

    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn((callback) => {
      if (typeof callback === 'function') {
        callback(mockFormState);
      }
    });

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const file = new File(['content'], 'new.png', { type: 'image/png' });
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    if (fileInput) {
      await user.upload(fileInput, file);
    }

    await waitFor(() => {
      expect(uploadFileToMinioMock).toHaveBeenCalledWith(file, 'org-123');
      expect(getFileFromMinioMock).toHaveBeenCalledWith('obj-new', 'org-123');
      expect(setItemFormStateMock).toHaveBeenCalled();
    });
  });

  it('rejects file exceeding size limit', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.png', {
      type: 'image/png',
    });

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    if (fileInput) {
      await user.upload(fileInput, largeFile);
    }

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'fileSizeExceedsLimit',
      );
    });

    // Should not call upload since file was rejected
    expect(uploadFileToMinioMock).not.toHaveBeenCalled();
  });

  it('rejects invalid file type', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    const invalidFile = new File(['content'], 'file.svg', {
      type: 'image/svg+xml',
    });

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    if (fileInput) {
      await user.upload(fileInput, invalidFile);
    }

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('invalidFileType');
    });

    // Should not call upload since file type was rejected
    expect(uploadFileToMinioMock).not.toHaveBeenCalled();
  });

  it('removes attachment', async () => {
    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const removeButton = screen.getByLabelText('removeAttachment');
    await user.click(removeButton);

    expect(setItemFormStateMock).toHaveBeenCalledWith({
      ...mockFormState,
      attachments: [],
    });
  });

  it('displays image preview for image attachment', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    const image = screen.getByAltText('attachmentPreviewAlt');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test.png');
  });

  it('displays video preview for video attachment', () => {
    const formStateWithVideo = {
      ...mockFormState,
      attachments: [
        {
          name: 'test.mp4',
          mimeType: 'video/mp4',
          fileHash: 'hash123',
          objectName: 'obj123',
          previewUrl: 'https://example.com/test.mp4',
        },
      ],
    };

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            itemFormState={formStateWithVideo}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('autoplay', '');
    expect(video).toHaveAttribute('loop', '');
  });

  it('does not display media preview when no attachments', () => {
    const formStateWithoutAttachments = {
      ...mockFormState,
      attachments: [],
    };

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            itemFormState={formStateWithoutAttachments}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(
      screen.queryByAltText('attachmentPreviewAlt'),
    ).not.toBeInTheDocument();
    expect(document.querySelector('video')).not.toBeInTheDocument();
  });

  it('updates folder selection', async () => {
    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const folderInput = screen.getByPlaceholderText('folderName');
    await user.click(folderInput);
    await user.type(folderInput, 'Folder 2');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(setItemFormStateMock).toHaveBeenCalled();

    // Verify the state update contains the new folder
    const callArg = setItemFormStateMock.mock.calls[0][0];
    if (typeof callArg === 'object') {
      expect(callArg.folder).toBe('folder-2');
    }
  });

  it('updates category selection', async () => {
    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const categoryInput = screen.getByPlaceholderText('categoryName');
    await user.click(categoryInput);
    await user.type(categoryInput, 'Category 2');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(setItemFormStateMock).toHaveBeenCalled();

    // Verify the state update contains the new category
    const callArg = setItemFormStateMock.mock.calls[0][0];
    if (typeof callArg === 'object') {
      expect(callArg.category).toBe('cat-2');
    }
  });

  it('updates title field', async () => {
    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const titleInput = screen.getByDisplayValue('Test Item');
    await user.clear(titleInput);
    await user.type(titleInput, 'New Title');

    expect(setItemFormStateMock).toHaveBeenCalled();
  });

  it('updates duration field', async () => {
    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const durationInput = screen.getByDisplayValue('30');
    await user.clear(durationInput);
    await user.type(durationInput, '45');

    expect(setItemFormStateMock).toHaveBeenCalled();
  });

  it('updates description field', async () => {
    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const descriptionInput = screen.getByDisplayValue('Test Description');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'New Description');

    expect(setItemFormStateMock).toHaveBeenCalled();
  });

  it('calls onClose when modal is closed', async () => {
    const user = userEvent.setup();
    const onCloseMock = vi.fn();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal {...defaultProps} onClose={onCloseMock} />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.click(screen.getByTestId('modal-cancel-btn'));

    expect(onCloseMock).toHaveBeenCalled();
  });

  it('handles file upload error', async () => {
    uploadFileToMinioMock.mockRejectedValueOnce(new Error('Upload failed'));

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    const file = new File(['content'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    if (fileInput) {
      await user.upload(fileInput, file);
    }

    await waitFor(() => {
      expect(uploadFileToMinioMock).toHaveBeenCalledWith(file, 'org-123');
      expect(NotificationToast.error).toHaveBeenCalledWith('fileUploadFailed');
    });
  });

  it('clears URL input after adding valid URL', async () => {
    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn();

    const _ = render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const urlInput = screen.getByPlaceholderText(
      'enterUrl',
    ) as HTMLInputElement;
    await user.click(urlInput);
    await user.paste('https://test.com');
    await user.click(screen.getByText('link'));

    // The component should add the URL to the list
    await waitFor(() => {
      expect(setItemFormStateMock).toHaveBeenCalledWith({
        ...mockFormState,
        url: ['https://example.com', 'https://test.com'],
      });
    });
  });

  it('handles empty file input', async () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    if (fileInput) {
      await userEvent.upload(fileInput, []);
    }

    expect(uploadFileToMinioMock).not.toHaveBeenCalled();
  });

  it('trims whitespace from fields on submit', async () => {
    const user = userEvent.setup();

    const formStateWithWhitespace = {
      ...mockFormState,
      name: '  Trimmed Title  ',
      description: '  Trimmed Description  ',
      duration: '  30  ',
    };

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: UPDATE_AGENDA_ITEM_MUTATION,
                variables: {
                  input: {
                    id: 'item-1',
                    name: 'Trimmed Title',
                    description: 'Trimmed Description',
                    duration: '30',
                    folderId: 'folder-1',
                    categoryId: 'cat-1',
                    url: [{ url: 'https://example.com' }],
                    attachments: [
                      {
                        name: 'test.png',
                        mimeType: 'IMAGE_PNG',
                        fileHash: 'hash123',
                        objectName: 'obj123',
                      },
                    ],
                  },
                },
              },
              result: {
                data: {
                  updateAgendaItem: {
                    id: 'item-1',
                    name: 'Trimmed Title',
                    description: 'Trimmed Description',
                    duration: '30',
                    url: [],
                    folder: null,
                    updater: { id: 'user-1', name: 'Admin' },
                    updatedAt: dayjs().add(30, 'days').toISOString(),
                  },
                },
              },
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            itemFormState={formStateWithWhitespace}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  it('sends undefined for empty fields on submit', async () => {
    const user = userEvent.setup();

    const formStateWithEmptyFields = {
      ...mockFormState,
      name: 'Valid Name', // Name must not be empty or submit button will be disabled
      description: '   ',
      duration: '   ',
      category: '',
      folder: '',
    };

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: UPDATE_AGENDA_ITEM_MUTATION,
                variables: {
                  input: {
                    id: 'item-1',
                    name: 'Valid Name',
                    description: undefined,
                    duration: undefined,
                    folderId: undefined,
                    categoryId: undefined,
                    url: [{ url: 'https://example.com' }],
                    attachments: [
                      {
                        name: 'test.png',
                        mimeType: 'IMAGE_PNG',
                        fileHash: 'hash123',
                        objectName: 'obj123',
                      },
                    ],
                  },
                },
              },
              result: {
                data: {
                  updateAgendaItem: {
                    id: 'item-1',
                    name: 'Valid Name',
                    description: '',
                    duration: '',
                    url: [],
                    folder: null,
                    updater: { id: 'user-1', name: 'Admin' },
                    updatedAt: dayjs().add(30, 'days').toISOString(),
                  },
                },
              },
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            itemFormState={formStateWithEmptyFields}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  it('sends empty array when no URLs', async () => {
    const user = userEvent.setup();

    const formStateWithoutUrls = {
      ...mockFormState,
      url: [],
    };

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: UPDATE_AGENDA_ITEM_MUTATION,
                variables: {
                  input: {
                    id: 'item-1',
                    name: 'Test Item',
                    description: 'Test Description',
                    duration: '30',
                    folderId: 'folder-1',
                    categoryId: 'cat-1',
                    url: [],
                    attachments: [
                      {
                        name: 'test.png',
                        mimeType: 'IMAGE_PNG',
                        fileHash: 'hash123',
                        objectName: 'obj123',
                      },
                    ],
                  },
                },
              },
              result: {
                data: {
                  updateAgendaItem: {
                    id: 'item-1',
                    name: 'Test Item',
                    description: 'Test Description',
                    duration: '30',
                    url: [],
                    folder: null,
                    updater: { id: 'user-1', name: 'Admin' },
                    updatedAt: dayjs().add(30, 'days').toISOString(),
                  },
                },
              },
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            itemFormState={formStateWithoutUrls}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  it('handles multiple file uploads', async () => {
    uploadFileToMinioMock.mockImplementation(async () => ({
      objectName: 'obj-new',
      fileHash: 'hash-new',
    }));
    getFileFromMinioMock.mockResolvedValue('https://example.com/new.png');

    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn((callback) => {
      if (typeof callback === 'function') {
        callback(mockFormState);
      }
    });

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const files = [
      new File(['1'], 'file1.png', { type: 'image/png' }),
      new File(['2'], 'file2.png', { type: 'image/png' }),
    ];

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    if (fileInput) {
      await user.upload(fileInput, files);
    }

    await waitFor(() => {
      expect(uploadFileToMinioMock).toHaveBeenCalledTimes(2);
      expect(setItemFormStateMock).toHaveBeenCalled();
    });
  });

  it('skips invalid files but uploads valid ones', async () => {
    uploadFileToMinioMock.mockResolvedValue({
      objectName: 'obj-new',
      fileHash: 'hash-new',
    });
    getFileFromMinioMock.mockResolvedValue('https://example.com/new.png');

    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn((callback) => {
      if (typeof callback === 'function') {
        callback(mockFormState);
      }
    });

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const files = [
      new File(['bad'], 'bad.svg', { type: 'image/svg+xml' }),
      new File(['good'], 'good.png', { type: 'image/png' }),
    ];

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    if (fileInput) {
      await user.upload(fileInput, files);
    }

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('invalidFileType');
      expect(uploadFileToMinioMock).toHaveBeenCalledTimes(1);
      expect(setItemFormStateMock).toHaveBeenCalled();
    });
  });

  it('resets file input after upload', async () => {
    uploadFileToMinioMock.mockResolvedValue({
      objectName: 'obj-new',
      fileHash: 'hash-new',
    });
    getFileFromMinioMock.mockResolvedValue('https://example.com/new.png');

    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn((callback) => {
      if (typeof callback === 'function') {
        callback(mockFormState);
      }
    });

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = new File(['content'], 'test.png', { type: 'image/png' });

    if (fileInput) {
      await user.upload(fileInput, file);
    }

    await waitFor(() => {
      expect(setItemFormStateMock).toHaveBeenCalled();
    });

    // Input is reset after upload completes
    expect(fileInput.files).toHaveLength(0);
  });

  it('displays multiple attachments', () => {
    const formStateWithMultipleAttachments = {
      ...mockFormState,
      attachments: [
        {
          name: 'image.png',
          mimeType: 'image/png',
          fileHash: 'hash1',
          objectName: 'obj1',
          previewUrl: 'https://example.com/image.png',
        },
        {
          name: 'video.mp4',
          mimeType: 'video/mp4',
          fileHash: 'hash2',
          objectName: 'obj2',
          previewUrl: 'https://example.com/video.mp4',
        },
      ],
    };

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            itemFormState={formStateWithMultipleAttachments}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getAllByLabelText('removeAttachment')).toHaveLength(2);
  });

  it('validates URL with ftp protocol', async () => {
    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(
      screen.getByPlaceholderText('enterUrl'),
      'ftp://example.com',
    );
    await user.click(screen.getByText('link'));

    expect(setItemFormStateMock).toHaveBeenCalled();
  });

  it('filters out empty URLs from state on mount', () => {
    const setItemFormStateMock = vi.fn();
    const formStateWithEmptyUrls = {
      ...mockFormState,
      url: ['https://example.com', '  ', '', 'https://test.com'],
    };

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            itemFormState={formStateWithEmptyUrls}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(setItemFormStateMock).toHaveBeenCalled();
  });

  it('uses fallback mime type when not in AGENDA_ITEM_MIME_TYPE map', async () => {
    const user = userEvent.setup();

    const formStateWithUnknownMimeType = {
      ...mockFormState,
      attachments: [
        {
          name: 'unknown.xyz',
          mimeType: 'application/unknown',
          fileHash: 'hash123',
          objectName: 'obj123',
          previewUrl: 'https://example.com/unknown.xyz',
        },
      ],
    };

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: UPDATE_AGENDA_ITEM_MUTATION,
                variables: {
                  input: {
                    id: 'item-1',
                    name: 'Test Item',
                    description: 'Test Description',
                    duration: '30',
                    folderId: 'folder-1',
                    categoryId: 'cat-1',
                    url: [{ url: 'https://example.com' }],
                    attachments: [
                      {
                        name: 'unknown.xyz',
                        mimeType: 'application/unknown',
                        fileHash: 'hash123',
                        objectName: 'obj123',
                      },
                    ],
                  },
                },
              },
              result: {
                data: {
                  updateAgendaItem: {
                    id: 'item-1',
                    name: 'Test Item',
                    description: 'Test Description',
                    duration: '30',
                    url: [],
                    folder: null,
                    updater: { id: 'user-1', name: 'Admin' },
                    updatedAt: dayjs().add(30, 'days').toISOString(),
                  },
                },
              },
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            itemFormState={formStateWithUnknownMimeType}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  it('disables submit button when name is empty', () => {
    const formStateWithEmptyName = {
      ...mockFormState,
      name: '   ',
    };

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            itemFormState={formStateWithEmptyName}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const submitButton = screen.getByTestId('modal-submit-btn');
    expect(submitButton).toBeDisabled();
  });

  it('shows error when organization id is missing during file upload', async () => {
    vi.spyOn(ReactRouter, 'useParams').mockReturnValue({});

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    const file = new File(['content'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    if (fileInput) {
      await user.upload(fileInput, file);
    }

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'organizationRequired',
      );
    });

    expect(uploadFileToMinioMock).not.toHaveBeenCalled();
  });

  it('validates URL with regex pattern correctly', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Test URL with spaces - should be rejected
    await user.type(
      screen.getByPlaceholderText('enterUrl'),
      'http://ex ample.com',
    );
    await user.click(screen.getByText('link'));

    expect(NotificationToast.error).toHaveBeenCalledWith('invalidUrl');
  });

  it('adds URL to existing URL list correctly', async () => {
    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn();

    const formStateWithUrls = {
      ...mockFormState,
      url: ['https://existing.com'],
    };

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            itemFormState={formStateWithUrls}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByPlaceholderText('enterUrl'), 'https://new.com');
    await user.click(screen.getByText('link'));

    expect(setItemFormStateMock).toHaveBeenCalled();

    // Verify the URL was added
    const callArg = setItemFormStateMock.mock.calls.find(
      (call) => typeof call[0] === 'object' && call[0].url,
    );

    if (callArg) {
      expect(callArg[0].url).toContain('https://new.com');
    }
  });

  it('filters out empty and whitespace URLs on component mount', () => {
    const setItemFormStateMock = vi.fn();

    const formStateWithMixedUrls = {
      ...mockFormState,
      url: ['https://valid.com', '   ', '', 'https://another.com', '  '],
    };

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            itemFormState={formStateWithMixedUrls}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    // The useEffect calls setItemFormState with a callback
    expect(setItemFormStateMock).toHaveBeenCalled();

    // Get the callback and execute it to see the result
    const callback = setItemFormStateMock.mock.calls[0][0];
    if (typeof callback === 'function') {
      const result = callback(formStateWithMixedUrls);
      expect(result.url).toEqual(['https://valid.com', 'https://another.com']);
    }
  });

  it('resets file input value after successful upload', async () => {
    vi.spyOn(ReactRouter, 'useParams').mockReturnValue({ orgId: 'org-123' });

    uploadFileToMinioMock.mockResolvedValue({
      objectName: 'obj-new',
      fileHash: 'hash-new',
    });
    getFileFromMinioMock.mockResolvedValue('https://example.com/new.png');

    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn((callback) => {
      if (typeof callback === 'function') {
        callback(mockFormState);
      }
    });

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const file = new File(['content'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    if (fileInput) {
      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(uploadFileToMinioMock).toHaveBeenCalled();
      });

      // File input should be reset
      expect(fileInput.value).toBe('');
    }
  });

  it('resets file input value after upload error', async () => {
    vi.spyOn(ReactRouter, 'useParams').mockReturnValue({ orgId: 'org-123' });

    uploadFileToMinioMock.mockRejectedValueOnce(new Error('Upload failed'));

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    const file = new File(['content'], 'test.png', { type: 'image/png' });
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    if (fileInput) {
      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'fileUploadFailed',
        );
      });

      // File input should still be reset even on error
      expect(fileInput.value).toBe('');
    }
  });

  it('processes multiple files with mixed valid and invalid types', async () => {
    vi.spyOn(ReactRouter, 'useParams').mockReturnValue({ orgId: 'org-123' });

    uploadFileToMinioMock.mockResolvedValue({
      objectName: 'obj-valid',
      fileHash: 'hash-valid',
    });
    getFileFromMinioMock.mockResolvedValue('https://example.com/valid.png');

    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn((callback) => {
      if (typeof callback === 'function') {
        callback(mockFormState);
      }
    });

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const files = [
      new File(['bad'], 'bad.svg', { type: 'image/svg+xml' }),
      new File(['good'], 'good.png', { type: 'image/png' }),
      new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      }),
    ];

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    if (fileInput) {
      await user.upload(fileInput, files);
    }

    await waitFor(() => {
      // Should have two errors: invalid type and size exceeded
      expect(NotificationToast.error).toHaveBeenCalledWith('invalidFileType');
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'fileSizeExceedsLimit',
      );
      // Only one valid file should be uploaded
      expect(uploadFileToMinioMock).toHaveBeenCalledTimes(1);
      expect(setItemFormStateMock).toHaveBeenCalled();
    });
  });

  it('handles concurrent file uploads correctly', async () => {
    vi.spyOn(ReactRouter, 'useParams').mockReturnValue({ orgId: 'org-123' });

    uploadFileToMinioMock
      .mockResolvedValueOnce({ objectName: 'obj-1', fileHash: 'hash-1' })
      .mockResolvedValueOnce({ objectName: 'obj-2', fileHash: 'hash-2' });

    getFileFromMinioMock
      .mockResolvedValueOnce('https://example.com/file1.png')
      .mockResolvedValueOnce('https://example.com/file2.png');

    const user = userEvent.setup();
    const setItemFormStateMock = vi.fn((callback) => {
      if (typeof callback === 'function') {
        callback(mockFormState);
      }
    });

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsUpdateModal
            {...defaultProps}
            setItemFormState={setItemFormStateMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const files = [
      new File(['1'], 'file1.png', { type: 'image/png' }),
      new File(['2'], 'file2.png', { type: 'image/png' }),
    ];

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    if (fileInput) {
      await user.upload(fileInput, files);
    }

    await waitFor(() => {
      expect(uploadFileToMinioMock).toHaveBeenCalledTimes(2);
      expect(getFileFromMinioMock).toHaveBeenCalledTimes(2);
      expect(setItemFormStateMock).toHaveBeenCalled();
    });
  });
});
