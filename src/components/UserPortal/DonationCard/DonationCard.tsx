/**
 * @file DonationCard.tsx
 * @description A React functional component that displays a donation card with donor details,
 *              donation amount, and the date of the donation. Includes a button for further actions.
 * @module components/UserPortal/DonationCard
 *
 * @function donationCard
 * @description Renders a donation card with donor information, donation amount, and formatted date.
 * @param {InterfaceDonationCardProps} props - The properties required to render the donation card.
 * @param {string} props.name - The name of the donor.
 * @param {number} props.amount - The amount donated.
 * @param {string} props.updatedAt - The date when the donation was last updated, in ISO string format.
 * @returns {JSX.Element} A JSX element representing the donation card.
 *
 * @example
 * ```tsx
 * <donationCard
 *   name="John Doe"
 *   amount={100}
 *   updatedAt="2023-03-15T12:00:00Z"
 * />
 * ```
 *
 * @remarks
 * - The `updatedAt` property is parsed into a `Date` object and formatted into a readable string.
 * - The component uses CSS modules for styling and Bootstrap for the button.
 * - Ensure that the `InterfaceDonationCardProps` type is correctly defined in the `types/Donation/interface` module.
 */
import React from 'react';
import styles from '../../../style/app-fixed.module.css';
import { type InterfaceDonationCardProps } from 'types/Donation/interface';
import Button from 'react-bootstrap/Button';

function donationCard(props: InterfaceDonationCardProps): JSX.Element {
  // Create a date object from the donation date string
  const date = new Date(props.updatedAt);

  // Format the date into a readable string
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);

  return (
    <div className={`${styles.mainContainerDonateCard}`}>
      <div className={styles.img}></div>
      <div className={styles.personDetails}>
        <span>
          <b data-testid="DonorName">{props.name}</b>
        </span>
        <span>Amount: {props.amount}</span>
        <span>Date: {formattedDate}</span>
      </div>
      <div className={styles.btnDonate}>
        <Button size="sm" className={styles.addButton}>
          View
        </Button>
      </div>
    </div>
  );
}

export default donationCard;
