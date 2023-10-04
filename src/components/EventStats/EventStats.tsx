import React from 'react';
import { Modal } from 'react-bootstrap';
import { FeedbackStats } from './Statistics/Feedback';
import { ReviewStats } from './Statistics/Review';
import { AverageRating } from './Statistics/AverageRating';
import Stack from '@mui/material/Stack';

type ModalPropType = {
  show: boolean;
  eventId: string;
  handleClose: () => void;
};

export const EventStats = ({
  show,
  handleClose,
  eventId,
}: ModalPropType): JSX.Element => {
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
        size="lg"
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Event Statistics</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack direction="row" spacing={2}>
            <FeedbackStats eventId={eventId} />
            <div>
              <ReviewStats eventId={eventId} />
              <AverageRating eventId={eventId} />
            </div>
          </Stack>
        </Modal.Body>
      </Modal>
    </>
  );
};
