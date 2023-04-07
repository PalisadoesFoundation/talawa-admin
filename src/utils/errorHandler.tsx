import { TFunction } from 'react-i18next';
import { toast } from 'react-toastify';
/* 
  This function is used to handle api errors in the application.
  It takes in the error object and displays the error message to the user.
  If the error is due to the Talawa API being unavailable, it displays a custom message.
*/
export const errorHandler = (
  t: TFunction<'translation', string>,
  error: any
) => {
  if (error?.message === 'Failed to fetch') {
    toast.error(t('talawaApiUnavailable'));
  } else {
    toast.error(error?.message);
  }
};
