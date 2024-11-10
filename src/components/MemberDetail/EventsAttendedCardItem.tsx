import React from 'react';
import dayjs from 'dayjs';
import { Card, Row, Col } from 'react-bootstrap';
import { MdChevronRight, MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';
/**
 * Card component to display individual event attendance information
 * Shows event details including title, date, location and organization
 * @param orgId - Organization ID
 * @param eventId - Event ID
 * @param startdate - Event start date
 * @param title - Event title
 * @param location - Event location
 * @returns Card component with formatted event information
 */
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
                /*istanbul ignore next*/
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
