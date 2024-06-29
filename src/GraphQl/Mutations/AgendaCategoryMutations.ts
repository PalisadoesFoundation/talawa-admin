import gql from 'graphql-tag';

/**
 * GraphQL mutation to create an agenda category.
 *
 * @param input - Name, Description, OrganizationID of the AgendaCategory.
 */

export const CREATE_AGENDA_ITEM_CATEGORY_MUTATION = gql`
  mutation CreateAgendaCategory($input: CreateAgendaCategoryInput!) {
    createAgendaCategory(input: $input) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to delete an agenda category.
 *
 * @param deleteAgendaCategoryId - The ID of the AgendaCategory to be deleted.
 */

export const DELETE_AGENDA_ITEM_CATEGORY_MUTATION = gql`
  mutation DeleteAgendaCategory($deleteAgendaCategoryId: ID!) {
    deleteAgendaCategory(id: $deleteAgendaCategoryId)
  }
`;

/**
 * GraphQL mutation to update an agenda category.
 *
 * @param updateAgendaCategoryId - The ID of the AgendaCategory to be updated.
 * @param input - Updated Name, Description, OrganizationID of the AgendaCategory.
 */

export const UPDATE_AGENDA_ITEM_CATEGORY_MUTATION = gql`
  mutation UpdateAgendaCategory(
    $updateAgendaCategoryId: ID!
    $input: UpdateAgendaCategoryInput!
  ) {
    updateAgendaCategory(id: $updateAgendaCategoryId, input: $input) {
      _id
    }
  }
`;
