type TFunction = (key: string, options?: Record<string, unknown>) => string;

import { toast } from 'react-toastify';
import i18n from './i18n';
/** 
  This function is used to handle api errors in the application.
  It takes in the error object and displays the error message to the user.
  If the error is due to the Talawa API being unavailable, it displays a custom message.
*/
export const errorHandler = (a: unknown, error: unknown): void => {
  const tErrors: TFunction = i18n.getFixedT(null, 'errors');
  if (error instanceof Error) {
    const errorMessage = error.message;
    switch (true) {
      case errorMessage === 'Failed to fetch':
        toast.error(tErrors('talawaApiUnavailable'));
        break;
      case errorMessage.includes('Value is not a valid phone number'):
        toast.error(tErrors('invalidPhoneNumber'));
        break;
      case errorMessage.includes('does not exist in "EducationGrade"'):
        toast.error(tErrors('invalidEducationGrade'));
        break;
      case errorMessage.includes('does not exist in "EmploymentStatus"'):
        toast.error(tErrors('invalidEmploymentStatus'));
        break;
      case errorMessage.includes('does not exist in "MaritalStatus"'):
        toast.error(tErrors('invalidMaritalStatus'));
        break;
      default:
        toast.error(errorMessage);
    }
  } else {
    toast.error(tErrors('unknownError', { msg: error }) as string);
  }
};
