import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './AdvertisementRegister.module.css';
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
interface InterfaceAddOnRegisterProps {
  id?: string; // organizationId
  createdBy?: string; // User
  formStatus?: string;
  idEdit?: string;
  nameEdit?: string;
  typeEdit?: string;
  orgIdEdit?: string;
  advertisementMediaEdit?: string;
  endDateEdit?: Date;
  startDateEdit?: Date;
  setAfter: any;
}
interface InterfaceFormStateTypes {
  name: string;
  advertisementMedia: string;
  type: string;
  startDate: Date;
  endDate: Date;
  organizationId: string | undefined;
}

function advertisementRegister({
  formStatus,
  idEdit,
  nameEdit,
  typeEdit,
  advertisementMediaEdit,
  endDateEdit,
  startDateEdit,
  setAfter,
}: InterfaceAddOnRegisterProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });

  const { orgId: currentOrg } = useParams();

  const [show, setShow] = useState(false);
  const handleClose = (): void => setShow(false);
  const handleShow = (): void => setShow(true);
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
  //getting organizationId from URL

  const [formState, setFormState] = useState<InterfaceFormStateTypes>({
    name: '',
    advertisementMedia: '',
    type: 'BANNER',
    startDate: new Date(),
    endDate: new Date(),
    organizationId: currentOrg,
  });

  //if set to edit set the formState by edit variables
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

  const handleRegister = async (): Promise<void> => {
    try {
      console.log('At handle register', formState);
      if (formState.endDate < formState.startDate) {
        toast.error('End date must be greater than or equal to start date');
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
        toast.success('Advertisement created successfully');
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
        toast.error('An error occured, could not create new advertisement');
        console.log('error occured', error.message);
      }
    }
  };
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
        toast.error('End date must be greater than or equal to start date');
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
        toast.success('Advertisement updated successfully');
        handleClose();
        setAfter(null);
      }
    } catch (error: any) {
      toast.error(error.message);
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
          {t('addNew')}
        </Button>
      ) : (
        <div onClick={handleShow} data-testid="editBtn">
          {t('edit')}
        </div>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className={styles.editHeader}>
          {formStatus === 'register' ? (
            <Modal.Title> {t('RClose')}</Modal.Title>
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
                <div className={styles.preview} data-testid="mediaPreview">
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
                    className={styles.closeButton}
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
            data-testid="addonclose"
          >
            {t('close')}
          </Button>
          {formStatus === 'register' ? (
            <Button
              variant="primary"
              onClick={handleRegister}
              data-testid="addonregister"
            >
              {t('register')}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleUpdate}
              data-testid="addonupdate"
            >
              {t('saveChanges')}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

advertisementRegister.defaultProps = {
  name: '',
  advertisementMedia: '',
  type: 'BANNER',
  startDate: new Date(),
  endDate: new Date(),
  organizationId: '',
  formStatus: 'register',
};

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
