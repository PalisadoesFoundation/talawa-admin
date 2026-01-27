import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a new agenda item.
 *
 * `@param` input - The agenda item creation input containing title, description, duration, etc.
 * `@returns` The created agenda item with its details.
 */
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

/**
 * GraphQL mutation to delete an agenda item.
 *
 * `@param` input - The deletion input containing the agenda item ID.
 * `@returns` The ID of the deleted agenda item.
 */
export const DELETE_AGENDA_ITEM_MUTATION = gql`
  mutation DeleteAgendaItem($input: MutationDeleteAgendaItemInput!) {
    deleteAgendaItem(input: $input) {
      id
    }
  }
`;

/**
 * GraphQL mutation to update the sequence/order of an agenda item.
 *
 * `@param` input - The sequence update input containing item ID and new sequence.
 * `@returns` The updated agenda item with its new sequence.
 */
export const UPDATE_AGENDA_ITEM_SEQUENCE_MUTATION = gql`
  mutation UpdateAgendaItemSequence(
    $input: MutationUpdateAgendaItemSequenceInput!
  ) {
    updateAgendaItemSequence(input: $input) {
      id
      sequence
    }
  }
`;

/**
 * GraphQL mutation to update an agenda item's details.
 *
 * `@param` input - The update input containing item ID and fields to update.
 * `@returns` The updated agenda item with its details.
 */
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
