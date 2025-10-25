import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve action item categories by organization.
 *
 * @param organizationId - The ID of the organization for which action item categories are being retrieved.
 * @param orderBy - Sort action items Latest/Earliest first.
 * @param actionItemCategory_id - Filter action items belonging to an action item category.
 * @param event_id - Filter action items belonging to an event.
 * @param is_completed - Filter all the completed action items.
 * @returns The list of action item categories associated with the organization.
 */

export const ACTION_ITEM_LIST = gql`
  query ActionItemsByOrganization(
    $input: QueryActionItemsByOrganizationInput!
  ) {
    actionItemsByOrganization(input: $input) {
      id
      volunteer {
        id
        hasAccepted
        isPublic
        hoursVolunteered
        user {
          id
          name
          avatarURL
        }
      }
      volunteerGroup {
        id
        name
        description
        volunteersRequired
        leader {
          id
          name
          avatarURL
        }
        volunteers {
          id
          user {
            id
            name
          }
        }
      }
      category {
        id
        name
      }
      event {
        id
        name
      }
      recurringEventInstance {
        id
        name
      }
      organization {
        id
        name
      }
      creator {
        id
        name
      }
      updater {
        id
        name
      }
      assignedAt
      completionAt
      createdAt
      isCompleted
      preCompletionNotes
      postCompletionNotes
      isInstanceException
      isTemplate
    }
  }
`;

export const GET_EVENT_ACTION_ITEMS = gql`
  query GetEventActionItems($input: QueryEventInput!) {
    event(input: $input) {
      id
      recurrenceRule {
        id
      }
      baseEvent {
        id
      }
      actionItems(first: 20) {
        edges {
          node {
            id
            isCompleted
            assignedAt
            preCompletionNotes
            postCompletionNotes
            isInstanceException
            isTemplate
            creator {
              id
              name
            }
            event {
              id
              name
            }
            recurringEventInstance {
              id
              name
            }
            volunteer {
              id
              hasAccepted
              isPublic
              hoursVolunteered
              user {
                id
                name
              }
            }
            volunteerGroup {
              id
              name
              description
              volunteersRequired
              leader {
                id
                name
              }
            }
            category {
              id
              name
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
