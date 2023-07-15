import React, { useState } from 'react';
import type { InterfaceTableCheckIn } from './types';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
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
  const [allotedSeat, setAllotedSeat] = useState('');
  const [allotedRoom, setAllotedRoom] = useState('');

  const [checkInMutation] = useMutation(MARK_CHECKIN);

  const markCheckIn = (): void => {
    if (allotedSeat === '')
      toast.warning('You have not alloted any seat to the attendee!');
    if (allotedRoom === '')
      toast.warning('You have not alloted any room to the attendee!');

    checkInMutation({
      variables: {
        userId: data.userId,
        eventId: data.eventId,
        allotedSeat,
        allotedRoom,
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

  const generateTag = (): void => {
    toast.warning('Generating pdf...');
    const inputs = [{ greeting: 'Hi!', name: 'John Doe' }];

    generate({ template: tagTemplate, inputs }).then((pdf) => {
      toast.success('PDF generated successfully!');
      const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
      window.open(URL.createObjectURL(blob));
    });
  };

  return (
    <>
      {data.checkIn !== null ? (
        <div>
          <Button variant="contained" disabled className="m-2 p-2">
            Checked In
          </Button>
          <Button variant="contained" className="m-2 p-2" onClick={generateTag}>
            Download Tag
          </Button>
          {data.checkIn.allotedRoom} {data.checkIn.allotedSeat}{' '}
          {data.checkIn.time}
        </div>
      ) : (
        <Box component="form" noValidate autoComplete="off" className="m-2 p-2">
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={4}
          >
            <div>
              <TextField
                id="allotedRoom"
                label="Alloted Room"
                variant="outlined"
                size="small"
                className="py-1 my-1"
                onChange={(e) => setAllotedRoom(e.target.value)}
              />
              <TextField
                id="allotedSeat"
                label="Alloted Seat"
                variant="outlined"
                size="small"
                className="py-1 my-1"
                onChange={(e) => setAllotedSeat(e.target.value)}
              />
            </div>
            <div>
              <Button variant="contained" color="success" onClick={markCheckIn}>
                Check In!
              </Button>
            </div>
          </Stack>
        </Box>
      )}
    </>
  );
};
