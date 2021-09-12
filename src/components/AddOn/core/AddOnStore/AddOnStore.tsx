import React, { useEffect, useState } from 'react';
import PropTypes from 'react';
import styles from './AddOnStore.module.css';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import AddOnEntry from '../AddOnEntry/AddOnEntry';
import Action from '../../support/components/Action/Action';
import SidePanel from 'components/AddOn/support/components/SidePanel/SidePanel';
import MainContent from 'components/AddOn/support/components/MainContent/MainContent';
import { useQuery } from '@apollo/client';
import { ADMIN_LIST, MEMBERS_LIST, USER_LIST } from 'GraphQl/Queries/Queries'; // PLUGIN_LIST
import { useSelector } from 'react-redux';
import { RootState } from '../../../../state/reducers';
import { Form, Tab, Tabs } from 'react-bootstrap';
import AddOnRegister from '../AddOnRegister/AddOnRegister';

function AddOnStore(): JSX.Element {
  const [isStore, setIsStore] = useState(true);
  const [showEnabled, setShowEnabled] = useState(true);

  let loading;

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  const plugins = useSelector((state: RootState) => state.plugins);
  const { installed, addonStore } = plugins;

  //   useEffect(() => {
  //       const getPlugins = async () => {
  //         const plugins = await fetchPlugins();
  //         setPlugins(plugins);
  //       }

  //       getPlugins();
  //   }, []);

  //   const fetchPlugins = async () => {
  //       const result = await fetch(`http:localhost:5000/api`);
  //       return await result.json();
  //   }

  const updateSelectedTab = (tab: any) => {
    setIsStore(tab === 'available');
  };

  const filterChange = (ev: any) => {
    setShowEnabled(ev.target.value === 'enabled');
  };

  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  // TODO: Filter functionality
  // TODO: Update routes for other pages

  // TODO: Implement Search
  return (
    <>
      <div>
        <AdminNavbar targets={targets} url_1={configUrl} />
      </div>
      <div className={styles.container}>
        <SidePanel>
          <Action label="Search">
            <input
              type="name"
              id="searchname"
              className={styles.actioninput}
              placeholder="Plugins..."
              autoComplete="off"
              required
            />
          </Action>
          {!isStore && (
            <Action label="Filters">
              <Form>
                <div key={`inline-radio`} className="mb-3">
                  <Form.Check
                    inline
                    label="Enabled"
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
                    label="Disabled"
                    name="radio-group"
                    type="radio"
                    value="disabled"
                    onChange={filterChange}
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
            <p className={styles.logintitle}>Plugins</p>
            <AddOnRegister />
            <Tabs
              defaultActiveKey="available"
              id="uncontrolled-tab-example"
              className="mb-3"
              onSelect={updateSelectedTab}
            >
              <Tab eventKey="available" title="Available">
                {addonStore.map((plugin: any, index: number) => {
                  return (
                    <AddOnEntry
                      key={index}
                      title={plugin.name}
                      description={plugin.description}
                      createdBy={plugin.createdBy}
                    />
                  );
                })}
              </Tab>
              <Tab eventKey="installed" title="Installed">
                {installed
                  .filter((plugin: any) =>
                    showEnabled ? plugin.enabled : !plugin.enabled
                  )
                  .map((plugin: any, index: number) => {
                    return (
                      <AddOnEntry
                        key={index}
                        title={plugin.name}
                        description={plugin.description}
                        createdBy={plugin.createdBy}
                        installed={true}
                      />
                    );
                  })}
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
