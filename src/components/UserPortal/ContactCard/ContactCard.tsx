import React from 'react';
import { Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import UserPortalCard from 'components/UserPortal/UserPortalCard/UserPortalCard';
import Avatar from 'components/Avatar/Avatar';
import type { InterfaceContactCardProps } from 'types/Chat/interface';

import styles from './ContactCard.module.css';

const ContactCard: React.FC<InterfaceContactCardProps> = ({
  id,
  title,
  image,
  lastMessage,
  unseenMessages = 0,
  selectedContact,
  setSelectedContact,
}) => {
  const { t } = useTranslation();

  const isSelected = selectedContact === id;

  const handleSelect = (): void => {
    setSelectedContact(id);
  };

  const avatarAlt = t('contact.avatar_alt', {
    name: title,
    defaultValue: title,
  });

  const imageSlot = image ? (
    <img
      src={image}
      alt={avatarAlt}
      className={styles.contactImage}
      data-testid={`contact-${id}-image`}
    />
  ) : (
    <Avatar name={title} alt={avatarAlt} avatarStyle={styles.contactImage} />
  );

  const actionsSlot =
    unseenMessages > 0 ? (
      <Badge
        pill
        className={styles.unseenBadge}
        data-testid={`contact-unseen-${id}`}
      >
        {unseenMessages}
      </Badge>
    ) : undefined;

  return (
    <UserPortalCard
      variant="compact"
      dataTestId={t('contact.card_test_id', {
        defaultValue: 'contact-card-{{id}}',
        id,
      })}
      ariaLabel={t('contact.card_aria', 'Contact card')}
      imageSlot={imageSlot}
      actionsSlot={actionsSlot}
      className={styles.contactCardWrapper}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect();
          }
        }}
        data-testid={`contact-container-${id}`}
        data-selected={String(isSelected)}
        aria-pressed={isSelected}
        className={`${styles.contentInner} ${
          isSelected ? styles.selected : ''
        }`}
      >
        <div className={styles.titleRow}>
          <div className={styles.titleText} data-testid={`contact-title-${id}`}>
            <b>{title}</b>
            {lastMessage && (
              <div
                className={styles.lastMessage}
                data-testid={`contact-lastMessage-${id}`}
              >
                {lastMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </UserPortalCard>
  );
};

export default ContactCard;
