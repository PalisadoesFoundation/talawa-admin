import type { ChangeEvent } from 'react';
import { InterfaceAgendaFolderInfo } from 'utils/interfaces';

export interface InterfaceAgendaItemCategoryInfo {
  id: string;
  name: string;
  description: string;
  creator: {
    id: string;
    name: string;
  };
}

export interface InterfaceAttachment {
  mimeType: string;
  fileHash: string;
  objectName: string;
  previewUrl?: string;
}

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

export interface InterfaceFormStateType {
  id: string;
  name: string;
  description: string;
  duration: string;
  category: string;
  attachments: string[];
  url: string[];
  folder?: string;
}

export interface InterfaceAgendaItemsCreateModalProps {
  agendaItemCreateModalIsOpen: boolean;
  hideItemCreateModal: () => void;
  agendaItemFormState: InterfaceCreateFormStateType;
  setAgendaItemFormState: (
    state: React.SetStateAction<InterfaceCreateFormStateType>,
  ) => void;
  createAgendaItemHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
  agendaItemCategories: InterfaceAgendaItemCategoryInfo[] | undefined;
  agendaFolderData: InterfaceAgendaFolderInfo[] | undefined;
}

export interface InterfaceAgendaItemsPreviewModalProps {
  agendaItemPreviewModalIsOpen: boolean;
  hidePreviewModal: () => void;
  showUpdateModal: () => void;
  toggleDeleteModal: () => void;
  formState: InterfaceFormStateType;
  t: (key: string) => string;
}

export interface InterfaceAgendaItemsUpdateModalProps {
  agendaItemUpdateModalIsOpen: boolean;
  hideUpdateItemModal: () => void;
  itemFormState: InterfaceFormStateType;
  setItemFormState: (
    state: React.SetStateAction<InterfaceFormStateType>,
  ) => void;
  updateAgendaItemHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
  agendaItemCategories: InterfaceAgendaItemCategoryInfo[] | undefined;
  agendaFolderData: InterfaceAgendaFolderInfo[] | undefined;
}

export interface InterfaceAgendaItemsDeleteModalProps {
  agendaItemDeleteModalIsOpen: boolean;
  toggleDeleteItemModal: () => void;
  deleteAgendaItemHandler: () => Promise<void>;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

export interface InterfaceAgendaFolderDeleteModalProps {
  agendaFolderDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  deleteAgendaFolderHandler: () => Promise<void>;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}
