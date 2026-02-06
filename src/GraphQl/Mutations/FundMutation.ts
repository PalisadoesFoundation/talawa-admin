import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a new fund.
 *
 * @param name - The name of the fund.
 * @param organizationId - The organization ID the fund is associated with.
 * @param isTaxDeductible - Whether the fund is tax deductible.
 * @returns The ID of the created fund.
 */
export const CREATE_FUND_MUTATION = gql`
  mutation CreateFund(
    $name: String!
    $organizationId: ID!
    $isTaxDeductible: Boolean!
  ) {
    createFund(
      input: {
        name: $name
        organizationId: $organizationId
        isTaxDeductible: $isTaxDeductible
      }
    ) {
      id
    }
  }
`;

/**
 * GraphQL mutation to update a fund.
 *
 * @param id - The ID of the fund being updated.
 * @param name - The name of the fund.
 * @param taxDeductible - Whether the fund is tax deductible.
 * @returns The ID of the updated fund.
 */
export const UPDATE_FUND_MUTATION = gql`
  mutation UpdateFund($input: MutationUpdateFundInput!) {
    updateFund(input: $input) {
      id
    }
  }
`;

/**
 * GraphQL mutation to delete a fund.
 *
 * @param id - The ID of the fund to delete.
 * @returns The deleted fund.
 */
export const DELETE_FUND_MUTATION = gql`
  mutation DeleteFund($input: MutationDeleteFundInput!) {
    deleteFund(input: $input) {
      id
    }
  }
`;
