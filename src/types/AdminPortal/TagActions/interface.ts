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
          assignees?: {
            edges?: Array<{
              node: {
                id: string;
              };
            }>;
          };
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

/**
 * Parameters accepted by `useTagActionsNavigation`.
 */
export interface InterfaceUseTagActionsNavigationParams {
  currentFolderId: string | null;
  folderStateMap: Map<string, InterfaceTagFolderItem>;
  searchTerm: string;
  tagActionType: TagActionType;
}

/**
 * Derived navigation data returned by `useTagActionsNavigation`.
 */
export interface InterfaceUseTagActionsNavigationResult {
  rootFolderIds: string[];
  currentFolder: InterfaceTagFolderItem | null;
  breadcrumbFolderIds: string[];
  visibleFolderIds: string[];
  visibleTags: InterfaceTagSelectionItem[];
}

/**
 * Props for rendering the folder/tag content area of the TagActions modal.
 */
export interface InterfaceTagActionsContentProps {
  hasAssignees: boolean;
  currentFolderId: string | null;
  breadcrumbFolderIds: string[];
  folderStateMap: Map<string, InterfaceTagFolderItem>;
  onOpenFolder: (folderId: string) => void;
  onGoToRoot: () => void;
  manageTagTranslator: (key: string) => string;
  organizationTagsTranslator: (key: string) => string;
  rootFoldersLoading: boolean;
  rootFolderIds: string[];
  rootFoldersError?: Error;
  visibleFolderIds: string[];
  currentFolder: InterfaceTagFolderItem | null;
  visibleTags: InterfaceTagSelectionItem[];
  checkedTags: Set<string>;
  onToggleTagSelection: (
    tag: InterfaceTagSelectionItem,
    isSelected: boolean,
  ) => void;
}
