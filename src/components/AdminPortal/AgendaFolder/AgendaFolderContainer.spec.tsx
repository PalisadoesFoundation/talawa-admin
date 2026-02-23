import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import AgendaFolderContainer from './AgendaFolderContainer';
import type {
  InterfaceAgendaFolderInfo,
  InterfaceAgendaItemCategoryInfo,
  InterfaceAgendaItemInfo,
} from 'types/AdminPortal/Agenda/interface';
import i18nForTest from 'utils/i18nForTest';

// Mock useParams
let mockOrgId: string | undefined = 'org123';
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: mockOrgId }),
  };
});

// Mock useMinioDownload
const mockGetFileFromMinio = vi.fn();
vi.mock('utils/MinioDownload', () => ({
  useMinioDownload: () => ({
    getFileFromMinio: mockGetFileFromMinio,
  }),
}));

// Mock react-i18next
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

// Mock child components
vi.mock(
  'components/AdminPortal/AgendaItems/Preview/AgendaItemsPreviewModal',
  () => ({
    default: ({
      isOpen,
      formState,
    }: {
      isOpen: boolean;
      formState: { name: string };
    }) =>
      isOpen ? (
        <div data-testid="agendaItemsPreviewModal">
          <div data-testid="preview-name">{formState.name}</div>
        </div>
      ) : null,
  }),
);

vi.mock(
  'components/AdminPortal/AgendaItems/Delete/AgendaItemsDeleteModal',
  () => ({
    default: ({
      isOpen,
      agendaItemId,
      onClose,
    }: {
      isOpen: boolean;
      agendaItemId: string;
      onClose: () => void;
    }) =>
      isOpen ? (
        <div data-testid="agendaItemsDeleteModal">
          <div data-testid="delete-item-id">{agendaItemId}</div>
          <button
            type="button"
            data-testid="closeDeleteItemModal"
            onClick={onClose}
          />
        </div>
      ) : null,
  }),
);

vi.mock(
  'components/AdminPortal/AgendaItems/Update/AgendaItemsUpdateModal',
  () => ({
    default: ({
      isOpen,
      agendaItemId,
      itemFormState,
      onClose,
    }: {
      isOpen: boolean;
      agendaItemId: string;
      itemFormState: { name: string };
      onClose: () => void;
    }) =>
      isOpen ? (
        <div data-testid="agendaItemsUpdateModal">
          <div data-testid="update-item-id">{agendaItemId}</div>
          <div data-testid="update-item-name">{itemFormState.name}</div>
          <button
            type="button"
            data-testid="closeUpdateItemModal"
            onClick={onClose}
          />
        </div>
      ) : null,
  }),
);

vi.mock(
  'components/AdminPortal/AgendaFolder/Delete/AgendaFolderDeleteModal',
  () => ({
    default: ({
      isOpen,
      agendaFolderId,
      onClose,
    }: {
      isOpen: boolean;
      agendaFolderId: string;
      onClose: () => void;
    }) =>
      isOpen ? (
        <div data-testid="agendaFolderDeleteModal">
          <div data-testid="delete-folder-id">{agendaFolderId}</div>
          <button
            type="button"
            data-testid="closeDeleteFolderModal"
            onClick={onClose}
          />
        </div>
      ) : null,
  }),
);

