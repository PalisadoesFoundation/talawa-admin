import type { TagActionType } from 'utils/organizationTagsUtils';
import type { InterfaceTagData } from 'utils/interfaces';

export interface InterfaceTagSelectionItem {
  id: string;
  name: string;
}

export interface InterfaceRootFolderQuery {
  organization?: {
    id: string;
    tagFolders?: {
      edges?: Array<{
        node: {
          id: string;
          name: string;
          parentFolder?: {
            id: string;
          } | null;
        };
      }>;
      pageInfo?: {
        endCursor?: string | null;
        hasNextPage?: boolean;
      };
    };
  };
}

export interface InterfaceTagFolderItem {
  id: string;
  name: string;
  parentFolderId: string | null;
  childFolderIds: string[];
  tags: InterfaceTagSelectionItem[];
  loaded: boolean;
  loading: boolean;
}

export interface InterfaceTagFolderNodeQuery {
  tagFolder?: {
    id: string;
    name: string;
    parentFolder?: {
      id: string;
    } | null;
    childFolders?: {
      edges?: Array<{
        node: {
          id: string;
          name: string;
          parentFolder?: {
            id: string;
          } | null;
        };
      }>;
      pageInfo?: {
        endCursor?: string | null;
        hasNextPage?: boolean;
      };
    };
  };
}

export interface InterfaceOrganizationTagsQuery {
  organization?: {
    id: string;
    tags?: {
      edges?: Array<{
        node: {
          id: string;
          name: string;
          folder?: {
            id: string;
          } | null;
        };
      }>;
      pageInfo?: {
        endCursor?: string | null;
        hasNextPage?: boolean;
      };
    };
  };
}

export interface InterfaceTagActionsProps {
  tagActionsModalIsOpen: boolean;
  hideTagActionsModal: () => void;
  tagActionType: TagActionType;
  assigneeIds?: string[];
}

export interface InterfaceTagNodeProps {
  tag: InterfaceTagData;
  checkedTags: Set<string>;
  toggleTagSelection: (tag: InterfaceTagData, isSelected: boolean) => void;
}
