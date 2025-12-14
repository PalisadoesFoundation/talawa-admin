/**
 * CreatePostModal Component
 *
 * This component renders a modal dialog that allows users to create a new post
 * within an organization. Users can add a title, optional body text, attach an
 * image or video, and optionally pin the post. The component handles file preview,
 * file hashing, GraphQL mutation submission, and UI state reset on success.
 *
 * @component
 * @param {ICreatePostModalProps} props - The props for the CreatePostModal component.
 * @param {boolean} props.show - Controls the visibility of the modal.
 * @param {() => void} props.onHide - Callback invoked to close the modal.
 * @param {() => Promise<unknown>} props.refetch - Function to refetch posts after a successful creation.
 * @param {string | undefined} props.orgId - The organization ID where the post will be created.
 *
 * @returns {JSX.Element} A JSX element representing the create post modal.
 *
 * @remarks
 * - Uses `@apollo/client` for executing the `CREATE_POST_MUTATION`.
 * - Supports image and video uploads with MIME type validation.
 * - File integrity is ensured by generating a SHA-256 hash using the Web Crypto API.
 * - Displays media previews using `URL.createObjectURL`.
 * - Uses `react-i18next` for localization and `react-toastify` for user feedback.
 * - Automatically resets form state and clears file inputs after successful submission.
 * - The modal can be dismissed by clicking the backdrop or pressing the `Escape` key.
 *
 * @example
 * ```tsx
 * <CreatePostModal
 *   show={true}
 *   onHide={() => setShowModal(false)}
 *   refetch={refetchPosts}
 *   orgId="org_123"
 * />
 * ```
 */

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Close, InsertPhotoOutlined, PushPin } from '@mui/icons-material';
import Avatar from 'components/Avatar/Avatar';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './createPostModal.module.css';
import { useMutation } from '@apollo/client';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import { useTranslation } from 'react-i18next';
import {
  ICreatePostData,
  ICreatePostInput,
  IFileMetadataInput,
} from 'types/Post/type';

interface ICreatePostModalProps {
  show: boolean;
  onHide: () => void;
  refetch: () => Promise<unknown>;
  orgId: string | undefined;
}

function CreatePostModal({
  show,
  onHide,
  refetch,
  orgId,
}: ICreatePostModalProps): JSX.Element {
  const { getItem } = useLocalStorage();
  const name = getItem('name') as string;
  const { t } = useTranslation('translation', { keyPrefix: 'createPostModal' });
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPinned, setIspinned] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isPostDisabled = postTitle.trim().length === 0;

  useEffect(() => {
    addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) {
        handleClose();
      }
    });
  }, []);

  const [create] = useMutation<ICreatePostData, { input: ICreatePostInput }>(
    CREATE_POST_MUTATION,
  );

  async function getFileHashFromFile(fileToHash: File): Promise<string> {
    const arrayBuffer = await fileToHash.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  function getMimeTypeEnum(mime: string): string {
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
        return '0';
    }
  }

  const handleClose = (): void => {
    setPostTitle('');
    setPostBody('');
    onHide();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (getMimeTypeEnum(file.type) == '0') {
      setFile(null);
      setPreview(null);
      toast.error(t('unsupportedFileType'));
    }
    setFile(file);

    // preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const createPostHandler = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      let attachment: IFileMetadataInput | null = null;
      const mediaFile = file;

      if (mediaFile) {
        const fileName = mediaFile.name.split('/').pop() || 'defaultFileName';
        const objectName = 'uploads/' + fileName;
        const fileHash = await getFileHashFromFile(mediaFile);

        attachment = {
          fileHash,
          mimetype: getMimeTypeEnum(mediaFile.type),
          name: fileName,
          objectName,
        };
      }

      if (!orgId) {
        toast.error(t('organizationIdMissing'));
        return;
      }

      const { data } = await create({
        variables: {
          input: {
            caption: postTitle,
            organizationId: orgId,
            isPinned: isPinned,
            ...(attachment && { attachments: [attachment] }),
          },
        },
      });

      if (data?.createPost) {
        toast.success(t('postCreatedSuccess') as string);
        await refetch();

        // Reset all state
        setPostTitle('');
        setPostBody('');
        setFile(null);
        setPreview(null);
        setIspinned(false);

        // Clear DOM file inputs
        const fileInput = document.getElementById(
          'addMedia',
        ) as HTMLInputElement;
        const videoInput = document.getElementById(
          'videoAddMedia',
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        if (videoInput) videoInput.value = '';

        onHide();
      }
    } catch (error: unknown) {
      console.log('ernfjkgfdgfdror', error);
      errorHandler(t, error);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`${styles.backdrop} ${show ? styles.backdropShow : ''}`}
        onClick={handleClose}
        data-testid="modalBackdrop"
      />
      <div
        className={`${styles.modalDialog} ${show ? styles.modalShow : ''}`}
        data-testid="create-post-modal"
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <Avatar
              name={name}
              size={48}
              radius={50}
              dataTestId="user-avatar"
            />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{name}</span>
              <span className={styles.postVisibility}>{t('postToAnyone')}</span>
            </div>
          </div>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close"
            data-testid="closeBtn"
          >
            <Close />
          </button>
        </div>

        {/* Content Area */}
        <div className={styles.modalBody}>
          <textarea
            className={styles.postTextarea}
            placeholder={t('titleOfPost')}
            value={postTitle}
            onChange={(e) => {
              setPostTitle((e.target as HTMLTextAreaElement).value);
            }}
            data-testid="postTitleInput"
          />
          <textarea
            className={styles.postBodyTextarea}
            placeholder="Body of your post..."
            value={postBody}
            onChange={(e) => {
              setPostBody((e.target as HTMLTextAreaElement).value);
            }}
            data-testid="postBodyInput"
          />
          {preview && (
            <div className={styles.imagePreviewContainer}>
              <img
                src={preview}
                alt="Selected"
                className={styles.imagePreview}
                data-testid="imagePreview"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.mediaActions}>
            <button
              type="button"
              className={styles.mediaButton}
              aria-label="Add photo"
              data-testid="addPhotoBtn"
              onClick={() => fileInputRef.current?.click()}
              title={t('addAttachment')}
            >
              <InsertPhotoOutlined />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*, video/*"
                data-testid="addMedia"
                hidden
                onChange={handleImageSelect}
              />
            </button>
            <button
              type="button"
              className={styles.mediaButton}
              aria-label="pin post"
              data-testid="pinPostButton"
              onClick={() => setIspinned(!isPinned)}
              title={isPinned ? t('unpinPost') : t('pinPost')}
            >
              <PushPin
                sx={{
                  transform: 'rotate(45deg)',
                  color: isPinned ? '#0a66c2' : '',
                }}
              />
            </button>
          </div>

          <div className={styles.postActions}>
            <form onSubmit={createPostHandler}>
              <button
                className={`${styles.postButton} ${isPostDisabled ? styles.postButtonDisabled : ''}`}
                type="submit"
                disabled={isPostDisabled}
                data-testid="createPostBtn"
              >
                {t('post')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreatePostModal;
