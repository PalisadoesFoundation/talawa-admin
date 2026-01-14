/**
 * ActivityCards Component
 * Renders Events Attended and Tags Assigned cards
 */

import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import profileForm from '../profileForm.module.css';
import EventsAttendedByMember from 'components/MemberActivity/EventsAttendedByMember';
import type { IEvent } from 'types/Event/interface';

interface ActivityCardsProps {
  eventsAttended: IEvent[];
  onViewAllEvents: () => void;
}

const ActivityCards: React.FC<ActivityCardsProps> = ({
  eventsAttended,
  onViewAllEvents,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });

  return (
    <>
      {/* Events Attended Card */}
      <Card className={`${styles.contact} ${styles.allRound} mt-3`}>
        <Card.Header
          className={`d-flex justify-content-between align-items-center py-3 px-4 ${styles.topRadius} ${profileForm.member_details_style}`}
        >
          <h3 className="m-0" data-testid="eventsAttended-title">
            {t('eventsAttended')}
          </h3>
          <Button
            className={profileForm.contact_btn}
            size="sm"
            variant="light"
            data-testid="viewAllEvents"
            onClick={onViewAllEvents}
          >
            {t('viewAll')}
          </Button>
        </Card.Header>
        <Card.Body
          className={`${styles.cardBody} px-4 ${styles.scrollableCardBody}`}
        >
          {!eventsAttended?.length ? (
            <div
              className={`${styles.emptyContainer} w-100 h-100 d-flex justify-content-center align-items-center fw-semibold text-secondary`}
            >
              {t('noeventsAttended')}
            </div>
          ) : (
            eventsAttended.map((event: IEvent, index: number) => (
              <span data-testid="membereventsCard" key={index}>
                <EventsAttendedByMember eventsId={event.id} key={index} />
              </span>
            ))
          )}
        </Card.Body>
      </Card>

      {/* Tags Assigned Card */}
      <Card className={`${styles.contact} ${styles.allRound} mt-3`}>
        <Card.Header
          className={`d-flex justify-content-between align-items-center py-3 px-4 ${styles.topRadius} ${profileForm.member_details_style}`}
        >
          <h3 className="m-0" data-testid="tagsAssigned-title">
            {t('tagsAssigned')}
          </h3>
        </Card.Header>
        <Card.Body
          id="tagsAssignedScrollableDiv"
          data-testid="tagsAssignedScrollableDiv"
          className={`${styles.cardBody} pe-0`}
        ></Card.Body>
      </Card>
    </>
  );
};

export default ActivityCards;