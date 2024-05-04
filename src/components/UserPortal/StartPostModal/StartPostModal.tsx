import React, { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Form, Image, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import { errorHandler } from 'utils/errorHandler';
import convertToBase64 from 'utils/convertToBase64';
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
}

const startPostModal = ({
  show,
  onHide,
  fetchPosts,
  userData,
  organizationId,
}: InterfaceStartPostModalProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'home' });
  const [postContent, setPostContent] = useState<string>('');
  const [postImage, setPostImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createPost] = useMutation(CREATE_POST_MUTATION);

  const handlePostInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setPostContent(e.target.value);
  };

  const handleHide = (): void => {
    setPostContent('');
    setPostImage('');
    onHide();
  };

  const uploadMedia = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    fileInputRef.current?.click();
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
          file: postImage,
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
          <Form.Control
            ref={fileInputRef}
            accept="image/*"
            id="postphoto"
            name="photo"
            type="file"
            className="d-none"
            multiple={false}
            data-testid="postImageInput"
            onChange={async (
              e: React.ChangeEvent<HTMLInputElement>,
            ): Promise<void> => {
              const file = e.target.files && e.target.files[0];
              if (file) {
                const image = await convertToBase64(file);
                setPostImage(image);
              } else {
                toast.info('Error uploading image. Please try again.');
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
              onClick={uploadMedia}
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
  );
};

export default startPostModal;
