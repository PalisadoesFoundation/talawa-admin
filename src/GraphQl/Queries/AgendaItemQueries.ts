import gql from 'graphql-tag';

export const AgendaItemByOrganization = gql`
  query AgendaItemByOrganization($organizationId: ID!) {
    agendaItemByOrganization(organizationId: $organizationId) {
      _id
      title
      description
      duration
      attachments
      createdBy {
        _id
        firstName
        lastName
      }
      urls
      users {
        _id
        firstName
        lastName
      }
      categories {
        _id
        name
      }
      sequence
      organization {
        _id
        name
      }
      relatedEvent {
        _id
        title
      }
    }
  }
`;

export const AgendaItemByEvent = gql`
  query AgendaItemByEvent($relatedEventId: ID!) {
    agendaItemByEvent(relatedEventId: $relatedEventId) {
      _id
      title
      description
      duration
      attachments
      createdBy {
        _id
        firstName
        lastName
      }
      urls
      users {
        _id
        firstName
        lastName
      }
      sequence
      categories {
        _id
        name
      }
      organization {
        _id
        name
      }
      relatedEvent {
        _id
        title
      }
    }
  }
`;
