/**
 * Membership requests and volunteer rankings card component for organization dashboard.
 *
 * This component displays a comprehensive overview of pending membership requests and
 * volunteer rankings for an organization. It presents membership requests with user
 * details and provides a dedicated section for volunteer rankings (currently a placeholder).
 *
 * @param membershipRequestData - Organization membership requests data.
 * @param isLoading - Loading state indicator.
 * @param onViewAllClick - Callback for "View All" button click.
 *
 * @returns Styled card with membership requests list and volunteer rankings section
 *
 * @example
 * ```tsx
 * <MembershipRequestsCard
 *   membershipRequestData={{
 *     organization: {
 *       membershipRequests: [
 *         {
 *           status: 'pending',
 *           membershipRequestId: 'req123',
 *           user: { name: 'John Doe' }
 *         }
 *       ]
 *     }
 *   }}
 *   isLoading={false}
 *   onViewAllClick={() => navigate('/membership-requests')}
 * />
 * ```
 */

import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import CardItem from 'components/AdminPortal/OrganizationDashCards/CardItem/CardItem';
import CardItemLoading from 'components/AdminPortal/OrganizationDashCards/CardItem/Loader/CardItemLoading';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import styles from './MembershipRequestsCard.module.css';

interface InterfaceMembershipRequestsProps {
  membershipRequestData: {
    organization?: {
      membershipRequests?: Array<{
        status: 'pending' | 'approved' | 'rejected';
        membershipRequestId: string;
        user: { name: string };
      }>;
    };
  };
  isLoading: boolean;
  onViewAllClick: () => Promise<void>;
}

const MembershipRequestsCard: React.FC<InterfaceMembershipRequestsProps> = ({
  membershipRequestData,
  isLoading,
  onViewAllClick,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'dashboard',
  });

  const pendingRequests =
    membershipRequestData?.organization?.membershipRequests?.filter(
      (r) => r.status === 'pending',
    ) ?? [];

  return (
    <Col xl={4}>
      <Row className="mb-4">
        <Card border="0" className={`rounded-4 ${styles.memReqCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>{t('membershipRequests')}</div>
            <Button
              size="sm"
              variant="light"
              data-testid="viewAllMembershipRequests"
              onClick={onViewAllClick}
            >
              {t('viewAll')}
            </Button>
          </div>
          <Card.Body
            className={`${styles.emptyContainer} ${styles.memReqCardBody}`}
          >
            {isLoading ? (
              [...Array(4)].map((_, index) => (
                <CardItemLoading key={`requestsLoading_${index}`} />
              ))
            ) : pendingRequests.length === 0 ? (
              <div
                className={`${styles.emptyContainer} ${styles.memReqCardBody}`}
              >
                <h6>{t('noMembershipRequests')}</h6>
              </div>
            ) : (
              pendingRequests
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
              data-testid="viewAllLeaderboard"
              onClick={() => {
                NotificationToast.success(t('comingSoon'));
              }}
            >
              {t('viewAll')}
            </Button>
          </div>
          <Card.Body className={`${styles.containerBody} ${styles.p0}`}>
            <div className={styles.emptyContainer}>
              <h6>{t('comingSoon')}</h6>
            </div>
          </Card.Body>
        </Card>
      </Row>
    </Col>
  );
};

export default MembershipRequestsCard;
