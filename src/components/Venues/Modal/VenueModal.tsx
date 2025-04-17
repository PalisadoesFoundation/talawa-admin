/**
 * VenueModal Component
 *
 * This component renders a modal for creating or editing a venue. It includes
 * form fields for venue details such as name, description, capacity, and an image.
 * The component supports both creation and editing modes, determined by the `edit` prop.
 *
 * @param {boolean} show - Determines whether the modal is visible.
 * @param {() => void} onHide - Callback to close the modal.
 * @param {() => void} refetchVenues - Callback to refetch the list of venues after a successful operation.
 * @param {string} orgId - The ID of the organization to which the venue belongs.
 * @param {InterfaceQueryVenueListItem | null} [venueData] - Data of the venue being edited (if in edit mode).
 * @param {boolean} edit - Indicates whether the modal is in edit mode.
 *
 * @returns {JSX.Element} The VenueModal component.
 *
 * @remarks
 * - Uses GraphQL mutations for creating and updating venues.
 * - Validates form inputs such as name, capacity, and image file.
 * - Provides image preview functionality and handles image uploads to MinIO.
 * - Displays success or error messages using `react-toastify`.
 *
 * @example
 * ```tsx
 * <VenueModal
 *   show={true}
 *   onHide={handleClose}
 *   refetchVenues={fetchVenues}
 *   orgId="12345"
 *   venueData={venue}
 *   edit={true}
 * />
 * ```
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from '../../../style/app-fixed.module.css';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  CREATE_VENUE_MUTATION,
  UPDATE_VENUE_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceQueryVenueListItem } from 'utils/interfaces';
import { useMinioUpload } from 'utils/MinioUpload';

export interface InterfaceVenueModalProps {
  show: boolean;
  onHide: () => void;
  refetchVenues: () => void;
  orgId: string;
  venueData?: InterfaceQueryVenueListItem | null;
  edit: boolean;
}

const VenueModal = ({
  show,
  onHide,
  refetchVenues,
  orgId,
  edit,
  venueData,
}: InterfaceVenueModalProps): JSX.Element => {
  // Translation hooks for different languages
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationVenues',
  });
  const { t: tCommon } = useTranslation('common');

  const { uploadFileToMinio } = useMinioUpload();

  // State to manage image preview and form data
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    name: venueData?.name || '',
    description: venueData?.description || '',
    capacity: venueData?.capacity || '',
    objectName: venueData?.image || '',
  });

  // Reference for the file input element
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Mutation function for creating or updating a venue
  const [mutate, { loading }] = useMutation(
    edit ? UPDATE_VENUE_MUTATION : CREATE_VENUE_MUTATION,
  );

  /**
   * Handles form submission to create or update a venue.
   *
   * Validates form inputs and sends a request to the server to create or update the venue.
   * If the operation is successful, it shows a success message, refetches venues, and resets the form.
   *
   * @returns A promise that resolves when the submission is complete.
   */
  // Update the handleSubmit function in VenueModal.tsx

  const handleSubmit = useCallback(async () => {
    // Validate name
    if (formState.name.trim().length === 0) {
      toast.error(t('venueTitleError') as string);
      return;
    }

    // Only validate name uniqueness if it has changed
    if (edit && formState.name.trim() === venueData?.name) {
      // If name hasn't changed, only update other fields
      const variables = {
        id: venueData._id,
        capacity: parseInt(formState.capacity, 10),
        description: formState.description?.trim() || '',
        file: formState.objectName || '',
        // Don't include name if it hasn't changed
      };
      try {
        const result = await mutate({ variables });

        if (result?.data?.editVenue) {
          toast.success(t('venueUpdated'));
          refetchVenues();
          onHide();
        }
      } catch (error) {
        console.error('Mutation error:', error);
        errorHandler(t, error);
      }
      return;
    }

    // Validate capacity
    const capacityNum = parseInt(formState.capacity, 10);
    if (Number.isNaN(capacityNum) || capacityNum <= 0) {
      toast.error(t('venueCapacityError') as string);
      return;
    }

    try {
      if (edit && venueData?._id) {
        // If name has changed, include all fields
        const variables = {
          id: venueData._id,
          name: formState.name.trim(),
          capacity: capacityNum,
          description: formState.description?.trim() || '',
          file: formState.objectName || '',
        };

        const result = await mutate({ variables });

        if (result?.data?.editVenue) {
          toast.success(t('venueUpdated'));
          refetchVenues();
          onHide();
        }
      } else {
        // Create venue case
        const variables = {
          name: formState.name.trim(),
          capacity: capacityNum,
          description: formState.description?.trim() || '',
          file: formState.objectName || '',
          organizationId: orgId,
        };

        const result = await mutate({ variables });

        if (result?.data?.createVenue) {
          toast.success(t('venueCreated'));
          refetchVenues();
          onHide();
        }
      }
    } catch (error) {
      console.error('Mutation error:', error);
      if (error instanceof Error && error.message.includes('alreadyExists')) {
        toast.error(
          t('venueNameExists') || 'A venue with this name already exists',
        );
      } else {
        errorHandler(t, error);
      }
    }
  }, [formState, mutate, onHide, refetchVenues, t, venueData, edit, orgId]);

  /**
   * Clears the selected image and resets the image preview.
   *
   * This function also clears the file input field.
   */
  const clearImageInput = useCallback(() => {
    setFormState((prevState) => ({ ...prevState, objectName: '' }));
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Update form state when venueData changes
  useEffect(() => {
    setFormState({
      name: venueData?.name || '', // Prefill name or set as empty
      description: venueData?.description || '', // Prefill description
      capacity: venueData?.capacity?.toString() || '', // Prefill capacity as a string
      objectName: venueData?.image || '', // Prefill image
    });

    if (venueData?.image) {
      try {
        const previewUrl = new URL(
          `/api/images/${venueData.image}`,
          window.location.origin,
        ).toString();
        setImagePreviewUrl(previewUrl);
      } catch (error) {
        toast.error('Error creating preview URL');
        setImagePreviewUrl(null);
      }
    } else {
      setImagePreviewUrl(null);
    }
  }, [venueData]);

  const { name, description, capacity } = formState;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header className="d-flex align-items-start">
        <p className={styles.titlemodal}>{t('venueDetails')}</p>
        <Button
          variant="danger"
          onClick={onHide}
          className={styles.closeButton}
          data-testid="createVenueModalCloseBtn"
        >
          <i className="fa fa-times" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form data-testid="venueForm">
          <label htmlFor="venuetitle">{t('venueName')}</label>
          <Form.Control
            type="title"
            id="venuetitle"
            placeholder={t('enterVenueName')}
            autoComplete="off"
            required
            value={name}
            onChange={(e): void => {
              setFormState({ ...formState, name: e.target.value });
            }}
            className={styles.inputField}
          />
          <label htmlFor="venuedescrip">{tCommon('description')}</label>
          <Form.Control
            type="text"
            id="venuedescrip"
            as="textarea"
            placeholder={t('enterVenueDesc')}
            autoComplete="off"
            required
            maxLength={500}
            value={description}
            onChange={(e): void => {
              setFormState({ ...formState, description: e.target.value });
            }}
            className={styles.inputField}
          />
          <label htmlFor="venuecapacity">{t('capacity')}</label>
          <Form.Control
            type="text"
            id="venuecapacity"
            placeholder={t('enterVenueCapacity')}
            autoComplete="off"
            required
            value={capacity}
            onChange={(e): void => {
              setFormState({ ...formState, capacity: e.target.value });
            }}
            className={styles.inputField}
          />
          <Form.Label htmlFor="venueImg">{t('image')}</Form.Label>
          <Form.Control
            accept="image/*"
            id="venueImgUrl"
            data-testid="venueImgUrl"
            name="venueImg"
            type="file"
            placeholder={t('uploadVenueImage')}
            multiple={false}
            ref={fileInputRef}
            onChange={async (e: React.ChangeEvent) => {
              const target = e.target as HTMLInputElement;
              const file = target.files?.[0];

              if (file) {
                if (!file.size) {
                  toast.error('Empty file selected');
                  return;
                }
                if (file.size > 5 * 1024 * 1024) {
                  toast.error('File size exceeds the 5MB limit');
                  return;
                }
                if (!file.type.startsWith('image/')) {
                  toast.error('Only image files are allowed');
                  return;
                }
                try {
                  const { objectName } = await uploadFileToMinio(
                    file,
                    'organizations',
                  );
                  setFormState({ ...formState, objectName });
                  const previewUrl = URL.createObjectURL(file);
                  setImagePreviewUrl(previewUrl);
                } catch (error) {
                  toast.error('Failed to upload image');
                }
              }
            }}
            className={styles.inputField}
          />
          {imagePreviewUrl && (
            <div className={styles.previewVenueModal}>
              <img src={imagePreviewUrl} alt="Venue Image Preview" />
              <button
                className={styles.closeButtonP}
                onClick={clearImageInput}
                data-testid="closeimage"
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          )}

          <Button
            type="submit"
            className={styles.addButton}
            value={edit ? 'editVenue' : 'createVenue'}
            data-testid={edit ? 'updateVenueBtn' : 'createVenueBtn'}
            onClick={handleSubmit}
            disabled={loading}
          >
            {edit ? t('editVenue') : t('createVenue')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default VenueModal;
