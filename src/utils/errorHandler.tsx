import type { TFunction } from 'react-i18next';
import { toast } from 'react-toastify';
import i18n from './i18n';
/** 
  This function is used to handle api errors in the application.
  It takes in the error object and displays the error message to the user.
  If the error is due to the Talawa API being unavailable, it displays a custom message.
*/
export const errorHandler = (a: unknown, error: unknown): void => {
  const tErrors = i18n.getFixedT(
    null,
    'errors',
  ) as unknown as TFunction<string>;
  if (error instanceof Error) {
    switch (error.message) {
      case 'Failed to fetch':
        toast.error(tErrors('talawaApiUnavailable'));
        break;
      // Add more cases as needed
      default:
        toast.error(error.message);
    }
  } else {
    toast.error(tErrors('unknownError', { msg: error }));
  }
};
