import { ApolloError } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

/** 
  This function is used to handle api errors in the application.
  It takes in the error object and displays the error message to the user.
  If the error is due to the Talawa API being unavailable, it displays a custom message. And for other error cases, it is using regular expression (case-insensitive) to match and show valid messages
*/

export const errorHandler = (a: unknown, error: unknown): void => {
  // Handle Apollo GraphQL errors first
  if (error instanceof ApolloError) {
    const graphQLError = error.graphQLErrors?.[0];
    if (graphQLError) {
      const extensions = graphQLError.extensions as {
        code?: string;
        issues?: Array<{ message: string }>;
      };

      // Check for forbidden action with specific issue message
      if (
        extensions?.code ===
          'forbidden_action_on_arguments_associated_resources' &&
        extensions?.issues?.[0]?.message
      ) {
        NotificationToast.error(extensions.issues[0].message);
        return;
      }

      // Check for account locked error
      if (extensions?.code === 'account_locked') {
        NotificationToast.error({
          key: 'accountLocked',
          namespace: 'errors',
        });
        return;
      }

      // Use the GraphQL error message for other cases
      NotificationToast.error(graphQLError.message);
      return;
    }

    // Handle network errors
    if (error.networkError) {
      NotificationToast.error({
        key: 'talawaApiUnavailable',
        namespace: 'errors',
      });
      return;
    }
  }

  if (error instanceof Error) {
    const errorMessage = error.message;

    if (errorMessage === 'Failed to fetch') {
      NotificationToast.error({
        key: 'talawaApiUnavailable',
        namespace: 'errors',
      });
      return;
    }

    if (/value is not a valid phone number/i.test(errorMessage)) {
      NotificationToast.error({
        key: 'invalidPhoneNumber',
        namespace: 'errors',
      });
      return;
    }

    if (/does not exist in "EducationGrade"/i.test(errorMessage)) {
      NotificationToast.error({
        key: 'invalidEducationGrade',
        namespace: 'errors',
      });
      return;
    }

    if (/does not exist in "EmploymentStatus"/i.test(errorMessage)) {
      NotificationToast.error({
        key: 'invalidEmploymentStatus',
        namespace: 'errors',
      });
      return;
    }

    if (/does not exist in "MaritalStatus"/i.test(errorMessage)) {
      NotificationToast.error({
        key: 'invalidMaritalStatus',
        namespace: 'errors',
      });
      return;
    }

    if (/status code 400/i.test(errorMessage)) {
      NotificationToast.error({
        key: 'error400',
        namespace: 'errors',
      });
      return;
    }

    if (/organization name already exists/i.test(errorMessage)) {
      NotificationToast.error({
        key: 'organizationNameAlreadyExists',
        namespace: 'errors',
      });
      return;
    }

    if (/account.*locked/i.test(errorMessage)) {
      NotificationToast.error({
        key: 'accountLocked',
        namespace: 'errors',
      });
      return;
    }

    NotificationToast.error(errorMessage);
    return;
  }

  NotificationToast.error({
    key: 'unknownError',
    namespace: 'errors',
    values: {
      msg: typeof error === 'string' ? error : JSON.stringify(error),
    },
  });
};
