import React, { useEffect } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import type { TargetsType } from 'state/reducers/routesReducer';
import styles from './CollapsibleDropdown.module.css';
import IconComponent from 'components/IconComponent/IconComponent';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

export interface InterfaceCollapsibleDropdown {
  showDropdown: boolean;
  target: TargetsType;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const collapsibleDropdown = ({
  target,
  showDropdown,
  setShowDropdown,
}: InterfaceCollapsibleDropdown): JSX.Element => {
  const { name, subTargets } = target;
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes('orgstore')) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [location.pathname]);

  return (
    <>
      <Button
        variant={showDropdown ? 'success' : 'light'}
        className={showDropdown ? 'text-white' : 'text-secondary'}
        onClick={(): void => setShowDropdown(!showDropdown)}
        aria-expanded={showDropdown}
        data-testid="collapsible-dropdown"
      >
        <div className={styles.iconWrapper}>
          <IconComponent
            name={name}
            fill={showDropdown ? 'var(--bs-white)' : 'var(--bs-secondary)'}
          />
        </div>
        {name}
        <i
          className={`ms-auto fa  
          ${showDropdown ? 'var(--bs-white)' : 'var(--bs-secondary)'} 
          ${showDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}
          `}
        />
      </Button>
      <Collapse in={showDropdown}>
        <div className="ps-4">
          {subTargets &&
            subTargets.map(({ name, icon: stringIcon, url }, index) => {
              return (
                <NavLink to={url} key={name}>
                  {({ isActive }) => (
                    <Button
                      key={name}
                      variant={isActive === true ? 'success' : 'light'}
                      size="sm"
                      className={`${styles.collapseBtn} ${
                        isActive === true ? 'text-white' : 'text-secondary'
                      }`}
                      onClick={(): void => {
                        navigate(url);
                      }}
                      data-testid={`collapsible-dropdown-btn-${index}`}
                    >
                      <div className={styles.iconWrapperSm}>
                        <i className={`fa ${stringIcon}`} />
                      </div>
                      {name}
                      <div className="ms-auto">
                        <i
                          className={`fa me-2 fa-chevron-right ${
                            isActive === true ? 'text-white' : 'text-secondary'
                          }`}
                        />
                      </div>
                    </Button>
                  )}
                </NavLink>
              );
            })}
        </div>
      </Collapse>
    </>
  );
};

export default collapsibleDropdown;
