import React from 'react';
import styles from 'style/app-fixed.module.css';
import { InterfacePeopleTabUserOrganizationProps } from 'types/PeopleTab/interface';

const PeopleTabUserOrganizations: React.FC<
  InterfacePeopleTabUserOrganizationProps
> = ({
  img,
  title,
  description,
  adminCount,
  membersCount,
  actionIcon,
  actionName,
}) => {
  return (
    <div className={styles.peopleTabUserOrganizationsCard}>
      <div className={styles.peopleTabUserOrganizationsCardContent}>
        <img
          className={styles.peopleTabUserOrganizationsCardImage}
          src={img}
          alt=""
        />
        <div className={styles.peopleTabUserOrganizationsCardText}>
          <h3 className={styles.peopleTabUserOrganizationsCardTitle}>
            {title}
          </h3>
          <p className={styles.peopleTabUserOrganizationsCardDescription}>
            {description}
          </p>
          <div className={styles.peopleTabUserOrganizationsCardStats}>
            <span>Admins: {adminCount}</span>
            <span>Members: {membersCount}</span>
          </div>
        </div>
      </div>
      <div className={styles.peopleTabUserOrganizationsCardAction}>
        <button className={styles.peopleTabUserOrganizationsEditButton}>
          {actionIcon}
          {actionName}
        </button>
      </div>
    </div>
  );
};

export default PeopleTabUserOrganizations;
