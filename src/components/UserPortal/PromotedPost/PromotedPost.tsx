/**
 * A React functional component that renders a promoted post card.
 * This component is used to display promoted content with a title,
 * optional image, and a header indicating that the content is promoted.
 *
 * @component
 * @param props - The properties passed to the component.
 * @param props.id - A unique identifier for the promoted post.
 * @param props.image - The URL of the image associated with the promoted post.
 *                       If no image is provided, the image section will not be rendered.
 * @param props.title - The title of the promoted post, displayed in the card header and body.
 *
 * @returns A JSX element representing the promoted post card.
 *
 * @remarks
 * - The component uses `react-bootstrap` for styling the card layout.
 * - The `StarPurple500Icon` from Material-UI is used to indicate promoted content.
 * - Custom styles are applied using CSS modules from `style/app.module.css`.
 *
 * @example
 * ```tsx
 * <PromotedPost
 *   id="12345"
 *   image="https://example.com/image.jpg"
 *   title="Exciting Promoted Post"
 * />
 * ```
 *
 * @fileoverview
 * This file defines the `PromotedPost` component, which is part of the
 * `UserPortal` feature in the Talawa Admin project.
 */
import React from 'react';
import { Card } from 'react-bootstrap';
import styles from '../../../style/app-fixed.module.css';
import StarPurple500Icon from '@mui/icons-material/StarPurple500';

interface InterfacePostCardProps {
  id: string;
  image: string;
  title: string;
}

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
