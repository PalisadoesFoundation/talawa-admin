/**
 * Pinned Posts Layout Component
 *
 * This component renders a horizontal carousel layout for displaying pinned posts.
 * It uses custom scroll functions to create a responsive, scrollable container that
 * shows multiple pinned post cards in a carousel format.
 *
 * @param pinnedPosts - Array of pinned post edges containing post data and cursor information.
 * @param onStoryClick - Callback function triggered when a post story/card is clicked.
 * @param onPostUpdate - Optional callback function triggered after any post updates.
 *
 * @returns A JSX element representing the pinned posts carousel layout.
 *
 * @remarks
 * - Implements horizontal scrolling with left/right navigation buttons
 * - Buttons appear/disappear based on scroll position
 * - Each carousel item contains a PinnedPostCard component
 * - Scroll increment is based on container width for responsive behavior
 *
 * @example
 * ```tsx
 * <PinnedPostsLayout
 *   pinnedPosts={pinnedPostsData}
 *   onStoryClick={handleStoryClick}
 *   onPostUpdate={handlePostUpdate}
 * />
 * ```
 */

import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InterfacePinnedPostsLayoutProps,
  InterfacePost,
  InterfacePostEdge,
} from 'types/Post/interface';
import PinnedPostCard from './pinnedPostCard';
import styles from './pinnedPostsLayout.module.css';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const PinnedPostsLayout: React.FC<InterfacePinnedPostsLayoutProps> = ({
  pinnedPosts,
  onStoryClick,
  onPostUpdate,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'postCard' });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollability();
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollability);
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollability);
      };
    }
  }, []);

  useEffect(() => {
    checkScrollability();
  }, [pinnedPosts]);

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = scrollContainerRef.current.clientWidth;
    scrollContainerRef.current.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    const scrollAmount = scrollContainerRef.current?.clientWidth;
    scrollContainerRef.current?.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={styles.carouselWrapper} data-testid="pinned-posts-layout">
      {canScrollLeft && (
        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonLeft}`}
          onClick={scrollLeft}
          aria-label={t('scrollLeft')}
          data-testid="scroll-left-button"
        >
          <ChevronLeft />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className={styles.scrollContainer}
        data-testid="scroll-container"
      >
        {pinnedPosts
          .filter(
            (
              pinnedPost,
            ): pinnedPost is InterfacePostEdge & { node: InterfacePost } =>
              Boolean(pinnedPost.node),
          )
          .map((pinnedPost) => (
            <div key={pinnedPost.node.id} className={styles.cardWrapper}>
              <PinnedPostCard
                pinnedPost={pinnedPost}
                onStoryClick={onStoryClick}
                onPostUpdate={onPostUpdate}
              />
            </div>
          ))}
      </div>

      {canScrollRight && (
        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonRight}`}
          onClick={scrollRight}
          aria-label={t('scrollRight')}
          data-testid="scroll-right-button"
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
};

export default PinnedPostsLayout;
