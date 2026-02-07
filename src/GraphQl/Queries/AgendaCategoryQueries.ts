import { gql } from '@apollo/client';

/**
 * GraphQL query to retrieve agenda category by id.
 *
 * @param agendaCategoryId - The ID of the category which is being retrieved.
 * @returns Agenda category associated with the id.
 */

export const AGENDA_ITEM_CATEGORY_LIST = gql`
  query AgendaCategoriesByEventId($eventId: ID!) {
    agendaCategoriesByEventId(eventId: $eventId) {
      id
      name
      description
      creator {
        id
        name
      }
    }
  }
`;
