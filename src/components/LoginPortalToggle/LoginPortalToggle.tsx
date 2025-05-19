/**
 * A React functional component that provides a toggle interface for switching
 * between 'admin' and 'user' roles. It uses navigation links styled with
 * conditional classes to indicate the active role.
 *
 * @remarks
 * This component is designed to work with the `react-router-dom` library for
 * navigation and `react-i18next` for internationalization. It also utilizes
 * Bootstrap's grid system for layout and custom CSS modules for styling.
 *
 * @param props - The props for the component.
 * @param props.onToggle - A callback function invoked when the active role is toggled.
 *                         It receives the new role ('admin' or 'user') as an argument.
 *
 * @returns A JSX element containing the toggle interface.
 *
 * @example
 * ```tsx
 * <LoginPortalToggle onToggle={(role) => console.log(role)} />
 * ```
 *
 * @component
 * @category Components
 * @module LoginPortalToggle
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../style/app-fixed.module.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { NavLink } from 'react-router';

interface InterfaceLoginPortalToggleProps {
  onToggle: (role: 'admin' | 'user') => void;
}

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
