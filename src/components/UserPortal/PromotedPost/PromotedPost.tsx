import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './PromotedPost.module.css';
import StarPurple500Icon from '@mui/icons-material/StarPurple500';

interface InterfacePostCardProps {
  id: string;
  image: string;
  title: string;
}

/**
 * PromotedPost component displays a card representing promoted content.
 *
 * This component includes:
 * - A header with a star icon indicating the content is promoted.
 * - A title and description of the promoted content.
 * - An optional image associated with the promoted content.
 *
 * @param props - Properties passed to the component including an image, title, and ID.
 * @returns JSX.Element representing a card with promoted content.
 */
export default function promotedPost(
  props: InterfacePostCardProps,
): JSX.Element {
  return (
    <>
      <Card className="my-3">
        <Card.Header>
          <div className={`${styles.cardHeader}`}>
            {/* Icon indicating promoted content */}
            <StarPurple500Icon />
            {'Promoted Content'}
          </div>
        </Card.Header>
        <Card.Body>
          {/* Display the title of the promoted content */}
          <Card.Title>{props.title}</Card.Title>
          {/* Display a brief description or the title again */}
          <Card.Text>{props.title}</Card.Text>
          {/* Conditionally render the image if provided */}
          {props.image && (
            <img src={props.image} className={styles.imageContainer} />
          )}
        </Card.Body>
      </Card>
    </>
  );
}
