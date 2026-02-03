/**
 * EventsAttendedMemberModal - Modal displaying paginated list of events attended by a member
 *
 * Uses Material-UI Table and Pagination components for displaying and navigating through events.
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
import styles from './EventsAttendedMemberModal.module.css';
import { CustomTableCell } from './CustomCell/customTableCell';
import type {
  InterfaceEventsAttendedMemberModalProps,
  IEvent,
} from 'types/Event/interface';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';

/**
 * EventsAttendedMemberModal component displays a paginated list of events attended by a member.
 *
 * @param eventsAttended - Array of events attended by the member
 * @param setShow - Function to control modal visibility
 * @param show - Boolean controlling whether the modal is visible
 * @param eventsPerPage - Number of events to display per page (default: 5)
 * @returns JSX.Element
 */
const EventsAttendedMemberModal: React.FC<
  InterfaceEventsAttendedMemberModalProps
> = ({ eventsAttended, setShow, show, eventsPerPage = 5 }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventsAttendedMemberModal',
  });
  const { t: tErrors } = useTranslation('errors');
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
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <BaseModal
        show={show}
        onHide={handleClose}
        title={t('title')}
        centered
        size="lg"
        dataTestId="eventsAttendedModal"
      >
        {eventsAttended.length === 0 ? (
          <p>{t('noEventsAttended')}</p>
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
              <Table aria-label={t('tableAriaLabel')}>
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
                  {paginatedEvents
                    .filter(
                      (event): event is IEvent & { id: string } => !!event.id,
                    )
                    .map((event) => (
                      <CustomTableCell key={event.id} eventId={event.id} />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="d-flex justify-content-center mt-3">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChangePage}
                color="primary"
                aria-label={t('paginationAriaLabel')}
                getItemAriaLabel={(type, page) => {
                  if (type === 'page') {
                    return t('paginationGoToPage', {
                      page,
                    });
                  }
                  return t('paginationGoToType', {
                    type,
                  });
                }}
              />
            </div>
          </>
        )}
      </BaseModal>
    </ErrorBoundaryWrapper>
  );
};

export default EventsAttendedMemberModal;
