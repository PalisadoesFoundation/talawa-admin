import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import * as ReactRouter from 'react-router';
import { vi } from 'vitest';
import * as ApolloClient from '@apollo/client';
import AgendaItemsCreateModal from './AgendaItemsCreateModal';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

import type {
  InterfaceAgendaFolderInfo,
  InterfaceAgendaItemCategoryInfo,
} from 'types/AdminPortal/Agenda/interface';

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}));

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useParams: vi.fn(() => ({ orgId: 'org-123' })),
  };
});

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: toastMocks,
}));

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
  notes: 'Initial notes',
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

describe('AgendaItemsCreateModal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('renders modal when open', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
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

  it('handles non-Error rejection gracefully', async () => {
    const createMock = vi.fn().mockRejectedValue('boom');

    vi.spyOn(ApolloClient, 'useMutation').mockReturnValue([
      createMock,
      {
        loading: false,
        data: undefined,
        error: undefined,
        called: true,
        reset: vi.fn(),
        client: {} as ApolloClient.ApolloClient<object>,
      },
    ]);

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText(/title/i), 'Agenda');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(
      () => {
        expect(NotificationToast.error).not.toHaveBeenCalled();
      },
      { timeout: 5000 },
    );
  });

  it('adds and removes valid URL', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const urlInput = screen.getByPlaceholderText('enterUrl');

    await user.click(urlInput);
    await user.paste('https://example.com');
    await user.click(screen.getByText('link'));

    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    const urlDeleteButton = screen.getByTestId('deleteUrl');
    await user.click(urlDeleteButton);

    expect(screen.queryByText('https://example.com')).not.toBeInTheDocument();
  });

  it('rejects protocol-relative URLs', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const urlInput = screen.getByTestId('urlInput');

    await user.type(urlInput, '//example.com');
    await user.click(screen.getByTestId('linkBtn'));

    expect(NotificationToast.error).toHaveBeenCalledWith('invalidUrl');
  });

  it('accepts internationalized domain name (IDN) URLs', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const idnUrl = 'https://bücher.de';
    const urlInput = screen.getByTestId('urlInput');

    await user.click(urlInput);
    await user.paste(idnUrl);
    await user.click(screen.getByTestId('linkBtn'));

    expect(screen.getByRole('link', { name: idnUrl })).toBeInTheDocument();
  });

  it('rejects invalid URL', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const urlInput = screen.getByPlaceholderText('enterUrl');
    await user.click(urlInput);
    await user.paste('invalid-url');
    await user.click(screen.getByText('link'));

    expect(NotificationToast.error).toHaveBeenCalledWith('invalidUrl');
  });

  it('rejects file exceeding size limit', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
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

    await user.upload(input, file);

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
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
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

    await waitFor(
      () => {
        expect(NotificationToast.error).toHaveBeenCalledWith('invalidFileType');
      },
      { timeout: 5000 },
    );
  });

  it('creates agenda item successfully and resets state', async () => {
    const hideMock = vi.fn();
    const refetchMock = vi.fn();

    const createMock = vi.fn().mockResolvedValue({});

    vi.spyOn(ApolloClient, 'useMutation').mockReturnValue([
      createMock,
      {
        loading: false,
        data: undefined,
        error: undefined,
        called: true,
        reset: vi.fn(),
        client: {} as ApolloClient.ApolloClient<object>,
      },
    ]);

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={hideMock}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={refetchMock}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText(/title/i), 'Agenda title');
    await user.type(screen.getByLabelText(/duration/i), '10');

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(
      () => {
        expect(createMock).toHaveBeenCalled();
        expect(hideMock).toHaveBeenCalled();
        expect(refetchMock).toHaveBeenCalled();
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'agendaItemCreated',
        );
      },
      { timeout: 5000 },
    );
  });

  it('shows error toast when create agenda item fails', async () => {
    const createMock = vi.fn().mockRejectedValue(new Error('boom'));

    vi.spyOn(ApolloClient, 'useMutation').mockReturnValue([
      createMock,
      {
        loading: false,
        data: undefined,
        error: undefined,
        called: true,
        reset: vi.fn(),
        client: {} as ApolloClient.ApolloClient<object>,
      },
    ]);

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText(/title/i), 'Agenda title');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(
      () => {
        expect(NotificationToast.error).toHaveBeenCalledWith('boom');
      },
      { timeout: 5000 },
    );
  });

  it('rejects malformed URL that throws URL constructor', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByTestId('urlInput'), 'http://');
    await user.click(screen.getByTestId('linkBtn'));

    expect(NotificationToast.error).toHaveBeenCalledWith('invalidUrl');
  });

  it('does not update attachments when all files are invalid', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const files = [new File(['x'], 'bad.svg', { type: 'image/svg+xml' })];

    await user.upload(screen.getByTestId('attachment'), files);

    await waitFor(
      () => {
        expect(screen.queryAllByTestId('deleteAttachment')).toHaveLength(0);
      },
      { timeout: 5000 },
    );
  });

  it('shows error when organization id is missing', async () => {
    vi.spyOn(ReactRouter, 'useParams').mockReturnValue({});

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.upload(
      screen.getByTestId('attachment'),
      new File(['x'], 'img.png', { type: 'image/png' }),
    );

    expect(NotificationToast.error).toHaveBeenCalledWith(
      'organizationRequired',
    );
  });

  it('computes next sequence based on selected folder items', async () => {
    vi.spyOn(ReactRouter, 'useParams').mockReturnValue({ orgId: 'org-123' });

    const createMock = vi.fn().mockResolvedValue({});
    vi.spyOn(ApolloClient, 'useMutation').mockReturnValue([
      createMock,
      {
        loading: false,
        data: undefined,
        error: undefined,
        called: true,
        reset: vi.fn(),
        client: {} as ApolloClient.ApolloClient<object>,
      },
    ]);

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const folderBtn = screen.getByText('folderName');
    await user.click(folderBtn);
    await user.click(await screen.findByText('Folder'));

    await user.type(screen.getByLabelText(/title/i), 'Agenda');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(
      () => {
        expect(createMock).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );
  });

  it('sends attachments in create mutation when present', async () => {
    uploadFileToMinioMock.mockResolvedValue({
      objectName: 'obj',
      fileHash: 'hash',
    });
    getFileFromMinioMock.mockResolvedValue('preview-url');

    const createMock = vi.fn().mockResolvedValue({});
    vi.spyOn(ApolloClient, 'useMutation').mockReturnValue([
      createMock,
      {
        loading: false,
        data: undefined,
        error: undefined,
        called: true,
        reset: vi.fn(),
        client: {} as ApolloClient.ApolloClient<object>,
      },
    ]);

    const user = userEvent.setup();
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={vi.fn()}
            eventId="event-1"
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

    await user.type(screen.getByLabelText(/title/i), 'Agenda');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(
      () => {
        expect(createMock).toHaveBeenCalledWith(
          expect.objectContaining({
            variables: expect.objectContaining({
              input: expect.objectContaining({
                attachments: expect.any(Array),
              }),
            }),
          }),
        );
      },
      { timeout: 5000 },
    );
  });

  it('includes notes in create mutation', async () => {
    const createMock = vi.fn().mockResolvedValue({});

    vi.spyOn(ApolloClient, 'useMutation').mockReturnValue([
      createMock,
      {
        loading: false,
        data: undefined,
        error: undefined,
        called: true,
        reset: vi.fn(),
        client: {} as ApolloClient.ApolloClient<object>,
      },
    ]);

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText(/title/i), 'Agenda title');
    await user.type(screen.getByLabelText(/notes/i), 'Important notes');

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: expect.objectContaining({
            input: expect.objectContaining({
              notes: 'Important notes',
            }),
          }),
        }),
      );
    });
  });

  it('includes urls in create mutation when present', async () => {
    vi.spyOn(ReactRouter, 'useParams').mockReturnValue({ orgId: 'org-123' });

    const createMock = vi.fn().mockResolvedValue({});

    vi.spyOn(ApolloClient, 'useMutation').mockReturnValue([
      createMock,
      {
        loading: false,
        data: undefined,
        error: undefined,
        called: true,
        reset: vi.fn(),
        client: {} as ApolloClient.ApolloClient<object>,
      },
    ]);

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const urlInput = screen.getByTestId('urlInput');
    await user.click(urlInput);
    await user.paste('https://example.com');
    await user.click(screen.getByTestId('linkBtn'));
    await waitFor(
      () => {
        expect(screen.getByTestId('deleteUrl')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // submit
    await user.type(screen.getByLabelText(/title/i), 'Agenda');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(
      () => {
        expect(createMock).toHaveBeenCalledWith(
          expect.objectContaining({
            variables: expect.objectContaining({
              input: expect.objectContaining({
                url: [{ url: 'https://example.com' }],
              }),
            }),
          }),
        );
      },
      { timeout: 5000 },
    );
  });

  it('renders folder dropdown safely when agendaFolderData is undefined', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={undefined}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(
      screen.getByTestId('create-folder-dropdown-toggle'),
    ).toBeInTheDocument();

    expect(screen.getByText('folderName')).toBeInTheDocument();
  });

  it('resets form when modal closes and reopens', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, 'My Title');

    // close modal
    rerender(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen={false}
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    // reopen
    rerender(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByLabelText(/title/i)).toHaveValue('');
  });

  it('returns early when file input has no files', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const input = screen.getByTestId('attachment') as HTMLInputElement;
    await user.upload(input, []);

    expect(NotificationToast.error).not.toHaveBeenCalled();
  });

  it('renders category autocomplete when categories is undefined', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={undefined}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('categoryName')).toBeInTheDocument();
  });

  it('updates description when description field changes', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const descriptionInput = screen.getByLabelText(/description/i);
    await user.click(descriptionInput);
    await user.paste('Test description');
    expect(descriptionInput).toHaveValue('Test description');
  });

  it('calls hide on close', async () => {
    const hideMock = vi.fn();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen={true}
            hide={hideMock}
            eventId="event-1"
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
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const longUrl = 'https://example.com/' + 'a'.repeat(60);

    const urlInput = screen.getByPlaceholderText('enterUrl');
    await user.click(urlInput);
    await user.paste(longUrl);
    await user.click(screen.getByText('link'));

    expect(
      screen.getByText(longUrl.substring(0, 50) + '...'),
    ).toBeInTheDocument();
  });

  it('handles upload failure gracefully', async () => {
    uploadFileToMinioMock.mockRejectedValueOnce(new Error('upload failed'));

    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
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

    await waitFor(
      () => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'fileUploadFailed',
        );
      },
      { timeout: 5000 },
    );
  });

  it('rejects empty URL input', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.click(screen.getByText('link'));

    expect(NotificationToast.error).toHaveBeenCalledWith('invalidUrl');
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
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
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

    await waitFor(
      () => {
        const deleteButtons = screen.getAllByTestId('deleteAttachment');
        expect(deleteButtons).toHaveLength(2);
      },
      { timeout: 5000 },
    );
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
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
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

    await waitFor(
      () => {
        const deleteButtons = screen.getAllByTestId('deleteAttachment');
        expect(deleteButtons).toHaveLength(1);
      },
      { timeout: 5000 },
    );

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
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const video = new File(['video'], 'vid.mp4', { type: 'video/mp4' });

    await user.upload(screen.getByTestId('attachment'), video);

    await waitFor(
      () => {
        expect(document.querySelector('video')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
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
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
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

    await waitFor(
      () => {
        const remainingDeleteButtons =
          screen.queryAllByTestId('deleteAttachment');
        expect(remainingDeleteButtons).toHaveLength(0);
      },
      { timeout: 5000 },
    );
  });

  it('disables submit button when title is empty', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const submitBtn = screen.getByTestId('modal-submit-btn');
    expect(submitBtn).toBeDisabled();
  });

  it('enables submit button when title has content', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen={true}
            hide={vi.fn()}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    const titleInput = screen.getByLabelText(/title/i);
    await user.click(titleInput);
    await user.paste('Test Title');

    const submitBtn = screen.getByTestId('modal-submit-btn');
    expect(submitBtn).not.toBeDisabled();
  });

  it('calls hide on cancel button click', async () => {
    const hideMock = vi.fn();

    render(
      <MockedProvider>
        <BrowserRouter>
          <AgendaItemsCreateModal
            isOpen={true}
            hide={hideMock}
            eventId="event-1"
            agendaItemCategories={categories}
            agendaFolderData={agendaFolders}
            refetchAgendaFolder={vi.fn()}
          />
        </BrowserRouter>
      </MockedProvider>,
    );

    await userEvent.click(screen.getByTestId('modal-cancel-btn'));

    expect(hideMock).toHaveBeenCalled();
  });
});
