import React, { useEffect, useState, type ChangeEvent } from 'react';
import { Button, Form, Image, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import ImageIcon from '@mui/icons-material/Image';
import { errorHandler } from 'utils/errorHandler';
import UserDefault from '../../../assets/images/defaultImg.png';
import styles from './StartPostModal.module.css';
import type { InterfaceQueryUserListItem } from 'utils/interfaces';
import convertToBase64 from 'utils/convertToBase64';
import useLocalStorage from 'utils/useLocalstorage';
import { error } from 'console';

interface InterfaceStartPostModalProps {
  show: boolean;
  onHide: () => void;
  fetchPosts: () => void;
  userData: InterfaceQueryUserListItem | undefined;
  organizationId: string;
  img: string | null;
}

const StartPostModal = ({
  show,
  onHide,
  fetchPosts,
  userData,
  organizationId,
}: InterfaceStartPostModalProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'home' });
  const [postformState, setPostFormState] = useState<{
    postinfo: string;
    mediaFile: File | null;
  }>({
    postinfo: '',
    mediaFile: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { getItem } = useLocalStorage();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setPostFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    setPostFormState((prev) => ({ ...prev, mediaFile: file }));

    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleHide = (): void => {
    setPostFormState({
      postinfo: '',
      mediaFile: null,
    });
    setPreviewUrl(null);
    onHide();
  };

  const handlePost = async (): Promise<void> => {
    try {
      
      const formData = new FormData();
      formData.append('text', postformState.postinfo);
      formData.append('organizationId', organizationId);

      if (postformState.mediaFile) {
        formData.append('file', postformState.mediaFile);
      }

      const accessToken = getItem('token');

      const response = await fetch(
        `${process.env.REACT_APP_TALAWA_REST_URL}/create-post`,
        {
          method: 'POST',
          body: formData,
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || t('postCreationFailed'));
      }

      if (data) {
        toast.dismiss();
        toast.success(t('postNowVisibleInFeed'));
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
      <Modal.Header closeButton data-testid="modalHeader">
        <Modal.Title>
          <span className="d-flex gap-2 align-items-center">
            <span className={styles.userImage}>
              <Image
                src={userData?.user?.image || UserDefault}
                roundedCircle
                className="mt-2"
                data-testid="userImage"
                width={40}
                height={40}
              />
            </span>
            <span>{`${userData?.user?.firstName} ${userData?.user?.lastName}`}</span>
          </span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Control
            as="textarea"
            rows={3}
            name="postinfo"
            className={`${styles.postInput} border-0`}
            data-testid="postInput"
            autoComplete="off"
            required
            onChange={handleInputChange}
            placeholder={t('somethingOnYourMind')}
            value={postformState.postinfo}
          />

          {previewUrl && postformState.mediaFile && (
            <div className={styles.preview}>
              {postformState.mediaFile.type.startsWith('image/') ? (
                <Image src={previewUrl} alt="Post Image Preview" fluid />
              ) : (
                <video controls data-testid="videoPreview">
                  <source
                    src={previewUrl}
                    type={postformState.mediaFile.type}
                  />
                  ({t('tag')})
                </video>
              )}
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button
              variant="outline-secondary"
              onClick={() => document.getElementById('modalFileInput')?.click()}
              className="d-flex align-items-center gap-2"
            >
              <ImageIcon />
              Add Media
            </Button>
            <Form.Control
              type="file"
              id="modalFileInput"
              className="d-none"
              accept="image/*,video/*"
              multiple={false}
              onChange={handleMediaChange}
              data-testid="modalFileInput"
            />

            <Button
              variant="primary"
              onClick={handlePost}
              disabled={!postformState.postinfo.trim()}
              data-testid="createPostBtn"
            >
              Post
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default StartPostModal;
