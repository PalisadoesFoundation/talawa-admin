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

interface InterfaceAdContent {
  _id: string;
  name: string;
  type: string;
  organization: {
    _id: string;
  };
  link: string;
  endDate: string;
  startDate: string;
}

export default function home(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'home' });
  const { getItem } = useLocalStorage();
  const [posts, setPosts] = useState([]);
  const [adContent, setAdContent] = useState<InterfaceAdContent[]>([]);
  const [filteredAd, setFilteredAd] = useState<InterfaceAdContent[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { orgId } = useParams();
  const organizationId = orgId?.split('=')[1];
  if (!organizationId) {
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
    variables: { id: organizationId, first: 10 },
  });

  const userId: string | null = getItem('userId');

  const { data: userData } = useQuery(USER_DETAILS, {
    variables: { id: userId },
  });

  useEffect(() => {
    if (
      data &&
      data.organizaitons &&
      data.organizaitons[0] &&
      data.organizaitons[0].posts.edges
    ) {
      setPosts(data.organizaitons[0].posts.edges);
    }
  }, [data]);

  useEffect(() => {
    if (promotedPostsData) {
      setAdContent(promotedPostsData.advertisementsConnection);
    }
  }, [promotedPostsData]);

  useEffect(() => {
    setFilteredAd(filterAdContent(adContent, organizationId));
  }, [adContent]);

  const filterAdContent = (
    adCont: InterfaceAdContent[],
    currentOrgId: string,
    currentDate: Date = new Date(),
  ): InterfaceAdContent[] => {
    return adCont.filter(
      (ad: InterfaceAdContent) =>
        ad.organization._id === organizationId &&
        new Date(ad.endDate) > currentDate,
    );
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
                  src={userData?.image ? userData?.image : UserDefault}
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
          {filteredAd.length === 0 ? (
            ''
          ) : (
            <div data-testid="promotedPostsContainer">
              {filteredAd.map((post: any) => (
                <PromotedPost
                  key={post._id}
                  id={post._id}
                  media={post.mediaUrl}
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
              {posts.map((post: any) => {
                const allLikes: any = [];
                post.likedBy.forEach((value: any) => {
                  const singleLike = {
                    firstName: value.firstName,
                    lastName: value.lastName,
                    id: value._id,
                  };
                  allLikes.push(singleLike);
                });

                const postComments: any = [];
                post.comments.forEach((value: any) => {
                  const commentLikes: any = [];

                  value.likedBy.forEach((commentLike: any) => {
                    const singleLike = {
                      id: commentLike._id,
                    };
                    commentLikes.push(singleLike);
                  });

                  const singleCommnet: any = {
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
                  comments: postComments,
                  likedBy: allLikes,
                };

                return <PostCard key={post._id} {...cardProps} />;
              })}
            </>
          )}
        </div>
        <StartPostModal
          show={showModal}
          onHide={handleModalClose}
          fetchPosts={refetch}
          userData={userData}
        />
      </div>
    </>
  );
}
