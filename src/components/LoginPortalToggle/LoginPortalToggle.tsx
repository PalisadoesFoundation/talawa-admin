import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoginPortalToggle.module.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { NavLink } from 'react-router-dom';

function loginPortalToggle(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });

  return (
    <Row className="mb-4">
      <Col>
        <NavLink
          className={styles.navLinkClass}
          activeClassName={styles.activeLink}
          exact
          to="/"
        >
          {t('admin')}
        </NavLink>
      </Col>
      <Col>
        <NavLink
          className={styles.navLinkClass}
          activeClassName={styles.activeLink}
          exact
          to="/user"
        >
          {t('user')}
        </NavLink>
      </Col>
    </Row>
  );
}

export default loginPortalToggle;
