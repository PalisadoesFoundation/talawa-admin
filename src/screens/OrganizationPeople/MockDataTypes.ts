import { FetchResult } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';
type User = {
  __typename: string;
  firstName: string;
  lastName: string;
  image: string | null;
  id: string;
  email: string;
  createdAt: string;
  joinedOrganizations: {
    __typename: string;
    id: string;
    name?: string;
    creator?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      image: null;
      createdAt: string;
    };
  }[];
};
type Edge = {
  id?: string;
  firstName?: string;
  lastName?: string;
  image?: string | null;
  email?: string;
  createdAt?: string;
  user?: Edge;
};

enum UserRole {
  'administrator',
  'regular',
}

export type TestMock = {
  request: {
    query: DocumentNode;
    variables: {
      id?: string;
      orgId?: string;
      first?: number | null;
      after?: string | null;
      last?: number | null;
      before?: string | null;
      where?: { role: { equal: UserRole } };
      orgid?: string;
      firstNameContains?: string;
      lastNameContains?: string;
      firstName_contains?: string;
      lastName_contains?: string;
      id_not_in?: string[];
      userid?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    };
  };
  result?: {
    data: {
      organization?: {
        members?: {
          edges: Array<{
            node: {
              id: string;
              name: string;
              emailAddress: string;
              avatarURL: string | null;
              createdAt: string;
            };
            cursor: string;
          }>;
          pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string;
            endCursor: string;
          };
        };
      };
      allUsers?: {
        edges: Array<{
          node: {
            id: string;
            name: string;
            emailAddress: string;
            avatarURL: string | null;
            createdAt: string;
          };
          cursor: string;
        }>;
        pageInfo: {
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          startCursor: string;
          endCursor: string;
        };
      };
      removeMember?: {
        id: string;
      };
      createMember?: {
        id: string;
      };
      signUp?: {
        user?: {
          id: string;
        };
        accessToken?: string;
        refreshToken?: string;
      };
      users?: { user?: User }[];
      organizations?: InterfaceQueryOrganizationsListObject[];
      organizationsMemberConnection?: {
        edges?: Edge[];
        user?: Edge[];
      };
    };
  };
  error?: Error;
  newData?: () => FetchResult<Record<string, any>>;
};
