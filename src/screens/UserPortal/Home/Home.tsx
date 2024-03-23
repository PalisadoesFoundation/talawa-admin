import React, { useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Card } from 'react-bootstrap';
import styles from './Home.module.css';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import OrganizationNavbar from 'components/UserPortal/OrganizationNavbar/OrganizationNavbar';
import convertToBase64 from 'utils/convertToBase64';
import getOrganizationId from 'utils/getOrganizationId';
import { useMutation, useQuery } from '@apollo/client';
import { ORGANIZATION_POST_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import { useTranslation } from 'react-i18next';
import PostCard from 'components/UserPortal/PostCard/PostCard';
import { ReactComponent as PostIcon } from 'assets/svgs/postUser.svg';
import { ReactComponent as RightScrollIcon } from 'assets/svgs/rightScroll.svg';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

interface InterfacePostCardProps {
  id: string;
  creator: {
    firstName: string;
    lastName: string;
    image: string;
    id: string;
  };
  image: string;
  video: string;
  text: string;
  title: string;
  createdAt: number;
}

interface InterfacePost {
  _id: string;
  title: string;
  text: string;
  imageUrl: string;
  videoUrl: string;
  creator: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
  createdAt: number;
  likeCount: string;
  commentCount: number;
  comments: {
    _id: string;
    creator: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    likeCount: number;
    likedBy: {
      _id: string;
    };
    text: string;
  };
  likedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  pinned: boolean;
}

export default function home(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'home' });
  const organizationId = getOrganizationId(window.location.href);
  const [posts, setPosts] = React.useState<InterfacePost[]>([]);
  const [postContent, setPostContent] = React.useState('');
  const [postImage, setPostImage] = React.useState('');
  const [hasPinnedPost, setHasPinnedPost] = React.useState(false);

  useEffect(() => {
    const hasPinned = posts.some((post) => post.pinned === true);
    setHasPinnedPost(hasPinned);
  });

  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScrollRight = (): void => {
    if (carouselRef.current instanceof HTMLElement) {
      carouselRef.current.scrollLeft += 300;
    }
  };

  const handlePostInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const content = e.target.value;
    setPostContent(content);
  };

  const navbarProps = {
    currentPage: 'home',
  };

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

  React.useEffect(() => {
    if (data) {
      setPosts(data.postsByOrganizationConnection.edges);
    }
  }, [data]);

  return (
    <>
      <OrganizationNavbar {...navbarProps} />
      <div className={`${styles.mainContainer}`}>
        <UserSidebar />
        <div className={`${styles.postPageContainer}`}>
          <div className={`${styles.mainHeading}`}>POSTS</div>
          <Card className={`${styles.cardStyle}`}>
            <div className={`${styles.startPostAndBrowse}`}>
              <div className={`${styles.startPostText}`}>Start a Post</div>
              <div className={`${styles.browseAndPostInput}`}>
                <label className={`bold-text ${styles.browseButton}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      /* istanbul ignore next */
                      async (e: React.ChangeEvent): Promise<void> => {
                        const target = e.target as HTMLInputElement;
                        const file = target.files && target.files[0];
                        if (file) {
                          const image = await convertToBase64(file);
                          console.log(image);
                          setPostImage(image);
                        }
                      }
                    }
                    style={{ display: 'none' }}
                  />
                  Browse Files
                </label>
                <input
                  className={`${styles.yourPostInput}`}
                  placeholder="Start Your Post"
                  data-testid="postInput"
                  onChange={handlePostInput}
                />
              </div>
              <div className={`${styles.postButtonDiv}`}>
                <Button
                  className={`${styles.postButton}`}
                  onClick={handlePost}
                  aria-label="Create Post"
                >
                  Post
                  <div className={`${styles.postButtonIcon}`}>
                    <PostIcon />
                  </div>
                </Button>
              </div>
            </div>
          </Card>
          <span className={`${styles.feedText}`}>Feed</span>
          <span className={`${styles.secondaryHeading}`}>Pinned post</span>
          {loadingPosts ? (
            <div className={`d-flex flex-row justify-content-center`}>
              <HourglassBottomIcon /> <span>Loading...</span>
            </div>
          ) : (
            <div
              className={`${styles.pinnedPosts}`}
              ref={carouselRef}
              data-testid="carousel"
            >
              {posts
                .filter((post) => post.pinned === true)
                .map((post: any) => {
                  const cardProps: InterfacePostCardProps = {
                    id: post._id,
                    creator: {
                      id: post.creator._id,
                      firstName: post.creator.firstName,
                      lastName: post.creator.lastName,
                      image: post.creator.image,
                    },
                    image: post.imageUrl,
                    video: post.videoUrl,
                    title: post.title,
                    text: post.text,
                    createdAt: post.createdAt,
                  };

                  return <PostCard key={post._id} {...cardProps} />;
                })}
              {hasPinnedPost && (
                <Button
                  className={`${styles.rightScrollButton}`}
                  onClick={handleScrollRight}
                  aria-label="Scroll Right"
                >
                  <RightScrollIcon />
                </Button>
              )}
            </div>
          )}

          <span className={`${styles.secondaryHeading}`}>Your Feed</span>
          <div className={`${styles.feedPosts}`}>
            {posts
              .filter((post) => post.pinned === false)
              .map((post: any) => {
                const cardProps: InterfacePostCardProps = {
                  id: post._id,
                  creator: {
                    id: post.creator._id,
                    firstName: post.creator.firstName,
                    lastName: post.creator.lastName,
                    image: post.creator.image,
                  },
                  image: post.imageUrl,
                  video: post.videoUrl,
                  title: post.title,
                  text: post.text,
                  createdAt: post.createdAt,
                };

                return <PostCard key={post._id} {...cardProps} />;
              })}
          </div>
        </div>
      </div>
    </>
  );
}
