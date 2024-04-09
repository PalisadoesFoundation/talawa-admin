import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoginPortalToggle.module.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { NavLink } from 'react-router-dom';

interface InterfaceLoginPortalToggleProps {
  onToggle: (role: 'admin' | 'user') => void;
}

function loginPortalToggle({
  onToggle,
}: InterfaceLoginPortalToggleProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const [activeRole, setActiveRole] = useState<'admin' | 'user'>('admin');

  const handleNavLinkClick = (role: 'admin' | 'user'): void => {
    onToggle(role);
    setActiveRole(role);
  };

  return (
    <Row className="mb-4">
      <Col>
        <NavLink
          className={`${styles.navLinkClass} ${activeRole === 'admin' && styles.activeLink}`}
          to="/"
          onClick={() => handleNavLinkClick('admin')}
        >
          {t('admin')}
        </NavLink>
      </Col>
      <Col>
        <NavLink
          className={`${styles.navLinkClass} ${activeRole === 'user' && styles.activeLink}`}
          to="/"
          onClick={() => handleNavLinkClick('user')}
        >
          {t('user')}
        </NavLink>
      </Col>
    </Row>
  );
}

export default loginPortalToggle;
