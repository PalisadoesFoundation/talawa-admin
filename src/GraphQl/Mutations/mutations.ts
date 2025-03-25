import gql from 'graphql-tag';
import '../../style/app.module.css';

// to block the user

export const BLOCK_USER_MUTATION_PG = gql`
  mutation BlockUser($organizationId: String!, $userId: String!) {
    blockUser(organizationId: $organizationId, userId: $userId)
  }
`;

export const UNBLOCK_USER_MUTATION_PG = gql`
  mutation UnblockUser($organizationId: String!, $userId: String!) {
    unblockUser(organizationId: $organizationId, userId: $userId)
  }
`;

// to reject the organization request

export const REJECT_ORGANIZATION_REQUEST_MUTATION = gql`
  mutation RejectMembershipRequest(
    $input: MutationRejectMembershipRequestInput!
  ) {
    rejectMembershipRequest(input: $input) {
      success
      message
    }
  }
`;

// to accept the organization request

export const ACCEPT_ORGANIZATION_REQUEST_MUTATION = gql`
  mutation AcceptMembershipRequest(
    $input: MutationAcceptMembershipRequestInput!
  ) {
    acceptMembershipRequest(input: $input) {
      success
      message
    }
  }
`;

// to update the organization details

export const UPDATE_ORGANIZATION_MUTATION = gql`
  mutation UpdateOrganization($input: MutationUpdateOrganizationInput!) {
    updateOrganization(input: $input) {
      id
      name
      description
      addressLine1
      addressLine2
      city
      state
      postalCode
      countryCode
      avatarMimeType
      avatarURL
      updatedAt
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

// to update the details of the current user
export const UPDATE_CURRENT_USER_MUTATION = gql`
  mutation UpdateCurrentUser($input: MutationUpdateCurrentUserInput!) {
    updateCurrentUser(input: $input) {
      addressLine1
      addressLine2
      avatarMimeType
      avatarURL
      birthDate
      city
      countryCode
      createdAt
      description
      educationGrade
      emailAddress
      employmentStatus
      homePhoneNumber
      id
      isEmailAddressVerified
      maritalStatus
      mobilePhoneNumber
      name
      natalSex
      naturalLanguageCode
      postalCode
      role
      state
      updatedAt
      workPhoneNumber
    }
  }
`;

// to update the details of the user

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateCurrentUser($input: MutationUpdateCurrentUserInput!) {
    updateCurrentUser(input: $input) {
      addressLine1
      addressLine2
      avatarMimeType
      avatarURL
      birthDate
      city
      countryCode
      createdAt
      description
      educationGrade
      emailAddress
      employmentStatus
      homePhoneNumber
      id
      isEmailAddressVerified
      maritalStatus
      mobilePhoneNumber
      name
      natalSex
      naturalLanguageCode
      postalCode
      role
      state
      updatedAt
      workPhoneNumber
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
  mutation SignUp($name: String!, $email: EmailAddress!, $password: String!) {
    signUp(input: { name: $name, emailAddress: $email, password: $password }) {
      user {
        id
      }
      authenticationToken
    }
  }
`;

//to create user by admin
export const CREATE_MEMBER_PG = gql`
  mutation CreateUser(
    $name: String!
    $email: EmailAddress!
    $password: String!
    $role: UserRole!
    $isEmailAddressVerified: Boolean!
  ) {
    createUser(
      input: {
        name: $name
        emailAddress: $email
        password: $password
        role: $role
        isEmailAddressVerified: $isEmailAddressVerified
      }
    ) {
      authenticationToken
      user {
        id
        name
      }
    }
  }
`;

// to login in the talawa admin

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

export const CREATE_ORGANIZATION_MUTATION_PG = gql`
  mutation createOrganization(
    $name: String!
    $addressLine1: String
    $addressLine2: String
    $avatar: Upload
    $city: String
    $countryCode: Iso3166Alpha2CountryCode
    $description: String
    $postalCode: String
    $state: String
  ) {
    createOrganization(
      input: {
        addressLine1: $addressLine1
        addressLine2: $addressLine2
        avatar: $avatar
        city: $city
        countryCode: $countryCode
        description: $description
        name: $name
        postalCode: $postalCode
        state: $state
      }
    ) {
      id
    }
  }
`;

// to create organization membership

export const CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG = gql`
  mutation CreateOrganizationMembership(
    $memberId: ID!
    $organizationId: ID!
    $role: OrganizationMembershipRole
  ) {
    createOrganizationMembership(
      input: {
        memberId: $memberId
        organizationId: $organizationId
        role: $role
      }
    ) {
      id
    }
  }
`;

// to delete the organization

export const DELETE_ORGANIZATION_MUTATION = gql`
  mutation DeleteOrganization($input: MutationDeleteOrganizationInput!) {
    deleteOrganization(input: $input) {
      id
      name
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

// to Remove member from an organization postgres
export const REMOVE_MEMBER_MUTATION_PG = gql`
  mutation RemoveMember($organizationId: ID!, $memberId: ID!) {
    deleteOrganizationMembership(
      input: { organizationId: $organizationId, memberId: $memberId }
    ) {
      id
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
  mutation CreatePost($input: MutationCreatePostInput!) {
    createPost(input: $input) {
      id
      caption
      pinnedAt
      attachments {
        url
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation RemovePost($input: MutationDeletePostInput!) {
    deletePost(input: $input) {
      id
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
  mutation UpdatePost($input: MutationUpdatePostInput!) {
    updatePost(input: $input) {
      id
      caption
      pinnedAt
      attachments {
        url
      }
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

export const UPDATE_COMMUNITY_PG = gql`
  mutation updateCommunity(
    $facebookURL: String
    $githubURL: String
    $instagramURL: String
    $inactivityTimeoutDuration: Int
    $linkedinURL: String
    $name: String
    $redditURL: String
    $slackURL: String
    $websiteURL: String
    $xURL: String
    $youtubeURL: String
  ) {
    updateCommunity(
      input: {
        facebookURL: $facebookURL
        githubURL: $githubURL
        inactivityTimeoutDuration: $inactivityTimeoutDuration
        instagramURL: $instagramURL
        linkedinURL: $linkedinURL
        name: $name
        redditURL: $redditURL
        slackURL: $slackURL
        websiteURL: $websiteURL
        xURL: $xURL
        youtubeURL: $youtubeURL
      }
    ) {
      id
    }
  }
`;

export const UPDATE_SESSION_TIMEOUT_PG = gql`
  mutation updateCommunity($inactivityTimeoutDuration: Int!) {
    updateCommunity(
      input: { inactivityTimeoutDuration: $inactivityTimeoutDuration }
    ) {
      inactivityTimeoutDuration
    }
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
  CREATE_SAMPLE_ORGANIZATION_MUTATION,
  JOIN_PUBLIC_ORGANIZATION,
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

export const PRESIGNED_URL = gql`
  mutation createPresignedUrl($input: MutationCreatePresignedUrlInput!) {
    createPresignedUrl(input: $input) {
      fileUrl
      presignedUrl
      objectName
      requiresUpload
    }
  }
`;

export const GET_FILE_PRESIGNEDURL = gql`
  mutation CreateGetfileUrl($input: CreateGetfileUrlInput!) {
    createGetfileUrl(input: $input) {
      presignedUrl
    }
  }
`;
