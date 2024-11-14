/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
// import PropTypes from 'react';
import styles from './AddOnStore.module.css';
import AddOnEntry from '../AddOnEntry/AddOnEntry';
import Action from '../../support/components/Action/Action';
import { useQuery } from '@apollo/client';
import { PLUGIN_GET } from 'GraphQl/Queries/Queries'; // GraphQL query for fetching plugins
import { Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import PluginHelper from 'components/AddOn/support/services/Plugin.helper';
import { store } from './../../../../state/store';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

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
  const [, setDataList] = useState([]);

  // type plugData = { pluginName: String, plug };
  const { data, loading } = useQuery(PLUGIN_GET);

  const { orgId } = useParams();

  /**
   * Fetches store plugins and updates the Redux store with the plugin data.
   */
  /* istanbul ignore next */
  const getStorePlugins = async (): Promise<void> => {
    let plugins = await new PluginHelper().fetchStore();
    const installIds = (await new PluginHelper().fetchInstalled()).map(
      (plugin: any) => plugin.id,
    );
    plugins = plugins.map((plugin: any) => {
      plugin.installed = installIds.includes(plugin.id);
      return plugin;
    });
    store.dispatch({ type: 'UPDATE_STORE', payload: plugins });
  };

  /**
   * Sets the list of installed plugins in the component's state.
   */
  /* istanbul ignore next */
  const getInstalledPlugins: () => any = () => {
    setDataList(data);
  };

  /**
   * Updates the currently selected tab and fetches the relevant plugin data.
   *
   * @param tab - The key of the selected tab (either 'available' or 'installed').
   */
  const updateSelectedTab = (tab: any): void => {
    setIsStore(tab === 'available');
    /* istanbul ignore next */
    isStore ? getStorePlugins() : getInstalledPlugins();
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
          {!isStore && (
            <Action label={t('filter')}>
              <Form>
                <div key={`inline-radio`} className="mb-3">
                  <Form.Check
                    inline
                    label={t('enable')}
                    name="radio-group"
                    type="radio"
                    value="enabled"
                    onChange={filterChange}
                    checked={showEnabled}
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
                    checked={!showEnabled}
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
            {searchText ? (
              <p className="mb-2 text-muted author">
                Search results for <b>{searchText}</b>
              </p>
            ) : null}

            <Tabs
              defaultActiveKey="available"
              id="uncontrolled-tab-example"
              className="mb-3"
              onSelect={updateSelectedTab}
            >
              <Tab eventKey="available" title={t('available')}>
                {data.getPlugins.filter(
                  (val: {
                    _id: string;
                    pluginName: string | undefined;
                    pluginDesc: string | undefined;
                    pluginCreatedBy: string;
                    pluginInstallStatus: boolean | undefined;
                    getInstalledPlugins: () => any;
                  }) => {
                    if (searchText == '') {
                      return val;
                    } else if (
                      val.pluginName
                        ?.toLowerCase()
                        .includes(searchText.toLowerCase())
                    ) {
                      return val;
                    }
                  },
                ).length === 0 ? (
                  <h4> {t('pMessage')}</h4>
                ) : (
                  data.getPlugins
                    .filter(
                      (val: {
                        _id: string;
                        pluginName: string | undefined;
                        pluginDesc: string | undefined;
                        pluginCreatedBy: string;
                        pluginInstallStatus: boolean | undefined;
                        getInstalledPlugins: () => any;
                      }) => {
                        if (searchText == '') {
                          return val;
                        } else if (
                          val.pluginName
                            ?.toLowerCase()
                            .includes(searchText.toLowerCase())
                        ) {
                          return val;
                        }
                      },
                    )
                    .map(
                      (
                        plug: {
                          _id: string;
                          pluginName: string | undefined;
                          pluginDesc: string | undefined;
                          pluginCreatedBy: string;
                          uninstalledOrgs: string[];
                          getInstalledPlugins: () => any;
                        },
                        i: React.Key | null | undefined,
                      ): JSX.Element => (
                        <AddOnEntry
                          id={plug._id}
                          key={i}
                          title={plug.pluginName}
                          description={plug.pluginDesc}
                          createdBy={plug.pluginCreatedBy}
                          // isInstalled={plug.pluginInstallStatus}
                          // configurable={plug.pluginInstallStatus}
                          component={'Special  Component'}
                          modified={true}
                          getInstalledPlugins={getInstalledPlugins}
                          uninstalledOrgs={plug.uninstalledOrgs}
                        />
                      ),
                    )
                )}
              </Tab>
              <Tab eventKey="installed" title={t('install')}>
                {data.getPlugins
                  .filter(
                    (plugin: any) => !plugin.uninstalledOrgs.includes(orgId),
                  )
                  .filter(
                    (val: {
                      _id: string;
                      pluginName: string | undefined;
                      pluginDesc: string | undefined;
                      pluginCreatedBy: string;
                      pluginInstallStatus: boolean | undefined;
                      getInstalledPlugins: () => any;
                    }) => {
                      if (searchText == '') {
                        return val;
                      } else if (
                        val.pluginName
                          ?.toLowerCase()
                          .includes(searchText.toLowerCase())
                      ) {
                        return val;
                      }
                    },
                  ).length === 0 ? (
                  <h4>{t('pMessage')} </h4>
                ) : (
                  data.getPlugins
                    .filter(
                      (plugin: any) => !plugin.uninstalledOrgs.includes(orgId),
                    )
                    .filter(
                      (val: {
                        _id: string;
                        pluginName: string | undefined;
                        pluginDesc: string | undefined;
                        pluginCreatedBy: string;
                        pluginInstallStatus: boolean | undefined;
                        getInstalledPlugins: () => any;
                      }) => {
                        if (searchText == '') {
                          return val;
                        } else if (
                          val.pluginName
                            ?.toLowerCase()
                            .includes(searchText.toLowerCase())
                        ) {
                          return val;
                        }
                      },
                    )
                    .map(
                      (
                        plug: {
                          _id: string;
                          pluginName: string | undefined;
                          pluginDesc: string | undefined;
                          pluginCreatedBy: string;
                          uninstalledOrgs: string[];
                          pluginInstallStatus: boolean | undefined;
                          getInstalledPlugins: () => any;
                        },
                        i: React.Key | null | undefined,
                      ): JSX.Element => (
                        <AddOnEntry
                          id={plug._id}
                          key={i}
                          title={plug.pluginName}
                          description={plug.pluginDesc}
                          createdBy={plug.pluginCreatedBy}
                          // isInstalled={plug.pluginInstallStatus}
                          // configurable={plug.pluginInstallStatus}
                          component={'Special  Component'}
                          modified={true}
                          getInstalledPlugins={getInstalledPlugins}
                          uninstalledOrgs={plug.uninstalledOrgs}
                        />
                      ),
                    )
                )}
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default addOnStore;
