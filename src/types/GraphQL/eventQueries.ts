/**
 * @file eventQueries.ts
 * @description Defines TypeScript interfaces for event-related GraphQL query and mutation results.
 */

export interface IOrganizationEventsResult {
  organization: {
    events: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          description: string;
          startAt: string;
          endAt: string;
          allDay: boolean;
          location: string | null;
          isPublic: boolean;
          isRegisterable: boolean;
          isRecurringEventTemplate: boolean;
          baseEvent?: { id: string } | null;
          sequenceNumber?: number;
          totalCount?: number;
          hasExceptions?: boolean;
          progressLabel?: string;
          recurrenceDescription?: string;
          recurrenceRule?: { id: string; frequency: string } | null;
          creator: { id: string; name: string };
        };
      }>;
    };
  };
}
