/**
 * PeopleTabUserOrganizations component.
 *
 * A reusable card component used in the People tab to display
 * information about an organization the user belongs to.
 *
 * Displays the organization image, title, description,
 * admin count, member count, and an optional action button.
 *
 * @remarks
 * - Used to list organizations associated with a user
 * - Shows organization metadata such as admins and members
 * - Supports an optional action button with icon and label
 *
 * @example
 * ```tsx
 * <PeopleTabUserOrganizations
 *   img="/images/org-logo.png"
 *   title="Open Source Club"
 *   description="A community for open-source enthusiasts"
 *   adminCount={2}
 *   membersCount={50}
 *   actionIcon={<EditIcon />}
 *   actionName="Edit"
 * />
 * ```
 *
 * @param img - URL of the organization image or logo
 * @param title - Name of the organization
 * @param description - Short description of the organization
 * @param adminCount - Number of administrators
 * @param membersCount - Number of members
 * @param actionIcon - Optional icon displayed inside the action button
 * @param actionName - Optional label for the action button
 *
 * @returns The rendered PeopleTabUserOrganizations component
 */

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
