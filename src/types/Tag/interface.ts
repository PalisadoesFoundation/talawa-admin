import type { TFunction } from 'i18next';
import type { ApolloError } from '@apollo/client';

export interface InterfaceMemberData {
  _id: string;
  name: string;
}

export interface InterfaceTagMembersData {
  edges: {
    node: {
      id: string;
      name: string;
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
  tag: {
    id: string;
    name: string;
    organization: {
      id: string;
      members: {
        edges: Array<{
          node: {
            id: string;
            name: string;
          };
          cursor: string;
        }>;
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string;
        };
      };
    };
  };
}

export interface InterfaceTagUsersToAssignToQuery
  extends InterfaceBaseQueryResult {
  data?: {
    tag: InterfaceQueryUserTagsMembersToAssignTo['tag'];
  };
  fetchMore: (
    options: InterfaceBaseFetchMoreOptions<{
      tag: InterfaceQueryUserTagsMembersToAssignTo['tag'];
    }>,
  ) => void;
}
