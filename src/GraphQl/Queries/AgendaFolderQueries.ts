import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve agenda folders by event ID.
 *
 * @param eventId - The ID of the event for which folders are retrieved.
 * @returns List of agenda folders with their items for the specified event.
 */

export const AGENDA_FOLDER_LIST = gql`
  query AgendaFolderByEventId($eventId: ID!, $itemsFirst: Int = 30) {
    agendaFoldersByEventId(eventId: $eventId) {
      id
      name
      description
      sequence
      isDefaultFolder
      items(first: $itemsFirst) {
        edges {
          node {
            id
            name
            description
            sequence
            duration
            key
            folder {
              id
              name
            }
            url {
              id
              url
            }
            event {
              id
              name
            }
            category {
              id
              name
              description
            }
            creator {
              id
              name
            }
          }
        }
      }
      creator {
        id
        name
      }
    }
  }
`;
