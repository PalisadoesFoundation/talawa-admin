/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'react';
import styles from './AddOnStore.module.css';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import AddOnEntry from '../AddOnEntry/AddOnEntry';
import Action from '../../support/components/Action/Action';
import SidePanel from 'components/AddOn/support/components/SidePanel/SidePanel';
import MainContent from 'components/AddOn/support/components/MainContent/MainContent';
import { useQuery } from '@apollo/client';
import {
  ADMIN_LIST,
  MEMBERS_LIST,
  PLUGIN_GET,
  USER_LIST,
} from 'GraphQl/Queries/Queries'; // PLUGIN_LIST
import { useSelector } from 'react-redux';
import { RootState } from '../../../../state/reducers';
import { Form, Tab, Tabs } from 'react-bootstrap';
import AddOnRegister from '../AddOnRegister/AddOnRegister';
import PluginHelper from 'components/AddOn/support/services/Plugin.helper';
import { store } from './../../../../state/store';
import { useTranslation } from 'react-i18next';

function AddOnStore(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'addOnStore' });

  const [isStore, setIsStore] = useState(true);
  const [showEnabled, setShowEnabled] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [dataList, setDataList] = useState([]);

  const [render, setRender] = useState(true);
  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const plugins = useSelector((state: RootState) => state.plugins);
  const { installed, addonStore } = plugins;
  // type plugData = { pluginName: String, plug };
  const { data, loading, error } = useQuery(PLUGIN_GET);
  /* istanbul ignore next */
  const getStorePlugins = async () => {
    let plugins = await new PluginHelper().fetchStore();
    const installIds = (await new PluginHelper().fetchInstalled()).map(
      (plugin: any) => plugin.id
    );
    plugins = plugins.map((plugin: any) => {
      plugin.installed = installIds.includes(plugin.id);
      return plugin;
    });
    store.dispatch({ type: 'UPDATE_STORE', payload: plugins });
  };

  /* istanbul ignore next */
  const getInstalledPlugins: () => any = () => {
    setDataList(data);
    // setRender((current) => !current);
    // const {
    //   data: newData,
    //   loading: newLoading,
    //   error: newError,
    // } = useQuery(PLUGIN_GET);
    // data = newData;
    // loading = newLoading;
    // error = newError;
    // const plugins = await new PluginHelper().fetchInstalled();
    // store.dispatch({ type: 'UPDATE_INSTALLED', payload: plugins });
    // return plugins;
  };

  /* istanbul ignore next */
  const updateLinks = async (links: any[]) => {
    store.dispatch({ type: 'UPDATE_P_TARGETS', payload: links });
  };

  // /* istanbul ignore next */
  const pluginModified = () => {
    return getInstalledPlugins();
    // .then((installedPlugins) => {
    //   getStorePlugins();
    //   return installedPlugins;
    // });
  };

  // useEffect(() => {
  //   pluginModified();
  // }, []);

  const updateSelectedTab = (tab: any) => {
    setIsStore(tab === 'available');
    isStore ? getStorePlugins() : getInstalledPlugins();
  };

  const filterChange = (ev: any) => {
    setShowEnabled(ev.target.value === 'enabled');
  };

  /* istanbul ignore next */
  if (loading) {
    return (
      <>
        <div data-testid="AddOnEntryStore" className={styles.loader}></div>
      </>
    );
  }
  // console.log(
  //   'Filtered Data is  ',
  //   data.getPlugins.filter((plugin: any) => plugin.pluginInstallStatus == true)
  // );
  // TODO: Update routes for other pages
  // TODO: Implement Search
  return (
    <>
      <div>
        <AdminNavbar targets={targets} url_1={configUrl} />
      </div>
      <div className={styles.container}>
        <SidePanel>
          <Action label={t('search')}>
            <input
              type="name"
              id="searchname"
              className={styles.actioninput}
              placeholder={t('searchName')}
              autoComplete="off"
              required
              onChange={(e) => setSearchText(e.target.value)}
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
        </SidePanel>
        <MainContent>
          <div className={styles.justifysp}>
            <p className={styles.logintitle}>{t('pHeading')}</p>
            {searchText ? (
              <p className="mb-2 text-muted author">
                Search results for <b>{searchText}</b>
              </p>
            ) : null}
            <AddOnRegister />
            <Tabs
              defaultActiveKey="available"
              id="uncontrolled-tab-example"
              className="mb-3"
              onSelect={updateSelectedTab}
            >
              <Tab eventKey="available" title={t('available')}>
                {console.log(
                  data.getPlugins.filter(
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
                    }
                  )
                )}
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
                  }
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
                      }
                    )
                    .map(
                      (
                        plug: {
                          _id: string;
                          pluginName: string | undefined;
                          pluginDesc: string | undefined;
                          pluginCreatedBy: string;
                          pluginInstallStatus: boolean | undefined;
                          getInstalledPlugins: () => any;
                        },
                        i: React.Key | null | undefined
                      ): JSX.Element => (
                        <AddOnEntry
                          id={plug._id}
                          key={i}
                          title={plug.pluginName}
                          description={plug.pluginDesc}
                          createdBy={plug.pluginCreatedBy}
                          isInstalled={plug.pluginInstallStatus}
                          configurable={plug.pluginInstallStatus}
                          component={'Special  Component'}
                          modified={() => {
                            console.log('Plugin is modified');
                          }}
                          getInstalledPlugins={getInstalledPlugins}
                        />
                      )
                    )
                )}
              </Tab>
              <Tab eventKey="installed" title={t('install')}>
                {data.getPlugins
                  .filter((plugin: any) => plugin.pluginInstallStatus == true)
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
                    }
                  ).length === 0 ? (
                  <h4>{t('pMessage')} </h4> // eslint-disable-line
                ) : (
                  data.getPlugins
                    .filter((plugin: any) => plugin.pluginInstallStatus == true)
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
                      }
                    )
                    .map(
                      (
                        plug: {
                          _id: string;
                          pluginName: string | undefined;
                          pluginDesc: string | undefined;
                          pluginCreatedBy: string;
                          pluginInstallStatus: boolean | undefined;
                          getInstalledPlugins: () => any;
                        },
                        i: React.Key | null | undefined
                      ): JSX.Element => (
                        <AddOnEntry
                          id={plug._id}
                          key={i}
                          title={plug.pluginName}
                          description={plug.pluginDesc}
                          createdBy={plug.pluginCreatedBy}
                          isInstalled={plug.pluginInstallStatus}
                          configurable={plug.pluginInstallStatus}
                          component={'Special  Component'}
                          modified={() => {
                            console.log('Plugin is modified');
                          }}
                          getInstalledPlugins={getInstalledPlugins}
                        />
                      )
                    )
                )}
              </Tab>
            </Tabs>
          </div>
        </MainContent>
      </div>
    </>
  );
}

