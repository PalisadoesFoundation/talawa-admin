import React from 'react';
import type { InterfaceTableCheckIn } from './types';
import Button from '@mui/material/Button';
import { useMutation } from '@apollo/client';
import { MARK_CHECKIN } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import { generate } from '@pdfme/generator';
import { tagTemplate } from './tagTemplate';

export const TableRow = ({
  data,
  refetch,
}: {
  data: InterfaceTableCheckIn;
  refetch: () => void;
}): JSX.Element => {
  const [checkInMutation] = useMutation(MARK_CHECKIN);

  const markCheckIn = (): void => {
    // as we do not want to clutter the UI currently with the same (only provide the most basic of operations)
    checkInMutation({
      variables: {
        userId: data.userId,
        eventId: data.eventId,
      },
    })
      .then(() => {
        toast.success('Checked in successfully!');
        refetch();
      })
      .catch((err) => {
        toast.error('There was an error in checking in!');
        toast.error(err.message);
      });
  };

  const notify = (): Promise<void> =>
    toast.promise(generateTag, {
      pending: 'Generating pdf...',
      success: 'PDF generated successfully!',
      error: 'Error generating pdf!',
    });
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
