import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  CREATE_VENUE_MUTATION,
  UPDATE_VENUE_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceQueryVenueListItem } from 'utils/interfaces';
import { urlToFile } from 'utils/urlToFile';
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
  const { t: tCommon } = useTranslation('common');

  const [venueImagePreview, setVenueImagePreview] = useState<string | null>(
    null,
  );
  const [venueFile, setVenueFile] = useState<File | null>(null);
  const [formState, setFormState] = useState({
    name: venueData?.name || '',
    description: venueData?.description || '',
    capacity: venueData?.capacity || '',
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mutate, { loading }] = useMutation(
    edit ? UPDATE_VENUE_MUTATION : CREATE_VENUE_MUTATION,
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (formState.name.trim().length === 0) {
        toast.error(t('venueTitleError') as string);
        return;
      }

      const capacityNum = Number(formState.capacity);
      if (Number.isNaN(capacityNum) || capacityNum <= 0) {
        toast.error(t('venueCapacityError') as string);
        return;
      }

      try {
        const variables: Record<string, unknown> = {
          id: venueData?.id,
          name: formState.name.trim(),
          capacity: capacityNum,
          organizationId: orgId,
        };
        const description = formState.description?.trim();
        if (description) {
          variables.description = description;
        }
        if (venueFile) {
          variables.attachments = [venueFile];
        }
        // console.log(
        //   edit ? 'Updating venue with:' : 'Creating venue with:',
        //   variables,
        // );

        const result = await mutate({ variables });
        if (result?.data?.createVenue || result?.data?.updateVenue) {
          toast.success(edit ? t('venueUpdated') : t('venueAdded'));
          setFormState({
            name: '',
            description: '',
            capacity: '',
          });
          setVenueFile(null);
          setVenueImagePreview(null);
          refetchVenues();
          onHide();
        }
      } catch (error) {
        console.error('🛑 Mutation Error:', JSON.stringify(error, null, 2));
        if (error instanceof Error && error.message.includes('alreadyExists')) {
          toast.error(
            t('venueNameExists') || 'A venue with this name already exists',
          );
        } else {
          errorHandler(t, error);
        }
      }
    },
    [formState, venueFile, mutate, onHide, refetchVenues, edit, orgId],
  );

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVenueFile(file);
    setVenueImagePreview(URL.createObjectURL(file));
  };

  const clearImageInput = (): void => {
    setVenueFile(null);
    setVenueImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  useEffect(() => {
    setFormState({
      name: venueData?.name || '',
      description: venueData?.description || '',
      capacity: venueData?.capacity || '',
    });
    if (venueData?.attachments?.[0]) {
      const file = venueData.attachments[0];
      urlToFile(file.url).then((fileCreated) => {
        setVenueFile(fileCreated);
        setVenueImagePreview(file.url);
      });
    } else {
      setVenueImagePreview(null);
    }
  }, [venueData]);
  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header className="d-flex align-items-start">
          <p>{t('venueDetails')}</p>
          <Button
            variant="danger"
            onClick={onHide}
            data-testid="createVenueModalCloseBtn"
          >
            <i className="fa fa-times" />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} data-testid="venueForm">
            <label htmlFor="venuetitle">{t('venueName')}</label>
            <Form.Control
              type="text"
              id="venuetitle"
              placeholder={t('enterVenueName')}
              value={formState.name}
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
            />
            <label htmlFor="venuedescrip">{tCommon('description')}</label>
            <Form.Control
              as="textarea"
              id="venuedescrip"
              placeholder={t('enterVenueDesc')}
              maxLength={500}
              value={formState.description}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
            />
            <label htmlFor="venuecapacity">{t('capacity')}</label>
            <Form.Control
              type="text"
              id="venuecapacity"
              placeholder={t('enterVenueCapacity')}
              value={formState.capacity}
              onChange={(e) =>
                setFormState({ ...formState, capacity: e.target.value })
              }
            />
            <Form.Label htmlFor="venueImg">{t('image')}</Form.Label>
            <Form.Control
              accept="image/*"
              id="venueImgUrl"
              name="venueImg"
              type="file"
              data-testid="venueImgUrl"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {venueImagePreview && (
              <div>
                <img
                  src={venueImagePreview}
                  alt="Venue Image Preview"
                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                  // temporary bypass of CORS error
                  crossOrigin="anonymous"
                />
                <button
                  type="button"
                  onClick={clearImageInput}
                  data-testid="closeimage"
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              data-testid="createEditVenueBtn"
            >
              {edit ? t('editVenue') : t('createVenue')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VenueModal;
