import gql from 'graphql-tag';

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

export const USER_TASKS_LIST = gql`
  query User($id: ID!) {
    user(id: $id) {
      _id
      assignedTasks {
        _id
        title
        description
        deadline
        volunteers {
          _id
          firstName
          lastName
          email
        }
        createdAt
        completed
        event {
          _id
          title
          organization {
            _id
            name
            image
          }
        }
        creator {
          _id
          firstName
          lastName
        }
      }
    }
  }
`;

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

export const IS_SAMPLE_ORGANIZATION_QUERY = gql`
  query ($isSampleOrganizationId: ID!) {
    isSampleOrganization(id: $isSampleOrganizationId)
  }
`;

export const ORGANIZATION_CUSTOM_FIELDS = gql`
  query ($customFieldsByOrganizationId: ID!) {
    customFieldsByOrganization(id: $customFieldsByOrganizationId) {
      _id
      type
      name
    }
  }
`;
