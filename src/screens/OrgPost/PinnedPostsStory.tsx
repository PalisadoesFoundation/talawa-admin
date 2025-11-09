/**
 * PinnedPostsStory Component
 *
 * A React functional component that renders pinned posts as an Instagram-style
 * story carousel. Each story shows the author's avatar and name, and can be clicked
 * to trigger a callback with the selected post.
 *
 * @component
 * @param {InterfacePinnedPostsStoryProps} props - The props for the component.
 * @param {InterfacePost[]} props.pinnedPosts - Array of pinned posts to render in the carousel.
 * @param {(post: InterfacePost) => void} props.onStoryClick - Callback triggered when a story is clicked.
 *
 * @returns {JSX.Element | null} A JSX element rendering the pinned posts carousel, or null if there are no pinned posts.
 *
 * @example
 * ```tsx
 * <PinnedPostsStory pinnedPosts={pinnedPosts} onStoryClick={handleStoryClick} />
 * ```
 */

import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { InterfacePost, InterfacePostEdge } from 'types/Post/interface';
import AboutImg from 'assets/images/defaultImg.png';
import styles from './postStyles.module.css';

interface InterfacePinnedPostsStoryProps {
  pinnedPosts: InterfacePostEdge[];
  onStoryClick: (post: InterfacePost) => void;
}

const storiesResponsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5, slidesToSlide: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2, slidesToSlide: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 2, slidesToSlide: 1 },
};

const PinnedPostsStory: React.FC<InterfacePinnedPostsStoryProps> = ({
  pinnedPosts,
  onStoryClick,
}) => {
  if (!pinnedPosts || pinnedPosts.length === 0) return null;

  return (
    <Box
      sx={{
        marginBottom: 3,
        backgroundColor: '#ffffffec',
        padding: 2,
        borderRadius: 2,
        '& .carousel-item-spacing': { marginRight: '10px' },
        '& .carousel-item-spacing:last-of-type': { marginRight: 0 },
      }}
    >
      <Carousel
        responsive={storiesResponsive}
        swipeable
        draggable
        showDots={false}
        infinite={false}
        keyBoardControl
        containerClass={styles.pinnedPostsCarouselContainer}
      >
        {pinnedPosts.map((post) => (
          <Card
            key={post.node.id}
            onClick={() => onStoryClick(post.node)}
            data-testid="pinned-post"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#dbe4f379',
              width: '200px',
              height: '200px',
              cursor: 'pointer',
              boxShadow: 3,
            }}
          >
            <CardMedia
              component="img"
              sx={{ width: '100%', height: '120px', objectFit: 'cover' }}
              image={post.node.imageUrl ?? AboutImg}
              alt={post.node.caption ?? 'Pinned Post'}
            />
            <Box
              sx={{
                flex: 1,
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent sx={{ pb: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: '#000',
                    mb: 0.5,
                    fontSize: 15,
                  }}
                  noWrap
                >
                  {post.node.caption ?? 'Untitled'}
                </Typography>
                <Typography
                  variant="caption"
                  color="gray"
                  sx={{ mb: 1, display: 'block', fontSize: 12 }}
                  noWrap
                >
                  {post.node.creator?.name ?? 'Unknown'}
                </Typography>
              </CardContent>
            </Box>
          </Card>
        ))}
      </Carousel>
    </Box>
  );
};

export default PinnedPostsStory;
