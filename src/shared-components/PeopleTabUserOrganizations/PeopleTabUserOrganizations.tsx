/**
 * PeopleTabUserOrganizations Component
 *
 * A reusable card component to display information about a user's organization
 * within the People Tab. Shows organization image, title, description, admin and member counts,
 * and an optional action button with an icon and label.
 *
 * @component
 *
 * @remarks
 * - Used for listing organizations a user is part of.
 * - Displays organization metadata such as admin count and member count.
 * - Supports an optional action button for interactions like editing or viewing details.
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
 * @param {string} img — URL of the organization's image/logo.
 * @param {string} title — Name/title of the organization.
 * @param {string} description — Short description of the organization.
 * @param {number} adminCount — Number of admins in the organization.
 * @param {number} membersCount — Number of members in the organization.
 * @param {React.ReactNode} [actionIcon] — Optional icon to display in the action button.
 * @param {string} [actionName] — Optional label for the action button.
 *
 * @returns {JSX.Element} The rendered PeopleTabUserOrganizations component.
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
