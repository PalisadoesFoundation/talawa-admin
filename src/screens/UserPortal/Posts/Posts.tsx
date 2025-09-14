/**
 * The `home` component serves as the main user interface for displaying posts,
 * advertisements, and pinned posts within an organization. It also provides
 * functionality for creating new posts and interacting with existing ones.
 *
 * @returns {JSX.Element} The rendered home component.
 *
 * @remarks
 * - This component uses GraphQL queries to fetch posts, advertisements, and user details.
 * - It includes a post creation modal and a carousel for pinned posts.
 * - The component redirects to the user page if the organization ID is not available.
 *
 * @component
 * @category Screens
 *
 * @dependencies
 * - `@apollo/client` for GraphQL queries.
 * - `@mui/icons-material` for icons.
 * - `react-bootstrap` for UI components.
 * - `react-multi-carousel` for carousel functionality.
 * - Custom components like `PostCard`, `PromotedPost`, and `StartPostModal`.
 *
 * @example
 * ```tsx
 * <home />
 * ```
 *
 * @remarks
 * The component uses the following GraphQL queries:
 * - `ORGANIZATION_ADVERTISEMENT_LIST` to fetch advertisements.
 * - `ORGANIZATION_POST_LIST` to fetch posts.
 * - `USER_DETAILS` to fetch user details.
 *
 * @remarks
 * The component maintains the following state variables:
 * - `posts`: Stores the list of posts fetched from the server.
 * - `pinnedPosts`: Stores the list of pinned posts.
 * - `adContent`: Stores the list of advertisements.
 * - `showModal`: Controls the visibility of the post creation modal.
 * - `postImg`: Stores the base64-encoded image for a new post.
 *
 * @remarks
 * The component includes the following key functionalities:
 * - Fetching and displaying posts and advertisements.
 * - Filtering and displaying pinned posts in a carousel.
 * - Handling post creation through a modal.
 * - Redirecting to the user page if the organization ID is missing.
 */

import { useQuery } from '@apollo/client';
import { HourglassBottom, MoreHoriz } from '@mui/icons-material';
import {
  ORGANIZATION_ADVERTISEMENT_LIST,
  ORGANIZATION_POST_LIST,
  USER_DETAILS,
} from 'GraphQl/Queries/Queries';
import PostCard from 'components/UserPortal/PostCard/PostCard';
import type {
  InterfacePostCard,
  InterfaceQueryUserListItem,
} from 'utils/interfaces';
import StartPostModal from 'components/UserPortal/StartPostModal/StartPostModal';
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  IconButton,
  Button,
  Modal,
  FormControl,
  Input,
  InputAdornment,
  Box,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';
import Carousel from 'react-multi-carousel';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import 'react-multi-carousel/lib/styles.css';
import { PostNode } from 'types/Post/type';
import postStyles from './Posts.module.css';
import styles from 'style/app-fixed.module.css';
import convertToBase64 from 'utils/convertToBase64';
import { Col, Form, Row } from 'react-bootstrap';

// Instagram-like stories carousel responsive settings
const storiesResponsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 7, slidesToSlide: 3 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 5, slidesToSlide: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 4, slidesToSlide: 1 },
};

// Instagram-like posts settings
export const POSTS_PER_PAGE = 5;

type Ad = {
  _id: string;
  name: string;
  type: 'BANNER' | 'MENU' | 'POPUP';
  mediaUrl: string;
  endDate: string;
  startDate: string;
};

