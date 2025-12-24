/**
 * PeopleCard Component
 *
 * Displays information about a person within an organization,
 * including serial number, avatar, name, email, and role.
 *
 * @component
 * @param props - Props for the PeopleCard component.
 * @param props.id - Unique identifier of the person.
 * @param props.name - Name of the person.
 * @param props.image - URL of the person's profile image.
 * @param props.email - Email address of the person.
 * @param props.role - Role or designation of the person.
 * @param props.sno - Serial number in the list.
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
import { useTranslation } from 'react-i18next';

import UserPortalCard from 'components/UserPortal/UserPortalCard/UserPortalCard';
import Avatar from 'components/Avatar/Avatar';

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
  const { t } = useTranslation();

  const avatarAlt = t('people.avatar_alt', {
    defaultValue: name,
    name,
  });

  const imageSlot = image ? (
    <img
      src={image}
      alt={avatarAlt}
      className={styles.avatarImage}
      data-testid={`people-${id}-image`}
    />
  ) : (
    <Avatar name={name} alt={avatarAlt} avatarStyle={styles.avatarImage} />
  );

  return (
    <UserPortalCard
      variant="compact"
      dataTestId={t('people.card_test_id', {
        defaultValue: 'people-card-{{id}}',
        id,
      })}
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
