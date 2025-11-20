import { toast } from 'react-toastify';
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
): Promise<void> => {
  if (!eventId) {
    return Promise.resolve();
  }

  if (checkedInUsers.includes(userId)) {
    toast.error('Cannot unregister a user who has already checked in');
    return Promise.resolve();
  }

  toast.warn('Removing the attendee...');
  const removeVariables = isRecurring
    ? { userId, recurringEventInstanceId: eventId }
    : { userId, eventId: eventId };

  return removeRegistrantMutation({ variables: removeVariables })
    .then(() => {
      toast.success('Attendee removed successfully');
      refreshData();
    })
    .catch((err) => {
      toast.error('Error removing attendee');
      toast.error(err.message);
    });
};
