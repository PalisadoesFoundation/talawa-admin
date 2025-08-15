import { useQuery } from '@apollo/client';
import { HourglassBottom, MoreHoriz } from '@mui/icons-material';
import {
  ORGANIZATION_ADVERTISEMENT_LIST,
  ORGANIZATION_POST_LIST,
  USER_DETAILS
} from 'GraphQl/Queries/Queries';
import PostCard from 'components/UserPortal/PostCard/PostCard';
import type {
  InterfacePostCard,
  InterfaceQueryUserListItem
} from 'utils/interfaces';
import StartPostModal from 'components/UserPortal/StartPostModal/StartPostModal';
import React, { useEffect, useState } from 'react';
import { Avatar, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';
import Carousel from 'react-multi-carousel';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import 'react-multi-carousel/lib/styles.css';
import { PostNode } from 'types/Post/type';
import postStyles from './Posts.module.css';

// Instagram-like stories carousel responsive settings
const storiesResponsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 7, slidesToSlide: 3 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 5, slidesToSlide: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 4, slidesToSlide: 1 }
};

// Instagram-like posts settings
const POSTS_PER_PAGE = 5;

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

  if (!orgId) {
    return <Navigate to={'/user'} />;
  }

  // Queries
  const { data: promotedPostsData } = useQuery(ORGANIZATION_ADVERTISEMENT_LIST, {
    variables: { id: orgId, first: 6 }
  });

  const {
    data,
    refetch,
    error,
    loading: loadingPosts
  } = useQuery(ORGANIZATION_POST_LIST, {
    variables: {
      input: { id: orgId },
      after,
      before,
      first: after || !before ? POSTS_PER_PAGE : null,
      last: before ? POSTS_PER_PAGE : null
    }
  });

  const userId: string | null = getItem('userId');
  const { data: userData } = useQuery(USER_DETAILS, {
    variables: { input: { id: userId }, first: TAGS_QUERY_DATA_CHUNK_SIZE }
  });

  const user: InterfaceQueryUserListItem | undefined = userData?.user;

  // Effects
  useEffect(() => {
    if (data?.organization?.posts) {
      const newPosts = data.organization.posts.edges.map((edge: { node: any }) => edge.node);
      setPosts(newPosts);
      setTotalPosts(data.organization.posts.totalCount);
      setTotalPages(Math.ceil(data.organization.posts.totalCount / POSTS_PER_PAGE));
    }
  }, [data]);

  useEffect(() => {
    if (posts.length > 0) {
      const pinned = posts.filter(post => post.pinnedAt !== null);
      setPinnedPosts(pinned);
    }
  }, [posts]);

  useEffect(() => {
    if (promotedPostsData?.organizations) {
      const ads: Ad[] =
        promotedPostsData.organizations[0].advertisements?.edges.map(
          (edge: { node: any }) => edge.node
        ) || [];
      setAdContent(ads);
    }
  }, [promotedPostsData]);
  console.log('data:', data);

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
    pinnedAt
  } = node;

  console.log('pinnedAt:', pinnedAt);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(createdAt));

  return {
    id,
    creator: {
      id: creator.id,
      name: creator.name,
      email: creator.emailAddress || ''
    },
    postedAt: formattedDate,
    image: null,
    video: null,
    title: caption ?? '',
    text: '',
    pinnedAt: pinnedAt || null,
    commentCount: node.commentsCount,
    attachments: attachments || [],

    upVoters: {
      edges:
        upVoters?.edges?.map(edge => ({
          node: {
            id: edge.node.id,
            creator: edge.node.creator
              ? {
                  id: edge.node.creator.id,
                  name: edge.node.creator.name
                }
              : null
          }
        })) || []
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
          email: comment.creator.emailAddress || ''
        },
        downVoteCount: comment.downVotesCount,
        upVoteCount: comment.upVotesCount,
        upVoters:
          comment?.upVoters?.map(like => ({
            id: like.id
          })) || [],
        text: comment.text || ''
      })) ?? [],

    fetchPosts: refetch
  };
};

  useEffect(() => {
    if (posts.length > 0) {
      const currentPosts = posts.map(node => getCardProps(node));
      setDisplayPosts(currentPosts);
    }
  }, [posts]);

  // Handlers
  const handlePostButtonClick = (): void => {
    setShowModal(true);
  };

  const handleModalClose = (): void => {
    setShowModal(false);
  };

  const hasNextPage = data?.organization?.posts?.pageInfo?.hasNextPage || false;
  const hasPreviousPage = data?.organization?.posts?.pageInfo?.hasPreviousPage || false;

  const handleNextPage = (): void => {
    if (!hasNextPage) return;
    setAfter(data?.organization?.posts?.pageInfo?.endCursor);
    setBefore(null);
    setCurrentPage(prev => prev + 1);
  };

  const handlePreviousPage = (): void => {
    if (!hasPreviousPage) return;
    setBefore(data?.organization?.posts?.pageInfo?.startCursor);
    setAfter(null);
    setCurrentPage(prev => prev - 1);
  };

  // Instagram-like Story component
  const InstagramStory = ({ post }: { post: InterfacePostCard }) => {
    return (
      <div className={postStyles.instagramStory}>
        <div className={postStyles.storyBorder}>
          <Avatar src={post.creator.avatarURL} className={postStyles.storyAvatar} />
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
              {pinnedPosts.map(node => {
                const cardProps = getCardProps(node);
                return <InstagramStory key={node.id} post={cardProps} />;
              })}
            </Carousel>
          </div>
        )}

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
                displayPosts.map(post => (
                  <PostCard 
                    key={post.id} 
                    {...post}
                    data-testid="post-card"
                  />
                ))
              ) : (
                <p className={postStyles.noPosts}>{t('nothingToShowHere')}</p>
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