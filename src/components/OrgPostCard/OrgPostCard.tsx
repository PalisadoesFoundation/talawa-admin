import { useMutation } from '@apollo/client';
import { Close, MoreVert, PushPin } from '@mui/icons-material';
import {
  DELETE_POST_MUTATION,
  TOGGLE_PINNED_POST,
  UPDATE_POST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import AboutImg from 'assets/images/defaultImg.png';
import type { ChangeEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import convertToBase64 from 'utils/convertToBase64';
import { errorHandler } from 'utils/errorHandler';
import type { InterfacePostForm } from 'utils/interfaces';
import styles from './OrgPostCard.module.css';
interface InterfaceOrgPostCardProps {
  key: string;
  id: string;
  postTitle: string;
  postInfo: string;
  postAuthor: string;
  postPhoto: string | null;
  postVideo: string | null;
  pinned: boolean;
}

/**
 * `OrgPostCard` component for displaying and managing organizational posts.
 *
 * This component displays a post card with options to view details, edit, delete, pin, or unpin the post. It supports video and image content, and includes modals for editing and deleting posts. The component uses GraphQL mutations for post management and integrates with a toast notification system for user feedback.
 *
 * ### Props
 * - `key` (string): Unique key for the component.
 * - `id` (string): Unique identifier of the post.
 * - `postTitle` (string): Title of the post.
 * - `postInfo` (string): Description or information about the post.
 * - `postAuthor` (string): Author of the post.
 * - `postPhoto` (string | null): URL of the post's image.
 * - `postVideo` (string | null): URL of the post's video.
 * - `pinned` (boolean): Indicates whether the post is pinned.
 *
 * ### State
 * - `postformState`: State object for managing form data.
 * - `postPhotoUpdated`: Boolean flag indicating if the post photo has been updated.
 * - `postVideoUpdated`: Boolean flag indicating if the post video has been updated.
 * - `togglePost`: String indicating the current toggle state ('Read more' or 'hide').
 * - `showEditModal`: Boolean flag indicating whether the edit modal is visible.
 * - `showDeleteModal`: Boolean flag indicating whether the delete modal is visible.
 * - `modalVisible`: Boolean flag indicating whether the modal for viewing post details is visible.
 * - `menuVisible`: Boolean flag indicating whether the options menu is visible.
 * - `playing`: Boolean flag indicating whether the video is playing.
 *
 * ### Refs
 * - `videoRef`: Ref for the video element.
 *
 * ### Methods
 * - `togglePostPin(id: string, pinned: boolean)`: Toggles the pinned state of the post.
 * - `toggleShowEditModal()`: Toggles visibility of the edit modal.
 * - `toggleShowDeleteModal()`: Toggles visibility of the delete modal.
 * - `handleVideoPlay()`: Starts playing the video.
 * - `handleVideoPause()`: Pauses the video.
 * - `handleCardClick()`: Displays the modal with post details.
 * - `handleMoreOptionsClick()`: Displays the options menu.
 * - `clearImageInput()`: Clears the selected image input.
 * - `clearVideoInput()`: Clears the selected video input.
 * - `handletoggleClick()`: Toggles the visibility of the post information.
 * - `handleEditModal()`: Shows the edit modal.
 * - `handleDeleteModal()`: Shows the delete modal.
 * - `handleInputEvent(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)`: Updates form state based on input changes.
 * - `updatePostHandler(e: ChangeEvent<HTMLFormElement>)`: Handles form submission to update the post.
 * - `deletePost()`: Deletes the post and provides feedback.
 *
 * ### Effects
 * - Synchronizes form state with props on initial render.
 */

export default function orgPostCard(
  props: InterfaceOrgPostCardProps,
): JSX.Element {
  const [postformState, setPostFormState] = useState<InterfacePostForm>({
    posttitle: '',
    postinfo: '',
    postphoto: '',
    postvideo: '',
    pinned: false,
  });
  const [postPhotoUpdated, setPostPhotoUpdated] = useState(false);
  const [postVideoUpdated, setPostVideoUpdated] = useState(false);
  const [togglePost, setPostToggle] = useState('Read more');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [toggle] = useMutation(TOGGLE_PINNED_POST);
  const togglePostPin = async (id: string, pinned: boolean): Promise<void> => {
    try {
      const { data } = await toggle({
        variables: {
          id,
        },
      });
      if (data) {
        setModalVisible(false);
        setMenuVisible(false);
        toast.success(`${pinned ? 'Post unpinned' : 'Post pinned'}`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        /* istanbul ignore next */
        errorHandler(t, error);
      }
    }
  };
  const toggleShowEditModal = (): void => {
    setPostFormState({
      posttitle: props.postTitle,
      postinfo: props.postInfo,
      postphoto: props.postPhoto,
      postvideo: props.postVideo,
      pinned: props.pinned,
    });
    setPostPhotoUpdated(false);
    setPostVideoUpdated(false);
    setShowEditModal((prev) => !prev);
  };
  const toggleShowDeleteModal = (): void => setShowDeleteModal((prev) => !prev);
  const handleVideoPlay = (): void => {
    setPlaying(true);
    videoRef.current?.play();
  };
  const handleVideoPause = (): void => {
    setPlaying(false);
    videoRef.current?.pause();
  };
  const handleCardClick = (): void => {
    setModalVisible(true);
  };
  const handleMoreOptionsClick = (): void => {
    setMenuVisible(true);
  };
  const clearImageInput = (): void => {
    setPostFormState({
      ...postformState,
      postphoto: '',
    });
    setPostPhotoUpdated(true);
    const fileInput = document.getElementById(
      'postImageUrl',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  const clearVideoInput = (): void => {
    setPostFormState({
      ...postformState,
      postvideo: '',
    });
    setPostVideoUpdated(true);
    const fileInput = document.getElementById(
      'postVideoUrl',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  function handletoggleClick(): void {
    if (togglePost === 'Read more') {
      setPostToggle('hide');
    } else {
      setPostToggle('Read more');
    }
  }
  function handleEditModal(): void {
    setModalVisible(false);
    setMenuVisible(false);
    setShowEditModal(true);
    setPostFormState({
      ...postformState,
      postphoto: props.postPhoto,
      postvideo: props.postVideo,
    });
  }
  function handleDeleteModal(): void {
    setModalVisible(false);
    setMenuVisible(false);
    setShowDeleteModal(true);
  }
  useEffect(() => {
    setPostFormState({
      posttitle: props.postTitle,
      postinfo: props.postInfo,
      postphoto: props.postPhoto,
      postvideo: props.postVideo,
      pinned: props.pinned,
    });
  }, []);
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgPostCard',
  });
  const { t: tCommon } = useTranslation('common');
  const [deletePostMutation] = useMutation(DELETE_POST_MUTATION);
  const [updatePostMutation] = useMutation(UPDATE_POST_MUTATION);
  const deletePost = async (): Promise<void> => {
    try {
      const { data } = await deletePostMutation({
        variables: {
          id: props.id,
        },
      });
      if (data) {
        toast.success(t('postDeleted'));
        toggleShowDeleteModal();
        setTimeout(() => {
          window.location.reload();
        });
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };
  const handleInputEvent = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setPostFormState((prevPostFormState) => ({
      ...prevPostFormState,
      [name]: value,
    }));
  };
  const updatePostHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      const { data } = await updatePostMutation({
        variables: {
          id: props.id,
          title: postformState.posttitle,
          text: postformState.postinfo,
          ...(postPhotoUpdated && {
            imageUrl: postformState.postphoto,
          }),
          ...(postVideoUpdated && {
            videoUrl: postformState.postvideo,
          }),
        },
      });
      if (data) {
        toast.success(t('postUpdated'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <>
      <div className="col-xl-4 col-lg-4 col-md-6" data-testid="post-item">
        <div
          className={styles.cards}
          onClick={handleCardClick}
          data-testid="cardStructure"
        >
          {props.postVideo && (
            <Card
              className={styles.card}
              data-testid="cardVid"
              onMouseEnter={handleVideoPlay}
              onMouseLeave={handleVideoPause}
            >
              <video
                ref={videoRef}
                muted
                className={styles.postimage}
                autoPlay={playing}
                loop={true}
                playsInline
              >
                <source src={props?.postVideo} type="video/mp4" />
              </video>
              <Card.Body>
                {props.pinned && (
                  <PushPin
                    color="success"
                    fontSize="large"
                    className="fs-5"
                    data-testid="pin-icon"
                  />
                )}
                <Card.Title className={styles.title} data-testid="card-title">
                  {props.postTitle}
                </Card.Title>
                <Card.Text className={styles.text} data-testid="card-text">
                  {props.postInfo}
                </Card.Text>
                <Card.Link data-testid="card-authour">
                  {props.postAuthor}
                </Card.Link>
              </Card.Body>
            </Card>
          )}
          {props.postPhoto ? (
            <Card className={styles.card}>
              <Card.Img
                className={styles.postimage}
                variant="top"
                src={props.postPhoto}
                alt="image"
              />
              <Card.Body>
                {props.pinned && (
                  <PushPin color="success" fontSize="large" className="fs-5" />
                )}
                <Card.Title className={styles.title}>
                  {props.postTitle}
                </Card.Title>
                <Card.Text className={styles.text}>{props.postInfo}</Card.Text>
                <Card.Link>{props.postAuthor}</Card.Link>
              </Card.Body>
            </Card>
          ) : !props.postVideo ? (
            <span>
              <Card className={styles.card}>
                <Card.Img
                  variant="top"
                  src={AboutImg}
                  alt="image not found"
                  className={styles.nopostimage}
                />
                <Card.Body>
                  {props.pinned && (
                    <PushPin
                      color="success"
                      fontSize="large"
                      className="fs-5"
                    />
                  )}
                  <Card.Title className={styles.title}>
                    {props.postTitle}
                  </Card.Title>
                  <Card.Text className={styles.text}>
                    {props.postInfo && props.postInfo.length > 20
                      ? props.postInfo.substring(0, 20) + '...'
                      : props.postInfo}
                  </Card.Text>{' '}
                  <Card.Link className={styles.author}>
                    {props.postAuthor}
                  </Card.Link>
                </Card.Body>
              </Card>
            </span>
          ) : (
            ''
          )}
        </div>
        {modalVisible && (
          <div className={styles.modal} data-testid={'imagepreviewmodal'}>
            <div className={styles.modalContent}>
              {props.postPhoto && (
                <div className={styles.modalImage}>
                  <img src={props.postPhoto} alt="Post Image" />
                </div>
              )}
              {props.postVideo && (
                <div className={styles.modalImage}>
                  <video controls autoPlay loop muted>
                    <source src={props?.postVideo} type="video/mp4" />
                  </video>
                </div>
              )}
              {!props.postPhoto && !props.postVideo && (
                <div className={styles.modalImage}>
                  {' '}
                  <img src={AboutImg} alt="Post Image" />
                </div>
              )}
              <div className={styles.modalInfo}>
                <p>
                  {t('author')}:<span> {props.postAuthor}</span>
                </p>
                <div className={styles.infodiv}>
                  {togglePost === 'Read more' ? (
                    <p data-testid="toggleContent">
                      {props.postInfo.length > 43
                        ? props.postInfo.substring(0, 40) + '...'
                        : props.postInfo}
                    </p>
                  ) : (
                    <p data-testid="toggleContent">{props.postInfo}</p>
                  )}
                  <button
                    role="toggleBtn"
                    data-testid="toggleBtn"
                    className={`${
                      props.postInfo.length > 43
                        ? styles.toggleClickBtn
                        : styles.toggleClickBtnNone
                    }`}
                    onClick={handletoggleClick}
                  >
                    {togglePost}
                  </button>
                </div>
              </div>
              <button
                className={styles.moreOptionsButton}
                onClick={handleMoreOptionsClick}
                data-testid="moreiconbtn"
              >
                <MoreVert />
              </button>
              <button
                className={styles.closeButton}
                onClick={(): void => setModalVisible(false)}
                data-testid="closeiconbtn"
              >
                <Close />
              </button>
            </div>
          </div>
        )}
        {menuVisible && (
          <div className={styles.menuModal}>
            <div className={styles.menuContent}>
              <ul className={styles.menuOptions}>
                <li
                  data-toggle="modal"
                  data-target={`#editPostModal${props.id}`}
                  onClick={handleEditModal}
                  data-testid="editPostModalBtn"
                >
                  {tCommon('edit')}
                </li>
                <li
                  data-toggle="modal"
                  data-target={`#deletePostModal${props.id}`}
                  onClick={handleDeleteModal}
                  data-testid="deletePostModalBtn"
                >
                  {t('deletePost')}
                </li>
                <li
                  data-testid="pinpostBtn"
                  onClick={(): Promise<void> =>
                    togglePostPin(props.id, props.pinned)
                  }
                >
                  {!props.pinned ? 'Pin post' : 'Unpin post'}
                </li>
                <li
                  className={styles.list}
                  onClick={(): void => setMenuVisible(false)}
                  data-testid="closebtn"
                >
                  {tCommon('close')}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <Modal show={showDeleteModal} onHide={toggleShowDeleteModal}>
        <Modal.Header>
          <h5>{t('deletePost')}</h5>
          <Button variant="danger" onClick={toggleShowDeleteModal}>
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>{t('deletePostMsg')}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={toggleShowDeleteModal}>
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={deletePost}
            data-testid="deletePostBtn"
          >
            {tCommon('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showEditModal}
        onHide={toggleShowEditModal}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          className="bg-primary"
          data-testid="modalOrganizationHeader"
          closeButton
        >
          <Modal.Title className="text-white">{t('editPost')}</Modal.Title>
        </Modal.Header>
        <Form onSubmitCapture={updatePostHandler}>
          <Modal.Body>
            <Form.Label htmlFor="posttitle">{t('postTitle')}</Form.Label>
            <Form.Control
              type="text"
              id="postTitle"
              name="posttitle"
              value={postformState.posttitle}
              onChange={handleInputEvent}
              data-testid="updateTitle"
              required
              className="mb-3"
              placeholder={t('postTitle1')}
              autoComplete="off"
            />
            <Form.Label htmlFor="postinfo">{t('information')}</Form.Label>
            <Form.Control
              type="descrip"
              id="descrip"
              className="mb-3"
              name="postinfo"
              value={postformState.postinfo}
              placeholder={t('information1')}
              autoComplete="off"
              onChange={handleInputEvent}
              data-testid="updateText"
              required
            />
            {!props.postPhoto && (
              <>
                <Form.Label htmlFor="postPhoto">{t('image')}</Form.Label>
                <Form.Control
                  accept="image/*"
                  id="postImageUrl"
                  data-testid="postImageUrl"
                  name="postphoto"
                  type="file"
                  placeholder={t('image')}
                  multiple={false}
                  onChange={async (
                    e: React.ChangeEvent<HTMLInputElement>,
                  ): Promise<void> => {
                    setPostFormState((prevPostFormState) => ({
                      ...prevPostFormState,
                      postphoto: '',
                    }));
                    setPostPhotoUpdated(true);
                    const file = e.target.files?.[0];
                    if (file) {
                      setPostFormState({
                        ...postformState,
                        postphoto: await convertToBase64(file),
                      });
                    }
                  }}
                />
                {props.postPhoto && (
                  <>
                    {postformState.postphoto && (
                      <div className={styles.preview}>
                        <img
                          src={postformState.postphoto}
                          alt="Post Image Preview"
                        />
                        <button
                          className={styles.closeButtonP}
                          onClick={clearImageInput}
                          data-testid="closeimage"
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {!props.postVideo && (
              <>
                <Form.Label htmlFor="postvideo">{t('video')}</Form.Label>
                <Form.Control
                  accept="video/*"
                  id="postVideoUrl"
                  data-testid="postVideoUrl"
                  name="postvideo"
                  type="file"
                  placeholder={t('video')}
                  multiple={false}
                  onChange={async (
                    e: React.ChangeEvent<HTMLInputElement>,
                  ): Promise<void> => {
                    setPostFormState((prevPostFormState) => ({
                      ...prevPostFormState,
                      postvideo: '',
                    }));
                    setPostVideoUpdated(true);
                    const target = e.target as HTMLInputElement;
                    const file = target.files && target.files[0];
                    if (file) {
                      const videoBase64 = await convertToBase64(file);
                      setPostFormState({
                        ...postformState,
                        postvideo: videoBase64,
                      });
                    }
                  }}
                />
                {postformState.postvideo && (
                  <div className={styles.preview}>
                    <video controls>
                      <source src={postformState.postvideo} type="video/mp4" />
                      {t('tag')}
                    </video>
                    <button
                      className={styles.closeButtonP}
                      data-testid="closePreview"
                      onClick={clearVideoInput}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={toggleShowEditModal}
              data-testid="closeOrganizationModal"
              type="button"
            >
              {tCommon('close')}
            </Button>
            <Button type="submit" value="invite" data-testid="updatePostBtn">
              {t('updatePost')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
