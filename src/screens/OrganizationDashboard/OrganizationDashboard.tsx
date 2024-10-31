import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';

import type { ApolloError } from '@apollo/client';
import {
  ORGANIZATIONS_LIST,
  ORGANIZATION_EVENT_CONNECTION_LIST,
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';
import AdminsIcon from 'assets/svgs/admin.svg?react';
import BlockedUsersIcon from 'assets/svgs/blockedUser.svg?react';
import EventsIcon from 'assets/svgs/events.svg?react';
import PostsIcon from 'assets/svgs/post.svg?react';
import UsersIcon from 'assets/svgs/users.svg?react';
import CardItem from 'components/OrganizationDashCards/CardItem';
import CardItemLoading from 'components/OrganizationDashCards/CardItemLoading';
import DashBoardCard from 'components/OrganizationDashCards/DashboardCard';
import DashboardCardLoading from 'components/OrganizationDashCards/DashboardCardLoading';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import type {
  InterfaceQueryOrganizationEventListItem,
  InterfaceQueryOrganizationPostListItem,
  InterfaceQueryOrganizationsListObject,
} from 'utils/interfaces';
import styles from './OrganizationDashboard.module.css';

/**
 * Component for displaying the organization dashboard.
 *
 * This component provides an overview of various statistics and information related to an organization, including members, admins, posts, events, blocked users, and membership requests. It also displays upcoming events and latest posts.
 *
 * @returns The rendered component.
 */
function organizationDashboard(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const { t: tCommon } = useTranslation('common');
  document.title = t('title');
  const { orgId: currentUrl } = useParams();
  const peopleLink = `/orgpeople/${currentUrl}`;
  const postsLink = `/orgpost/${currentUrl}`;
  const eventsLink = `/orgevents/${currentUrl}`;
  const blockUserLink = `/blockuser/${currentUrl}`;
  const requestLink = '/requests';

  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState<
    InterfaceQueryOrganizationEventListItem[]
  >([]);

  /**
   * Query to fetch organization data.
   */
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

  /**
   * Query to fetch posts for the organization.
   */
  const {
    data: postData,
    loading: loadingPost,
    error: errorPost,
  }: {
    data?: {
      organizations: InterfaceQueryOrganizationPostListItem[];
    };
    loading: boolean;
    error?: ApolloError;
  } = useQuery(ORGANIZATION_POST_LIST, {
    variables: { id: currentUrl, first: 10 },
  });

  /**
   * Query to fetch events for the organization.
   */
  const {
    data: eventData,
    loading: loadingEvent,
    error: errorEvent,
  } = useQuery(ORGANIZATION_EVENT_CONNECTION_LIST, {
    variables: {
      organization_id: currentUrl,
    },
  });

  /**
   * UseEffect to update the list of upcoming events.
   */
  useEffect(() => {
    if (eventData && eventData?.eventsByOrganizationConnection.length > 0) {
      const tempUpcomingEvents: InterfaceQueryOrganizationEventListItem[] = [];
      eventData?.eventsByOrganizationConnection.map(
        (event: InterfaceQueryOrganizationEventListItem) => {
          const startDate = new Date(event.startDate);
          const now = new Date();
          if (startDate > now) {
            tempUpcomingEvents.push(event);
          }
        },
      );
      setUpcomingEvents(tempUpcomingEvents);
    }
  }, [eventData?.eventsByOrganizationConnection]);

  /**
   * UseEffect to handle errors and navigate if necessary.
   */
  useEffect(() => {
    if (errorOrg || errorPost || errorEvent) {
      console.log('error', errorPost?.message);
      navigate('/orglist');
    }
  }, [errorOrg, errorPost, errorEvent]);

  return (
    <>
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
                  navigate(peopleLink);
                }}
              >
                <DashBoardCard
                  count={data?.organizations[0].members?.length}
                  title={tCommon('members')}
                  icon={<UsersIcon fill="var(--bs-primary)" />}
                />
              </Col>
              <Col
                xs={6}
                sm={4}
                role="button"
                className="mb-4"
                onClick={(): void => {
                  navigate(peopleLink);
                }}
              >
                <DashBoardCard
                  count={data?.organizations[0].admins?.length}
                  title={tCommon('admins')}
                  icon={<AdminsIcon fill="var(--bs-primary)" />}
                />
              </Col>
              <Col
                xs={6}
                sm={4}
                role="button"
                className="mb-4"
                onClick={(): void => {
                  navigate(postsLink);
                }}
              >
                <DashBoardCard
                  count={postData?.organizations[0].posts.totalCount}
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
                  navigate(eventsLink);
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
                  navigate(blockUserLink);
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
                  navigate(requestLink);
                }}
              >
                <DashBoardCard
                  count={data?.organizations[0].membershipRequests?.length}
                  title={tCommon('requests')}
                  icon={<UsersIcon fill="var(--bs-primary)" />}
                />
              </Col>
            </Row>
          )}
          <Row>
            <Col lg={6} className="mb-4">
              <Card border="0" className="rounded-4">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{t('upcomingEvents')}</div>
                  <Button
                    size="sm"
                    variant="light"
                    data-testid="viewAllEvents"
                    onClick={(): void => navigate(eventsLink)}
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
                            data-testid="cardItem"
                            type="Event"
                            key={event._id}
                            startdate={event.startDate}
                            enddate={event.endDate}
                            title={event.title}
                            location={event.location}
                          />
                        );
                      },
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
                    onClick={(): void => navigate(postsLink)}
                  >
                    {t('viewAll')}
                  </Button>
                </div>
                <Card.Body className={styles.cardBody}>
                  {loadingPost ? (
                    [...Array(4)].map((_, index) => {
                      return <CardItemLoading key={index} />;
                    })
                  ) : postData?.organizations[0].posts.totalCount == 0 ? (
                    /* eslint-disable */
                    <div className={styles.emptyContainer}>
                      <h6>{t('noPostsPresent')}</h6>
                    </div>
                  ) : (
                    /* eslint-enable */
                    postData?.organizations[0].posts.edges
                      .slice(0, 5)
                      .map((edge) => {
                        const post = edge.node;
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
              <div className={styles.cardTitle}>{t('membershipRequests')}</div>
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
    </>
  );
}

export default organizationDashboard;
