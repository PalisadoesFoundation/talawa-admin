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
};

// the page limit for tag related queries
export const TAGS_QUERY_PAGE_SIZE = 10;

// the tag action type
export type TagActionType = 'assignToTags' | 'removeFromTags';

// interfaces for tag queries
export interface InterfaceOrganizationTagsQuery {
  data?: {
    organizations: InterfaceQueryOrganizationUserTags[];
  };
  loading: boolean;
  error?: ApolloError;
  refetch: () => void;
  fetchMore: (options: {
    variables: {
      first: number;
      after?: string;
    };
    updateQuery: (
      previousResult: { organizations: InterfaceQueryOrganizationUserTags[] },
      options: {
        fetchMoreResult?: {
          organizations: InterfaceQueryOrganizationUserTags[];
        };
      },
    ) => { organizations: InterfaceQueryOrganizationUserTags[] };
  }) => void;
}

export interface InterfaceOrganizationSubTagsQuery {
  data?: {
    getUserTag: InterfaceQueryUserTagChildTags;
  };
  loading: boolean;
  error?: ApolloError;
  refetch: () => void;
  fetchMore: (options: {
    variables: {
      first: number;
      after?: string;
    };
    updateQuery: (
      previousResult: { getUserTag: InterfaceQueryUserTagChildTags },
      options: {
        fetchMoreResult?: { getUserTag: InterfaceQueryUserTagChildTags };
      },
    ) => { getUserTag: InterfaceQueryUserTagChildTags };
  }) => void;
}

export interface InterfaceTagAssignedMembersQuery {
  data?: {
    getUserTag: InterfaceQueryUserTagsAssignedMembers;
  };
  loading: boolean;
  error?: ApolloError;
  refetch: () => void;
  fetchMore: (options: {
    variables: {
      after?: string | null;
      first?: number | null;
    };
    updateQuery?: (
      previousQueryResult: {
        getUserTag: InterfaceQueryUserTagsAssignedMembers;
      },
      options: {
        fetchMoreResult: {
          getUserTag: InterfaceQueryUserTagsAssignedMembers;
        };
      },
    ) => { getUserTag: InterfaceQueryUserTagsAssignedMembers };
  }) => Promise<unknown>;
}

export interface InterfaceTagUsersToAssignToQuery {
  data?: {
    getUserTag: InterfaceQueryUserTagsMembersToAssignTo;
  };
  loading: boolean;
  error?: ApolloError;
  fetchMore: (options: {
    variables: {
      after?: string | null;
      first?: number | null;
    };
    updateQuery?: (
      previousQueryResult: {
        getUserTag: InterfaceQueryUserTagsMembersToAssignTo;
      },
      options: {
        fetchMoreResult: {
          getUserTag: InterfaceQueryUserTagsMembersToAssignTo;
        };
      },
    ) => { getUserTag: InterfaceQueryUserTagsMembersToAssignTo };
  }) => Promise<unknown>;
}
