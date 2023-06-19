import React, { useState } from 'react';
import { TableCheckInInterface } from './types';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useMutation } from '@apollo/client';
import { MARK_CHECKIN } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';

export const TableRow = ({
  data,
  refetch,
}: {
  data: TableCheckInInterface;
  refetch: () => void;
}) => {
  const [allotedSeat, setAllotedSeat] = useState('');
  const [allotedRoom, setAllotedRoom] = useState('');

  const [checkInMutation] = useMutation(MARK_CHECKIN);

  const markCheckIn = () => {
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

  return (
    <>
      {data.checkIn !== null ? (
        <div>
          <Button variant="contained" disabled className="m-2 p-2">
            Checked In
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
