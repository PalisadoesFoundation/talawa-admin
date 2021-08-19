import { gql } from '@apollo/client';

export const UPDATE_ORGANIZATION_MUTATION = gql`
  mutation UpdateOrganization(
    $id: ID!
    $name: String
    $description: String
    $isPublic: Boolean
    $visibleInSearch: Boolean
  ) {
    updateOrganization(
      id: $id
      data: {
        name: $name
        description: $description
        isPublic: $isPublic
        visibleInSearch: $visibleInSearch
      }
    ) {
      _id
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUserProfile(
    $firstName: String
    $lastName: String
    $email: String
  ) {
    updateUserProfile(
      data: { firstName: $firstName, lastName: $lastName, email: $email }
    ) {
      _id
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation SignUp(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $userType: UserType
  ) {
    signUp(
      data: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
        userType: $userType
      }
    ) {
      user {
        _id
      }
      accessToken
      refreshToken
    }
  }
`;

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
  mutation CreateOrganization(
    $description: String!
    $name: String!
    $visibleInSearch: Boolean!
    $isPublic: Boolean!
  ) {
    createOrganization(
      data: {
        description: $description
        name: $name
        visibleInSearch: $visibleInSearch
        isPublic: $isPublic
      }
    ) {
      _id
    }
  }
`;

export const DELETE_ORGANIZATION_MUTATION = gql`
  mutation RemoveOrganization($id: ID!) {
    removeOrganization(id: $id) {
      _id
    }
  }
`;

export const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent(
    $title: String!
    $description: String!
    $recurring: Boolean!
    $isPublic: Boolean!
    $isRegisterable: Boolean!
    $organizationId: ID!
    $startDate: String!
    $endDate: String
    $allDay: Boolean!
  ) {
    createEvent(
      data: {
        title: $title
        description: $description
        recurring: $recurring
        isPublic: $isPublic
        isRegisterable: $isRegisterable
        organizationId: $organizationId
        startDate: $startDate
        endDate: $endDate
        allDay: $allDay
        recurrance: "DAILY"
        attendees: "0"
        startTime: "00:00"
        endTime: "01:10"
        location: "India"
      }
    ) {
      _id
    }
  }
`;

export const DELETE_EVENT_MUTATION = gql`
  mutation RemoveEvent($id: ID!) {
    removeEvent(id: $id) {
      _id
    }
  }
`;

export const REMOVE_ADMIN_MUTATION = gql`
  mutation RemoveAdmin($orgid: ID!, $userid: ID!) {
    removeAdmin(data: { organizationId: $orgid, userId: $userid }) {
      _id
    }
  }
`;

export const REMOVE_MEMBER_MUTATION = gql`
  mutation RemoveAdmin($orgid: ID!, $userid: ID!) {
    removeAdmin(data: { organizationId: $orgid, userId: $userid }) {
      _id
    }
  }
`;

export const ADD_ADMIN_MUTATION = gql`
  mutation CreateAdmin($orgid: ID!, $userid: ID!) {
    createAdmin(data: { organizationId: $orgid, userId: $userid }) {
      _id
    }
  }
`;
