import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a new fund.
 *
 * @param name - The name of the fund.
 * @param organizationId - The organization ID the fund is associated with.
 * @param refrenceNumber - The reference number of the fund.
 * @param taxDeductible - Whether the fund is tax deductible.
 * @param isArchived - Whether the fund is archived.
 * @param isDefault - Whether the fund is the default.
 * @returns The ID of the created fund.
 */
export const CREATE_FUND_MUTATION = gql`
  mutation CreateFund(
    $name: String!
    $organizationId: ID!
    $refrenceNumber: String
    $taxDeductible: Boolean!
    $isArchived: Boolean!
    $isDefault: Boolean!
  ) {
    createFund(
      data: {
        name: $name
        organizationId: $organizationId
        refrenceNumber: $refrenceNumber
        taxDeductible: $taxDeductible
        isArchived: $isArchived
        isDefault: $isDefault
      }
    ) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to update a fund.
 *
 * @param id - The ID of the fund being updated.
 * @param name - The name of the fund.
 * @param refrenceNumber - The reference number of the fund.
 * @param taxDeductible - Whether the fund is tax deductible.
 * @param isArchived - Whether the fund is archived.
 * @param isDefault - Whether the fund is the default.
 * @returns The ID of the updated fund.
 */
export const UPDATE_FUND_MUTATION = gql`
  mutation UpdateFund(
    $id: ID!
    $name: String
    $refrenceNumber: String
    $taxDeductible: Boolean
    $isArchived: Boolean
    $isDefault: Boolean
  ) {
    updateFund(
      id: $id
      data: {
        name: $name
        refrenceNumber: $refrenceNumber
        taxDeductible: $taxDeductible
        isArchived: $isArchived
        isDefault: $isDefault
      }
    ) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to remove a fund.
 *
 * @param id - The ID of the fund being removed.
 * @returns The ID of the removed fund.
 */
export const REMOVE_FUND_MUTATION = gql`
  mutation RemoveFund($id: ID!) {
    removeFund(id: $id) {
      _id
    }
  }
`;
