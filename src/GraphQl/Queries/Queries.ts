import gql from 'graphql-tag';

//Query List

// Check Auth

/**
 * CHECK_AUTH
 *
 * Query to check the authentication
 *
 * @remarks
 * If the credentials match, then user is authenticated.
 *
 * @param id - integer
 * @param firstName- string
 * @param lastName- string
 * @param image- image
 * @param email- string
 * @param userType- string
 */

export const CHECK_AUTH = gql`
  query {
    checkAuth {
      _id
      firstName
      lastName
      image
      email
      userType
    }
  }
`;

// Query to take the Organization list
/**
* ORGANIZATION_LIST
* 
* Query to take the Organization list
*
* 
* @param organizations - object
* @param id - property of organizations, integer
* @param image- proprty of organizations, image
* @param creator - property of organizations, object
* @param firstName - property of creator, string
* @param lastName - property of creator, string
* @param name - property of organizations, string
* @param members - property of organizations, object
* @param id - property of members, integer
* @param admins - property of organizations, object
* @param id - property of admins, integer
* @param createdAt - property of organizations, string
* @param location - property of organizations, string
* @example
* Here is the program structure of the query:
* ```
export const ORGANIZATION_LIST = gql`
  query {
    organizations {
      _id
      image
      creator {
        firstName
        lastName
      }
      name
      members {
        _id
      }
      admins {
        _id
      }
      createdAt
      location
    }
  }
`;
* ```
*/

export const ORGANIZATION_LIST = gql`
  query {
    organizations {
      _id
      image
      creator {
        firstName
        lastName
      }
      name
      members {
        _id
      }
      admins {
        _id
      }
      createdAt
      location
    }
  }
`;

// Query to take the User list

/**
 * USER_LIST
 *
 * Query to take the User list
 *
 * @param users - object
 * @param firstName - property of users, string
 * @param lastName - property of users, string
 * @param image- proprty of users, image
 * @param id - property of users, integer
 */

export const USER_LIST = gql`
  query {
    users {
      firstName
      lastName
      image
      _id
    }
  }
`;

// Query to take the Organization with data

/**
 * ORGANIZATIONS_LIST
 *
 * Query to take the Organization with data
 * @param organizations- object, accepts argument: id
 * @param id-property of organizations, integer
 * @param image-property of organizations, image
 * @param creator-property of organizations, object
 * @param firstName-property of creator, string
 * @param lastName-property of creator, string
 * @param email-property of creator, string
 * @param name-property of organizations, string
 * @param description-property of organizations, description
 */

export const ORGANIZATIONS_LIST = gql`
  query Organizations($id: ID!) {
    organizations(id: $id) {
      _id
      image
      creator {
        firstName
        lastName
        email
      }
      name
      description
    }
  }
`;

// Query to take the Members of a particular organization

/**
 * MEMBERS_LIST
 *
 * Query to take the Members of a particular organization
 * @param organizations- object, accepts argument: id
 * @param id-property of organizations, integer
 * @param members- property of organizations, object
 * @param id-property of members, integer
 * @param firstName-property of members, string
 * @param lastName-property of members, string
 * @param image-property of members, image
 */

export const MEMBERS_LIST = gql`
  query Organizations($id: ID!) {
    organizations(id: $id) {
      _id
      members {
        _id
        firstName
        lastName
        image
      }
    }
  }
`;

// To take the list of the oranization joined by a user

/**
 * USER_ORGANIZATION_LIST
 *
 * Query to take the list of the oranization joined by a user
 *
 * @param user- object, accepts argument: id
 * @param firstName-property of user, string
 * @param lastName-property of user, string
 * @param image-property of user, image
 * @param email-property of user, string
 * @param userType-property of user, string
 * @param adminFor-property of user, object
 * @param id-property of adminFor, integer
 * @param name-property of adminFor, string
 * @param image-property of adminFor, image
 */

export const USER_ORGANIZATION_LIST = gql`
  query User($id: ID!) {
    user(id: $id) {
      firstName
      lastName
      image
      email
      userType
      adminFor {
        _id
        name
        image
      }
    }
  }
`;

// to take the organization event list

/**
 * ORGANIZATION_EVENT_LIST
 *
 * Query to take the organization event list
 *
 * @param eventsByOrganization- object, accepts argument: id
 * @param id-property of eventsByOrganization, integer
 * @param title-property of eventsByOrganization, string
 * @param description-property of eventsByOrganization, string
 * @param startDate-property of eventsByOrganization, string
 */

export const ORGANIZATION_EVENT_LIST = gql`
  query EventsByOrganization($id: ID!) {
    eventsByOrganization(id: $id) {
      _id
      title
      description
      startDate
    }
  }
`;

// to take the list of the admins of a particular

/**
 * ADMIN_LIST
 *
 * Query to take the list of the admins of a particular
 *
 * @param organizations- object, accepts argument: id
 * @param id-property of organizations, integer
 * @param admins-property of organizations, object
 * @param id- property of admins, integer
 * @param firstName-property of admins, string
 * @param lastName-property of admins, string
 * @param image-property of admins, image
 */

export const ADMIN_LIST = gql`
  query Organizations($id: ID!) {
    organizations(id: $id) {
      _id
      admins {
        _id
        firstName
        lastName
        image
      }
    }
  }
`;

// to take the membership request

/**
 *  MEMBERSHIP_REQUEST
 *
 * Query to take the membership request
 *
 * @param organizations- object, accepts argument: id
 * @param id-property of organizations, integer
 * @param membershipRequests-property of organizations, object
 * @param id- property of membershipRequests, integer
 * @param user- property of membershipRequests, object
 * @param id- property of user, integer
 * @param firstName-property of user, string
 * @param lastName-property of user, string
 * @param email-property of user, string
 */

export const MEMBERSHIP_REQUEST = gql`
  query Organizations($id: ID!) {
    organizations(id: $id) {
      _id
      membershipRequests {
        _id
        user {
          _id
          firstName
          lastName
          email
        }
      }
    }
  }
`;

// display posts

/**
 *  ORGANIZATION_POST_LIST
 *
 * Query to display posts
 *
 * @param postsByOrganization- object, accepts argument: id
 * @param id-property of postsByOrganization, integer
 * @param title- property of postsByOrganization, string
 * @param text- property of postsByOrganization, string
 * @param imageUrl- property of postsByOrganization, string
 * @param videoUrl-property of postsByOrganization, string
 */

export const ORGANIZATION_POST_LIST = gql`
  query PostsByOrganization($id: ID!) {
    postsByOrganization(id: $id) {
      _id
      title
      text
      imageUrl
      videoUrl
    }
  }
`;
