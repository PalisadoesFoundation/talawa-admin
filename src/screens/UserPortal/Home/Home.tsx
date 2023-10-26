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

  const navbarProps = {
    currentPage: 'home',
  };
  const {
    data: promotedPostsData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refetch: _promotedPostsRefetch,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loading: promotedPostsLoading,
  } = useQuery(ADVERTISEMENTS_GET);
  const {
    data,
    refetch,
    loading: loadingPosts,
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

  return (
    <>
      <OrganizationNavbar {...navbarProps} />
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <UserSidebar />
        <div className={`${styles.colorLight} ${styles.mainContainer}`}>
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
        <OrganizationSidebar />
      </div>
    </>
  );
}
