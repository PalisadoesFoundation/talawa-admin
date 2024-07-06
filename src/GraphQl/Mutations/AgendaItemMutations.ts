import gql from 'graphql-tag';

export const CREATE_AGENDA_ITEM_MUTATION = gql`
  mutation CreateAgendaItem($input: CreateAgendaItemInput!) {
    createAgendaItem(input: $input) {
      _id
      title
    }
  }
`;

export const DELETE_AGENDA_ITEM_MUTATION = gql`
  mutation RemoveAgendaItem($removeAgendaItemId: ID!) {
    removeAgendaItem(id: $removeAgendaItemId) {
      _id
    }
  }
`;

export const UPDATE_AGENDA_ITEM_MUTATION = gql`
  mutation UpdateAgendaItem(
    $updateAgendaItemId: ID!
    $input: UpdateAgendaItemInput!
  ) {
    updateAgendaItem(id: $updateAgendaItemId, input: $input) {
      _id
      description
      title
    }
  }
`;
