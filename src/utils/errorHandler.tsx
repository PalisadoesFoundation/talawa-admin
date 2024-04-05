import type { TFunction } from 'react-i18next';
import { toast } from 'react-toastify';
/* 
  This function is used to handle api errors in the application.
  It takes in the error object and displays the error message to the user.
  If the error is due to the Talawa API being unavailable, it displays a custom message.
*/
export const errorHandler = (
  t: TFunction<'translation', string>,
<<<<<<< HEAD
  error: any,
=======
  error: any
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
): void => {
  if (error?.message === 'Failed to fetch') {
    toast.error(t('talawaApiUnavailable'));
  } else {
    toast.error(error?.message);
  }
};
