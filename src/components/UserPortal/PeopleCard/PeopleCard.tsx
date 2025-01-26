import React from 'react';
import aboutImg from 'assets/images/defaultImg.png';
import styles from './../../../style/app.module.css';

/**
 * Props interface for the PeopleCard component.
 */
interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  email: string;
  role: string;
  sno: string;
}

/**
 * PeopleCard component displays information about a person within an organization.
 *
 * It includes:
 * - An image of the person or a default image if none is provided.
 * - The serial number of the person.
 * - The person's name.
 * - The person's email address.
 * - The person's role within the organization, styled with a border.
 *
 * @param props - The properties passed to the component.
 * @returns JSX.Element representing a card with the person's details.
 *
 * ## CSS Strategy Explanation:
 *
 * To ensure consistency across the application and reduce duplication, common styles
 * (such as button styles) have been moved to the global CSS file. Instead of using
 * component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
 * class (e.g., .addButton) is now applied.
 *
 * ### Benefits:
 * - **Reduces redundant CSS code.
 * - **Improves maintainability by centralizing common styles.
 * - **Ensures consistent styling across components.
 *
 * ### Global CSS Classes used:
 * - `.blueText`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */
function peopleCard(props: InterfaceOrganizationCardProps): JSX.Element {
  // Determine the image URL; use default image if no image URL is provided
  const imageUrl = props.image ? props.image : aboutImg;

  return (
    <div className={styles.people_card_container}>
      {/* Container for serial number and image */}
      <span style={{ flex: '1' }} className={styles.display_flex}>
        {/* Serial number */}
        <span style={{ flex: '1' }} className={styles.align_center}>
          {props.sno}
        </span>
        {/* Person's image */}
        <span style={{ flex: '1' }}>
          <img
            src={imageUrl}
            width="80px"
            height="auto"
            className={styles.personImage_peoplecard}
          />
        </span>
      </span>
      {/* Person's name */}
      <b style={{ flex: '2' }} className={styles.align_center}>
        {props.name}
      </b>
      {/* Person's email */}
      <span style={{ flex: '2' }} className={styles.align_center}>
        {props.email}
      </span>
      {/* Person's role with additional styling */}
      <div style={{ flex: '2' }} className={styles.align_center}>
        <div className={styles.people_role}>
          <span>{props.role}</span>
        </div>
      </div>
    </div>
  );
}

export default peopleCard;
