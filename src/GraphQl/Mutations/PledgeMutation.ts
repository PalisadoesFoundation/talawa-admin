import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a pledge.
 *
 * @param campaignId - The ID of the campaign the pledge is associated with.
 * @param amount - The amount of the pledge.
 * @param currency - The currency of the pledge.
 * @param startDate - The start date of the pledge.
 * @param endDate - The end date of the pledge.
 * @param userIds - The IDs of the users associated with the pledge.
 * @returns The ID of the created pledge.
 */
export const CREATE_PlEDGE = gql`
  mutation CreateFundraisingCampaignPledge(
    $campaignId: ID!
    $amount: Float!
    $currency: Currency!
    $startDate: Date!
    $endDate: Date!
    $userIds: [ID!]!
  ) {
    createFundraisingCampaignPledge(
      data: {
        campaignId: $campaignId
        amount: $amount
        currency: $currency
        startDate: $startDate
        endDate: $endDate
        userIds: $userIds
      }
    ) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to update a pledge.
 *
 * @param id - The ID of the pledge being updated.
 * @param amount - The amount of the pledge.
 * @param currency - The currency of the pledge.
 * @param startDate - The start date of the pledge.
 * @param endDate - The end date of the pledge.
 * @returns The ID of the updated pledge.
 */
export const UPDATE_PLEDGE = gql`
  mutation UpdateFundraisingCampaignPledge(
    $id: ID!
    $amount: Float
    $currency: Currency
    $startDate: Date
    $endDate: Date
  ) {
    updateFundraisingCampaignPledge(
      id: $id
      data: {
        amount: $amount
        currency: $currency
        startDate: $startDate
        endDate: $endDate
      }
    ) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to delete a pledge.
 *
 * @param id - The ID of the pledge being deleted.
 * @returns Whether the pledge was successfully deleted.
 */
export const DELETE_PLEDGE = gql`
  mutation DeleteFundraisingCampaignPledge($id: ID!) {
    removeFundraisingCampaignPledge(id: $id) {
      _id
    }
  }
`;
