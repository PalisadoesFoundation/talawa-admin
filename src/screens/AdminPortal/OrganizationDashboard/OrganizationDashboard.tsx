/**
 * OrganizationDashboard Component
 *
 * This component renders the dashboard for an organization, displaying
 * various statistics and information such as member count, admin count,
 * posts, events, and upcoming events. It also provides navigation to
 * related sections like posts and events.
 *

 * @returns  The rendered OrganizationDashboard component.
 *
 * @remarks
 * - Uses Apollo Client's `useQuery` to fetch data for members, posts, and events.
 * - Displays loading states and handles errors using `NotificationToast`.
 * - Utilizes `react-bootstrap` for layout and styling.
 * - Integrates with `react-router-dom` for navigation.
 * - Supports internationalization using `react-i18next`.
 *
 *
 * @example
 * ```tsx
 * <OrganizationDashboard />
 * ```
 *

 */
import { useQuery } from '@apollo/client';
import React, { useEffect, useState, JSX } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import {
  GET_ORGANIZATION_POSTS_COUNT_PG,
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_POSTS_PG,
  MEMBERSHIP_REQUEST_PG,
  ORGANIZATION_MEMBER_ADMIN_COUNT,
  GET_ORGANIZATION_BLOCKED_USERS_COUNT,
  GET_ORGANIZATION_VENUES_COUNT,
} from 'GraphQl/Queries/Queries';
import UsersIcon from 'assets/svgs/users.svg?react';
import CardItem from 'components/AdminPortal/OrganizationDashCards/CardItem/CardItem';
import CardItemLoading from 'components/AdminPortal/OrganizationDashCards/CardItem/Loader/CardItemLoading';
import DashBoardCard from 'components/AdminPortal/OrganizationDashCards/DashboardCard';
import { Navigate, useNavigate, useParams } from 'react-router';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import DashboardStats from './components/DashboardStats';
import UpcomingEventsCard from './components/UpcomingEventsCard';
import type {
  IEvent,
  InterfaceOrganizationPg,
  InterfaceOrganizationPostsConnectionEdgePg,
} from 'utils/interfaces';
import styles from './OrganizationDashboard.module.css';
// import { VOLUNTEER_RANKING } from 'GraphQl/Queries/EventVolunteerQueries';

