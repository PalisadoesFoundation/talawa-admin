import type { DocumentNode } from 'graphql';
import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';
type User = {
  __typename: string;
  firstName: string;
  lastName: string;
  image: string | null;
  _id: string;
  email: string;
  userType: string;
  createdAt: string;
  joinedOrganizations: {
    __typename: string;
    _id: string;
    name?: string;
    creator?: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      image: null;
      createdAt: string;
    };
  }[];
};
type Edge = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  image?: string | null;
  email?: string;
  createdAt?: string;
  userType?: string;
  user?: Edge;
};
export type TestMock = {
  request: {
    query: DocumentNode;
    variables: {
      id?: string;
      orgId?: string;
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
  result: {
    __typename?: string;
    data: {
      __typename?: string;
      createMember?: {
        __typename: string;
        _id: string;
      };
      signUp?: {
        user?: {
          _id: string;
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
  newData?: () => TestMock['result'];
};
