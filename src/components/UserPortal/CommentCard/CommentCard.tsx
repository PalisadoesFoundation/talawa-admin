/**
 * CommentCard Component
 *
 * This component represents a card displaying a comment with the ability to like or dislike it.
 * It shows the comment creator's details, the comment text, and the like/dislike counts.
 *
 * @component
 * @param props - The properties required by the CommentCard component.
 * @param props.id - The unique identifier of the comment.
 * @param props.creator - The creator of the comment, including their ID and name.
 * @param props.upVoteCount - The number of upvotes (likes) on the comment.
 * @param props.downVoteCount - The number of downvotes (dislikes) on the comment.
 * @param props.downVoters - An array of users who have disliked the comment.
 * @param props.text - The text content of the comment.
 * @param props.onVote - Callback function triggered when the comment is voted on.
 * @param props.fetchComments - Function to refresh comments after voting.
 *
 * @returns A JSX element representing the comment card.
 */
import React from 'react';
import {
  IconButton,
  Typography,
  Stack,
  Box,
  CircularProgress,
} from '@mui/material';
import { ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { LIKE_COMMENT, UNLIKE_COMMENT } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import { Image } from 'react-bootstrap';
import styles from '../../../style/app-fixed.module.css';
import { VoteType } from 'utils/interfaces';
import defaultAvatar from 'assets/images/defaultImg.png';

const CommentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(1),
}));

const CommentContent = styled(Typography)({
  margin: '8px 0',
  whiteSpace: 'pre-line',
});

const VoteCount = styled(Typography)(() => ({
  fontSize: '0.75rem',
  minWidth: 20,
  textAlign: 'center',
}));

interface InterfaceCommentCardProps {
  id: string;
  creator: {
    id: string;
    name: string;
    avatarURL?: string | null;
  };
  hasUserVoted?: { voteType: VoteType } | null;
  upVoteCount: number;
  // downVoteCount: number;
  text: string;
  fetchComments?: () => void;
}

function CommentCard(props: InterfaceCommentCardProps): JSX.Element {
  const { id, creator, hasUserVoted, upVoteCount, text } = props;
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  const [likes, setLikes] = React.useState(upVoteCount);
  const [isLiked, setIsLiked] = React.useState(false);

  const [likeComment, { loading: liking }] = useMutation(LIKE_COMMENT);
  const [unlikeComment, { loading: unliking }] = useMutation(UNLIKE_COMMENT);

  React.useEffect(() => {
    if (!userId) {
      setIsLiked(false);
      return;
    }
    const liked = hasUserVoted?.voteType === 'up_vote';
    setIsLiked(Boolean(liked));
  }, [userId, hasUserVoted?.voteType]);

  React.useEffect(() => {
    setLikes(upVoteCount);
  }, [upVoteCount]);

  const handleToggleLike = async (): Promise<void> => {
    if (!userId) {
      toast.warn('Please sign in to like comments.');
      return;
    }
    try {
      if (isLiked) {
        // Unlike
        const { data } = await unlikeComment({
          variables: {
            input: { commentId: id },
          },
        });

        if (data?.deleteCommentVote !== null) {
          setLikes((prev) => Math.max(prev - 1, 0));
          setIsLiked(false);
        } else {
          toast.error('Could not find an existing like to remove.');
        }
      } else {
        // Like
        const { data } = await likeComment({
          variables: {
            input: { commentId: id, type: 'up_vote' },
          },
        });

        if (data?.createCommentVote?.id) {
          setLikes((prev) => prev + 1);
          setIsLiked(true);
        }
      }
    } catch (error) {
      const errorCode = (
        error as Error & {
          graphQLErrors?: Array<{ extensions?: { code?: string } }>;
        }
      )?.graphQLErrors?.[0]?.extensions?.code;
      if (errorCode === 'forbidden_action_on_arguments_associated_resources') {
        toast.error('You have already liked this comment.');
      } else if (errorCode === 'arguments_associated_resources_not_found') {
        toast.error('No associated vote found to remove.');
      } else {
        toast.error((error as Error).message || 'Something went wrong.');
      }
    }
  };

  return (
    <CommentContainer>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <span className={styles.userImageUserComment}>
          <Image
            crossOrigin="anonymous"
            src={creator.avatarURL || defaultAvatar}
            alt={creator.name}
            loading="lazy"
          />
        </span>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {creator.name}
          </Typography>
          <CommentContent variant="body2">{text}</CommentContent>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              size="small"
              onClick={handleToggleLike}
              color={isLiked ? 'primary' : 'default'}
              data-testid="likeCommentBtn"
            >
              {liking || unliking ? (
                <CircularProgress size={20} />
              ) : isLiked ? (
                <ThumbUp fontSize="small" />
              ) : (
                <ThumbUpOutlined fontSize="small" />
              )}
            </IconButton>
            <VoteCount>{likes}</VoteCount>
          </Stack>
        </Box>
      </Stack>
    </CommentContainer>
  );
}

export default CommentCard;
