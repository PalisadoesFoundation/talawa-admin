import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve action item categories by organization.
 *
 * @param organizationId - The ID of the organization for which action item categories are being retrieved.
 * @returns The list of action item categories associated with the organization.
 */

export const ACTION_ITEM_LIST = gql`
  query ActionItemsByOrganization($organizationId: ID!) {
    actionItemsByOrganization(organizationId: $organizationId) {
      _id
      assignee {
        _id
        firstName
        lastName
      }
      assigner {
        _id
        firstName
        lastName
      }
      actionItemCategory {
        _id
        name
      }
      preCompletionNotes
      postCompletionNotes
      assignmentDate
      dueDate
      completionDate
      isCompleted
      event {
        _id
        title
      }
      creator {
        _id
        firstName
        lastName
      }
    }
  }
`;
