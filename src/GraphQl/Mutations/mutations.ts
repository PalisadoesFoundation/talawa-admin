import gql from 'graphql-tag';

// List of the mutations used in the code

// to unblock the user

export const UNBLOCK_USER_MUTATION = gql`
  mutation UnblockUser($userId: ID!, $orgId: ID!) {
    unblockUser(organizationId: $orgId, userId: $userId) {
      _id
    }
  }
`;

// to block the user

export const BLOCK_USER_MUTATION = gql`
  mutation BlockUser($userId: ID!, $orgId: ID!) {
    blockUser(organizationId: $orgId, userId: $userId) {
      _id
    }
  }
`;

// to reject the organization request

export const REJECT_ORGANIZATION_REQUEST_MUTATION = gql`
  mutation RejectMembershipRequest($id: ID!) {
    rejectMembershipRequest(membershipRequestId: $id) {
      _id
    }
  }
`;

// to accept the organization request

export const ACCEPT_ORGANIZATION_REQUEST_MUTATION = gql`
  mutation AcceptMembershipRequest($id: ID!) {
    acceptMembershipRequest(membershipRequestId: $id) {
      _id
    }
  }
`;

// to update the organization details

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

// to update the details of the user

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

// to sign up in the talawa admin

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

// to login in the talawa admin

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

// to create the organization

export const CREATE_ORGANIZATION_MUTATION = gql`
  mutation CreateOrganization(
    $description: String!
    $location: String!
    $name: String!
    $visibleInSearch: Boolean!
    $isPublic: Boolean!
  ) {
    createOrganization(
      data: {
        description: $description
        location: $location
        name: $name
        visibleInSearch: $visibleInSearch
        isPublic: $isPublic
      }
    ) {
      _id
    }
  }
`;

// to delete the organization

export const DELETE_ORGANIZATION_MUTATION = gql`
  mutation RemoveOrganization($id: ID!) {
    removeOrganization(id: $id) {
      _id
    }
  }
`;

// to create the event by any organization

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
        startTime: "00:00"
        endTime: "01:10"
        location: "India"
      }
    ) {
      _id
    }
  }
`;

// to delete any event by any organization

export const DELETE_EVENT_MUTATION = gql`
  mutation RemoveEvent($id: ID!) {
    removeEvent(id: $id) {
      _id
    }
  }
`;

// to remove an admin from an organization

export const REMOVE_ADMIN_MUTATION = gql`
  mutation RemoveAdmin($orgid: ID!, $userid: ID!) {
    removeAdmin(data: { organizationId: $orgid, userId: $userid }) {
      _id
    }
  }
`;

// to Remove member from an organization

export const REMOVE_MEMBER_MUTATION = gql`
  mutation RemoveAdmin($orgid: ID!, $userid: ID!) {
    removeAdmin(data: { organizationId: $orgid, userId: $userid }) {
      _id
    }
  }
`;

// to add the admin

export const ADD_ADMIN_MUTATION = gql`
  mutation CreateAdmin($orgid: ID!, $userid: ID!) {
    createAdmin(data: { organizationId: $orgid, userId: $userid }) {
      _id
    }
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost(
    $text: String!
    $title: String!
    $imageUrl: String
    $videoUrl: String
    $organizationId: ID!
  ) {
    createPost(
      data: {
        text: $text
        title: $title
        imageUrl: $imageUrl
        videoUrl: $videoUrl
        organizationId: $organizationId
      }
    ) {
      _id
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation RemovePost($id: ID!) {
    removePost(id: $id) {
      _id
    }
  }
`;
