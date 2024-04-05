<<<<<<< HEAD
import { useQuery } from '@apollo/client';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import {
  ADVERTISEMENTS_GET,
  ORGANIZATION_POST_LIST,
  USER_DETAILS,
} from 'GraphQl/Queries/Queries';
import OrganizationNavbar from 'components/UserPortal/OrganizationNavbar/OrganizationNavbar';
import PostCard from 'components/UserPortal/PostCard/PostCard';
import type {
  InterfacePostCard,
  InterfaceQueryUserListItem,
} from 'utils/interfaces';
import PromotedPost from 'components/UserPortal/PromotedPost/PromotedPost';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import StartPostModal from 'components/UserPortal/StartPostModal/StartPostModal';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Link, Navigate, useParams } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';
import UserDefault from '../../../assets/images/defaultImg.png';
import { ReactComponent as MediaIcon } from 'assets/svgs/media.svg';
import { ReactComponent as ArticleIcon } from 'assets/svgs/article.svg';
import { ReactComponent as EventIcon } from 'assets/svgs/userEvent.svg';
import styles from './Home.module.css';

interface InterfaceAdContent {
  _id: string;
  name: string;
  type: string;
  organization: {
    _id: string;
  };
  mediaUrl: string;
  endDate: string;
  startDate: string;
}

type AdvertisementsConnection = {
  edges: {
    node: InterfaceAdContent;
  }[];
};

interface InterfaceAdConnection {
  advertisementsConnection?: AdvertisementsConnection;
}

type InterfacePostComments = {
  creator: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  likeCount: number;
  likedBy: {
    id: string;
  }[];
  text: string;
}[];

type InterfacePostLikes = {
  firstName: string;
  lastName: string;
  id: string;
}[];

type InterfacePostNode = {
  commentCount: number;
  createdAt: string;
  creator: {
    email: string;
    firstName: string;
    lastName: string;
    _id: string;
  };
  imageUrl: string | null;
  likeCount: number;
  likedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  }[];
  pinned: boolean;
  text: string;
  title: string;
  videoUrl: string | null;
  _id: string;

  comments: InterfacePostComments;
  likes: InterfacePostLikes;
};

export default function home(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'home' });
  const { getItem } = useLocalStorage();
  const [posts, setPosts] = useState([]);
  const [adContent, setAdContent] = useState<InterfaceAdConnection>({});
  const [filteredAd, setFilteredAd] = useState<InterfaceAdContent[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { orgId } = useParams();

  if (!orgId) {
    return <Navigate to={'/user'} />;
  }
=======
import React from 'react';
import type { ChangeEvent } from 'react';
import OrganizationNavbar from 'components/UserPortal/OrganizationNavbar/OrganizationNavbar';
import styles from './Home.module.css';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import OrganizationSidebar from 'components/UserPortal/OrganizationSidebar/OrganizationSidebar';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import getOrganizationId from 'utils/getOrganizationId';
import SendIcon from '@mui/icons-material/Send';
import PostCard from 'components/UserPortal/PostCard/PostCard';
import { useMutation, useQuery } from '@apollo/client';
import {
  ADVERTISEMENTS_GET,
  ORGANIZATION_POST_CONNECTION_LIST,
} from 'GraphQl/Queries/Queries';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import { useTranslation } from 'react-i18next';
import convertToBase64 from 'utils/convertToBase64';
import { toast } from 'react-toastify';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import PromotedPost from 'components/UserPortal/PromotedPost/PromotedPost';

interface InterfacePostCardProps {
  id: string;
  creator: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
  };
  image: string;
  video: string;
  text: string;
  title: string;
  likeCount: number;
  commentCount: number;
  comments: {
    creator: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    likeCount: number;
    likedBy: {
      id: string;
    }[];
    text: string;
  }[];
  likedBy: {
    firstName: string;
    lastName: string;
    id: string;
  }[];
}

export default function home(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'home' });

  const organizationId = getOrganizationId(window.location.href);
  const [posts, setPosts] = React.useState([]);
  const [postContent, setPostContent] = React.useState('');
  const [postImage, setPostImage] = React.useState('');
  const currentOrgId = window.location.href.split('/id=')[1] + '';
  const [adContent, setAdContent] = React.useState([]);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  const navbarProps = {
    currentPage: 'home',
  };
<<<<<<< HEAD
  const { data: promotedPostsData } = useQuery(ADVERTISEMENTS_GET);
