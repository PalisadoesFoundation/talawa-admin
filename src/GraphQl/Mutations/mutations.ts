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
    $gender: Gender
    $email: EmailAddress
    $phoneNumber: PhoneNumber
    $birthDate: Date
    $grade: EducationGrade
    $empStatus: EmploymentStatus
    $maritalStatus: MaritalStatus
    $address: String
    $state: String
    $country: String
    $image: String
    $appLanguageCode: String
  ) {
    updateUserProfile(
      data: {
        firstName: $firstName
        lastName: $lastName
        gender: $gender
        email: $email
        phone: { mobile: $phoneNumber }
        birthDate: $birthDate
        educationGrade: $grade
        employmentStatus: $empStatus
        maritalStatus: $maritalStatus
        address: { line1: $address, state: $state, countryCode: $country }
        appLanguageCode: $appLanguageCode
      }
      file: $image
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
      user {
        _id
      }
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
    $orgId: ID!
  ) {
    signUp(
      data: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
        selectedOrganization: $orgId
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
        firstName
        lastName
        image
        email
      }
      appUserProfile {
        adminFor {
          _id
        }
        isSuperAdmin
        appLanguageCode
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
      user {
        _id
      }
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
    $endDate: Date!
    $allDay: Boolean!
    $startTime: Time
    $endTime: Time
    $location: String
    $recurrenceStartDate: Date
    $recurrenceEndDate: Date
    $frequency: Frequency
    $weekDays: [WeekDays]
    $count: PositiveInt
    $interval: PositiveInt
    $weekDayOccurenceInMonth: Int
    $createChat: Boolean!
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
        createChat: $createChat
      }
      recurrenceRuleData: {
        recurrenceStartDate: $recurrenceStartDate
        recurrenceEndDate: $recurrenceEndDate
        frequency: $frequency
        weekDays: $weekDays
        interval: $interval
        count: $count
        weekDayOccurenceInMonth: $weekDayOccurenceInMonth
      }
    ) {
      _id
    }
  }
`;

// to delete any event by any organization

export const DELETE_EVENT_MUTATION = gql`
  mutation RemoveEvent(
    $id: ID!
    $recurringEventDeleteType: RecurringEventMutationType
  ) {
    removeEvent(id: $id, recurringEventDeleteType: $recurringEventDeleteType) {
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
      user {
        _id
      }
    }
  }
`;

export const ADD_MEMBER_MUTATION = gql`
  mutation CreateMember($orgid: ID!, $userid: ID!) {
    createMember(input: { organizationId: $orgid, userId: $userid }) {
      organization {
        _id
      }
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
    $organizationId: ID!
    $name: String!
    $type: AdvertisementType!
    $startDate: Date!
    $endDate: Date!
    $file: String!
  ) {
    createAdvertisement(
      input: {
        organizationId: $organizationId
        name: $name
        type: $type
        startDate: $startDate
        endDate: $endDate
        mediaFile: $file
      }
    ) {
      advertisement {
        _id
      }
    }
  }
`;
export const UPDATE_ADVERTISEMENT_MUTATION = gql`
  mutation UpdateAdvertisement(
    $id: ID!
    $name: String
    $file: String
    $type: AdvertisementType
    $startDate: Date
    $endDate: Date
  ) {
    updateAdvertisement(
      input: {
        _id: $id
        name: $name
        mediaFile: $file
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
    deleteAdvertisement(id: $id) {
      advertisement {
        _id
      }
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
    $title: String
    $description: String
    $recurring: Boolean
    $recurringEventUpdateType: RecurringEventMutationType
    $isPublic: Boolean
    $isRegisterable: Boolean
    $allDay: Boolean
    $startDate: Date
    $endDate: Date
    $startTime: Time
    $endTime: Time
    $location: String
    $recurrenceStartDate: Date
    $recurrenceEndDate: Date
    $frequency: Frequency
    $weekDays: [WeekDays]
    $count: PositiveInt
    $interval: PositiveInt
    $weekDayOccurenceInMonth: Int
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
        startDate: $startDate
        endDate: $endDate
        startTime: $startTime
        endTime: $endTime
        location: $location
      }
      recurrenceRuleData: {
        recurrenceStartDate: $recurrenceStartDate
        recurrenceEndDate: $recurrenceEndDate
        frequency: $frequency
        weekDays: $weekDays
        interval: $interval
        count: $count
        weekDayOccurenceInMonth: $weekDayOccurenceInMonth
      }
      recurringEventUpdateType: $recurringEventUpdateType
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

export const UPDATE_COMMUNITY = gql`
  mutation updateCommunity($data: UpdateCommunityInput!) {
    updateCommunity(data: $data)
  }
`;

export const UPDATE_SESSION_TIMEOUT = gql`
  mutation updateSessionTimeout($timeout: Int!) {
    updateSessionTimeout(timeout: $timeout)
  }
`;

export const RESET_COMMUNITY = gql`
  mutation resetCommunity {
    resetCommunity
  }
`;

export const DONATE_TO_ORGANIZATION = gql`
  mutation donate(
    $userId: ID!
    $createDonationOrgId2: ID!
    $payPalId: ID!
    $nameOfUser: String!
    $amount: Float!
    $nameOfOrg: String!
  ) {
    createDonation(
      userId: $userId
      orgId: $createDonationOrgId2
      payPalId: $payPalId
      nameOfUser: $nameOfUser
      amount: $amount
      nameOfOrg: $nameOfOrg
    ) {
      _id
      amount
      nameOfUser
      nameOfOrg
    }
  }
`;

// Create and Update Action Item Categories
export {
  CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
} from './ActionItemCategoryMutations';

// Create, Update and Delete Action Items
export {
  CREATE_ACTION_ITEM_MUTATION,
  DELETE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
} from './ActionItemMutations';

export {
  CREATE_AGENDA_ITEM_CATEGORY_MUTATION,
  DELETE_AGENDA_ITEM_CATEGORY_MUTATION,
  UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
} from './AgendaCategoryMutations';

export {
  CREATE_AGENDA_ITEM_MUTATION,
  DELETE_AGENDA_ITEM_MUTATION,
  UPDATE_AGENDA_ITEM_MUTATION,
} from './AgendaItemMutations';

// Changes the role of a event in an organization and add and remove the event from the organization
export {
  ADD_EVENT_ATTENDEE,
  MARK_CHECKIN,
  REMOVE_EVENT_ATTENDEE,
} from './EventAttendeeMutations';

// Create the new comment on a post and Like and Unlike the comment
export {
  CREATE_COMMENT_POST,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
} from './CommentMutations';

// Changes the role of a user in an organization
export {
  ADD_CUSTOM_FIELD,
  CREATE_SAMPLE_ORGANIZATION_MUTATION,
  JOIN_PUBLIC_ORGANIZATION,
  PLUGIN_SUBSCRIPTION,
  REMOVE_CUSTOM_FIELD,
  REMOVE_SAMPLE_ORGANIZATION_MUTATION,
  SEND_MEMBERSHIP_REQUEST,
  TOGGLE_PINNED_POST,
  UPDATE_USER_ROLE_IN_ORG_MUTATION,
} from './OrganizationMutations';

export {
  CREATE_VENUE_MUTATION,
  DELETE_VENUE_MUTATION,
  UPDATE_VENUE_MUTATION,
} from './VenueMutations';
