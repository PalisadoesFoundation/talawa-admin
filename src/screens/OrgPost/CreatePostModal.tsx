import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Modal, Form, Button } from 'react-bootstrap';
import type { FormEvent } from 'react';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import convertToBase64 from 'utils/convertToBase64';
import { errorHandler } from 'utils/errorHandler';
import styles from 'style/app-fixed.module.css';

interface ICreatePostModalProps {
  show: boolean;
  onHide: () => void;
  refetch: () => Promise<unknown>;
  orgId: string | undefined;
}

interface IFileMetadataInput {
  fileHash: string;
  mimetype: string;
  name: string;
  objectName: string;
}

interface ICreatePostInput {
  caption: string;
  organizationId: string;
  isPinned: boolean;
  attachments: IFileMetadataInput[];
}

interface ICreatePostData {
  createPost: {
    id: string;
    caption: string;
    pinnedAt?: string;
    attachments?: {
      fileHash: string;
      mimeType: string;
      name: string;
      objectName: string;
    }[];
  };
}

/**
 * Modal component for creating posts within an organization.
 *
 * @component
 * @param props - Props including show, onHide, refetch, and orgId
 * @returns The modal for adding a post
 */
const CreatePostModal: React.FC<ICreatePostModalProps> = ({
  show,
  onHide,
  refetch,
  orgId,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'orgPost' });
  const { t: tCommon } = useTranslation('common');

  const [postformState, setPostFormState] = useState({
    posttitle: '',
    postInfo: '',
    addMedia: '',
    pinPost: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState('');

  const [create, { loading: createPostLoading }] = useMutation<
    ICreatePostData,
    { input: ICreatePostInput }
  >(CREATE_POST_MUTATION);

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
        return 'IMAGE_JPEG'; // fallback
    }
  }

  const createPost = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const trimmedTitle = postformState.posttitle.trim();

      // Validate that title is not empty after trimming
      if (trimmedTitle === '') {
        toast.error(t('messageTitleError'));
        return;
      }

      let attachment: IFileMetadataInput | null = null;
      const mediaFile = videoFile || file;

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
            caption: trimmedTitle,
            organizationId: orgId,
            isPinned: postformState.pinPost,
            attachments: attachment ? [attachment] : [],
          },
        },
      });

      if (data?.createPost) {
        toast.success(t('postCreatedSuccess') as string);
        await refetch();

        // Reset all state
        setPostFormState({
          posttitle: '',
          postInfo: '',
          addMedia: '',
          pinPost: false,
        });
        setFile(null);
        setVideoFile(null);
        setVideoPreview('');

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
      errorHandler(t, error);
    }
  };

  const handleAddMediaChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      // Validate file type
      if (
        !selectedFile.type.startsWith('image/') &&
        !selectedFile.type.startsWith('video/')
      ) {
        toast.error('Please select an image or video file');
        setFile(null);
        setPostFormState((prev) => ({ ...prev, addMedia: '' }));
        e.target.value = '';
        return;
      }

      setFile(selectedFile);

      try {
        const base64 = await convertToBase64(selectedFile);
        setPostFormState((prev) => ({ ...prev, addMedia: base64 }));
      } catch {
        toast.error('Could not generate preview');
        setFile(null);
        setPostFormState((prev) => ({ ...prev, addMedia: '' }));
        e.target.value = '';
      }
    } else {
      setFile(null);
      setPostFormState((prev) => ({ ...prev, addMedia: '' }));
      e.target.value = '';
    }
  };

  const handleVideoAddMediaChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('video/')) {
        toast.error('Please select a video file');
        setVideoFile(null);
        setVideoPreview('');
        e.target.value = '';
        return;
      }
      setVideoFile(selectedFile);
      try {
        const base64 = await convertToBase64(selectedFile);
        setVideoPreview(base64);
      } catch {
        toast.error('Could not generate video preview');
        setVideoFile(null);
        setVideoPreview('');
        e.target.value = '';
      }
    } else {
      setVideoFile(null);
      setVideoPreview('');
      e.target.value = '';
    }
  };

  const handleClose = (): void => {
    setPostFormState({
      posttitle: '',
      postInfo: '',
      addMedia: '',
      pinPost: false,
    });
    setFile(null);
    setVideoFile(null);
    setVideoPreview('');

    // Clear DOM file inputs
    const fileInput = document.getElementById('addMedia') as HTMLInputElement;
    const videoInput = document.getElementById(
      'videoAddMedia',
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    if (videoInput) videoInput.value = '';

    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      aria-labelledby="createPostModalTitle"
      centered
    >
      <Modal.Header data-testid="modalOrganizationHeader" closeButton>
        <Modal.Title id="createPostModalTitle">{t('postDetails')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={createPost} data-testid="createPostForm">
        <Modal.Body>
          <Form.Label htmlFor="posttitle">{t('postTitle')}</Form.Label>
          <Form.Control
            type="text"
            id="posttitle"
            className={`mb-3 ${styles.inputField}`}
            placeholder={t('postTitle1')}
            data-testid="modalTitle"
            data-cy="modalTitle"
            autoComplete="off"
            required
            value={postformState.posttitle}
            onChange={(e): void => {
              setPostFormState({
                ...postformState,
                posttitle: e.target.value,
              });
            }}
          />

          <Form.Label htmlFor="postInfo">{t('messageDescription')}</Form.Label>
          <Form.Control
            as="textarea"
            id="postInfo"
            className={`mb-3 ${styles.inputField}`}
            placeholder={t('messageDescription')}
            data-testid="modalinfo"
            data-cy="modalinfo"
            rows={3}
            value={postformState.postInfo}
            onChange={(e): void => {
              setPostFormState({
                ...postformState,
                postInfo: e.target.value,
              });
            }}
          />
        </Modal.Body>
        <Modal.Body data-testid="modalOrganizationUpload">
          <Form.Label htmlFor="addMedia">{t('addMedia')}</Form.Label>
          <Form.Control
            id="addMedia"
            name="addMedia"
            type="file"
            accept="image/*,video/*"
            placeholder={t('addMedia')}
            multiple={false}
            onChange={handleAddMediaChange}
            data-testid="addMediaField"
            data-cy="addMediaField"
            className={`mb-3 ${styles.inputField}`}
          />

          <Form.Control
            id="videoAddMedia"
            name="videoAddMedia"
            type="file"
            accept="video/*"
            placeholder={t('addVideo')}
            onChange={handleVideoAddMediaChange}
            data-testid="addVideoField"
            className={`mb-3 ${styles.inputField}`}
          />

          {postformState.addMedia && file && (
            <div className={styles.previewOrgPost} data-testid="mediaPreview">
              {file.type.startsWith('image') ? (
                <img
                  src={postformState.addMedia}
                  data-testid="imagePreview"
                  alt="Post preview"
                />
              ) : (
                <video controls data-testid="videoPreview">
                  <source src={postformState.addMedia} type={file.type} />
                  {/* TODO: add captions (track src) for accessibility */}(
                  {t('tag')})
                </video>
              )}
              <button
                type="button"
                className={styles.closeButtonOrgPost}
                onClick={(): void => {
                  setPostFormState({ ...postformState, addMedia: '' });
                  setFile(null);
                  const fileInput = document.getElementById(
                    'addMedia',
                  ) as HTMLInputElement;
                  if (fileInput) {
                    fileInput.value = '';
                  }
                }}
                data-testid="mediaCloseButton"
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          )}

          {videoPreview && videoFile && (
            <div
              className={styles.previewOrgPost}
              data-testid="videoPreviewContainer"
            >
              <video controls data-testid="videoPreview">
                <source src={videoPreview} type={videoFile.type} />
                {/* TODO: add captions (track src) for accessibility */}(
                {t('tag')})
              </video>
              <button
                type="button"
                className={styles.closeButtonOrgPost}
                onClick={(): void => {
                  setVideoPreview('');
                  setVideoFile(null);
                  const fileInput = document.getElementById(
                    'videoAddMedia',
                  ) as HTMLInputElement;
                  if (fileInput) {
                    fileInput.value = '';
                  }
                }}
                data-testid="videoMediaCloseButton"
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          )}
          <Form.Label htmlFor="pinPost" className="mt-3">
            {t('pinPost')}
          </Form.Label>
          <Form.Switch
            id="pinPost"
            type="checkbox"
            data-testid="pinPost"
            data-cy="pinPost"
            checked={postformState.pinPost}
            onChange={(): void =>
              setPostFormState({
                ...postformState,
                pinPost: !postformState.pinPost,
              })
            }
            className={styles.switch}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            className={styles.removeButton}
            onClick={handleClose}
            data-testid="closeOrganizationModal"
          >
            {tCommon('cancel')}
          </Button>
          <Button
            type="submit"
            value="invite"
            data-testid="createPostBtn"
            data-cy="createPostBtn"
            className={`${styles.addButton} mt-2`}
            disabled={createPostLoading}
          >
            {createPostLoading ? t('creatingMessage') : t('addPost')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreatePostModal;
