import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button, Card } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';

import {
  ORGANIZATIONS_LIST,
  ORGANIZATION_POST_CONNECTION_LIST,
  ORGANIZATION_EVENT_CONNECTION_LIST,
} from 'GraphQl/Queries/Queries';
import { ReactComponent as AdminsIcon } from 'assets/svgs/admin.svg';
import { ReactComponent as BlockedUsersIcon } from 'assets/svgs/blockedUser.svg';
import { ReactComponent as EventsIcon } from 'assets/svgs/events.svg';
import { ReactComponent as PostsIcon } from 'assets/svgs/post.svg';
import { ReactComponent as UsersIcon } from 'assets/svgs/users.svg';
import DashBoardCard from 'components/OrganizationDashCards/DashboardCard';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import styles from './OrganizationDashboard.module.css';
import CardItem from 'components/OrganizationDashCards/CardItem';
import type { ApolloError } from '@apollo/client';
import type {
  InterfaceQueryOrganizationEventListItem,
  InterfaceQueryOrganizationsListObject,
} from 'utils/interfaces';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import CardItemLoading from 'components/OrganizationDashCards/CardItemLoading';
import DashboardCardLoading from 'components/OrganizationDashCards/DashboardCardLoading';

function organizationDashboard(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  document.title = t('title');
  const currentUrl = window.location.href.split('=')[1];
  const peopleLink = `/orgpeople/id=${currentUrl}`;
  const postsLink = `/orgpost/id=${currentUrl}`;
  const eventsLink = `/orgevents/id=${currentUrl}`;
  const blockUserLink = `/blockuser/id=${currentUrl}`;
  const requestLink = '/requests';

  const history = useHistory();
  const [upcomingEvents, setUpcomingEvents] = useState<
    InterfaceQueryOrganizationEventListItem[]
  >([]);

  const {
    data,
    loading: loadingOrgData,
    error: errorOrg,
  }: {
    data?: {
      organizations: InterfaceQueryOrganizationsListObject[];
    };
    loading: boolean;
    error?: ApolloError;
  } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  const {
    data: postData,
    loading: loadingPost,
    error: errorPost,
  } = useQuery(ORGANIZATION_POST_CONNECTION_LIST, {
    variables: { id: currentUrl },
  });

  const {
    data: eventData,
    loading: loadingEvent,
    error: errorEvent,
  }: {
    data: any;
    loading: boolean;
    error?: ApolloError;
  } = useQuery(ORGANIZATION_EVENT_CONNECTION_LIST, {
    variables: {
      organization_id: currentUrl,
    },
  });

  // UseEffect to update upcomingEvents array
  useEffect(() => {
    if (eventData && eventData?.eventsByOrganizationConnection.length > 0) {
      const tempUpcomingEvents: InterfaceQueryOrganizationEventListItem[] = [];
      eventData?.eventsByOrganizationConnection.map((event: any) => {
        const startDate = new Date(event.startDate);
        const now = new Date();
        if (startDate > now) {
          tempUpcomingEvents.push(event);
        }
      });
      setUpcomingEvents(tempUpcomingEvents);
    }
  }, [eventData?.eventsByOrganizationConnection]);

  if (errorOrg || errorPost || errorEvent) {
    window.location.replace('/orglist');
  }

  return (
    <>
      <OrganizationScreen screenName="Dashboard" title={t('title')}>
        <Row className="mt-4">
          <Col xl={8}>
            {loadingOrgData ? (
              <Row style={{ display: 'flex' }}>
                {[...Array(6)].map((_, index) => {
                  return (
                    <Col xs={6} sm={4} className="mb-4" key={index}>
                      <DashboardCardLoading />
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <Row style={{ display: 'flex' }}>
                <Col
                  xs={6}
                  sm={4}
                  role="button"
                  className="mb-4"
                  onClick={(): void => {
                    history.push(peopleLink);
                  }}
                >
                  <DashBoardCard
                    count={data?.organizations[0].members?.length}
                    title={t('members')}
                    icon={<UsersIcon fill="var(--bs-primary)" />}
                  />
                </Col>
                <Col
                  xs={6}
                  sm={4}
                  role="button"
                  className="mb-4"
                  onClick={(): void => {
                    history.push(peopleLink);
                  }}
                >
                  <DashBoardCard
                    count={data?.organizations[0].admins?.length}
                    title={t('admins')}
                    icon={<AdminsIcon fill="var(--bs-primary)" />}
                  />
                </Col>
                <Col
                  xs={6}
                  sm={4}
                  role="button"
                  className="mb-4"
                  onClick={(): void => {
                    history.push(postsLink);
                  }}
                >
                  <DashBoardCard
                    count={
                      postData?.postsByOrganizationConnection?.edges.length
                    }
                    title={t('posts')}
                    icon={<PostsIcon fill="var(--bs-primary)" />}
                  />
                </Col>
                <Col
                  xs={6}
                  sm={4}
                  role="button"
                  className="mb-4"
                  onClick={(): void => {
                    history.push(eventsLink);
                  }}
                >
                  <DashBoardCard
                    count={eventData?.eventsByOrganizationConnection.length}
                    title={t('events')}
                    icon={<EventsIcon fill="var(--bs-primary)" />}
                  />
                </Col>
                <Col
                  xs={6}
                  sm={4}
                  role="button"
                  className="mb-4"
                  onClick={(): void => {
                    history.push(blockUserLink);
                  }}
                >
                  <DashBoardCard
                    count={data?.organizations[0].blockedUsers?.length}
                    title={t('blockedUsers')}
                    icon={<BlockedUsersIcon fill="var(--bs-primary)" />}
                  />
                </Col>
                <Col
                  xs={6}
                  sm={4}
                  role="button"
                  className="mb-4"
                  onClick={(): void => {
                    history.push(requestLink);
                  }}
                >
                  <DashBoardCard
                    count={data?.organizations[0].membershipRequests?.length}
                    title={t('requests')}
                    icon={<UsersIcon fill="var(--bs-primary)" />}
                  />
                </Col>
              </Row>
            )}
            <Row>
              <Col lg={6} className="mb-4">
                <Card border="0" className="rounded-4">
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                      {t('upcomingEvents')}
                    </div>
                    <Button
                      size="sm"
                      variant="light"
                      data-testid="viewAllEvents"
                      onClick={(): void => history.push(eventsLink)}
                    >
                      {t('viewAll')}
                    </Button>
                  </div>
                  <Card.Body className={styles.cardBody}>
                    {loadingEvent ? (
                      [...Array(4)].map((_, index) => {
                        return <CardItemLoading key={index} />;
                      })
                    ) : upcomingEvents.length == 0 ? (
                      <div className={styles.emptyContainer}>
                        <h6>{t('noUpcomingEvents')}</h6>
                      </div>
                    ) : (
                      upcomingEvents.map(
                        (event: InterfaceQueryOrganizationEventListItem) => {
                          return (
                            <CardItem
                              type="Event"
                              key={event._id}
                              time={event.startDate}
                              title={event.title}
                              location={event.location}
                            />
                          );
                        }
                      )
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="mb-4">
                <Card border="0" className="rounded-4">
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>{t('latestPosts')}</div>
                    <Button
                      size="sm"
                      variant="light"
                      data-testid="viewAllPosts"
                      onClick={(): void => history.push(postsLink)}
                    >
                      {t('viewAll')}
                    </Button>
                  </div>
                  <Card.Body className={styles.cardBody}>
                    {loadingPost ? (
                      [...Array(4)].map((_, index) => {
                        return <CardItemLoading key={index} />;
                      })
                    ) : postData?.postsByOrganizationConnection.edges.length ==
                      0 ? (
                      /* eslint-disable */
                      <div className={styles.emptyContainer}>
                        <h6>{t('noPostsPresent')}</h6>
                      </div>
                    ) : (
                      /* eslint-enable */
                      postData?.postsByOrganizationConnection.edges
                        .slice(0, 5)
                        .map((post: any) => {
                          return (
                            <CardItem
                              type="Post"
                              key={post._id}
                              title={post.title}
                              time={post.createdAt}
                              creator={post.creator}
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
                <div className={styles.cardTitle}>
                  {t('membershipRequests')}
                </div>
                <Button
                  size="sm"
                  variant="light"
                  data-testid="viewAllMembershipRequests"
                  onClick={(): void => {
                    toast.success('Coming soon!');
                  }}
                >
                  {t('viewAll')}
                </Button>
              </div>
              <Card.Body className={styles.cardBody}>
                {loadingOrgData ? (
                  [...Array(4)].map((_, index) => {
                    return <CardItemLoading key={index} />;
                  })
                ) : data?.organizations[0].membershipRequests.length == 0 ? (
                  <div className={styles.emptyContainer}>
                    <h6>{t('noMembershipRequests')}</h6>
                  </div>
                ) : (
                  data?.organizations[0]?.membershipRequests
                    .slice(0, 8)
                    .map((request) => {
                      return (
                        <CardItem
                          type="MembershipRequest"
                          key={request._id}
                          title={`${request.user.firstName} ${request.user.lastName}`}
                        />
                      );
                    })
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </OrganizationScreen>
    </>
  );
}

export default organizationDashboard;
