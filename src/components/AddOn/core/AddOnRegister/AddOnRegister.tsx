import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AddOnRegister.module.css';
import { Button, Form, Modal } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_PLUGIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

/**
 * Interface defining the form state for the `addOnRegister` component.
 */
interface InterfaceFormStateTypes {
  pluginName: string;
  pluginCreatedBy: string;
  pluginDesc: string;
  pluginInstallStatus: boolean;
  installedOrgs: [string] | [];
}

interface AddOnRegisterProps {
  createdBy?: string;
}

/**
 * A React component for registering a new add-on plugin.
 *
 * This component:
 * - Displays a button to open a modal for plugin registration.
 * - Contains a form in the modal for entering plugin details.
 * - Uses GraphQL mutation to register the plugin.
 * - Uses `react-i18next` for localization and `react-toastify` for notifications.
 * - Redirects to the organization list page if no `orgId` is found in the URL.
 *
 * @returns A JSX element containing the button and modal for plugin registration.
 */
function addOnRegister({
  createdBy = 'Admin',
}: AddOnRegisterProps): JSX.Element {
  // Translation hook for the 'addOnRegister' namespace
  const { t } = useTranslation('translation', { keyPrefix: 'addOnRegister' });
  // Translation hook for the 'common' namespace
  const { t: tCommon } = useTranslation('common');

  // Get the organization ID from the URL parameters
  const { orgId: currentUrl } = useParams();
  const navigate = useNavigate();

  // Redirect to the organization list if no organization ID is found
  if (!currentUrl) {
    return <Navigate to={'/orglist'} />;
  }

  // State to manage the visibility of the modal
  const [show, setShow] = useState(false);

  // Functions to show and hide the modal
  const handleClose = (): void => setShow(false);
  const handleShow = (): void => setShow(true);

  // GraphQL mutation hook for adding a plugin
  const [create] = useMutation(ADD_PLUGIN_MUTATION);

  // Initial form state
  const [formState, setFormState] = useState<InterfaceFormStateTypes>({
    pluginName: '',
    pluginCreatedBy: createdBy, // Using the default value here
    pluginDesc: '',
    pluginInstallStatus: false,
    installedOrgs: [currentUrl],
  });

  /**
   * Handles the registration of the plugin.
   * Sends the form data to the GraphQL mutation and displays a success message.
   */
  const handleRegister = async (): Promise<void> => {
    const { data } = await create({
      variables: {
        pluginName: formState.pluginName,
        pluginCreatedBy: formState.pluginCreatedBy,
        pluginDesc: formState.pluginDesc,
        pluginInstallStatus: formState.pluginInstallStatus,
        installedOrgs: formState.installedOrgs,
      },
    });

    if (data) {
      // Show a success message when the plugin is added
      toast.success(tCommon('addedSuccessfully', { item: 'Plugin' }) as string);
      // Refresh the page after 2 seconds
      setTimeout(() => {
        navigate(0);
      }, 2000);
    }
  };

  return (
    <>
      {/* Button to open the modal */}
      <Button
        className={styles.modalbtn}
        variant="primary"
        onClick={handleShow}
      >
        <i className="fa fa-plus"></i>
        {t('addNew')}
      </Button>

      {/* Modal for plugin registration */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> {t('addPlugin')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Form group for plugin name */}
            <Form.Group className="mb-3" controlId="registerForm.PluginName">
              <Form.Label>{t('pluginName')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('pName')}
                data-testid="pluginName"
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
                data-testid="pluginCreatedBy"
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
            {/* Form group for plugin description */}
            <Form.Group className="mb-3" controlId="registerForm.PluginURL">
              <Form.Label>{t('pluginDesc')}</Form.Label>
              <Form.Control
                // type="text"
                rows={3}
                as="textarea"
                placeholder={t('pDesc')}
                data-testid="pluginDesc"
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
          {/* Button to close the modal */}
          <Button
            variant="secondary"
            onClick={handleClose}
            data-testid="addonclose"
          >
            {tCommon('close')}
          </Button>
          {/* Button to register the plugin */}
          <Button
            variant="primary"
            onClick={handleRegister}
            data-testid="addonregisterBtn"
          >
            {tCommon('register')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Prop types validation for the component
addOnRegister.propTypes = {
  createdBy: PropTypes.string,
};

export default addOnRegister;
