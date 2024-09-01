import React from 'react';
import type { InterfaceTableCheckIn } from './types';
import Button from '@mui/material/Button';
import { useMutation } from '@apollo/client';
import { MARK_CHECKIN } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import { generate } from '@pdfme/generator';
import { tagTemplate } from './tagTemplate';
import { useTranslation } from 'react-i18next';

/**
 * Component that represents a single row in the check-in table.
 * Allows users to mark themselves as checked in and download a tag if they are already checked in.
 *
 * @param data - The data for the current row, including user and event information.
 * @param refetch - Function to refetch the check-in data after marking a check-in.
 *
 * @returns JSX.Element - The rendered TableRow component.
 */
export const TableRow = ({
  data,
  refetch,
}: {
  data: InterfaceTableCheckIn;
  refetch: () => void;
}): JSX.Element => {
  const [checkInMutation] = useMutation(MARK_CHECKIN);
  const { t } = useTranslation('translation', { keyPrefix: 'checkIn' });

  /**
   * Marks the user as checked in for the event.
   * Displays success or error messages based on the result of the mutation.
   */
  const markCheckIn = (): void => {
    // as we do not want to clutter the UI currently with the same (only provide the most basic of operations)
    checkInMutation({
      variables: {
        userId: data.userId,
        eventId: data.eventId,
      },
    })
      .then(() => {
        toast.success(t('checkedInSuccessfully'));
        refetch();
      })
      .catch((err) => {
        toast.error(t('errorCheckingIn'));
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
    const inputs = [{ name: data.name }];
    const pdf = await generate({ template: tagTemplate, inputs });
    const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
    window.open(URL.createObjectURL(blob));
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
