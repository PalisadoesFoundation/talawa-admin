import React, { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import OrganizationNavbar from 'components/UserPortal/OrganizationNavbar/OrganizationNavbar';
import styles from './Home.module.css';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Button,
  Form,
  Col,
  Container,
  Image,
  Row,
  Modal,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import getOrganizationId from 'utils/getOrganizationId';
import PostCard from 'components/UserPortal/PostCard/PostCard';
import { useMutation, useQuery } from '@apollo/client';
import {
  ADVERTISEMENTS_GET,
  ORGANIZATION_POST_CONNECTION_LIST,
  USER_DETAILS,
} from 'GraphQl/Queries/Queries';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import { useTranslation } from 'react-i18next';
import convertToBase64 from 'utils/convertToBase64';
import { toast } from 'react-toastify';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import PromotedPost from 'components/UserPortal/PromotedPost/PromotedPost';
import UserDefault from '../../../assets/images/defaultImg.png';
import useLocalStorage from 'utils/useLocalstorage';

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

  const organizationId = getOrganizationId(window.location.href);
  const [posts, setPosts] = React.useState([]);
  const [postContent, setPostContent] = React.useState<string>('');
  const [postImage, setPostImage] = React.useState<string>('');
  const [adContent, setAdContent] = React.useState<InterfaceAdContent[]>([]);
  const [filteredAd, setFilteredAd] = useState<InterfaceAdContent[]>([]);
  const [showStartPost, setShowStartPost] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentOrgId = window.location.href.split('/id=')[1] + '';

  const navbarProps = {
    currentPage: 'home',
  };
  const { data: promotedPostsData } = useQuery(ADVERTISEMENTS_GET);
  const {
    data,
    refetch,
    loading: loadingPosts,
  } = useQuery(ORGANIZATION_POST_CONNECTION_LIST, {
    variables: { id: organizationId },
  });

  const userId: string | null = getItem('userId');

  const { data: userData } = useQuery(USER_DETAILS, {
    variables: { id: userId },
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
        setShowStartPost(false);
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
      setAdContent(promotedPostsData.advertisementsConnection);
    }
  }, [promotedPostsData]);

  useEffect(() => {
    setFilteredAd(filterAdContent(adContent, currentOrgId));
  }, [adContent]);

  const filterAdContent = (
    adCont: InterfaceAdContent[],
    currentOrgId: string,
    currentDate: Date = new Date(),
  ): InterfaceAdContent[] => {
    return adCont.filter(
      (ad: InterfaceAdContent) =>
        ad.organization._id === currentOrgId &&
        new Date(ad.endDate) > currentDate,
    );
  };

  const handlePostButtonClick = (): void => {
    setShowStartPost(true);
  };

  const handleIconClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleModalClose = (): void => {
    setPostContent('');
    setPostImage('');
    setShowStartPost(false);
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </div>

                  <p className={styles.iconLabel}>{t('media')}</p>
                </div>
              </Col>
              <Col xs={4} className={styles.uploadLink}>
                <div className="d-flex gap-2 align-items-center justify-content-center">
                  <div className={styles.icons}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                      />
                    </svg>
                  </div>

                  <p className={styles.iconLabel}>{t('event')}</p>
                </div>
              </Col>
              <Col xs={4} className={styles.uploadLink}>
                <div className="d-flex gap-2 align-items-center justify-content-center">
                  <div className={styles.icons}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                      />
                    </svg>
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
        <Modal
          size="lg"
          show={showStartPost}
          onHide={handleModalClose}
          backdrop="static"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          data-testid="startPostModal"
        >
          <Modal.Header
            className="bg-primary"
            closeButton
            data-testid="modalHeader"
          >
            <Modal.Title className="text-white">
              <span className="d-flex gap-2 align-items-center">
                <span className={styles.userImage}>
                  <Image
                    src={userData?.image ? userData?.image : UserDefault}
                    roundedCircle
                    className="mt-2"
                  />
                </span>
                <span>{`${userData?.user?.firstName} ${userData?.user?.lastName}`}</span>
              </span>
            </Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              <Form.Control
                type="text"
                as="textarea"
                rows={3}
                id="orgname"
                className={styles.postInput}
                data-testid="postInput"
                autoComplete="off"
                required
                onChange={handlePostInput}
                placeholder={t('somethingOnYourMind')}
                value={postContent}
              />
              <Form.Control
                ref={fileInputRef}
                accept="image/*"
                id="postphoto"
                name="photo"
                type="file"
                className={styles.imageInput}
                multiple={false}
                data-testid="postImageInput"
                onChange={async (
                  e: React.ChangeEvent<HTMLInputElement>,
                ): Promise<void> => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    const image = await convertToBase64(file);
                    setPostImage(image);
                  }
                }}
              />
              {postImage && (
                <div className={styles.previewImage}>
                  <Image src={postImage} alt="Post Image Preview" />
                </div>
              )}
              <div className="d-flex gap-2">
                <button
                  className={`${styles.icons} ${styles.dark}`}
                  onClick={handleIconClick}
                  data-testid="addMediaBtn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#000"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </button>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                value="invite"
                data-testid="createPostBtn"
                onClick={handlePost}
              >
                {t('addPost')}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </>
  );
}
