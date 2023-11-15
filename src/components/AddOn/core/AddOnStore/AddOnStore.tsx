import React, { useState } from 'react';
import styles from './AddOnStore.module.css';
import AddOnEntry from '../AddOnEntry/AddOnEntry';
import Action from '../../support/components/Action/Action';
import { useQuery } from '@apollo/client';
import { PLUGIN_GET } from 'GraphQl/Queries/Queries'; // PLUGIN_LIST
import { Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import AddOnRegister from '../AddOnRegister/AddOnRegister';
import { useTranslation } from 'react-i18next';
import Loader from 'components/Loader/Loader';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import { toast } from 'react-toastify';

function addOnStore(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'addOnStore' });
  document.title = t('title');

  const [showAll, setShowDisabled] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isStore, setIsStore] = useState(true);
  const { data, loading, error } = useQuery(PLUGIN_GET);
  const currentOrgId = window.location.href.split('=')[1];
  const handleTabChange = (tab: any): void => {
    setIsStore(tab === 'available');
  };
  const filterChange = (ev: any): void => {
    setShowDisabled(ev.target.value === 'all');
  };

  if (loading) {
    return <Loader />;
  }
  if (error) toast.error('Error fetching plugins!');
  const allPlugins = data.getPlugins.filter((val: any) => {
    if (searchText === '') {
      return showAll || val.uninstalledOrgs.includes(currentOrgId);
    } else if (
      val.pluginName?.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return showAll || !val.uninstalledOrgs.includes(currentOrgId);
    }

    return false;
  });

  const installedPlugins = data.getPlugins
    .filter((plugin: any) => !plugin.uninstalledOrgs.includes(currentOrgId))
    .filter((val: any) => {
      if (searchText === '') {
        return val;
      } else if (
        val.pluginName?.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return val;
      }
    });

  return (
    <>
      <OrganizationScreen screenName="Plugin Store" title={t('title')}>
        <Row>
          <Col col={3}>
            <Action label={t('search')}>
              <Form.Control
                type="name"
                id="searchname"
                className={styles.actioninput}
                placeholder={t('searchName')}
                autoComplete="off"
                required
                onChange={(e): void => setSearchText(e.target.value)}
              />
            </Action>
            {isStore && (
              <Action label={t('filter')}>
                <Form>
                  <div key={`inline-radio`} className="mb-3">
                    <Form.Check
                      inline
                      label={t('all')}
                      name="radio-group"
                      type="radio"
                      value="all"
                      onChange={filterChange}
                      checked={showAll}
                      className={styles.actionradio}
                      id={`inline-radio-1`}
                    />
                    <Form.Check
                      inline
                      label={t('disable')}
                      name="radio-group"
                      type="radio"
                      value="disabled"
                      onChange={filterChange}
                      checked={!showAll}
                      className={styles.actionradio}
                      id={`inline-radio-2`}
                    />
                  </div>
                </Form>
              </Action>
            )}
          </Col>
          <Col col={8}>
            <div className={styles.justifysp}>
              <p className={styles.logintitle}>{t('pHeading')}</p>
              {searchText && (
                <p className="mb-2 text-muted author">
                  Search results for <b>{searchText}</b>
                </p>
              )}
              <AddOnRegister />
              <Tabs
                defaultActiveKey="available"
                id="uncontrolled-tab-example"
                className="mb-3"
                onSelect={handleTabChange}
              >
                <Tab eventKey="available" title={t('available')}>
                  {allPlugins.length === 0 ? (
                    <h4> {t('pMessage')}</h4>
                  ) : (
                    allPlugins.map(
                      (plug: any, i: React.Key | null | undefined) => (
                        <AddOnEntry
                          id={plug._id}
                          key={i}
                          title={plug.pluginName}
                          description={plug.pluginDesc}
                          createdBy={plug.pluginCreatedBy}
                          component={'Special Component'}
                          uninstalledOrgs={plug.uninstalledOrgs}
                        />
                      )
                    )
                  )}
                </Tab>
                <Tab eventKey="installed" title={t('install')}>
                  {installedPlugins.length === 0 ? (
                    <h4>{t('pMessage')} </h4>
                  ) : (
                    installedPlugins.map(
                      (plug: any, i: React.Key | null | undefined) => (
                        <AddOnEntry
                          id={plug._id}
                          key={i}
                          title={plug.pluginName}
                          description={plug.pluginDesc}
                          createdBy={plug.pluginCreatedBy}
                          component={'Special Component'}
                          uninstalledOrgs={plug.uninstalledOrgs}
                        />
                      )
                    )
                  )}
                </Tab>
              </Tabs>
            </div>
          </Col>
        </Row>
      </OrganizationScreen>
    </>
  );
}

addOnStore.defaultProps = {};

addOnStore.propTypes = {};

export default addOnStore;
