/**
 * @file fundQueries.ts
 * @description Defines TypeScript interfaces for fund and campaign-related GraphQL query results.
 */

export interface ICampaignEdge {
  node: {
    id: string;
    name: string;
    currencyCode: string;
    goalAmount: number;
    startAt: string;
    endAt: string;
  };
}

export interface IFundEdge {
  node: {
    campaigns?: {
      edges: ICampaignEdge[];
    };
  };
}

export interface IUserFundCampaignsResult {
  organization: {
    funds: {
      edges: IFundEdge[];
    };
  };
}

export interface IDonationConnectionResult {
  getDonationByOrgIdConnection: Array<{
    _id: string;
    nameOfUser: string;
    amount: number;
    userId: string;
    payPalId: string;
    updatedAt: string;
  }>;
}

export interface IFundCampaignResult {
  fund: {
    id: string;
    name: string;
    campaigns: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          currencyCode: string;
          goalAmount: number;
          startAt: string;
          endAt: string;
        };
      }>;
    };
  };
}

export interface IFundListResult {
  organization: {
    funds: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          isTaxDeductible: boolean;
          isArchived: boolean;
          createdAt: string;
          creator?: {
            name: string;
          } | null;
          organization?: {
            name: string;
          } | null;
          updater?: {
            name: string;
          } | null;
        };
      }>;
    };
  };
}

export interface IFundCampaignPledgeResult {
  fundCampaign: {
    id: string;
    name: string;
    goalAmount: number;
    currencyCode: string;
    startAt: string;
    endAt: string;
    pledges: {
      edges: Array<{
        node: {
          id: string;
          amount: number;
          endDate: string;
          pledger: {
            id: string;
            name: string;
            avatarURL?: string | null;
          };
        };
      }>;
    };
    totalPledged: number;
    totalRaised: number;
  };
}
