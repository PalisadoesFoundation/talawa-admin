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
import { Avatar, Typography, Box } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { InterfacePost } from 'types/Post/interface';
import AboutImg from 'assets/images/defaultImg.png';

interface InterfacePinnedPostsStoryProps {
  pinnedPosts: InterfacePost[];
  onStoryClick: (post: InterfacePost) => void;
}

const storiesResponsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 7 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 5 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 3 },
};

/**
 * PinnedPostsStory Component
 *
 * ... (JSDoc content)
 */
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
      }}
    >
      <Carousel
        responsive={storiesResponsive}
        swipeable
        draggable
        showDots={false}
        infinite={false}
      >
        {pinnedPosts.map((post) => (
          <Box
            key={post.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              p: 1,
            }}
            onClick={() => onStoryClick(post)}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                padding: '3px',
                background:
                  'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 0.5,
              }}
            >
              <Avatar
                src={post.creator?.avatarURL || AboutImg}
                sx={{
                  width: 58,
                  height: 58,
                  border: '2px solid white',
                }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                maxWidth: 70,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}
            >
              {post.creator?.name?.split(' ')[0] || 'Unknown'}
            </Typography>
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

export default PinnedPostsStory;
