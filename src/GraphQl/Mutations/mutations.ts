import gql from 'graphql-tag';

<<<<<<< HEAD
=======
// List of the mutations used in the code

// to unblock the user

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
    $address: AddressInput
    $userRegistrationRequired: Boolean
=======
    $location: String
    $isPublic: Boolean
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    $visibleInSearch: Boolean
    $file: String
  ) {
    updateOrganization(
      id: $id
      data: {
        name: $name
        description: $description
<<<<<<< HEAD
        userRegistrationRequired: $userRegistrationRequired
        visibleInSearch: $visibleInSearch
        address: $address
=======
        isPublic: $isPublic
        visibleInSearch: $visibleInSearch
        location: $location
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      }
      file: $file
    ) {
      _id
    }
  }
`;

<<<<<<< HEAD
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

=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
// to update the details of the user

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUserProfile(
    $firstName: String
    $lastName: String
<<<<<<< HEAD
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
      }
      file: $image
=======
    $email: EmailAddress
    $file: String
  ) {
    updateUserProfile(
      data: { firstName: $firstName, lastName: $lastName, email: $email }
      file: $file
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      user {
        _id
      }
=======
      _id
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======
        userType
        adminApproved
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
    $address: AddressInput!
    $name: String!
    $visibleInSearch: Boolean!
    $userRegistrationRequired: Boolean!
=======
    $location: String!
    $name: String!
    $visibleInSearch: Boolean!
    $isPublic: Boolean!
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    $image: String
  ) {
    createOrganization(
      data: {
        description: $description
<<<<<<< HEAD
        address: $address
        name: $name
        visibleInSearch: $visibleInSearch
        userRegistrationRequired: $userRegistrationRequired
=======
        location: $location
        name: $name
        visibleInSearch: $visibleInSearch
        isPublic: $isPublic
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      user {
        _id
      }
=======
      _id
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
    $frequency: Frequency
    $weekDays: [WeekDays]
    $count: PositiveInt
    $interval: PositiveInt
    $weekDayOccurenceInMonth: Int
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
      recurrenceRuleData: {
        frequency: $frequency
        weekDays: $weekDays
        interval: $interval
        count: $count
        weekDayOccurenceInMonth: $weekDayOccurenceInMonth
      }
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    ) {
      _id
    }
  }
`;

// to delete any event by any organization

export const DELETE_EVENT_MUTATION = gql`
<<<<<<< HEAD
  mutation RemoveEvent(
    $id: ID!
    $recurringEventDeleteType: RecurringEventMutationType
  ) {
    removeEvent(id: $id, recurringEventDeleteType: $recurringEventDeleteType) {
      _id
    }
  }
`;

export const CREATE_VENUE_MUTATION = gql`
  mutation createVenue(
    $capacity: Int!
    $description: String
    $file: String
    $name: String!
    $organizationId: ID!
  ) {
    createVenue(
      data: {
        capacity: $capacity
        description: $description
        file: $file
        name: $name
        organizationId: $organizationId
      }
    ) {
      _id
    }
  }
`;

export const UPDATE_VENUE_MUTATION = gql`
  mutation editVenue(
    $capacity: Int
    $description: String
    $file: String
    $id: ID!
    $name: String
  ) {
    editVenue(
      data: {
        capacity: $capacity
        description: $description
        file: $file
        id: $id
        name: $name
      }
    ) {
=======
  mutation RemoveEvent($id: ID!) {
    removeEvent(id: $id) {
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      _id
    }
  }
`;

// to remove an admin from an organization
<<<<<<< HEAD
=======

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
export const REMOVE_ADMIN_MUTATION = gql`
  mutation RemoveAdmin($orgid: ID!, $userid: ID!) {
    removeAdmin(data: { organizationId: $orgid, userId: $userid }) {
      _id
    }
  }
`;

// to Remove member from an organization
<<<<<<< HEAD
=======

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
export const REMOVE_MEMBER_MUTATION = gql`
  mutation RemoveMember($orgid: ID!, $userid: ID!) {
    removeMember(data: { organizationId: $orgid, userId: $userid }) {
      _id
    }
  }
`;

