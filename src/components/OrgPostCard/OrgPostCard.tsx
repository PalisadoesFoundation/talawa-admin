import type { ChangeEvent } from 'react';
import React, { useEffect, useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import { toast } from 'react-toastify';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import PushPinIcon from '@mui/icons-material/PushPin';
import AboutImg from 'assets/images/defaultImg.png';
import {
  DELETE_POST_MUTATION,
  UPDATE_POST_MUTATION,
  TOGGLE_PINNED_POST,
} from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import styles from './OrgPostCard.module.css';
import { Form } from 'react-bootstrap';
import convertToBase64 from 'utils/convertToBase64';

interface InterfaceOrgPostCardProps {
  key: string;
  id: string;
  postTitle: string;
  postInfo: string;
  postAuthor: string;
  postPhoto: string;
  postVideo: string;
  pinned: boolean;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function OrgPostCard(
  props: InterfaceOrgPostCardProps
): JSX.Element {
  const [postformState, setPostFormState] = useState({
    posttitle: '',
    postinfo: '',
    postphoto: '',
    postvideo: '',
    pinned: false,
  });

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
    } catch (error: any) {
      console.log(error);
      /* istanbul ignore next */
      errorHandler(t, error);
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
    const fileInput = document.getElementById(
      'postImageUrl'
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
    const fileInput = document.getElementById(
      'postVideoUrl'
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
        setTimeout(() => {
          window.location.reload();
        });
      }
    } catch (error: any) {
      errorHandler(t, error);
    }
  };
  const handleInputEvent = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setPostFormState((prevPostFormState) => ({
      ...prevPostFormState,
      [name]: value,
    }));
  };

  const updatePostHandler = async (
    e: ChangeEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      let imageUrl = null;
      let videoUrl = null;

      if (e.target?.postphoto && e.target?.postphoto.files.length > 0) {
        imageUrl = postformState.postphoto;
      }

      if (e.target?.postvideo && e.target?.postvideo.files.length > 0) {
        videoUrl = postformState.postvideo;
      }

      const { data } = await updatePostMutation({
        variables: {
          id: props.id,
          title: postformState.posttitle,
          text: postformState.postinfo,
          imageUrl,
          videoUrl,
        },
      });

      if (data) {
        toast.success(t('postUpdated'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="col-xl-4 col-lg-4 col-md-6">
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
                  <PushPinIcon
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
                  <PushPinIcon
                    color="success"
                    fontSize="large"
                    className="fs-5"
                  />
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
                    <PushPinIcon
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
                <MoreVertIcon />
              </button>
              <button
                className={styles.closeButton}
                onClick={(): void => setModalVisible(false)}
                data-testid="closeiconbtn"
              >
                <CloseIcon />
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
                  {t('edit')}
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
                  {t('close')}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
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
            {t('no')}
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={deletePost}
            data-testid="deletePostBtn"
          >
            {t('yes')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
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
            {props.postPhoto && (
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
                    e: React.ChangeEvent<HTMLInputElement>
                  ): Promise<void> => {
                    setPostFormState((prevPostFormState) => ({
                      ...prevPostFormState,
                      postphoto: '',
                    }));

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
            {props.postVideo && (
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
                    e: React.ChangeEvent<HTMLInputElement>
                  ): Promise<void> => {
                    setPostFormState((prevPostFormState) => ({
                      ...prevPostFormState,
                      postvideo: '',
                    }));
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
              {t('close')}
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
