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
    $location: String
    $isPublic: Boolean
    $visibleInSearch: Boolean
    $file: String
  ) {
    updateOrganization(
      id: $id
      data: {
        name: $name
        description: $description
        isPublic: $isPublic
        visibleInSearch: $visibleInSearch
        location: $location
      }
      file: $file
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
    $location: String!
    $name: String!
    $visibleInSearch: Boolean!
    $isPublic: Boolean!
    $image: String
  ) {
    createOrganization(
      data: {
        description: $description
        location: $location
        name: $name
        visibleInSearch: $visibleInSearch
        isPublic: $isPublic
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
  ) {
    createPost(
      data: {
        text: $text
        title: $title
        imageUrl: $imageUrl
        videoUrl: $videoUrl
        organizationId: $organizationId
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
 * @name UPDATE_INSTALL_STATUS_PLUGIN_MUTATION
 * @description used to toggle `installStatus` (boolean value) of a Plugin
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
 * @name UPDATE_ORG_STATUS_PLUGIN_MUTATION
 * @description used  `updatePluginStatus`to add or remove the current Organization the in the plugin list `uninstalledOrgs`
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
 * @name ADD_PLUGIN_MUTATION
 * @description used  `createPlugin` to add new Plugin in database
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
    }
  }
`;

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