AddOnStore.defaultProps = {};

AddOnStore.propTypes = {};

export default AddOnStore;

// {addonStore.map((plugin: any, index: number) => {
//   return (
//     <AddOnEntry
//       id={plugin.id}
//       key={index}
//       title={plugin.name}
//       description={plugin.description}
//       createdBy={plugin.createdBy}
//       component={plugin.component}
//       configurable={!plugin.installed}
//       modified={() => {
//         /* istanbul ignore next */
//         pluginModified().then((installedPlugins) => {
//           updateLinks(
//             new PluginHelper().generateLinks(installedPlugins)
//           );
//         });
//       }}
//     />
//   );
// })}

// {installed
//   .filter((plugin: any) =>
//     showEnabled ? plugin.enabled : !plugin.enabled
//   )
//   .map((plugin: any, index: number) => {
//     return (
//       <AddOnEntry
//         id={plugin.id}
//         key={index}
//         title={plugin.name}
//         description={plugin.description}
//         createdBy={plugin.createdBy}
//         component={plugin.component}
//         enabled={plugin.enabled}
//         installed={true}
//         configurable={true}
//         modified={() => {
//           /* istanbul ignore next */
//           pluginModified().then((installedPlugins) => {
//             updateLinks(
//               new PluginHelper().generateLinks(installedPlugins)
//             );
//           });
//         }}
//       />
//     );
//   })}
