import type { TFunction } from 'i18next';
import type { ApolloError } from '@apollo/client';

export interface InterfaceMemberData {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface InterfaceTagMembersData {
  edges: {
    node: {
      _id: string;
      firstName: string;
      lastName: string;
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

export interface InterfaceAddPeopleToTagProps {
  addPeopleToTagModalIsOpen: boolean;
  hideAddPeopleToTagModal: () => void;
  refetchAssignedMembersData: () => void;
  t: TFunction<'translation', 'manageTag'>;
  tCommon: TFunction<'common', undefined>;
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
  name: string;
  usersToAssignTo: InterfaceTagMembersData;
}

export interface InterfaceTagUsersToAssignToQuery extends InterfaceBaseQueryResult {
  data?: {
    getUsersToAssignTo: InterfaceQueryUserTagsMembersToAssignTo;
  };
  fetchMore: (
    options: InterfaceBaseFetchMoreOptions<{
      getUsersToAssignTo: InterfaceQueryUserTagsMembersToAssignTo;
    }>,
  ) => void;
}
