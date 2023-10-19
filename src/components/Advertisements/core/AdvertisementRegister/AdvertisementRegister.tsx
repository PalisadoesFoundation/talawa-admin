import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AdvertisementRegister.module.css';
import { Button, Form, Modal } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_ADVERTISEMENT_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface InterfaceAddOnRegisterProps {
  id?: string; // OrgId
  createdBy?: string; // User
}
interface InterfaceFormStateTypes {
  name: string;
  link: string;
  type: string;
  startDate: string;
  endDate: string;
  orgId: string;
}

const currentUrl = window.location.href.split('=')[1];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function advertisementRegister({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createdBy,
}: InterfaceAddOnRegisterProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });

  const [show, setShow] = useState(false);

  const handleClose = (): void => setShow(false);
  const handleShow = (): void => setShow(true);
  const [create] = useMutation(ADD_ADVERTISEMENT_MUTATION);

  //getting orgId from URL
  const currentOrg = window.location.href.split('/id=')[1] + '';
  const [formState, setFormState] = useState<InterfaceFormStateTypes>({
    name: '',
    link: '',
    type: 'BANNER',
    startDate: '',
    endDate: '',
    orgId: currentOrg,
  });
  const handleRegister = async (): Promise<void> => {
    try {
      console.log('At handle register', formState);
      const { data } = await create({
        variables: {
          orgId: currentOrg as string,
          name: formState.name as string,
          link: formState.link as string,
          type: formState.type as string,
          startDate: formState.startDate,
          endDate: formState.endDate,
        },
      });

      if (data) {
        toast.success('Advertisement created successfully');
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
                // value={formState.startDate}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    startDate: e.target.value.toString(),
                  });
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerForm.RDate">
              <Form.Label>{t('RendDate')}</Form.Label>
              <Form.Control
                type="date"
                required
                // value={new Date(formState.endDate)}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    endDate: e.target.value.toString(),
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
          <Button
            variant="primary"
            onClick={handleRegister}
            data-testid="addonregister"
          >
            {t('register')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

advertisementRegister.defaultProps = {
  name: '',
  link: '',
  type: 'BANNER',
  startDate: new Date().toString(),
  endDate: new Date().toString(),
  orgId: '',
};

advertisementRegister.propTypes = {
  name: PropTypes.string,
  link: PropTypes.string,
  type: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  orgId: PropTypes.string,
};

export default advertisementRegister;
