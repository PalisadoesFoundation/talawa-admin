import type { FormEvent } from 'react';
import type { DropResult } from '@hello-pangea/dnd';

/**
 * Defines the structure for agenda item category information.
 */
export interface InterfaceAgendaItemCategoryInfo {
  id: string;
  name: string;
  description: string;
  creator: {
    id: string;
    name: string;
  };
}

/**
 * Defines the structure for a list of agenda item categories by organization.
 */
export interface InterfaceAgendaItemCategoryList {
  agendaCategoriesByEventId: InterfaceAgendaItemCategoryInfo[];
}

/**
 * Defines the structure for agenda item information.
 */
export interface InterfaceAgendaItemInfo {
  id: string;
  name: string;
  description: string;
  duration: string;
  sequence: number;
  type?: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
  attachments?: {
    id: string;
    name: string;
    mimeType: string;
    fileHash: string;
    objectName: string;
  }[];
  creator: {
    id: string;
    name: string;
  };
  url: {
    id: string;
    url: string;
  }[];
  folder: {
    id: string;
    name: string;
  } | null;
  // organization: {
  //   _id: string;
  //   name: string;
  // };
  event: {
    id: string;
    name: string;
  };
}

/**
 * Defines the structure for agenda folder information.
 * Represents a folder/section containing grouped agenda items for an event.
 */
export interface InterfaceAgendaFolderInfo {
  id: string;
  name: string;
  description?: string;
  sequence: number;
  key?: string;
  isDefaultFolder?: boolean;
  items: {
    edges: {
      node: {
        id: string;
        name: string;
        description: string;
        duration: string;
        sequence: number;
        attachments?: {
          id: string;
          name: string;
          mimeType: string;
          objectName: string;
          fileHash: string;
        }[];
        category: {
          id: string;
          name: string;
          description: string;
        };
        creator: {
          id: string;
          name: string;
        };
        url: {
          id: string;
          url: string;
        }[];
        folder: {
          id: string;
          name: string;
        } | null;
        event: {
          id: string;
          name: string;
        };
      };
    }[];
  };
}

/**
 * Defines the structure for a list of agenda folders by event.
 */
export interface InterfaceAgendaFolderList {
  agendaFoldersByEventId: InterfaceAgendaFolderInfo[];
}

/**
 * Defines the structure for file attachments in agenda items.
 */
export interface InterfaceAttachment {
  name: string;
  mimeType: string;
  fileHash: string;
  objectName: string;
  previewUrl?: string;
}

/**
 * Defines the form state structure for creating a new agenda item.
 */
export interface InterfaceCreateFormStateType {
  id: string;
  folderId: string | null;
  title: string;
  description: string;
  duration: string;
  attachments: InterfaceAttachment[];
  urls: string[];
  creator: {
    name: string;
  };
  categoryId: string;
}

/**
 * Defines the form state structure for viewing/updating an agenda item.
 */
export interface InterfaceFormStateType {
  id: string;
  name: string;
  description: string;
  duration: string;
  category: string;
  attachments: {
    name: string;
    objectName: string;
    mimeType: string;
    fileHash: string;
    previewUrl?: string;
  }[];
  url: string[];
  folder?: string;
}

export interface InterfaceAgendaItemsCreateModalProps {
  agendaItemCreateModalIsOpen: boolean;
  hideItemCreateModal: () => void;
  eventId: string;
  t: (key: string) => string;
  agendaItemCategories: InterfaceAgendaItemCategoryInfo[] | undefined;
  agendaFolderData: InterfaceAgendaFolderInfo[] | undefined;
  refetchAgendaFolder: () => void;
}

/**
 * Props for the AgendaItemsUpdateModal component.
 */
export interface InterfaceAgendaItemsUpdateModalProps {
  agendaItemUpdateModalIsOpen: boolean;
  hideUpdateItemModal: () => void;
  itemFormState: InterfaceFormStateType;
  setItemFormState: (
    state: React.SetStateAction<InterfaceFormStateType>,
  ) => void;
  updateAgendaItemHandler: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
  agendaItemCategories: InterfaceAgendaItemCategoryInfo[] | undefined;
  agendaFolderData: InterfaceAgendaFolderInfo[] | undefined;
}

/**
 * Props for the AgendaItemsDeleteModal component.
 */
export interface InterfaceAgendaItemsDeleteModalProps {
  agendaItemDeleteModalIsOpen: boolean;
  toggleDeleteItemModal: () => void;
  deleteAgendaItemHandler: () => Promise<void>;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

/**
 * Props for the AgendaFolderDeleteModal component.
 */
export interface InterfaceAgendaFolderDeleteModalProps {
  agendaFolderDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  deleteAgendaFolderHandler: () => Promise<void>;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

export interface InterfaceAgendaFolderCreateFormStateType {
  id: string;
  name: string;
  description: string;
  creator: {
    name: string;
  };
}

export interface InterfaceAgendaFolderCreateModalProps {
  agendaFolderCreateModalIsOpen: boolean;
  hideCreateModal: () => void;
  eventId: string;
  agendaFolderData: InterfaceAgendaFolderList | undefined;
  t: (key: string) => string;
  refetchAgendaFolder: () => void;
}

export interface InterfaceAgendaFolderUpdateFormStateType {
  id: string;
  name: string;
  description: string;
  creator: {
    id: string;
    name: string;
  };
}

export interface InterfaceAgendaFolderUpdateModalProps {
  agendaFolderUpdateModalIsOpen: boolean;
  hideUpdateModal: () => void;
  folderFormState: InterfaceAgendaFolderUpdateFormStateType;
  setFolderFormState: (
    state: React.SetStateAction<InterfaceAgendaFolderUpdateFormStateType>,
  ) => void;
  updateAgendaFolderHandler: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
}

interface InterfaceItemFormStateType {
  id: string;
  name: string;
  description: string;
  duration: string;
  attachment?: {
    mimeType: string;
    previewUrl: string;
  }[];
  creator: {
    id: string;
    name: string;
  };
  category: {
    name: string;
    description: string;
  };
  url: string[];
}

/**
 * Props for the AgendaItemsPreviewModal component.
 *
 * Defines the data and callback functions required to display
 * agenda item details in a preview modal and perform related actions
 * such as updating or deleting an agenda item.
 */
export interface InterfaceAgendaItemsPreviewModalProps {
  agendaItemPreviewModalIsOpen: boolean;
  hidePreviewModal: () => void;
  showUpdateItemModal: () => void;
  toggleDeleteItemModal: () => void;
  formState: InterfaceItemFormStateType;
  t: (key: string) => string;
}

/**
 * Props for the AgendaDragAndDrop component.
 *
 * Defines the data and callback handlers required to render
 * agenda folders and agenda items with drag-and-drop support,
 * along with edit, preview, and delete actions.
 */
export interface InterfaceAgendaDragAndDropProps {
  folders: InterfaceAgendaFolderInfo[];
  agendaFolderConnection: 'Event';
  t: (key: string) => string;

  onFolderDragEnd: (result: DropResult) => Promise<void>;
  onItemDragEnd: (result: DropResult) => Promise<void>;

  onEditFolder: (folder: InterfaceAgendaFolderInfo) => void;
  onDeleteFolder: (folder: InterfaceAgendaFolderInfo) => void;

  onPreviewItem: (item: InterfaceAgendaItemInfo) => void;
  onEditItem: (item: InterfaceAgendaItemInfo) => void;
  onDeleteItem: (item: InterfaceAgendaItemInfo) => void;
}

export interface InterfaceUseAgendaMutationsProps {
  refetchAgendaFolder: () => void;
  t: (key: string) => string;
}
