import gql from 'graphql-tag';

// to block the user

export const BLOCK_USER_MUTATION_PG = gql`
  mutation BlockUser($organizationId: ID!, $userId: ID!) {
    blockUser(organizationId: $organizationId, userId: $userId)
  }
`;

export const UNBLOCK_USER_MUTATION_PG = gql`
  mutation UnblockUser($organizationId: ID!, $userId: ID!) {
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

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($input: MutationUpdateUserInput!) {
    updateUser(input: $input) {
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
  mutation SignUp(
    $ID: ID!
    $name: String!
    $email: EmailAddress!
    $password: String!
    $recaptchaToken: String
  ) {
    signUp(
      input: {
        selectedOrganization: $ID
        name: $name
        emailAddress: $email
        password: $password
        recaptchaToken: $recaptchaToken
      }
    ) {
      user {
        id
      }
      authenticationToken
      refreshToken
    }
  }
`;

// to send event invitations via email to external users
export const SEND_EVENT_INVITATIONS = gql`
  mutation SendEventInvitations($input: SendEventInvitationsInput!) {
    sendEventInvitations(input: $input) {
      id
      eventId
      recurringEventInstanceId
      invitedBy
      userId
      inviteeEmail
      inviteeName
      invitationToken
      status
      expiresAt
      respondedAt
      metadata
      createdAt
      updatedAt
    }
  }
`;

// preview/verify an invitation by token (returns metadata but does not accept)
export const VERIFY_EVENT_INVITATION = gql`
  mutation VerifyEventInvitation($input: VerifyEventInvitationInput!) {
    verifyEventInvitation(input: $input) {
      invitationToken
      inviteeEmailMasked
      inviteeName
      status
      expiresAt
      eventId
      recurringEventInstanceId
      organizationId
    }
  }
`;

// accept an invitation (finalize and add user as attendee/member)
export const ACCEPT_EVENT_INVITATION = gql`
  mutation AcceptEventInvitation($input: AcceptEventInvitationInput!) {
    acceptEventInvitation(input: $input) {
      id
      eventId
      recurringEventInstanceId
      invitedBy
      userId
      inviteeEmail
      inviteeName
      invitationToken
      status
      expiresAt
      respondedAt
      metadata
      createdAt
      updatedAt
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

/**
 * Verifies a user's email address using a token sent via email.
 *
 * @param token - The verification token received via email
 * @returns An object containing:
 *   - success: boolean indicating if the verification succeeded
 *   - message: A descriptive message about the result
 */
export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(input: { token: $token }) {
      success
      message
    }
  }
`;

/**
 * Resends the email verification link to the currently authenticated user.
 *
 * @remarks
 * The user must be logged in for this mutation to work.
 * No parameters are required as it uses the authenticated user's session.
 *
 * @returns An object containing:
 *   - success: boolean indicating if the email was sent successfully
 *   - message: A descriptive message about the result
 */
export const RESEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation SendVerificationEmail {
    sendVerificationEmail {
      success
      message
    }
  }
`;

// to login in the talawa admin

// to get the refresh token
// Note: refreshToken variable is optional - the API will read from HTTP-Only cookie if not provided

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String) {
    refreshToken(refreshToken: $refreshToken) {
      authenticationToken
      refreshToken
    }
  }
`;

// Logout mutation - clears HTTP-Only cookies on the server
// This is preferred over REVOKE_REFRESH_TOKEN for web clients using cookie-based auth

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

/**
 * to revoke a refresh token (legacy - use LOGOUT_MUTATION for cookie-based auth)
 * @public
 */
export const REVOKE_REFRESH_TOKEN = gql`
  mutation RevokeRefreshToken($refreshToken: String!) {
    revokeRefreshToken(refreshToken: $refreshToken)
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
    deleteOrganizationMembership(
      input: { organizationId: $orgid, memberId: $userid }
    ) {
      id
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

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: MutationCreatePostInput!) {
    createPost(input: $input) {
      id
      caption
      body
      pinnedAt
      attachmentURL
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

export const UPDATE_POST_MUTATION = gql`
  mutation updatePost($input: MutationUpdatePostInput!) {
    updatePost(input: $input) {
      id
      caption
      pinnedAt
      attachments {
        fileHash
        mimeType
        name
        objectName
      }
    }
  }
`;

export const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateEvent($input: MutationUpdateEventInput!) {
    updateEvent(input: $input) {
      id
      name
      description
      startAt
      endAt
      allDay
      location
      isPublic
      isRegisterable
      createdAt
      updatedAt
      creator {
        id
        name
      }
      updater {
        id
        name
      }
      organization {
        id
        name
      }
    }
  }
`;

export const UPDATE_POST_VOTE = gql`
  mutation updatePostVote($input: MutationUpdatePostVoteInput!) {
    updatePostVote(input: $input) {
      id
      upVoters(first: 10) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

/**
 * GraphQL mutation to update community profile settings including logo upload.
 *
 * @param logo - Optional logo file (Upload scalar) - sent as multipart request via apollo-upload-client
 * @param name - Community name
 * @param websiteURL - Community website URL
 * @param facebookURL - Facebook profile URL
 * @param instagramURL - Instagram profile URL
 * @param xURL - X (Twitter) profile URL
 * @param githubURL - GitHub organization URL
 * @param youtubeURL - YouTube channel URL
 * @param linkedinURL - LinkedIn profile URL
 * @param redditURL - Reddit community URL
 * @param slackURL - Slack workspace URL
 * @param inactivityTimeoutDuration - Session timeout in minutes
 *
 * @returns Updated community with id, logoURL (computed MinIO URL) and logoMimeType
 */
export const UPDATE_COMMUNITY_PG = gql`
  mutation updateCommunity(
    $logo: Upload
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
        logo: $logo
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
      logoMimeType
      logoURL
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
  ADD_ADVERTISEMENT_MUTATION,
  UPDATE_ADVERTISEMENT_MUTATION,
  DELETE_ADVERTISEMENT_MUTATION,
} from './AdvertisementMutations';

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

// Create, Update and Delete Events
export {
  CREATE_EVENT_MUTATION,
  DELETE_STANDALONE_EVENT_MUTATION,
  DELETE_ENTIRE_RECURRING_EVENT_SERIES_MUTATION,
  DELETE_SINGLE_EVENT_INSTANCE_MUTATION,
  DELETE_THIS_AND_FOLLOWING_EVENTS_MUTATION,
} from './EventMutations';

export const PRESIGNED_URL = gql`
  mutation createPresignedUrl($input: MutationCreatePresignedUrlInput!) {
    createPresignedUrl(input: $input) {
      presignedUrl
      objectName
      requiresUpload
    }
  }
`;

export const GET_FILE_PRESIGNEDURL = gql`
  mutation createGetfileUrl($input: MutationCreateGetfileUrlInput!) {
    createGetfileUrl(input: $input) {
      presignedUrl
    }
  }
`;
