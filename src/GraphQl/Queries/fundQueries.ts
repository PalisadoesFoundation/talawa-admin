/* eslint-disable */
import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve the list of members for a specific organization.
 *
 * @param id - The ID of the organization for which members are being retrieved.
 * @params name - The name of the organization for which members are being retrieved.
 * @params creatorId - The ID of the creator of the organization.
 * @params updaterId - The ID of the user who last updated the organization.
 * @params isTaxDeductible - A boolean value indicating whether the organization is tax deductible.
 * @returns The list of members associated with the organization.
 */
export const FUND_LIST = gql`
  query FundsByOrganization($input: QueryOrganizationInput!) {
    organization(input: $input) {
      funds(first: 32) {
        edges {
          node {
            creator {
              id
            }
            id
            isTaxDeductible
            name
            organization {
              id
            }
            updater {
              id
            }
          }
        }
      }
    }
  }
`;

/**
 * Query to fetch a specific fund by its ID, along with its associated campaigns.
 * @params id - The ID of the fund campaign to be fetched.
 * @params name - The name of the fund campaign to be fetched.
 * @params sratAt - The start date of the fund campaign to be fetched.
 * @params endAt - The end date of the fund campaign to be fetched.
 * @params currencyCode - The currency code of the fund campaign to be fetched.
 * @params goalAmount - The goal amount of the fund campaign to be fetched.
 * @returns The fund campaign with the specified ID.
 */

export const FUND_CAMPAIGN = gql`
  query GetFundById($input: QueryFundInput!) {
    fund(input: $input) {
      id
      name
      campaigns(first: 10) {
        edges {
          node {
            id
            name
            startAt
            endAt
            currencyCode
            goalAmount
          }
        }
      }
    }
  }
`;

export const FUND_CAMPAIGN_PLEDGE = gql`
  query GetFundCampaignPledges($input: QueryFundCampaignInput!) {
    fundCampaign(input: $input) {
      id
      name
      pledges(first: 10) {
        edges {
          node {
            id
            amount
            note
            pledger {
              id
              name
            }
          }
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
    getFundraisingCampaigns(where: $where, campaignOrderBy: $campaignOrderBy) {
      id
      name
      currency
      fundingGoal
      startDate
      endDate
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
