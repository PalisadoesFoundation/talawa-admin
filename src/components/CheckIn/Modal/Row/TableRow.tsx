/**
 * TableRow component for rendering a row in the Check-In table.
 *
 * This component provides functionality to:
 * - Mark a user as checked in for an event.
 * - Generate and download a PDF tag for the user.
 *
 * @param data - The data object containing user and event details with:
 *   - `userId`: The unique identifier for the user
 *   - `eventId`: The unique identifier for the event
 *   - `name`: The name of the user
 *   - `isCheckedIn`: Whether the user is currently checked in
 * @param refetch - A function to refetch the data after a mutation
 *
 * @returns A JSX element that displays buttons for checking in or downloading a tag
 *
 * @remarks
 * - If the user is already checked in, the "Checked In" button is disabled, and a "Download Tag" button is displayed
 * - If the user is not checked in, a "Check In" button is displayed
 * - The component uses Apollo Client's `useMutation` hook to perform the check-in operation
 * - The `generate` function from `@pdfme/generator` is used to create the PDF tag.
 * - Notifications are displayed using `NotificationToast` for success, error, and pending states.
 *
 * @example
 * ```tsx
 * <TableRow
 *   data={{
 *     userId: '123',
 *     eventId: '456',
 *     name: 'John Doe',
 *     isCheckedIn: false,
 *   }}
 *   refetch={() => fetchData()}
 * />
 * ```
 */
import React from 'react';
import type { InterfaceTableCheckIn } from 'types/CheckIn/interface';
import Button from '@mui/material/Button';
import { useMutation } from '@apollo/client';
import { MARK_CHECKIN } from 'GraphQl/Mutations/mutations';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { generate } from '@pdfme/generator';
import { tagTemplate } from '../../tagTemplate';
import { useTranslation } from 'react-i18next';

export const TableRow = ({
  data,
  refetch,
  onCheckInUpdate,
}: {
  data: InterfaceTableCheckIn;
  refetch: () => void;
  onCheckInUpdate?: () => void;
}): JSX.Element => {
  const [checkInMutation] = useMutation(MARK_CHECKIN);
  const { t } = useTranslation('translation', { keyPrefix: 'checkIn' });

  const markCheckIn = (): void => {
    const variables = data.isRecurring
      ? { userId: data.userId, recurringEventInstanceId: data.eventId }
      : { userId: data.userId, eventId: data.eventId };

    checkInMutation({
      variables: variables,
    })
      .then(() => {
        NotificationToast.success(t('checkedInSuccessfully') as string);
        refetch();
        // Call the callback to refresh data in parent component (EventRegistrants)
        onCheckInUpdate?.();
      })
      .catch((err) => {
        NotificationToast.error(t('errorCheckingIn') as string);
        NotificationToast.error(err.message);
      });
  };
  /**
   * Triggers a notification while generating and downloading a PDF tag.
   *
   * @returns A promise that resolves when the PDF is generated and opened.
   */
  const notify = async (): Promise<void> => {
    NotificationToast.info(t('generatingPdf') as string);
    await generateTag();
  };

  /**
   * Generates a PDF tag based on the provided data and opens it in a new tab.
   *
   * @returns A promise that resolves when the PDF is successfully generated and opened.
   */
  const generateTag = async (): Promise<void> => {
    try {
      const inputs = [];
      if (typeof data.name !== 'string' || !data.name.trim()) {
        throw new Error('Invalid or empty name provided');
      }
      inputs.push({ name: data.name.trim() });
      const pdf = await generate({ template: tagTemplate, inputs });
      const blob = new Blob([pdf.buffer as ArrayBuffer], {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(blob);
      window.open(url);

      NotificationToast.success(t('pdfGeneratedSuccessfully') as string);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : (t('unknownError') as string);
      NotificationToast.error(
        `${t('errorGeneratingPdf') as string}: ${errorMessage}`,
      );
    }
  };

  return (
    <>
      {data.isCheckedIn ? (
        <div>
          <Button variant="contained" disabled className="m-2 p-2">
            {t('checkedIn')}
          </Button>
          <Button variant="contained" className="m-2 p-2" onClick={notify}>
            {t('downloadTag')}
          </Button>
        </div>
      ) : (
        <Button
          sx={{
            backgroundColor: 'var(--bs-primary-bg-subtle)',
            color: 'var(--bs-body-color)',
          }}
          onClick={markCheckIn}
          className="m-2 p-2"
        >
          {t('checkInButton')}
        </Button>
      )}
    </>
  );
};
