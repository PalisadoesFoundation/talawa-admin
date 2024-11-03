import { useMutation } from '@apollo/client';
import { Close, MoreVert, PushPin } from '@mui/icons-material';
import {
  DELETE_POST_MUTATION,
  TOGGLE_PINNED_POST,
} from 'GraphQl/Mutations/mutations';
import AboutImg from 'assets/images/defaultImg.png';
import type { ChangeEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import type { InterfacePostForm } from 'utils/interfaces';
import styles from './OrgPostCard.module.css';
import useLocalStorage from 'utils/useLocalstorage';
interface InterfaceOrgPostCardProps {
  postID: string;
  id: string;
  postTitle: string;
  postInfo: string;
  postAuthor: string;
  postPhoto: string | null;
  postVideo: string | null;
  pinned: boolean;
  refetch: () => void;
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
    refetch,
  } = props;
  const [postformState, setPostFormState] = useState<InterfacePostForm>({
    posttitle: '',
    postinfo: '',
    mediaFile: null,
    pinned: false,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [togglePost, setPostToggle] = useState('Read more');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [toggle] = useMutation(TOGGLE_PINNED_POST);
  const { getItem } = useLocalStorage();

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
    const { postTitle, postInfo, postPhoto, postVideo, pinned } = props;
    setPostFormState({
      posttitle: postTitle,
      postinfo: postInfo,
      mediaFile: null,
      pinned: pinned,
    });
    setPreviewUrl(postPhoto || postVideo);
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
  const clearMediaInput = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setPostFormState({
      ...postformState,
      mediaFile: null,
    });
    setPreviewUrl('');
    const imageInput = document.getElementById(
      'postImageUrl',
    ) as HTMLInputElement;
    const videoInput = document.getElementById(
      'postVideoUrl',
    ) as HTMLInputElement;
    if (imageInput) {
      imageInput.value = '';
    } else if (videoInput) {
      videoInput.value = '';
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
      mediaFile: null,
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
      mediaFile: null,
      pinned: pinned,
    });
    setPreviewUrl(postPhoto || postVideo);
  }, []);
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgPostCard',
  });
  const { t: tCommon } = useTranslation('common');
  const [deletePostMutation] = useMutation(DELETE_POST_MUTATION);

  const deletePost = async (): Promise<void> => {
    try {
      const { data } = await deletePostMutation({
        variables: {
          id: id,
        },
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

    const {
      posttitle: _posttitle,
      postinfo: _postinfo,
      mediaFile,
      pinned,
    } = postformState;

    const posttitle = _posttitle.trim();
    const postinfo = _postinfo.trim();

    try {
      if (!posttitle || !postinfo) {
        throw new Error(t('noTitleAndDescription'));
      }

      const formData = new FormData();
      formData.append('title', posttitle);
      formData.append('text', postinfo);
      formData.append('pinned', String(pinned));

      if (mediaFile) {
        formData.append('file', mediaFile);
      }

      const accessToken = getItem('token');

      const response = await fetch(
        `${process.env.REACT_APP_TALAWA_REST_URL}/update-post/${id}`,
        {
          method: 'POST',
          body: formData,
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || t('postCreationFailed'));
      }

      if (data) {
        toast.success(t('postUpdated') as string);
        setPostFormState({
          posttitle: '',
          postinfo: '',
          mediaFile: null,
          pinned: false,
        });
        setShowEditModal(false);
        refetch();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    setPostFormState((prev) => ({ ...prev, mediaFile: file }));

    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
    } else {
      setPreviewUrl('');
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
          className={styles.cards}
          onClick={handleCardClick}
          data-testid="cardStructure"
        >
          {postVideo && (
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
                <Card.Title className={styles.title} data-testid="card-title">
                  {postTitle}
                </Card.Title>
                <Card.Text className={styles.text} data-testid="card-text">
                  {postInfo}
                </Card.Text>
                <Card.Link data-testid="card-authour">{postAuthor}</Card.Link>
              </Card.Body>
            </Card>
          )}
          {postPhoto ? (
            <Card className={styles.card}>
              <Card.Img
                className={styles.postimage}
                variant="top"
                src={postPhoto}
                alt="image"
              />
              <Card.Body>
                {pinned && (
                  <PushPin color="success" fontSize="large" className="fs-5" />
                )}
                <Card.Title className={styles.title}>{postTitle}</Card.Title>
                <Card.Text className={styles.text}>{postInfo}</Card.Text>
                <Card.Link>{postAuthor}</Card.Link>
              </Card.Body>
            </Card>
          ) : !postVideo ? (
            <span>
              <Card className={styles.card}>
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
                  <Card.Title className={styles.title}>{postTitle}</Card.Title>
                  <Card.Text className={styles.text}>
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
          <div className={styles.modal} data-testid={'imagepreviewmodal'}>
            <div className={styles.modalContent}>
              {postPhoto && (
                <div className={styles.modalImage}>
                  <img src={postPhoto} alt={t('postImage')} />
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
                  <img src={AboutImg} alt={t('postImage')} />
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
            {postPhoto && (
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
                  onChange={handleMediaChange}
                />
                {previewUrl && (
                  <div className={styles.preview}>
                    <img src={previewUrl || ''} alt={t('postImage')} />
                    <button
                      className={styles.closeButtonP}
                      onClick={clearMediaInput}
                      data-testid="closeimage"
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                )}
              </>
            )}
            {postVideo && (
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
                  onChange={handleMediaChange}
                />
                {previewUrl && (
                  <div className={styles.preview}>
                    <video controls>
                      <source src={previewUrl || ''} type="video/mp4" />
                      {t('tag')}
                    </video>
                    <button
                      className={styles.closeButtonP}
                      data-testid="closePreview"
                      onClick={clearMediaInput}
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
