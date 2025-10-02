/**
 * RecentPostsCard Component
 *
 * This component renders a card displaying recent posts from the organization.
 * It shows a list of the most recent posts with their titles, creation dates,
 * and creator information, along with a "View All" button for navigation.
 *
 * @param props - The properties object for the component.
 * @param props.postData - Object containing posts data from GraphQL query.
 * @param props.postData.organization - Organization object containing posts.
 * @param props.postData.organization.posts - Object with edges array containing post nodes.
 * @param props.isLoading - Boolean indicating if posts data is currently loading.
 * @param props.onViewAllClick - Callback function triggered when "View All" button is clicked.
 *
 * @returns A JSX.Element containing the recent posts card with post list and navigation.
 *
 * @remarks
 * - Displays loading state when data is being fetched.
 * - Shows "No Posts" message when there are no posts available.
 * - Posts are displayed with title, creation date, and creator name.
 * - Uses CardItem components for consistent post display styling.
 * - Provides navigation to view all posts in the organization.
 *
 * @example
 * ```tsx
 * <RecentPostsCard
 *   postData={{
 *     organization: {
 *       posts: {
 *         edges: [
 *           {
 *             node: {
 *               id: '1',
 *               caption: 'Welcome to our organization',
 *               createdAt: '2023-01-01T12:00:00Z',
 *               creator: { id: '1', name: 'John Doe' }
 *             }
 *           }
 *         ]
 *       }
 *     }
 *   }}
 *   isLoading={false}
 *   onViewAllClick={() => navigate('/posts')}
 * />
 * ```
 */

import React from 'react';
import { Button, Card, Col } from 'react-bootstrap';
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
    keyPrefix: 'organizationDashboard',
  });

  return (
    <Col lg={6} className="mb-4 ">
      <Card className="rounded-4 border-2 border-gray-300">
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>{t('latestPosts')}</div>
          <Button
            size="sm"
            variant="light"
            data-testid="viewAllPosts"
            className=""
            onClick={onViewAllClick}
          >
            {t('viewAll')}
          </Button>
        </div>
        <Card.Body className={styles.containerBody}>
          {isLoading ? (
            [...Array(4)].map((_, index) => {
              return <CardItemLoading key={`postLoading_${index}`} />;
            })
          ) : postsCount == 0 ? (
            <div className={styles.emptyContainer}>
              <h6>{t('noPostsPresent')}</h6>
            </div>
          ) : (
            postData?.organization?.posts?.edges?.slice(0, 10).map((edge) => {
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
