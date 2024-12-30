import React, { useState } from 'react';
import styles from './../../../../style/app.module.css';
import { Button, Card, Spinner } from 'react-bootstrap';
import { UPDATE_INSTALL_STATUS_PLUGIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Navigate, useParams } from 'react-router-dom';

/**
 * Props for the `addOnEntry` component.
 */
interface InterfaceAddOnEntryProps {
  id: string;
  enabled?: boolean; // Optional props
  title?: string; // Optional props
  description?: string; // Optional props
  createdBy: string;
  component?: string; // Optional props
  modified?: boolean; // Optional props
  uninstalledOrgs: string[];
  getInstalledPlugins: () => void;
}

/**
 * A React component that represents an add-on entry, displaying its details and allowing installation or uninstallation.
 *
 * @param props - The properties for the component.
 * @returns A JSX element containing the add-on entry.
 *
 * @example
 * ```tsx
 * <AddOnEntry
 *   id="1"
 *   enabled={true}
 *   title="Sample Add-On"
 *   description="This is a sample add-on."
 *   createdBy="Author Name"
 *   component="SampleComponent"
 *   modified={new Date()}
 *   uninstalledOrgs={['org1', 'org2']}
 *   getInstalledPlugins={() => {}}
 * />
 * ```
 */
function addOnEntry({
  id,
  title = 'No title provided', // Default parameter
  description = 'Description not available', // Default parameter
  createdBy,
  uninstalledOrgs,
  getInstalledPlugins,
  // enabled = false, // Default parameter
  // component = '', // Default parameter
  // modified = null, // Default parameter
}: InterfaceAddOnEntryProps): JSX.Element {
  // Translation hook with namespace 'addOnEntry'
  const { t } = useTranslation('translation', { keyPrefix: 'addOnEntry' });

  // Getting orgId from URL parameters
  const { orgId: currentOrg } = useParams();
  // console.log(currentOrg);
  if (!currentOrg) {
    // If orgId is not present in the URL, navigate to the org list page
    return <Navigate to={'/orglist'} />;
  }

  // State to manage button loading state
  const [buttonLoading, setButtonLoading] = useState(false);
  // State to manage local installation status of the add-on
  const [isInstalledLocal, setIsInstalledLocal] = useState(
    uninstalledOrgs.includes(currentOrg),
  );

  // Mutation hook for updating the install status of the plugin
  const [addOrgAsUninstalled] = useMutation(
    UPDATE_INSTALL_STATUS_PLUGIN_MUTATION,
  );

  /**
   * Function to toggle the installation status of the plugin.
   */
  const togglePluginInstall = async (): Promise<void> => {
    setButtonLoading(true);
    await addOrgAsUninstalled({
      variables: {
        id: id.toString(),
        orgId: currentOrg.toString(),
      },
    });

    // Toggle the local installation status
    setIsInstalledLocal(!isInstalledLocal);
    setButtonLoading(false);

    // Display a success message based on the new installation status
    const dialog: string = isInstalledLocal
      ? t('installMsg')
      : t('uninstallMsg');
    toast.success(dialog);
  };

  return (
    <>
      <Card
        data-testid="AddOnEntry"
        style={{ border: 'var(--primary-border-solid)', borderRadius: '10px' }}
      >
        <Card.Body>
          <Card.Title style={{ fontWeight: '800' }}>{title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted author">
            {createdBy}
          </Card.Subtitle>
          <Card.Text>{description}</Card.Text>
          <Button
            className={styles.entryaction}
            variant="primary"
            // disabled={buttonLoading || !configurable}
            disabled={buttonLoading}
            data-testid="AddOnEntry_btn_install"
            onClick={(): void => {
              togglePluginInstall();
              getInstalledPlugins();
            }}
          >
            {buttonLoading ? (
              <Spinner animation="grow" />
            ) : (
              <i
                className={!isInstalledLocal ? 'fa fa-trash' : 'fa fa-plus'}
              ></i>
            )}
            {/* {installed ? 'Remove' : configurable ? 'Installed' : 'Install'} */}
            {uninstalledOrgs.includes(currentOrg)
              ? t('install')
              : t('uninstall')}
          </Button>
        </Card.Body>
      </Card>
      <br />
    </>
  );
}

export default addOnEntry;
