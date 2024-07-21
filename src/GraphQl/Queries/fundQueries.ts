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
  query FundsByOrganization($organizationId: ID!, $filter: String) {
    fundsByOrganization(
      organizationId: $organizationId
      where: { name_contains: $filter }
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
  query GetFundById($id: ID!) {
    getFundById(id: $id) {
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

export const USER_FUND_CAMPAIGNS = gql`
  query GetFundraisingCampaigns(
    $where: CampaignWhereInput
    $orderBy: PledgeOrderByInput
  ) {
    getFundraisingCampaigns(where: $where, orderBy: $orderBy) {
      _id
      startDate
      endDate
      name
      fundingGoal
      currency
    }
  }
`;
