/**
 * EventAttendedCard Component
 *
 * This component renders a card displaying details of an event attended by a user.
 * It includes the event's title, start date, location, and a link to the event's details.
 *
 * @param title - Event title displayed on the card.
 * @param time - Optional time metadata for the event.
 * @param startdate - Optional start date ISO string for the event.
 * @param creator - Optional creator name or identifier.
 * @param location - Optional location string for the event.
 * @param eventId - Optional event identifier used for navigation.
 * @param orgId - Optional organization identifier used for navigation.
 * @returns A styled card displaying event details.
 *
 * @remarks
 * - If the `startdate` is provided and valid, it displays the month and day.
 * - If the `startdate` is not provided or invalid, it displays "Date N/A".
 * - The location is displayed with a location icon.
 * - A chevron icon links to the event details page using `orgId` and `eventId`.
 *
 * @example
 * ```tsx
 * <EventAttendedCard
 *   title="Community Meetup"
 *   startdate={dayjs().subtract(1, 'year').month(9).date(1).hour(10).toISOString()}
 *   location="Central Park"
 *   orgId="123"
 *   eventId="456"
 * />
 * ```
 */
import React from 'react';
import dayjs from 'dayjs';
import { Card, Row, Col } from 'react-bootstrap';
import { MdChevronRight, MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './EventsAttendedCardItem.module.css';
import { useTranslation } from 'react-i18next';
import type { InterfaceCardItem } from 'types/MemberActivity/interface';

const EventAttendedCard = ({
  title,
  startdate,
  location,
  orgId,
  eventId,
}: InterfaceCardItem): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberActivity' });
  const { getItem } = useLocalStorage();

  // Check if user is administrator - only administrators can navigate to event details
  const userRole = getItem('role');
  const isAdministrator = userRole === 'administrator';

  return (
    <Card
      className={`border-0 rounded-4 shadow-sm mb-3 overflow-hidden position-relative ${styles.eventsAttendedCard}`}
      data-testid="EventsAttendedCard"
    >
      <Card.Body className="p-3">
        <Row className="align-items-center g-0">
          <Col xs={3} md={3} className="text-center">
            <div
              className={`rounded-3 d-inline-block p-2 ${styles.eventsAttendedCardDate}`}
            >
              {startdate && dayjs(startdate).isValid() ? (
                <>
                  <div
                    className={`fs-7 fw-bold mb-1 ${styles.eventsAttendedCardDateMonth}`}
                  >
                    {dayjs(startdate).format('MMM').toUpperCase()}
                  </div>
                  <div className="fs-4 fw-bold lh-1">
                    {dayjs(startdate).format('D')}
                  </div>
                </>
              ) : (
                <div
                  className={`fs-7 fw-bold ${styles.eventsAttendedCardDateNA}`}
                >
                  {t('dateNA')}
                </div>
              )}
            </div>
          </Col>
          <Col xs={7} md={8} className="ps-3">
            <h6
              className={`mb-2 fw-semibold text-dark ${styles.eventsAttendedCardTitle}`}
              data-testid="EventsAttendedCardTitle"
            >
              {title}
            </h6>
            {location && (
              <div className="d-flex align-items-center text-muted">
                <MdLocationOn
                  className="me-1 text-info"
                  size={16}
                  data-testid="LocationOnIcon"
                />
                <span className={`small ${styles.eventsAttendedCardLocation}`}>
                  {location}
                </span>
              </div>
            )}
          </Col>
          {isAdministrator && orgId && eventId && (
            <Col xs={2} md={1} className="text-end">
              <Link
                to={`/admin/event/${orgId}/${eventId}`}
                state={{ id: eventId }}
                className="text-decoration-none"
                aria-label={t('viewEventDetails')}
              >
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center ${styles.eventsAttendedCardChevron}`}
                >
                  <MdChevronRight
                    className={`text-primary ${styles.eventsAttendedCardChevronIcon}`}
                    size={18}
                    data-testid="ChevronRightIcon"
                  />
                </div>
              </Link>
            </Col>
          )}
        </Row>
      </Card.Body>
      {/* Decorative accent bar */}
      <div className={styles.eventsAttendedCardAccent} />
    </Card>
  );
};

export default EventAttendedCard;
