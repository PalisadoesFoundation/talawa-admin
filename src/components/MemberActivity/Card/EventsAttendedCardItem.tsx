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

  return (
    <Card className="border-0 py-1 rounded-0" data-testid="EventsAttendedCard">
      <Card.Body className="p-1">
        <Row className="align-items-center">
          <Col xs={3} md={2} className="text-center">
            <div className="text-secondary">
              {startdate && dayjs(startdate).isValid() ? (
                <>
                  <div className="fs-6 fw-normal">
                    {dayjs(startdate).format('MMM').toUpperCase()}
                  </div>
                  <div className="fs-1 fw-semibold">
                    {dayjs(startdate).format('D')}
                  </div>
                </>
              ) : (
                <div className="fs-6 fw-normal">Date N/A</div>
              )}
            </div>
          </Col>
          <Col xs={7} md={9} className="mb-3">
            <h5 className="mb-1">{title}</h5>
            <p className="text-muted mb-0 small">
              <MdLocationOn
                className="text-action"
                size={20}
                data-testid="LocationOnIcon"
              />
              {location}
            </p>
          </Col>
          <Col xs={2} md={1} className="text-end">
            <Link to={`/event/${orgId}/${eventId}`} state={{ id: eventId }}>
              <MdChevronRight
                className="text-action"
                size={20}
                data-testid="ChevronRightIcon"
              />
            </Link>
          </Col>
        </Row>
      </Card.Body>
      <div className="border-top border-1"></div>
    </Card>
  );
};

export default EventAttendedCard;
