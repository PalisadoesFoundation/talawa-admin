import React, { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import i18next from 'i18next';

import styles from './AdminNavbar.module.css';
import Logo from 'assets/talawa-logo-200x200.png';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { UPDATE_SPAM_NOTIFICATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { languages } from 'utils/languages';

interface NavbarProps {
  targets: {
    url?: string;
    name: string;
    subTargets?: {
      url: string;
      name: string;
      icon?: string;
    }[];
  }[];
  url_1: string;
}

function AdminNavbar({ targets, url_1 }: NavbarProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'adminNavbar' });

  const [spamCountData, setSpamCountData] = useState([]);

  const currentUrl = window.location.href.split('=')[1];

  const { data, error, refetch } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });
  const [updateSpam] = useMutation(UPDATE_SPAM_NOTIFICATION_MUTATION);

  useEffect(() => {
    const handleUpdateSpam = async () => {
      const spamId = localStorage.getItem('spamId');
      if (spamId) {
        try {
          const { data } = await updateSpam({
            variables: {
              orgId: currentUrl,
              spamId,
              isReaded: true,
            },
          });

          /* istanbul ignore next */
          if (data) {
            localStorage.removeItem('spamId');
            refetch();
          }
        } catch (error) {
          /* istanbul ignore next */
          console.log(error);
        }
      }
    };

    handleUpdateSpam();
  }, []);

  useEffect(() => {
    if (data && data.organizations[0].spamCount) {
      setSpamCountData(
        data.organizations[0].spamCount.filter(
          (spam: any) => spam.isReaded === false
        )
      );
    }
  }, [data]);

  const currentLanguageCode = Cookies.get('i18next') || 'en';

  const handleSpamNotification = (spamId: string) => {
    localStorage.setItem('spamId', spamId);
    window.location.assign(`/blockuser/id=${url_1}`);
  };

  /* istanbul ignore next */
  if (error) {
    window.location.replace('/orglist');
  }

  return (
    <>
      <Navbar className={styles.navbarbg} expand="xl" fixed="top">
        <Navbar.Brand>
          <Link className={styles.logo} to="/orglist">
            <img src={Logo} />
            <strong>{t('talawa_portal')}</strong>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            {targets.map(({ name, url, subTargets }) => {
              return url ? (
                <Nav.Item key={name} className={styles.navitems}>
                  <Nav.Link
                    as={Link}
                    to={url}
                    id={name}
                    className={styles.navlinks}
                  >
                    {t(name)}
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <Nav.Item key={name} className={styles.navitems}>
                  <Dropdown className={styles.dropdowns}>
                    <Dropdown.Toggle
                      variant=""
                      className={styles.dropdowntoggle}
                    >
                      <Nav.Link
                        href={url}
                        id={name}
                        className={styles.navlinks}
                      >
                        {t(name)}
                      </Nav.Link>
                    </Dropdown.Toggle>
                    {subTargets && (
                      <Dropdown.Menu>
                        {subTargets.map((subTarget: any, index: number) => (
                          <Dropdown.Item
                            key={index}
                            as={Link}
                            to={subTarget.url}
                            className={styles.dropdownitem}
                          >
                            <i
                              className={`fa ${subTarget.icon}`}
                              data-testid="dropdownIcon"
                            ></i>
                            {t(subTarget.name)}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    )}
                  </Dropdown>
                </Nav.Item>
              );
            })}
          </Nav>
          <Nav className="ml-auto ">
            <div className={styles.notificationIcon}>
              <IconButton
                data-toggle="modal"
                data-target="#notificationModal"
                data-placement="bottom"
                title="Notification"
              >
                <Badge
                  color="success"
                  badgeContent={spamCountData.length}
                  max={9}
                >
                  <NotificationsIcon htmlColor="black" />
                </Badge>
              </IconButton>
            </div>
            <Dropdown className={styles.dropdowns}>
              <Dropdown.Toggle variant="" id="dropdown-basic">
                <img
                  src="https://via.placeholder.com/45x45"
                  className={styles.roundedcircle}
                  data-testid="logoutDropdown"
                />
              </Dropdown.Toggle>
              <Dropdown.Menu className={styles.dropdownMenu}>
                <Dropdown.Item
                  data-toggle="modal"
                  data-target="#notificationModal"
                >
                  <i className="fa fa-bell"></i>&ensp; {t('notification')}{' '}
                  <span className="badge badge-success">
                    {spamCountData.length}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={`/orgsetting/id=${url_1}`}>
                  <i className="fa fa-cogs"></i>&ensp; {t('settings')}
                </Dropdown.Item>
                <Dropdown className={styles.languageDropdown}>
                  <Dropdown.Toggle
                    variant=""
                    id="dropdown-basic"
                    data-testid="languageDropdown"
                  >
                    <i className="fas fa-globe"></i>&ensp; {t('language')}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {languages.map((language, index: number) => (
                      <Dropdown.Item key={index}>
                        <button
                          className="dropdown-item"
                          onClick={() => i18next.changeLanguage(language.code)}
                          disabled={currentLanguageCode === language.code}
                          data-testid={`changeLanguageBtn${index}`}
                        >
                          <span
                            className={`flag-icon flag-icon-${language.country_code} mr-2`}
                          ></span>
                          {language.name}
                        </button>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown.Item
                  onClick={() => {
                    localStorage.clear();
                    window.location.replace('/');
                  }}
                >
                  <i className="fa fa-arrow-right"></i>
                  &ensp;{t('logout')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Notification Modal */}
      <div
        className="modal fade"
        id="notificationModal"
        tabIndex={-1}
        aria-labelledby="notificationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="notificationModalLabel">
                {t('notifications')}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {spamCountData.length > 0 ? (
                spamCountData.map((spam: any) => (
                  <div
                    className={`border rounded p-3 mb-2 ${styles.notificationList}`}
                    onClick={() => handleSpamNotification(spam._id)}
                    key={spam._id}
                    data-testid={`spamNotification${spam._id}`}
                  >
                    {`${spam.user.firstName} ${spam.user.lastName}`}{' '}
                    {t('spamsThe')} {spam.groupchat.title} {t('group')}.
                  </div>
                ))
              ) : (
                <p className="text-center">{t('noNotifications')}</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                data-dismiss="modal"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminNavbar;
