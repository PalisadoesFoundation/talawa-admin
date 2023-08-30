import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button, Card } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';

import {
  ORGANIZATIONS_LIST,
  ORGANIZATION_EVENT_LIST,
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';
import { ReactComponent as AdminsIcon } from 'assets/svgs/admin.svg';
import { ReactComponent as BlockedUsersIcon } from 'assets/svgs/blockedUser.svg';
import { ReactComponent as EventsIcon } from 'assets/svgs/events.svg';
import { ReactComponent as PostsIcon } from 'assets/svgs/post.svg';
import { ReactComponent as UsersIcon } from 'assets/svgs/users.svg';
import Loader from 'components/Loader/Loader';
import DashBoardCard from 'components/OrganizationDashCards/DashboardCard';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import styles from './OrganizationDashboard.module.css';
import CardItem from 'components/OrganizationDashCards/CardItem';
import type { ApolloError } from '@apollo/client';
import type {
  InterfaceQueryOrganizationEventListItem,
  InterfaceQueryOrganizationPostListItem,
} from 'utils/interfaces';

function organizationDashboard(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  document.title = t('title');
  const currentUrl = window.location.href.split('=')[1];
  const [upcomingEvents, setUpcomingEvents] = useState<
    InterfaceQueryOrganizationEventListItem[]
  >([]);

  const { data, loading, error } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  const {
    data: postData,
    loading: loadingPost,
    error: errorPost,
  }: {
    data:
      | {
          postsByOrganization: InterfaceQueryOrganizationPostListItem[];
        }
      | undefined;
    loading: boolean;
    error?: ApolloError;
  } = useQuery(ORGANIZATION_POST_LIST, {
    variables: { id: currentUrl },
  });

  const {
    data: eventData,
    loading: loadingEvent,
    error: errorEvent,
  }: {
    data:
      | {
          eventsByOrganization: InterfaceQueryOrganizationEventListItem[];
        }
      | undefined;
    loading: boolean;
    error?: ApolloError;
  } = useQuery(ORGANIZATION_EVENT_LIST, {
    variables: { id: currentUrl },
  });

  // UseEffect to update upcomingEvents array
  useEffect(() => {
    if (eventData && eventData?.eventsByOrganization.length > 0) {
      const tempUpcomingEvents: InterfaceQueryOrganizationEventListItem[] = [];
      eventData?.eventsByOrganization.map((event) => {
        const startDate = new Date(event.startDate);
        const now = new Date();
        if (startDate > now) {
          tempUpcomingEvents.push(event);
        }
      });
      setUpcomingEvents(tempUpcomingEvents);
    }
  }, [eventData?.eventsByOrganization]);

  if (loading || loadingPost || loadingEvent) {
    return <Loader />;
  }

  /* istanbul ignore next */
  if (error || errorPost || errorEvent) {
    window.location.replace('/orglist');
  }

  return (
    <>
      <OrganizationScreen screenName="Dashboard" title={t('title')}>
        <Row className="mt-4">
          <Col xl={8}>
            <Row style={{ display: 'flex' }}>
              <Col xs={6} sm={4} className="mb-4">
                <DashBoardCard
                  count={data?.organizations[0].members.length}
                  title={t('members')}
                  icon={<UsersIcon fill="var(--bs-primary)" />}
                />
              </Col>
              <Col xs={6} sm={4} className="mb-4">
                <DashBoardCard
                  count={data?.organizations[0].admins.length}
                  title={t('admins')}
                  icon={<AdminsIcon fill="var(--bs-primary)" />}
                />
              </Col>
              <Col xs={6} sm={4} className="mb-4">
                <DashBoardCard
                  count={postData?.postsByOrganization?.length ?? 0}
                  title={t('posts')}
                  icon={<PostsIcon fill="var(--bs-primary)" />}
                />
              </Col>
              <Col xs={6} sm={4} className="mb-4">
                <DashBoardCard
                  count={eventData?.eventsByOrganization?.length ?? 0}
                  title={t('events')}
                  icon={<EventsIcon fill="var(--bs-primary)" />}
                />
              </Col>
              <Col xs={6} sm={4} className="mb-4">
                <DashBoardCard
                  count={data?.organizations[0].blockedUsers.length}
                  title={t('blockedUsers')}
                  icon={<BlockedUsersIcon fill="var(--bs-primary)" />}
                />
              </Col>
              <Col xs={6} sm={4} className="mb-4">
                <DashBoardCard
                  count={data?.organizations[0].membershipRequests.length}
                  title={t('requests')}
                  icon={<UsersIcon fill="var(--bs-primary)" />}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={6} className="mb-4">
                <Card border="0" className="rounded-4">
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>Upcoming events</div>
                    <Button size="sm" variant="light">
                      See all
                    </Button>
                  </div>
                  <Card.Body className={styles.cardBody}>
                    {upcomingEvents.length == 0 ? (
                      <div className={styles.emptyContainer}>
                        <h6>No upcoming events</h6>
                      </div>
                    ) : (
                      upcomingEvents.slice(0, 5).map((event) => {
                        return (
                          <CardItem
                            type="Event"
                            key={event._id}
                            time={event.startDate}
                            title={event.title}
                          />
                        );
                      })
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="mb-4">
                <Card border="0" className="rounded-4">
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>Latest posts</div>
                    <Button size="sm" variant="light">
                      See all
                    </Button>
                  </div>
                  <Card.Body className={styles.cardBody}>
                    {postData?.postsByOrganization?.length == 0 ? (
                      <div className={styles.emptyContainer}>
                        <h6>No posts present</h6>
                      </div>
                    ) : (
                      postData?.postsByOrganization
                        .slice(0, 5)
                        .map((event: any) => {
                          return (
                            <CardItem
                              type="Post"
                              key={event._id}
                              time={event.startDate}
                              title={event.title}
                            />
                          );
                        })
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col xl={4}>
            <Card border="0" className="rounded-4">
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Notifications</div>
              </div>
              <Card.Body className={styles.cardBody}></Card.Body>
            </Card>
          </Col>
        </Row>
      </OrganizationScreen>
    </>
  );
}

export default organizationDashboard;
