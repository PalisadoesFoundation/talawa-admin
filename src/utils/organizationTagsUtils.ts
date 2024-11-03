// This file will contain the utililities for organization tags

import type { ApolloError } from '@apollo/client';
import type {
  InterfaceQueryOrganizationUserTags,
  InterfaceQueryUserTagChildTags,
  InterfaceQueryUserTagsAssignedMembers,
  InterfaceQueryUserTagsMembersToAssignTo,
} from './interfaces';

// This is the style object for mui's data grid used to list the data (tags and member data)
export const dataGridStyle = {
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
  '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-row.Mui-hovered': {
    backgroundColor: 'transparent',
  },
  '& .MuiDataGrid-root': {
    borderRadius: '0.1rem',
  },
  '& .MuiDataGrid-main': {
    borderRadius: '0.1rem',
  },
  '& .MuiDataGrid-topContainer': {
    position: 'fixed',
    top: 259,
    zIndex: 1,
  },
  '& .MuiDataGrid-virtualScrollerContent': {
    marginTop: 6.5,
  },
};

// the data chunk size for tag related queries
export const TAGS_QUERY_DATA_CHUNK_SIZE = 10;

// the tag action type
export type TagActionType = 'assignToTags' | 'removeFromTags';

// Interfaces for tag queries:
// 1. Base interface for Apollo query results
interface InterfaceBaseQueryResult {
  loading: boolean;
  error?: ApolloError;
  refetch?: () => void;
}

// 2. Generic pagination options
interface InterfacePaginationVariables {
  after?: string | null;
  first?: number | null;
}

// 3. Generic fetch more options
interface InterfaceBaseFetchMoreOptions<T> {
  variables: InterfacePaginationVariables;
  updateQuery?: (prev: T, options: { fetchMoreResult: T }) => T;
}

// 4. Query interfaces
export interface InterfaceOrganizationTagsQuery
  extends InterfaceBaseQueryResult {
  data?: {
    organizations: InterfaceQueryOrganizationUserTags[];
  };
  fetchMore: (
    options: InterfaceBaseFetchMoreOptions<{
      organizations: InterfaceQueryOrganizationUserTags[];
    }>,
  ) => void;
}

export interface InterfaceOrganizationSubTagsQuery
  extends InterfaceBaseQueryResult {
  data?: {
    getChildTags: InterfaceQueryUserTagChildTags;
  };
  fetchMore: (
    options: InterfaceBaseFetchMoreOptions<{
      getChildTags: InterfaceQueryUserTagChildTags;
    }>,
  ) => void;
}

export interface InterfaceTagAssignedMembersQuery
  extends InterfaceBaseQueryResult {
  data?: {
    getAssignedUsers: InterfaceQueryUserTagsAssignedMembers;
  };
  fetchMore: (
    options: InterfaceBaseFetchMoreOptions<{
      getAssignedUsers: InterfaceQueryUserTagsAssignedMembers;
    }>,
  ) => void;
}

export interface InterfaceTagUsersToAssignToQuery
  extends InterfaceBaseQueryResult {
  data?: {
    getUsersToAssignTo: InterfaceQueryUserTagsMembersToAssignTo;
  };
  fetchMore: (
    options: InterfaceBaseFetchMoreOptions<{
      getUsersToAssignTo: InterfaceQueryUserTagsMembersToAssignTo;
    }>,
  ) => void;
}
