import React from 'react';
import { Card } from 'react-bootstrap';
import styles from '../../../style/app.module.css';
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
 * - `.cardHeaderPromotedPost`
 * - `.imageContainerPromotedPost`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */
export default function promotedPost(
  props: InterfacePostCardProps,
): JSX.Element {
  return (
    <>
      <Card className="my-3">
        <Card.Header>
          <div className={`${styles.cardHeaderPromotedPost}`}>
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
            <img
              src={props.image}
              alt={`Promoted content: ${props.title}`}
              className={styles.imageContainerPromotedPost}
            />
          )}
        </Card.Body>
      </Card>
    </>
  );
}
