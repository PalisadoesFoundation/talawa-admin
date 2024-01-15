import gql from 'graphql-tag';

/**
 * GraphQL mutation to update an event project task.
 *
 * @param title - The updated title of the task.
 * @param description - The updated description of the task.
 * @param taskId - The ID of the task to be updated.
 * @param deadline - The updated deadline for the task.
 * @param completed - The updated completion status of the task.
 * @returns The updated task object.
 */

export const UPDATE_EVENT_PROJECT_TASK_MUTATION = gql`
  mutation UpdateEventTask(
    $title: String!
    $description: String!
    $taskId: ID!
    $deadline: DateTime!
    $completed: Boolean!
  ) {
    updateTask(
      id: $taskId
      data: {
        title: $title
        description: $description
        deadline: $deadline
        completed: $completed
      }
    ) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to delete an event project task.
 *
 * @param id - The ID of the task to be deleted.
 * @returns The deleted task object.
 */

export const DELETE_EVENT_TASK_MUTATION = gql`
  mutation DeleteTask($id: ID!) {
    removeTask(id: $id) {
      _id
    }
  }
`;

/**
 * GraphQL mutation to set volunteers for an event project task.
 *
 * @param id - The ID of the task for which volunteers are being set.
 * @param volunteers - An array of user IDs representing the volunteers for the task.
 * @returns The updated task object with the assigned volunteers.
 */

export const SET_TASK_VOLUNTEERS_MUTATION = gql`
  mutation SetTaskVolunteers($id: ID!, $volunteers: [ID]!) {
    setTaskVolunteers(id: $id, volunteers: $volunteers) {
      _id
    }
  }
`;
