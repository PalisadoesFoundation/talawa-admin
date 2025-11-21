import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
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
    postinfo: '',
    postImage: '',
    postVideo: '',
    addMedia: '',
    pinPost: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState('');

  const [create, { loading: createPostLoading }] =
    useMutation(CREATE_POST_MUTATION);

  async function getFileHashFromFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
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

  const createPost = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      let attachment = null;
      if (file && typeof file !== 'string') {
        const fileName = file.name.split('/').pop() || 'defaultFileName';
        const objectName = 'uploads/' + fileName;
        const fileHash = await getFileHashFromFile(file);

        attachment = {
          fileHash,
          mimetype: getMimeTypeEnum(file.type),
          name: fileName,
          objectName,
        };
      }
      const { data } = await create({
        variables: {
          input: {
            caption: postformState.posttitle.trim(),
            organizationId: orgId,
            isPinned: postformState.pinPost,
            ...(attachment && { attachments: [attachment] }),
          },
        },
      });

      if (data?.createPost) {
        toast.success(t('postCreatedSuccess') as string);
        await refetch();

        setPostFormState({
          posttitle: '',
          postinfo: '',
          postImage: '',
          postVideo: '',
          addMedia: '',
          pinPost: false,
        });
        setFile(null);
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
        return;
      }

      setFile(selectedFile);

      try {
        const base64 = await convertToBase64(selectedFile);
        setPostFormState((prev) => ({ ...prev, addMedia: base64 }));
      } catch {
        toast.error('Could not generate preview');
      }
    } else {
      setFile(null);
      setPostFormState((prev) => ({ ...prev, addMedia: '' }));
    }
  };

  const handleVideoAddMediaChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }
      setVideoFile(selectedFile);
      try {
        const base64 = await convertToBase64(selectedFile);
        setVideoPreview(base64);
      } catch {
        toast.error('Could not generate video preview');
      }
    } else {
      setVideoFile(null);
      setVideoPreview('');
    }
  };

  const handleClose = (): void => {
    setPostFormState({
      posttitle: '',
      postinfo: '',
      postImage: '',
      postVideo: '',
      addMedia: '',
      pinPost: false,
    });
    setFile(null);
    setVideoFile(null);
    setVideoPreview('');
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header data-testid="modalOrganizationHeader" closeButton>
        <Modal.Title>{t('postDetails')}</Modal.Title>
      </Modal.Header>
      <Form onSubmitCapture={createPost}>
        <Modal.Body>
          <Form.Label htmlFor="posttitle">{t('postTitle')}</Form.Label>
          <Form.Control
            type="name"
            id="orgname"
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
          <Form.Label htmlFor="postinfo">{t('information')}</Form.Label>
          <Form.Control
            type="descrip"
            id="descrip"
            className={`mb-3 ${styles.inputField}`}
            placeholder={t('information1')}
            data-testid="modalinfo"
            data-cy="modalinfo"
            autoComplete="off"
            required
            value={postformState.postinfo}
            onChange={(e): void => {
              setPostFormState({
                ...postformState,
                postinfo: e.target.value,
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
                  alt="Post Image Preview"
                />
              ) : (
                <video controls data-testid="videoPreview">
                  <source src={postformState.addMedia} type={file.type} />(
                  {t('tag')})
                </video>
              )}
              <button
                className={styles.closeButtonOrgPost}
                onClick={(): void => {
                  setPostFormState({ ...postformState, addMedia: '' });
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
                <source src={videoPreview} type={videoFile.type} />({t('tag')})
              </video>
              <button
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
          <Form.Label htmlFor="pinpost" className="mt-3">
            {t('pinPost')}
          </Form.Label>
          <Form.Switch
            id="pinPost"
            type="checkbox"
            data-testid="pinPost"
            data-cy="pinPost"
            defaultChecked={postformState.pinPost}
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
            {createPostLoading ? 'Creating...' : t('addPost')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreatePostModal;