export default function Home(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'home' });
  const { t: tCommon } = useTranslation('common');
  const { getItem } = useLocalStorage();
  const { orgId } = useParams();

  const [posts, setPosts] = useState<PostNode[]>([]);
  const [pinnedPosts, setPinnedPosts] = useState<PostNode[]>([]);
  const [after, setAfter] = useState<string | null | undefined>(null);
  const [before, setBefore] = useState<string | null | undefined>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [postImg, setPostImg] = useState<string | null>('');
  const [displayPosts, setDisplayPosts] = useState<InterfacePostCard[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [adContent, setAdContent] = useState<Ad[]>([]);
  const [showPinnedPostModal, setShowPinnedPostModal] = useState(false);
  const [selectedPinnedPost, setSelectedPinnedPost] =
    useState<InterfacePostCard | null>(null);

  if (!orgId) {
    return <Navigate to={'/user'} />;
  }

  // Queries
  const { data: promotedPostsData } = useQuery(
    ORGANIZATION_ADVERTISEMENT_LIST,
    {
      variables: { id: orgId, first: 6 },
    },
  );
  const userId: string | null = getItem('userId');

  const {
    data,
    refetch,
    error,
    loading: loadingPosts,
  } = useQuery(ORGANIZATION_POST_LIST, {
    variables: {
      input: { id: orgId },
      userId: userId,
      after,
      before,
      first: after || !before ? POSTS_PER_PAGE : null,
      last: before ? POSTS_PER_PAGE : null,
    },
  });

  const { data: userData } = useQuery(USER_DETAILS, {
    variables: { input: { id: userId }, first: TAGS_QUERY_DATA_CHUNK_SIZE },
  });

  const user: InterfaceQueryUserListItem | undefined = userData?.user;

  // Effects
  useEffect(() => {
    if (data?.organization?.posts) {
      const newPosts = data.organization.posts.edges.map(
        (edge: { node: any }) => edge.node,
      );
      setPosts(newPosts);
      setTotalPosts(data.organization.postsCount);
      setTotalPages(Math.ceil(data.organization.postsCount / POSTS_PER_PAGE));
    }
  }, [data]);

  useEffect(() => {
    if (posts.length > 0) {
      const pinned = posts.filter((post) => post.pinnedAt !== null);
      setPinnedPosts(pinned);
    }
  }, [posts]);

  useEffect(() => {
    if (promotedPostsData?.organizations) {
      const ads: Ad[] =
        promotedPostsData.organizations[0].advertisements?.edges.map(
          (edge: { node: any }) => edge.node,
        ) || [];
      setAdContent(ads);
    }
  }, [promotedPostsData]);

  const getCardProps = (node: PostNode): InterfacePostCard => {
    const {
      id,
      caption,
      createdAt,
      creator,
      upVoters,
      upVotesCount,
      downVotesCount,
      comments,
      attachments,
      pinnedAt,
      hasUserVoted,
    } = node;

    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(createdAt));

    return {
      id,
      creator: {
        id: creator.id,
        name: creator.name,
        email: creator.emailAddress || '',
        avatarURL: creator.avatarURL || undefined,
      },
      postedAt: formattedDate,
      image: null,
      video: null,
      title: caption ?? '',
      text: '',
      pinnedAt: pinnedAt || null,
      commentCount: node.commentsCount,
      hasUserVoted: hasUserVoted,

      upVoters: {
        edges:
          upVoters?.edges?.map((edge) => ({
            node: {
              id: edge.node.id,
              creator: edge.node.creator
                ? {
                    id: edge.node.creator.id,
                    name: edge.node.creator.name,
                  }
                : null,
            },
          })) || [],
      },

      upVoteCount: upVotesCount,
      downVoteCount: downVotesCount,

      comments:
        comments?.edges?.map(({ node: comment }) => ({
          id: comment.id,
          body: comment.body,
          creator: {
            id: comment.creator.id,
            name: comment.creator.name,
            email: comment.creator.emailAddress || '',
            avatarURL: comment.creator.avatarURL,
          },
          downVoteCount: comment.downVotesCount,
          upVoteCount: comment.upVotesCount,
          upVoters:
            comment?.upVoters?.map((like) => ({
              id: like.id,
            })) || [],
          text: comment.text || '',
          hasUserVoted: comment.hasUserVoted,
        })) ?? [],

      fetchPosts: refetch,
    };
  };

  useEffect(() => {
    if (posts.length > 0) {
      const currentPosts = posts.map((node) => getCardProps(node));
      setDisplayPosts(currentPosts);
    }
  }, [posts]);

  const handleModalClose = (): void => {
    setShowModal(false);
  };

  const hasNextPage = data?.organization?.posts?.pageInfo?.hasNextPage || false;
  const hasPreviousPage =
    data?.organization?.posts?.pageInfo?.hasPreviousPage || false;

  const handleNextPage = (): void => {
    if (!hasNextPage) return;
    setAfter(data?.organization?.posts?.pageInfo?.endCursor);
    setBefore(null);
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = (): void => {
    if (!hasPreviousPage) return;
    setBefore(data?.organization?.posts?.pageInfo?.startCursor);
    setAfter(null);
    setCurrentPage((prev) => prev - 1);
  };

  const handleStoryClick = (post: InterfacePostCard) => {
    setSelectedPinnedPost(post);
    setShowPinnedPostModal(true);
  };

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handlePostButtonClick = (): void => {
    setShowModal(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setPostImg(imgURL);
      setShowModal(true); // open modal after selecting image
    }
  };

  // Instagram-like Story component
  const InstagramStory = ({ post }: { post: InterfacePostCard }) => {
    return (
      <div
        className={postStyles.instagramStory}
        onClick={() => handleStoryClick(post)} // make clickable
        style={{ cursor: 'pointer' }}
      >
        <div className={postStyles.storyBorder}>
          <Avatar
            src={post.creator.avatarURL}
            className={postStyles.storyAvatar}
          />
        </div>
        <span className={postStyles.storyUsername}>
          {post.creator.name.split(' ')[0]}
        </span>
      </div>
    );
  };

  return (
    <div className={postStyles.instagramContainer}>
      <div className={postStyles.instagramContent}>
        {/* Stories */}
        {pinnedPosts.length > 0 && (
          <div className={postStyles.storiesContainer}>
            <Carousel
              responsive={storiesResponsive}
              swipeable
              draggable
              showDots={false}
              infinite={false}
              keyBoardControl
              containerClass={postStyles.storiesCarousel}
              itemClass={postStyles.storyItem}
            >
              {pinnedPosts.map((node) => {
                const cardProps = getCardProps(node);
                return (
                  <InstagramStory
                    key={node.id}
                    post={cardProps}
                    data-testid="pinned-post"
                  />
                );
              })}
            </Carousel>
          </div>
        )}

        <div className={`${styles.heading}`}>{t('startPost')}</div>
        <div className={styles.postInputContainer}>
          <Row className="d-flex gap-1">
            <Col className={styles.maxWidthUserPost}>
              <Form.Control
                type="file"
                accept="image/*"
                multiple={false}
                className={styles.inputField}
                data-testid="postImageInput"
                autoComplete="off"
                onChange={async (
                  e: React.ChangeEvent<HTMLInputElement>,
                ): Promise<void> => {
                  setPostImg('');
                  const target = e.target as HTMLInputElement;
                  const file = target.files && target.files[0];
                  const base64file = file && (await convertToBase64(file));
                  setPostImg(base64file);
                }}
              />
            </Col>
          </Row>
        </div>
        <div className="d-flex justify-content-end ">
          <Button
            size="small"
            data-testid={'postBtn'}
            onClick={handlePostButtonClick}
            className={`${postStyles.addButton}`}
          >
            {t('post')}
          </Button>
        </div>
      </div>
      <div
        style={{
          justifyContent: `space-between`,
          alignItems: `center`,
          marginTop: `1rem`,
        }}
      >
        {/* Posts */}
        <div className={postStyles.postsContainer}>
          {loadingPosts ? (
            <div className={postStyles.loadingContainer}>
              <HourglassBottom />
              <span>{tCommon('loading')}</span>
            </div>
          ) : (
            <>
              {displayPosts.length > 0 ? (
                displayPosts.map((post) => (
                  <PostCard key={post.id} {...post} data-testid="post-card" />
                ))
              ) : (
                <p className={postStyles.noPosts} data-testid="no-post">
                  {t('nothingToShowHere')}
                </p>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        <div className={postStyles.paginationControls}>
          <Button
            variant="outlined"
            onClick={handlePreviousPage}
            disabled={!hasPreviousPage || currentPage === 1}
            data-testid="prev-btn"
            className={postStyles.paginationButton}
          >
            {tCommon('Previous')}
          </Button>
          <span className={postStyles.pageIndicator}>
            {tCommon('Page')} {currentPage} {tCommon('of')} {totalPages}
          </span>
          <Button
            variant="outlined"
            onClick={handleNextPage}
            disabled={!hasNextPage}
            data-testid="next-btn"
            className={postStyles.paginationButton}
          >
            {tCommon('Next')}
          </Button>
        </div>
      </div>

      {/* Create Post Modal */}
      <StartPostModal
        show={showModal}
        onHide={handleModalClose}
        fetchPosts={refetch}
        userData={user}
        organizationId={orgId}
        img={postImg}
      />

      {selectedPinnedPost && (
        <Modal
          open={showPinnedPostModal}
          onClose={() => setShowPinnedPostModal(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(3px)',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 600,
              maxHeight: '90vh',
              overflowY: 'auto',
              outline: 'none',
            }}
          >
            <PostCard
              {...selectedPinnedPost}
              isModalView={true}
              data-testid="pinned-post-card"
            />
          </Box>
        </Modal>
      )}
    </div>
  );
}
