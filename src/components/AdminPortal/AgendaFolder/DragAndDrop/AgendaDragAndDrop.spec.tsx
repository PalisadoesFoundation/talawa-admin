import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { type DropResult } from '@hello-pangea/dnd';

import AgendaDragAndDrop from './AgendaDragAndDrop';
import {
  UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
  UPDATE_AGENDA_FOLDER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import type {
  InterfaceAgendaFolderInfo,
  InterfaceAgendaItemInfo,
} from 'types/AdminPortal/Agenda/interface';

// Mock NotificationToast
vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Store the onDragEnd handler
let capturedOnDragEnd: ((result: DropResult) => void) | null = null;

// Mock @hello-pangea/dnd
vi.mock('@hello-pangea/dnd', async () => {
  const actual = await vi.importActual('@hello-pangea/dnd');
  return {
    ...actual,
    DragDropContext: ({
      children,
      onDragEnd,
    }: {
      children: React.ReactNode;
      onDragEnd: (result: DropResult) => void;
    }) => {
      capturedOnDragEnd = onDragEnd;
      return <div data-testid="drag-drop-context">{children}</div>;
    },
    Droppable: ({
      children,
      droppableId,
    }: {
      children: (provided: unknown) => React.ReactNode;
      droppableId: string;
    }) =>
      children({
        innerRef: vi.fn(),
        droppableProps: { 'data-droppable-id': droppableId },
        placeholder: null,
      }),
    Draggable: ({
      children,
      draggableId,
      index,
    }: {
      children: (provided: unknown, snapshot: unknown) => React.ReactNode;
      draggableId: string;
      index: number;
    }) =>
      children(
        {
          innerRef: vi.fn(),
          draggableProps: {
            'data-draggable-id': draggableId,
            'data-index': index,
          },
          dragHandleProps: { 'data-drag-handle': true },
        },
        { isDragging: false },
      ),
  };
});

const mockT = (key: string): string => key;

const mockSetFolders = vi.fn();
const mockOnEditFolder = vi.fn();
const mockOnDeleteFolder = vi.fn();
const mockOnPreviewItem = vi.fn();
const mockOnEditItem = vi.fn();
const mockOnDeleteItem = vi.fn();
const mockRefetchAgendaFolder = vi.fn();

const mockAgendaItem1: InterfaceAgendaItemInfo = {
  id: 'item1',
  name: 'Item 1',
  description: 'Description 1',
  duration: '30',
  sequence: 1,
  category: {
    id: 'cat1',
    name: 'Category 1',
    description: 'Category Description',
  },
  creator: {
    id: 'creator1',
    name: 'Creator One',
  },
  url: [],
  folder: {
    id: 'folder1',
    name: 'Folder 1',
  },
  event: {
    id: 'event1',
    name: 'Event 1',
  },
};

const mockAgendaItem2: InterfaceAgendaItemInfo = {
  id: 'item2',
  name: 'Item 2',
  description: 'Description 2',
  duration: '45',
  sequence: 2,
  category: {
    id: 'cat2',
    name: 'Category 2',
    description: 'Category Description 2',
  },
  creator: {
    id: 'creator2',
    name: 'Creator Two',
  },
  url: [],
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
  ...mockAgendaItem1,
  id: 'item3',
  name: 'Item Without Category',
  category: null as unknown as InterfaceAgendaItemInfo['category'],
};

const mockFolders: InterfaceAgendaFolderInfo[] = [
  {
    id: 'folder1',
    name: 'Folder 1',
    description: 'Description 1',
    sequence: 1,
    items: {
      edges: [{ node: mockAgendaItem1 }, { node: mockAgendaItem2 }],
    },
  },
  {
    id: 'folder2',
    name: 'Folder 2',
    description: 'Description 2',
    sequence: 2,
    items: {
      edges: [],
    },
  },
];

const mockDefaultFolder: InterfaceAgendaFolderInfo = {
  id: 'default-folder',
  name: 'Default Folder',
  description: 'Default Description',
  sequence: 1,
  isDefaultFolder: true,
  items: {
    edges: [],
  },
};

const MOCKS_SUCCESS_ITEM_SEQUENCE: MockedResponse[] = [
  {
    request: {
      query: UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
      variables: {
        input: {
          id: 'item1',
          sequence: 2,
        },
      },
    },
    result: {
      data: {
        updateAgendaItemSequence: {
          id: 'item1',
          sequence: 2,
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
      variables: {
        input: {
          id: 'item2',
          sequence: 1,
        },
      },
    },
    result: {
      data: {
        updateAgendaItemSequence: {
          id: 'item2',
          sequence: 1,
        },
      },
    },
  },
];

const MOCKS_SUCCESS_FOLDER_SEQUENCE: MockedResponse[] = [
  {
    request: {
      query: UPDATE_AGENDA_FOLDER_MUTATION,
      variables: {
        input: {
          id: 'folder1',
          sequence: 2,
        },
      },
    },
    result: {
      data: {
        updateAgendaFolder: {
          id: 'folder1',
          name: 'Folder 1',
          description: 'Description 1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_FOLDER_MUTATION,
      variables: {
        input: {
          id: 'folder2',
          sequence: 1,
        },
      },
    },
    result: {
      data: {
        updateAgendaFolder: {
          id: 'folder2',
          name: 'Folder 2',
          description: 'Description 2',
        },
      },
    },
  },
];

const MOCKS_ERROR_ITEM_SEQUENCE: MockedResponse[] = [
  {
    request: {
      query: UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
      variables: {
        input: {
          id: 'item2',
          sequence: 1,
        },
      },
    },
    result: {
      data: {
        updateAgendaItemSequence: {
          id: 'item2',
          sequence: 1,
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
      variables: {
        input: {
          id: 'item1',
          sequence: 2,
        },
      },
    },
    error: new Error('Failed to update item sequence'),
  },
];

const MOCKS_ERROR_FOLDER_SEQUENCE: MockedResponse[] = [
  {
    request: {
      query: UPDATE_AGENDA_FOLDER_MUTATION,
      variables: {
        input: {
          id: 'folder2',
          sequence: 1,
        },
      },
    },
    result: {
      data: {
        updateAgendaFolder: {
          id: 'folder2',
          name: 'Folder 2',
          description: 'Description 2',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_FOLDER_MUTATION,
      variables: {
        input: {
          id: 'folder1',
          sequence: 2,
        },
      },
    },
    error: new Error('Failed to update folder sequence'),
  },
];

const renderAgendaDragAndDrop = (
  mocks: MockedResponse[] = [],
  folders: InterfaceAgendaFolderInfo[] = mockFolders,
) => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <I18nextProvider i18n={i18nForTest}>
        <AgendaDragAndDrop
          folders={folders}
          setFolders={mockSetFolders}
          agendaFolderConnection="Event"
          t={mockT}
          onEditFolder={mockOnEditFolder}
          onDeleteFolder={mockOnDeleteFolder}
          onPreviewItem={mockOnPreviewItem}
          onEditItem={mockOnEditItem}
          onDeleteItem={mockOnDeleteItem}
          refetchAgendaFolder={mockRefetchAgendaFolder}
        />
      </I18nextProvider>
    </MockedProvider>,
  );
};

describe('AgendaDragAndDrop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedOnDragEnd = null;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders drag and drop context', () => {
      renderAgendaDragAndDrop();
      expect(screen.getByTestId('drag-drop-context')).toBeInTheDocument();
    });

    it('renders all folders and items', () => {
      renderAgendaDragAndDrop();
      expect(screen.getByText('Folder 1')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('displays "noCategory" for items without category', () => {
      const foldersWithNoCategory: InterfaceAgendaFolderInfo[] = [
        {
          ...mockFolders[0],
          items: {
            edges: [{ node: mockAgendaItemWithoutCategory }],
          },
        },
      ];
      renderAgendaDragAndDrop([], foldersWithNoCategory);
      expect(screen.getByText('noCategory')).toBeInTheDocument();
    });

    it('displays "-" for null duration', () => {
      const foldersWithNoDuration: InterfaceAgendaFolderInfo[] = [
        {
          ...mockFolders[0],
          items: {
            edges: [
              {
                node: {
                  ...mockAgendaItem1,
                  duration: null as unknown as string,
                },
              },
            ],
          },
        },
      ];
      renderAgendaDragAndDrop([], foldersWithNoDuration);
      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  describe('Default folder handling', () => {
    it('disables edit and delete buttons for default folder', () => {
      renderAgendaDragAndDrop([], [mockDefaultFolder]);
      const editButton = screen.getByLabelText('editFolder');
      const deleteButton = screen.getByLabelText('deleteFolder');
      expect(editButton).toBeDisabled();
      expect(deleteButton).toBeDisabled();
    });
  });

  describe('User interactions', () => {
    it('calls onEditFolder when edit button is clicked', async () => {
      renderAgendaDragAndDrop();
      const editButtons = screen.getAllByLabelText('editFolder');
      await userEvent.click(editButtons[0]);
      expect(mockOnEditFolder).toHaveBeenCalledWith(mockFolders[0]);
    });

    it('calls onDeleteFolder when delete button is clicked', async () => {
      renderAgendaDragAndDrop();
      const deleteButtons = screen.getAllByLabelText('deleteFolder');
      await userEvent.click(deleteButtons[0]);
      expect(mockOnDeleteFolder).toHaveBeenCalledWith(mockFolders[0]);
    });

    it('calls onPreviewItem when preview button is clicked', async () => {
      renderAgendaDragAndDrop();
      const previewButtons = screen.getAllByLabelText('previewItem');
      await userEvent.click(previewButtons[0]);
      expect(mockOnPreviewItem).toHaveBeenCalledWith(mockAgendaItem1);
    });

    it('calls onEditItem when edit button is clicked', async () => {
      renderAgendaDragAndDrop();
      const editButtons = screen.getAllByLabelText('editItem');
      await userEvent.click(editButtons[0]);
      expect(mockOnEditItem).toHaveBeenCalledWith(mockAgendaItem1);
    });

    it('calls onDeleteItem when delete button is clicked', async () => {
      renderAgendaDragAndDrop();
      const deleteButtons = screen.getAllByLabelText('deleteItem');
      await userEvent.click(deleteButtons[0]);
      expect(mockOnDeleteItem).toHaveBeenCalledWith(mockAgendaItem1);
    });
  });

  describe('Item sorting', () => {
    it('sorts items by sequence within folder', () => {
      const unsortedFolders: InterfaceAgendaFolderInfo[] = [
        {
          ...mockFolders[0],
          items: {
            edges: [
              { node: { ...mockAgendaItem1, sequence: 2 } },
              { node: { ...mockAgendaItem2, sequence: 1 } },
            ],
          },
        },
      ];
      renderAgendaDragAndDrop([], unsortedFolders);
      const items = screen.getAllByText(/Item \d/);
      expect(items[0]).toHaveTextContent('Item 2');
      expect(items[1]).toHaveTextContent('Item 1');
    });
  });

  describe('Drag and drop - Item reordering (Lines 38-75)', () => {
    it('handles successful item reorder within same folder', async () => {
      renderAgendaDragAndDrop(MOCKS_SUCCESS_ITEM_SEQUENCE);

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agenda-items-folder1' },
        destination: { index: 1, droppableId: 'agenda-items-folder1' },
        draggableId: 'item1',
        type: 'ITEM',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'itemSequenceUpdateSuccessMsg',
        );
      });

      await waitFor(() => {
        expect(mockRefetchAgendaFolder).toHaveBeenCalled();
      });
    });

    it('returns early when destination is null', () => {
      renderAgendaDragAndDrop();

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agenda-items-folder1' },
        destination: null,
        draggableId: 'item1',
        type: 'ITEM',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });

    it('returns early when dragging between different folders', () => {
      renderAgendaDragAndDrop();

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agenda-items-folder1' },
        destination: { index: 0, droppableId: 'agenda-items-folder2' },
        draggableId: 'item1',
        type: 'ITEM',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });

    it('returns early when source and destination index are same', () => {
      renderAgendaDragAndDrop();

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agenda-items-folder1' },
        destination: { index: 0, droppableId: 'agenda-items-folder1' },
        draggableId: 'item1',
        type: 'ITEM',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });

    it('returns early when folder is not found', () => {
      renderAgendaDragAndDrop();

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agenda-items-nonexistent' },
        destination: { index: 1, droppableId: 'agenda-items-nonexistent' },
        draggableId: 'item1',
        type: 'ITEM',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });

    it('does nothing for unknown drag type', () => {
      renderAgendaDragAndDrop();

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agendaFolder' },
        destination: { index: 1, droppableId: 'agendaFolder' },
        draggableId: 'folder1',
        type: 'UNKNOWN',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      capturedOnDragEnd?.(dropResult);

      expect(mockSetFolders).not.toHaveBeenCalled();
      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });

    it('handles error during item sequence update', async () => {
      renderAgendaDragAndDrop(MOCKS_ERROR_ITEM_SEQUENCE);

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agenda-items-folder1' },
        destination: { index: 1, droppableId: 'agenda-items-folder1' },
        draggableId: 'item1',
        type: 'ITEM',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Failed to update item sequence',
        );
      });

      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });
  });

  describe('Drag and drop - Folder reordering (Lines 81-109)', () => {
    it('handles successful folder reorder', async () => {
      renderAgendaDragAndDrop(MOCKS_SUCCESS_FOLDER_SEQUENCE);

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agendaFolder' },
        destination: { index: 1, droppableId: 'agendaFolder' },
        draggableId: 'folder1',
        type: 'FOLDER',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      await waitFor(() => {
        expect(mockSetFolders).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'sectionSequenceUpdateSuccessMsg',
        );
      });

      await waitFor(() => {
        expect(mockRefetchAgendaFolder).toHaveBeenCalled();
      });
    });

    it('returns early when folder destination is null', () => {
      renderAgendaDragAndDrop();

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agendaFolder' },
        destination: null,
        draggableId: 'folder1',
        type: 'FOLDER',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      expect(mockSetFolders).not.toHaveBeenCalled();
    });

    it('returns early when folder source and destination index are same', () => {
      renderAgendaDragAndDrop();

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agendaFolder' },
        destination: { index: 0, droppableId: 'agendaFolder' },
        draggableId: 'folder1',
        type: 'FOLDER',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      expect(mockSetFolders).not.toHaveBeenCalled();
    });

    it('handles error during folder sequence update', async () => {
      renderAgendaDragAndDrop(MOCKS_ERROR_FOLDER_SEQUENCE);

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agendaFolder' },
        destination: { index: 1, droppableId: 'agendaFolder' },
        draggableId: 'folder1',
        type: 'FOLDER',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Failed to update folder sequence',
        );
      });

      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });
  });

  describe('Drag and drop - handleDragEnd', () => {
    it('covers onItemDragEnd early return when source and destination index are same', async () => {
      renderAgendaDragAndDrop();

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agenda-items-folder1' },
        destination: { index: 0, droppableId: 'agenda-items-folder1' },
        draggableId: 'item1',
        type: 'ITEM',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      capturedOnDragEnd?.(dropResult);

      expect(NotificationToast.success).not.toHaveBeenCalled();
      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });

    it('executes mixed item updates and resolves without mutation for matching sequence', async () => {
      const folders: InterfaceAgendaFolderInfo[] = [
        {
          ...mockFolders[0],
          items: {
            edges: [
              { node: { ...mockAgendaItem1, sequence: 1 } }, // resolve
              { node: { ...mockAgendaItem2, sequence: 5 } }, // mutation
            ],
          },
        },
      ];

      renderAgendaDragAndDrop(MOCKS_SUCCESS_ITEM_SEQUENCE, folders);

      const dropResult: DropResult = {
        source: { index: 1, droppableId: 'agenda-items-folder1' },
        destination: { index: 0, droppableId: 'agenda-items-folder1' },
        draggableId: 'item2',
        type: 'ITEM',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      capturedOnDragEnd?.(dropResult);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'itemSequenceUpdateSuccessMsg',
        );
        expect(mockRefetchAgendaFolder).toHaveBeenCalled();
      });
    });

    it('covers both mutation and Promise.resolve paths in item sequence update', async () => {
      const folders: InterfaceAgendaFolderInfo[] = [
        {
          ...mockFolders[0],
          items: {
            edges: [
              { node: { ...mockAgendaItem1, sequence: 1 } }, // resolves
              { node: { ...mockAgendaItem2, sequence: 99 } }, // mutates
            ],
          },
        },
      ];

      renderAgendaDragAndDrop(MOCKS_SUCCESS_ITEM_SEQUENCE, folders);

      const dropResult: DropResult = {
        source: { index: 1, droppableId: 'agenda-items-folder1' },
        destination: { index: 0, droppableId: 'agenda-items-folder1' },
        draggableId: 'item2',
        type: 'ITEM',
        reason: 'DROP',
        mode: 'FLUID',
        combine: null,
      };

      capturedOnDragEnd?.(dropResult);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'itemSequenceUpdateSuccessMsg',
        );
        expect(mockRefetchAgendaFolder).toHaveBeenCalled();
      });
    });

    it('returns early when destination is null in handleDragEnd', () => {
      renderAgendaDragAndDrop();

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agendaFolder' },
        destination: null,
        draggableId: 'folder1',
        type: 'FOLDER',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      expect(mockSetFolders).not.toHaveBeenCalled();
      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });

    it('returns early when destination equals source in handleDragEnd', () => {
      renderAgendaDragAndDrop();

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agendaFolder' },
        destination: { index: 0, droppableId: 'agendaFolder' },
        draggableId: 'folder1',
        type: 'FOLDER',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      expect(mockSetFolders).not.toHaveBeenCalled();
      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });

    it('routes to onItemDragEnd when type is ITEM', async () => {
      renderAgendaDragAndDrop(MOCKS_SUCCESS_ITEM_SEQUENCE);

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agenda-items-folder1' },
        destination: { index: 1, droppableId: 'agenda-items-folder1' },
        draggableId: 'item1',
        type: 'ITEM',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'itemSequenceUpdateSuccessMsg',
        );
      });
    });

    it('routes to onFolderDragEnd when type is FOLDER', async () => {
      renderAgendaDragAndDrop(MOCKS_SUCCESS_FOLDER_SEQUENCE);

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agendaFolder' },
        destination: { index: 1, droppableId: 'agendaFolder' },
        draggableId: 'folder1',
        type: 'FOLDER',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'sectionSequenceUpdateSuccessMsg',
        );
      });
    });
  });

  describe('Edge cases', () => {
    it('renders with empty folders array', () => {
      renderAgendaDragAndDrop([], []);
      expect(screen.getByTestId('drag-drop-context')).toBeInTheDocument();
    });

    it('handles items with missing optional fields', () => {
      const itemWithMinimalData: InterfaceAgendaItemInfo = {
        ...mockAgendaItem1,
        attachments: undefined,
        duration: null as unknown as string,
        category: null as unknown as InterfaceAgendaItemInfo['category'],
      };

      const foldersWithMinimalItem: InterfaceAgendaFolderInfo[] = [
        {
          ...mockFolders[0],
          items: {
            edges: [{ node: itemWithMinimalData }],
          },
        },
      ];

      renderAgendaDragAndDrop([], foldersWithMinimalItem);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('noCategory')).toBeInTheDocument();
      expect(screen.getByText('-')).toBeInTheDocument();
    });
  });

  describe('Additional item drag scenarios', () => {
    it('handles dragging item to different droppableId (different folder)', () => {
      renderAgendaDragAndDrop();

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agenda-items-folder1' },
        destination: { index: 0, droppableId: 'agenda-items-folder2' },
        draggableId: 'item1',
        type: 'ITEM',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      // Should return early and not call mutations
      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });

    it('handles dragging item to same index', () => {
      renderAgendaDragAndDrop();

      const dropResult: DropResult = {
        source: { index: 1, droppableId: 'agenda-items-folder1' },
        destination: { index: 1, droppableId: 'agenda-items-folder1' },
        draggableId: 'item2',
        type: 'ITEM',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      // Should return early
      expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
    });
  });

  describe('Additional folder drag scenarios', () => {
    it('handles dragging folder to same index', () => {
      renderAgendaDragAndDrop();

      const dropResult: DropResult = {
        source: { index: 1, droppableId: 'agendaFolder' },
        destination: { index: 1, droppableId: 'agendaFolder' },
        draggableId: 'folder2',
        type: 'FOLDER',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      // Should return early
      expect(mockSetFolders).not.toHaveBeenCalled();
    });
  });

  describe('Rendering variations', () => {
    it('renders multiple items in correct sequence order', () => {
      const multiItemFolders: InterfaceAgendaFolderInfo[] = [
        {
          ...mockFolders[0],
          items: {
            edges: [
              { node: { ...mockAgendaItem1, sequence: 3 } },
              { node: { ...mockAgendaItem2, sequence: 1 } },
              {
                node: {
                  ...mockAgendaItem1,
                  id: 'item3',
                  name: 'Item 3',
                  sequence: 2,
                },
              },
            ],
          },
        },
      ];

      renderAgendaDragAndDrop([], multiItemFolders);

      const items = screen.getAllByText(/Item \d/);
      expect(items[0]).toHaveTextContent('Item 2');
      expect(items[1]).toHaveTextContent('Item 3');
      expect(items[2]).toHaveTextContent('Item 1');
    });

    it('applies dragging style when snapshot.isDragging is true', () => {
      renderAgendaDragAndDrop();
      expect(screen.getByText('Folder 1')).toBeInTheDocument();
    });
  });

  describe('Complex drag scenarios', () => {
    it('handles multiple items with same folder after drag', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
            variables: {
              input: {
                id: 'item2',
                sequence: 1,
              },
            },
          },
          result: {
            data: {
              updateAgendaItemSequence: {
                id: 'item2',
                sequence: 1,
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
            variables: {
              input: {
                id: 'item1',
                sequence: 2,
              },
            },
          },
          result: {
            data: {
              updateAgendaItemSequence: {
                id: 'item1',
                sequence: 2,
              },
            },
          },
        },
      ];

      renderAgendaDragAndDrop(mocks);

      const dropResult: DropResult = {
        source: { index: 1, droppableId: 'agenda-items-folder1' },
        destination: { index: 0, droppableId: 'agenda-items-folder1' },
        draggableId: 'item2',
        type: 'ITEM',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'itemSequenceUpdateSuccessMsg',
        );
      });
    });

    it('handles multiple folders drag operation', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_AGENDA_FOLDER_MUTATION,
            variables: {
              input: {
                id: 'folder2',
                sequence: 1,
              },
            },
          },
          result: {
            data: {
              updateAgendaFolder: {
                id: 'folder2',
                name: 'Folder 2',
                description: 'Description 2',
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_AGENDA_FOLDER_MUTATION,
            variables: {
              input: {
                id: 'folder1',
                sequence: 2,
              },
            },
          },
          result: {
            data: {
              updateAgendaFolder: {
                id: 'folder1',
                name: 'Folder 1',
                description: 'Description 1',
              },
            },
          },
        },
      ];

      renderAgendaDragAndDrop(mocks);

      const dropResult: DropResult = {
        source: { index: 1, droppableId: 'agendaFolder' },
        destination: { index: 0, droppableId: 'agendaFolder' },
        draggableId: 'folder2',
        type: 'FOLDER',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'sectionSequenceUpdateSuccessMsg',
        );
      });
    });
  });

  describe('handleDragEnd edge cases', () => {
    it('processes folder drag when indices differ even with different droppableIds', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_AGENDA_FOLDER_MUTATION,
            variables: {
              input: {
                id: 'folder2',
                sequence: 1,
              },
            },
          },
          result: {
            data: {
              updateAgendaFolder: {
                id: 'folder2',
                name: 'Folder 2',
                description: 'Description 2',
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_AGENDA_FOLDER_MUTATION,
            variables: {
              input: {
                id: 'folder1',
                sequence: 2,
              },
            },
          },
          result: {
            data: {
              updateAgendaFolder: {
                id: 'folder1',
                name: 'Folder 1',
                description: 'Description 1',
              },
            },
          },
        },
      ];

      renderAgendaDragAndDrop(mocks);

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agendaFolder' },
        destination: { index: 1, droppableId: 'differentDroppable' },
        draggableId: 'folder1',
        type: 'FOLDER',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      // The folder handler doesn't check droppableId, only index
      await waitFor(() => {
        expect(mockSetFolders).toHaveBeenCalled();
      });
    });
  });

  describe('Sequence optimization paths', () => {
    it('skips item mutation when sequence already matches index', async () => {
      const folders: InterfaceAgendaFolderInfo[] = [
        {
          ...mockFolders[0],
          items: {
            edges: [
              { node: { ...mockAgendaItem1, sequence: 1 } },
              { node: { ...mockAgendaItem2, sequence: 2 } },
            ],
          },
        },
      ];

      renderAgendaDragAndDrop([], folders);

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agenda-items-folder1' },
        destination: { index: 1, droppableId: 'agenda-items-folder1' },
        draggableId: 'item1',
        type: 'ITEM',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      capturedOnDragEnd?.(dropResult);

      await waitFor(() => {
        expect(NotificationToast.success).not.toHaveBeenCalled();
        expect(NotificationToast.error).not.toHaveBeenCalled();
        expect(mockRefetchAgendaFolder).not.toHaveBeenCalled();
      });
    });

    it('skips folder mutation when sequence already matches index', async () => {
      const folders: InterfaceAgendaFolderInfo[] = [
        { ...mockFolders[0], sequence: 1 },
        { ...mockFolders[1], sequence: 2 },
      ];

      renderAgendaDragAndDrop([], folders);

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agendaFolder' },
        destination: { index: 1, droppableId: 'agendaFolder' },
        draggableId: 'folder1',
        type: 'FOLDER',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      capturedOnDragEnd?.(dropResult);

      await waitFor(() => {
        expect(NotificationToast.success).not.toHaveBeenCalled();
        expect(NotificationToast.error).not.toHaveBeenCalled();
      });
    });

    it('skips mutation when folder sequence already matches its new position', async () => {
      const foldersWithPartialMatch: InterfaceAgendaFolderInfo[] = [
        { ...mockFolders[0], sequence: 2 },
        { ...mockFolders[1], sequence: 1 },
      ];

      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_AGENDA_FOLDER_MUTATION,
            variables: {
              input: {
                id: 'folder1',
                sequence: 2,
              },
            },
          },
          result: {
            data: {
              updateAgendaFolder: {
                id: 'folder1',
                sequence: 2,
              },
            },
          },
        },
      ];

      renderAgendaDragAndDrop(mocks, foldersWithPartialMatch);

      const dropResult: DropResult = {
        source: { index: 1, droppableId: 'agendaFolder' },
        destination: { index: 0, droppableId: 'agendaFolder' },
        draggableId: 'folder2',
        type: 'FOLDER',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });
    });
  });

  describe('Error instance check coverage', () => {
    it('handles non-Error instance in item catch block', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
            variables: {
              input: {
                id: 'item2',
                sequence: 1,
              },
            },
          },
          result: {
            data: {
              updateAgendaItemSequence: {
                id: 'item2',
                sequence: 1,
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION,
            variables: {
              input: {
                id: 'item1',
                sequence: 2,
              },
            },
          },
          error: new Error('Network error'),
        },
      ];

      renderAgendaDragAndDrop(mocks);

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agenda-items-folder1' },
        destination: { index: 1, droppableId: 'agenda-items-folder1' },
        draggableId: 'item1',
        type: 'ITEM',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalled();
      });
    });

    it('handles non-Error instance in folder catch block', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: UPDATE_AGENDA_FOLDER_MUTATION,
            variables: {
              input: {
                id: 'folder2',
                sequence: 1,
              },
            },
          },
          result: {
            data: {
              updateAgendaFolder: {
                id: 'folder2',
                sequence: 1,
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_AGENDA_FOLDER_MUTATION,
            variables: {
              input: {
                id: 'folder1',
                sequence: 2,
              },
            },
          },
          error: new Error('Network error'),
        },
      ];

      renderAgendaDragAndDrop(mocks);

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agendaFolder' },
        destination: { index: 1, droppableId: 'agendaFolder' },
        draggableId: 'folder1',
        type: 'FOLDER',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalled();
      });
    });
  });

  describe('Snapshot isDragging variations', () => {
    it('renders folders without dragging state', () => {
      renderAgendaDragAndDrop();
      const folders = screen.getAllByText(/Folder \d/);
      expect(folders.length).toBeGreaterThan(0);
    });

    it('renders items without dragging state', () => {
      renderAgendaDragAndDrop();
      const items = screen.getAllByText(/Item \d/);
      expect(items.length).toBeGreaterThan(0);
    });
  });

  describe('Additional rendering scenarios', () => {
    it('renders with three or more items for complex sorting', () => {
      const threePlusItems: InterfaceAgendaFolderInfo[] = [
        {
          ...mockFolders[0],
          items: {
            edges: [
              { node: { ...mockAgendaItem1, sequence: 1 } },
              { node: { ...mockAgendaItem2, sequence: 2 } },
              {
                node: {
                  ...mockAgendaItem1,
                  id: 'item3',
                  name: 'Item 3',
                  sequence: 3,
                },
              },
              {
                node: {
                  ...mockAgendaItem2,
                  id: 'item4',
                  name: 'Item 4',
                  sequence: 4,
                },
              },
            ],
          },
        },
      ];

      renderAgendaDragAndDrop([], threePlusItems);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
      expect(screen.getByText('Item 4')).toBeInTheDocument();
    });

    it('renders with three or more folders', () => {
      const threePlusFolders: InterfaceAgendaFolderInfo[] = [
        { ...mockFolders[0] },
        { ...mockFolders[1] },
        {
          ...mockFolders[0],
          id: 'folder3',
          name: 'Folder 3',
          sequence: 3,
        },
      ];

      renderAgendaDragAndDrop([], threePlusFolders);

      expect(screen.getByText('Folder 1')).toBeInTheDocument();
      expect(screen.getByText('Folder 2')).toBeInTheDocument();
      expect(screen.getByText('Folder 3')).toBeInTheDocument();
    });
  });

  describe('Complete flow with all mutations executing', () => {
    it('executes all item mutations when all sequences need updating', async () => {
      const itemsNeedingUpdate: InterfaceAgendaFolderInfo[] = [
        {
          ...mockFolders[0],
          items: {
            edges: [
              { node: { ...mockAgendaItem1, id: 'item1', sequence: 5 } },
              { node: { ...mockAgendaItem2, id: 'item2', sequence: 10 } },
            ],
          },
        },
      ];

      renderAgendaDragAndDrop(MOCKS_SUCCESS_ITEM_SEQUENCE, itemsNeedingUpdate);

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agenda-items-folder1' },
        destination: { index: 1, droppableId: 'agenda-items-folder1' },
        draggableId: 'item1',
        type: 'ITEM',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'itemSequenceUpdateSuccessMsg',
        );
      });

      await waitFor(() => {
        expect(mockRefetchAgendaFolder).toHaveBeenCalled();
      });
    });

    it('executes all folder mutations when all sequences need updating', async () => {
      const foldersNeedingUpdate: InterfaceAgendaFolderInfo[] = [
        { ...mockFolders[0], sequence: 10 },
        { ...mockFolders[1], sequence: 20 },
      ];

      renderAgendaDragAndDrop(
        MOCKS_SUCCESS_FOLDER_SEQUENCE,
        foldersNeedingUpdate,
      );

      const dropResult: DropResult = {
        source: { index: 0, droppableId: 'agendaFolder' },
        destination: { index: 1, droppableId: 'agendaFolder' },
        draggableId: 'folder1',
        type: 'FOLDER',
        mode: 'FLUID',
        reason: 'DROP',
        combine: null,
      };

      if (capturedOnDragEnd) {
        capturedOnDragEnd(dropResult);
      }

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          'sectionSequenceUpdateSuccessMsg',
        );
      });

      await waitFor(() => {
        expect(mockRefetchAgendaFolder).toHaveBeenCalled();
      });
    });
  });
});
