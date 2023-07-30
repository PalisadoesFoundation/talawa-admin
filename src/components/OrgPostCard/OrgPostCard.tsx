import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import { toast } from 'react-toastify';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';

import {
  DELETE_POST_MUTATION,
  UPDATE_POST_MUTATION,
  TOGGLE_PINNED_POST,
} from 'GraphQl/Mutations/mutations';
import defaultImg from 'assets/images/blank.png';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import styles from './OrgPostCard.module.css';
import { Form } from 'react-bootstrap';

interface InterfaceOrgPostCardProps {
  key: string;
  id: string;
  postTitle: string;
  postInfo: string;
  postAuthor: string;
  postPhoto: string;
  postVideo: string;
}

function orgPostCard(props: InterfaceOrgPostCardProps): JSX.Element {
  const [postformState, setPostFormState] = useState({
    posttitle: '',
    postinfo: '',
  });

  const [togglePost, setPostToggle] = useState('Read more');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [toggle] = useMutation(TOGGLE_PINNED_POST);
  const togglePostPin = async (id: string): Promise<void> => {
    try {
      const { data } = await toggle({
        variables: {
          id,
        },
      });
      if (data) {
        console.log(data);
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };
  const toggleShowEditModal = (): void => setShowEditModal((prev) => !prev);
  const toggleShowDeleteModal = (): void => setShowDeleteModal((prev) => !prev);

  const handleCardClick = (): void => {
    setModalVisible(true);
  };

  const handleMoreOptionsClick = (): void => {
    setMenuVisible(true);
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
        }, 2000);
      }
    } catch (error: any) {
      errorHandler(t, error);
    }
  };

  const handleInputEvent = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setPostFormState({ ...postformState, [name]: value });
  };

  const updatePostHandler = async (
    e: ChangeEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const { data } = await updatePostMutation({
        variables: {
          id: props.id,
          title: postformState.posttitle,
          text: postformState.postinfo,
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
        <div className={styles.cards} onClick={handleCardClick}>
          {props.postPhoto ? (
            <p>
              <Card className={styles.card}>
                <Card.Img
                  className={styles.postimage}
                  variant="top"
                  src={props.postPhoto}
                  alt="image"
                />
                <Card.Body>
                  <Card.Title className={styles.title}>
                    {props.postTitle}
                  </Card.Title>
                  <Card.Text className={styles.text}>
                    {props.postInfo}
                  </Card.Text>
                  <Card.Link>{props.postAuthor}</Card.Link>
                </Card.Body>
              </Card>
            </p>
          ) : (
            <span>
              <Card className={styles.card}>
                <Card.Img
                  variant="top"
                  src={defaultImg}
                  alt="image not found"
                  className={styles.nopostimage}
                />
                <Card.Body>
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
          )}
        </div>
        {modalVisible && (
          <div className={styles.modal} data-testid={'imagepreviewmodal'}>
            <div className={styles.modalContent}>
              <div className={styles.modalImage}>
                <img src={props.postPhoto} alt="Post Image" />
              </div>
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
                  Edit Post{' '}
                </li>
                <li
                  data-toggle="modal"
                  data-target={`#deletePostModal${props.id}`}
                  onClick={handleDeleteModal}
                  data-testid="deletePostModalBtn"
                >
                  Delete Post{' '}
                </li>
                <li onClick={(): Promise<void> => togglePostPin(props.id)}>
                  Pin post
                </li>
                <li>Report</li>
                <li>Share</li>
                <li
                  className={styles.list}
                  onClick={(): void => setMenuVisible(false)}
                  data-testid="closebtn"
                >
                  Close
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
      <Modal show={showEditModal} onHide={toggleShowEditModal}>
        <Modal.Header>
          <h5>{t('editPost')}</h5>
          <Button variant="danger" onClick={toggleShowEditModal}>
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <form onSubmit={updatePostHandler}>
          <Modal.Body>
            <div className="form-group">
              <label htmlFor="postTitle" className="col-form-label">
                {t('postTitle')}
              </label>
              <Form.Control
                type="text"
                className="form-control"
                id="postTitle"
                name="posttitle"
                value={postformState.posttitle}
                onChange={handleInputEvent}
                data-testid="updateTitle"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="postText" className="col-form-label">
                {t('information')}
              </label>
              <Form.Control
                as="textarea"
                className="form-control"
                name="postinfo"
                value={postformState.postinfo}
                autoComplete="off"
                onChange={handleInputEvent}
                data-testid="updateText"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="postImageUrl" className="col-form-label">
                {t('image')}:
              </label>
              <Form.Control
                accept="image/*"
                id="postImageUrl"
                name="postphoto"
                type="file"
                placeholder={t('image')}
                multiple={false}
                onChange={handleInputEvent}
              />
            </div>
            <div className="form-group">
              <label htmlFor="postVideoUrl" className="col-form-label">
                {t('video')}:
              </label>
              <Form.Control
                accept="video/*"
                id="postVideoUrl"
                name="postvideo"
                type="file"
                placeholder={t('video')}
                multiple={false}
                onChange={handleInputEvent}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={toggleShowEditModal}>
              {t('close')}
            </Button>
            <Button
              type="submit"
              className="btn btn-success"
              data-testid="updatePostBtn"
            >
              {t('updatePost')}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default orgPostCard;
