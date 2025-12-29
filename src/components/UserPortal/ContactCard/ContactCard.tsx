/**
 * Represents a contact card component used in the user portal.
 * This component displays a contact's avatar, name, last message,
 * and the count of unseen messages. It also highlights the selected contact.
 *
 * @component
 * @param {InterfaceContactCardProps} props - The properties for the contact card.
 * @param {string} props.id - The unique identifier for the contact.
 * @param {string} props.title - The name or title of the contact.
 * @param {string} [props.image] - The URL of the contact's avatar image.
 * @param {string} [props.lastMessage] - The last message sent or received from the contact.
 * @param {number} [props.unseenMessages] - The count of unseen messages for the contact.
 * @param {string} props.selectedContact - The ID of the currently selected contact.
 * @param {(id: string) => void} props.setSelectedContact - Callback to update the selected contact.
 *
 * @returns {JSX.Element} A styled contact card component.
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
import styles from './ContactCard.module.css';
import Avatar from 'components/Avatar/Avatar';
import { Badge } from 'react-bootstrap';
import type { InterfaceContactCardProps } from 'types/Chat/interface';
import { normalizeMinioUrl } from 'utils/minioUtils';

function ContactCard(props: InterfaceContactCardProps): JSX.Element {
  const {
    id,
    title,
    image,
    lastMessage,
    unseenMessages,
    selectedContact,
    setSelectedContact,
  } = props;

  const handleSelectedContactChange = (): void => {
    setSelectedContact(id);
  };

  const [isSelected, setIsSelected] = React.useState(selectedContact === id);

  // Update selection state when the selected contact or id changes
  React.useEffect(() => {
    setIsSelected(selectedContact === id);
  }, [selectedContact, id]);

  return (
    <div
      className={`${styles.contact} ${
        isSelected ? styles.bgGreen : styles.bgWhite
      }`}
      data-testid={`contact-card-${id}`}
    >
      <button
        type="button"
        onClick={handleSelectedContactChange}
        data-testid={`contact-container-${id}`}
        aria-pressed={isSelected}
        data-selected={String(isSelected)}
        className={styles.contentInner}
      >
        {image ? (
          <img
            data-testid={`contact-${id}-image`}
            src={normalizeMinioUrl(image)}
            alt={title}
            className={styles.contactImage}
            crossOrigin="anonymous"
          />
        ) : (
          <Avatar name={title} alt={title} avatarStyle={styles.contactImage} />
        )}
        <div className={styles.contactNameContainer}>
          <div>
            <b data-testid={`contact-title-${id}`}>{title}</b>
            {lastMessage && (
              <p
                data-testid={`contact-lastMessage-${id}`}
                className={styles.lastMessage}
              >
                {lastMessage}
              </p>
            )}
          </div>
          {!!unseenMessages && (
            <Badge
              data-testid={`contact-unseen-${id}`}
              className={styles.unseenMessagesCount}
            >
              {unseenMessages}
            </Badge>
          )}
        </div>
      </button>
    </div>
  );
}

export default ContactCard;
