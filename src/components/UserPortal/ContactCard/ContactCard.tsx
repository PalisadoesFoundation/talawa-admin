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

function contactCard(props: InterfaceContactCardProps): JSX.Element {
  const handleSelectedContactChange = (): void => {
    props.setSelectedContact(props.id);
  };
  const [isSelected, setIsSelected] = React.useState(
    props.selectedContact === props.id,
  );

  // Update selection state when the selected contact changes
  React.useEffect(() => {
    setIsSelected(props.selectedContact === props.id);
  }, [props.selectedContact]);

  return (
    <>
      <div
        className={`${styles.contact} ${
          isSelected ? styles.bgGreen : styles.bgWhite
        }`}
        data-testid={`contact-card-${props.id}`}
      >
        <div
          onClick={handleSelectedContactChange}
          data-testid={`contact-container-${props.id}`}
          data-selected={String(isSelected)}
        >
          {props.image ? (
            <img
              data-testid={`contact-${props.id}-image`}
              src={normalizeMinioUrl(props.image)}
              alt={props.title}
              className={styles.contactImage}
              crossOrigin="anonymous"
            />
          ) : (
            <Avatar
              name={props.title}
              alt={props.title}
              avatarStyle={styles.contactImage}
            />
          )}
          <div className={styles.contactNameContainer}>
            <div>
              <b data-testid={`contact-title-${props.id}`}>{props.title}</b>{' '}
              {props.lastMessage ? (
                <p
                  data-testid={`contact-lastMessage-${props.id}`}
                  className={styles.lastMessage}
                >
                  {props.lastMessage}
                </p>
              ) : null}
            </div>
            {!!props.unseenMessages && (
              <Badge
                data-testid={`contact-unseen-${props.id}`}
                className={styles.unseenMessagesCount}
              >
                {props.unseenMessages}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default contactCard;
