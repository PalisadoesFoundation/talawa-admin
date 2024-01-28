import gql from 'graphql-tag';

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
    $address: AddressInput
    $userRegistrationRequired: Boolean
    $visibleInSearch: Boolean
    $file: String
  ) {
    updateOrganization(
      id: $id
      data: {
        name: $name
        description: $description
        userRegistrationRequired: $userRegistrationRequired
        visibleInSearch: $visibleInSearch
        address: $address
      }
      file: $file
    ) {
      _id
    }
  }
`;

// fragment for defining the Address input type.
export const ADDRESS_DETAILS_FRAGMENT = gql`
  fragment AddressDetails on AddressInput {
    city: String
    countryCode: String
    dependentLocality: String
    line1: String
    line2: String
    postalCode: String
    sortingCode: String
    state: String
  }
`;

// to update the details of the user

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUserProfile(
    $firstName: String
    $lastName: String
    $email: EmailAddress
    $file: String
  ) {
    updateUserProfile(
      data: { firstName: $firstName, lastName: $lastName, email: $email }
      file: $file
    ) {
      _id
    }
  }
`;

// to update the password of user

export const UPDATE_USER_PASSWORD_MUTATION = gql`
  mutation UpdateUserPassword(
    $previousPassword: String!
    $newPassword: String!
    $confirmNewPassword: String!
  ) {
    updateUserPassword(
      data: {
        previousPassword: $previousPassword
        newPassword: $newPassword
        confirmNewPassword: $confirmNewPassword
      }
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
    $email: EmailAddress!
    $password: String!
  ) {
    signUp(
      data: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
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
  mutation Login($email: EmailAddress!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      user {
        _id
        userType
        adminApproved
      }
      accessToken
      refreshToken
    }
  }
`;

// to get the refresh token

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      refreshToken
      accessToken
    }
  }
`;

// to revoke a refresh token

export const REVOKE_REFRESH_TOKEN = gql`
  mutation RevokeRefreshTokenForUser {
    revokeRefreshTokenForUser
  }
`;

// To verify the google recaptcha

export const RECAPTCHA_MUTATION = gql`
  mutation Recaptcha($recaptchaToken: String!) {
    recaptcha(data: { recaptchaToken: $recaptchaToken })
  }
