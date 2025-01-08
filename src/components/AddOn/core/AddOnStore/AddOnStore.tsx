import React, { useState } from 'react';
import styles from '../../../../style/app.module.css';
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
  const updateSelectedTab = (tab: string): void => {
    setIsStore(tab === 'available');
    /* istanbul ignore next */
    if (tab === 'available') {
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
  const filterChange = (ev: React.ChangeEvent<HTMLSelectElement>): void => {
    setShowEnabled(ev.target.value === 'enabled');
  };

  const filterPlugins = (
    plugins: InterfacePluginHelper[],
    searchTerm: string,
  ): InterfacePluginHelper[] => {
    if (!searchTerm) {
      return plugins;
    }

    return plugins.filter((plugin) =>
      plugin.pluginName?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
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
      <Row className={styles.containerAddOnStore}>
        <Col className={styles.colAddOnStore}>
          <div className={styles.inputAddOnStore}>
            <Form.Control
              type="name"
              id="searchname"
              className={styles.inputField}
              placeholder={t('searchName')}
              autoComplete="off"
              required
              onChange={(e): void => setSearchText(e.target.value)}
            />
            <Button className={styles.searchButton}>
              <Search />
            </Button>
          </div>
          {!isStore && (
            <Dropdown
              onSelect={
                /* istanbul ignore next */
                (e) =>
                  filterChange(
                    e as unknown as React.ChangeEvent<HTMLSelectElement>,
                  )
              }
            >
              <Dropdown.Toggle
                id="dropdown-filter"
                className={styles.dropdown}
                data-testid="filter-dropdown"
              >
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
            onSelect={(eventKey) => {
              if (eventKey) {
                updateSelectedTab(eventKey);
              }
            }}
          >
            <Tab
              eventKey="available"
              title={t('available')}
              style={{ backgroundColor: 'white' }}
            >
              <div className={styles.justifyspAddOnStore}>
                {(() => {
                  const filteredPlugins = filterPlugins(
                    data?.getPlugins || [],
                    searchText,
                  );

                  if (filteredPlugins.length === 0) {
                    return <h4>{t('pMessage')}</h4>;
                  }

                  return (
                    <div className={styles.justifyspAddOnStore}>
                      {filteredPlugins.map((plug, i) => (
                        <div className={styles.cardGridItem} key={i}>
                          <AddOnEntry
                            id={plug._id}
                            title={plug.pluginName}
                            description={plug.pluginDesc}
                            createdBy={plug.pluginCreatedBy}
                            component={'Special Component'}
                            modified={true}
                            getInstalledPlugins={getInstalledPlugins}
                            uninstalledOrgs={plug.uninstalledOrgs}
                          />
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </Tab>
            <Tab
              eventKey="installed"
              title={t('install')}
              data-testid="installed-tab"
            >
              <div className={styles.justifyspAddOnStore}>
                {(() => {
                  const installedPlugins = (data?.getPlugins || []).filter(
                    (plugin) => !plugin.uninstalledOrgs.includes(orgId ?? ''),
                  );
                  const filteredPlugins = filterPlugins(
                    installedPlugins,
                    searchText,
                  );

                  if (filteredPlugins.length === 0) {
                    return <h4>{t('pMessage')}</h4>;
                  }

                  return filteredPlugins.map((plug, i) => (
                    <div className={styles.cardGridItem} key={i}>
                      <AddOnEntry
                        id={plug._id}
                        title={plug.pluginName}
                        description={plug.pluginDesc}
                        createdBy={plug.pluginCreatedBy}
                        component={'Special Component'}
                        modified={true}
                        getInstalledPlugins={getInstalledPlugins}
                        uninstalledOrgs={plug.uninstalledOrgs}
                      />
                    </div>
                  ));
                })()}
              </div>
            </Tab>
          </Tabs>
        </div>
      </Row>
    </>
  );
}

export default addOnStore;