=======
  const {
    data: promotedPostsData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refetch: _promotedPostsRefetch,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loading: promotedPostsLoading,
  } = useQuery(ADVERTISEMENTS_GET);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  const {
    data,
    refetch,
    loading: loadingPosts,
<<<<<<< HEAD
  } = useQuery(ORGANIZATION_POST_LIST, {
    variables: { id: orgId, first: 10 },
  });
  const userId: string | null = getItem('userId');

  const { data: userData } = useQuery(USER_DETAILS, {
    variables: { id: userId },
  });

  const user: InterfaceQueryUserListItem | undefined = userData?.user;

  useEffect(() => {
    if (data) {
      setPosts(data.organizations[0].posts.edges);
    }
  }, [data]);

  useEffect(() => {
    if (promotedPostsData) {
      setAdContent(promotedPostsData);
    }
  }, [promotedPostsData]);

  useEffect(() => {
    setFilteredAd(filterAdContent(adContent, orgId));
  }, [adContent]);

  const filterAdContent = (
    data: {
      advertisementsConnection?: {
        edges: {
          node: InterfaceAdContent;
        }[];
      };
    },
    currentOrgId: string,
    currentDate: Date = new Date(),
  ): InterfaceAdContent[] => {
    const { advertisementsConnection } = data;

    if (advertisementsConnection && advertisementsConnection.edges) {
      const { edges } = advertisementsConnection;

      return edges
        .map((edge) => edge.node)
        .filter(
          (ad: InterfaceAdContent) =>
            ad.organization._id === currentOrgId &&
            new Date(ad.endDate) > currentDate,
        );
    }

    return [];
  };

  const handlePostButtonClick = (): void => {
    setShowModal(true);
  };

  const handleModalClose = (): void => {
    setShowModal(false);
  };
