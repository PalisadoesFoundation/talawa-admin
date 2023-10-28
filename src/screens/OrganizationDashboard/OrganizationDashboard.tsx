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
import DashBoardCard from 'components/OrganizationDashCards/DashboardCard';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import styles from './OrganizationDashboard.module.css';
import CardItem from 'components/OrganizationDashCards/CardItem';
import type { ApolloError } from '@apollo/client';
import type {
  InterfaceQueryOrganizationEventListItem,
  InterfaceQueryOrganizationPostListItem,
  InterfaceQueryOrganizationsListObject,
} from 'utils/interfaces';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import CardItemLoading from 'components/OrganizationDashCards/CardItemLoading';
import DashboardCardLoading from 'components/OrganizationDashCards/DashboardCardLoading';
import getOrganizationId from 'utils/getOrganizationId';

function organizationDashboard(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  document.title = t('title');
  const currentUrl = window.location.href.split('=')[1];
  const organizationId = getOrganizationId(window.location.href);
  const peopleLink = `/orgpeople/id=${organizationId}`;
  const postsLink = `/orgpost/id=${organizationId}`;
  const eventsLink = `/orgevents/id=${organizationId}`;
  const blockUserLink = `/blockuser/id=${organizationId}`;
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
                    history.push(`${peopleLink}`);
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
                    history.push(`${peopleLink}`);
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
                    history.push(`${postsLink}`);
                  }}
                >
                  <DashBoardCard
                    count={postData?.postsByOrganization?.length}
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
                    history.push(`${eventsLink}`);
                  }}
                >
                  <DashBoardCard
                    count={eventData?.eventsByOrganization?.length}
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
                    history.push(`${blockUserLink}`);
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
                    history.push(`${requestLink}`);
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
                    <div className={styles.cardTitle}>Upcoming events</div>
                    <Button
                      size="sm"
                      variant="light"
                      data-testid="viewAllEvents"
                      onClick={(): void =>
                        history.push(`/orgevents/id=${currentUrl}`)
                      }
                    >
                      View all
                    </Button>
                  </div>
                  <Card.Body className={styles.cardBody}>
                    {loadingEvent ? (
                      [...Array(4)].map((_, index) => {
                        return <CardItemLoading key={index} />;
                      })
                    ) : upcomingEvents.length == 0 ? (
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
                    <Button
                      size="sm"
                      variant="light"
                      data-testid="viewAllPosts"
                      onClick={(): void =>
                        history.push(`/orgpost/id=${currentUrl}`)
                      }
                    >
                      View all
                    </Button>
                  </div>
                  <Card.Body className={styles.cardBody}>
                    {loadingPost ? (
                      [...Array(4)].map((_, index) => {
                        return <CardItemLoading key={index} />;
                      })
                    ) : postData?.postsByOrganization?.length == 0 ? (
                      <div className={styles.emptyContainer}>
                        <h6>No posts present</h6>
                      </div>
                    ) : (
                      postData?.postsByOrganization.slice(0, 5).map((post) => {
                        return (
                          <CardItem
                            type="Post"
                            key={post._id}
                            title={post.title}
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
                <div className={styles.cardTitle}>Membership requests</div>
                <Button
                  size="sm"
                  variant="light"
                  data-testid="viewAllMembershipRequests"
                  onClick={(): void => {
                    toast.success('Coming soon!');
                  }}
                >
                  View all
                </Button>
              </div>
              <Card.Body className={styles.cardBody}>
                {loadingOrgData ? (
                  [...Array(4)].map((_, index) => {
                    return <CardItemLoading key={index} />;
                  })
                ) : data?.organizations[0].membershipRequests.length == 0 ? (
                  <div className={styles.emptyContainer}>
                    <h6>No membership requests present</h6>
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
