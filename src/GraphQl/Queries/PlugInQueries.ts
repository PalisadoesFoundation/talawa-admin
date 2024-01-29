import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve a list of plugins.
 *
 * @returns The list of plugins with details such as ID, name, creator, description, and uninstalled organizations.
 */

export const PLUGIN_GET = gql`
  query getPluginList {
    getPlugins {
      _id
      pluginName
      pluginCreatedBy
      pluginDesc
      uninstalledOrgs
    }
  }
`;

/**
 * GraphQL query to retrieve a list of advertisements.
 *
 * @returns The list of advertisements with details such as ID, name, type, organization ID, link, start date, and end date.
 */

export const ADVERTISEMENTS_GET = gql`
  query getAdvertisement {
    getAdvertisements {
      _id
      name
      type
      orgId
      link
      endDate
      startDate
    }
  }
`;

/**
 * GraphQL query to retrieve a list of events based on organization connection.
 *
 * @param organization_id - The ID of the organization for which events are being retrieved.
 * @param title_contains - Optional. Filter events by title containing a specified string.
 * @param description_contains - Optional. Filter events by description containing a specified string.
 * @param location_contains - Optional. Filter events by location containing a specified string.
 * @param first - Optional. Number of events to retrieve in the first batch.
 * @param skip - Optional. Number of events to skip before starting to collect the result set.
 * @returns The list of events associated with the organization based on the applied filters.
 */

export const ORGANIZATION_EVENTS_CONNECTION = gql`
  query EventsByOrganizationConnection(
    $organization_id: ID!
    $title_contains: String
    $description_contains: String
    $location_contains: String
    $first: Int
    $skip: Int
  ) {
    eventsByOrganizationConnection(
      where: {
        organization_id: $organization_id
        title_contains: $title_contains
        description_contains: $description_contains
        location_contains: $location_contains
      }
      first: $first
      skip: $skip
    ) {
      _id
      title
      description
      startDate
      endDate
      location
      startTime
      endTime
      allDay
      recurring
      isPublic
      isRegisterable
      creator {
        _id
        firstName
        lastName
      }
      attendees {
        _id
      }
    }
  }
`;

/**
 * GraphQL query to retrieve a list of direct chats based on user ID.
 *
 * @param id - The ID of the user for which direct chats are being retrieved.
 * @returns The list of direct chats associated with the user, including details such as ID, creator, messages, organization, and participating users.
 */

export const DIRECT_CHATS_LIST = gql`
  query DirectChatsByUserID($id: ID!) {
    directChatsByUserID(id: $id) {
      _id
      creator {
        _id
        firstName
        lastName
        email
      }
      messages {
        _id
        createdAt
        messageContent
        receiver {
          _id
          firstName
          lastName
          email
        }
        sender {
          _id
          firstName
          lastName
          email
        }
      }
      organization {
        _id
        name
      }
      users {
        _id
        firstName
        lastName
        email
        image
      }
    }
  }
`;

/**
 * GraphQL query to check if an organization is a sample organization.
 *
 * @param isSampleOrganizationId - The ID of the organization being checked.
 * @returns A boolean indicating whether the organization is a sample organization.
 */

export const IS_SAMPLE_ORGANIZATION_QUERY = gql`
  query ($isSampleOrganizationId: ID!) {
    isSampleOrganization(id: $isSampleOrganizationId)
  }
`;

/**
 * GraphQL query to retrieve custom fields for a specific organization.
 *
 * @param customFieldsByOrganizationId - The ID of the organization for which custom fields are being retrieved.
 * @returns The list of custom fields associated with the organization, including details such as ID, type, and name.
 */

export const ORGANIZATION_CUSTOM_FIELDS = gql`
  query ($customFieldsByOrganizationId: ID!) {
    customFieldsByOrganization(id: $customFieldsByOrganizationId) {
      _id
      type
      name
    }
  }
`;
