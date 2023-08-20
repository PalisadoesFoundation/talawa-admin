import React, { useEffect } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import type { TargetsType } from 'state/reducers/routesReducer';
import styles from './CollapsibleDropdown.module.css';
import IconComponent from 'components/IconComponent/IconComponent';
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

  return (
    <>
      <Button
        variant={active ? 'success' : 'light'}
        className={`${active ? 'text-white' : 'text-secondary'}`}
        onClick={(): void => setShowDropdown(!showDropdown)}
        aria-expanded={showDropdown}
        data-testid="collapsible-dropdown"
      >
        <div className={styles.iconWrapper}>
          <IconComponent
            name={name}
            fill={active ? 'var(--bs-white)' : 'var(--bs-secondary)'}
          />
        </div>
        {name}
        <i
          className={`ms-auto fa  
          ${active ? 'var(--bs-white)' : 'var(--bs-secondary)'} 
          ${showDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}
          `}
        />
      </Button>
      <Collapse in={showDropdown}>
        <div className="ps-4">
          {subTargets &&
            subTargets.map(({ name, icon: stringIcon, url }, index) => {
              return (
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
              );
            })}
        </div>
      </Collapse>
    </>
  );
};

export default collapsibleDropdown;
