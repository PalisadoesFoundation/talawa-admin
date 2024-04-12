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

  comments: InterfacePostComments;
  likes: InterfacePostLikes;
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

  const navbarProps = {
    currentPage: 'home',
  };
  const { data: promotedPostsData } = useQuery(ADVERTISEMENTS_GET);
  const {
    data,
    refetch,
    loading: loadingPosts,
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

  return (
    <>
      <OrganizationNavbar {...navbarProps} />
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <UserSidebar />
        <div className={`${styles.colorLight} ${styles.mainContainer}`}>
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

          {loadingPosts ? (
            <div className={`d-flex flex-row justify-content-center`}>
              <HourglassBottomIcon /> <span>Loading...</span>
            </div>
          ) : (
            <>
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
                  const singleLike = {
                    firstName: value.firstName,
                    lastName: value.lastName,
                    id: value._id,
                  };
                  allLikes.push(singleLike);
                });

                const postComments: any = [];

                comments.forEach((value: any) => {
                  const commentLikes: any = [];
                  value.likedBy.forEach((commentLike: any) => {
                    const singleLike = {
                      id: commentLike._id,
                    };
                    commentLikes.push(singleLike);
                  });

                  const comment = {
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
                  comments: postComments,
                  likedBy: allLikes,
                };

                return <PostCard key={_id} {...cardProps} />;
              })}
            </>
          )}
        </div>
        <StartPostModal
          show={showModal}
          onHide={handleModalClose}
          fetchPosts={refetch}
          userData={user}
          organizationId={orgId}
        />
      </div>
    </>
  );
}
