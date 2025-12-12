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
      {pinnedPosts.map((pinnedPost) => (
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
