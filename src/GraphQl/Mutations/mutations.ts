import gql from 'graphql-tag';

/**
 * This mutation is used to unblock a user in an organization. After validating the user and organization from given respective ids, this mutation remove user from the  blockedUsers array inside the organization record and remove the organization from the organizationsBlockedBy array inside the user record.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can be find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/block_user_mutations/unblock_user.js | here}.
 *
 * @param userId - The id of the user need to unblock.
 * @param orgId - The id of the organization.
 * @returns If success, returns the new object with updated user data and if not, returns error message.
 *
 */
export const UNBLOCK_USER_MUTATION = gql`
  mutation UnblockUser($userId: ID!, $orgId: ID!) {
    unblockUser(organizationId: $orgId, userId: $userId) {
      _id
    }
  }
`;

/**
 * This mutation is used to block a user in an organization. After validating the user and organization from given respective ids, this mutation adds user to organizations blocked users field and add organization to users organizationsblockedbyfield inside the user record.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/block_user_mutations/block_user.js | here }
 *
 * @param userId - The id of the user need to block.
 * @param orgId - The id of the organization.
 *
 * @returns If success, returns the new object with updated user data and if not, returns error message.
 */
export const BLOCK_USER_MUTATION = gql`
  mutation BlockUser($userId: ID!, $orgId: ID!) {
    blockUser(organizationId: $orgId, userId: $userId) {
      _id
    }
  }
`;

/**
 * This mutation is used to reject a membership request from an organization. The mutation checks if the user, organization and membership request valid or not, if not throws an error and return error message, if they are valid the mutation removes the request from the user for an organization membership.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/membership_request_mutations/reject_membership_request.js | here }
 *
 * @param id - The id of membership request
 *
 * @returns membershipship request
 */
export const REJECT_ORGANIZATION_REQUEST_MUTATION = gql`
  mutation RejectMembershipRequest($id: ID!) {
    rejectMembershipRequest(membershipRequestId: $id) {
      _id
    }
  }
`;

/**
 * This mutation used to accept the membership request for an organization. The mutation checks if the user, organization and membership request valid or not, if not throws an error and return error message, if they are valid the mutation add user in membership request as a member to the organization.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/membership_request_mutations/accept_membership_request.js | here }
 *
 * @param id - The id of membership request.
 *
 * @returns membershipship request.
 */
export const ACCEPT_ORGANIZATION_REQUEST_MUTATION = gql`
  mutation AcceptMembershipRequest($id: ID!) {
    acceptMembershipRequest(membershipRequestId: $id) {
      _id
    }
  }
`;

/**
 * As the name suggests, this mutation is used to update the organization data. The mutation first validates the organization existence from passed id and validates the user requested for the update is admin or not. If both are true then it updates the data in the database.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/organization_mutations/updateOrganization.js | here }
 *
 * @param id - organization id
 * @param name - organization name
 * @param description - organization description
 * @param isPublic - organization visibility
 * @param visibleInSearch - organization search visibility
 *
 * @returns updated organization data in form of object.
 */
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

/**
 * This mutation updates the user data with the reference of passed parameters.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/user_mutations/updateUserProfile.js | here }
 *
 * @param id - User Id
 * @param firstName - First Name of the User
 * @param lastName  - Last Name of the User
 * @param email - Email of the User
 */
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

/**
 * The mutation is used to signup/register the user to the App. It checks wheather the user already registered or not. After validating, it creates a new user.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/auth_mutations/signup.js | here }
 *
 * @param firstName - First Name of the User
 * @param lastName - Last Name of the User
 * @param email - Email of the User
 * @param password - Password of the User, it get encrypted while saving in the database.
 * @param userType - Role of the User, example: Superadmin
 *
 * @returns accessToken, refreshToken, user
 */
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

/**
 * This mutation login/signin the user to the app. It validates the user from the credentials.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/auth_mutations/login.js | here }
 *
 * @param email - Email of the User
 * @param password - Password of the User
 *
 * @returns userId, accessToken, refreshToken
 */
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

