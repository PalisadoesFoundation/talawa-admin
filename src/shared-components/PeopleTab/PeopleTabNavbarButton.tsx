import React from 'react';
import styles from 'style/app-fixed.module.css';
import { InterfacePeopleTab } from 'types/PeopleTab/interface';

const PeopleTabNavbarButton: React.FC<InterfacePeopleTab> = ({
  title,
  icon,
  isActive,
  action,
  testId,
}) => {
  return (
    <div
      onClick={action}
      className={`${styles.peopleTabBtnBlock} ${isActive ? styles.active : ''}`}
      data-testid={testId}
    >
      <div className={styles.peopleTabIconWrapper}>
        {icon && (
          <span className={styles.peopleTabIcon}>
            {React.cloneElement(
              icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
              {
                fill: isActive ? 'var(--bs-black)' : 'var(--bs-secondary)',
              },
            )}
          </span>
        )}

        <span className={styles.peopleTabEventHeader}>{title}</span>
      </div>
    </div>
  );
};

export default PeopleTabNavbarButton;
