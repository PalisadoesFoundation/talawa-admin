import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AddOnRegister.module.css';
import { Button, Form, Modal } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_PLUGIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
<<<<<<< HEAD
import { Navigate, useNavigate, useParams } from 'react-router-dom';

=======

interface InterfaceAddOnRegisterProps {
  id?: string; // OrgId
  createdBy?: string; // User
}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
interface InterfaceFormStateTypes {
  pluginName: string;
  pluginCreatedBy: string;
  pluginDesc: string;
  pluginInstallStatus: boolean;
  installedOrgs: [string] | [];
}

<<<<<<< HEAD
function addOnRegister(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'addOnRegister' });

  const { orgId: currentUrl } = useParams();
  const navigate = useNavigate();
  if (!currentUrl) {
    return <Navigate to={'/orglist'} />;
  }

=======
const currentUrl = window.location.href.split('=')[1];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addOnRegister({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createdBy,
}: InterfaceAddOnRegisterProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'addOnRegister' });

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  const [show, setShow] = useState(false);

  const handleClose = (): void => setShow(false);
  const handleShow = (): void => setShow(true);
  const [create] = useMutation(ADD_PLUGIN_MUTATION);

  const [formState, setFormState] = useState<InterfaceFormStateTypes>({
    pluginName: '',
    pluginCreatedBy: '',
    pluginDesc: '',
    pluginInstallStatus: false,
    installedOrgs: [currentUrl],
  });

  const handleRegister = async (): Promise<void> => {
    const { data } = await create({
      variables: {
<<<<<<< HEAD
        pluginName: formState.pluginName,
        pluginCreatedBy: formState.pluginCreatedBy,
        pluginDesc: formState.pluginDesc,
        pluginInstallStatus: formState.pluginInstallStatus,
        installedOrgs: formState.installedOrgs,
=======
        $pluginName: formState.pluginName,
        $pluginCreatedBy: formState.pluginCreatedBy,
        $pluginDesc: formState.pluginDesc,
        $pluginInstallStatus: formState.pluginInstallStatus,
        $installedOrgs: formState.installedOrgs,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
    });

    if (data) {
      toast.success('Plugin Added Successfully');
      setTimeout(() => {
<<<<<<< HEAD
        navigate(0);
=======
        window.location.reload();
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      }, 2000);
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
          <Modal.Title> {t('addPlugin')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="registerForm.PluginName">
              <Form.Label>{t('pluginName')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('pName')}
<<<<<<< HEAD
                data-testid="pluginName"
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                autoComplete="off"
                required
                value={formState.pluginName}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    pluginName: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerForm.PluginName">
              <Form.Label>{t('creatorName')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('cName')}
<<<<<<< HEAD
                data-testid="pluginCreatedBy"
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                autoComplete="off"
                required
                value={formState.pluginCreatedBy}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    pluginCreatedBy: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerForm.PluginURL">
              <Form.Label>{t('pluginDesc')}</Form.Label>
              <Form.Control
                // type="text"
                rows={3}
                as="textarea"
                placeholder={t('pDesc')}
<<<<<<< HEAD
                data-testid="pluginDesc"
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                required
                value={formState.pluginDesc}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    pluginDesc: e.target.value,
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
<<<<<<< HEAD
            data-testid="addonregisterBtn"
=======
            data-testid="addonregister"
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          >
            {t('register')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

addOnRegister.defaultProps = {
  createdBy: 'Admin',
};

addOnRegister.propTypes = {
  createdBy: PropTypes.string,
};

export default addOnRegister;
