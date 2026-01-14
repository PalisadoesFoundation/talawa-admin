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

export interface InterfacePeopleCardProps {
  id: string;
  name: string;
  image: string;
  email: string;
  role: string;
  sno: string;
}

const PeopleCard: React.FC<InterfacePeopleCardProps> = ({
  id,
  name,
  image,
  email,
  role,
  sno,
}) => {
  const imageSlot = image ? (
    <img
      src={image}
      alt={name}
      className={styles.avatarImage}
      data-testid={`people-${id}-image`}
    />
  ) : (
    <Avatar name={name} alt={name} avatarStyle={styles.avatarImage} />
  );

  return (
    <UserPortalCard
      variant="compact"
      dataTestId={`people-card-${id}`}
      imageSlot={imageSlot}
    >
      <div className={styles.content}>
        <span data-testid={`people-sno-${id}`}>{sno}</span>

        <b data-testid={`people-name-${id}`}>{name}</b>

        <span data-testid={`people-email-${id}`}>{email}</span>

        <div data-testid={`people-role-${id}`}>{role}</div>
      </div>
    </UserPortalCard>
  );
};

export default PeopleCard;
