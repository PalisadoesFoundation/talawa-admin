import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from '../../style/app.module.css';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  CREATE_VENUE_MUTATION,
  UPDATE_VENUE_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import convertToBase64 from 'utils/convertToBase64';
import type { InterfaceQueryVenueListItem } from 'utils/interfaces';

export interface InterfaceVenueModalProps {
  show: boolean;
  onHide: () => void;
  refetchVenues: () => void;
  orgId: string;
  venueData?: InterfaceQueryVenueListItem | null;
  edit: boolean;
}

/**
 * A modal component for creating or updating venue information.
 *
 * This component displays a modal window where users can enter details for a venue, such as name, description, capacity, and an image.
 * It also handles submitting the form data to create or update a venue based on whether the `edit` prop is true or false.
 *
 * @param show - A flag indicating if the modal should be visible.
 * @param onHide - A function to call when the modal should be closed.
 * @param refetchVenues - A function to refetch the list of venues after a successful operation.
 * @param orgId - The ID of the organization to which the venue belongs.
 * @param venueData - Optional venue data to prefill the form for editing. If null, the form will be empty.
 * @param edit - A flag indicating if the modal is in edit mode. If true, the component will update an existing venue; if false, it will create a new one.
 *
 * @returns The rendered modal component.
 */
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
  const [venueImage, setVenueImage] = useState<boolean>(false);
  const [formState, setFormState] = useState({
    name: venueData?.name || '',
    description: venueData?.description || '',
    capacity: venueData?.capacity || '',
    imageURL: venueData?.image || '',
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
  const handleSubmit = useCallback(async () => {
    if (formState.name.trim().length === 0) {
      toast.error(t('venueTitleError') as string);
      return;
    }

    const capacityNum = parseInt(formState.capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      toast.error(t('venueCapacityError') as string);
      return;
    }

    try {
      const { data } = await mutate({
        variables: {
          capacity: capacityNum,
          file: formState.imageURL,
          description: formState.description,
          name: formState.name,
          organizationId: orgId,
          ...(edit && { id: venueData?._id }),
        },
      });
      if (data) {
        toast.success(
          edit ? (t('venueUpdated') as string) : (t('venueAdded') as string),
        );
        refetchVenues();
        onHide();
        setFormState({
          name: '',
          description: '',
          capacity: '',
          imageURL: '',
        });
        setVenueImage(false);
      }
    } catch (error) {
      errorHandler(t, error);
    }
  }, [
    edit,
    formState,
    mutate,
    onHide,
    orgId,
    refetchVenues,
    t,
    venueData?._id,
  ]);

  /**
   * Clears the selected image and resets the image preview.
   *
   * This function also clears the file input field.
   */
  const clearImageInput = useCallback(() => {
    setFormState((prevState) => ({ ...prevState, imageURL: '' }));
    setVenueImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Update form state when venueData changes
  useEffect(() => {
    setFormState({
      name: venueData?.name || '',
      description: venueData?.description || '',
      capacity: venueData?.capacity || '',
      imageURL: venueData?.image || '',
    });
    setVenueImage(venueData?.image ? true : false);
  }, [venueData]);

  const { name, description, capacity, imageURL } = formState;

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
              setFormState({
                ...formState,
                name: e.target.value,
              });
            }}
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
              setFormState({
                ...formState,
                description: e.target.value,
              });
            }}
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
              setFormState({
                ...formState,
                capacity: e.target.value,
              });
            }}
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
            onChange={async (
              e: React.ChangeEvent<HTMLInputElement>,
            ): Promise<void> => {
              setFormState((prevPostFormState) => ({
                ...prevPostFormState,
                imageURL: '',
              }));
              setVenueImage(true);
              const file = e.target.files?.[0];
              if (file) {
                setFormState({
                  ...formState,
                  imageURL: await convertToBase64(file),
                });
              }
            }}
          />
          {venueImage && (
            <div className={styles.previewVenueModal}>
              <img src={imageURL} alt="Venue Image Preview" />
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
