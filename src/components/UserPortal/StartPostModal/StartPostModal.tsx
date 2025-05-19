/**
 * A modal component for creating a new post in the user portal.
 *
 * @remarks
 * This component allows users to create a new post by entering text content
 * and optionally attaching an image. It uses Apollo Client's `useMutation` hook
 * to handle the post creation process and displays toast notifications for feedback.
 *
 * @param show - A boolean indicating whether the modal is visible.
 * @param onHide - A callback function to hide the modal.
 * @param fetchPosts - A function to refresh the list of posts after a new post is created.
 * @param userData - The data of the currently logged-in user, including their name and image.
 * @param organizationId - The ID of the organization where the post will be created.
 * @param img - An optional image to attach to the post.
 *
 * @returns A JSX element representing the modal for creating a new post.
 *
 * @example
 * ```tsx
 * <StartPostModal
 *   show={isModalVisible}
 *   onHide={handleCloseModal}
 *   fetchPosts={refreshPosts}
 *   userData={currentUser}
 *   organizationId="org123"
 *   img={selectedImage}
 * />
 * ```
 */
import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Form, Image, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import { errorHandler } from 'utils/errorHandler';
import UserDefault from '../../../assets/images/defaultImg.png';
import styles from '../../../style/app-fixed.module.css';
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
  // Translation hook for internationalization
  const { t } = useTranslation('translation', { keyPrefix: 'home' });

  // State to manage the content of the post
  const [postContent, setPostContent] = useState<string>('');

  // Mutation hook for creating a new post
  const [createPost] = useMutation(CREATE_POST_MUTATION);

  /**
   * Updates the state with the content of the post as the user types.
   *
   * @param e - Change event from the textarea input.
   */
  const handlePostInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setPostContent(e.target.value);
  };

  /**
   * Hides the modal and clears the post content.
   */
  const handleHide = (): void => {
    setPostContent('');
    onHide();
  };

  /**
   * Handles the creation of a new post by calling the mutation.
   * Displays a toast notification based on the outcome.
   */
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

      if (data) {
        toast.dismiss();
        toast.success(t('postNowVisibleInFeed') as string);
        fetchPosts();
        handleHide();
      }
    } catch (error: unknown) {
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
        className={styles.modalHeader}
        closeButton
        data-testid="modalHeader"
      >
        <Modal.Title>
          <span className="d-flex gap-2 align-items-center">
            <span className={styles.userImageUserPost}>
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
      <hr style={{ margin: 0 }}></hr>
      <Form>
        <Modal.Body>
          <Form.Control
            type="text"
            as="textarea"
            rows={3}
            id="orgname"
            className={styles.inputField}
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
            className={`px-4 ${styles.addButton}`}
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
