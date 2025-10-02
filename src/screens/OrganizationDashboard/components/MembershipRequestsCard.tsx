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