// to add the admin
<<<<<<< HEAD
=======

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
export const ADD_ADMIN_MUTATION = gql`
  mutation CreateAdmin($orgid: ID!, $userid: ID!) {
    createAdmin(data: { organizationId: $orgid, userId: $userid }) {
      _id
    }
  }
`;

<<<<<<< HEAD
export const ADD_MEMBER_MUTATION = gql`
  mutation CreateMember($orgid: ID!, $userid: ID!) {
    createMember(input: { organizationId: $orgid, userId: $userid }) {
      _id
    }
  }
`;

=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
export const CREATE_POST_MUTATION = gql`
  mutation CreatePost(
    $text: String!
    $title: String!
    $imageUrl: URL
    $videoUrl: URL
    $organizationId: ID!
    $file: String
<<<<<<< HEAD
    $pinned: Boolean
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  ) {
    createPost(
      data: {
        text: $text
        title: $title
        imageUrl: $imageUrl
        videoUrl: $videoUrl
        organizationId: $organizationId
<<<<<<< HEAD
        pinned: $pinned
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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

<<<<<<< HEAD
/**
 * {@label UPDATE_INSTALL_STATUS_PLUGIN_MUTATION}
 * @remarks
 * used to toggle `installStatus` (boolean value) of a Plugin
=======
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
 * @name UPDATE_INSTALL_STATUS_PLUGIN_MUTATION
 * @description used to toggle `installStatus` (boolean value) of a Plugin
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
 * {@label UPDATE_ORG_STATUS_PLUGIN_MUTATION}
 * @remarks
 * used  `updatePluginStatus`to add or remove the current Organization the in the plugin list `uninstalledOrgs`
=======
 * @name UPDATE_ORG_STATUS_PLUGIN_MUTATION
 * @description used  `updatePluginStatus`to add or remove the current Organization the in the plugin list `uninstalledOrgs`
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
 * {@label ADD_PLUGIN_MUTATION}
 * @remarks
 * used  `createPlugin` to add new Plugin in database
=======
 * @name ADD_PLUGIN_MUTATION
 * @description used  `createPlugin` to add new Plugin in database
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    }
  }
`;
export const DELETE_ADVERTISEMENT_BY_ID = gql`
  mutation ($id: ID!) {
<<<<<<< HEAD
    deleteAdvertisement(id: $id) {
      advertisement {
        _id
      }
=======
    deleteAdvertisementById(id: $id) {
      success
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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

<<<<<<< HEAD
export const UPDATE_COMMUNITY = gql`
  mutation updateCommunity($data: UpdateCommunityInput!) {
    updateCommunity(data: $data)
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
=======
export const ADD_EVENT_PROJECT_MUTATION = gql`
  mutation AddEventProject(
    $title: String!
    $description: String!
    $eventId: ID!
  ) {
    createEventProject(
      data: { title: $title, description: $description, eventId: $eventId }
    ) {
      _id
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    }
  }
`;

<<<<<<< HEAD
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
  CREATE_DIRECT_CHAT,
  CREATE_SAMPLE_ORGANIZATION_MUTATION,
  JOIN_PUBLIC_ORGANIZATION,
  PLUGIN_SUBSCRIPTION,
  REMOVE_CUSTOM_FIELD,
  REMOVE_SAMPLE_ORGANIZATION_MUTATION,
  SEND_MEMBERSHIP_REQUEST,
  TOGGLE_PINNED_POST,
  UPDATE_USER_ROLE_IN_ORG_MUTATION,
} from './OrganizationMutations';
=======
export const UPDATE_EVENT_PROJECT_MUTATION = gql`
  mutation UpdateEventProject($title: String, $description: String, $id: ID!) {
    updateEventProject(
      id: $id
      data: { title: $title, description: $description }
    ) {
      _id
    }
  }
`;

export const DELETE_EVENT_PROJECT_MUTATION = gql`
  mutation DeleteEventProject($id: ID!) {
    removeEventProject(id: $id) {
      _id
    }
  }
`;

