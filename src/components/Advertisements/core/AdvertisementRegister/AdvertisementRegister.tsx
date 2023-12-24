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

interface InterfaceAddOnRegisterProps {
  id?: string; // OrgId
  createdBy?: string; // User
  formStatus?: string;
  idEdit?: string;
  nameEdit?: string;
  typeEdit?: string;
  orgIdEdit?: string;
  linkEdit?: string;
  endDateEdit?: Date;
  startDateEdit?: Date;
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
  formStatus,
  idEdit,
  nameEdit,
  typeEdit,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  orgIdEdit,
  linkEdit,
  endDateEdit,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startDateEdit,
}: InterfaceAddOnRegisterProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });

  const [show, setShow] = useState(false);

  const handleClose = (): void => setShow(false);
  const handleShow = (): void => setShow(true);
  const [create] = useMutation(ADD_ADVERTISEMENT_MUTATION);
  const [updateAdvertisement] = useMutation(UPDATE_ADVERTISEMENT_MUTATION);
  const { refetch } = useQuery(ADVERTISEMENTS_GET);

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

  //if set to edit set the formState by edit variables
  useEffect(() => {
    if (formStatus === 'edit') {
      setFormState((prevState) => ({
        ...prevState,
        name: nameEdit || '',
        link: linkEdit || '',
        type: typeEdit || 'BANNER',
        startDate: startDateEdit || new Date(),
        endDate: endDateEdit || new Date(),
        orgId: currentOrg,
      }));
    }
  }, [
    formStatus,
    nameEdit,
    linkEdit,
    typeEdit,
    startDateEdit,
    endDateEdit,
    currentOrg,
  ]);

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
        },
      });

      if (data) {
        toast.success('Advertisement created successfully');
        refetch();
        setFormState({
          name: '',
          link: '',
          type: 'BANNER',
          startDate: new Date(),
          endDate: new Date(),
          orgId: currentOrg,
        });
        handleClose();
      }
    } catch (error) {
      toast.error('An error occured, could not create new advertisement');
      console.log('error occured', error);
    }
  };
  const handleUpdate = async (): Promise<void> => {
    try {
      console.log('At handle update', formState);
      const { data } = await updateAdvertisement({
        variables: {
          id: idEdit,
          // orgId: currentOrg,
          name: formState.name,
          link: formState.link,
          type: formState.type,
          startDate: dayjs(formState.startDate).format('YYYY-MM-DD'),
          endDate: dayjs(formState.endDate).format('YYYY-MM-DD'),
        },
      });

      if (data) {
        toast.success('Advertisement updated successfully');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <>
      {formStatus === 'register' ? ( //If register show register button else show edit button
        <Button
          className={styles.modalbtn}
          variant="primary"
          onClick={handleShow}
        >
          <i className="fa fa-plus"></i>
          {t('addNew')}
        </Button>
      ) : (
        <div onClick={handleShow}>{t('edit')}</div>
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
                  e: React.ChangeEvent<HTMLInputElement>
                ): Promise<void> => {
                  const target = e.target as HTMLInputElement;
                  const file = target.files && target.files[0];
                  if (file) {
                    const mediaBase64 = await convertToBase64(file);
                    setFormState({
                      ...formState,
                      link: mediaBase64,
                    });
                  }
                }}
              />
              {formState.link && (
                <div className={styles.preview} data-testid="mediaPreview">
                  {formState.link.includes('data:video') ? (
                    <video muted autoPlay={true} loop={true} playsInline>
                      <source src={formState.link} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={formState.link} />
                  )}

                  <button
                    className={styles.closeButton}
                    onClick={(): void => {
                      setFormState({
                        ...formState,
                        link: '',
                      });
                      const fileInput = document.getElementById(
                        'advertisementMedia'
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
                  console.log(e.target, e.target.value, typeof e.target.value);
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
  link: '',
  type: 'BANNER',
  startDate: new Date(),
  endDate: new Date(),
  orgId: '',
  formStatus: 'register',
};

advertisementRegister.propTypes = {
  name: PropTypes.string,
  link: PropTypes.string,
  type: PropTypes.string,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  orgId: PropTypes.string,
  formStatus: PropTypes.string,
};

export default advertisementRegister;
