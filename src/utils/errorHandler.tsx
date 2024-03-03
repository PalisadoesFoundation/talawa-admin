import type { TFunction } from 'react-i18next';
import { toast } from 'react-toastify';
/* 
  This function is used to handle api errors in the application.
  It takes in the error object and displays the error message to the user.
  If the error is due to the Talawa API being unavailable, it displays a custom message.
*/
export const errorHandler = (
  t: TFunction<'translation', string>,
  error: any,
): void => {
  if (error?.message === 'Failed to fetch') {
    toast.error(t('talawaApiUnavailable'));
  } else if (error?.message === 'User not found') {
    console.log('User Not Found In else if ');
    toast.error(t('notFound'));
  } else {
    console.log('User Not Found In only else');
    console.log('error?.message', error?.message);
    toast.error(error?.message);
  }
};
