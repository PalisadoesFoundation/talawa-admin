import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve agenda category by id.
 *
 * @param agendaCategoryId - The ID of the category which is being retrieved.
 * @returns Agenda category associated with the id.
 */

export const AGENDA_FOLDER_LIST = gql`
  query AgendaFolderByEventId($eventId: ID!) {
    agendaFoldersByEventId(eventId: $eventId) {
      id
      name
      description
      sequence
      isDefaultFolder
      items(first: 10) {
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
