/**
 * Recent posts card component for displaying organization's latest posts.
 *
 * This component presents a curated list of the most recent posts from an organization
 * with creation timestamps, author information, and provides navigation to view all posts.
 * It handles loading states, empty states, and automatically limits the display to the
 * most recent entries for optimal performance and user experience.
 *
 * @component
 * @param props - The properties for the RecentPostsCard component.
 * @param props.postData - The data object containing organization posts information.
 * @param props.postData.organization - The organization object containing post details.
 * @param props.postData.organization.posts - The posts object containing edges array.
 * @param props.postData.organization.posts.edges - Array of post edge objects containing node data.
 * @param props.postsCount - The total number of posts in the organization. Used to determine if posts exist.
 * @param props.isLoading - Loading state indicator. When true, displays skeleton loaders instead of actual content.
 * @param props.onViewAllClick - Callback function triggered when the "View All" button is clicked.
 *
 * @returns A JSX element representing a styled card component displaying recent posts with timestamps and author information.
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
 *               id: 'post1',
 *               caption: 'Welcome to our community!',
 *               createdAt: '2024-01-15T10:30:00Z',
 *               creator: {
 *                 id: 'user1',
 *                 name: 'John Doe'
 *               }
 *             }
 *           }
 *         ]
 *       }
 *     }
 *   }}
 *   postsCount={25}
 *   isLoading={false}
 *   onViewAllClick={() => navigate('/posts')}
 * />
 * ```
 *
 * @remarks
 * - The component displays a maximum of 10 recent posts for optimal performance and user experience.
 * - Posts are automatically sorted by creation date with the most recent posts appearing first.
 * - When no posts exist (postsCount is 0), it displays a "No posts present" message.
 * - The component uses dayjs for formatting timestamps in a user-friendly format.
 * - Loading states use skeleton components that match the layout of actual post items.
 * - Each post item is rendered using the CardItem component with post-specific styling.
 * - Supports internationalization through react-i18next.
 *
 * @file This file defines the RecentPostsCard component used in the Talawa Admin organization dashboard.
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
            [...Array(4)].map((_, index) => {
              return <CardItemLoading key={`postLoading_${index}`} />;
            })
          ) : postsCount === 0 ? (
            <div className={styles.emptyContainer}>
              <h6>{t('noPostsPresent')}</h6>
            </div>
          ) : (
            edges.slice(0, 10).map((edge) => {
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
