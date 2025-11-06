import { gql } from '@apollo/client';

export const GET_USER_NOTIFICATIONS = gql`
  query GetUserNotifications(
    $userId: String!
    $input: QueryNotificationInput!
  ) {
    user(input: { id: $userId }) {
      id
      name
      notifications(input: $input) {
        id
        title
        body
        isRead
        navigation
      }
    }
  }
`;

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation ReadNotification($input: MutationReadNotificationInput!) {
    readNotification(input: $input) {
      success
      message
    }
  }
`;
