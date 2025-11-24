/**
 * EventsAttendedMemberModal Component
 *
 * This component renders a modal displaying a paginated list of events attended by a member.
 * It uses Material-UI's Table and Pagination components for displaying and navigating through
 * the events. The modal is styled using Bootstrap and custom CSS classes.
 *
 * @component
 * @param {InterfaceEventsAttendedMemberModalProps} props - The props for the component.
 * @param {Array} props.eventsAttended - List of events attended by the member.
 * @param {boolean} props.show - Controls the visibility of the modal.
 * @param {Function} props.setShow - Function to toggle the visibility of the modal.
 * @param {number} [props.eventsPerPage=5] - Number of events to display per page.
 *
 * @returns {React.FC} A modal component displaying the events attended by a member.
 *
 * @example
 * <EventsAttendedMemberModal
 *   eventsAttended={events}
 *   show={isModalVisible}
 *   setShow={setModalVisibility}
 *   eventsPerPage={10}
 * />
 *
 * @remarks
 * - The component uses `useMemo` for memoizing the paginated events and total pages.
 * - The `CustomTableCell` component is used to render individual event details.
 * - The `Pagination` component allows navigation between pages.
 *
 * @dependencies
 * - React
 * - Material-UI (Table, Pagination)
 * - React-Bootstrap (Modal)
 * - i18next (for translations)
 * - Custom styles from `style/app-fixed.module.css`
 */
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
import styles from '../../../style/app-fixed.module.css';
import { CustomTableCell } from './CustomCell/customTableCell';
import type { InterfaceEventsAttendedMemberModalProps } from 'types/Event/interface';

const EventsAttendedMemberModal: React.FC<
  InterfaceEventsAttendedMemberModalProps
> = ({ eventsAttended, setShow, show, eventsPerPage = 5 }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
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
                    <CustomTableCell
                      key={event.id ?? ''}
                      eventId={event.id ?? ''}
                    />
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
