/** UI-mapped representation of a user tag for table display. */
export interface InterfaceUserTag {
  id: string;
  name: string;
  assignedTo: number;
  createdOn: string;
  createdBy?: string;
}
/** Shape of the GraphQL response for the GetUserTags query. */
export interface InterfaceGetUserTagsData {
  userTags: InterfaceUserTagGQL[];
}
/** Raw GraphQL shape for a single user tag as returned by the API. */
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
