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
      name
      isArchived
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
  query GetFundraisingCampaigns(
    $where: CampaignWhereInput
    $pledgeOrderBy: PledgeOrderByInput
  ) {
    getFundraisingCampaigns(where: $where, pledgeOrderBy: $pledgeOrderBy) {
      fundId {
        name
      }
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

export const USER_FUND_CAMPAIGNS = gql`
  query GetFundraisingCampaigns(
    $where: CampaignWhereInput
    $campaignOrderBy: CampaignOrderByInput
  ) {
    getFundraisingCampaigns(where: $where, campaignOrderby: $campaignOrderBy) {
      _id
      startDate
      endDate
      name
      fundingGoal
      currency
    }
  }
`;

export const USER_PLEDGES = gql`
  query GetPledgesByUserId(
    $userId: ID!
    $where: PledgeWhereInput
    $orderBy: PledgeOrderByInput
  ) {
    getPledgesByUserId(userId: $userId, where: $where, orderBy: $orderBy) {
      _id
      amount
      startDate
      endDate
      campaign {
        _id
        name
        endDate
      }
      currency
      users {
        _id
        firstName
        lastName
        image
      }
    }
  }
`;
