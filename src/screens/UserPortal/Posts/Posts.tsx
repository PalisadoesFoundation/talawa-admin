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
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import SendIcon from '@mui/icons-material/Send';
import {
  ORGANIZATION_ADVERTISEMENT_LIST,
  ORGANIZATION_POST_LIST,
  USER_DETAILS,
} from 'GraphQl/Queries/Queries';
import PostCard from 'components/UserPortal/PostCard/PostCard';
import type {
  InterfacePostCard,
  InterfaceQueryOrganizationAdvertisementListItem,
  InterfaceQueryUserListItem,
} from 'utils/interfaces';
import PromotedPost from 'components/UserPortal/PromotedPost/PromotedPost';
import StartPostModal from 'components/UserPortal/StartPostModal/StartPostModal';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Navigate, useParams } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';
import styles from 'style/app-fixed.module.css';
import convertToBase64 from 'utils/convertToBase64';
import Carousel from 'react-multi-carousel';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import 'react-multi-carousel/lib/styles.css';
import { PostComments, PostLikes, PostNode } from 'types/Post/type';
import PostsRenderer from '../../OrgPost/Posts';
import Loader from 'components/Loader/Loader';
const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 600 }, items: 2 },
  mobile: { breakpoint: { max: 600, min: 0 }, items: 1 },
};

type Ad = {
  _id: string;
  name: string;
  type: 'BANNER' | 'MENU' | 'POPUP';
  mediaUrl: string;
  endDate: string; // Assuming it's a string in the format 'yyyy-MM-dd'
  startDate: string; // Assuming it's a string in the format 'yyyy-MM-dd'
};

export default function home(): JSX.Element {
  // Translation hook for localized text
  const { t } = useTranslation('translation', { keyPrefix: 'home' });
  const { t: tCommon } = useTranslation('common');

  // Custom hook for accessing local storage
  const { getItem } = useLocalStorage();
  const [posts, setPosts] = useState([]);
  const [pinnedPosts, setPinnedPosts] = useState([]);
    const [after, setAfter] = useState<string | null | undefined>(null);
    const [before, setBefore] = useState<string | null | undefined>(null);
    const [first, setFirst] = useState<number | null>(5);
    const [last, setLast] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const [sortingOption, setSortingOption] = useState('None');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [postImg, setPostImg] = useState<string | null>('');
  const [displayPosts, setDisplayPosts] = useState<InterfacePostCard[]>([]);
  const [totalPages, setTotalPages] = useState(0);


  // Fetching the organization ID from URL parameters
  const { orgId } = useParams();

  // Redirect to user page if organization ID is not available
  if (!orgId) {
    return <Navigate to={'/user'} />;
  }

  // Query hooks for fetching posts, advertisements, and user details
  const {
    data: promotedPostsData,
  }: {
    data?: { organizations: InterfaceQueryOrganizationAdvertisementListItem[] };
    refetch: () => void;
  } = useQuery(ORGANIZATION_ADVERTISEMENT_LIST, {
    variables: { id: orgId, first: 6 },
  });

  const {
    data,
    refetch,
    error,
    loading: loadingPosts,
  } = useQuery(ORGANIZATION_POST_LIST, {
    variables: {
      input: { id: orgId },
      after: after ?? null,
      before: before ?? null,
      first: first,
      last: last,
    },
  });


  const [adContent, setAdContent] = useState<Ad[]>([]);
  const userId: string | null = getItem('userId');
  const { data: userData } = useQuery(USER_DETAILS, {
    variables: {
      input: { id: userId },
      first: TAGS_QUERY_DATA_CHUNK_SIZE, // This is for tagsAssignedWith pagination
    },
  });

  const user: InterfaceQueryUserListItem | undefined = userData?.user;

  // Effect hook to update posts state when data changes
useEffect(() => {
  if (data && data.organization && data.organization.posts) {
    const edges = data.organization.posts.edges;
    setPosts(edges);

    // Compute total pages from edges length
    const pages = Math.ceil(edges.length / postsPerPage);
    setTotalPages(pages);
  }
}, [data, postsPerPage]);
console.log('totalPages', totalPages);


  // Effect hook to update advertisements state when data changes
  useEffect(() => {
    if (promotedPostsData && promotedPostsData.organizations) {
      const ads: Ad[] =
        promotedPostsData.organizations[0].advertisements?.edges.map(
          (edge) => edge.node,
        ) || [];

      setAdContent(ads);
    }
  }, [promotedPostsData]);

  useEffect(() => {
    setPinnedPosts(
      posts.filter(({ node }: { node: PostNode }) => {
        return node;
      }),
    );
  }, [posts]);

  /**
   * Converts a post node into props for the `PostCard` component.
   *
   * @param node - The post node to convert.
   * @returns The props for the `PostCard` component.
   */

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
  } = node;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(createdAt));

  const cardProps: InterfacePostCard = {
    id,
    creator: {
      id: creator.id,
      name: creator.name,
      email: creator.emailAddress || '', 
    },
    postedAt: formattedDate,
    image: null,
    video: null,
    title: caption ?? '',
    text: '',
    commentCount: node.commentsCount,
    upVoters: {
      edges:
        upVoters?.edges?.map((edge) => ({
          node: {
            id: edge.node.id,
            creator: edge.node.creator ? {
              id: edge.node.creator.id,
              name: edge.node.creator.name,
            } : null, // Handle null creator
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
        },
        downVoteCount: comment.downVotesCount,
        upVoteCount: comment.upVotesCount,
        upVoters: comment?.upVoters?.map((like) => ({
          id: like.id,
        })) || [],
        text: comment.text || '',
      })) ?? [],
    fetchPosts: () => refetch(),
  };

  return cardProps;
};

  /**
   * Opens the post creation modal.
   */
  const handlePostButtonClick = (): void => {
    setShowModal(true);
  };

  /**
   * Closes the post creation modal.
   */
  const handleModalClose = (): void => {
    setShowModal(false);
  };

