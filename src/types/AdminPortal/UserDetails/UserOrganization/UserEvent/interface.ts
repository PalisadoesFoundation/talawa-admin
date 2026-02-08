export interface InterfaceUserTag {
  id: string;
  name: string;
  assignedTo: number;
  createdOn: string;
  createdBy?: string;
}
export interface InterfaceGetUserTagsData {
  userTags: InterfaceUserTagGQL[];
}

export interface InterfaceUserTagGQL {
  id: string;
  name: string;
  createdAt: string;
  folder?: {
    id: string;
  } | null;
  assignees?: {
    edges: {
      node: {
        id: string;
      };
    }[];
  } | null;
  creator?: {
    id: string;
    name: string;
  } | null;
}
