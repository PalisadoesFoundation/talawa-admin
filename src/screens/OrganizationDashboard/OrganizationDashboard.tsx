import React, { JSX } from 'react';
import { Button, Card } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import type { IEvent } from 'utils/interfaces';
import styles from '../../style/app-fixed.module.css';
import { useDashboardData } from './hooks/useDashboardData';
import DashboardCards from './components/DashboardCards';

/**
 * Main dashboard for organization overview - shows all the key stats at a glance.
 *
 * Displays member/admin counts, upcoming events, membership requests, venues, and posts.
 * Uses PostgreSQL pagination for efficient data loading. Each section has a "view all"
 * button that takes you to the detailed page.
 *
 * @returns The dashboard component
 */
function OrganizationDashboard(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'dashboard' });
  const { t: tErrors } = useTranslation('errors');
  document.title = t('title');
  const { orgId } = useParams();
  const navigate = useNavigate();

  // Use custom hook for dashboard data
  const {
    memberCount,
    adminCount,
    eventCount,
    blockedCount,
    venueCount,
    postsCount,
    upcomingEvents,
    membershipRequestData,
    loadingMembershipRequests,
    isLoading,
    hasError,
  } = useDashboardData({ orgId, tErrors });

  // Navigate to home on error
  React.useEffect(() => {
    if (hasError) {
      navigate('/');
    }
  }, [hasError, navigate]);

  const postsLink = `/orgpost/${orgId}`;
  const eventsLink = `/orgevents/${orgId}`;
  const blockUserLink = `/blockuser/${orgId}`;
  const requestLink = `/requests/${orgId}`;
  const venuesLink = `/orgvenues/${orgId}`;

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <>
      {isLoading && <div data-testid="fallback-ui">Loading...</div>}
      <Row>
        <Col lg={6}>
          <DashboardCards
            memberCount={memberCount}
            adminCount={adminCount}
            eventCount={eventCount}
            postsCount={postsCount}
            blockedCount={blockedCount}
            venueCount={venueCount}
            membershipRequestsCount={
              membershipRequestData?.organization.membershipRequests.length || 0
            }
            postsLink={postsLink}
            eventsLink={eventsLink}
            blockUserLink={blockUserLink}
            requestLink={requestLink}
            venuesLink={venuesLink}
            isLoading={isLoading}
            navigate={navigate}
          />
        </Col>
        <Col lg={6}>
          <Row className="g-4">
            <Card
              data-testid="upcomingEventsDashboard"
              className={styles.dashboardCard}
            >
              <Card.Header>
                <h5
                  className={styles.dashboardCardHeader}
                  data-testid="upcomingEventsCardHeader"
                >
                  {t('upcomingEvents')}
                </h5>
              </Card.Header>
              <Card.Body
                className={styles.containerBody}
                style={{ paddingBottom: '8px' }}
              >
                {upcomingEvents && upcomingEvents.length > 0 ? (
                  upcomingEvents.slice(0, 3).map((event: IEvent) => (
                    <div
                      key={event?.node?.id}
                      className={styles.cardItemContainer}
                      data-testid="upcomingEventItem"
                    >
                      <h6 className="fs-6 fw-bold">{event?.node?.name}</h6>
                      <p className="fs-6 text-muted">
                        {new Date(event?.node?.startAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyContainer}>
                    <h6>{t('noUpcomingEvents')}</h6>
                  </div>
                )}
              </Card.Body>
              <Card.Footer>
                <Button
                  data-testid="viewAllEvents"
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate(eventsLink)}
                >
                  {t('viewAll')}
                </Button>
              </Card.Footer>
            </Card>

            <Card
              data-testid="membershipRequestsDashboard"
              className={styles.dashboardCard}
            >
              <Card.Header>
                <h5
                  className={styles.dashboardCardHeader}
                  data-testid="membershipRequestsCardHeader"
                >
                  {t('membershipRequests')}
                </h5>
              </Card.Header>
              <Card.Body
                className={styles.containerBody}
                style={{ paddingBottom: '8px' }}
              >
                {loadingMembershipRequests ? (
                  <>
                    <div className={styles.cardItemLoading}>
                      <div className={styles.memberLoading}></div>
                    </div>
                    <div className={styles.cardItemLoading}>
                      <div className={styles.memberLoading}></div>
                    </div>
                    <div className={styles.cardItemLoading}>
                      <div className={styles.memberLoading}></div>
                    </div>
                  </>
                ) : membershipRequestData &&
                  membershipRequestData.organization.membershipRequests.length >
                    0 ? (
                  membershipRequestData.organization.membershipRequests
                    .slice(0, 3)
                    .map(
                      (request: {
                        _id: string;
                        user: { name: string; emailAddress: string };
                      }) => (
                        <div
                          key={request._id}
                          className={styles.cardItemContainer}
                          data-testid="cardItem"
                        >
                          <h6 className="fs-6 fw-bold">{request.user.name}</h6>
                          <p className="fs-6 text-muted">
                            {request.user.emailAddress}
                          </p>
                        </div>
                      ),
                    )
                ) : (
                  <div className={styles.emptyContainer}>
                    <h6>{t('noMembershipRequests')}</h6>
                  </div>
                )}
              </Card.Body>
              <Card.Footer>
                <Button
                  data-testid="viewAllMembershipRequests"
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate(requestLink)}
                >
                  {t('viewAll')}
                </Button>
              </Card.Footer>
            </Card>
          </Row>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={6}>
          <Card className={styles.dashboardCard}>
            <Card.Header>
              <h5 className={styles.dashboardCardHeader}>{t('posts')}</h5>
            </Card.Header>
            <Card.Body className={styles.containerBody}>
              <div className={styles.emptyContainer}>
                <h6>{t('noPostsPresent')}</h6>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button
                data-testid="viewAllPosts"
                variant="outline-primary"
                size="sm"
                onClick={() => navigate(postsLink)}
              >
                {t('viewAll')}
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className={styles.dashboardCard}>
            <Card.Header>
              <h5 className={styles.dashboardCardHeader}>{t('leaderboard')}</h5>
            </Card.Header>
            <Card.Body className={styles.containerBody}>
              <div className={styles.emptyContainer}>
                <h6>{t('comingSoon')}</h6>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button
                data-testid="viewAllLeadeboard"
                variant="outline-primary"
                size="sm"
                onClick={() => toast.success(t('comingSoon'))}
              >
                {t('viewAll')}
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={12}>
          <Card className={styles.dashboardCard}>
            <Card.Header>
              <h5
                className={styles.dashboardCardHeader}
                data-testid="organizationOverviewHeader"
              >
                {t('organizationOverview')}
              </h5>
            </Card.Header>
            <Card.Body
              className={styles.containerBody}
              style={{ padding: '0px' }}
            >
              <div className={styles.emptyContainer}>
                <h6>{t('comingSoon')}</h6>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default OrganizationDashboard;
