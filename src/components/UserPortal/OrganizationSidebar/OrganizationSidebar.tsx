/**
 * OrganizationSidebar Component
 *
 * This component displays a sidebar for an organization, showing a list of members
 * and upcoming events. It fetches data using GraphQL queries and provides links
 * to view all members and events.
 *
 * @returns The rendered OrganizationSidebar component.
 *
 * @remarks
 * - Uses `useQuery` from Apollo Client to fetch members and events data.
 * - Displays loading indicators while data is being fetched.
 * - Uses `useTranslation` for internationalization.
 * - Extracts `organizationId` from URL parameters using `useParams`.
 *
 * @example
 * ```tsx
 * <OrganizationSidebar />
 * ```
 *
 * @remarks
 * - Members and events are displayed in a list format with a maximum of 3 items each.
 * - Provides fallback UI when no members or events are available.
 */
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

export default function OrganizationSidebar(): JSX.Element {
  // Translation functions for different namespaces
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationSidebar',
  });
  const { t: tCommon } = useTranslation('common');

  // Extract the organization ID from the URL parameters
  const { orgId: organizationId } = useParams();
  const [members, setMembers] = React.useState<
    InterfaceMemberInfo[] | undefined
  >(undefined);
  const [events, setEvents] = React.useState<
    InterfaceQueryOrganizationEventListItem[] | undefined
  >(undefined);
  const eventsLink = `/user/events/${organizationId}`;
  const peopleLink = `/user/people/${organizationId}`;

  // Query to fetch members of the organization
  const { data: memberData, loading: memberLoading } = useQuery(
    ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    {
      variables: {
        orgId: organizationId,
        first: 3, // Fetch top 3 members
        skip: 0, // No offset
      },
    },
  );

  // Query to fetch events of the organization
  const { data: eventsData, loading: eventsLoading } = useQuery(
    ORGANIZATION_EVENT_CONNECTION_LIST,
    {
      variables: {
        organization_id: organizationId,
        first: 3, // Fetch top 3 upcoming events
        skip: 0, // No offset
      },
    },
  );

  /**
   * Effect hook to update members state when memberData is fetched.
   *
   * Sets the members state with the data from the query.
   */
  useEffect(() => {
    if (memberData) {
      const legacyMembers = memberData.organizationsMemberConnection?.edges;
      if (legacyMembers) {
        setMembers(legacyMembers);
        return;
      }

      const edges = memberData.organization?.members?.edges ?? [];
      const normalizedMembers: InterfaceMemberInfo[] = edges.map(
        (edge: {
          node?: {
            id?: string;
            name?: string;
            emailAddress?: string;
            avatarURL?: string;
            createdAt?: string;
          };
        }) => {
          const fullName = edge.node?.name ?? '';
          const [firstName = '', ...lastNameParts] = fullName.split(' ');
          return {
            _id: edge.node?.id ?? '',
            firstName,
            lastName: lastNameParts.join(' '),
            email: edge.node?.emailAddress ?? '',
            image: edge.node?.avatarURL ?? '',
            createdAt: edge.node?.createdAt ?? '',
            organizationsBlockedBy: [],
          };
        },
      );

      setMembers(normalizedMembers);
    }
  }, [memberData]);

  /**
   * Effect hook to update events state when eventsData is fetched.
   *
   * Sets the events state with the data from the query.
   */
  useEffect(() => {
    if (eventsData) {
      setEvents(eventsData.eventsByOrganizationConnection);
    }
  }, [eventsData]);

  return (
    <div className={`${styles.mainContainer}`}>
      {/* Members section */}
      <div className={styles.heading}>
        <b>{tCommon('members')}</b>
      </div>
      {memberLoading ? (
        <div className={`d-flex flex-row justify-content-center`}>
          <HourglassBottomIcon /> <span>{t('loading')}</span>
        </div>
      ) : (
        <ListGroup variant="flush">
          {members && members.length ? (
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

      {/* Link to view all members */}
      <div className={styles.alignRight}>
        <Link to={peopleLink} className={styles.link}>
          {t('viewAll')}
          <ChevronRightIcon fontSize="small" className={styles.marginTop} />
        </Link>
      </div>

      {/* Events section */}
      <div className={styles.heading}>
        <b>{t('events')}</b>
      </div>
      {eventsLoading ? (
        <div className={`d-flex flex-row justify-content-center`}>
          <HourglassBottomIcon /> <span>{t('loading')}</span>
        </div>
      ) : (
        <ListGroup variant="flush">
          {events && events.length ? (
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
                      {t('ends')}{' '}
                      <b> {dayjs(event.endDate).format("D MMMM 'YY")}</b>
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

      {/* Link to view all events */}
      <div className={styles.alignRight}>
        <Link to={eventsLink} className={styles.link}>
          {t('viewAll')}
          <ChevronRightIcon fontSize="small" className={styles.marginTop} />
        </Link>
      </div>
    </div>
  );
}
