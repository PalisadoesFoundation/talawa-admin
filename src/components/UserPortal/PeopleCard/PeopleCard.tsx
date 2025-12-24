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
      className={styles.avatar}
      data-testid={`people-${id}-image`}
    />
  ) : (
    <Avatar name={name} alt={avatarAlt} avatarStyle={styles.avatar} />
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
