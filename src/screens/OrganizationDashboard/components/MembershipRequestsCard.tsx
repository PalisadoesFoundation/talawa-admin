/**
 * MembershipRequestsCard Component
 *
 * This component renders a card displaying pending membership requests for an organization.
 * It shows a list of users who have requested to join the organization and provides
 * a "View All" button to navigate to the full requests page.
 *
 * @param props - The properties object for the component.
 * @param props.membershipRequestData - Object containing membership request data from GraphQL query.
 * @param props.membershipRequestData.organization - Organization object containing membership requests.
 * @param props.membershipRequestData.organization.membershipRequests - Array of membership request objects.
 * @param props.isLoading - Boolean indicating if membership request data is currently loading.
 * @param props.onViewAllClick - Async callback function triggered when "View All" button is clicked.
 *
 * @returns A JSX.Element containing the membership requests card with user list and navigation.
 *
 * @remarks
 * - Filters and displays only pending membership requests.
 * - Shows loading state with CardItemLoading components when data is being fetched.
 * - Displays "No Requests" message when there are no pending requests.
 * - Uses CardItem components for consistent user display styling.
 * - Includes error handling with toast notifications.
 *
 * @example
 * ```tsx
 * <MembershipRequestsCard
 *   membershipRequestData={{
 *     organization: {
 *       membershipRequests: [
 *         {
 *           status: 'pending',
 *           membershipRequestId: '123',
 *           user: { name: 'John Doe' }
 *         }
 *       ]
 *     }
 *   }}
 *   isLoading={false}
 *   onViewAllClick={async () => {
 *     await navigate('/requests');
 *   }}
 * />
 * ```
 */

import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import CardItem from 'components/OrganizationDashCards/CardItem/CardItem';
import CardItemLoading from 'components/OrganizationDashCards/CardItem/Loader/CardItemLoading';
import styles from '../../../style/app-fixed.module.css';

interface InterfaceMembershipRequestsProps {
  membershipRequestData: {
    organization?: {
      membershipRequests?: Array<{
        status: string;
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
    keyPrefix: 'organizationDashboard',
  });

  return (
    <Col xl={4}>
      <Row className="mb-4">
        <Card border="0" className="rounded-4" style={{ height: '220px' }}>
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
            className={styles.containerBody}
            style={{ height: '150px' }}
          >
            {isLoading ? (
              [...Array(4)].map((_, index) => (
                <CardItemLoading key={`requestsLoading_${index}`} />
              ))
            ) : membershipRequestData?.organization?.membershipRequests?.filter(
                (request: { status: string }) => request.status === 'pending',
              ).length === 0 ? (
              <div
                className={styles.emptyContainer}
                style={{ height: '150px' }}
              >
                <h6>{t('noMembershipRequests')}</h6>
              </div>
            ) : (
              membershipRequestData?.organization?.membershipRequests
                ?.filter(
                  (request: { status: string }) => request.status === 'pending',
                )
                ?.slice(0, 8)
                ?.map(
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
  );
};

export default MembershipRequestsCard;
