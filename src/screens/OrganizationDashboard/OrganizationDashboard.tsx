
import { useQuery } from '@apollo/client';
import React, { useEffect, useState, useRef, JSX } from 'react';
import { Button, Card } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import {
  GET_ORGANIZATION_MEMBERS_PG,
  GET_ORGANIZATION_POSTS_COUNT_PG,
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_POSTS_PG,
  GET_ORGANIZATION_BLOCKED_USERS_PG,
  GET_ORGANIZATION_VENUES_PG,
  MEMBERSHIP_REQUEST,
} from 'GraphQl/Queries/Queries';
import AdminsIcon from 'assets/svgs/admin.svg?react';
import BlockedUsersIcon from 'assets/svgs/blockedUser.svg?react';
import EventsIcon from 'assets/svgs/events.svg?react';
import PostsIcon from 'assets/svgs/post.svg?react';
import UsersIcon from 'assets/svgs/users.svg?react';
import VenuesIcon from 'assets/svgs/venues.svg?react';
import CardItem from 'components/OrganizationDashCards/CardItem/CardItem';
import CardItemLoading from 'components/OrganizationDashCards/CardItem/Loader/CardItemLoading';
import DashBoardCard from 'components/OrganizationDashCards/DashboardCard';
import DashboardCardLoading from 'components/OrganizationDashCards/Loader/DashboardCardLoading';
import { Navigate, useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import type {
  IEvent,
  InterfaceOrganizationMembersConnectionEdgePg,
  InterfaceOrganizationPg,
  InterfaceOrganizationPostsConnectionEdgePg,
} from 'utils/interfaces';
import styles from '../../style/app-fixed.module.css';

function OrganizationDashboard(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');
  document.title = t('title');
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [memberCount, setMemberCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [venueCount, setVenueCount] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);
  const postsLink = `/orgpost/${orgId}`;
  const eventsLink = `/orgevents/${orgId}`;
  const blockUserLink = `/blockuser/${orgId}`;
  const requestLink = `/requests/${orgId}`;
  const venuesLink = `/orgvenues/${orgId}`;

  const { data: membershipRequestData, loading: loadingMembershipRequests } =
    useQuery(MEMBERSHIP_REQUEST, {
      variables: {
        input: {
          id: orgId,
        },
        first: 8,
        skip: 0,
        firstName_contains: '',
      },
    });

  const hasFetchedAllMembers = useRef(false);
  const hasFetchedAllEvents = useRef(false);
  const hasFetchedAllBlockedUsers = useRef(false);
  const hasFetchedAllVenues = useRef(false);

  const {
    data: orgMemberData,
    loading: orgMemberLoading,
    error: orgMemberError,
    fetchMore,
  } = useQuery<InterfaceOrganizationPg>(GET_ORGANIZATION_MEMBERS_PG, {
    variables: { id: orgId, first: 32, after: null },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (orgMemberData && !hasFetchedAllMembers.current) {
      let newAdminCount = 0;
      let newMemberCount = 0;

      orgMemberData.organization.members.edges.forEach(
        (member: InterfaceOrganizationMembersConnectionEdgePg) => {
          if (member.node.role === 'administrator') {
            newAdminCount += 1;
          }
          newMemberCount += 1;
        },
      );

      setAdminCount(newAdminCount);
      setMemberCount(newMemberCount);

      if (orgMemberData.organization.members.pageInfo.hasNextPage) {
        fetchMore({
          variables: {
            id: orgId,
            first: 32,
            after: orgMemberData.organization.members.pageInfo.endCursor,
          },
        });
      } else {
        hasFetchedAllMembers.current = true;
      }
    }
  }, [orgMemberData, fetchMore, orgId]);

  const {
    data: orgPostsData,
    loading: orgPostsLoading,
    error: orgPostsError,
  } = useQuery(GET_ORGANIZATION_POSTS_COUNT_PG, { variables: { id: orgId } });

  const {
    data: orgEventsData,
    loading: orgEventsLoading,
    error: orgEventsError,
  } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
    variables: { id: orgId, first: 50, after: null },
  });

  const {
    data: orgBlockedUsersData,
    loading: orgBlockedUsersLoading,
    error: orgBlockedUsersError,
    fetchMore: fetchMoreBlockedUsers,
  } = useQuery(GET_ORGANIZATION_BLOCKED_USERS_PG, {
    variables: { id: orgId, first: 32, after: null },
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: orgVenuesData,
    loading: venuesLoading,
    error: venuesError,
    fetchMore: fetchMoreVenues,
  } = useQuery<{
    organization: {
      venues: {
        edges: Array<{
          node: { id: string; name: string; description?: string };
        }>;
        pageInfo: { hasNextPage: boolean; endCursor: string };
      };
    };
  }>(GET_ORGANIZATION_VENUES_PG, {
    variables: { id: orgId, first: 32, after: null },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (orgEventsData && !hasFetchedAllEvents.current) {
      const now = new Date();

      const allEvents = orgEventsData.organization.events.edges;

      const newTotalEventCount = allEvents.length;

      const upcomingEvents = allEvents.filter((event: IEvent) => {
        // Filter events that start after the current date
        return new Date(event?.node?.startAt) > now;
      });

      setEventCount((prevCount) => prevCount + newTotalEventCount);

      setUpcomingEvents((prevEvents) => [...prevEvents, ...upcomingEvents]);

      if (orgEventsData.organization.events.pageInfo.hasNextPage) {
        fetchMore({
          variables: {
            id: orgId,
            first: 32,
            after: orgEventsData.organization.events.pageInfo.endCursor,
          },
        });
      } else {
        hasFetchedAllEvents.current = true;
      }
    }
  }, [orgEventsData, fetchMore, orgId]);

  useEffect(() => {
    if (orgBlockedUsersData && !hasFetchedAllBlockedUsers.current) {
      const newBlockedUserCount =
        orgBlockedUsersData.organization.blockedUsers.edges.length;

      setBlockedCount((prevCount) => prevCount + newBlockedUserCount);

      if (orgBlockedUsersData.organization.blockedUsers.pageInfo.hasNextPage) {
        fetchMoreBlockedUsers({
          variables: {
            id: orgId,
            first: 32,
            after:
              orgBlockedUsersData.organization.blockedUsers.pageInfo.endCursor,
          },
        });
      } else {
        hasFetchedAllBlockedUsers.current = true;
      }
    }
  }, [orgBlockedUsersData, fetchMoreBlockedUsers, orgId]);

  useEffect(() => {
    if (orgVenuesData && !hasFetchedAllVenues.current) {
      const newVenueCount = orgVenuesData.organization.venues.edges.length;

      setVenueCount((prevCount) => prevCount + newVenueCount);

      if (orgVenuesData.organization.venues.pageInfo.hasNextPage) {
        fetchMoreVenues({
          variables: {
            id: orgId,
            first: 32,
            after: orgVenuesData.organization.venues.pageInfo.endCursor,
          },
        });
      } else {
        hasFetchedAllVenues.current = true;
      }
    }
  }, [orgVenuesData, fetchMoreVenues, orgId]);
  const {
    data: postData,
    loading: loadingPost,
    error: errorPost,
  } = useQuery(GET_ORGANIZATION_POSTS_PG, {
    variables: { id: orgId, first: 5 },
  });

  useEffect(() => {
    if (
      errorPost ||
      orgPostsError ||
      orgMemberError ||
      orgEventsError ||
      orgBlockedUsersError ||
      venuesError
    ) {
      toast.error(tErrors('errorLoading', { entity: '' }));
      navigate('/');
    }
  }, [
    orgPostsError,
    errorPost,
    orgMemberError,
    orgEventsError,
    orgBlockedUsersError,
    venuesError,
  ]);

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <>
      <Row className="mt-4">
        <Col xl={8}>
          {orgMemberLoading ||
          orgPostsLoading ||
          orgEventsLoading ||
          orgBlockedUsersLoading ||
          venuesLoading ? (
            <Row style={{ display: 'flex' }}>
              {[...Array(7)].map((_, index) => {
                return (
                  <Col
                    xs={6}
                    sm={4}
                    className="mb-4"
                    key={`orgLoading_${index}`}
                    data-testid="fallback-ui"
                  >
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
                data-testid="membersCount"
                onClick={(): void => {
                }}
              >
                <DashBoardCard
                  count={memberCount}
                  title={tCommon('members')}
                  icon={<UsersIcon fill="#555555" />}
                />
              </Col>
              <Col
                xs={6}
                sm={4}
                role="button"
                className="mb-4"
                data-testid="adminsCount"
                onClick={(): void => {
                }}
              >
                <DashBoardCard
                  count={adminCount}
                  title={tCommon('admins')}
                  icon={<AdminsIcon fill="#555555" />}
                />
              </Col>
              <Col
                xs={6}
                sm={4}
                role="button"
                className="mb-4"
                data-testid="postsCount"
                onClick={async (): Promise<void> => {
                  await navigate(postsLink);
                }}
              >
                <DashBoardCard
                  count={orgPostsData?.organization.postsCount}
                  title={t('posts')}
                  icon={<PostsIcon fill="#555555" />}
                />
              </Col>
              <Col
                xs={6}
                sm={4}
                role="button"
                className="mb-4"
                data-testid="eventsCount"
                onClick={async (): Promise<void> => {
                  await navigate(eventsLink);
                }}
              >
                <DashBoardCard
                  count={eventCount}
                  title={t('events')}
                  icon={<EventsIcon fill="#555555" />}
                />
              </Col>
              <Col
                xs={6}
                sm={4}
                role="button"
                className="mb-4"
                data-testid="blockedUsersCount"
                onClick={async (): Promise<void> => {
                  await navigate(blockUserLink);
                }}
              >
                <DashBoardCard
                  count={blockedCount}
                  title={t('blockedUsers')}
                  icon={<BlockedUsersIcon fill="#555555" />}
                />
              </Col>
              <Col
                xs={6}
                sm={4}
                role="button"
                className="mb-4"
                onClick={async (): Promise<void> => {
                  await navigate(requestLink);
                }}
              >
                <DashBoardCard
                  count={
                    membershipRequestData?.organization?.membershipRequests?.filter(
                      (request: { status: string }) =>
                        request.status === 'pending',
                    )?.length
                  }
                  title={tCommon('requests')}
                  icon={<UsersIcon fill="#555555" />}
                />
              </Col>
              <Col
                xs={6}
                sm={4}
                role="button"
                className="mb-4"
                data-testid="venuesCount"
                onClick={async (): Promise<void> => {
                  await navigate(venuesLink);
                }}
              >
                <DashBoardCard
                  count={venueCount}
                  title={t('venues')}
                  icon={<VenuesIcon fill="#555555" />}
                />
              </Col>
            </Row>
          )}
          <Row>
            <Col lg={6} className="mb-4 ">
              <Card border="0" className="rounded-4 ">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{t('upcomingEvents')}</div>
                  <Button
                    size="sm"
                    variant="light"
                    data-testid="viewAllEvents"
                    onClick={async (): Promise<void> => {
                      await navigate(eventsLink);
                    }}
                  >
                    {t('viewAll')}
                  </Button>
                </div>
                <Card.Body className={styles.containerBody}>
                  {orgEventsLoading ? (
                    [...Array(4)].map((_, index) => (
                      <CardItemLoading key={`eventLoading_${index}`} />
                    ))
                  ) : upcomingEvents?.length === 0 ? (
                    <div className={styles.emptyContainer}>
                      <h6>{t('noUpcomingEvents')}</h6>
                    </div>
                  ) : (
                    [...upcomingEvents]
                      .sort(
                        (a, b) =>
                          new Date(a.node.startAt).getTime() -
                          new Date(b.node.startAt).getTime(),
                      )
                      .slice(0, 10)
                      .map((event) => {
                        return (
                          <CardItem
                            data-testid="cardItem"
                            type="Event"
                            key={event.node.id}
                            startdate={event?.node.startAt}
                            enddate={event?.node.endAt}
                            title={event?.node.name}
                          />
                        );
                      })
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6} className="mb-4 ">
              <Card className="rounded-4 border-2 border-gray-300">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{t('latestPosts')}</div>
                  <Button
                    size="sm"
                    variant="light"
                    data-testid="viewAllPosts"
                    className=""
                    onClick={async (): Promise<void> => {
                      await navigate(postsLink);
                    }}
                  >
                    {t('viewAll')}
                  </Button>
                </div>
                <Card.Body className={styles.containerBody}>
                  {loadingPost ? (
                    [...Array(4)].map((_, index) => {
                      return <CardItemLoading key={`postLoading_${index}`} />;
                    })
                  ) : orgPostsData?.organization.postsCount == 0 ? (
                    <div className={styles.emptyContainer}>
                      <h6>{t('noPostsPresent')}</h6>
                    </div>
                  ) : (
                    postData?.organization.posts.edges
                      .slice(0, 5)
                      .map(
                        (edge: InterfaceOrganizationPostsConnectionEdgePg) => {
                          const post = edge.node;
                          return (
                            <CardItem
                              type="Post"
                              key={post.id}
                              title={post.caption}
                              time={post.createdAt}
                              creator={{
                                id: post.creator.id,
                                name: post.creator.name,
                              }}
                            />
                          );
                        },
                      )
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xl={4}>
          <Row className="mb-4">
            <Card border="0" className="rounded-4" style={{ height: '220px' }}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  {t('membershipRequests')}
                </div>
                <Button
                  size="sm"
                  variant="light"
                  data-testid="viewAllMembershipRequests"
                  onClick={async (): Promise<void> => {
                    await navigate(requestLink);
                  }}
                >
                  {t('viewAll')}
                </Button>
              </div>
              <Card.Body
                className={styles.containerBody}
                style={{ height: '150px' }}
              >
                {loadingMembershipRequests ? (
                  [...Array(4)].map((_, index) => (
                    <CardItemLoading key={`requestsLoading_${index}`} />
                  ))
                ) : membershipRequestData?.organization?.membershipRequests?.filter(
                    (request: { status: string }) =>
                      request.status === 'pending',
                  ).length === 0 ? (
                  <div
                    className={styles.emptyContainer}
                    style={{ height: '150px' }}
                  >
                    <h6>{t('noMembershipRequests')}</h6>
                  </div>
                ) : (
                  membershipRequestData?.organization?.membershipRequests
                    .filter(
                      (request: { status: string }) =>
                        request.status === 'pending',
                    )
                    .slice(0, 8)
                    .map(
                      (request: {
                        status: string;
                        membershipRequestId: string;
                        user: { name: string };
                      }) => (
                        <CardItem
                          type="MembershipRequest"
                          key={request.membershipRequestId}
                          title={request.user.name}
                        />
                      ),
                    )
                )}
              </Card.Body>
            </Card>
          </Row>
          <Row>
            <Card border="0" className="rounded-4">
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>{t('volunteerRankings')}</div>
                <Button
                  size="sm"
                  variant="light"
                  data-testid="viewAllLeadeboard"
                  onClick={async (): Promise<void> => {
                    await Promise.resolve(toast.success(t('comingSoon')));
                  }}
                >
                  {t('viewAll')}
                </Button>
              </div>
              <Card.Body
                className={styles.containerBody}
                style={{ padding: '0px' }}
              >
                <div className={styles.emptyContainer}>
                  <h6>{t('comingSoon')}</h6>
                </div>
              </Card.Body>
            </Card>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default OrganizationDashboard;
