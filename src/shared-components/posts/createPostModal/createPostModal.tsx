/**
 * CreatePostModal Component
 *
 * This component renders a modal dialog that allows users to create a new post
 * within an organization. Users can add a title, optional body text, attach an
 * image or video, and optionally pin the post.
 *
 */

import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Close, InsertPhotoOutlined, PushPin } from '@mui/icons-material';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './createPostModal.module.css';
import { useMutation } from '@apollo/client';
import {
  CREATE_POST_MUTATION,
  UPDATE_POST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';
import { useTranslation } from 'react-i18next';
import { ICreatePostData, ICreatePostInput } from 'types/Post/type';

import { ICreatePostModalProps } from 'types/Post/interface';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';

function CreatePostModal({
  show,
  onHide,
  refetch,
  orgId,
  type,
  id,
  title,
  body,
}: ICreatePostModalProps): JSX.Element {
  const { getItem } = useLocalStorage();
  const name = (getItem('name') as string | null) ?? '';
  const { t } = useTranslation('translation');
  const [postTitle, setPostTitle] = useState(title || '');
  const [postBody, setPostBody] = useState(body || '');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPinned, setIspinned] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewType, setPreviewType] = useState<'image' | 'video' | null>(
    null,
  );
  const [editPost, { loading: isEditing }] = useMutation(UPDATE_POST_MUTATION);
  const [create, { loading: isCreating }] = useMutation<
    ICreatePostData,
    { input: ICreatePostInput }
  >(CREATE_POST_MUTATION);
  const isLoading =
    (type === 'create' && isCreating) || (type !== 'create' && isEditing);
  const isPostDisabled = postTitle.trim().length === 0;

  const handleClose = useCallback((): void => {
    setPostTitle('');
    setPostBody('');
    setIspinned(false);
    setFile(null);
    setPreview(null);
    onHide();
  }, [onHide]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [show, handleClose]);

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
      case 'video/quicktime':
        return 'VIDEO_QUICKTIME';
      default:
        return '0';
    }
  }

  /**
   * Handles file selection from the input.
   * Validates the mime type against allowed types and generates a blob URL for previewing the selected image or video.
   */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (getMimeTypeEnum(file.type) === '0') {
      setFile(null);
      setPreview(null);
      NotificationToast.error(t('createPostModal.unsupportedFileType'));
      return;
    }
    if (file.type.startsWith('image/')) {
      setPreviewType('image');
    } else {
      setPreviewType('video');
    }
    setFile(file);

    // preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const onSuccess = async (type: 'edited' | 'created') => {
    NotificationToast.success(
      type === 'created'
        ? (t('createPostModal.postCreatedSuccess') as string)
        : (t('createPostModal.postUpdatedSuccess') as string),
    );
    await refetch();

    // Reset all state
    setPostTitle('');
    setPostBody('');
    setFile(null);
    setPreview(null);
    setIspinned(false);

    // Clear DOM file inputs
    const fileInput = document.getElementById('addMedia') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    onHide();
  };

  /**
   * Submits the post data to the server.
   * Validates required fields, executes the create or update mutation, handles success, and catches errors.
   */
  const createPostHandler = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      if (!orgId) {
        NotificationToast.error(t('createPostModal.organizationIdMissing'));
        return;
      }
      if (type === 'create') {
        const { data } = await create({
          variables: {
            input: {
              caption: postTitle,
              body: postBody,
              organizationId: orgId,
              isPinned: isPinned,
              ...(file && { attachment: file }),
            },
          },
        });
        if (data?.createPost) {
          onSuccess('created');
        }
      } else {
        const { data } = await editPost({
          variables: {
            input: {
              caption: postTitle,
              body: postBody,
              id: id,
              isPinned: isPinned,
              ...(file && { attachment: file }),
            },
          },
        });
        if (data.updatePost) {
          onSuccess('edited');
        }
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <button
        className={`${styles.backdrop} ${show ? styles.backdropShow : ''}`}
        onClick={!isLoading ? handleClose : undefined}
        data-testid="modalBackdrop"
        type="button"
        aria-label={t('createPostModal.closeCreatePost')}
      />
      <div
        className={`${styles.modalDialog} ${show ? styles.modalShow : ''}`}
        data-testid="create-post-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t('createPostModal.createPost')}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <ProfileAvatarDisplay
              fallbackName={name}
              size="small"
              dataTestId="user-avatar"
              enableEnlarge={true}
            />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{name}</span>
              <span className={styles.postVisibility}>
                {type === 'create'
                  ? t('createPostModal.postToAnyone')
                  : t('createPostModal.editPost')}
              </span>
            </div>
          </div>
          <button
            className={styles.closeButton}
            onClick={!isLoading ? handleClose : undefined}
            aria-label={t('createPostModal.close')}
            data-testid="closeBtn"
            type="button"
          >
            <Close />
          </button>
        </div>

        {/* Content Area */}
        <div className={styles.modalBody}>
          <textarea
            className={styles.postTextarea}
            placeholder={t('createPostModal.titleOfPost')}
            data-cy="modalTitle"
            value={postTitle}
            onChange={(e) => {
              setPostTitle((e.target as HTMLTextAreaElement).value);
            }}
            data-testid="postTitleInput"
          />
          <textarea
            className={styles.postBodyTextarea}
            placeholder={t('createPostModal.bodyOfPost')}
            data-cy="create-post-description"
            value={postBody}
            onChange={(e) => {
              setPostBody((e.target as HTMLTextAreaElement).value);
            }}
            data-testid="postBodyInput"
          />
          {(() => {
            const isSafePreviewUrl =
              typeof preview === 'string' && preview.startsWith('blob:');
            return (
              preview &&
              previewType &&
              isSafePreviewUrl && (
                <div className={styles.imagePreviewContainer}>
                  {previewType === 'image' && (
                    <img
                      src={preview}
                      alt={t('createPostModal.selectedImage')}
                      className={styles.imagePreview}
                      data-testid="imagePreview"
                    />
                  )}

                  {previewType === 'video' && (
                    <video
                      src={preview}
                      controls
                      className={styles.videoPreview}
                      data-testid="videoPreview"
                    >
                      <track kind="captions" />
                    </video>
                  )}
                </div>
              )
            );
          })()}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.mediaActions}>
            <button
              type="button"
              className={styles.mediaButton}
              aria-label={t('createPostModal.addAttachment')}
              data-testid="addPhotoBtn"
              onClick={() => fileInputRef.current?.click()}
              title={t('createPostModal.addAttachment')}
            >
              <InsertPhotoOutlined />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*, video/*"
                id="addMedia"
                data-testid="addMedia"
                data-cy="addMediaField"
                hidden
                onChange={handleImageSelect}
              />
            </button>
            <button
              type="button"
              className={styles.mediaButton}
              aria-label={
                isPinned
                  ? t('createPostModal.unpinPost')
                  : t('createPostModal.pinPost')
              }
              data-cy="pinPost"
              data-testid="pinPostButton"
              onClick={() => setIspinned(!isPinned)}
              title={
                isPinned
                  ? t('createPostModal.unpinPost')
                  : t('createPostModal.pinPost')
              }
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
                className={`${styles.postButton} ${
                  isPostDisabled || isLoading ? styles.postButtonDisabled : ''
                }`}
                type="submit"
                disabled={isPostDisabled || isLoading}
                data-testid="createPostBtn"
              >
                {isLoading ? (
                  <span className={styles.loader}></span>
                ) : type === 'create' ? (
                  t('createPostModal.post')
                ) : (
                  t('createPostModal.saveChanges')
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreatePostModal;
