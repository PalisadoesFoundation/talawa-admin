import gql from 'graphql-tag';

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

export const DELETE_EVENT_TASK_MUTATION = gql`
  mutation DeleteTask($id: ID!) {
    removeTask(id: $id) {
      _id
    }
  }
`;

export const SET_TASK_VOLUNTEERS_MUTATION = gql`
  mutation SetTaskVolunteers($id: ID!, $volunteers: [ID]!) {
    setTaskVolunteers(id: $id, volunteers: $volunteers) {
      _id
    }
  }
`;
