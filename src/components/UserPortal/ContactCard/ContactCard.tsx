/**
 * Represents a contact card component used in the user portal.
 * This component displays a contact's avatar, name, last message,
 * and the count of unseen messages. It also highlights the selected contact.
 *
 * @param id - The unique identifier for the contact.
 * @param title - The name or title of the contact.
 * @param image - The URL of the contact's avatar image.
 * @param lastMessage - The last message sent or received from the contact.
 * @param unseenMessages - The count of unseen messages for the contact.
 * @param selectedContact - The ID of the currently selected contact.
 * @param setSelectedContact - Callback to update the selected contact.
 *
 * @returns A styled contact card component.
 *
 * @remarks
 * - The component uses `React.useState` to manage the selection state of the contact.
 * - The `React.useEffect` hook ensures the selection state updates when the selected contact changes.
 * - The component conditionally renders an avatar image or a fallback avatar component.
 * - The `Badge` component is used to display the count of unseen messages.
 *
 * @example
 * ```tsx
 * <ContactCard
 *   id="123"
 *   title="John Doe"
 *   image="https://example.com/avatar.jpg"
 *   lastMessage="Hello!"
 *   unseenMessages={3}
 *   selectedContact="123"
 *   setSelectedContact={(id) => console.log(id)}
 * />
 * ```
 */
import React from 'react';
import { Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import UserPortalCard from 'components/UserPortal/UserPortalCard/UserPortalCard';
import type { InterfaceContactCardProps } from 'types/UserPortal/Chat/interface';

import styles from './ContactCard.module.css';
import { ProfileAvatarDisplay } from 'shared-components/ProfileAvatarDisplay/ProfileAvatarDisplay';

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

  const imageSlot = (
    <ProfileAvatarDisplay
      fallbackName={title}
      className={styles.contactImage}
      size="medium"
      imageUrl={image}
      enableEnlarge
    />
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
      dataTestId={'contact-card-' + id}
      ariaLabel={t('contact.card_aria', 'Contact card')}
      imageSlot={imageSlot}
      actionsSlot={actionsSlot}
      className={styles.contactCardWrapper}
    >
      <button
        type="button"
        onClick={handleSelect}
        data-testid={`contact-container-${id}`}
        aria-pressed={isSelected}
        data-selected={String(isSelected)}
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
      </button>
    </UserPortalCard>
  );
};

export default ContactCard;
