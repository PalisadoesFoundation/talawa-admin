import gql from 'graphql-tag';

export const CREATE_AGENDA_FOLDER_MUTATION = gql`
  mutation createAgendaFolder($input: MutationCreateAgendaFolderInput!) {
    createAgendaFolder(input: $input) {
      id
      name
      description
      sequence
      event {
        name
        id
      }
      creator {
        id
        name
      }
    }
  }
`;

export const UPDATE_AGENDA_FOLDER_MUTATION = gql`
  mutation updateAgendaFolder($input: MutationUpdateAgendaFolderInput!) {
    updateAgendaFolder(input: $input) {
      id
      name
      description
    }
  }
`;

export const DELETE_AGENDA_ITEM_FOLDER_MUTATION = gql`
  mutation deleteAgendaFolder($input: MutationDeleteAgendaFolderInput!) {
    deleteAgendaFolder(input: $input) {
      id
    }
  }
`;
