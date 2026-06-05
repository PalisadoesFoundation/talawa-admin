import type { ApolloError } from '@apollo/client';

export interface InterfaceMemberData {
  _id: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

export interface InterfaceTagMembersData {
  edges: {
    node: {
      _id: string;
      name: string;
      firstName?: string;
      lastName?: string;
    };
  }[];
  pageInfo: {
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  totalCount: number;
}

export interface InterfaceTagAssigneesData {
  edges: {
    node: {
      id: string;
    } | null;
  }[];
}

export interface InterfaceAddPeopleToTagProps {
  addPeopleToTagModalIsOpen: boolean;
  hideAddPeopleToTagModal: () => void;
  refetchAssignedMembersData: () => void;
}

export interface InterfacePaginationVariables {
  after?: string | null;
  first?: number | null;
}

export interface InterfaceBaseQueryResult {
  loading: boolean;
  error?: ApolloError;
  refetch?: () => void;
}

export interface InterfaceBaseFetchMoreOptions<T> {
  variables: InterfacePaginationVariables;
  updateQuery?: (prev: T, options: { fetchMoreResult: T }) => T;
}

export interface InterfaceQueryUserTagsMembersToAssignTo {
  organization?: {
    id: string;
    members: InterfaceTagMembersData;
  };
  tag?: {
    id: string;
    assignees: InterfaceTagAssigneesData;
  };
}

export interface InterfaceTagUsersToAssignToQuery extends InterfaceBaseQueryResult {
  data?: InterfaceQueryUserTagsMembersToAssignTo;
  fetchMore: (
    options: InterfaceBaseFetchMoreOptions<InterfaceQueryUserTagsMembersToAssignTo>,
  ) => void;
}

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

export interface InterfaceOrganizationTagFoldersQuery {
  organization?: {
    id: string;
    name: string;
    tagFolders?: {
      edges: Array<{
        node: InterfaceTagFolderNode;
      }>;
      pageInfo?: {
        hasNextPage?: boolean;
        endCursor?: string | null;
      };
    };
  };
}

export interface InterfaceOrganizationTagCountsQuery {
  organization?: {
    id: string;
    tags?: {
      edges?: Array<{
        node: {
          id: string;
          folder?: {
            id: string;
          } | null;
        };
      }>;
    };
  };
}
