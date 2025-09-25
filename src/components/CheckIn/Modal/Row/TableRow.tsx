/**
 * TableRow component for rendering a row in the Check-In table.
 *
 * This component provides functionality to:
 * - Mark a user as checked in for an event.
 * - Generate and download a PDF tag for the user.
 *
 * @param data - The data object containing user and event details.
 * @param data.userId - The unique identifier for the user.
 * @param data.eventId - The unique identifier for the event.
 * @param data.name - The name of the user.
 * @param data.checkIn - The check-in status of the user.
 * @param refetch - A function to refetch the data after a mutation.
 *
 * @returns A JSX element that displays buttons for checking in or downloading a tag.
 *
 * @remarks
 * - If the user is already checked in, the "Checked In" button is disabled, and a "Download Tag" button is displayed.
 * - If the user is not checked in, a "Check In" button is displayed.
 * - The component uses Apollo Client's `useMutation` hook to perform the check-in operation.
 * - The `generate` function from `@pdfme/generator` is used to create the PDF tag.
 * - Notifications are displayed using `react-toastify` for success, error, and pending states.
 *
 * @example
 * ```tsx
 * <TableRow
 *   data={{
 *     userId: '123',
 *     eventId: '456',
 *     name: 'John Doe',
 *     checkIn: null,
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

export const TableRow = ({
  data,
  refetch,
}: {
  data: InterfaceTableCheckIn;
  refetch: () => void;
}): JSX.Element => {
  const [checkInMutation] = useMutation(MARK_CHECKIN);
  const { t } = useTranslation('translation', { keyPrefix: 'checkIn' });

  const markCheckIn = (): void => {
    checkInMutation({
      variables: { userId: data.userId, eventId: data.eventId },
    })
      .then(() => {
        toast.success(t('checkedInSuccessfully') as string);
        refetch();
      })
      .catch((err) => {
        toast.error(t('errorCheckingIn') as string);
        toast.error(err.message);
      });
  };
  /**
   * Triggers a notification while generating and downloading a PDF tag.
   *
   * @returns A promise that resolves when the PDF is generated and opened.
   */
  const notify = (): Promise<void> =>
    toast.promise(generateTag, {
      pending: 'Generating pdf...',
      success: 'PDF generated successfully!',
      error: 'Error generating pdf!',
    });

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
      const blob = new Blob([new Uint8Array(pdf.buffer as ArrayBuffer)], {
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
    <>
      {data.checkIn !== null ? (
        <div>
          <Button variant="contained" disabled className="m-2 p-2">
            Checked In
          </Button>
          <Button variant="contained" className="m-2 p-2" onClick={notify}>
            Download Tag
          </Button>
        </div>
      ) : (
        <Button
          variant="contained"
          color="success"
          onClick={markCheckIn}
          className="m-2 p-2"
        >
          Check In
        </Button>
      )}
    </>
  );
};
