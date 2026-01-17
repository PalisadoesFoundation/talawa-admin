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
import Button from 'react-bootstrap/Button';
import { Form, Image, Modal } from 'react-bootstrap';
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

  async function getFileHashFromBase64(base64String: string): Promise<string> {
    const base64 = base64String.split(',')[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  const getMimeTypeEnum = (url: string): string => {
    // Check for base64 data URI
    if (url.startsWith('data:')) {
      const mime = url.split(';')[0].split(':')[1]; // e.g., "image/png"
      switch (mime) {
        case 'image/jpeg':
          return 'IMAGE_JPEG';
        case 'image/png':
          return 'IMAGE_PNG';
        case 'image/webp':
          return 'IMAGE_WEBP';
        case 'image/avif':
          return 'IMAGE_AVIF';
        case 'video/mp4':
          return 'VIDEO_MP4';
        case 'video/webm':
          return 'VIDEO_WEBM';
        default:
          return 'IMAGE_JPEG'; // fallback
      }
    }

    // Fallback for file URLs (e.g., https://.../file.png)
    const ext = url.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'IMAGE_JPEG';
      case 'png':
        return 'IMAGE_PNG';
      case 'webp':
        return 'IMAGE_WEBP';
      case 'avif':
        return 'IMAGE_AVIF';
      case 'mp4':
        return 'VIDEO_MP4';
      case 'webm':
        return 'VIDEO_WEBM';
      default:
        return 'IMAGE_JPEG'; // fallback
    }
  };

  const handlePost = async (): Promise<void> => {
    try {
      if (!postContent) {
        throw new Error("Can't create a post with an empty body.");
      }

      toast.info('Processing your post. Please wait.');

      let attachment = null;

      if (img) {
        const mimeType = getMimeTypeEnum(img);
        const fileName = img.split('/').pop() || 'attachment';
        const fileHash = await getFileHashFromBase64(img);

        attachment = {
          fileHash,
          mimetype: mimeType,
          name: fileName,
          objectName: 'uploads/' + fileName,
        };
      }

      const { data } = await createPost({
        variables: {
          input: {
            caption: postContent,
            organizationId,
            ...(attachment && { attachments: [attachment] }),
          },
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
                crossOrigin="anonymous"
                src={userData?.avatarURL || UserDefault}
                roundedCircle
                className="mt-2"
                data-testid="userImage"
              />
            </span>
            <span>{`${userData?.name}`}</span>
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
