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

  const markCheckIn = (): void => {
    checkInMutation({
      variables: {
        userId: data.userId,
        eventId: data.eventId,
      },
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

  const notify = (): Promise<void> =>
    toast.promise(generateTag, {
      pending: t('generatingPdf') || 'Generating PDF...',
      success: t('pdfGenerated') || 'PDF generated successfully!',
      error: t('pdfGenerationError') || 'Error generating PDF!',
    });

  const generateTag = async (): Promise<void> => {
    try {
      if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
        throw new Error(t('invalidName') || 'Invalid or empty name provided');
      }

      const inputs: Record<string, string>[] = [{ name: data.name.trim() }];

      const pdf = await generate({ template: tagTemplate, inputs });

      const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      toast.error(`${t('pdfGenerationError')}: ${errorMessage}`);
    }
  };

  return (
    <>
      {data.checkIn !== null ? (
        <div>
          <Button variant="contained" disabled className="m-2 p-2">
            {t('checkedIn') || 'Checked In'}
          </Button>
          <Button variant="contained" className="m-2 p-2" onClick={notify}>
            {t('downloadTag') || 'Download Tag'}
          </Button>
        </div>
      ) : (
        <Button
          variant="contained"
          color="success"
          onClick={markCheckIn}
          className="m-2 p-2"
        >
          {t('checkIn') || 'Check In'}
        </Button>
      )}
    </>
  );
};
