import { useQuery } from '@apollo/client';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Card } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';

import {
  GET_ORGANIZATION_MEMBERS_PG,
  GET_ORGANIZATION_POSTS_COUNT_PG,
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_POSTS_PG,
} from 'GraphQl/Queries/Queries';
import AdminsIcon from 'assets/svgs/admin.svg?react';
// import BlockedUsersIcon from 'assets/svgs/blockedUser.svg?react';
import EventsIcon from 'assets/svgs/events.svg?react';
import PostsIcon from 'assets/svgs/post.svg?react';
import UsersIcon from 'assets/svgs/users.svg?react';
import CardItem from 'components/OrganizationDashCards/CardItem';
import CardItemLoading from 'components/OrganizationDashCards/CardItemLoading';
import DashBoardCard from 'components/OrganizationDashCards/DashboardCard';
import DashboardCardLoading from 'components/OrganizationDashCards/DashboardCardLoading';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
// import { Navigate, useNavigate, useParams } from 'react-router-dom';
// import gold from 'assets/images/gold.png';
// import silver from 'assets/images/silver.png';
// import bronze from 'assets/images/bronze.png';
import { toast } from 'react-toastify';
import type {
  InterfaceEventPg,
  InterfaceOrganizationMembersConnectionEdgePg,
  InterfaceOrganizationPg,
  InterfaceOrganizationEventsConnectionEdgePg,
  InterfaceOrganizationPostsConnectionEdgePg,
} from 'utils/interfaces';
import styles from 'style/app.module.css';
// import { VOLUNTEER_RANKING } from 'GraphQl/Queries/EventVolunteerQueries';

/**
 * Component for displaying the organization dashboard.
 *
 * This component provides an overview of various statistics and information related to an organization, including members, admins, posts, events, blocked users, and membership requests. It also displays upcoming events and latest posts.
 *
 * @returns The rendered component.
 */