`;

// to create the organization

export const CREATE_ORGANIZATION_MUTATION = gql`
  mutation CreateOrganization(
    $description: String!
    $address: AddressInput!
    $name: String!
    $visibleInSearch: Boolean!
    $userRegistrationRequired: Boolean!
    $image: String
  ) {
    createOrganization(
      data: {
        description: $description
        address: $address
        name: $name
        visibleInSearch: $visibleInSearch
        userRegistrationRequired: $userRegistrationRequired
      }
      file: $image
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
    $startDate: Date!
    $endDate: Date
    $allDay: Boolean!
    $startTime: Time
    $endTime: Time
    $location: String
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
        startTime: $startTime
        endTime: $endTime
        location: $location
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
  mutation RemoveMember($orgid: ID!, $userid: ID!) {
    removeMember(data: { organizationId: $orgid, userId: $userid }) {
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
    $imageUrl: URL
    $videoUrl: URL
    $organizationId: ID!
    $file: String
    $pinned: Boolean
  ) {
    createPost(
      data: {
        text: $text
        title: $title
        imageUrl: $imageUrl
        videoUrl: $videoUrl
        organizationId: $organizationId
        pinned: $pinned
      }
      file: $file
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

export const GENERATE_OTP_MUTATION = gql`
  mutation Otp($email: EmailAddress!) {
    otp(data: { email: $email }) {
      otpToken
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword(
    $userOtp: String!
    $newPassword: String!
    $otpToken: String!
  ) {
    forgotPassword(
      data: {
        userOtp: $userOtp
        newPassword: $newPassword
        otpToken: $otpToken
      }
    )
  }
`;

export const UPDATE_USERTYPE_MUTATION = gql`
  mutation UpdateUserType($id: ID!, $userType: String!) {
    updateUserType(data: { id: $id, userType: $userType })
  }
`;

export const ACCEPT_ADMIN_MUTATION = gql`
  mutation AcceptAdmin($id: ID!) {
    acceptAdmin(id: $id)
  }
`;

export const REJECT_ADMIN_MUTATION = gql`
  mutation RejectAdmin($id: ID!) {
    rejectAdmin(id: $id)
  }
`;

/**
 * {@label UPDATE_INSTALL_STATUS_PLUGIN_MUTATION}
 * @remarks
 * used to toggle `installStatus` (boolean value) of a Plugin
 */
export const UPDATE_INSTALL_STATUS_PLUGIN_MUTATION = gql`
  mutation ($id: ID!, $orgId: ID!) {
    updatePluginStatus(id: $id, orgId: $orgId) {
      _id
      pluginName
      pluginCreatedBy
      pluginDesc
      uninstalledOrgs
    }
  }
`;

/**
 * {@label UPDATE_ORG_STATUS_PLUGIN_MUTATION}
 * @remarks
 * used  `updatePluginStatus`to add or remove the current Organization the in the plugin list `uninstalledOrgs`
 */
export const UPDATE_ORG_STATUS_PLUGIN_MUTATION = gql`
  mutation update_install_status_plugin_mutation($id: ID!, $orgId: ID!) {
    updatePluginStatus(id: $id, orgId: $orgId) {
      _id
      pluginName
      pluginCreatedBy
      pluginDesc
      uninstalledOrgs
    }
  }
`;

/**
 * {@label ADD_PLUGIN_MUTATION}
 * @remarks
 * used  `createPlugin` to add new Plugin in database
 */
export const ADD_PLUGIN_MUTATION = gql`
  mutation add_plugin_mutation(
    $pluginName: String!
    $pluginCreatedBy: String!
    $pluginDesc: String!
  ) {
    createPlugin(
      pluginName: $pluginName
      pluginCreatedBy: $pluginCreatedBy
      pluginDesc: $pluginDesc
    ) {
      _id
      pluginName
      pluginCreatedBy
      pluginDesc
    }
  }
`;
export const ADD_ADVERTISEMENT_MUTATION = gql`
  mutation (
    $orgId: ID!
    $name: String!
    $link: String!
    $type: String!
    $startDate: Date!
    $endDate: Date!
  ) {
    createAdvertisement(
      orgId: $orgId
      name: $name
      link: $link
      type: $type
      startDate: $startDate
      endDate: $endDate
    ) {
      _id
    }
  }
`;
export const UPDATE_ADVERTISEMENT_MUTATION = gql`
  mutation UpdateAdvertisement(
    $id: ID!
    $name: String
    $link: String
    $type: AdvertisementType
    $startDate: Date
    $endDate: Date
  ) {
    updateAdvertisement(
      input: {
        _id: $id
        name: $name
        link: $link
        type: $type
        startDate: $startDate
        endDate: $endDate
      }
    ) {
      advertisement {
        _id
      }
    }
  }
`;
export const DELETE_ADVERTISEMENT_BY_ID = gql`
  mutation ($id: ID!) {
    deleteAdvertisementById(id: $id) {
      success
    }
  }
`;
export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost(
    $id: ID!
    $title: String
    $text: String
    $imageUrl: String
    $videoUrl: String
  ) {
    updatePost(
      id: $id
      data: {
        title: $title
        text: $text
        imageUrl: $imageUrl
        videoUrl: $videoUrl
      }
    ) {
      _id
    }
  }
`;

export const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateEvent(
    $id: ID!
    $title: String!
    $description: String!
    $recurring: Boolean!
    $isPublic: Boolean!
    $isRegisterable: Boolean!
    $allDay: Boolean!
    $startTime: Time
    $endTime: Time
    $location: String
  ) {
    updateEvent(
      id: $id
      data: {
        title: $title
        description: $description
        recurring: $recurring
        isPublic: $isPublic
        isRegisterable: $isRegisterable
        allDay: $allDay
        startTime: $startTime
        endTime: $endTime
        location: $location
      }
    ) {
      _id
    }
  }
`;

export const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(id: $postId) {
      _id
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation unlikePost($postId: ID!) {
    unlikePost(id: $postId) {
      _id
    }
  }
`;

export const REGISTER_EVENT = gql`
  mutation registerForEvent($eventId: ID!) {
    registerForEvent(id: $eventId) {
      _id
    }
  }
`;

// Changes the role of a event in an organization and add and remove the event from the organization
export { ADD_EVENT_ATTENDEE } from './EventAttendeeMutations';
export { REMOVE_EVENT_ATTENDEE } from './EventAttendeeMutations';
export { MARK_CHECKIN } from './EventAttendeeMutations';

// Create the new comment on a post and Like and Unlike the comment
export { CREATE_COMMENT_POST } from './CommentMutations';
export { LIKE_COMMENT } from './CommentMutations';
export { UNLIKE_COMMENT } from './CommentMutations';

// Changes the role of a user in an organization
export { UPDATE_USER_ROLE_IN_ORG_MUTATION } from './OrganizationMutations';
export { CREATE_SAMPLE_ORGANIZATION_MUTATION } from './OrganizationMutations';
export { REMOVE_SAMPLE_ORGANIZATION_MUTATION } from './OrganizationMutations';
export { CREATE_DIRECT_CHAT } from './OrganizationMutations';
export { PLUGIN_SUBSCRIPTION } from './OrganizationMutations';
export { TOGGLE_PINNED_POST } from './OrganizationMutations';
export { ADD_CUSTOM_FIELD } from './OrganizationMutations';
export { REMOVE_CUSTOM_FIELD } from './OrganizationMutations';
