import gql from 'graphql-tag';

/**
 * GraphQL mutation to create an action item category.
 *
 * @param input - MutationCreateActionItemCategoryInput containing:
 *   - name: String! - Name of the action item category
 *   - isDisabled: Boolean - Whether the category is disabled (optional, defaults to false)
 *   - organizationId: ID! - ID of the organization this category belongs to
 */
export const CREATE_ACTION_ITEM_CATEGORY_MUTATION = gql`
  mutation CreateActionItemCategory(
    $input: MutationCreateActionItemCategoryInput!
  ) {
    createActionItemCategory(input: $input) {
      id
      name
      description
      isDisabled
      createdAt

      creator {
        id
      }
      organization {
        id
        name
      }
    }
  }
`;

/**
 * GraphQL mutation to update an action item category.
 *
 * @param input - MutationUpdateActionItemCategoryInput containing:
 *   - id: ID! - ID of the action item category to update
 *   - name: String - New name of the action item category (optional)
 *   - isDisabled: Boolean - Whether the category should be disabled (optional)
 */
export const UPDATE_ACTION_ITEM_CATEGORY_MUTATION = gql`
  mutation UpdateActionItemCategory(
    $input: MutationUpdateActionItemCategoryInput!
  ) {
    updateActionItemCategory(input: $input) {
      id
      name
      isDisabled
      updatedAt
    }
  }
`;

/**
 * GraphQL mutation to delete an action item category.
 * Updated to match new backend schema using input object
 *
 * @param input - MutationDeleteActionItemCategoryInput containing:
 *   - id: ID! - ID of the action item category to delete
 *
 *
 *  This mutation will permanently delete the category.
 *  Ensure the category is not associated with any action items before deletion.
 */
export const DELETE_ACTION_ITEM_CATEGORY_MUTATION = gql`
  mutation DeleteActionItemCategory(
    $input: MutationDeleteActionItemCategoryInput!
  ) {
    deleteActionItemCategory(input: $input) {
      id
      name
    }
  }
`;
