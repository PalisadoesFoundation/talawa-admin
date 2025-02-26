import React, { useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import { Client as MinioClient } from 'minio';

import styles from '../../style/app.module.css';

// MinIO client configuration (replace with your organization's MinIO details)
const minioClient = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT || 'minio.example.com', // Use environment variable or fallback
  port: parseInt(process.env.MINIO_PORT || '9000'), // Use environment variable or fallback
  useSSL: process.env.MINIO_USE_SSL === 'true', // Use environment variable or fallback
  accessKey: process.env.MINIO_ACCESS_KEY || 'YOUR-ACCESSKEY', // Use environment variable or fallback
  secretKey: process.env.MINIO_SECRET_KEY || 'YOUR-SECRETKEY', // Use environment variable or fallback
});

// Function to upload a file to MinIO
const uploadFileToMinIO = async (file: File): Promise<string> => {
  const bucketName = 'attachments'; // Replace with your bucket name
  const objectName = `attachments/${Date.now()}_${file.name}`; // Unique object name

  try {
    // Convert the File object to a Buffer
    const fileBuffer = await file.arrayBuffer();
    await minioClient.putObject(
      bucketName,
      objectName,
      Buffer.from(fileBuffer),
      file.size,
    );

    // Use the endPoint from the configuration
    const endPoint = process.env.MINIO_ENDPOINT || 'minio.example.com'; // Use environment variable or fallback
    return `https://${endPoint}/${bucketName}/${objectName}`; // Return the file URL
  } catch (error) {
    console.error('Error uploading file to MinIO:', error);
    throw new Error(
      'Failed to upload file. Please check your network connection and try again.',
    );
  }
};

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
  t: (key: string) => string;
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
}) => {
  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      urls: prevState.urls.filter((url) => url.trim() !== ''),
      attachments: prevState.attachments.filter((att) => att !== ''),
    }));
  }, []);

  // Updated handleFileChange function
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);
      let totalSize = 0;
      files.forEach((file) => {
        totalSize += file.size;
      });
      if (totalSize > 10 * 1024 * 1024) {
        toast.error(t('fileSizeExceedsLimit'));
        return;
      }

      try {
        const uploadedUrls = await Promise.all(
          files.map(async (file) => await uploadFileToMinIO(file)),
        );
        setFormState((prevState) => ({
          ...prevState,
          attachments: [...prevState.attachments, ...uploadedUrls],
        }));
      } catch (error) {
        console.error('File upload failed:', error);
        toast.error(t('fileUploadFailed'));
      }
    }
  };

  const handleRemoveAttachment = (attachment: string): void => {
    setFormState((prevState) => ({
      ...prevState,
      attachments: prevState.attachments.filter((item) => item !== attachment),
    }));
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
          aria-label="Close modal"
        >
          <i className="fa fa-times" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={updateAgendaItemHandler}>
          {/* Existing form fields remain unchanged */}
          {/* ... */}

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
            />
            <Form.Text>{t('attachmentLimit')}</Form.Text>
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
                    >
                      <source src={attachment} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={attachment} alt="Attachment preview" />
                  )}
                  <button
                    className={styles.closeButtonFile}
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveAttachment(attachment);
                    }}
                    data-testid="deleteAttachment"
                    aria-label="Remove attachment"
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
