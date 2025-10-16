/**
 * EventAttendedCard Component
 *
 * This component renders a card displaying details of an event attended by a user.
 * It includes the event's title, start date, location, and a link to the event's details.
 *
 * @component
 * @param {InterfaceCardItem} props - The properties passed to the component.
 * @param {string} props.title - The title of the event.
 * @param {string} [props.time] - The time of the event (optional, not currently used).
 * @param {string} [props.startdate] - The start date of the event in ISO format (optional).
 * @param {string} [props.creator] - The creator of the event (optional, not currently used).
 * @param {string} [props.location] - The location of the event (optional).
 * @param {string} [props.eventId] - The unique identifier for the event (optional).
 * @param {string} [props.orgId] - The unique identifier for the organization hosting the event (optional).
 *
 * @returns {JSX.Element} A styled card displaying event details.
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
 *   startdate="2023-10-01T10:00:00Z"
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

export interface InterfaceCardItem {
  title: string;
  time?: string;
  startdate?: string;
  creator?: string;
  location?: string;
  eventId?: string;
  orgId?: string;
}

const EventAttendedCard = (props: InterfaceCardItem): JSX.Element => {
  const { title, startdate, location, orgId, eventId } = props;
  const { getItem } = useLocalStorage();

  // Check if user is administrator - only administrators can navigate to event details
  const userRole = getItem('role');
  const isAdministrator = userRole === 'administrator';

  return (
    <Card
      className="border-0 rounded-4 shadow-sm mb-3 overflow-hidden position-relative"
      data-testid="EventsAttendedCard"
      style={{
        transition: 'all 0.3s ease',
        background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
        border: '1px solid #e3f2fd',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
      }}
    >
      <Card.Body className="p-3">
        <Row className="align-items-center g-0">
          <Col xs={3} md={3} className="text-center">
            <div
              className="rounded-3 d-inline-block p-2"
              style={{
                background: 'linear-gradient(135deg, #A8C7FA 0%, #A8C7FA 100%)',
                color: '#555',
                minWidth: '60px',
              }}
            >
              {startdate && dayjs(startdate).isValid() ? (
                <>
                  <div
                    className="fs-7 fw-bold mb-1"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {dayjs(startdate).format('MMM').toUpperCase()}
                  </div>
                  <div className="fs-4 fw-bold lh-1">
                    {dayjs(startdate).format('D')}
                  </div>
                </>
              ) : (
                <div className="fs-7 fw-bold" style={{ fontSize: '0.75rem' }}>
                  Date N/A
                </div>
              )}
            </div>
          </Col>
          <Col xs={7} md={8} className="ps-3">
            <h6
              className="mb-2 fw-semibold text-dark"
              style={{ fontSize: '1rem' }}
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
                <span className="small" style={{ fontSize: '0.85rem' }}>
                  {location}
                </span>
              </div>
            )}
          </Col>
          {isAdministrator && (
            <Col xs={2} md={1} className="text-end">
              <Link
                to={`/event/${orgId}/${eventId}`}
                state={{ id: eventId }}
                className="text-decoration-none"
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#e3f2fd',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <MdChevronRight
                    className="text-primary"
                    size={18}
                    data-testid="ChevronRightIcon"
                    style={{ transition: 'color 0.2s ease' }}
                  />
                </div>
              </Link>
            </Col>
          )}
        </Row>
      </Card.Body>
      {/* Decorative accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          background: 'linear-gradient(135deg,  #A8C7FA 0%,  #A8C7FA 100%)',
        }}
      />
    </Card>
  );
};

export default EventAttendedCard;
