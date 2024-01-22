import React from 'react';
import styles from './Drawer.module.css';

function drawer(): JSX.Element {
  const onOrganizationSectionContainerClick = React.useCallback(() => {
    // Please sync "Organization| Dashboard" to the project
  }, []);

  const onDashboardButtonContainerClick = React.useCallback(() => {
    // Please sync "Organization| Dashboard" to the project
  }, []);

  const onTagsButtonContainerClick = React.useCallback(() => {
    // Please sync "Organization| Tags" to the project
  }, []);

  const onEventsButtonContainerClick = React.useCallback(() => {
    // Please sync "NOT PROTOTYPED" to the project
  }, []);

  const onPostsButtonContainerClick = React.useCallback(() => {
    // Please sync "Organization| Posts" to the project
  }, []);

  const onPluginsButtonContainerClick = React.useCallback(() => {
    // Please sync "NOT PROTOTYPED" to the project
  }, []);

  const onSettingsButtonContainerClick = React.useCallback(() => {
    // Please sync "Organization| Settings" to the project
  }, []);

  const onSignOutButtonClick = React.useCallback(() => {
    // Please sync "AUTH | LOGIN" to the project
  }, []);

  return (
    <div className={styles.drawer}>
      <div className={styles.drawerBg} />
      <div className={styles.dashboardFrame}>
        <div className={styles.menuText}>
          <div className={styles.profileFrame}>
            <div className={styles.talawaAdminPortal}>Talawa Admin Portal</div>
            <img
              className={styles.palisadoesLogoIcon}
              loading="eager"
              alt=""
              src="/palisadoes-logo@2x.png"
            />
          </div>
        </div>
        <div className={styles.tableHeaderFrame}>
          <div
            className={styles.organizationSection}
            onClick={onOrganizationSectionContainerClick}
          >
            <div className={styles.organizationSectionChild} />
            <div className={styles.rectangleParent}>
              <div className={styles.frameChild} />
              <h2 className={styles.po}>PO</h2>
            </div>
            <div className={styles.palisadoesLogoRectangle}>
              <div className={styles.palisadoesOrganization}>
                Palisadoes Organization
              </div>
              <div className={styles.jamaica}>Jamaica</div>
            </div>
            <img
              className={styles.icons8angleRight}
              loading="eager"
              alt=""
              src="/icons8angleright.svg"
            />
          </div>
          <div className={styles.signOutButtonFrame}>
            <h2 className={styles.menu}>Menu</h2>
            <div className={styles.dashboardButtonGroupRectang}>
              <div
                className={styles.dashboardButton}
                onClick={onDashboardButtonContainerClick}
              >
                <div className={styles.btnBg} />
                <div className={styles.eventsButtonTextParent}>
                  <div className={styles.eventsButtonText} />
                  <img
                    className={styles.akarIconsdashboard}
                    alt=""
                    src="/akariconsdashboard.svg"
                  />
                </div>
                <input
                  className={styles.dashboard}
                  placeholder="Dashboard"
                  type="text"
                />
              </div>
              <div className={styles.peopleButton}>
                <div className={styles.btnBg1} />
                <img
                  className={styles.peopleButtonChild}
                  alt=""
                  src="/group-5.svg"
                />
                <input
                  className={styles.requests}
                  placeholder="People"
                  type="text"
                />
              </div>
              <div
                className={styles.tagsButton}
                onClick={onTagsButtonContainerClick}
              >
                <div className={styles.btnBg2} />
                <img
                  className={styles.tagsButtonChild}
                  alt=""
                  src="/group-5-1.svg"
                />
                <input
                  className={styles.roles}
                  placeholder="Tags"
                  type="text"
                />
              </div>
              <div
                className={styles.eventsButton}
                onClick={onEventsButtonContainerClick}
              >
                <div className={styles.btnBg3} />
                <div className={styles.rectangleGroup}>
                  <div className={styles.frameItem} />
                  <img
                    className={styles.mdieventsIcon}
                    alt=""
                    src="/mdievents.svg"
                  />
                </div>
                <input
                  className={styles.roles1}
                  placeholder="Events"
                  type="text"
                />
              </div>
              <div
                className={styles.postsButton}
                onClick={onPostsButtonContainerClick}
              >
                <div className={styles.btnBg4} />
                <div className={styles.rectangleContainer}>
                  <div className={styles.frameInner} />
                  <img
                    className={styles.mdipostOutlineIcon}
                    alt=""
                    src="/mdipostoutline.svg"
                  />
                </div>
                <input
                  className={styles.roles2}
                  placeholder="Posts"
                  type="text"
                />
              </div>
              <div
                className={styles.pluginsButton}
                onClick={onPluginsButtonContainerClick}
              >
                <div className={styles.btnBg5} />
                <img
                  className={styles.pluginsButtonChild}
                  alt=""
                  src="/group-5-2.svg"
                />
                <input
                  className={styles.roles3}
                  placeholder="Plugins"
                  type="text"
                />
              </div>
              <div
                className={styles.settingsButton}
                onClick={onSettingsButtonContainerClick}
              >
                <div className={styles.btnBg6} />
                <img
                  className={styles.settingsButtonChild}
                  alt=""
                  src="/group-5-3.svg"
                />
                <input
                  className={styles.roles4}
                  placeholder="Settings"
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.settingsButtonText}>
        <div className={styles.organizationFrame}>
          <div className={styles.addAdminsGroupRectangle}>
            <button className={styles.groupButton}>
              <div className={styles.rectangleDiv} />
              <div className={styles.rj}>RJ</div>
            </button>
            <div className={styles.removeMembersText}>
              <h3 className={styles.rishavJha}>Rishav Jha</h3>
              <div className={styles.superAdmin}>Super Admin</div>
            </div>
          </div>
          <img
            className={styles.icons8angleRight1}
            alt=""
            src="/icons8angleright-1.svg"
          />
        </div>
        <div className={styles.signOutButton} onClick={onSignOutButtonClick}>
          <div className={styles.btnBg7} />
          <div className={styles.rJParent}>
            <div className={styles.rJ} />
            <img
              className={styles.materialSymbolslogoutIcon}
              alt=""
              src="/materialsymbolslogout.svg"
            />
          </div>
          <input
            className={styles.signOut}
            placeholder="Sign Out"
            type="text"
          />
        </div>
      </div>
    </div>
  );
}

export default drawer;