function OrganizationDashboard(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');
  document.title = t('title');
  const { orgId } = useParams();

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  const navigate = useNavigate();

  const [memberCount, setMemberCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<InterfaceEventPg[]>([]);

  // const currentDate = dayjs().toISOString();

  // const leaderboardLink = `/leaderboard/${orgId}`;
  // const peopleLink = `/orgpeople/${orgId}`;
  const postsLink = `/orgpost/${orgId}`;
  const eventsLink = `/orgevents/${orgId}`;
  // const blockUserLink = `/blockuser/${orgId}`;
  // const requestLink = '/requests';

  /**
   * Query to fetch organization data.
   */
  // const {

  const hasFetchedAllMembers = useRef(false);
  const hasFetchedAllEvents = useRef(false);

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
  } = useQuery(GET_ORGANIZATION_POSTS_COUNT_PG, {
    variables: { id: orgId },
  });

  const {
    data: orgEventsData,
    loading: orgEventsLoading,
    error: orgEventsError,
  } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
    variables: { id: orgId, first: 32, after: null },
  });

  useEffect(() => {
    if (orgEventsData && !hasFetchedAllEvents.current) {
      const now = new Date();

      const allEvents = orgEventsData.organization.events.edges;

      const newTotalEventCount = allEvents.length;

      const upcomingEvents = allEvents.filter(
        (event: InterfaceOrganizationEventsConnectionEdgePg) =>
          new Date(event?.node?.event?.startAt) > now,
      );

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
      }
    }
  }, [orgEventsData, fetchMore, orgId]);

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
    if (errorPost || orgPostsError || orgMemberError || orgEventsError) {
      toast.error(tErrors('errorLoading', { entity: '' }));
      navigate('/');
    }
  }, [orgPostsError, errorPost, orgMemberError, orgEventsError]);

  return (
    <>
      <Row className="mt-4">
        <Col xl={8}>
          {orgMemberLoading || orgPostsLoading || orgEventsLoading ? (
            <Row style={{ display: 'flex' }}>
              {[...Array(6)].map((_, index) => {
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
                  // navigate(peopleLink);
                }}
              >
                <DashBoardCard
                  count={memberCount}
                  title={tCommon('members')}
                  icon={<UsersIcon fill="var(--bs-primary)" />}
                />
              </Col>
              <Col
                xs={6}
                sm={4}
                role="button"
                className="mb-4"
                data-testid="adminsCount"
                onClick={(): void => {
                  // navigate(peopleLink);
                }}
              >
                <DashBoardCard
                  count={adminCount}
                  title={tCommon('admins')}
                  icon={<AdminsIcon fill="var(--bs-primary)" />}
                />
              </Col>
              <Col
                xs={6}
                sm={4}
                role="button"
                className="mb-4"
                data-testid="postsCount"
                onClick={(): void => {
                  navigate(postsLink);
                }}
              >
                <DashBoardCard
                  count={orgPostsData?.organization.postsCount}
                  title={t('posts')}
                  icon={<PostsIcon fill="var(--bs-primary)" />}
                />
              </Col>
              <Col
                xs={6}
                sm={4}
                role="button"
                className="mb-4"
                data-testid="eventsCount"
                onClick={(): void => {
                  navigate(eventsLink);
                }}
              >
                <DashBoardCard
                  count={eventCount}
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
                  // navigate(blockUserLink);
                }}
              >
                {/* <DashBoardCard
                  count={data?.organizations[0].blockedUsers?.length}
                  title={t('blockedUsers')}
                  icon={<BlockedUsersIcon fill="var(--bs-primary)" />}
                /> */}
              </Col>
              <Col
                xs={6}
                sm={4}
                role="button"
                className="mb-4"
                // onClick={(): void => {
                //   navigate(requestLink);
                // }}
              >
                {/* <DashBoardCard
                  count={data?.organizations[0].membershipRequests?.length}
                  title={tCommon('requests')}
                  icon={<UsersIcon fill="var(--bs-primary)" />}
                /> */}
              </Col>
            </Row>
          )}
          <Row>
            <Col lg={6} className="mb-4">
              <Card border="0" className="rounded-4">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{t('upcomingEvents')}</div>
                  <Button size="sm" variant="light" data-testid="viewAllEvents">
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
                    upcomingEvents?.map((event) => {
                      return (
                        <CardItem
                          data-testid="cardItem"
                          type="Event"
                          key={event.event.id}
                          startdate={event?.event?.startAt}
                          enddate={event?.event?.endAt}
                          title={event.event?.name}
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
                  <div className={styles.cardTitle}>{t('latestPosts')}</div>
                  <Button
                    size="sm"
                    variant="light"
                    data-testid="viewAllPosts"
                    // onClick={(): void => navigate(postsLink)}
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
                  onClick={(): void => {
                    toast.success('Coming soon!');
                  }}
                >
                  {t('viewAll')}
                </Button>
              </div>
              {/* <Card.Body */}
              {/* className={styles.containerBody} */}
              {/* style={{ height: '150px' }} */}
              {/* > */}
              {/* {loadingOrgData ? ( */}
              {/* [...Array(4)].map((_, index) => { */}
              {/* return <CardItemLoading key={`requestsLoading_${index}`} />; */}
              {/* }) */}
              {/* ) : data?.organizations[0].membershipRequests.length == 0 ? ( */}
              <div
                className={styles.emptyContainer}
                style={{ height: '150px' }}
              >
                <h6>{t('noMembershipRequests')}</h6>
              </div>
              {/* ) : ( */}
              {/* data?.organizations[0]?.membershipRequests */}
              {/* .slice(0, 8) */}
              {/* .map((request) => { */}
              {/* return ( */}
              {/* <CardItem */}
              {/* type="MembershipRequest" */}
              {/* key={request._id} */}
              {/* title={`${request.user.firstName} ${request.user.lastName}`} */}
              {/* /> */}
              {/* ); */}
              {/* }) */}
              {/* )} */}
              {/* </Card.Body> */}
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
                  // onClick={(): void => navigate(leaderboardLink)}
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
