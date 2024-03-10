/*eslint-disable */
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
