import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoginPortalToggle.module.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { NavLink } from 'react-router-dom';

interface InterfaceLoginPortalToggleProps {
  onToggle: (role: 'admin' | 'user') => void; // Callback function for role change
}

/**
 * Component for toggling between admin and user login portals.
 *
 * @param onToggle - Callback function to handle role changes ('admin' or 'user').
 * @returns JSX element for login portal toggle.
 */
function loginPortalToggle({
  onToggle,
}: InterfaceLoginPortalToggleProps): JSX.Element {
  const { t: tCommon } = useTranslation('common');
  const [activeRole, setActiveRole] = useState<'admin' | 'user'>('admin'); // Default role is 'admin'

  /**
   * Handles navigation link click and updates the active role.
   *
   * @param role - The role to be activated ('admin' or 'user').
   */
  const handleNavLinkClick = (role: 'admin' | 'user'): void => {
    onToggle(role); // Invoke the callback with the new role
    setActiveRole(role); // Update the active role
  };

  return (
    <Row className="mb-4">
      <Col>
        <NavLink
          className={`${styles.navLinkClass} ${activeRole === 'admin' && styles.activeLink}`} // Apply active link styles if 'admin' is active
          to="/"
          onClick={() => handleNavLinkClick('admin')}
        >
          {tCommon('admin')}
        </NavLink>
      </Col>
      <Col>
        <NavLink
          className={`${styles.navLinkClass} ${activeRole === 'user' && styles.activeLink}`} // Apply active link styles if 'user' is active
          to="/"
          onClick={() => handleNavLinkClick('user')}
        >
          {tCommon('user')}
        </NavLink>
      </Col>
    </Row>
  );
}

export default loginPortalToggle;
