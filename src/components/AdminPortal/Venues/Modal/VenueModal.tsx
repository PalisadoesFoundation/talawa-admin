/**
 * VenueModal Component
 *
 * This component renders a modal for creating or editing a venue. It includes
 * form fields for venue details such as name, description, capacity, and an image.
 * The component supports both creation and editing modes, determined by the `edit` prop.
 *
 * @param show - Determines whether the modal is visible.
 * @param onHide - Callback to close the modal.
 * @param refetchVenues - Callback to refetch the list of venues after a successful operation.
 * @param orgId - The ID of the organization to which the venue belongs.
 * @param venueData - Data of the venue being edited (if in edit mode).
 * @param edit - Indicates whether the modal is in edit mode.
 *
 * @returns The VenueModal component.
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
import { Button, Form } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  CREATE_VENUE_MUTATION,
  UPDATE_VENUE_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceQueryVenueListItem } from 'utils/interfaces';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { BaseModal } from 'shared-components/BaseModal';

export interface InterfaceVenueModalProps {
  show: boolean;
  onHide: () => void;
  refetchVenues: () => void;
  orgId: string;
  venueData?: InterfaceQueryVenueListItem | null;
  edit: boolean;
}

interface InterfaceVenueFormState {
  name: string;
  description: string;
  capacity: string;
  objectName: string;
  attachments?: File[];
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

  // State to manage image preview and form data
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [formState, setFormState] = useState<InterfaceVenueFormState>({
    name: venueData?.node.name || '',
    description: venueData?.node.description || '',
    capacity: venueData?.node.capacity?.toString() || '',
    objectName: venueData?.node.image || '',
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
      NotificationToast.error({
        key: 'organizationVenues.venueTitleError',
        namespace: 'translation',
      });
      return;
    }

    // Only validate name uniqueness if it has changed
    if (edit && formState.name.trim() === venueData?.node.name) {
      // If name hasn't changed, validate capacity and update other fields
      const capacityNum = parseInt(formState.capacity, 10);
      if (Number.isNaN(capacityNum) || capacityNum <= 0) {
        NotificationToast.error({
          key: 'organizationVenues.venueCapacityError',
          namespace: 'translation',
        });
        return;
      }

      const variables = {
        id: venueData.node.id,
        capacity: capacityNum,
        description: formState.description?.trim() || '',
        ...(formState.attachments &&
          formState.attachments.length > 0 && {
            attachments: formState.attachments,
          }),
      };
      try {
        const result = await mutate({ variables });

        if (result?.data?.updateVenue) {
          NotificationToast.success({
            key: 'organizationVenues.venueUpdated',
            namespace: 'translation',
          });
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
      NotificationToast.error({
        key: 'organizationVenues.venueCapacityError',
        namespace: 'translation',
      });
      return;
    }

    try {
      if (edit && venueData?.node.id) {
        // If name has changed, include all fields
        const variables = {
          id: venueData.node.id,
          name: formState.name.trim(),
          capacity: capacityNum,
          description: formState.description?.trim() || '',
          ...(formState.attachments &&
            formState.attachments.length > 0 && {
              attachments: formState.attachments,
            }),
        };

        const result = await mutate({ variables });

        if (result?.data?.updateVenue) {
          NotificationToast.success({
            key: 'organizationVenues.venueUpdated',
            namespace: 'translation',
          });
          refetchVenues();
          onHide();
        }
      } else {
        const variables = {
          name: formState.name.trim(),
          capacity: capacityNum,
          description: formState.description?.trim() || '',
          organizationId: orgId,
          ...(formState.attachments &&
            formState.attachments.length > 0 && {
              attachments: formState.attachments,
            }),
        };

        const result = await mutate({ variables });

        if (result?.data?.createVenue) {
          NotificationToast.success({
            key: 'organizationVenuesNotification.venueCreated',
            namespace: 'translation',
          });
          refetchVenues();
          onHide();
        }
      }
    } catch (error) {
      console.error('Mutation error:', error);
      if (error instanceof Error && error.message.includes('alreadyExists')) {
        NotificationToast.error({
          key: 'organizationVenuesNotification.venueNameExists',
          namespace: 'translation',
        });
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
    // Clean up the object URL to prevent memory leaks
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setFormState((prevState) => ({
      ...prevState,
      objectName: '',
      attachments: [], // Clear attachments too
    }));
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [imagePreviewUrl]);

  // Update form state when venueData changes
  useEffect(() => {
    setFormState({
      name: venueData?.node.name || '', // Prefill name or set as empty
      description: venueData?.node.description || '', // Prefill description
      capacity: venueData?.node.capacity?.toString() || '', // Prefill capacity as a string
      objectName: venueData?.node.image || '', // Prefill image
      attachments: [], // Reset attachments
    });

    if (venueData?.node.image) {
      try {
        const previewUrl = new URL(
          `/api/images/${venueData.node.image}`,
          window.location.origin,
        ).toString();
        setImagePreviewUrl(previewUrl);
      } catch {
        NotificationToast.error({
          key: 'unknownError',
          namespace: 'errors',
        });
        setImagePreviewUrl(null);
      }
    } else {
      setImagePreviewUrl(null);
    }
  }, [venueData]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const { name, description, capacity } = formState;
  // Handle file uploads
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0]; // Get the first file
      const maxFileSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

      if (!allowedTypes.includes(file.type)) {
        NotificationToast.error({
          key: 'invalidFileType',
          namespace: 'errors',
        });
        return;
      }

      if (file.size > maxFileSize) {
        NotificationToast.error({
          key: 'fileTooLarge',
          namespace: 'errors',
        });
        return;
      }

      if (!file.size) {
        NotificationToast.error({
          key: 'emptyFile',
          namespace: 'errors',
        });
        return;
      }

      // Revoke any existing blob URL before creating a new one
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);

      setFormState((prev) => ({
        ...prev,
        attachments: [file],
      }));
    }
  };
  return (
    <BaseModal
      show={show}
      onHide={onHide}
      title={t('venueDetails')}
      showCloseButton
    >
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
          onChange={handleFileUpload}
          className={styles.inputField}
        />
        {imagePreviewUrl && (
          <div className={styles.previewVenueModal}>
            <img src={imagePreviewUrl} alt={t('venueImagePreview')} />
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
    </BaseModal>
  );
};

export default VenueModal;
