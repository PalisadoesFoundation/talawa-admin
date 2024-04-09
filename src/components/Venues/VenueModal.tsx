import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import styles from './VenueModal.module.css';
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

const VenueModal = ({
  show,
  onHide,
  refetchVenues,
  orgId,
  edit,
  venueData,
}: InterfaceVenueModalProps): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationVenues',
  });

  const [venueImage, setVenueImage] = useState<boolean>(false);
  const [formState, setFormState] = useState({
    name: venueData?.name || '',
    description: venueData?.description || '',
    capacity: venueData?.capacity || '',
    imageURL: venueData?.image || '',
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mutate, { loading }] = useMutation(
    edit ? UPDATE_VENUE_MUTATION : CREATE_VENUE_MUTATION,
  );

  const handleSubmit = useCallback(async () => {
    if (formState.name.trim().length === 0) {
      toast.error(t('venueTitleError'));
      return;
    }

    const capacityNum = parseInt(formState.capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      toast.error(t('venueCapacityError'));
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
      /* istanbul ignore next */
      if (data) {
        toast.success(edit ? t('venueUpdated') : t('venueAdded'));
        refetchVenues();
        onHide();
      }
    } catch (error) {
      /* istanbul ignore next */
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

  const clearImageInput = useCallback(() => {
    setFormState((prevState) => ({ ...prevState, imageURL: '' }));
    setVenueImage(false);
    /* istanbul ignore next */
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

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
          className="p-3 d-flex justify-content-center align-items-center"
          style={{ width: '40px', height: '40px' }}
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
          <label htmlFor="venuedescrip">{t('description')}</label>
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
              /* istanbul ignore next */
              if (file) {
                setFormState({
                  ...formState,
                  imageURL: await convertToBase64(file),
                });
              }
            }}
          />
          {venueImage && (
            <div className={styles.preview}>
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
            className={styles.greenregbtn}
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
