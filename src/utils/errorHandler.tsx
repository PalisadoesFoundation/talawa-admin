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
    if (errorMessage === 'Failed to fetch') {
      toast.error(tErrors('talawaApiUnavailable'));
    } else if (errorMessage.includes('Value is not a valid phone number')) {
      toast.error(tErrors('invalidPhoneNumber'));
    } else if (errorMessage.includes('does not exist in "EducationGrade"')) {
      toast.error(tErrors('invalidEducationGrade'));
    } else if (errorMessage.includes('does not exist in "EmploymentStatus"')) {
      toast.error(tErrors('invalidEmploymentStatus'));
    } else if (errorMessage.includes('does not exist in "MaritalStatus"')) {
      toast.error(tErrors('invalidMaritalStatus'));
    } else if (errorMessage.includes('status code 400')) {
      toast.error(tErrors('error400'));
    } else {
      console.log(errorMessage); // log error for debugging
      toast.error(tErrors('defaultError'));
    }
  } else {
    toast.error(tErrors('unknownError', { msg: error }) as string);
  }
};
