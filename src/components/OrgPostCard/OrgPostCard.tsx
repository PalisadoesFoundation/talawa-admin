import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';

import {
  DELETE_POST_MUTATION,
  UPDATE_POST_MUTATION,
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

  const toggleShowEditModal = (): void => setShowEditModal(!showEditModal);
  const toggleShowDeleteModal = (): void =>
    setShowDeleteModal(!showDeleteModal);

  function handletoggleClick(): void {
    if (togglePost === 'Read more') {
      setPostToggle('hide');
    } else {
      setPostToggle('Read more');
    }
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

  const [create] = useMutation(DELETE_POST_MUTATION);
  const [updatePost] = useMutation(UPDATE_POST_MUTATION);

  const deletePost = async (): Promise<void> => {
    try {
      const { data } = await create({
        variables: {
          id: props.id,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('postDeleted'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      /* istanbul ignore next */
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
      const { data } = await updatePost({
        variables: {
          id: props.id,
          title: postformState.posttitle,
          text: postformState.postinfo,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('postUpdated'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      /* istanbul ignore next */
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="col-sm-6">
        <div className={styles.cards}>
          <div className={styles.dispflex}>
            <h2>{props.postTitle}</h2>
          </div>
          {props.postPhoto ? (
            <p>
              <span>
                {' '}
                <img
                  className={styles.postimage}
                  alt="image not found"
                  src={props?.postPhoto}
                />
              </span>
            </p>
          ) : (
            <img
              src={defaultImg}
              alt="image not found"
              className={styles.postimage}
            />
          )}
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
            <Button
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
            </Button>
          </div>
          <p>
            {t('videoURL')}:
            <span>
              {' '}
              <a href={props.postVideo}>{props.postVideo}</a>
            </span>
          </p>

          <div className={styles.iconContainer}>
            <Button
              className="me-3"
              size="sm"
              variant="danger"
              data-testid="deletePostModalBtn"
              onClick={toggleShowDeleteModal}
            >
              Delete <i className="fa fa-trash"></i>
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={toggleShowEditModal}
              data-testid="editPostModalBtn"
            >
              Edit <i className="fas fa-edit"></i>
            </Button>
          </div>
        </div>
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
                name="photo"
                type="file"
                placeholder={t('image')}
                multiple={false}
                //onChange=""
              />
            </div>
            <div className="form-group">
              <label htmlFor="postVideoUrl" className="col-form-label">
                {t('video')}:
              </label>
              <Form.Control
                accept="image/*"
                id="postVideoUrl"
                name="video"
                type="file"
                placeholder={t('video')}
                multiple={false}
                //onChange=""
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
