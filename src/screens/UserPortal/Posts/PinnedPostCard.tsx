/**
 * PinnedPostCard Component
 *
 * A React functional component that renders a single pinned post as a card.
 * The card shows the post's image, title, and a snippet of its text.
 * Clicking the card triggers a callback passed via props.
 *
 * @component
 * @param {InterfacePinnedPostCardProps} props - The props for the component.
 * @param {InterfacePostCard} props.post - The post data to display in the card.
 * @param {() => void} props.onClick - Callback triggered when the card is clicked.
 *
 * @returns {JSX.Element} A JSX element representing a single pinned post card.
 *
 * @example
 * ```tsx
 * <PinnedPostCard post={postData} onClick={() => handleClick(postData)} />
 * ```
 */

import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import type { InterfacePostCard } from 'utils/interfaces';

export interface InterfacePinnedPostCardProps {
  post: InterfacePostCard;
  onClick: () => void;
}

const PinnedPostCard: React.FC<InterfacePinnedPostCardProps> = ({
  post,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      data-testid="pinned-post"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#dbe4f379',
        color: '#fff',
        minWidth: '200px',
        height: '200px',
        maxWidth: '350px',
        cursor: 'pointer',
        boxShadow: 3,
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: '200px', height: '240px', objectFit: 'cover' }}
        image={post.image ?? '/src/assets/images/defaultImg.png'}
        alt={post.title}
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
            sx={{ fontWeight: 700, color: '#000', mb: 0.5, fontSize: 15 }}
            noWrap
          >
            {post.title}
          </Typography>
          <Typography
            variant="caption"
            color="gray"
            sx={{ mb: 1, display: 'block', fontSize: 12 }}
            noWrap
          >
            {post.text?.substr(0, 50) ?? ''}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default PinnedPostCard;
