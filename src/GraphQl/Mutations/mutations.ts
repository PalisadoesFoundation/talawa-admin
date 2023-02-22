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
  mutation Login($email: String!, $password: String!) {
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
    $location: String!
    $name: String!
    $visibleInSearch: Boolean!
    $isPublic: Boolean!
    $tags: [String!]!
  ) {
    createOrganization(
      data: {
        description: $description
        location: $location
        name: $name
        visibleInSearch: $visibleInSearch
        isPublic: $isPublic
        tags: $tags
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
    $startTime: String
    $endTime: String
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

export const GENERATE_OTP_MUTATION = gql`
  mutation Otp($email: String!) {
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

export const ACCPET_ADMIN_MUTATION = gql`
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
 * @name UPDATE_INSTALL_STATUS_PLUGIN_MUTATION
 * @description used to toggle `installStatus` (boolean value) of a Plugin
 */
export const UPDATE_INSTALL_STATUS_PLUGIN_MUTATION = gql`
  mutation update_install_status_plugin_mutation($id: ID!, $status: Boolean!) {
    updateTempPluginStatus(id: $id, status: $status) {
      _id
      pluginName
      pluginCreatedBy
      pluginDesc
      pluginInstallStatus
    }
  }
`;
/**
 * @name UPDATE_ORG_STATUS_PLUGIN_MUTATION
 * @description used  `updateTempPluginInstalledOrgs`to add or remove the current Organization the in the plugin list `installedOrgs`
 */
export const UPDATE_ORG_STATUS_PLUGIN_MUTATION = gql`
  mutation update_install_status_plugin_mutation($id: ID!, $orgId: ID!) {
    updateTempPluginInstalledOrgs(id: $id, orgId: $orgId) {
      _id
      pluginName
      pluginCreatedBy
      pluginDesc
      pluginInstallStatus
      installedOrgs
    }
  }
`;
/**
 * @name ADD_PLUGIN_MUTATION
 * @description used  `createPlugin` to add new Plugin in database
 */
export const ADD_PLUGIN_MUTATION = gql`
  mutation add_plugin_mutation(
    $pluginName: String!
    $pluginCreatedBy: String!
    $pluginDesc: String!
    $pluginInstallStatus: Boolean!
    $installedOrgs: [ID!]
  ) {
    createPlugin(
      pluginName: $pluginName
      pluginCreatedBy: $pluginCreatedBy
      pluginDesc: $pluginDesc
      pluginInstallStatus: $pluginInstallStatus
      installedOrgs: $installedOrgs
    ) {
      _id
      pluginName
      pluginCreatedBy
      pluginDesc
      pluginInstallStatus
      installedOrgs
    }
  }
`;

export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($id: ID!, $title: String, $text: String) {
    updatePost(id: $id, data: { title: $title, text: $text }) {
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
    $startTime: String
    $endTime: String
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

export const UPDATE_SPAM_NOTIFICATION_MUTATION = gql`
  mutation UpdateSpamNotification(
    $orgId: ID!
    $spamId: ID!
    $isReaded: Boolean
  ) {
    updateSpamNotification(
      data: { orgId: $orgId, spamId: $spamId, isReaded: $isReaded }
    ) {
      _id
    }
  }
`;
