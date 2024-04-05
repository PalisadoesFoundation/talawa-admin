import React, { useEffect } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import type { TargetsType } from 'state/reducers/routesReducer';
import styles from './CollapsibleDropdown.module.css';
import IconComponent from 'components/IconComponent/IconComponent';
<<<<<<< HEAD
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
=======
import { useHistory } from 'react-router-dom';

export interface InterfaceCollapsibleDropdown {
  screenName: string;
  target: TargetsType;
}

const collapsibleDropdown = ({
  screenName,
  target,
}: InterfaceCollapsibleDropdown): JSX.Element => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const { name, subTargets } = target;
  const history = useHistory();

  useEffect(() => {
    target.subTargets?.map(({ name }) => {
      if (name === screenName) {
        setActive(true);
        setShowDropdown(true);
      }
    });
  }, [target.subTargets]);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  return (
    <>
      <Button
<<<<<<< HEAD
        variant={showDropdown ? 'success' : ''}
        className={showDropdown ? 'text-white' : 'text-secondary'}
=======
        variant={active ? 'success' : 'light'}
        className={`${active ? 'text-white' : 'text-secondary'}`}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        onClick={(): void => setShowDropdown(!showDropdown)}
        aria-expanded={showDropdown}
        data-testid="collapsible-dropdown"
      >
        <div className={styles.iconWrapper}>
          <IconComponent
            name={name}
<<<<<<< HEAD
            fill={showDropdown ? 'var(--bs-white)' : 'var(--bs-secondary)'}
=======
            fill={active ? 'var(--bs-white)' : 'var(--bs-secondary)'}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          />
        </div>
        {name}
        <i
          className={`ms-auto fa  
<<<<<<< HEAD
          ${showDropdown ? 'var(--bs-white)' : 'var(--bs-secondary)'} 
=======
          ${active ? 'var(--bs-white)' : 'var(--bs-secondary)'} 
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          ${showDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}
          `}
        />
      </Button>
      <Collapse in={showDropdown}>
        <div className="ps-4">
          {subTargets &&
            subTargets.map(({ name, icon: stringIcon, url }, index) => {
              return (
<<<<<<< HEAD
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
=======
                <Button
                  key={name}
                  variant={screenName === name ? 'success' : 'light'}
                  size="sm"
                  className={`${styles.collapseBtn} ${
                    screenName === name ? 'text-white' : 'text-secondary'
                  }`}
                  onClick={(): void => {
                    history.push(url);
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
                        screenName === name ? 'text-white' : 'text-secondary'
                      }`}
                    />
                  </div>
                </Button>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              );
            })}
        </div>
      </Collapse>
    </>
  );
};

export default collapsibleDropdown;
