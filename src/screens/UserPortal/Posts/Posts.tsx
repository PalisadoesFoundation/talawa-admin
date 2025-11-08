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
 * - `ORGANIZATION_POST_LIST_WITH_VOTES` to fetch posts.
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
import { HourglassBottom } from '@mui/icons-material';
import {
  ORGANIZATION_ADVERTISEMENT_LIST,
  ORGANIZATION_POST_LIST_WITH_VOTES,
  USER_DETAILS,
} from 'GraphQl/Queries/Queries';
import PostCard from 'components/UserPortal/PostCard/PostCard';
import type {
  InterfacePostCard,
  InterfaceQueryUserListItem,
} from 'utils/interfaces';
import StartPostModal from 'components/UserPortal/StartPostModal/StartPostModal';
import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
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
import PinnedPostCard from './PinnedPostCard';
import { InterfacePostEdge } from 'types/Post/interface';
import { ORGANIZATION_PINNED_POST_LIST } from 'GraphQl/Queries/OrganizationQueries';

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

// Interface for pinned post node from GraphQL query - matches the exact structure returned
interface PinnedPostNode {
  id: string;
  caption: string;
  commentsCount: number;
  pinnedAt: string;
  downVotesCount: number;
  upVotesCount: number;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    avatarURL: string | null;
  };
  comments: {
    edges: Array<{
      node: {
        id: string;
        body: string;
        creator: {
          id: string;
          name: string;
          avatarURL: string | null;
        };
        downVotesCount: number;
        upVotesCount: number;
      };
    }>;
    pageInfo: {
      startCursor: string | null;
      endCursor: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

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
    loading: loadingPosts,
  } = useQuery(ORGANIZATION_POST_LIST_WITH_VOTES, {
    variables: {
      input: { id: orgId },
      userId: userId,
      after,
      before,
      first: after || !before ? POSTS_PER_PAGE : null,
      last: before ? POSTS_PER_PAGE : null,
    },
  });

  const { data: orgPinnedPostListData } = useQuery(
    ORGANIZATION_PINNED_POST_LIST,
    {
      variables: {
        input: { id: orgId as string },
        first: 32,
      },
    },
  );

  const { data: userData } = useQuery(USER_DETAILS, {
    skip: !userId,
    variables: { input: { id: userId }, first: TAGS_QUERY_DATA_CHUNK_SIZE },
  });

  const user: InterfaceQueryUserListItem | undefined = userData?.user;

  // Effects
  useEffect(() => {
    if (data?.organization?.posts) {
      const newPosts = data.organization.posts.edges.map(
        (edge: { node: PostNode }) => edge.node,
      );
      setPosts(newPosts);
      setTotalPosts(data.organization.postsCount);
      setTotalPages(Math.ceil(data.organization.postsCount / POSTS_PER_PAGE));
    }
  }, [data]);

  useEffect(() => {
    if (orgPinnedPostListData?.organization?.pinnedPosts?.edges) {
      const pinnedPostNodes =
        orgPinnedPostListData.organization.pinnedPosts.edges.map(
          (edge: InterfacePostEdge) => edge.node,
        ) as any;
      setPinnedPosts(pinnedPostNodes);
    }
  }, [orgPinnedPostListData, posts, adContent, totalPosts]);

  useEffect(() => {
    if (promotedPostsData?.organizations) {
      const ads: Ad[] =
        promotedPostsData.organizations[0].advertisements?.edges.map(
          (edge: { node: Ad }) => edge.node,
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
      upVotesCount,
      downVotesCount,
      comments,
      // attachments,
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
      upVoteCount: upVotesCount,
      downVoteCount: downVotesCount,

      comments:
        comments?.edges?.map(({ node: comment }) => ({
          id: comment.id,
          body: comment.body,
          creator: {
            id: comment.creator.id,
            name: comment.creator.name,
            avatarURL: comment.creator.avatarURL || undefined,
          },
          downVoteCount: comment.downVotesCount,
          upVoteCount: comment.upVotesCount,
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

  const handlePostButtonClick = (): void => {
    setShowModal(true);
  };

  return (
    <div className={postStyles.instagramContainer}>
      <div className={postStyles.instagramContent}>
        {/* Stories */}
        {pinnedPosts.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Typography
              sx={{
                color: '#030303ff',
                fontWeight: 'bold',
                fontSize: 18,
                letterSpacing: 1,
                mb: 2,
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              {t('pinnedPosts')}
            </Typography>
            <Carousel
              responsive={{
                desktop: {
                  breakpoint: { max: 3000, min: 1024 },
                  items: 4,
                  slidesToSlide: 1,
                },
                tablet: {
                  breakpoint: { max: 1024, min: 464 },
                  items: 2,
                  slidesToSlide: 1,
                },
                mobile: {
                  breakpoint: { max: 464, min: 0 },
                  items: 2,
                  slidesToSlide: 1,
                },
              }}
              swipeable
              draggable
              showDots={false}
              infinite={false}
              partialVisible={false}
              keyBoardControl
              containerClass={postStyles.storiesCarousel}
              itemClass={postStyles.storyItem}
            >
              {pinnedPosts.map((node) => {
                const cardProps = getCardProps(node);
                return (
                  <PinnedPostCard
                    key={cardProps.id}
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
    </div>
  );
}
