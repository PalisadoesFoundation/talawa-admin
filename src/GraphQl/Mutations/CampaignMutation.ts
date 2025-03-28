import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a new fund Campaign.
 *
 * @param name - The name of the fund.
 * @param fundId - The fund ID the campaign is associated with.
 * @param goalAmount - The funding goal of the campaign.
 * @param startAt - The start date of the campaign.
 * @param endAt - The end date of the campaign.
 * @param currencyCode - The currency of the campaign.
 * @returns The ID of the created campaign.
 */

export const CREATE_CAMPAIGN_MUTATION = gql`
  mutation createFundCampaign(
    $name: String!
    $fundId: ID!
    $goalAmount: Int!
    $startAt: DateTime!
    $endAt: DateTime!
    $currencyCode: Iso4217CurrencyCode!
  ) {
    createFundCampaign(
      input: {
        fundId: $fundId
        name: $name
        goalAmount: $goalAmount
        startAt: $startAt
        endAt: $endAt
        currencyCode: $currencyCode
      }
    ) {
      id
    }
  }
`;

/**
 * GraphQL mutation to update a fund Campaign.
 *
 * @param id - The ID of the campaign being updated.
 * @param name - The name of the campaign.
 * @param goalAmount - The funding goal of the campaign.
 * @param startAt - The start date of the campaign.
 * @param endAt - The end date of the campaign.
 * @param currencyCode - The currency of the campaign.
 * @returns The ID of the updated campaign.
 */

export const UPDATE_CAMPAIGN_MUTATION = gql`
  mutation updateFundCampaign($input: MutationUpdateFundCampaignInput!) {
    updateFundCampaign(input: $input) {
      id
    }
  }
`;
