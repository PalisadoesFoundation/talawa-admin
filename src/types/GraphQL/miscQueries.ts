/**
 * @file miscQueries.ts
 * @description Defines TypeScript interfaces for miscellaneous GraphQL query and mutation results.
 */

export interface IActionItemCategoryResult {
  actionItemCategory: {
    id: string;
    name: string;
  };
}

export interface IVenueListResult {
  organization: {
    venues: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          description?: string | null;
          capacity: number;
        };
      }>;
    };
  };
}

export interface IVerifyEventInvitationResult {
  verifyEventInvitation: {
    invitationToken: string;
    eventId: string;
    organizationId: string;
  };
}

export interface IAcceptEventInvitationResult {
  acceptEventInvitation: {
    id: string;
  };
}
