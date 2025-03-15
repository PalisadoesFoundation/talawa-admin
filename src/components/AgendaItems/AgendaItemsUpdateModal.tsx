import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { FaLink, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

import styles from '../../style/app.module.css';
import type { InterfaceAgendaItemCategoryInfo } from 'utils/interfaces';

interface InterfaceFormStateType {
  agendaItemCategoryIds: string[];
  agendaItemCategoryNames: string[];
  title: string;
  description: string;
  duration: string;
  attachments: string[]; // Will store MinIO URLs
  urls: string[];
  createdBy: {
    firstName: string;
    lastName: string;
  };
}

interface InterfaceAgendaItemsUpdateModalProps {
  agendaItemUpdateModalIsOpen: boolean;
  hideUpdateModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  updateAgendaItemHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string; // Translation function
  agendaItemCategories: InterfaceAgendaItemCategoryInfo[] | undefined;
}

const AgendaItemsUpdateModal: React.FC<
  InterfaceAgendaItemsUpdateModalProps
> = ({
  agendaItemUpdateModalIsOpen,
  hideUpdateModal,
  formState,
  setFormState,
  updateAgendaItemHandler,
  t,
  agendaItemCategories,
}) => {
  const [newUrl, setNewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false); // Loading state for file uploads

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      urls: prevState.urls.filter((url) => url.trim() !== ''),
      attachments: prevState.attachments.filter((att) => att !== ''),
    }));
  }, []);

  /**
   * Uploads a file to MinIO using a pre-signed URL.
   *
   * @param file - The file to upload.
   * @returns The MinIO file URL.
   */
  const uploadFileToMinIO = async (file: File): Promise<string> => {
    try {
      // Fetch pre-signed URL from the backend
      const response = await fetch('/api/get-presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });

      if (!response.ok) {
        throw new Error(t('failedToGetPresignedUrl')); // Use `t` for translation
      }

      const { presignedUrl, fileUrl } = await response.json();

      // Upload the file to MinIO using the pre-signed URL
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(t('failedToUploadFile')); // Use `t` for translation
      }

      return fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(t('fileUploadFailed')); // Use `t` for translation
    }
  };

  const isValidUrl = (url: string): boolean => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  const handleAddUrl = (): void => {
    if (newUrl.trim() !== '' && isValidUrl(newUrl.trim())) {
      setFormState({
        ...formState,
        urls: [...formState.urls.filter((url) => url.trim() !== ''), newUrl],
      });
      setNewUrl('');
    } else {
      toast.error(t('invalidUrl'));
    }
  };

  const handleRemoveUrl = (url: string): void => {
    setFormState({
      ...formState,
      urls: formState.urls.filter((item) => item !== url),
    });
  };

  /**
   * Handles file input change event.
   * Uploads files to MinIO and stores the returned URLs.
   */
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      setIsUploading(true); // Start loading
      const files = Array.from(target.files);
      let totalSize = 0;

      // Validate file types and sizes
      const validFileTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
      ];
      const maxFileSize = 10 * 1024 * 1024; // 10 MB

      for (const file of files) {
        if (!validFileTypes.includes(file.type)) {
          toast.error(t('invalidFileType'));
          setIsUploading(false); // Stop loading
          return;
        }
        if (file.size > maxFileSize) {
          toast.error(t('fileSizeExceedsLimit'));
          setIsUploading(false); // Stop loading
          return;
        }
        totalSize += file.size;
      }

      if (totalSize > maxFileSize) {
        toast.error(t('totalFileSizeExceedsLimit'));
        setIsUploading(false); // Stop loading
        return;
      }

      try {
        const fileUrls = await Promise.all(
          files.map(async (file) => await uploadFileToMinIO(file)),
        );
        setFormState({
          ...formState,
          attachments: [...formState.attachments, ...fileUrls],
        });
      } catch (error) {
        console.error('File upload error:', error);
        if (error instanceof Error) {
          toast.error(`${t('fileUploadFailed')}: ${error.message}`);
        } else {
          toast.error(t('fileUploadFailed'));
        }
      } finally {
        setIsUploading(false); // Stop loading
      }
    }
  };

  const handleRemoveAttachment = (attachment: string): void => {
    setFormState({
      ...formState,
      attachments: formState.attachments.filter((item) => item !== attachment),
    });
  };

  return (
    <Modal
      className={styles.AgendaItemModal}
      show={agendaItemUpdateModalIsOpen}
      onHide={hideUpdateModal}
    >
      <Modal.Header>
        <p className={styles.titlemodalAgendaItems}>{t('updateAgendaItem')}</p>
        <Button
          onClick={hideUpdateModal}
          data-testid="updateAgendaItemModalCloseBtn"
        >
          <i className="fa fa-times" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={updateAgendaItemHandler}>
          <Form.Group className="d-flex mb-3 w-100">
            <Autocomplete
              multiple
              className={`${styles.noOutline} w-100`}
              limitTags={2}
              data-testid="categorySelect"
              options={agendaItemCategories || []}
              value={
                agendaItemCategories?.filter((category) =>
                  formState.agendaItemCategoryIds.includes(category._id),
                ) || []
              }
              filterSelectedOptions={true}
              getOptionLabel={(
                category: InterfaceAgendaItemCategoryInfo,
              ): string => category.name}
              onChange={(_, newCategories): void => {
                setFormState({
                  ...formState,
                  agendaItemCategoryIds: newCategories.map(
                    (category) => category._id,
                  ),
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label={t('category')} />
              )}
            />
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>{t('title')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('enterTitle')}
                  value={formState.title}
                  onChange={(e) =>
                    setFormState({ ...formState, title: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="duration">
                <Form.Label>{t('duration')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('enterDuration')}
                  value={formState.duration}
                  required
                  onChange={(e) =>
                    setFormState({ ...formState, duration: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>{t('description')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              placeholder={t('enterDescription')}
              value={formState.description}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('url')}</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder={t('enterUrl')}
                id="basic-url"
                data-testid="urlInput"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
              <Button onClick={handleAddUrl} data-testid="linkBtn">
                {t('link')}
              </Button>
            </div>

            {formState.urls.map((url, index) => (
              <li key={index} className={styles.urlListItem}>
                <FaLink className={styles.urlIcon} />
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url.length > 50 ? url.substring(0, 50) + '...' : url}
                </a>
                <Button
                  variant="danger"
                  size="sm"
                  data-testid="deleteUrl"
                  className={styles.deleteButtonAgendaItems}
                  onClick={() => handleRemoveUrl(url)}
                >
                  <FaTrash />
                </Button>
              </li>
            ))}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('attachments')}</Form.Label>
            <Form.Control
              accept="image/*, video/*"
              data-testid="attachment"
              name="attachment"
              type="file"
              id="attachment"
              multiple={true}
              onChange={handleFileChange}
              disabled={isUploading} // Disable input while uploading
            />
            <Form.Text>{t('attachmentLimit')}</Form.Text>
            {isUploading && <p>{t('uploadingFiles')}...</p>}{' '}
            {/* Loading indicator */}
          </Form.Group>
          {formState.attachments && (
            <div className={styles.previewFile} data-testid="mediaPreview">
              {formState.attachments.map((attachment, index) => (
                <div key={index} className={styles.attachmentPreview}>
                  {attachment.includes('video') ? (
                    <video
                      muted
                      autoPlay={true}
                      loop={true}
                      playsInline
                      crossOrigin="anonymous"
                      controls // Add controls for video playback
                    >
                      <source src={attachment} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={attachment}
                      alt="Attachment preview"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'fallback-image-url'; // Fallback for broken images
                      }}
                    />
                  )}
                  <button
                    className={styles.closeButtonFile}
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveAttachment(attachment);
                    }}
                    data-testid="deleteAttachment"
                  >
                    <i className="fa fa-times" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <Button
            type="submit"
            className={styles.greenregbtnAgendaItems}
            data-testid="updateAgendaItemBtn"
          >
            {t('update')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgendaItemsUpdateModal;
