import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      user {
        _id
        userType
      }
      accessToken
      refreshToken
    }
  }
`;

export const CREATE_ORGANIZATION_MUTATION = gql`
  mutation CreateOrganization($description: String!, $name: String!) {
    createOrganization(
      data: {
        description: $description
        name: $name
        visibleInSearch: true
        isPublic: true
      }
    ) {
      _id
    }
  }
`;
