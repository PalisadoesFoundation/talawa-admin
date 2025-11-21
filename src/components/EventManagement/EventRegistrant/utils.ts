import { toast } from 'react-toastify';
import type { TFunction } from 'i18next';

type MutationVariables =
  | { userId: string; recurringEventInstanceId: string }
  | {
      userId: string;
      eventId: string;
    };

export const deleteRegistrantUtil = (
  userId: string,
  isRecurring: boolean,
  eventId: string | undefined,
  removeRegistrantMutation: (variables: {
    variables: MutationVariables;
  }) => Promise<unknown>,
  refreshData: () => void,
  checkedInUsers: string[],
  t: TFunction,
): Promise<void> => {
  if (!eventId) {
    return Promise.resolve();
  }

  if (checkedInUsers.includes(userId)) {
    toast.error(t('cannotUnregisterCheckedIn'));
    return Promise.resolve();
  }

  toast.warn(t('removingAttendee'));
  const removeVariables = isRecurring
    ? { userId, recurringEventInstanceId: eventId }
    : { userId, eventId: eventId };

  return removeRegistrantMutation({ variables: removeVariables })
    .then(() => {
      toast.success(t('attendeeRemovedSuccess'));
      refreshData();
    })
    .catch((err: unknown) => {
      toast.error(t('errorRemovingAttendee'));
      if (err instanceof Error) {
        toast.error(err.message);
      }
    });
};
