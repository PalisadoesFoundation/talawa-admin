/**
 * Recent posts card component for displaying organization's latest posts.
 *
 * Displays up to 5 recent posts with loading/empty states and "View All" navigation.
 *
 * @component
 * @param props - The properties for the RecentPostsCard component.
 * @param props.postData - Organization data containing posts connection with edges.
 * @param props.postsCount - Total number of posts in the organization.
 * @param props.isLoading - Loading state indicator.
 * @param props.onViewAllClick - Callback triggered when "View All" button is clicked.
 */

import React from 'react';
import Button from 'react-bootstrap/Button';
import { Card, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import CardItem from 'components/OrganizationDashCards/CardItem/CardItem';
import CardItemLoading from 'components/OrganizationDashCards/CardItem/Loader/CardItemLoading';
import type { InterfaceOrganizationPg } from 'utils/interfaces';
import styles from '../../../style/app-fixed.module.css';

interface InterfaceRecentPostsCardProps {
  postData: InterfaceOrganizationPg;
  postsCount: number;
  isLoading: boolean;
  onViewAllClick: () => Promise<void>;
}

const RecentPostsCard: React.FC<InterfaceRecentPostsCardProps> = ({
  postData,
  postsCount,
  isLoading,
  onViewAllClick,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'dashboard',
  });

  const edges = postData?.organization?.posts?.edges ?? [];

  return (
    <Col lg={6} className="mb-4 ">
      <Card className="rounded-4 border-2 border-gray-300">
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>{t('latestPosts')}</div>
          <Button
            size="sm"
            variant="light"
            data-testid="viewAllPosts"
            onClick={onViewAllClick}
          >
            {t('viewAll')}
          </Button>
        </div>
        <Card.Body className={styles.containerBody}>
          {isLoading ? (
            [...Array(5)].map((_, index) => {
              return <CardItemLoading key={`postLoading_${index}`} />;
            })
          ) : postsCount === 0 || edges.length === 0 ? (
            <div className={styles.emptyContainer}>
              <h6>{t('noPostsPresent')}</h6>
            </div>
          ) : (
            edges.slice(0, 5).map((edge) => {
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
            })
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default RecentPostsCard;
