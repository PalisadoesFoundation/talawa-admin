import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from '@mui/material';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from '../../style/app.module.css';
import { CustomTableCell } from './customTableCell';
/**
 * Modal component to display paginated list of events attended by a member
 * @param eventsAttended - Array of events attended by the member
 * @param setShow - Function to control modal visibility
 * @param show - Boolean to control modal visibility
 * @param eventsPerPage - Number of events to display per page
 * @returns Modal component with paginated events list
 */
interface InterfaceEvent {
  _id: string;
  name: string;
  date: string;
  isRecurring: boolean;
  attendees: number;
}

interface InterfaceEventsAttendedMemberModalProps {
  eventsAttended: InterfaceEvent[];
  setShow: (show: boolean) => void;
  show: boolean;
  eventsPerPage?: number;
}

const EventsAttendedMemberModal: React.FC<
  InterfaceEventsAttendedMemberModalProps
> = ({ eventsAttended, setShow, show, eventsPerPage = 5 }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'memberDetail',
  });
  const [page, setPage] = useState<number>(1);

  const handleClose = (): void => {
    setShow(false);
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number,
  ): void => {
    setPage(newPage);
  };

  const totalPages = useMemo(
    () => Math.ceil(eventsAttended.length / eventsPerPage),
    [eventsAttended.length, eventsPerPage],
  );

  const paginatedEvents = useMemo(
    () =>
      eventsAttended.slice((page - 1) * eventsPerPage, page * eventsPerPage),
    [eventsAttended, page, eventsPerPage],
  );

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Events Attended List</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {eventsAttended.length === 0 ? (
          <p>{t('noeventsAttended')}</p>
        ) : (
          <>
            <h5 className="text-end">
              Showing {(page - 1) * eventsPerPage + 1} -{' '}
              {Math.min(page * eventsPerPage, eventsAttended.length)} of{' '}
              {eventsAttended.length} Events
            </h5>
            <TableContainer component={Paper} className="mt-3">
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow data-testid="row">
                    <TableCell className={styles.customcell}>
                      Event Name
                    </TableCell>
                    <TableCell className={styles.customcell}>
                      Date of Event
                    </TableCell>
                    <TableCell className={styles.customcell}>
                      Recurring Event
                    </TableCell>
                    <TableCell className={styles.customcell}>
                      Attendees
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedEvents.map((event) => (
                    <CustomTableCell key={event._id} eventId={event._id} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="d-flex justify-content-center mt-3">
              <div className="d-flex justify-content-center mt-3">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  aria-label="Events navigation"
                  getItemAriaLabel={(type, page) => {
                    if (type === 'page') return `Go to page ${page}`;
                    return `Go to ${type} page`;
                  }}
                />
              </div>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EventsAttendedMemberModal;