=======
  } = useQuery(ORGANIZATION_POST_CONNECTION_LIST, {
    variables: { id: organizationId },
  });

  const [create] = useMutation(CREATE_POST_MUTATION);

  const handlePost = async (): Promise<void> => {
    try {
      if (!postContent) {
        throw new Error("Can't create a post with an empty body.");
      }
      toast.info('Processing your post. Please wait.');

      const { data } = await create({
        variables: {
          title: '',
          text: postContent,
          organizationId: organizationId,
          file: postImage,
        },
      });
      /* istanbul ignore next */
      if (data) {
        toast.dismiss();
        toast.success('Your post is now visible in the feed.');
        refetch();
        setPostContent('');
        setPostImage('');
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const handlePostInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const content = e.target.value;

    setPostContent(content);
  };

  React.useEffect(() => {
    if (data) {
      setPosts(data.postsByOrganizationConnection.edges);
    }
  }, [data]);

  React.useEffect(() => {
    if (promotedPostsData) {
      setAdContent(promotedPostsData.getAdvertisements);
    }
  }, [data]);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  return (
    <>
      <OrganizationNavbar {...navbarProps} />
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <UserSidebar />
        <div className={`${styles.colorLight} ${styles.mainContainer}`}>
<<<<<<< HEAD
          <Container className={styles.postContainer}>
            <Row className="d-flex align-items-center justify-content-center">
              <Col xs={2} className={styles.userImage}>
                <Image
                  src={user?.user?.image || UserDefault}
                  roundedCircle
                  className="mt-2"
                />
              </Col>
              <Col xs={10}>
                <Button
                  className={styles.startPostBtn}
                  onClick={handlePostButtonClick}
                  data-testid="startPostBtn"
                >
                  {t('startPost')}
                </Button>
              </Col>
            </Row>
            <Row className="mt-3 d-flex align-items-center justify-content-evenly">
              <Col xs={4} className={styles.uploadLink}>
                <div className="d-flex gap-2 align-items-center justify-content-center">
                  <div className={styles.icons}>
                    <MediaIcon />
                  </div>
                  <p className={styles.iconLabel}>{t('media')}</p>
                </div>
              </Col>
              <Col xs={4} className={styles.uploadLink}>
                <div className="d-flex gap-2 align-items-center justify-content-center">
                  {/* <div className={styles.icons}>{eventSvg}</div> */}
                  <div className={styles.icons}>
                    <EventIcon />
                  </div>
                  <p className={styles.iconLabel}>{t('event')}</p>
                </div>
              </Col>
              <Col xs={4} className={styles.uploadLink}>
                <div className="d-flex gap-2 align-items-center justify-content-center">
                  <div className={styles.icons}>
                    <ArticleIcon />
                  </div>
                  <p className={styles.iconLabel}>{t('article')}</p>
                </div>
              </Col>
            </Row>
          </Container>
=======
          <div className={`${styles.postInputContainer}`}>
            <FloatingLabel
              controlId="post-input"
              label={t('somethingOnYourMind')}
            >
              <Form.Control
                as="textarea"
                placeholder={t('somethingOnYourMind')}
                value={postContent}
                className={styles.postInput}
                onChange={handlePostInput}
                data-testid={'postInput'}
              />
            </FloatingLabel>
            <div className={`${styles.postActionContainer}`}>
              <Form.Control
                accept="image/*"
                id="postphoto"
                name="photo"
                type="file"
                className={styles.imageInput}
                multiple={false}
                onChange={
                  /* istanbul ignore next */
                  async (e: React.ChangeEvent): Promise<void> => {
                    const target = e.target as HTMLInputElement;
                    const file = target.files && target.files[0];
                    if (file) {
                      const image = await convertToBase64(file);
                      setPostImage(image);
                    }
                  }
                }
              />
              <Button
                className={`${styles.postActionBtn}`}
                onClick={handlePost}
                data-testid={'postAction'}
              >
                <SendIcon />
              </Button>
            </div>
          </div>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          <div
            style={{
              display: `flex`,
              flexDirection: `row`,
              justifyContent: `space-between`,
              alignItems: `center`,
            }}
          >
            <h3>{t('feed')}</h3>
            <div>
              <Link to="/user/organizations" className={styles.link}>
                {t('pinnedPosts')}
                <ChevronRightIcon
                  fontSize="small"
                  className={styles.marginTop}
                />
              </Link>
            </div>
          </div>
<<<<<<< HEAD

          {filteredAd.length > 0 && (
            <div data-testid="promotedPostsContainer">
              {filteredAd.map((post: InterfaceAdContent) => (
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

=======
          {adContent
            .filter((ad: any) => ad.orgId == currentOrgId)
            .filter((ad: any) => new Date(ad.endDate) > new Date()).length == 0
            ? ''
            : adContent
                .filter((ad: any) => ad.orgId == currentOrgId)
                .filter((ad: any) => new Date(ad.endDate) > new Date())
                .map((post: any) => (
                  <PromotedPost
                    key={post.id}
                    id={post.id}
                    image={post.link}
                    title={post.name}
                  />
                ))}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          {loadingPosts ? (
            <div className={`d-flex flex-row justify-content-center`}>
              <HourglassBottomIcon /> <span>Loading...</span>
            </div>
          ) : (
            <>
<<<<<<< HEAD
              {posts.map(({ node }: { node: InterfacePostNode }) => {
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

                const allLikes: any = [];

                likedBy.forEach((value: any) => {
=======
              {posts.map((post: any) => {
                const allLikes: any = [];
                post.likedBy.forEach((value: any) => {
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                  const singleLike = {
                    firstName: value.firstName,
                    lastName: value.lastName,
                    id: value._id,
                  };
                  allLikes.push(singleLike);
                });

                const postComments: any = [];
<<<<<<< HEAD

                comments.forEach((value: any) => {
                  const commentLikes: any = [];
=======
                post.comments.forEach((value: any) => {
                  const commentLikes: any = [];

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                  value.likedBy.forEach((commentLike: any) => {
                    const singleLike = {
                      id: commentLike._id,
                    };
                    commentLikes.push(singleLike);
                  });

<<<<<<< HEAD
                  const comment = {
=======
                  const singleCommnet: any = {
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                    id: value._id,
                    creator: {
                      firstName: value.creator.firstName,
                      lastName: value.creator.lastName,
                      id: value.creator._id,
                      email: value.creator.email,
                    },
                    likeCount: value.likeCount,
                    likedBy: commentLikes,
                    text: value.text,
                  };
<<<<<<< HEAD
                  postComments.push(comment);
                });

                const cardProps: InterfacePostCard = {
                  id: _id,
                  creator: {
                    id: creator._id,
                    firstName: creator.firstName,
                    lastName: creator.lastName,
                    email: creator.email,
                  },
                  image: imageUrl,
                  video: videoUrl,
                  title,
                  text,
                  likeCount,
                  commentCount,
=======

                  postComments.push(singleCommnet);
                });

                const cardProps: InterfacePostCardProps = {
                  id: post._id,
                  creator: {
                    id: post.creator._id,
                    firstName: post.creator.firstName,
                    lastName: post.creator.lastName,
                    email: post.creator.email,
                  },
                  image: post.imageUrl,
                  video: post.videoUrl,
                  title: post.title,
                  text: post.text,
                  likeCount: post.likeCount,
                  commentCount: post.commentCount,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                  comments: postComments,
                  likedBy: allLikes,
                };

<<<<<<< HEAD
                return <PostCard key={_id} {...cardProps} />;
=======
                return <PostCard key={post._id} {...cardProps} />;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              })}
            </>
          )}
        </div>
<<<<<<< HEAD
        <StartPostModal
          show={showModal}
          onHide={handleModalClose}
          fetchPosts={refetch}
          userData={user}
          organizationId={orgId}
        />
=======
        <OrganizationSidebar />
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      </div>
    </>
  );
}
