import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AdvertisementEntry.module.css';
import { Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import { UPDATE_INSTALL_STATUS_PLUGIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface InterfaceAddOnEntryProps {
  id: string;
  name: string;
  link: string;
  type: string;
  orgId: string;
  startDate: Date;
  endDate: Date;
  //   getInstalledPlugins: () => any;
}
function advertisementEntry({
  id,
  name,
  type,
  orgId,
  link,
  endDate,
  startDate,
}: InterfaceAddOnEntryProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  //getting orgId from URL
  const currentOrg = window.location.href.split('/id=')[1] + '';
  const [buttonLoading, setButtonLoading] = useState(false);
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
    setButtonLoading(false);
  };
  const s = new Date(endDate);
  console.log(s > new Date());
  return (
    <>
      <Row xs={1} md={2} className="g-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Col key={idx}>
            <Card>
              <Card.Img
                variant="top"
                src={'https://avatars.githubusercontent.com/u/65951872?v=4'}
              />
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>Ends on {endDate}</Card.Text>
                <Card.Subtitle className="mb-2 text-muted author">
                  {type}
                </Card.Subtitle>
                <Card.Text>{link} </Card.Text>
                <Button
                  className={styles.entryaction}
                  variant="primary"
                  disabled={buttonLoading}
                  data-testid="AddOnEntry_btn_install"
                  onClick={(): void => {
                    togglePluginInstall();
                    //   getInstalledPlugins();
                  }}
                >
                  {buttonLoading ? (
                    <Spinner animation="grow" />
                  ) : (
                    <i className={'fa fa-trash'}></i>
                  )}
                  {t('delete')}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <br />
    </>
  );
}

advertisementEntry.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  orgId: PropTypes.string,
  link: PropTypes.string,
  endDate: PropTypes.instanceOf(Date),
  startDate: PropTypes.instanceOf(Date),
};

advertisementEntry.defaultProps = {
  name: '',
  type: '',
  orgId: '',
  link: '',
  endDate: new Date(),
  startDate: new Date(),
};
export default advertisementEntry;