/**
 * The CREATE_ORGANIZATION_MUTATION used to create the new organization. The user created the organization will be marked as admin of the organization.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/organization_mutations/createOrganization.js | here }
 *
 * @param description - Description for the Organization
 * @param location - Location of the Organization
 * @param name - name of the Organization
 * @param isPublic - organization visibility
 * @param visibleInSearch - organization search visibility
 *
 * @returns orgId
 */
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

/**
 * The DELETE_ORGANIZATION_MUTATION is used to delete the organization. The mutation validates the user, wheather the user is admin or not.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/organization_mutations/removeOrganization.js | here }
 *
 * @param id - Organization id
 */
export const DELETE_ORGANIZATION_MUTATION = gql`
  mutation RemoveOrganization($id: ID!) {
    removeOrganization(id: $id) {
      _id
    }
  }
`;

/**
 * This mutation is used to create an event for the organization. After validating the user and the organization, the mutation creates the event and add event to the user record.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/event_mutations/createEvent.js | here }
 *
 * @param title - Title of the Event
 * @param description - Event Description
 * @param recurring
 * @param isPublic - Visibility of the event in the Organization
 * @param isRegisterable - Eligibility of the event
 * @param organizationId - Organization Id
 * @param startDate - Starting Date of the Event
 * @param endDate - Ending Date of the Event
 * @param allDay - Wheather the event is day long
 *
 * @returns eventdata
 *
 */
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

/**
 * This mutation is used to delete the event frpm the organization. After validating the user and the organization, the mutation deketes the event and update events in the user record.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/event_mutations/removeEvent.js | here }
 *
 * @param id - Event Id
 *
 */
export const DELETE_EVENT_MUTATION = gql`
  mutation RemoveEvent($id: ID!) {
    removeEvent(id: $id) {
      _id
    }
  }
`;

/**
 * The REMOVE_ADMIN_MUTATION remove the admin from the organization. It validates the user, organization from the respective id passed and deletes the admin in the org record.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/admin_mutations/removeAdmin.js | here }
 *
 * @param orgId - Organization Id
 * @param userId - User Id
 */
export const REMOVE_ADMIN_MUTATION = gql`
  mutation RemoveAdmin($orgid: ID!, $userid: ID!) {
    removeAdmin(data: { organizationId: $orgid, userId: $userid }) {
      _id
    }
  }
`;

/**
 * This mutation is used to remove the member from the organization.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/member_mutations/removeMember.js | here }
 *
 * @param orgId - Organization Id
 * @param userId - Id of the User need to remove
 *
 */
export const REMOVE_MEMBER_MUTATION = gql`
  mutation RemoveAdmin($orgid: ID!, $userid: ID!) {
    removeAdmin(data: { organizationId: $orgid, userId: $userid }) {
      _id
    }
  }
`;

/**
 * This mutation is used to add the new admin for the organization.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/member_mutations/removeMember.js | here }
 *
 * @param orgId - Organization Id
 * @param userId - User Id
 *
 */
export const ADD_ADMIN_MUTATION = gql`
  mutation CreateAdmin($orgid: ID!, $userid: ID!) {
    createAdmin(data: { organizationId: $orgid, userId: $userid }) {
      _id
    }
  }
`;

/**
 * The CREATE_POST_MUTATION used to create the post in the organization.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/member_mutations/removeMember.js | here }
 *
 * @param text - description for the post
 * @param title - Title for the Post
 * @param imageUrl - Image URL for the Post.
 * @param videoUrl - Video URL for the Post.
 * @param organizationId - organization Id
 *
 * @returns postData(Object)
 */
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

/**
 * This mutation is used to delete the post from the organization.
 *
 * @remarks
 * This mutation is declared in talawa-API. Documentation for this mutation can find {@link https://github.com/PalisadoesFoundation/talawa-api/blob/develop/lib/resolvers/member_mutations/removeMember.js | here }
 *
 * @param id - Post Id
 */
export const DELETE_POST_MUTATION = gql`
  mutation RemovePost($id: ID!) {
    removePost(id: $id) {
      _id
    }
  }
`;
