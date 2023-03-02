import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AddOnRegister.module.css';
import { Button, Form, Modal } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_PLUGIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';

interface AddOnRegisterProps {
  id?: string; // OrgId
  createdBy?: string; // User
}
interface formStateTypes {
  pluginName: string;
  pluginCreatedBy: string;
  pluginDesc: string;
  pluginInstallStatus: boolean;
  installedOrgs: [string] | [];
}
const currentUrl = window.location.href.split('=')[1];

console.log(currentUrl);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AddOnRegister({ createdBy }: AddOnRegisterProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'addOnRegister' });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [create] = useMutation(ADD_PLUGIN_MUTATION);

  const [formState, setFormState] = useState<formStateTypes>({
    pluginName: '',
    pluginCreatedBy: '',
    pluginDesc: '',
    pluginInstallStatus: false,
    installedOrgs: [currentUrl],
  });

  const handleRegister = async () => {
    console.log(formState);
    const { data } = await create({
      variables: {
        $pluginName: formState.pluginName,
        $pluginCreatedBy: formState.pluginCreatedBy,
        $pluginDesc: formState.pluginDesc,
        $pluginInstallStatus: formState.pluginInstallStatus,
        $installedOrgs: formState.installedOrgs,
      },
    });

    if (data) {
      window.alert('Plugin Added Successfully');
      window.location.reload();
    }
    console.log('Data is ', data);
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
                autoComplete="off"
                required
                value={formState.pluginName}
                onChange={(e) => {
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
                autoComplete="off"
                required
                value={formState.pluginCreatedBy}
                onChange={(e) => {
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
                required
                value={formState.pluginDesc}
                onChange={(e) => {
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
            data-testid="addonregister"
          >
            {t('register')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

AddOnRegister.defaultProps = {
  createdBy: 'Admin',
};

AddOnRegister.propTypes = {
  createdBy: PropTypes.string,
};

export default AddOnRegister;