function OrganizationDashboard(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');
  document.title = t('title');
  const { orgId } = useParams();
  const navigate = useNavigate();

  // State hooks - must be called before any conditional returns
  const [memberCount, setMemberCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [venueCount, setVenueCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);

  /**
   * Query to fetch organization data.
   * All hooks must be called before the conditional return to comply with React's Rules of Hooks.
   */

  const { data: membershipRequestData, loading: loadingMembershipRequests } =
    useQuery(MEMBERSHIP_REQUEST_PG, {
      variables: {
        input: {
          id: orgId ?? '',
        },
        first: 8,
        skip: 0,
        name_contains: '',
      },
      skip: !orgId,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    });

  const {
    data: orgMemberData,
    loading: orgMemberLoading,
    error: orgMemberError,
  } = useQuery<InterfaceOrganizationPg>(ORGANIZATION_MEMBER_ADMIN_COUNT, {
    variables: { id: orgId ?? '' },
    skip: !orgId,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  const {
    data: orgPostsData,
    loading: orgPostsLoading,
    error: orgPostsError,
  } = useQuery(GET_ORGANIZATION_POSTS_COUNT_PG, {
    variables: { id: orgId ?? '' },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: orgEventsData,
    loading: orgEventsLoading,
    error: orgEventsError,
  } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
    variables: { id: orgId ?? '', first: 8, after: null },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: orgBlockedUsersData,
    loading: orgBlockedUsersLoading,
    error: orgBlockedUsersError,
  } = useQuery(GET_ORGANIZATION_BLOCKED_USERS_COUNT, {
    variables: { id: orgId ?? '' },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: orgVenuesData,
    loading: orgVenuesLoading,
    error: orgVenuesError,
  } = useQuery(GET_ORGANIZATION_VENUES_COUNT, {
    variables: { id: orgId ?? '' },
    skip: !orgId,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  // Effect hooks - must be called before conditional return
  useEffect(() => {
    if (orgMemberData) {
      setAdminCount(orgMemberData.organization.adminsCount);
      setMemberCount(orgMemberData.organization.membersCount);
    }
  }, [orgMemberData, orgId]);

  useEffect(() => {
    if (orgEventsData) {
      const now = new Date();

      const allEvents = orgEventsData.organization.events.edges;

      const upcomingEvents = allEvents.filter((event: IEvent) => {
        // Filter events that start after the current date
        return new Date(event?.node?.startAt) > now;
      });

      // Set to actual total count since fetchMore accumulates results
      setEventCount(orgEventsData.organization.eventsCount);

      // For upcoming events, we need to replace with new filtered results
      setUpcomingEvents(upcomingEvents);
    }
  }, [orgEventsData, orgId]);

  useEffect(() => {
    if (orgBlockedUsersData) {
      // Set to actual total count since fetchMore accumulates results
      setBlockedCount(orgBlockedUsersData.organization.blockedUsersCount);
    }
  }, [orgBlockedUsersData, orgId]);

  useEffect(() => {
    if (orgVenuesData) {
      // Set to actual total count since fetchMore accumulates results
      setVenueCount(orgVenuesData.organization.venuesCount);
    }
  }, [orgVenuesData]);

  // Conditional return - comes AFTER all hooks
  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  // const currentDate = dayjs().toISOString();

  // const leaderboardLink = `/admin/leaderboard/${orgId}`;
  // const peopleLink = `/admin/orgpeople/${orgId}`;
  const postsLink = `/admin/orgpost/${orgId}`;
  const eventsLink = `/admin/orgevents/${orgId}`;
  const venuesLink = `/admin/orgvenues/${orgId}`;
  const blockUserLink = `/admin/blockuser/${orgId}`;
  const requestLink = `/admin/requests/${orgId}`;

  /**
   * Query to fetch vvolunteer rankings.
   */
  // const {
  //   data: rankingsData,
  //   loading: rankingsLoading,
  //   // error: errorRankings,
  // }: {
  //   data?: {
  //     getVolunteerRanks: InterfaceVolunteerRank[];
  //   };
  //   loading: boolean;
  //   error?: ApolloError;
  // } = useQuery(VOLUNTEER_RANKING, {
  //   variables: {
  //     orgId,
  //     where: {
  //       orderBy: 'hours_DESC',
  //       timeFrame: 'allTime',
  //       limit: 3,
  //     },
  //   },
  // });

  // const rankings = useMemo(
  //   () => rankingsData?.getVolunteerRanks || [],
  //   [rankingsData],
  // );

  /**
   * Query to fetch posts for the organization.
   */
  const {
    data: postData,
    loading: loadingPost,
    error: errorPost,
  } = useQuery(GET_ORGANIZATION_POSTS_PG, {
    variables: { id: orgId, first: 5 },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  /**
   * UseEffect to handle errors and navigate if necessary.
   */
  useEffect(() => {
    if (
      errorPost ||
      orgPostsError ||
      orgMemberError ||
      orgEventsError ||
      orgBlockedUsersError ||
      orgVenuesError
    ) {
      NotificationToast.error(
        tErrors('errorLoading', { entity: '' }) as string,
      );
      navigate('/');
    }
  }, [
    orgPostsError,
    errorPost,
    orgMemberError,
    orgEventsError,
    orgBlockedUsersError,
    orgVenuesError,
  ]);

  const membershipRequests =
    membershipRequestData?.organization?.membershipRequests ?? [];
  const pendingMembershipRequests = membershipRequests.filter(
    (request: { status: string }) => request.status === 'pending',
  );

  return (
    <>
      <Row className="mt-4">
        <Col xl={8}>
          <DashboardStats
            memberCount={memberCount}
            adminCount={adminCount}
            eventCount={eventCount}
            venueCount={venueCount}
            blockedCount={blockedCount}
            postsCount={orgPostsData?.organization.postsCount}
            isLoading={
              orgMemberLoading ||
              orgPostsLoading ||
              orgEventsLoading ||
              orgBlockedUsersLoading ||
              orgVenuesLoading
            }
            onMembersClick={async (): Promise<void> => {
              // navigate(peopleLink);
            }}
            onAdminsClick={async (): Promise<void> => {
              // navigate(adminLink);
            }}
            onPostsClick={async (): Promise<void> => {
              await navigate(postsLink);
            }}
            onEventsClick={async (): Promise<void> => {
              await navigate(eventsLink);
            }}
            onVenuesClick={async (): Promise<void> => {
              await navigate(venuesLink);
            }}
            onBlockedUsersClick={async (): Promise<void> => {
              await navigate(blockUserLink);
            }}
          />
          {membershipRequestData?.organization &&
            pendingMembershipRequests.length > 0 && (
              <Row>
                <Col xs={6} sm={4} className="mb-4">
                  <button
                    type="button"
                    className="p-0 m-0 border-0 bg-transparent w-100 text-start"
                    onClick={(): void => {
                      navigate(requestLink);
                    }}
                    aria-label={tCommon('requests')}
                  >
                    <DashBoardCard
                      count={pendingMembershipRequests.length}
                      title={tCommon('requests')}
                      icon={<UsersIcon className={styles.requestsIcon} />}
                    />
                  </button>
                </Col>
              </Row>
            )}

          <Row>
            <UpcomingEventsCard
              upcomingEvents={upcomingEvents}
              eventLoading={orgEventsLoading}
              onViewAllEventsClick={async (): Promise<void> => {
                await navigate(eventsLink);
              }}
            />

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
                  <LoadingState
                    isLoading={loadingPost}
                    variant="custom"
                    customLoader={[...Array(4)].map((_, index) => (
                      <CardItemLoading key={'postLoading_' + index} />
                    ))}
                  >
                    {orgPostsData?.organization.postsCount == 0 ? (
                      <div className={styles.emptyContainer}>
                        <h6>{t('noPostsPresent')}</h6>
                      </div>
                    ) : (
                      postData?.organization.posts.edges
                        .slice(0, 5)
                        .map(
                          (
                            edge: InterfaceOrganizationPostsConnectionEdgePg,
                          ) => {
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
                  </LoadingState>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xl={4}>
          <Row className="mb-4">
            <Card border="0" className="rounded-4">
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
              <Card.Body className={styles.containerBody}>
                <LoadingState
                  isLoading={loadingMembershipRequests}
                  variant="custom"
                  customLoader={[...Array(4)].map((_, index) => (
                    <CardItemLoading key={'requestsLoading_' + index} />
                  ))}
                >
                  {pendingMembershipRequests.length === 0 ? (
                    <div
                      className={`${styles.emptyContainer} ${styles.membershipEmptyContainer}`}
                    >
                      <h6>{t('noMembershipRequests')}</h6>
                    </div>
                  ) : (
                    pendingMembershipRequests
                      .slice(0, 8)
                      .map(
                        (request: {
                          status: string;
                          membershipRequestId: string;
                          user: { name: string; avatarURL?: string };
                        }) => (
                          <CardItem
                            type="MembershipRequest"
                            key={request.membershipRequestId}
                            title={request.user.name}
                            image={request.user.avatarURL}
                          />
                        ),
                      )
                  )}
                </LoadingState>
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
                    await Promise.resolve(
                      NotificationToast.success(t('comingSoon')),
                    );
                  }}
                >
                  {t('viewAll')}
                </Button>
              </div>
              <Card.Body className={`${styles.containerBody} p-0`}>
                {/* {rankingsLoading ? (
                  [...Array(3)].map((_, index) => {
                    return <CardItemLoading key={`rankingLoading_${index}`} />;
                  })
                ) : rankings.length == 0 ? (
                  <div className={styles.emptyContainer}>
                    <h6>{t('noVolunteers')}</h6>
                  </div>
                ) : (
                  rankings.map(({ rank, user, hoursVolunteered }, index) => {
                    return (
                      <div key={`ranking_${index}`}>
                        <div className="d-flex ms-4 mt-1 mb-3">
                          <div className="fw-bold me-2">
                            {rank <= 3 ? (
                              <img
                                src={
                                  rank === 1
                                    ? gold
                                    : rank === 2
                                      ? silver
                                      : bronze
                                }
                                alt="gold"
                                className={styles.rankings}
                              />
                            ) : (
                              rank
                            )}
                          </div>
                          <div className="me-2 mt-2">{`${user.firstName} ${user.lastName}`}</div>
                          <div className="mt-2">- {hoursVolunteered} hours</div>
                        </div>
                        {index < 2 && <hr />}
                      </div>
                    );
                  })
                )} */}
              </Card.Body>
            </Card>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default OrganizationDashboard;
