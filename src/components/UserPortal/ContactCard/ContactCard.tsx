import React from 'react';
import styles from './ContactCard.module.css';
import Avatar from 'components/Avatar/Avatar';
import { Badge } from 'react-bootstrap';

interface InterfaceContactCardProps {
  id: string;
  title: string;
  image: string;
  selectedContact: string;
  setSelectedContact: React.Dispatch<React.SetStateAction<string>>;
  isGroup: boolean;
  unseenMessages: number;
  lastMessage: string;
}

/**
 * Displays a card for a contact in a contact list.
 *
 * Shows the contact's name, email, and an image or avatar.
 * The card changes background color based on whether it is selected.
 * Clicking on the card sets it as the selected contact and updates the contact name.
 *
 * @param  props - The properties passed to the component.
 * @param  id - The unique identifier of the contact.
 * @param  firstName - The first name of the contact.
 * @param  lastName - The last name of the contact.
 * @param  email - The email address of the contact.
 * @param  image - The URL of the contact's image.
 * @param  selectedContact - The ID of the currently selected contact.
 * @param  setSelectedContact - Function to set the ID of the selected contact.
 * @param  setSelectedContactName - Function to set the name of the selected contact.
 *
 * @returns  The rendered contact card component.
 */
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
        onClick={handleSelectedContactChange}
        data-testid="contactContainer"
      >
        {props.image ? (
          <img
            src={props.image}
            alt={props.title}
            className={styles.contactImage}
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
            <b>{props.title}</b>{' '}
            <p className={styles.lastMessage}>{props.lastMessage}</p>
          </div>
          {!!props.unseenMessages && (
            <Badge className={styles.unseenMessagesCount}>
              {props.unseenMessages}
            </Badge>
          )}
        </div>
      </div>
    </>
  );
}

export default contactCard;
