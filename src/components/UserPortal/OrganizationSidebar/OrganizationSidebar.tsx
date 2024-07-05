import React, { useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import AboutImg from 'assets/images/defaultImg.png';
import styles from './OrganizationSidebar.module.css';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  ORGANIZATION_EVENT_CONNECTION_LIST,
} from 'GraphQl/Queries/Queries';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import type {
  InterfaceQueryOrganizationEventListItem,
  InterfaceMemberInfo,
} from 'utils/interfaces';

export default function organizationSidebar(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationSidebar',
  });
  const { t: tCommon } = useTranslation('common');

  const { orgId: organizationId } = useParams();
  const [members, setMembers] = React.useState<
    InterfaceMemberInfo[] | undefined
  >(undefined);
  const [events, setEvents] = React.useState<
    InterfaceQueryOrganizationEventListItem[] | undefined
  >(undefined);
  const eventsLink = `/user/events/${organizationId}`;
  const peopleLink = `/user/people/${organizationId}`;

  const { data: memberData, loading: memberLoading } = useQuery(
    ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    {
      variables: {
        orgId: organizationId,
        first: 3,
        skip: 0,
      },
    },
  );

  const { data: eventsData, loading: eventsLoading } = useQuery(
    ORGANIZATION_EVENT_CONNECTION_LIST,
    {
      variables: {
        organization_id: organizationId,
        first: 3,
        skip: 0,
      },
    },
  );

  /* istanbul ignore next */
  useEffect(() => {
    if (memberData) {
      setMembers(memberData.organizationsMemberConnection.edges);
    }
  }, [memberData]);

  /* istanbul ignore next */
  useEffect(() => {
    if (eventsData) {
      setEvents(eventsData.eventsByOrganizationConnection);
    }
  }, [eventsData]);

  return (
    <div className={`${styles.mainContainer}`}>
      <div className={styles.heading}>
        <b>{tCommon('members')}</b>
      </div>
      {memberLoading ? (
        <div className={`d-flex flex-row justify-content-center`}>
          <HourglassBottomIcon /> <span>Loading...</span>
        </div>
      ) : (
        <ListGroup variant="flush">
          {members.length ? (
            members.map((member: InterfaceMemberInfo) => {
              const memberName = `${member.firstName} ${member.lastName}`;
              return (
                <ListGroup.Item
                  key={member._id}
                  action
                  className={`${styles.rounded} ${styles.colorLight} my-1`}
                >
                  <div className="d-flex flex-row">
                    <img
                      src={member.image ? member.image : AboutImg}
                      className={styles.memberImage}
                      width="auto"
                      height="30px"
                    />
                    <div className={styles.orgName}>{memberName}</div>
                  </div>
                </ListGroup.Item>
              );
            })
          ) : (
            <div className="w-100 text-center">{t('noMembers')}</div>
          )}
        </ListGroup>
      )}

      <div className={styles.alignRight}>
        <Link to={peopleLink} className={styles.link}>
          {t('viewAll')}
          <ChevronRightIcon fontSize="small" className={styles.marginTop} />
        </Link>
      </div>
      <div className={styles.heading}>
        <b>{t('events')}</b>
      </div>
      {eventsLoading ? (
        <div className={`d-flex flex-row justify-content-center`}>
          <HourglassBottomIcon /> <span>Loading...</span>
        </div>
      ) : (
        <ListGroup variant="flush">
          {events.length ? (
            events.map((event: InterfaceQueryOrganizationEventListItem) => {
              return (
                <ListGroup.Item
                  key={event._id}
                  action
                  className={`${styles.rounded} ${styles.colorLight} my-1`}
                >
                  <div className="d-flex flex-column">
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <div className={styles.orgName}>{event.title}</div>
                      <div>
                        <CalendarMonthIcon />
                      </div>
                    </div>
                    <div className={`d-flex flex-row ${styles.eventDetails}`}>
                      Starts{' '}
                      <b> {dayjs(event.startDate).format("D MMMM 'YY")}</b>
                    </div>
                    <div className={`d-flex flex-row ${styles.eventDetails}`}>
                      Ends <b> {dayjs(event.endDate).format("D MMMM 'YY")}</b>
                    </div>
                  </div>
                </ListGroup.Item>
              );
            })
          ) : (
            <div className="w-100 text-center">{t('noEvents')}</div>
          )}
        </ListGroup>
      )}
      <div className={styles.alignRight}>
        <Link to={eventsLink} className={styles.link}>
          {t('viewAll')}
          <ChevronRightIcon fontSize="small" className={styles.marginTop} />
        </Link>
      </div>
    </div>
  );
}
