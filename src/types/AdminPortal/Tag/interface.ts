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
