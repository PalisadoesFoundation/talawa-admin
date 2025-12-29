type TFunction = (key: string, options?: Record<string, unknown>) => string;

import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import i18n from './i18n';
/** 
  This function is used to handle api errors in the application.
  It takes in the error object and displays the error message to the user.
  If the error is due to the Talawa API being unavailable, it displays a custom message. And for other error cases, it is using regular expression (case-insensitive) to match and show valid messages
*/
export const errorHandler = (a: unknown, error: unknown): void => {
  const tErrors: TFunction = i18n.getFixedT(null, 'errors');
  if (error instanceof Error) {
    const errorMessage = error.message;
    if (errorMessage === 'Failed to fetch') {
      NotificationToast.error(tErrors('talawaApiUnavailable'));
    } else if (errorMessage.match(/value is not a valid phone number/i)) {
      NotificationToast.error(tErrors('invalidPhoneNumber'));
    } else if (errorMessage.match(/does not exist in "EducationGrade"/i)) {
      NotificationToast.error(tErrors('invalidEducationGrade'));
    } else if (errorMessage.match(/does not exist in "EmploymentStatus"/i)) {
      NotificationToast.error(tErrors('invalidEmploymentStatus'));
    } else if (errorMessage.match(/does not exist in "MaritalStatus"/i)) {
      NotificationToast.error(tErrors('invalidMaritalStatus'));
    } else if (errorMessage.match(/status code 400/i)) {
      NotificationToast.error(tErrors('error400'));
    } else if (errorMessage.match(/organization name already exists/i)) {
      NotificationToast.error(tErrors('organizationNameAlreadyExists'));
    } else {
      NotificationToast.error(errorMessage);
    }
  } else {
    NotificationToast.error(tErrors('unknownError', { msg: error }) as string);
  }
};
