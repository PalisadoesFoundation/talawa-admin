import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a new fund Campaign.
 *
 * @param name - The name of the fund.
 * @param fundId - The fund ID the campaign is associated with.
 * @param fundingGoal - The funding goal of the campaign.
 * @param startDate - The start date of the campaign.
 * @param endDate - The end date of the campaign.
 * @param currency - The currency of the campaign.
 * @returns The ID of the created campaign.
 */

export const CREATE_CAMPAIGN_MUTATION = gql`
  mutation createFundraisingCampaign(
    $fundId: ID!
    $organizationId: ID!
    $name: String!
    $fundingGoal: Float!
    $startDate: Date!
    $endDate: Date!
    $currency: Currency!
  ) {
    createFundraisingCampaign(
      data: {
        fundId: $fundId
        organizationId: $organizationId
        name: $name
        fundingGoal: $fundingGoal
        startDate: $startDate
        endDate: $endDate
        currency: $currency
      }
    ) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to update a fund Campaign.
 *
 * @param id - The ID of the campaign being updated.
 * @param name - The name of the campaign.
 * @param fundingGoal - The funding goal of the campaign.
 * @param startDate - The start date of the campaign.
 * @param endDate - The end date of the campaign.
 * @param currency - The currency of the campaign.
 * @returns The ID of the updated campaign.
 */

export const UPDATE_CAMPAIGN_MUTATION = gql`
  mutation updateFundraisingCampaign(
    $id: ID!
    $name: String
    $fundingGoal: Float
    $startDate: Date
    $endDate: Date
    $currency: Currency
  ) {
    updateFundraisingCampaign(
      id: $id
      data: {
        name: $name
        fundingGoal: $fundingGoal
        startDate: $startDate
        endDate: $endDate
        currency: $currency
      }
    ) {
      _id
    }
  }
`;
