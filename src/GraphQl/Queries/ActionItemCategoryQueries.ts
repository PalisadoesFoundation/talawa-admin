import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve action item categories by organization.
 * * @returns The list of action item categories associated with the organization.
 */
export const ACTION_ITEM_CATEGORY_LIST = gql`
  query GetActionItemCategory(
    $input: QueryActionCategoriesByOrganizationInput!
  ) {
    actionCategoriesByOrganization(input: $input) {
      id
      name
      description
      isDisabled
      creator {
        id
      }
      createdAt
      updatedAt
    }
  }
`;

/**
 * Query to fetch a single action item category
 * Using direct id parameter
 */
export const GET_ACTION_ITEM_CATEGORY = gql`
  query GetActionItemCategory($input: QueryActionItemCategoryInput!) {
    actionItemCategory(input: $input) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