const nextCursor = data?.organization?.posts?.pageInfo?.endCursor;
const previousCursor = data?.organization?.posts?.pageInfo?.startCursor;

const hasNextPage = data?.organization?.posts?.pageInfo?.hasNextPage || false;
const hasPreviousPage = data?.organization?.posts?.pageInfo?.hasPreviousPage || false;

  console.log('currentPage', currentPage);
  console.log('hasNextPage', hasNextPage);
  console.log('hasPreviousPage', hasPreviousPage);

    // Update displayPosts when posts or currentPage changes
  useEffect(() => {
    if (posts.length > 0) {
      const startIndex = (currentPage - 1) * postsPerPage;
      const endIndex = startIndex + postsPerPage;
      const currentPosts = posts
        .slice(startIndex, endIndex)
        .map(({ node }) => getCardProps(node));
      setDisplayPosts(currentPosts);
    }
  }, [posts, currentPage]);

  // Handle page navigation
const handleNextPage = (): void => {
  if (!hasNextPage) return;

  const endCursor = data?.organization?.posts?.pageInfo?.endCursor;
  if (endCursor) {
    setAfter(endCursor);
    setBefore(null);
    setFirst(postsPerPage);
    setLast(null);
    setCurrentPage((prev) => prev + 1);
  }
};

const handlePreviousPage = (): void => {
  if (!hasPreviousPage) return;

  const startCursor = data?.organization?.posts?.pageInfo?.startCursor;
  if (startCursor) {
    setBefore(startCursor);
    setAfter(null);
    setFirst(null);
    setLast(postsPerPage);
    setCurrentPage((prev) => prev - 1);
  }
};


console.log('displayPosts', displayPosts);
console.log('data?.organization?.posts', data?.organization?.posts);


  return (
    <>
      <div className={`d-flex flex-row ${styles.containerHeightUserPost}`}>
        <div className={`${styles.colorLight} ${styles.mainContainer50}`}>
          <div className={`${styles.postContainer}`}>
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
            <div className="d-flex justify-content-end">
              <Button
                size="sm"
                data-testid={'postBtn'}
                onClick={handlePostButtonClick}
                className={`px-4 py-sm-2 ${styles.addButton}`}
              >
                {t('post')} <SendIcon />
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
            <h2>{t('feed')}</h2>
            {pinnedPosts.length > 0 && (
              <Carousel responsive={responsive}>
                {pinnedPosts.map(({ node }: { node: PostNode }) => {
                  const cardProps = getCardProps(node);
                  return <PostCard key={node.id} {...cardProps} />;
                })}
              </Carousel>
            )}
          </div>

          {adContent.length > 0 && (
            <div data-testid="promotedPostsContainer">
              {adContent.map((post: Ad) => (
                <PromotedPost
                  key={post._id}
                  id={post._id}
                  image={post.mediaUrl}
                  title={post.name}
                  data-testid="postid"
                />
              ))}
            </div>
          )}
          <p className="fs-5 mt-5">{t(`yourFeed`)}</p>
          {/* Pagination controls */}
          <div className="d-flex justify-content-center my-3">
            <Button
              variant="outline-primary"
              onClick={handlePreviousPage}
              disabled={!hasPreviousPage}
              className="mx-1"
            >
              {tCommon('Previous')}
            </Button>
            <span className="mx-2 align-self-center">
              {tCommon('Page')} {currentPage} 
            </span>
            <Button
              variant="outline-primary"
              onClick={handleNextPage}
              disabled={!hasNextPage}
              className="mx-1"
            >
              {tCommon('Next')}
            </Button>
          </div>

          <div
            className={` ${styles.postsCardsContainer}`}
            data-testid="postCardContainer"
          >
            {loadingPosts ? (
              <div className={`d-flex flex-row justify-content-center`}>
                <HourglassBottomIcon /> <span>{tCommon('loading')}</span>
              </div>
            ) : (
              <>
                {displayPosts.length > 0 ? (
                  <Row className="my-2">
                    {displayPosts.map((cardProps) => (
                      <PostCard key={cardProps.id} {...cardProps} />
                    ))}
                  </Row>
                ) : (
                  <p className="container flex justify-content-center my-4">
                    {t(`nothingToShowHere`)}
                  </p>
                )}
              </>
            )}
          </div>
          <StartPostModal
            show={showModal}
            onHide={handleModalClose}
            fetchPosts={refetch}
            userData={user}
            organizationId={orgId}
            img={postImg}
          />
        </div>
      </div>
    </>
  );
}
