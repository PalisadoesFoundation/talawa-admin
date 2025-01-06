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
import styles from '../../style/app.module.css';
import DeletePostModal from './DeletePostModal';
interface InterfaceOrgPostCardProps {
  postID: string;
  id: string;
  postTitle: string;
  postInfo: string;
  postAuthor: string;
  postPhoto: string | null;
  postVideo: string | null;
  pinned: boolean;
}
export default function OrgPostCard(
  props: InterfaceOrgPostCardProps,
): JSX.Element {
  const {
    postID,
    id,
    postTitle,
    postInfo,
    postAuthor,
    postPhoto,
    postVideo,
    pinned,
  } = props;
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
      const { data } = await toggle({ variables: { id } });
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
        errorHandler(t, error);
      }
    }
  };
  const toggleShowEditModal = (): void => {
    const { postTitle, postInfo, postPhoto, postVideo, pinned } = props;
    setPostFormState({
      posttitle: postTitle,
      postinfo: postInfo,
      postphoto: postPhoto,
      postvideo: postVideo,
      pinned: pinned,
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
    setPostFormState({ ...postformState, postphoto: '' });
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
    const { postPhoto, postVideo } = props;
    setModalVisible(false);
    setMenuVisible(false);
    setShowEditModal(true);
    setPostFormState({
      ...postformState,
      postphoto: postPhoto,
      postvideo: postVideo,
    });
  }
  function handleDeleteModal(): void {
    setModalVisible(false);
    setMenuVisible(false);
    setShowDeleteModal(true);
  }
  useEffect(() => {
    setPostFormState({
      posttitle: postTitle,
      postinfo: postInfo,
      postphoto: postPhoto,
      postvideo: postVideo,
      pinned: pinned,
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
        variables: { id },
      });
      if (data) {
        toast.success(t('postDeleted') as string);
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
          id: id,
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
        toast.success(t('postUpdated') as string);
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
      <div
        key={postID}
        className="col-xl-4 col-lg-4 col-md-6"
        data-testid="post-item"
      >
        <div
          className={styles.cardsOrgPostCard}
          onClick={handleCardClick}
          data-testid="cardStructure"
        >
          {postVideo && (
            <Card
              className={styles.cardOrgPostCard}
              data-testid="cardVid"
              onMouseEnter={handleVideoPlay}
              onMouseLeave={handleVideoPause}
            >
              <video
                ref={videoRef}
                muted
                className={styles.postimageOrgPostCard}
                autoPlay={playing}
                loop={true}
                playsInline
              >
                <source src={postVideo} type="video/mp4" />
              </video>
              <Card.Body>
                {pinned && (
                  <PushPin
                    color="success"
                    fontSize="large"
                    className="fs-5"
                    data-testid="pin-icon"
                  />
                )}
                <Card.Title
                  className={styles.titleOrgPostCard}
                  data-testid="card-title"
                >
                  {postTitle}
                </Card.Title>
                <Card.Text
                  className={styles.textOrgPostCard}
                  data-testid="card-text"
                >
                  {postInfo}
                </Card.Text>
                <Card.Link data-testid="card-authour">{postAuthor}</Card.Link>
              </Card.Body>
            </Card>
          )}
          {postPhoto ? (
            <Card className={styles.cardOrgPostCard}>
              <Card.Img
                className={styles.postimageOrgPostCard}
                variant="top"
                src={postPhoto}
                alt="image"
              />
              <Card.Body>
                {pinned && (
                  <PushPin color="success" fontSize="large" className="fs-5" />
                )}
                <Card.Title className={styles.titleOrgPostCard}>
                  {postTitle}
                </Card.Title>
                <Card.Text className={styles.textOrgPostCard}>
                  {postInfo}
                </Card.Text>
                <Card.Link>{postAuthor}</Card.Link>
              </Card.Body>
            </Card>
          ) : !postVideo ? (
            <span>
              <Card className={styles.cardOrgPostCard}>
                <Card.Img
                  variant="top"
                  src={AboutImg}
                  alt="image not found"
                  className={styles.nopostimage}
                />
                <Card.Body>
                  {pinned && (
                    <PushPin
                      color="success"
                      fontSize="large"
                      className="fs-5"
                    />
                  )}
                  <Card.Title className={styles.titleOrgPostCard}>
                    {postTitle}
                  </Card.Title>
                  <Card.Text className={styles.textOrgPostCard}>
                    {postInfo && postInfo.length > 20
                      ? postInfo.substring(0, 20) + '...'
                      : postInfo}
                  </Card.Text>{' '}
                  <Card.Link className={styles.author}>{postAuthor}</Card.Link>
                </Card.Body>
              </Card>
            </span>
          ) : (
            ''
          )}
        </div>
        {modalVisible && (
          <div
            className={styles.modalOrgPostCard}
            data-testid={'imagepreviewmodal'}
          >
            <div className={styles.modalContentOrgPostCard}>
              {postPhoto && (
                <div className={styles.modalImage}>
                  <img src={postPhoto} alt="Post Image" />
                </div>
              )}
              {postVideo && (
                <div className={styles.modalImage}>
                  <video controls autoPlay loop muted>
                    <source src={postVideo} type="video/mp4" />
                  </video>
                </div>
              )}
              {!postPhoto && !postVideo && (
                <div className={styles.modalImage}>
                  {' '}
                  <img src={AboutImg} alt="Post Image" />
                </div>
              )}
              <div className={styles.modalInfo}>
                <p>
                  {t('author')}:<span> {postAuthor}</span>
                </p>
                <div className={styles.infodiv}>
                  {togglePost === 'Read more' ? (
                    <p data-testid="toggleContent">
                      {postInfo.length > 43
                        ? postInfo.substring(0, 40) + '...'
                        : postInfo}
                    </p>
                  ) : (
                    <p data-testid="toggleContent">{postInfo}</p>
                  )}
                  <button
                    role="toggleBtn"
                    data-testid="toggleBtn"
                    className={`${
                      postInfo.length > 43
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
                className={styles.closeButtonOrgPostCard}
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
                  data-target={`#editPostModal${id}`}
                  onClick={handleEditModal}
                  data-testid="editPostModalBtn"
                >
                  {tCommon('edit')}
                </li>
                <li
                  data-toggle="modal"
                  data-target={`#deletePostModal${id}`}
                  onClick={handleDeleteModal}
                  data-testid="deletePostModalBtn"
                >
                  {t('deletePost')}
                </li>
                <li
                  data-testid="pinpostBtn"
                  onClick={(): Promise<void> => togglePostPin(id, pinned)}
                >
                  {!pinned ? 'Pin post' : 'Unpin post'}
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
      <DeletePostModal
        show={showDeleteModal}
        onHide={toggleShowDeleteModal}
        onDelete={() => deletePost()}
      />
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
            {!postPhoto && (
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
                {postPhoto && (
                  <>
                    {postformState.postphoto && (
                      <div className={styles.previewOrgPostCard}>
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
            {!postVideo && (
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
                  <div className={styles.previewOrgPostCard}>
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
