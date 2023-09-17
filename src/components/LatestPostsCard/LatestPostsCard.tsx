import React from 'react';
import styles from './LatestPostsCard.module.css';
import { useTranslation } from 'react-i18next';
import timeAgo from 'utils/convertToTimeAgo';

const LatestPostsCard = ({ posts }: any): JSX.Element => {
  const currentUrl = window.location.href.split('=')[1];
  const { t } = useTranslation('translation', {
    keyPrefix: 'latestPosts',
  });

  return (
    <div className={styles.latestPostsContainer}>
      <div className={styles.latestPostsHeader}>
        <span className={styles.latestPostsTitle}>{t('latestPostsTitle')}</span>
        <span>
          <a className={styles.seeAllLink} href={`/orgpost/id=${currentUrl}`}>
            {t('seeAllLink') + ' '} <i className="fas fa-arrow-right"></i>
          </a>
        </span>
      </div>
      <div className={styles.latestPostsList}>
        {posts.length === 0 ? (
          <p className={styles.noEvents}>{t('noPostsCreated')}</p>
        ) : (
          posts.map((post: any) => (
            <div key={post.id} className={styles.postItem}>
              <div className={styles.postMeta}>
                <a href="">{post.title}</a>
                <div className={styles.postTime}>{timeAgo(post.createdAt)}</div>
                <div className={styles.postAuthor}>
                  {post.creator.firstName} {post.creator.lastName}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LatestPostsCard;
