/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import styles from './AddOnStore.module.css';
import AddOnEntry from '../AddOnEntry/AddOnEntry';
import { useQuery } from '@apollo/client';
import { PLUGIN_GET } from 'GraphQl/Queries/Queries'; // PLUGIN_LIST
import { Col, Dropdown, Form, Row, Tab, Tabs, Button } from 'react-bootstrap';
import PluginHelper from 'components/AddOn/support/services/Plugin.helper';
import { store } from './../../../../state/store';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Search } from '@mui/icons-material';

interface InterfacePluginHelper {
  _id: string;
  pluginName?: string;
  pluginDesc?: string;
  pluginCreatedBy: string;
  pluginInstallStatus?: boolean;
  uninstalledOrgs: string[];
  installed: boolean;
  enabled: boolean;
  name: string;
  component: string;
}

/**
 * Component for managing and displaying plugins in the store.
 *
 * This component:
 * - Displays a search input and filter options.
 * - Uses tabs to switch between available and installed plugins.
 * - Fetches plugins from a GraphQL endpoint and filters them based on search criteria.
 * - Utilizes Redux store to manage plugin data.
 *
 * @returns A JSX element containing the UI for the add-on store.
 */
function addOnStore(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'addOnStore' });
  document.title = t('title');

  const [isStore, setIsStore] = useState(true);
  const [showEnabled, setShowEnabled] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [, setDataList] = useState<InterfacePluginHelper[]>([]);

  const { data, loading } = useQuery<{ getPlugins: InterfacePluginHelper[] }>(
    PLUGIN_GET,
  );

  const { orgId } = useParams<{ orgId: string }>();

  /**
   * Fetches store plugins and updates the Redux store with the plugin data.
   */
  /* istanbul ignore next */
  const getStorePlugins = async (): Promise<void> => {
    let plugins = await new PluginHelper().fetchStore();
    const installIds = (await new PluginHelper().fetchInstalled()).map(
      (plugin: InterfacePluginHelper) => plugin._id,
    );
    plugins = plugins.map((plugin: InterfacePluginHelper) => {
      plugin.installed = installIds.includes(plugin._id);
      return plugin;
    });
    store.dispatch({ type: 'UPDATE_STORE', payload: plugins });
  };

  /**
   * Sets the list of installed plugins in the component's state.
   */
  /* istanbul ignore next */
  const getInstalledPlugins: () => void = () => {
    setDataList(data?.getPlugins ?? []);
  };

  /**
   * Updates the currently selected tab and fetches the relevant plugin data.
   *
   * @param tab - The key of the selected tab (either 'available' or 'installed').
   */
  const updateSelectedTab = (tab: any): void => {
    setIsStore(tab === 'available');
    /* istanbul ignore next */
    if (isStore) {
      getStorePlugins();
    } else {
      getInstalledPlugins();
    }
  };

  /**
   * Handles changes in the filter options.
   *
   * @param ev - The event object from the filter change.
   */
  const filterChange = (ev: any): void => {
    setShowEnabled(ev.target.value === 'enabled');
  };

  // Show a loader while the data is being fetched
  /* istanbul ignore next */
  if (loading) {
    return (
      <>
        <div data-testid="AddOnEntryStore" className={styles.loader}></div>
      </>
    );
  }

  return (
    <>
      <Row
        className=""
        style={{
          backgroundColor: 'white',
          margin: '2px',
          padding: '10px',
          borderRadius: '20px',
        }}
      >
        <Col
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div className={styles.input}>
            <Form.Control
              type="name"
              id="searchname"
              className={styles.actioninput}
              placeholder={t('searchName')}
              autoComplete="off"
              required
              onChange={(e): void => setSearchText(e.target.value)}
            />
            <Button
              className={`position-absolute z-10 bottom-0 end-0 d-flex justify-content-center align-items-center `}
              style={{ marginBottom: '10px' }}
            >
              <Search />
            </Button>
          </div>
          {!isStore && (
            <Dropdown onSelect={(e) => filterChange(e ? e : '')}>
              <Dropdown.Toggle id="dropdown-filter" className={styles.dropdown}>
                {showEnabled ? t('enable') : t('disable')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="enabled" active={showEnabled}>
                  {t('enable')}
                </Dropdown.Item>
                <Dropdown.Item eventKey="disabled" active={!showEnabled}>
                  {t('disable')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Col>
        <div>
          <Tabs
            defaultActiveKey="available"
            id="uncontrolled-tab-example"
            className="mb-3 mt-3"
            onSelect={updateSelectedTab}
          >
            <Tab
              eventKey="available"
              title={t('available')}
              style={{ backgroundColor: 'white' }}
            >
              <div className={styles.justifysp}>
                {data?.getPlugins.filter((val: InterfacePluginHelper) => {
                  if (searchText == '') {
                    return val;
                  } else if (
                    val.pluginName
                      ?.toLowerCase()
                      .includes(searchText.toLowerCase())
                  ) {
                    return val;
                  }
                }).length === 0 ? (
                  <h4> {t('pMessage')}</h4>
                ) : (
                  <div className={styles.justifysp}>
                    {data?.getPlugins
                      .filter((val: InterfacePluginHelper) => {
                        if (searchText == '') {
                          return val;
                        } else if (
                          val.pluginName
                            ?.toLowerCase()
                            .includes(searchText.toLowerCase())
                        ) {
                          return val;
                        }
                      })
                      .map(
                        (
                          plug: InterfacePluginHelper,
                          i: React.Key | null | undefined,
                        ): JSX.Element => (
                          <div className={styles.cardGridItem} key={i}>
                            <AddOnEntry
                              id={plug._id}
                              title={plug.pluginName}
                              description={plug.pluginDesc}
                              createdBy={plug.pluginCreatedBy}
                              component={'Special  Component'}
                              modified={true}
                              getInstalledPlugins={getInstalledPlugins}
                              uninstalledOrgs={plug.uninstalledOrgs}
                            />
                          </div>
                        ),
                      )}
                  </div>
                )}
              </div>
            </Tab>
            <Tab eventKey="installed" title={t('install')}>
              <div className={styles.justifysp}>
                {data?.getPlugins
                  .filter(
                    (plugin: InterfacePluginHelper) =>
                      !plugin.uninstalledOrgs.includes(orgId ?? ''),
                  )
                  .filter((val: InterfacePluginHelper) => {
                    if (searchText === '') {
                      return val;
                    } else if (
                      val.pluginName
                        ?.toLowerCase()
                        .includes(searchText.toLowerCase())
                    ) {
                      return val;
                    }
                  }).length === 0 ? (
                  <h4>{t('pMessage')} </h4>
                ) : (
                  data?.getPlugins
                    .filter(
                      (plugin: InterfacePluginHelper) =>
                        !plugin.uninstalledOrgs.includes(orgId ?? ''),
                    )
                    .filter((val: InterfacePluginHelper) => {
                      if (searchText == '') {
                        return val;
                      } else if (
                        val.pluginName
                          ?.toLowerCase()
                          .includes(searchText.toLowerCase())
                      ) {
                        return val;
                      }
                    })
                    .map(
                      (
                        plug: InterfacePluginHelper,
                        i: React.Key | null | undefined,
                      ): JSX.Element => (
                        <div className={styles.cardGridItem} key={i}>
                          <AddOnEntry
                            id={plug._id}
                            title={plug.pluginName}
                            description={plug.pluginDesc}
                            createdBy={plug.pluginCreatedBy}
                            component={'Special  Component'}
                            modified={true}
                            getInstalledPlugins={getInstalledPlugins}
                            uninstalledOrgs={plug.uninstalledOrgs}
                          />
                        </div>
                      ),
                    )
                )}
              </div>
            </Tab>
          </Tabs>
        </div>
      </Row>
    </>
  );
}

export default addOnStore;
