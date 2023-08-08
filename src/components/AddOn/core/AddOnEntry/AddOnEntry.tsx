import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AddOnEntry.module.css';
import { Button, Card, Spinner } from 'react-bootstrap';
import { UPDATE_INSTALL_STATUS_PLUGIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface InterfaceAddOnEntryProps {
  id: string;
  enabled: boolean;
  title: string;
  description: string;
  createdBy: string;
  component: string;
  modified: any;
  uninstalledOrgs: string[];
  getInstalledPlugins: () => any;
}

function addOnEntry({
  id,
  title,
  description,
  createdBy,
  uninstalledOrgs,
  getInstalledPlugins,
}: InterfaceAddOnEntryProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'addOnEntry' });
  //getting orgId from URL
  const currentOrg = window.location.href.split('/id=')[1];
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isInstalledLocal, setIsInstalledLocal] = useState(
    uninstalledOrgs.includes(currentOrg)
  );
  // const [addOrgAsUninstalled] = useMutation(UPDATE_ORG_STATUS_PLUGIN_MUTATION);
  const [addOrgAsUninstalled] = useMutation(
    UPDATE_INSTALL_STATUS_PLUGIN_MUTATION
  );

  const togglePluginInstall = async (): Promise<void> => {
    setButtonLoading(true);
    await addOrgAsUninstalled({
      variables: {
        id: id.toString(),
        orgId: currentOrg.toString(),
      },
    });

    setIsInstalledLocal(!isInstalledLocal);
    setButtonLoading(false);
    const dialog: string = isInstalledLocal
      ? t('installMsg')
      : t('uninstallMsg');
    toast.success(dialog);
  };

  // useEffect(() => {
  //   // updateInstallStatusFunc();
  // }, []);
  // TODO: Install/Remove Effect
  // 1. Update Server to add to Org
  // 2. Validate Permissions
  // 3. Trigger Server Hook if Validated. (Stream to track progress)
  // const install = () => {
  //   setButtonLoading(true);
  //   fetch('http://localhost:3005/installed', {
  //     method: 'POST',
  //     headers: {
  //       'Content-type': 'application/json; charset=UTF-8',
  //     },
  //     body: JSON.stringify(
  //       Object.assign(
  //         {},
  //         { ...entry },
  //         {
  //           installedDatetime: new Date(),
  //           installedBy: 'Admin',
  //           enabled: true,
  //         }
  //       )
  //     ),
  //   })
  //     .then(() => {
  //       setButtonLoading(false);
  //       modified();
  //     })
  //     .finally(() => setButtonLoading(false));
  // };

  // const remove = () => {
  //   setButtonLoading(true);
  //   fetch(`http://localhost:3005/installed/${id}`, {
  //     method: 'DELETE',
  //   })
  //     .then(() => {
  //       setButtonLoading(false);
  //       modified();
  //     })
  //     .finally(() => setButtonLoading(false));
  // };

  // const toggleActive = () => {
  //   setSwitchState(true);
  //   fetch(`http://localhost:3005/installed/${id}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-type': 'application/json; charset=UTF-8',
  //     },
  //     body: JSON.stringify(
  //       Object.assign(
  //         {},
  //         { ...entry },
  //         {
  //           enabled: !enabled,
  //         }
  //       )
  //     ),
  //   })
  //     .then(() => {
  //       modified();
  //       setSwitchState(false);
  //     })
  //     .finally(() => setSwitchState(false));
  // };

  return (
    <>
      <Card data-testid="AddOnEntry">
        {/* {uninstalledOrgs.includes(currentOrg) && (
          <Form.Check
            type="switch"
            id="custom-switch"
            label={t('enable')}
            className={styles.entrytoggle}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onChange={(): void => {}}
            disabled={switchInProgress}
            checked={enabled}
          />
        )} */}
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted author">
            {createdBy}
          </Card.Subtitle>
          <Card.Text>{description}</Card.Text>
          <Button
            className={styles.entryaction}
            variant="primary"
            // disabled={buttonLoading || !configurable}
            disabled={buttonLoading}
            onClick={(): void => {
              togglePluginInstall();
              getInstalledPlugins();
            }}
          >
            {buttonLoading ? (
              <Spinner animation="grow" />
            ) : (
              <i
                className={!isInstalledLocal ? 'fa fa-trash' : 'fa fa-cubes'}
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

addOnEntry.defaultProps = {
  enabled: false,
  configurable: true,
  title: '',
  description: '',
  isInstalled: false,
};

addOnEntry.propTypes = {
  enabled: PropTypes.bool,
  configurable: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  isInstalled: PropTypes.bool,
};

export default addOnEntry;
