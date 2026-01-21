import React from 'react';
import { Card, Col } from 'react-bootstrap';
// Add this import:
import { useTranslation } from 'react-i18next';
import EventsAttendedByMember from 'components/MemberActivity/EventsAttendedByMember';
import Button from 'shared-components/Button/Button';
import type { IEvent } from 'types/Event/interface';
import { IMemberActivitySectionProps } from '../../types/shared-components/ProfileForm/interface';
import styles from './MemberActivitySection.module.css';

// Remove 't' from the destructured props
const MemberActivitySection: React.FC<IMemberActivitySectionProps> = ({
  events,
  onViewAll,
}) => {
  // Initialize translation hook here so the scanner detects the prefix
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });

  return (
    <>
      <Col>
        <Card className={`${styles.contact} ${styles.allRound} mt-3`}>
          <Card.Header
            className={`d-flex justify-content-between align-items-center py-3 px-4 ${styles.topRadius} ${styles.member_details_style}`}
          >
            <h3 className="m-0" data-testid="eventsAttended-title">
              {t('eventsAttended')}
            </h3>
            <Button
              className={styles.contact_btn}
              size="sm"
              variant="light"
              data-testid="viewAllEvents"
              onClick={onViewAll}
            >
              {t('viewAll')}
            </Button>
          </Card.Header>
          <Card.Body
            className={`${styles.cardBody} px-4 ${styles.scrollableCardBody}`}
          >
            {!events?.length ? (
              <div className={styles.emptyContainer}>
                {t('noeventsAttended')}
              </div>
            ) : (
              events.map((event: IEvent, index: number) => (
                <span data-testid="membereventsCard" key={index}>
                  <EventsAttendedByMember eventsId={event.id} key={index} />
                </span>
              ))
            )}
          </Card.Body>
        </Card>
      </Col>
      <Card className={`${styles.contact} ${styles.allRound} mt-3`}>
        <Card.Header
          className={`d-flex justify-content-between align-items-center py-3 px-4 ${styles.topRadius} ${styles.member_details_style}`}
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

export default MemberActivitySection;