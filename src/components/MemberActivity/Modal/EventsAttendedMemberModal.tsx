/**
 * EventsAttendedMemberModal Component
 *
 * This component renders a modal displaying a paginated list of events attended by a member.
 * It uses Material-UI's Table and Pagination components for displaying and navigating through
 * the events. The modal is styled using Bootstrap and custom CSS classes.
 * @component
 * @param props - The props for the component.
 * @param props.eventsAttended - List of events attended by the member.
 * @param props.show - Controls the visibility of the modal.
 * @param props.setShow - Function to toggle the visibility of the modal.
 * @param props.eventsPerPage - Number of events to display per page.
 * @returns A modal component displaying the events attended by a member.
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
import { useTranslation } from 'react-i18next';
import styles from '../../../style/app-fixed.module.css';
import { CustomTableCell } from './CustomCell/customTableCell';
import type { InterfaceEventsAttendedMemberModalProps } from 'types/Event/interface';
import BaseModal from 'shared-components/BaseModal/BaseModal';

const EventsAttendedMemberModal: React.FC<
  InterfaceEventsAttendedMemberModalProps
> = ({ eventsAttended, setShow, show, eventsPerPage = 5 }) => {
  const { t: tCommon } = useTranslation('translation', {
    keyPrefix: 'memberDetail',
  });
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventsAttendedMemberModal',
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
    <BaseModal
      show={show}
      onHide={handleClose}
      title={t('title')}
      centered
      size="lg"
      dataTestId="eventsAttendedModal"
    >
      {eventsAttended.length === 0 ? (
        <p>{tCommon('noeventsAttended')}</p>
      ) : (
        <>
          <h5 className="text-end">
            {t('showing', {
              start: (page - 1) * eventsPerPage + 1,
              end: Math.min(page * eventsPerPage, eventsAttended.length),
              total: eventsAttended.length,
            })}
          </h5>
          <TableContainer component={Paper} className="mt-3">
            <Table aria-label="customized table">
              <TableHead>
                <TableRow data-testid="row">
                  <TableCell className={styles.customcell}>
                    {t('eventName')}
                  </TableCell>
                  <TableCell className={styles.customcell}>
                    {t('dateOfEvent')}
                  </TableCell>
                  <TableCell className={styles.customcell}>
                    {t('recurringEvent')}
                  </TableCell>
                  <TableCell className={styles.customcell}>
                    {t('attendees')}
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
    </BaseModal>
  );
};

export default EventsAttendedMemberModal;
