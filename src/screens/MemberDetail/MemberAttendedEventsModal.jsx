import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Pagination } from '@mui/material';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './MemberDetail.module.css';

function MemberAttendedEventsModal({ eventsAttended, setShow, show }) {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const eventsPerPage = 5;

    const handleClose = () => {
        setShow(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const paginatedEvents = eventsAttended.slice((page - 1) * eventsPerPage, page * eventsPerPage);
    const totalPages = Math.ceil(eventsAttended.length / eventsPerPage);

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Events Attended List</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {eventsAttended.length === 0 ? (
                    <p>{t('noEventsAttended')}</p>
                ) : (
                    <>
                        <h5 className='text-end'>
                            Showing {(page - 1) * eventsPerPage + 1} - {Math.min(page * eventsPerPage, eventsAttended.length)} of {eventsAttended.length} Events
                        </h5>
                        <TableContainer component={Paper} className="mt-3">
                            <Table aria-label="customized table" striped hover>
                                <TableHead>
                                    <TableRow data-testid="row">
                                        <TableCell className={styles.customcell}>Event Name</TableCell>
                                        <TableCell className={styles.customcell}>Date of Event</TableCell>
                                        <TableCell className={styles.customcell}>Recurring Event</TableCell>
                                        <TableCell className={styles.customcell}>Attendees</TableCell>
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
                            <Pagination 
                                count={totalPages} 
                                page={page} 
                                onChange={handleChangePage} 
                                color="primary" 
                            />
                        </div>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
}

const CustomTableCell = ({ eventId }) => {
    const { data, loading, error } = useQuery(EVENT_DETAILS, {
        variables: {
            id: eventId
        },
    });

    if (loading) return <TableRow><TableCell colSpan={4}><CircularProgress /></TableCell></TableRow>;
    if (error) return <TableRow><TableCell colSpan={4}>Error: {error.message}</TableCell></TableRow>;

    const event = data?.event;

    if (!event) {
        return (
            <TableRow>
                <TableCell colSpan={4} align="center">No event found</TableCell>
            </TableRow>
        );
    }

    return (
        <TableRow className="my-6">
            <TableCell align="left">
                <Link to={`/event/${event.organization._id}/${event._id}`} state={{ id: event._id }} className={styles.membername}>
                    {event.title}
                </Link>
            </TableCell>
            <TableCell align="left">{new Date(event.startDate).toLocaleDateString()}</TableCell>
            <TableCell align="left">{event.recurring ? "Yes" : "No"}</TableCell>
            <TableCell align="left">
                {event.attendees ? event.attendees.length : '0'}
            </TableCell>
        </TableRow>
    );
}

export default MemberAttendedEventsModal;