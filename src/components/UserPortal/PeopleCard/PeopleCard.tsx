/**
 * PeopleCard Component
 *
 * Displays information about a person within an organization,
 * including serial number, avatar, name, email, and role.
 *
 * @param id - Unique identifier of the person.
 * @param name - Name of the person.
 * @param image - URL of the person's profile image.
 * @param email - Email address of the person.
 * @param role - Role or designation of the person.
 * @param sno - Serial number in the list.
 *
 * @returns JSX.Element representing a people card.
 *
 * @remarks
 * - Uses `Avatar` when no image URL is provided.
 * - Layout is handled by `UserPortalCard`.
 *
 * @example
 * ```tsx
 * <PeopleCard
 *   id="1"
 *   name="John Doe"
 *   image="https://example.com/john.jpg"
 *   email="john.doe@example.com"
 *   role="Administrator"
 *   sno="1"
 * />
 * ```
 */

import React from 'react';

import UserPortalCard from 'components/UserPortal/UserPortalCard/UserPortalCard';
import Avatar from 'shared-components/Avatar/Avatar';

import styles from './PeopleCard.module.css';
import {
  TEST_ID_PEOPLE_CARD,
  TEST_ID_PEOPLE_SNO,
  TEST_ID_PEOPLE_IMAGE,
  TEST_ID_PEOPLE_NAME,
  TEST_ID_PEOPLE_EMAIL,
  TEST_ID_PEOPLE_ROLE,
} from 'Constant/common';

import type { InterfacePeopleCardProps } from 'types/UserPortal/PeopleCard/interface';

const PeopleCard: React.FC<InterfacePeopleCardProps> = ({
  id,
  name,
  image,
  email,
  role,
  sno,
}) => {
  return (
    <UserPortalCard
      variant="compact"
      dataTestId={TEST_ID_PEOPLE_CARD(id)}
      className={styles.card}
    >
      <div className={styles.row}>
        <span className={styles.snoBadge} data-testid={TEST_ID_PEOPLE_SNO(id)}>
          {sno}
        </span>
        {image ? (
          <img
            src={image}
            alt={name}
            className={styles.avatarImage}
            data-testid={TEST_ID_PEOPLE_IMAGE(id)}
          />
        ) : (
          <Avatar
            name={name}
            alt={name}
            avatarStyle={styles.avatarImage}
            size={56}
          />
        )}
        <b className={styles.name} data-testid={TEST_ID_PEOPLE_NAME(id)}>
          {name}
        </b>
        <span className={styles.email} data-testid={TEST_ID_PEOPLE_EMAIL(id)}>
          {email}
        </span>
        <div className={styles.role} data-testid={TEST_ID_PEOPLE_ROLE(id)}>
          {role}
        </div>
      </div>
    </UserPortalCard>
  );
};

export default PeopleCard;
