import { NotificationToast } from 'components/NotificationToast/NotificationToast';

/** 
  This function is used to handle api errors in the application.
  It takes in the error object and displays the error message to the user.
  If the error is due to the Talawa API being unavailable, it displays a custom message. And for other error cases, it is using regular expression (case-insensitive) to match and show valid messages
*/

export const errorHandler = (a: unknown, error: unknown): void => {
  if (error instanceof Error) {
    const errorMessage = error.message;

    if (errorMessage === 'Failed to fetch') {
      toast.error(tErrors('talawaApiUnavailable'));
    } else if (errorMessage.match(/value is not a valid phone number/i)) {
      toast.error(tErrors('invalidPhoneNumber'));
    } else if (errorMessage.match(/does not exist in "EducationGrade"/i)) {
      toast.error(tErrors('invalidEducationGrade'));
    } else if (errorMessage.match(/does not exist in "EmploymentStatus"/i)) {
      toast.error(tErrors('invalidEmploymentStatus'));
    } else if (errorMessage.match(/does not exist in "MaritalStatus"/i)) {
      toast.error(tErrors('invalidMaritalStatus'));
    } else if (errorMessage.match(/status code 400/i)) {
      toast.error(tErrors('error400'));
    } else if (errorMessage.match(/organization name already exists/i)) {
      toast.error(tErrors('organizationNameAlreadyExists'));
    } else if (errorMessage.match(/account.*locked/i)) {
      toast.error(tErrors('accountLocked'));
    } else {
      toast.error(errorMessage);
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
