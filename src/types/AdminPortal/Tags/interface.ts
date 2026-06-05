export interface InterfaceTagFolderNode {
  id: string;
  name: string;
  createdAt?: string | null;
  creator?: {
    id?: string;
    name?: string | null;
  } | null;
  childFolders?: {
    edges?: Array<{
      node: {
        id: string;
      };
    }>;
  };
  tags?: {
    edges?: Array<{
      node: {
        id: string;
      };
    }>;
  };
}

export interface InterfaceTagNode {
  id: string;
  name: string;
  createdAt?: string | null;
  creator?: {
    id?: string;
    name?: string | null;
  } | null;
  usersAssignedTo?: {
    edges?: Array<{
      node: {
        id: string;
      };
    }>;
  };
  folder?: {
    id: string;
  } | null;
}

export interface InterfaceTagFolderTableRow {
  id: string;
  name: string;
  rowType: 'folder' | 'tag';
  createdAt?: string | null;
  createdBy?: string | null;
  childFoldersCount?: number;
  tagsCount?: number;
}

export interface InterfaceTagFolderData {
  id: string;
  name: string;
  tags?: {
    edges?: Array<{
      node: InterfaceTagNode;
    }>;
  };
  childFolders: {
    edges: Array<{
      node: InterfaceTagFolderNode;
    }>;
    pageInfo: {
      endCursor: string | null;
      hasNextPage: boolean;
    };
  };
  parentFolder?: {
    id: string;
    name: string;
    parentFolder?: {
      id: string;
      name: string;
      parentFolder?: {
        id: string;
        name: string;
      } | null;
    } | null;
  } | null;
}

export interface InterfaceTagFolderChildFoldersQuery {
  tagFolder?: InterfaceTagFolderData;
}

export interface InterfaceOrganizationTagsWithFolderQuery {
  organization?: {
    id: string;
    tags?: {
      edges?: Array<{
        node: InterfaceTagNode;
      }>;
    };
  };
}

export interface InterfaceManageTag {
  id: string;
  name: string;
}

export interface InterfaceManageTagModalProps {
  open: boolean;
  tag: InterfaceManageTag | null;
  onClose: () => void;
  onRefetch: () => Promise<unknown> | unknown;
  modalTestId?: string;
  inputTestId?: string;
  deleteModalTestId?: string;
}

export interface InterfaceManageFolder {
  id: string;
  name: string;
}

export interface InterfaceManageFolderModalProps {
  open: boolean;
  folder: InterfaceManageFolder | null;
  onClose: () => void;
  onRefetch: () => Promise<unknown> | unknown;
  modalTestId?: string;
  inputTestId?: string;
  deleteModalTestId?: string;
}
