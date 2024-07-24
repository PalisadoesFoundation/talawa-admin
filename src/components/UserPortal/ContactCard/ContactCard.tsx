import React from 'react';
import styles from './ContactCard.module.css';
import Avatar from 'components/Avatar/Avatar';

interface InterfaceContactCardProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  selectedContact: string;
  setSelectedContact: React.Dispatch<React.SetStateAction<string>>;
  setSelectedContactName: React.Dispatch<React.SetStateAction<string>>;
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
  // Full name of the contact
  const contactName = `${props.firstName} ${props.lastName}`;

  /**
   * Updates the selected contact and its name when the card is clicked.
   */
  const handleSelectedContactChange = (): void => {
    props.setSelectedContact(props.id);
    props.setSelectedContactName(contactName);
  };

  // State to track if the contact card is selected
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
          isSelected ? styles.bgGrey : styles.bgWhite
        }`}
        onClick={handleSelectedContactChange}
        data-testid="contactContainer"
      >
        {props.image ? (
          <img
            src={props.image}
            alt={contactName}
            className={styles.contactImage}
          />
        ) : (
          <Avatar
            name={contactName}
            alt={contactName}
            avatarStyle={styles.contactImage}
          />
        )}
        <div className={styles.contactNameContainer}>
          <b>{contactName}</b>
          <small className={styles.grey}>{props.email}</small>
        </div>
      </div>
    </>
  );
}

export default contactCard;
