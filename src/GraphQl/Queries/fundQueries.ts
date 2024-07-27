/*eslint-disable*/
import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve the list of members for a specific organization.
 *
 * @param id - The ID of the organization for which members are being retrieved.
 * @param filter - The filter to search for a specific member.
 * @returns The list of members associated with the organization.
 */
export const FUND_LIST = gql`
  query FundsByOrganization(
    $organizationId: ID!
    $filter: String
    $orderBy: FundOrderByInput
  ) {
    fundsByOrganization(
      organizationId: $organizationId
      where: { name_contains: $filter }
      orderBy: $orderBy
    ) {
      _id
      name
      refrenceNumber
      taxDeductible
      isDefault
      isArchived
      createdAt
      organizationId
      creator {
        _id
        firstName
        lastName
      }
    }
  }
`;

export const FUND_CAMPAIGN = gql`
  query GetFundById(
    $id: ID!
    $where: CampaignWhereInput
    $orderBy: CampaignOrderByInput
  ) {
    getFundById(id: $id, where: $where, orderBy: $orderBy) {
      campaigns {
        _id
        endDate
        fundingGoal
        name
        startDate
        currency
      }
    }
  }
`;

export const FUND_CAMPAIGN_PLEDGE = gql`
  query GetFundraisingCampaignById($id: ID!, $orderBy: PledgeOrderByInput) {
    getFundraisingCampaignById(id: $id, orderBy: $orderBy) {
      name
      fundingGoal
      currency
      startDate
      endDate
      pledges {
        _id
        amount
        currency
        endDate
        startDate
        users {
          _id
          firstName
          lastName
          image
        }
      }
    }
  }
`;
