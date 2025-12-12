/**
 * Pinned Posts Layout Component
 *
 * This component renders a horizontal carousel layout for displaying pinned posts.
 * It uses react-multi-carousel to create a responsive, scrollable container that
 * shows multiple pinned post cards in a carousel format.
 *
 * @param props - The properties for the PinnedPostsLayout component.
 * @param props.pinnedPosts - Array of pinned post edges containing post data and cursor information.
 * @param props.onStoryClick - Callback function triggered when a post story/card is clicked.
 * @param props.onPostUpdate - Optional callback function triggered after any post updates.
 *
 * @returns {JSX.Element} A JSX element representing the pinned posts carousel layout.
 *
 * @remarks
 * - Uses react-multi-carousel for responsive carousel functionality
 * - Responsive breakpoints are configured for different screen sizes
 * - Each carousel item contains a PinnedPostCard component
 * - Supports swipe, drag, keyboard navigation, and infinite scrolling
 * - Shows navigation dots for better user experience
 * - Logs carousel configuration for debugging purposes
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

import React from 'react';
import { InterfacePost, InterfacePostEdge } from 'types/Post/interface';
import PinnedPostCard from './pinnedPostCard';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

interface InterfacePinnedPostsLayoutProps {
  pinnedPosts: InterfacePostEdge[];
  onStoryClick: (post: InterfacePost) => void;
  onPostUpdate?: () => void;
}

const storiesResponsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3.5,
    slidesToSlide: 2,
  },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2, slidesToSlide: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1, slidesToSlide: 1 },
};

const PinnedPostsLayout: React.FC<InterfacePinnedPostsLayoutProps> = ({
  pinnedPosts,
  onStoryClick,
  onPostUpdate,
}) => {
  return (
    <Carousel
      responsive={storiesResponsive}
      swipeable
      draggable
      showDots={false}
      infinite={false}
      keyBoardControl
    >
      {pinnedPosts
        .filter((pinnedPost) => pinnedPost.node)
        .map((pinnedPost) => (
          <div key={pinnedPost.node.id}>
            <PinnedPostCard
              pinnedPost={pinnedPost}
              onStoryClick={onStoryClick}
              onPostUpdate={onPostUpdate}
            />
          </div>
        ))}
    </Carousel>
  );
};

export default PinnedPostsLayout;
