import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Form, Image, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import { errorHandler } from 'utils/errorHandler';
import UserDefault from '../../../assets/images/defaultImg.png';
import styles from './StartPostModal.module.css';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';

interface InterfaceStartPostModalProps {
  show: boolean;
  onHide: () => void;
  fetchPosts: () => void;
  userData: InterfaceQueryUserListItem | undefined;
  organizationId: string;
  img: string | null;
}

const startPostModal = ({
  show,
  onHide,
  fetchPosts,
  userData,
  organizationId,
  img,
}: InterfaceStartPostModalProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'home' });
  const [postContent, setPostContent] = useState<string>('');

  const [createPost] = useMutation(CREATE_POST_MUTATION);

  const handlePostInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setPostContent(e.target.value);
  };

  const handleHide = (): void => {
    setPostContent('');
    onHide();
  };

  const handlePost = async (): Promise<void> => {
    try {
      if (!postContent) {
        throw new Error("Can't create a post with an empty body.");
      }
      toast.info('Processing your post. Please wait.');

      const { data } = await createPost({
        variables: {
          title: '',
          text: postContent,
          organizationId: organizationId,
          file: img,
        },
      });
      /* istanbul ignore next */
      if (data) {
        toast.dismiss();
        toast.success('Your post is now visible in the feed.');
        fetchPosts();
        handleHide();
      }
    } catch (error: unknown) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={handleHide}
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
                src={userData?.user?.image || UserDefault}
                roundedCircle
                className="mt-2"
                data-testid="userImage"
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
          {img && (
            <div className={styles.previewImage}>
              <Image src={img} alt="Post Image Preview" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="sm"
            variant="success"
            className="px-4"
            value="invite"
            data-testid="createPostBtn"
            onClick={handlePost}
          >
            {t('addPost')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default startPostModal;
