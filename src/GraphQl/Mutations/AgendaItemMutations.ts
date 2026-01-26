import gql from 'graphql-tag';

export const CREATE_AGENDA_ITEM_MUTATION = gql`
  mutation CreateAgendaItem($input: MutationCreateAgendaItemInput!) {
    createAgendaItem(input: $input) {
      id
      name
      description
      duration
      createdAt
      url {
        id
        url
      }
      event {
        id
        name
      }
      folder {
        id
        name
      }
      creator {
        id
        name
      }
    }
  }
`;

export const DELETE_AGENDA_ITEM_MUTATION = gql`
  mutation RemoveAgendaItem($input: MutationDeleteAgendaItemInput!) {
    deleteAgendaItem(input: $input) {
      id
    }
  }
`;

export const UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION = gql`
  mutation UpdateAgendaItem($input: MutationUpdateAgendaItemSequenceInput!) {
    updateAgendaItemSequence(input: $input) {
      id
      sequence
    }
  }
`;

export const UPDATE_AGENDA_ITEM_MUTATION = gql`
  mutation UpdateAgendaItem($input: MutationUpdateAgendaItemInput!) {
    updateAgendaItem(input: $input) {
      id
      name
      description
      duration
      url {
        id
        url
      }
      folder {
        id
        name
      }
      updater {
        id
        name
      }
      updatedAt
    }
  }
`;
