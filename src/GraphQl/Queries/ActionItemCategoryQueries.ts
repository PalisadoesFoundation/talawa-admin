import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve action item categories by organization.
 *
 * @param organizationId - The ID of the organization for which action item categories are being retrieved.
 * @returns The list of action item categories associated with the organization.
 */

export const ACTION_ITEM_CATEGORY_LIST = gql`
  query ActionItemCategoriesByOrganization(
    $organizationId: ID!
    $where: ActionItemCategoryWhereInput
    $orderBy: ActionItemsOrderByInput
  ) {
    actionItemCategoriesByOrganization(
      organizationId: $organizationId
      where: $where
      orderBy: $orderBy
    ) {
      _id
      name
      isDisabled
      createdAt
      creator {
        _id
        firstName
        lastName
      }
    }
  }
`;
