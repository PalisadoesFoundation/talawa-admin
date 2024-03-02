import gql from 'graphql-tag';

export const CREATE_FUND_MUTATION = gql`
  mutation CreateFund(
    $name: String!
    $organizationId: ID!
    $refrenceNumber: String!
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
