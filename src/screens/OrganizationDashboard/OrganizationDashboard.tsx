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
 * - Displays loading states and handles errors using `react-toastify`.
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
import { Button, Card } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import {
  GET_ORGANIZATION_POSTS_COUNT_PG,
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_POSTS_PG,
  MEMBERSHIP_REQUEST,
  ORGANIZATION_MEMBER_ADMIN_COUNT,
  GET_ORGANIZATION_BLOCKED_USERS_COUNT,
  GET_ORGANIZATION_VENUES_COUNT,
} from 'GraphQl/Queries/Queries';
import UsersIcon from 'assets/svgs/users.svg?react';
import CardItem from 'components/OrganizationDashCards/CardItem/CardItem';
import CardItemLoading from 'components/OrganizationDashCards/CardItem/Loader/CardItemLoading';
import DashBoardCard from 'components/OrganizationDashCards/DashboardCard';
import { Navigate, useNavigate, useParams } from 'react-router';
// import { Navigate, useNavigate, useParams } from 'react-router';
// import gold from 'assets/images/gold.png';
// import silver from 'assets/images/silver.png';
// import bronze from 'assets/images/bronze.png';
import { toast } from 'react-toastify';
import DashboardStats from './components/DashboardStats';
import UpcomingEventsCard from './components/UpcomingEventsCard';
import type {
  IEvent,
  InterfaceOrganizationPg,
  InterfaceOrganizationPostsConnectionEdgePg,
} from 'utils/interfaces';
import styles from '../../style/app-fixed.module.css';
// import { VOLUNTEER_RANKING } from 'GraphQl/Queries/EventVolunteerQueries';

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
  const [venueCount, setVenueCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }
  // const currentDate = dayjs().toISOString();

  // const leaderboardLink = `/leaderboard/${orgId}`;
  // const peopleLink = `/orgpeople/${orgId}`;
  const postsLink = `/orgpost/${orgId}`;
  const eventsLink = `/orgevents/${orgId}`;
  const venuesLink = `/orgvenues/${orgId}`;
  const blockUserLink = `/blockuser/${orgId}`;
  const requestLink = `/requests/${orgId}`;

  /**
   * Query to fetch organization data.
   */

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

  const {
    data: orgMemberData,
    loading: orgMemberLoading,
    error: orgMemberError,
  } = useQuery<InterfaceOrganizationPg>(ORGANIZATION_MEMBER_ADMIN_COUNT, {
    variables: { id: orgId },
  });

  useEffect(() => {
    if (orgMemberData) {
      setAdminCount(orgMemberData.organization.adminsCount);
      setMemberCount(orgMemberData.organization.membersCount);
    }
  }, [orgMemberData, orgId]);

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
    variables: { id: orgId, first: 8, after: null, upcomingOnly: true },
  });

  const {
    data: orgBlockedUsersData,
    loading: orgBlockedUsersLoading,
    error: orgBlockedUsersError,
  } = useQuery(GET_ORGANIZATION_BLOCKED_USERS_COUNT, {
    variables: { id: orgId },
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: orgVenuesData,
    loading: orgVenuesLoading,
    error: orgVenuesError,
  } = useQuery(GET_ORGANIZATION_VENUES_COUNT, {
    variables: { id: orgId },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (orgEventsData) {
      const allEvents = orgEventsData.organization.events.edges;

      // Set to actual total count since fetchMore accumulates results
      setEventCount(orgEventsData.organization.eventsCount);

      // The API already filters for upcoming events due to upcomingOnly: true
      setUpcomingEvents(allEvents);
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
      toast.error(tErrors('errorLoading', { entity: '' }));
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
            membershipRequestData?.organization?.membershipRequestsCount >
              0 && (
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
                      count={
                        membershipRequestData?.organization
                          ?.membershipRequestsCount
                      }
                      title={tCommon('requests')}
                      icon={<UsersIcon fill="#555555" />}
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
