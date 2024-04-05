import React from 'react';
import styles from './DonationCard.module.css';
<<<<<<< HEAD
import { type InterfaceDonationCardProps } from 'screens/UserPortal/Donate/Donate';
import { Button } from 'react-bootstrap';

function donationCard(props: InterfaceDonationCardProps): JSX.Element {
  const date = new Date(props.updatedAt);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);

  return (
    <div className={`${styles.mainContainer}`}>
      <div className={styles.img}></div>
      <div className={styles.personDetails}>
        <span>
          <b data-testid="DonorName">{props.name}</b>
        </span>
        <span>Amount: {props.amount}</span>
        <span>Date: {formattedDate}</span>
      </div>
      <div className={styles.btn}>
        <Button size="sm" variant="success">
          View
        </Button>
=======

interface InterfaceDonationCardProps {
  id: string;
  name: string;
  amount: string;
  userId: string;
  payPalId: string;
}

function donationCard(props: InterfaceDonationCardProps): JSX.Element {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.personDetails}>
        <b>{props.name}</b>
        <span>Amount: {props.amount}</span>
        <span>PayPal Id: {props.payPalId}</span>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      </div>
    </div>
  );
}

export default donationCard;
