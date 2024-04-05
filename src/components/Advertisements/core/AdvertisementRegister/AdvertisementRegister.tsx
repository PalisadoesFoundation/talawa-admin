<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './AdvertisementRegister.module.css';
import { Button, Form, Modal } from 'react-bootstrap';
import {
  ADD_ADVERTISEMENT_MUTATION,
  UPDATE_ADVERTISEMENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import convertToBase64 from 'utils/convertToBase64';
import { ADVERTISEMENTS_GET } from 'GraphQl/Queries/Queries';
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
=======
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AdvertisementRegister.module.css';
import { Button, Form, Modal } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_ADVERTISEMENT_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

interface InterfaceAddOnRegisterProps {
  id?: string; // OrgId
  createdBy?: string; // User
}
interface InterfaceFormStateTypes {
  name: string;
  link: string;
  type: string;
  startDate: Date;
  endDate: Date;
  orgId: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function advertisementRegister({
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  createdBy,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
}: InterfaceAddOnRegisterProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });

  const [show, setShow] = useState(false);
<<<<<<< HEAD
  const handleClose = (): void => setShow(false);
  const handleShow = (): void => setShow(true);
  const [create] = useMutation(ADD_ADVERTISEMENT_MUTATION);
  const [updateAdvertisement] = useMutation(UPDATE_ADVERTISEMENT_MUTATION);
  const { refetch } = useQuery(ADVERTISEMENTS_GET);

  //getting organizationId from URL
  const { orgId: currentOrg } = useParams();
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
=======

  const handleClose = (): void => setShow(false);
  const handleShow = (): void => setShow(true);
  const [create] = useMutation(ADD_ADVERTISEMENT_MUTATION);

  //getting orgId from URL
  const currentOrg = window.location.href.split('/id=')[1] + '';
  const [formState, setFormState] = useState<InterfaceFormStateTypes>({
    name: '',
    link: '',
    type: 'BANNER',
    startDate: new Date(),
    endDate: new Date(),
    orgId: currentOrg,
  });
  const handleRegister = async (): Promise<void> => {
    try {
      console.log('At handle register', formState);
      const { data } = await create({
        variables: {
          orgId: currentOrg,
          name: formState.name as string,
          link: formState.link as string,
          type: formState.type as string,
          startDate: dayjs(formState.startDate).format('YYYY-MM-DD'),
          endDate: dayjs(formState.endDate).format('YYYY-MM-DD'),
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        },
      });

      if (data) {
        toast.success('Advertisement created successfully');
<<<<<<< HEAD
        refetch();
        setFormState({
          name: '',
          advertisementMedia: '',
          type: 'BANNER',
          startDate: new Date(),
          endDate: new Date(),
          organizationId: currentOrg,
        });
        handleClose();
      }
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
        refetch();
        handleClose();
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
=======
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.log('error occured', error);
    }
  };
  return (
    <>
      <Button
        className={styles.modalbtn}
        variant="primary"
        onClick={handleShow}
      >
        <i className="fa fa-plus"></i>
        {t('addNew')}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> {t('RClose')}</Modal.Title>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======
            <Form.Group className="mb-3" controlId="registerForm.Rlink">
              <Form.Label>{t('Rlink')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('EXlink')}
                autoComplete="off"
                required
                value={formState.link}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    link: e.target.value,
                  });
                }}
              />
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
=======
                  console.log(e.target, e.target.value, typeof e.target.value);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
                value={formState.startDate.toISOString().slice(0, 10)}
=======
                // value={formState.startDate}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
                value={formState.endDate.toISOString().slice(0, 10)}
=======
                // value={new Date(formState.endDate)}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
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
=======
          <Button
            variant="primary"
            onClick={handleRegister}
            data-testid="addonregister"
          >
            {t('register')}
          </Button>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        </Modal.Footer>
      </Modal>
    </>
  );
}

advertisementRegister.defaultProps = {
  name: '',
<<<<<<< HEAD
  advertisementMedia: '',
  type: 'BANNER',
  startDate: new Date(),
  endDate: new Date(),
  organizationId: '',
  formStatus: 'register',
=======
  link: '',
  type: 'BANNER',
  startDate: new Date(),
  endDate: new Date(),
  orgId: '',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
};

advertisementRegister.propTypes = {
  name: PropTypes.string,
<<<<<<< HEAD
  advertisementMedia: PropTypes.string,
  type: PropTypes.string,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  organizationId: PropTypes.string,
  formStatus: PropTypes.string,
=======
  link: PropTypes.string,
  type: PropTypes.string,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  orgId: PropTypes.string,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
};

export default advertisementRegister;
