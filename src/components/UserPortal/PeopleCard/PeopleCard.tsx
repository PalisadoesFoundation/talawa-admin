/**
 * A React functional component that renders a card displaying information about a person.
 * The card includes the person's serial number, image, name, email, and role.
 *
 * @component
 * @param {InterfaceOrganizationCardProps} props - The properties passed to the component.
 * @param {string} props.id - The unique identifier for the person.
 * @param {string} props.name - The name of the person.
 * @param {string} props.image - The URL of the person's image. Defaults to a placeholder image if not provided.
 * @param {string} props.email - The email address of the person.
 * @param {string} props.role - The role or designation of the person.
 * @param {string} props.sno - The serial number of the person in the list.
 * @returns {JSX.Element} A JSX element representing the person's card.
 *
 * @remarks
 * - The component uses a default image (`defaultImg.png`) if no image URL is provided.
 * - Styling is applied using CSS modules from `app-fixed.module.css`.
 *
 * @example
 * ```tsx
 * <PeopleCard
 *   id="1"
 *   name="John Doe"
 *   image="https://example.com/johndoe.jpg"
 *   email="john.doe@example.com"
 *   role="Administrator"
 *   sno="1"
 * />
 * ```
 */
import React from 'react';
import aboutImg from 'assets/images/defaultImg.png';
import styles from './PeopleCard.module.css';

interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  email: string;
  role: string;
  sno: string;
}

function peopleCard(props: InterfaceOrganizationCardProps): JSX.Element {
  // Determine the image URL; use default image if no image URL is provided
  const imageUrl = props.image ? props.image : aboutImg;

  return (
    <div className={styles.cardContainer}>
      {/* Container for serial number and image */}
      <span className={styles.serialNumberSection}>{props.sno}</span>
      {/* Person's image */}
      <span className={styles.avatarSection}>
        <img
          src={imageUrl}
          crossOrigin="anonymous"
          loading="lazy"
          decoding="async"
          className={
            imageUrl !== aboutImg ? styles.avatar : styles.defaultAvatar
          }
          alt={`${props.name}'s avatar`}
        />
      </span>
      {/* Person's name */}
      <div className={styles.nameSection}>{props.name}</div>
      {/* Person's email */}
      <span className={styles.emailSection}>{props.email}</span>
      {/* Person's role with additional styling */}
      <div className={styles.roleSection}>
        <div
          className={`${styles.roleBadge} ${props.role.toLowerCase() === 'admin' ? styles.admin : styles.member}`}
        >
          <span>{props.role}</span>
        </div>
      </div>
    </div>
  );
}

export default peopleCard;
