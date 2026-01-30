import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { vi } from 'vitest';

import AgendaItemsCreateModal from './AgendaItemsCreateModal';
import { CREATE_AGENDA_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { StaticMockLink } from 'utils/StaticMockLink';

import type {
  InterfaceAgendaFolderInfo,
  InterfaceAgendaItemCategoryInfo,
} from 'types/AdminPortal/Agenda/interface';

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

const createAgendaItemNode = (sequence: number) => ({
  id: `item-${sequence}`,
  name: `Item ${sequence}`,
  description: 'Desc',
  duration: '10',
  sequence,
  attachments: [],
  category: {
    id: 'cat-1',
    name: 'Category',
    description: 'Desc',
  },
  creator: {
    id: 'u1',
    name: 'Admin',
  },
  url: [],
  folder: {
    id: 'folder-1',
    name: 'Folder',
  },
  event: {
    id: 'event-1',
    name: 'Event',
  },
});

const agendaFolders: InterfaceAgendaFolderInfo[] = [
  {
    id: 'folder-1',
    name: 'Folder',
    sequence: 1,
    items: {
      edges: [
        { node: createAgendaItemNode(1) },
        { node: createAgendaItemNode(2) },
      ],
    },
  },
];

const categories: InterfaceAgendaItemCategoryInfo[] = [
  {
    id: 'cat-1',
    name: 'Category',
    description: 'Desc',
    creator: {
      id: 'u1',
      name: 'Admin',
    },
  },
];

const t = (key: string): string => key;

describe('AgendaItemsCreateModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when open', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('createAgendaItemModal')).toBeInTheDocument();
    expect(screen.getByText('agendaItemDetails')).toBeInTheDocument();
  });

  it('creates agenda item with next sequence', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: CREATE_AGENDA_ITEM_MUTATION,
                variables: {
                  input: {
                    name: 'Title',
                    description: 'Desc',
                    eventId: 'event-1',
                    sequence: 3,
                    duration: '10',
                    folderId: 'folder-1',
                    categoryId: 'cat-1',
                    type: 'general',
                  },
                },
              },
              result: {
                data: {
                  createAgendaItem: {
                    id: 'new-id',
                  },
                },
              },
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText(/title/i), 'Title');
    await user.type(screen.getByLabelText(/duration/i), '10');
    await user.type(screen.getByLabelText(/description/i), 'Desc');

    // select folder
    const folderInput = screen.getByPlaceholderText('folderName');
    await user.click(folderInput);
    await user.type(folderInput, 'Folder');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    const categoryInput = screen.getByPlaceholderText('categoryName');
    await user.click(categoryInput);
    await user.type(categoryInput, 'Category');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    await user.click(screen.getByTestId('createAgendaItemFormBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'agendaItemCreated',
      );
    });
  });

  it('shows error toast when mutation fails', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: CREATE_AGENDA_ITEM_MUTATION,
                variables: {
                  input: {
                    name: 'Title',
                    description: 'Desc',
                    eventId: 'event-1',
                    sequence: 1,
                    duration: '10',
                    folderId: '',
                    categoryId: '',
                    type: 'general',
                  },
                },
              },
              error: new Error('Creation failed'),
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText(/title/i), 'Title');
    await user.type(screen.getByLabelText(/duration/i), '10');
    await user.type(screen.getByLabelText(/description/i), 'Desc');

    await user.click(screen.getByTestId('createAgendaItemFormBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('Creation failed');
    });
  });

  it('adds and removes valid URL', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const urlInput = screen.getByTestId('urlInput');

    await user.type(urlInput, 'https://example.com');
    await user.click(screen.getByTestId('linkBtn'));

    expect(screen.getByText('https://example.com')).toBeInTheDocument();

    await user.click(screen.getByTestId('deleteUrl'));

    expect(screen.queryByText('https://example.com')).not.toBeInTheDocument();
  });

  it('rejects invalid URL', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByTestId('urlInput'), 'invalid-url');
    await user.click(screen.getByTestId('linkBtn'));

    expect(NotificationToast.error).toHaveBeenCalledWith('invalidUrl');
  });

  it('creates agenda item when agendaFolderData is undefined', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: CREATE_AGENDA_ITEM_MUTATION,
                variables: {
                  input: {
                    name: 'Title',
                    description: 'Desc',
                    eventId: 'event-1',
                    sequence: 1,
                    duration: '10',
                    folderId: '',
                    categoryId: '',
                    type: 'general',
                  },
                },
              },
              result: { data: { createAgendaItem: { id: '1' } } },
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={undefined}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText(/title/i), 'Title');
    await user.type(screen.getByLabelText(/duration/i), '10');
    await user.type(screen.getByLabelText(/description/i), 'Desc');
    await user.click(screen.getByTestId('createAgendaItemFormBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  it('rejects file exceeding size limit', async () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const file = new File(['x'.repeat(11 * 1024 * 1024)], 'big.png', {
      type: 'image/png',
    });

    const input = screen.getByTestId('attachment') as HTMLInputElement;

    await userEvent.upload(input, file);

    expect(NotificationToast.error).toHaveBeenCalledWith(
      'fileSizeExceedsLimit',
    );
  });

  it('rejects invalid attachment type', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const invalidImage = new File(['<svg></svg>'], 'icon.svg', {
      type: 'image/svg+xml',
    });

    await user.upload(screen.getByTestId('attachment'), invalidImage);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('invalidFileType');
    });
  });

  it('calls hideItemCreateModal on close', async () => {
    const hideMock = vi.fn();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={hideMock}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await userEvent.click(screen.getByTestId('modalCloseBtn'));

    expect(hideMock).toHaveBeenCalled();
  });

  it('truncates long URLs in display', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const longUrl = 'https://example.com/' + 'a'.repeat(60);

    await user.type(screen.getByTestId('urlInput'), longUrl);
    await user.click(screen.getByTestId('linkBtn'));

    expect(
      screen.getByText(longUrl.substring(0, 50) + '...'),
    ).toBeInTheDocument();
  });

  it('submits agenda item without attachments', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        link={
          new StaticMockLink([
            {
              request: {
                query: CREATE_AGENDA_ITEM_MUTATION,
                variables: {
                  input: {
                    name: 'Title',
                    description: 'Desc',
                    eventId: 'event-1',
                    sequence: 1,
                    duration: '10',
                    folderId: '',
                    categoryId: '',
                    attachments: undefined,
                    url: undefined,
                    type: 'general',
                  },
                },
              },
              result: {
                data: {
                  createAgendaItem: {
                    id: 'new-id',
                  },
                },
              },
            },
          ])
        }
      >
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText(/title/i), 'Title');
    await user.type(screen.getByLabelText(/duration/i), '10');
    await user.type(screen.getByLabelText(/description/i), 'Desc');

    await user.click(screen.getByTestId('createAgendaItemFormBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'agendaItemCreated',
      );
    });
  });

  it('handles upload failure gracefully', async () => {
    uploadFileToMinioMock.mockRejectedValueOnce(new Error('upload failed'));

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const file = new File(['x'], 'image.png', {
      type: 'image/png',
    });

    await user.upload(screen.getByTestId('attachment'), file);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('fileUploadFailed');
    });
  });

  it('rejects empty URL input', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.click(screen.getByTestId('linkBtn'));

    expect(NotificationToast.error).toHaveBeenCalledWith('invalidUrl');
  });

  it('does nothing when file input has no files', async () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const input = screen.getByTestId('attachment');

    // manually fire change with empty FileList
    await userEvent.upload(input, []);

    expect(NotificationToast.error).not.toHaveBeenCalled();
  });

  it('uploads multiple valid files', async () => {
    uploadFileToMinioMock.mockResolvedValue({
      objectName: 'obj',
      fileHash: 'hash',
    });

    getFileFromMinioMock.mockResolvedValue('preview-url');

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const files = [
      new File(['a'], 'a.png', { type: 'image/png' }),
      new File(['b'], 'b.png', { type: 'image/png' }),
    ];

    await user.upload(screen.getByTestId('attachment'), files);

    // wait for BOTH to be committed
    const deleteButtons = await screen.findAllByTestId('deleteAttachment');
    expect(deleteButtons).toHaveLength(2);
  });

  it('skips invalid files but uploads valid ones', async () => {
    uploadFileToMinioMock.mockResolvedValue({
      objectName: 'obj',
      fileHash: 'hash',
    });
    getFileFromMinioMock.mockResolvedValue('preview-url');

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const files = [
      new File(['bad'], 'bad.svg', { type: 'image/svg+xml' }),
      new File(['good'], 'good.png', { type: 'image/png' }),
    ];

    await user.upload(screen.getByTestId('attachment'), files);

    await screen.findByTestId('deleteAttachment');

    expect(NotificationToast.error).toHaveBeenCalledWith('invalidFileType');
  });

  it('renders video preview for video attachment', async () => {
    uploadFileToMinioMock.mockResolvedValue({
      objectName: 'video-obj',
      fileHash: 'hash',
    });
    getFileFromMinioMock.mockResolvedValue('video-url');

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const video = new File(['video'], 'vid.mp4', { type: 'video/mp4' });

    await user.upload(screen.getByTestId('attachment'), video);

    await screen.findByTestId('deleteAttachment');

    expect(document.querySelector('video')).toBeInTheDocument();
  });

  it('removes attachment from state', async () => {
    uploadFileToMinioMock.mockResolvedValue({
      objectName: 'obj',
      fileHash: 'hash',
    });
    getFileFromMinioMock.mockResolvedValue('preview-url');

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            agendaItemCreateModalIsOpen
            hideItemCreateModal={vi.fn()}
            eventId="event-1"
            t={t}
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.upload(
      screen.getByTestId('attachment'),
      new File(['img'], 'img.png', { type: 'image/png' }),
    );

    const deleteBtn = await screen.findByTestId('deleteAttachment');
    await user.click(deleteBtn);

    expect(screen.queryByTestId('deleteAttachment')).not.toBeInTheDocument();
  });
});
