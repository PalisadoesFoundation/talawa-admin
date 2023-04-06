import { TFunction } from 'react-i18next';
import { toast } from 'react-toastify';

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
