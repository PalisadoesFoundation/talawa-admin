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

  const [showModal, setShowModal] = useState<boolean>(false);
  const [postImg, setPostImg] = useState<string | null>('');

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
    loading: loadingPosts,
  } = useQuery(ORGANIZATION_POST_LIST, { variables: { id: orgId, first: 10 } });

  const [adContent, setAdContent] = useState<Ad[]>([]);
  const userId: string | null = getItem('userId');

  const { data: userData } = useQuery(USER_DETAILS, {
    variables: {
      id: userId,
      first: TAGS_QUERY_DATA_CHUNK_SIZE, // This is for tagsAssignedWith pagination
    },
  });

  const user: InterfaceQueryUserListItem | undefined = userData?.user;

  // Effect hook to update posts state when data changes
  useEffect(() => {
    if (data) {
      setPosts(data.organizations[0].posts.edges);
    }
  }, [data]);

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
        return node.pinned;
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
      creator,
      _id,
      imageUrl,
      videoUrl,
      title,
      text,
      likeCount,
      commentCount,
      likedBy,
      comments,
    } = node;

    const allLikes: PostLikes = likedBy.map((value) => ({
      firstName: value.firstName,
      lastName: value.lastName,
      id: value._id,
    }));

    const postComments: PostComments = comments?.map((value) => ({
      id: value.id,
      creator: {
        firstName: value.creator?.firstName ?? '',
        lastName: value.creator?.lastName ?? '',
        id: value.creator?.id ?? '',
        email: value.creator?.email ?? '',
      },
      likeCount: value.likeCount,
      likedBy: value.likedBy?.map((like) => ({ id: like?.id ?? '' })) ?? [],
      text: value.text,
    }));

    const date = new Date(node.createdAt);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);

    const cardProps: InterfacePostCard = {
      id: _id,
      creator: {
        id: creator._id,
        firstName: creator.firstName,
        lastName: creator.lastName,
        email: creator.email,
      },
      postedAt: formattedDate,
      image: imageUrl,
      video: videoUrl,
      title,
      text,
      likeCount,
      commentCount,
      comments: postComments,
      likedBy: allLikes,
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
                  return <PostCard key={node._id} {...cardProps} />;
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
          <div className={` ${styles.postsCardsContainer}`}>
            {loadingPosts ? (
              <div className={`d-flex flex-row justify-content-center`}>
                <HourglassBottomIcon /> <span>{tCommon('loading')}</span>
              </div>
            ) : (
              <>
                {posts.length > 0 ? (
                  <Row className="my-2">
                    {posts.map(({ node }: { node: PostNode }) => {
                      const cardProps = getCardProps(node);
                      return <PostCard key={node._id} {...cardProps} />;
                    })}
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
