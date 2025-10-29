import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve funds for an organization (including nested campaigns).
 *
 * @param id - The ID of the organization to fetch funds for.
 * @returns The list of funds with their associated campaigns.
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
            campaign {
              id
              name
              fund {
                name
              }
            }
            pledger {
              id
              name
              createdAt
            }
          }
        }
      }
    }
  }
`;

// Note: This query is deprecated in favor of using FUND_LIST with client-side filtering
// Keeping for reference but not exported to avoid unused export warnings
// export const USER_FUND_CAMPAIGNS = gql`
//   query GetFundraisingCampaigns(
//     $where: CampaignWhereInput
//     $campaignOrderBy: CampaignOrderByInput
//   ) {
//     getFundraisingCampaigns(where: $where, campaignOrderBy: $campaignOrderBy) {
//       _id
//       name
//       currency
//       fundingGoal
//       startDate
//       endDate
//     }
//   }
// `;

export const USER_PLEDGES = gql`
  query GetPledgesByUserId(
    $input: QueryFundCampaignPledgesByUserInput!
    $where: QueryPledgeWhereInput
    $orderBy: QueryPledgeOrderByInput
    $limit: Int
    $offset: Int
  ) {
    getPledgesByUserId(
      input: $input
      where: $where
      orderBy: $orderBy
      limit: $limit
      offset: $offset
    ) {
      id
      amount
      note
      updatedAt
      campaign {
        id
        name
        startAt
        endAt
        currencyCode
        goalAmount
      }
      pledger {
        id
        name
        avatarURL
      }
      users {
        id
        name
        avatarURL
      }
      updater {
        id
      }
    }
  }
`;