export const ADD_EVENT_PROJECT_TASK_MUTATION = gql`
  mutation AddEventTask(
    $title: String!
    $description: String!
    $projectId: ID!
    $deadline: DateTime!
  ) {
    createTask(
      eventProjectId: $projectId
      data: { title: $title, description: $description, deadline: $deadline }
    ) {
      _id
    }
  }
`;

export const UPDATE_EVENT_PROJECT_TASK_MUTATION = gql`
  mutation UpdateEventTask(
    $title: String!
    $description: String!
    $taskId: ID!
    $deadline: DateTime!
    $completed: Boolean!
  ) {
    updateTask(
      id: $taskId
      data: {
        title: $title
        description: $description
        deadline: $deadline
        completed: $completed
      }
    ) {
      _id
    }
  }
`;

export const DELETE_EVENT_TASK_MUTATION = gql`
  mutation DeleteTask($id: ID!) {
    removeTask(id: $id) {
      _id
    }
  }
`;

export const SET_TASK_VOLUNTEERS_MUTATION = gql`
  mutation SetTaskVolunteers($id: ID!, $volunteers: [ID]!) {
    setTaskVolunteers(id: $id, volunteers: $volunteers) {
      _id
    }
  }
`;

export const ADD_EVENT_ATTENDEE = gql`
  mutation addEventAttendee($userId: ID!, $eventId: ID!) {
    addEventAttendee(data: { userId: $userId, eventId: $eventId }) {
      _id
    }
  }
`;

export const REMOVE_EVENT_ATTENDEE = gql`
  mutation removeEventAttendee($userId: ID!, $eventId: ID!) {
    removeEventAttendee(data: { userId: $userId, eventId: $eventId }) {
      _id
    }
  }
`;

export const MARK_CHECKIN = gql`
  mutation checkIn(
    $userId: ID!
    $eventId: ID!
    $allotedRoom: String
    $allotedSeat: String
  ) {
    checkIn(
      data: {
        userId: $userId
        eventId: $eventId
        allotedRoom: $allotedRoom
        allotedSeat: $allotedSeat
      }
    ) {
      _id
    }
  }
`;

export const CREATE_COMMENT_POST = gql`
  mutation createComment($comment: String!, $postId: ID!) {
    createComment(data: { text: $comment }, postId: $postId) {
      _id
      creator {
        _id
        firstName
        lastName
        email
      }
      likeCount
      likedBy {
        _id
      }
      text
    }
  }
`;

export const LIKE_COMMENT = gql`
  mutation likeComment($commentId: ID!) {
    likeComment(id: $commentId) {
      _id
    }
  }
`;

export const UNLIKE_COMMENT = gql`
  mutation unlikeComment($commentId: ID!) {
    unlikeComment(id: $commentId) {
      _id
    }
  }
`;

// Changes the role of a user in an organization
export const UPDATE_USER_ROLE_IN_ORG_MUTATION = gql`
  mutation updateUserRoleInOrganization(
    $organizationId: ID!
    $userId: ID!
    $role: String!
  ) {
    updateUserRoleInOrganization(
      organizationId: $organizationId
      userId: $userId
      role: $role
    ) {
      _id
    }
  }
`;

export const CREATE_SAMPLE_ORGANIZATION_MUTATION = gql`
  mutation {
    createSampleOrganization
  }
`;

export const REMOVE_SAMPLE_ORGANIZATION_MUTATION = gql`
  mutation {
    removeSampleOrganization
  }
`;

export const CREATE_DIRECT_CHAT = gql`
  mutation createDirectChat($userIds: [ID!]!, $organizationId: ID!) {
    createDirectChat(
      data: { userIds: $userIds, organizationId: $organizationId }
    ) {
      _id
    }
  }
`;

//Plugin WebSocket listner
export const PLUGIN_SUBSCRIPTION = gql`
  subscription onPluginUpdate {
    onPluginUpdate {
      pluginName
      _id
      pluginDesc
      uninstalledOrgs
    }
  }
`;
export const TOGGLE_PINNED_POST = gql`
  mutation TogglePostPin($id: ID!) {
    togglePostPin(id: $id) {
      _id
    }
  }
`;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
