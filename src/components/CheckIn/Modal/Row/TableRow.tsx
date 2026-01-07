/**
 * TableRow component for rendering a row in the Check-In table.
 *
 * This component provides functionality to:
 * - Mark a user as checked in for an event.
 * - Generate and download a PDF tag for the user.
 *
 * @remarks
 * - If the user is already checked in, the "Checked In" button is disabled, and a "Download Tag" button is displayed.
 * - If the user is not checked in, a "Check In" button is displayed.
 * - The component uses Apollo Client's `useMutation` hook to perform the check-in operation.
 * - The `generate` function from `@pdfme/generator` is used to create the PDF tag.
 * - Notifications are displayed using `react-toastify` for success, error, and pending states.
 *
 * @remarks
 * Example usage:
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
import { toast } from 'react-toastify';
import { generate } from '@pdfme/generator';
import { tagTemplate } from '../../tagTemplate';
import { useTranslation } from 'react-i18next';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import styles from './TableRow.module.css';

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
  const { t: tErrors } = useTranslation('errors');

  const markCheckIn = (): void => {
    const variables = data.isRecurring
      ? { userId: data.userId, recurringEventInstanceId: data.eventId }
      : { userId: data.userId, eventId: data.eventId };

    checkInMutation({
      variables: variables,
    })
      .then(() => {
        toast.success(t('checkedInSuccessfully') as string);
        refetch();
        // Call the callback to refresh data in parent component (EventRegistrants)
        onCheckInUpdate?.();
      })
      .catch((err) => {
        toast.error(t('errorCheckingIn') as string);
        toast.error(err.message);
      });
  };
  /**
   * Triggers a notification while generating and downloading a PDF tag.
   */
  const notify = (): Promise<void> =>
    toast.promise(generateTag, {
      pending: 'Generating pdf...',
      success: 'PDF generated successfully!',
      error: 'Error generating pdf!',
    });

  /**
   * Generates a PDF tag based on the provided data and opens it in a new tab.
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

      toast.success('PDF generated successfully!');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Error generating pdf: ${errorMessage}`);
    }
  };

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
      onReset={refetch}
    >
      {data.isCheckedIn ? (
        <div>
          <Button variant="contained" disabled className="m-2 p-2">
            Checked In
          </Button>
          <Button variant="contained" className="m-2 p-2" onClick={notify}>
            Download Tag
          </Button>
        </div>
      ) : (
        <Button onClick={markCheckIn} className={styles.buttonStyle}>
          Check In
        </Button>
      )}
    </ErrorBoundaryWrapper>
  );
};
