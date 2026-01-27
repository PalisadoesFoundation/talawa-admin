import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a new agenda folder.
 *
 * `@param` input - MutationCreateAgendaFolderInput containing folder details
 * `@returns` The created agenda folder with id, name, description, sequence, event, and creator
 */
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

/**
 * GraphQL mutation to update an existing agenda folder.
 *
 * `@param` input - MutationUpdateAgendaFolderInput containing folder id and fields to update
 * `@returns` The updated agenda folder with id, name, and description
 */
export const UPDATE_AGENDA_FOLDER_MUTATION = gql`
  mutation updateAgendaFolder($input: MutationUpdateAgendaFolderInput!) {
    updateAgendaFolder(input: $input) {
      id
      name
      description
    }
  }
`;

/**
 * GraphQL mutation to delete an agenda folder.
 *
 * `@param` input - MutationDeleteAgendaFolderInput containing the folder id to delete
 * `@returns` The deleted folder's id
 */
export const DELETE_AGENDA_FOLDER_MUTATION = gql`
  mutation deleteAgendaFolder($input: MutationDeleteAgendaFolderInput!) {
    deleteAgendaFolder(input: $input) {
      id
    }
  }
`;
