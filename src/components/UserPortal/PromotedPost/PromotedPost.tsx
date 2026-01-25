/**
 * A React functional component that renders a promoted post card.
 * This component is used to display promoted content with a title,
 * optional image, and a header indicating that the content is promoted.
 *
 * @param id - A unique identifier for the promoted post.
 * @param image - The URL of the image associated with the promoted post.
 * @param title - The title of the promoted post.
 * @returns A JSX element representing the promoted post card.
 *
 * @remarks
 * The component uses `react-bootstrap` for styling the card layout.
 * The `StarPurple500Icon` from Material-UI is used to indicate promoted content.
 * Custom styles are applied using CSS modules from `./PromotedPost.module.css`.
 *
 * @example
 * ```tsx
 * <PromotedPost
 *   id="12345"
 *   image="https://example.com/image.jpg"
 *   title="Exciting Promoted Post"
 * />
 * ```
 */
import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './PromotedPost.module.css';
import StarPurple500Icon from '@mui/icons-material/StarPurple500';
import { useTranslation } from 'react-i18next';

import type { InterfacePromotedPostProps } from 'types/UserPortal/PromotedPost/interface';

export default function PromotedPost({
  id: _id,
  title,
  image,
}: InterfacePromotedPostProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'promotedPost' });
  return (
    <>
      <Card className="my-3">
        <Card.Header>
          <div className={`${styles.cardHeaderPromotedPost}`}>
            {/* Icon indicating promoted content */}
            <StarPurple500Icon data-testid="star-icon" />
            {t('title')}
          </div>
        </Card.Header>
        <Card.Body>
          {/* Display the title of the promoted content */}
          <Card.Title>{title}</Card.Title>
          {/* Display a brief description or the title again */}
          <Card.Text>{title}</Card.Text>
          {/* Conditionally render the image if provided */}
          {image && (
            <img
              src={image}
              alt={t('promotedContent', { title })}
              className={styles.imageContainerPromotedPost}
            />
          )}
        </Card.Body>
      </Card>
    </>
  );
}
