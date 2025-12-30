import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve the list of members for a specific organization.
 *
 * @param id - The ID of the organization for which members are being retrieved.
 * @param name - The name of the organization for which members are being retrieved.
 * @param creatorId - The ID of the creator of the organization.
 * @param updaterId - The ID of the user who last updated the organization.
 * @param isTaxDeductible - A boolean value indicating whether the organization is tax deductible.
 * @returns The list of members associated with the organization.
 */
export const FUND_LIST = gql`
  query FundsByOrganization($input: QueryOrganizationInput!) {
    organization(input: $input) {
      funds(first: 32) {
        edges {
          node {
            creator {
              name
            }
            id
            isTaxDeductible
            name
            organization {
              name
            }
            updater {
              name
            }
            createdAt
            isArchived
          }
        }
      }
    }
  }
`;

/**
 * Query to fetch a specific fund by its ID, along with its associated campaigns.
 * @param id - The ID of the fund campaign to be fetched.
 * @param name - The name of the fund campaign to be fetched.
 * @param sratAt - The start date of the fund campaign to be fetched.
 * @param endAt - The end date of the fund campaign to be fetched.
 * @param currencyCode - The currency code of the fund campaign to be fetched.
 * @param goalAmount - The goal amount of the fund campaign to be fetched.
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
      endAt
      startAt
      currencyCode
      goalAmount
      pledges(first: 32) {
        edges {
          node {
            id
            amount
            note
            createdAt
            updatedAt
            campaign {
              id
              name
              fund {
                id
                name
              }
            }
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
  query GetFundraisingCampaigns($input: QueryOrganizationInput!) {
    organization(input: $input) {
      funds(first: 32) {
        edges {
          node {
            campaigns(first: 32) {
              edges {
                node {
                  id
                  name
                  currencyCode
                  goalAmount
                  startAt
                  endAt
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const USER_PLEDGES = gql`
  query GetPledgesByUserId(
    $input: QueryFundCampaignPledgesByUserInput!
    $where: QueryPledgeWhereInput
    $orderBy: QueryPledgeOrderByInput
  ) {
    getPledgesByUserId(input: $input, where: $where, orderBy: $orderBy) {
      id
      amount
      note
      createdAt
      updatedAt
      campaign {
        id
        name
        startAt
        endAt
        currencyCode
      }
      pledger {
        id
        name
        avatarURL
      }
    }
  }
`;
