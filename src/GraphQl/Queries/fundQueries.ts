/*eslint-disable*/
import gql from 'graphql-tag';

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
  query GetFundraisingCampaignById($id: ID!) {
    getFundraisingCampaignById(id: $id) {
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
        }
      }
    }
  }
`;
