import React from 'react';
import dayjs from 'dayjs';
import { Card, Row, Col } from 'react-bootstrap';
import {
  ChevronRight,
  LocationOn,
  PinDrop,
  PinRounded,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export interface InterfaceCardItem {
  type: 'Event' | 'Post' | 'MembershipRequest';
  title: string;
  time?: string;
  startdate?: string;
  creator?: string;
  location?: string;
  eventId?: string;
  orgId?: string;
}

const EventAttendedCard = (props: InterfaceCardItem): JSX.Element => {
  const { title, startdate, time, location, orgId, eventId } = props;

  return (
    <Card className="border-0 py-1 rounded-0">
      <Card.Body className="p-1">
        <Row className="align-items-center">
          <Col xs={3} md={2} className="text-center">
            <div className="text-secondary">
              <div className="fs-6 fw-normal">
                {dayjs(startdate).format('MMM').toUpperCase()}
              </div>
              <div className="fs-1 fw-semibold">
                {dayjs(startdate).format('D')}
              </div>
            </div>
          </Col>
          <Col xs={7} md={9} className="mb-3">
            <h5 className="mb-1">{title}</h5>
            <p className="text-muted mb-0 small">
              <LocationOn className="text-action" />
              {location}
            </p>
          </Col>
          <Col xs={2} md={1} className="text-end">
            <Link to={`/event/${orgId}/${eventId}`} state={{ id: eventId }}>
              <ChevronRight className="text-action" color="success" />
            </Link>
          </Col>
        </Row>
      </Card.Body>
      <div className="border-top border-1"></div>
    </Card>
  );
};

export default EventAttendedCard;
