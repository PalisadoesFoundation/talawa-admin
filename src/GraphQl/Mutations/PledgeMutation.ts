import gql from 'graphql-tag';

/**
 * GraphQL mutation to create a pledge.
 *
 * @param campaignId - The ID of the campaign the pledge is associated with.
 * @param amount - The amount of the pledge.
 * @param pledgerId - The ID of the pledger associated with the pledge.
 * @param note - A note associated with the pledge.
 * @returns The details of the created pledge.
 */
export const CREATE_PLEDGE = gql`
  mutation CreateFundCampaignPledge(
    $campaignId: ID!
    $amount: Int!
    $pledgerId: ID!
    $note: String
  ) {
    createFundCampaignPledge(
      input: {
        campaignId: $campaignId
        amount: $amount
        pledgerId: $pledgerId
        note: $note
      }
    ) {
      id
      amount
      note
      createdAt
      updatedAt
      campaign {
        id
        name
      }
      pledger {
        id
        name
      }
    }
  }
`;

/**
 * GraphQL mutation to update a pledge.
 *
 * @param id - The ID of the pledge being updated.
 * @param amount - The amount of the pledge.
 * @returns The details of the updated pledge.
 */
export const UPDATE_PLEDGE = gql`
  mutation UpdateFundCampaignPledge($id: ID!, $amount: Int) {
    updateFundCampaignPledge(input: { id: $id, amount: $amount }) {
      id
      amount
      note
      createdAt
      updatedAt
      campaign {
        id
        name
      }
      pledger {
        id
        name
      }
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
    deleteFundCampaignPledge(input: { id: $id }) {
      id
    }
  }
`;