vi.mock('./Update/AgendaFolderUpdateModal', () => ({
  default: ({
    isOpen,
    agendaFolderId,
    folderFormState,
    onClose,
  }: {
    isOpen: boolean;
    agendaFolderId: string;
    folderFormState: { name: string };
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="agendaFolderUpdateModal">
        <div data-testid="update-folder-id">{agendaFolderId}</div>
        <div data-testid="update-folder-name">{folderFormState.name}</div>
        <button
          type="button"
          data-testid="closeUpdateFolderModal"
          onClick={onClose}
        />
      </div>
    ) : null,
}));

vi.mock('./DragAndDrop/AgendaDragAndDrop', () => ({
  default: ({
    folders,
    onEditFolder,
    onDeleteFolder,
    onPreviewItem,
    onEditItem,
    onDeleteItem,
  }: {
    folders: InterfaceAgendaFolderInfo[];
    onEditFolder: (folder: InterfaceAgendaFolderInfo) => void;
    onDeleteFolder: (folder: InterfaceAgendaFolderInfo) => void;
    onPreviewItem: (item: InterfaceAgendaItemInfo) => void;
    onEditItem: (item: InterfaceAgendaItemInfo) => void;
    onDeleteItem: (item: InterfaceAgendaItemInfo) => void;
  }) => (
    <div data-testid="agendaDragAndDrop">
      <div data-testid="folders-count">{folders.length}</div>
      {folders.map((folder) => (
        <div key={folder.id} data-testid={`folder-${folder.id}`}>
          <button
            type="button"
            data-testid={`edit-folder-${folder.id}`}
            onClick={() => onEditFolder(folder)}
          />
          <button
            type="button"
            data-testid={`delete-folder-${folder.id}`}
            onClick={() => onDeleteFolder(folder)}
          />
          {folder.items.edges.map((edge) => {
            const item = edge.node;
            return (
              <div key={item.id} data-testid={`item-${item.id}`}>
                <button
                  type="button"
                  data-testid={`preview-item-${item.id}`}
                  onClick={() => onPreviewItem(item)}
                />
                <button
                  type="button"
                  data-testid={`edit-item-${item.id}`}
                  onClick={() => onEditItem(item)}
                />
                <button
                  type="button"
                  data-testid={`delete-item-${item.id}`}
                  onClick={() => onDeleteItem(item)}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  ),
}));

// Mock data
const mockAgendaItemCategories: InterfaceAgendaItemCategoryInfo[] = [
  {
    id: 'cat1',
    name: 'Category 1',
    description: 'Description 1',
    creator: {
      id: 'creator1',
      name: 'Creator One',
    },
  },
  {
    id: 'cat2',
    name: 'Category 2',
    description: 'Description 2',
    creator: {
      id: 'creator2',
      name: 'Creator Two',
    },
  },
];

const mockAgendaItem: InterfaceAgendaItemInfo = {
  id: 'item1',
  name: 'Agenda Item 1',
  description: 'Item description',
  duration: '30',
  sequence: 1,
  notes: 'Initial notes',
  category: {
    id: 'cat1',
    name: 'Category 1',
    description: 'Description 1',
  },
  attachments: [
    {
      id: 'att1',
      name: 'attachment1.pdf',
      mimeType: 'application/pdf',
      fileHash: 'hash123',
      objectName: 'obj1',
    },
  ],
  creator: {
    id: 'creator1',
    name: 'Creator One',
  },
  url: [
    {
      id: 'url1',
      url: 'https://example.com',
    },
  ],
  folder: {
    id: 'folder1',
    name: 'Folder 1',
  },
  event: {
    id: 'event1',
    name: 'Event 1',
  },
};

const mockAgendaItemWithoutCategory: InterfaceAgendaItemInfo = {
  ...mockAgendaItem,
  id: 'item2',
  name: 'Item Without Category',
  notes: 'Initial notes',
  category: null as unknown as InterfaceAgendaItemInfo['category'],
  attachments: undefined,
  url: [],
};

const mockAgendaFolders: InterfaceAgendaFolderInfo[] = [
  {
    id: 'folder1',
    name: 'Folder 1',
    description: 'Folder description 1',
    sequence: 2,
    items: {
      edges: [
        {
          node: {
            id: 'item1',
            name: 'Agenda Item 1',
            description: 'Item description',
            duration: '30',
            notes: 'Initial notes',
            sequence: 1,
            attachments: [
              {
                id: 'att1',
                name: 'attachment1.pdf',
                mimeType: 'application/pdf',
                objectName: 'obj1',
                fileHash: 'hash123',
              },
            ],
            category: {
              id: 'cat1',
              name: 'Category 1',
              description: 'Description 1',
            },
            creator: {
              id: 'creator1',
              name: 'Creator One',
            },
            url: [
              {
                id: 'url1',
                url: 'https://example.com',
              },
            ],
            folder: {
              id: 'folder1',
              name: 'Folder 1',
            },
            event: {
              id: 'event1',
              name: 'Event 1',
            },
          },
        },
      ],
    },
  },
  {
    id: 'folder2',
    name: 'Folder 2',
    description: 'Folder description 2',
    sequence: 1,
    items: {
      edges: [],
    },
  },
];

const mockRefetchAgendaFolder = vi.fn();

const renderAgendaFolderContainer = (
  agendaFolderData: InterfaceAgendaFolderInfo[] | undefined = mockAgendaFolders,
  agendaItemCategories:
    | InterfaceAgendaItemCategoryInfo[]
    | undefined = mockAgendaItemCategories,
) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18nForTest}>
        <AgendaFolderContainer
          agendaFolderConnection="Event"
          agendaFolderData={agendaFolderData}
          refetchAgendaFolder={mockRefetchAgendaFolder}
          agendaItemCategories={agendaItemCategories}
        />
      </I18nextProvider>
    </BrowserRouter>,
  );
};

describe('AgendaFolderContainer', () => {
  beforeEach(() => {
    mockOrgId = 'org123';
    mockGetFileFromMinio.mockResolvedValue(
      'https://minio.example.com/preview.jpg',
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  describe('Initial rendering', () => {
    it('renders AgendaDragAndDrop component with folders', () => {
      renderAgendaFolderContainer();

      expect(screen.getByTestId('agendaDragAndDrop')).toBeInTheDocument();
      expect(screen.getByTestId('folders-count')).toHaveTextContent('2');
    });

    it('sorts folders by sequence on mount', () => {
      renderAgendaFolderContainer();

      const dragAndDrop = screen.getByTestId('agendaDragAndDrop');
      const folders = dragAndDrop.querySelectorAll('[data-testid^="folder-"]');

      // folder2 has sequence 1, folder1 has sequence 2
      expect(folders[0]).toHaveAttribute('data-testid', 'folder-folder2');
      expect(folders[1]).toHaveAttribute('data-testid', 'folder-folder1');
    });

    it('renders all modals in closed state initially', () => {
      renderAgendaFolderContainer();

      expect(
        screen.queryByTestId('agendaItemsPreviewModal'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('agendaItemsUpdateModal'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('agendaItemsDeleteModal'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('agendaFolderDeleteModal'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('agendaFolderUpdateModal'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Folder operations', () => {
    it('opens folder update modal when edit folder is clicked', async () => {
      renderAgendaFolderContainer();

      await userEvent.click(screen.getByTestId('edit-folder-folder1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaFolderUpdateModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      expect(screen.getByTestId('update-folder-id')).toHaveTextContent(
        'folder1',
      );
      expect(screen.getByTestId('update-folder-name')).toHaveTextContent(
        'Folder 1',
      );
    });

    it('closes folder update modal when close is called', async () => {
      renderAgendaFolderContainer();

      await userEvent.click(screen.getByTestId('edit-folder-folder1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaFolderUpdateModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      await userEvent.click(screen.getByTestId('closeUpdateFolderModal'));

      await waitFor(() => {
        expect(
          screen.queryByTestId('agendaFolderUpdateModal'),
        ).not.toBeInTheDocument();
      });
    });

    it('opens folder delete modal when delete folder is clicked', async () => {
      renderAgendaFolderContainer();

      await userEvent.click(screen.getByTestId('delete-folder-folder1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaFolderDeleteModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      expect(screen.getByTestId('delete-folder-id')).toHaveTextContent(
        'folder1',
      );
    });

    it('closes folder delete modal when close is called', async () => {
      renderAgendaFolderContainer();

      await userEvent.click(screen.getByTestId('delete-folder-folder1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaFolderDeleteModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      await userEvent.click(screen.getByTestId('closeDeleteFolderModal'));

      await waitFor(() => {
        expect(
          screen.queryByTestId('agendaFolderDeleteModal'),
        ).not.toBeInTheDocument();
      });
    });

    it('handles folder with empty description', async () => {
      const foldersWithEmptyDescription: InterfaceAgendaFolderInfo[] = [
        {
          ...mockAgendaFolders[0],
          description: undefined,
        },
      ];

      renderAgendaFolderContainer(foldersWithEmptyDescription);

      await userEvent.click(screen.getByTestId('edit-folder-folder1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaFolderUpdateModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });
  });

  describe('Agenda item preview', () => {
    it('opens preview modal with agenda item details', async () => {
      renderAgendaFolderContainer();

      await userEvent.click(screen.getByTestId('preview-item-item1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaItemsPreviewModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      expect(screen.getByTestId('preview-name')).toHaveTextContent(
        'Agenda Item 1',
      );
    });

    it('fetches attachment previews from Minio when previewing item', async () => {
      renderAgendaFolderContainer();

      await userEvent.click(screen.getByTestId('preview-item-item1'));

      await waitFor(
        () => {
          expect(mockGetFileFromMinio).toHaveBeenCalledWith('obj1', mockOrgId);
        },
        { timeout: 5000 },
      );
    });

    it('handles item without category in preview', async () => {
      const foldersWithItemWithoutCategory: InterfaceAgendaFolderInfo[] = [
        {
          ...mockAgendaFolders[0],
          items: {
            edges: [
              {
                node: mockAgendaItemWithoutCategory,
              },
            ],
          },
        },
      ];

      renderAgendaFolderContainer(foldersWithItemWithoutCategory);

      await userEvent.click(screen.getByTestId('preview-item-item2'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaItemsPreviewModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it('handles item without attachments in preview', async () => {
      const itemWithoutAttachments: InterfaceAgendaItemInfo = {
        ...mockAgendaItem,
        attachments: undefined,
      };

      const foldersWithItemWithoutAttachments: InterfaceAgendaFolderInfo[] = [
        {
          ...mockAgendaFolders[0],
          items: {
            edges: [
              {
                node: itemWithoutAttachments,
              },
            ],
          },
        },
      ];

      renderAgendaFolderContainer(foldersWithItemWithoutAttachments);

      await userEvent.click(screen.getByTestId('preview-item-item1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaItemsPreviewModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      expect(mockGetFileFromMinio).not.toHaveBeenCalled();
    });

    it('handles item with empty url array in preview', async () => {
      const itemWithEmptyUrls: InterfaceAgendaItemInfo = {
        ...mockAgendaItem,
        url: [],
      };

      const foldersWithItemWithEmptyUrls: InterfaceAgendaFolderInfo[] = [
        {
          ...mockAgendaFolders[0],
          items: {
            edges: [
              {
                node: itemWithEmptyUrls,
              },
            ],
          },
        },
      ];

      renderAgendaFolderContainer(foldersWithItemWithEmptyUrls);

      await userEvent.click(screen.getByTestId('preview-item-item1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaItemsPreviewModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });
  });

  describe('Agenda item update', () => {
    it('opens update modal with agenda item details', async () => {
      renderAgendaFolderContainer();

      await userEvent.click(screen.getByTestId('edit-item-item1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaItemsUpdateModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      expect(screen.getByTestId('update-item-id')).toHaveTextContent('item1');
      expect(screen.getByTestId('update-item-name')).toHaveTextContent(
        'Agenda Item 1',
      );
    });

    it('closes update modal when close is called', async () => {
      renderAgendaFolderContainer();

      await userEvent.click(screen.getByTestId('edit-item-item1'));

      await waitFor(() => {
        expect(
          screen.getByTestId('agendaItemsUpdateModal'),
        ).toBeInTheDocument();
      });

      await userEvent.click(screen.getByTestId('closeUpdateItemModal'));

      await waitFor(
        () => {
          expect(
            screen.queryByTestId('agendaItemsUpdateModal'),
          ).not.toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it('fetches attachment previews from Minio when editing item', async () => {
      renderAgendaFolderContainer();

      await userEvent.click(screen.getByTestId('edit-item-item1'));

      await waitFor(
        () => {
          expect(mockGetFileFromMinio).toHaveBeenCalledWith('obj1', mockOrgId);
        },
        { timeout: 5000 },
      );
    });

    it('handles item without category when editing', async () => {
      const foldersWithItemWithoutCategory: InterfaceAgendaFolderInfo[] = [
        {
          ...mockAgendaFolders[0],
          items: {
            edges: [
              {
                node: {
                  ...mockAgendaItem,
                  category:
                    null as unknown as InterfaceAgendaItemInfo['category'],
                },
              },
            ],
          },
        },
      ];

      renderAgendaFolderContainer(foldersWithItemWithoutCategory);

      await userEvent.click(screen.getByTestId('edit-item-item1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaItemsUpdateModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it('handles item without folder when editing', async () => {
      const itemWithoutFolder: InterfaceAgendaItemInfo = {
        ...mockAgendaItem,
        folder: null,
      };

      const foldersWithItemWithoutFolder: InterfaceAgendaFolderInfo[] = [
        {
          ...mockAgendaFolders[0],
          items: {
            edges: [
              {
                node: itemWithoutFolder,
              },
            ],
          },
        },
      ];

      renderAgendaFolderContainer(foldersWithItemWithoutFolder);

      await userEvent.click(screen.getByTestId('edit-item-item1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaItemsUpdateModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it('handles item without attachments when editing', async () => {
      const itemWithoutAttachments: InterfaceAgendaItemInfo = {
        ...mockAgendaItem,
        attachments: undefined,
      };

      const foldersWithItemWithoutAttachments: InterfaceAgendaFolderInfo[] = [
        {
          ...mockAgendaFolders[0],
          items: {
            edges: [
              {
                node: itemWithoutAttachments,
              },
            ],
          },
        },
      ];

      renderAgendaFolderContainer(foldersWithItemWithoutAttachments);

      await userEvent.click(screen.getByTestId('edit-item-item1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaItemsUpdateModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      expect(mockGetFileFromMinio).not.toHaveBeenCalled();
    });

    it('handles item with undefined url array when editing', async () => {
      const itemWithUndefinedUrls: InterfaceAgendaItemInfo = {
        ...mockAgendaItem,
        url: undefined as unknown as InterfaceAgendaItemInfo['url'],
      };

      const foldersWithItemWithUndefinedUrls: InterfaceAgendaFolderInfo[] = [
        {
          ...mockAgendaFolders[0],
          items: {
            edges: [
              {
                node: itemWithUndefinedUrls,
              },
            ],
          },
        },
      ];

      renderAgendaFolderContainer(foldersWithItemWithUndefinedUrls);

      await userEvent.click(screen.getByTestId('edit-item-item1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaItemsUpdateModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });
  });

  describe('Agenda item delete', () => {
    it('opens delete modal with agenda item id', async () => {
      renderAgendaFolderContainer();

      await userEvent.click(screen.getByTestId('delete-item-item1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaItemsDeleteModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      expect(screen.getByTestId('delete-item-id')).toHaveTextContent('item1');
    });

    it('closes delete modal when close is called', async () => {
      renderAgendaFolderContainer();

      await userEvent.click(screen.getByTestId('delete-item-item1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaItemsDeleteModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );

      await userEvent.click(screen.getByTestId('closeDeleteItemModal'));

      await waitFor(
        () => {
          expect(
            screen.queryByTestId('agendaItemsDeleteModal'),
          ).not.toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });
  });

  describe('Edge cases and data updates', () => {
    it('updates folders when agendaFolderData prop changes', async () => {
      const { rerender } = renderAgendaFolderContainer();

      expect(screen.getByTestId('folders-count')).toHaveTextContent('2');

      const updatedFolders: InterfaceAgendaFolderInfo[] = [
        ...mockAgendaFolders,
        {
          id: 'folder3',
          name: 'Folder 3',
          description: 'Folder description 3',
          sequence: 3,
          items: {
            edges: [],
          },
        },
      ];

      rerender(
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <AgendaFolderContainer
              agendaFolderConnection="Event"
              agendaFolderData={updatedFolders}
              refetchAgendaFolder={mockRefetchAgendaFolder}
              agendaItemCategories={mockAgendaItemCategories}
            />
          </I18nextProvider>
        </BrowserRouter>,
      );

      await waitFor(
        () => {
          expect(screen.getByTestId('folders-count')).toHaveTextContent('3');
        },
        { timeout: 5000 },
      );
    });

    it('handles empty folders array', () => {
      renderAgendaFolderContainer([]);

      expect(screen.getByTestId('folders-count')).toHaveTextContent('0');
    });

    it('passes refetchAgendaFolder to all modals', async () => {
      renderAgendaFolderContainer();

      // Open and verify each modal receives refetchAgendaFolder
      await userEvent.click(screen.getByTestId('delete-folder-folder1'));
      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaFolderDeleteModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it('passes agendaItemCategories to update modal', async () => {
      renderAgendaFolderContainer();

      await userEvent.click(screen.getByTestId('edit-item-item1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaItemsUpdateModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });

    it('passes agendaFolderData to update modal', async () => {
      renderAgendaFolderContainer();

      await userEvent.click(screen.getByTestId('edit-item-item1'));

      await waitFor(
        () => {
          expect(
            screen.getByTestId('agendaItemsUpdateModal'),
          ).toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });
  });

  describe('useParams integration', () => {
    it('uses orgId from useParams for Minio downloads', async () => {
      renderAgendaFolderContainer();

      await userEvent.click(screen.getByTestId('preview-item-item1'));

      await waitFor(
        () => {
          expect(mockGetFileFromMinio).toHaveBeenCalledWith('obj1', mockOrgId);
        },
        { timeout: 5000 },
      );
    });

    it('uses default organization when orgId is undefined', async () => {
      mockOrgId = undefined;
      renderAgendaFolderContainer();

      await userEvent.click(screen.getByTestId('preview-item-item1'));

      await waitFor(
        () => {
          expect(mockGetFileFromMinio).toHaveBeenCalledWith(
            'obj1',
            'organization',
          );
        },
        { timeout: 5000 },
      );
    });
  });
});
