import gql from 'graphql-tag';

/**
 * GraphQL mutation to create an action item category.
 *
 * @param name - Name of the ActionItemCategory.
 * @param isDisabled - Disabled status of the ActionItemCategory.
 * @param organizationId - Organization to which the ActionItemCategory belongs.
 */

export const CREATE_ACTION_ITEM_CATEGORY_MUTATION = gql`
  mutation CreateActionItemCategory(
    $name: String!
    $isDisabled: Boolean!
    $organizationId: ID!
  ) {
    createActionItemCategory(
      name: $name
      isDisabled: $isDisabled
      organizationId: $organizationId
    ) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to update an action item category.
 *
 * @param id - The id of the ActionItemCategory to be updated.
 * @param name - Updated name of the ActionItemCategory.
 * @param isDisabled - Updated  disabled status of the ActionItemCategory.
 */

export const UPDATE_ACTION_ITEM_CATEGORY_MUTATION = gql`
  mutation UpdateActionItemCategory(
    $actionItemCategoryId: ID!
    $name: String
    $isDisabled: Boolean
  ) {
    updateActionItemCategory(
      id: $actionItemCategoryId
      data: { name: $name, isDisabled: $isDisabled }
    ) {
      _id
    }
  }
`;
