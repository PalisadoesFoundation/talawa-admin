import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../../../../style/app.module.css';
import { Button, Form, Modal } from 'react-bootstrap';
import {
  ADD_ADVERTISEMENT_MUTATION,
  UPDATE_ADVERTISEMENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import convertToBase64 from 'utils/convertToBase64';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import { useParams } from 'react-router-dom';

/**
 * Props for the `advertisementRegister` component.
 */
interface InterfaceAddOnRegisterProps {
  id?: string; // Optional organization ID
  createdBy?: string; // Optional user who created the advertisement
  formStatus?: string; // Determines if the form is in register or edit mode
  idEdit?: string; // ID of the advertisement to edit
  nameEdit?: string; // Name of the advertisement to edit
  typeEdit?: string; // Type of the advertisement to edit
  orgIdEdit?: string; // Organization ID associated with the advertisement
  advertisementMediaEdit?: string; // Media URL of the advertisement to edit
  endDateEdit?: Date; // End date of the advertisement to edit
  startDateEdit?: Date; // Start date of the advertisement to edit
  setAfter: React.Dispatch<React.SetStateAction<string | null | undefined>>; // Function to update parent state
}

/**
 * State for the advertisement form.
 */
interface InterfaceFormStateTypes {
  name: string; // Name of the advertisement
  advertisementMedia: string; // Base64-encoded media of the advertisement
  type: string; // Type of advertisement (e.g., BANNER, POPUP)
  startDate: Date; // Start date of the advertisement
  endDate: Date; // End date of the advertisement
  organizationId: string | undefined; // Organization ID
}

/**
 * Component for registering or editing an advertisement.
 *
 * @param props - Contains form status, advertisement details, and a function to update parent state.
 * @returns A JSX element that renders a form inside a modal for creating or editing an advertisement.
 *
 * @example
 * ```tsx
 * <AdvertisementRegister
 *   formStatus="register"
 *   setAfter={(value) => console.log(value)}
 * />
 * ```
 */
function advertisementRegister({
  formStatus = 'register',
  idEdit,
  nameEdit = '',
  typeEdit = 'BANNER',
  advertisementMediaEdit = '',
  endDateEdit = new Date(),
  startDateEdit = new Date(),
  setAfter,
}: InterfaceAddOnRegisterProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  const { orgId: currentOrg } = useParams();

  const [show, setShow] = useState(false);
  const handleClose = (): void => setShow(false); // Closes the modal
  const handleShow = (): void => setShow(true); // Shows the modal

  const [create] = useMutation(ADD_ADVERTISEMENT_MUTATION, {
    refetchQueries: [
      {
        query: ORGANIZATION_ADVERTISEMENT_LIST,
        variables: { first: 6, after: null, id: currentOrg },
      },
    ],
  });

  const [updateAdvertisement] = useMutation(UPDATE_ADVERTISEMENT_MUTATION, {
    refetchQueries: [
      {
        query: ORGANIZATION_ADVERTISEMENT_LIST,
        variables: { first: 6, after: null, id: currentOrg },
      },
    ],
  });

  // Initialize form state
  const [formState, setFormState] = useState<InterfaceFormStateTypes>({
    name: '',
    advertisementMedia: '',
    type: 'BANNER',
    startDate: new Date(),
    endDate: new Date(),
    organizationId: currentOrg,
  });

  // Set form state if editing
  useEffect(() => {
    if (formStatus === 'edit') {
      setFormState((prevState) => ({
        ...prevState,
        name: nameEdit || '',
        advertisementMedia: advertisementMediaEdit || '',
        type: typeEdit || 'BANNER',
        startDate: startDateEdit || new Date(),
        endDate: endDateEdit || new Date(),
        orgId: currentOrg,
      }));
    }
  }, [
    formStatus,
    nameEdit,
    advertisementMediaEdit,
    typeEdit,
    startDateEdit,
    endDateEdit,
    currentOrg,
  ]);
  /**
   * Handles advertisement registration.
   * Validates the date range and performs the mutation to create an advertisement.
   */
  const handleRegister = async (): Promise<void> => {
    try {
      console.log('At handle register', formState);
      if (formState.endDate < formState.startDate) {
        toast.error(t('endDateGreaterOrEqual') as string);
        return;
      }
      const { data } = await create({
        variables: {
          organizationId: currentOrg,
          name: formState.name as string,
          type: formState.type as string,
          startDate: dayjs(formState.startDate).format('YYYY-MM-DD'),
          endDate: dayjs(formState.endDate).format('YYYY-MM-DD'),
          file: formState.advertisementMedia as string,
        },
      });

      if (data) {
        toast.success(t('advertisementCreated') as string);
        setFormState({
          name: '',
          advertisementMedia: '',
          type: 'BANNER',
          startDate: new Date(),
          endDate: new Date(),
          organizationId: currentOrg,
        });
      }
      setAfter(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          tErrors('errorOccurredCouldntCreate', {
            entity: 'advertisement',
          }) as string,
        );
        console.log('error occured', error.message);
      }
    }
  };

  /**
   * Handles advertisement update.
   * Validates the date range and performs the mutation to update the advertisement.
   */
  const handleUpdate = async (): Promise<void> => {
    try {
      const updatedFields: Partial<InterfaceFormStateTypes> = {};

      // Only include the fields which are updated
      if (formState.name !== nameEdit) {
        updatedFields.name = formState.name;
      }
      if (formState.advertisementMedia !== advertisementMediaEdit) {
        updatedFields.advertisementMedia = formState.advertisementMedia;
      }
      if (formState.type !== typeEdit) {
        updatedFields.type = formState.type;
      }
      if (formState.endDate < formState.startDate) {
        toast.error(t('endDateGreaterOrEqual') as string);
        return;
      }
      const startDateFormattedString = dayjs(formState.startDate).format(
        'YYYY-MM-DD',
      );
      const endDateFormattedString = dayjs(formState.endDate).format(
        'YYYY-MM-DD',
      );

      const startDateDate = dayjs(
        startDateFormattedString,
        'YYYY-MM-DD',
      ).toDate();
      const endDateDate = dayjs(endDateFormattedString, 'YYYY-MM-DD').toDate();

      if (!dayjs(startDateDate).isSame(startDateEdit, 'day')) {
        updatedFields.startDate = startDateDate;
      }
      if (!dayjs(endDateDate).isSame(endDateEdit, 'day')) {
        updatedFields.endDate = endDateDate;
      }

      console.log('At handle update', updatedFields);
      const { data } = await updateAdvertisement({
        variables: {
          id: idEdit,
          ...(updatedFields.name && { name: updatedFields.name }),
          ...(updatedFields.advertisementMedia && {
            file: updatedFields.advertisementMedia,
          }),
          ...(updatedFields.type && { type: updatedFields.type }),
          ...(updatedFields.startDate && {
            startDate: startDateFormattedString,
          }),
          ...(updatedFields.endDate && { endDate: endDateFormattedString }),
        },
      });

      if (data) {
        toast.success(
          tCommon('updatedSuccessfully', { item: 'Advertisement' }) as string,
        );
        handleClose();
        setAfter(null);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  return (
    //If register show register button else show edit button
    <>
      {formStatus === 'register' ? (
        <Button
          className={styles.modalbtn}
          variant="primary"
          onClick={handleShow}
          data-testid="createAdvertisement"
        >
          <i className="fa fa-plus"></i>
          {t('createAdvertisement')}
        </Button>
      ) : (
        <div onClick={handleShow} data-testid="editBtn">
          {tCommon('edit')}
        </div>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {formStatus === 'register' ? (
            <Modal.Title> {t('addNew')}</Modal.Title>
          ) : (
            <Modal.Title>{t('editAdvertisement')}</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="registerForm.Rname">
              <Form.Label>{t('Rname')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('EXname')}
                autoComplete="off"
                required
                value={formState.name}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    name: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="advertisementMedia">
                {t('Rmedia')}
              </Form.Label>
              <Form.Control
                accept="image/*, video/*"
                data-testid="advertisementMedia"
                name="advertisementMedia"
                type="file"
                id="advertisementMedia"
                multiple={false}
                onChange={async (
                  e: React.ChangeEvent<HTMLInputElement>,
                ): Promise<void> => {
                  const target = e.target as HTMLInputElement;
                  const file = target.files && target.files[0];
                  if (file) {
                    const mediaBase64 = await convertToBase64(file);
                    setFormState({
                      ...formState,
                      advertisementMedia: mediaBase64,
                    });
                  }
                }}
              />
              {formState.advertisementMedia && (
                <div
                  className={styles.previewAdvertisementRegister}
                  data-testid="mediaPreview"
                >
                  {formState.advertisementMedia.includes('video') ? (
                    <video
                      muted
                      autoPlay={true}
                      loop={true}
                      playsInline
                      crossOrigin="anonymous"
                    >
                      <source
                        src={formState.advertisementMedia}
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    <img src={formState.advertisementMedia} />
                  )}
                  <button
                    className={styles.closeButtonAdvertisementRegister}
                    onClick={(e): void => {
                      e.preventDefault();
                      setFormState({
                        ...formState,
                        advertisementMedia: '',
                      });
                      const fileInput = document.getElementById(
                        'advertisementMedia',
                      ) as HTMLInputElement;
                      if (fileInput) {
                        fileInput.value = '';
                      }
                    }}
                    data-testid="closePreview"
                  >
                    <i className="fa fa-times"></i>
                  </button>
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerForm.Rtype">
              <Form.Label>{t('Rtype')}</Form.Label>
              <Form.Select
                aria-label={t('Rtype')}
                value={formState.type}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    type: e.target.value,
                  });
                }}
              >
                <option value="POPUP">Popup Ad</option>
                <option value="BANNER">Banner Ad </option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerForm.RstartDate">
              <Form.Label>{t('RstartDate')}</Form.Label>
              <Form.Control
                type="date"
                required
                value={formState.startDate.toISOString().slice(0, 10)}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    startDate: new Date(e.target.value),
                  });
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerForm.RDate">
              <Form.Label>{t('RendDate')}</Form.Label>
              <Form.Control
                type="date"
                required
                value={formState.endDate.toISOString().slice(0, 10)}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    endDate: new Date(e.target.value),
                  });
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            className={styles.closeButtonAdvertisementRegister}
            data-testid="addonclose"
          >
            {tCommon('close')}
          </Button>
          {formStatus === 'register' ? (
            <Button
              variant="primary"
              onClick={handleRegister}
              data-testid="addonregister"
              className={styles.addButton}
            >
              {tCommon('register')}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleUpdate}
              data-testid="addonupdate"
            >
              {tCommon('saveChanges')}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

advertisementRegister.propTypes = {
  name: PropTypes.string,
  advertisementMedia: PropTypes.string,
  type: PropTypes.string,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  organizationId: PropTypes.string,
  formStatus: PropTypes.string,
};

export default advertisementRegister;
