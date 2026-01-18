/**
 * Component: ReviewStats
 *
 * This component displays a list of reviews for an event. It filters the feedback
 * data to include only those entries that have a review and renders them in a card
 * layout. Each review includes a rating and the review text.
 *
 * @param props - The props object containing event statistics data.
 * @param data - The event data passed to the component.
 * @remarks
 * - data.event - The event object containing feedback details.
 * - data.event.feedback - An array of feedback objects for the event.
 *
 * @returns A JSX element rendering the reviews in a scrollable card.
 *
 * @remarks
 * - If no reviews are available, a placeholder message is displayed.
 * - The component uses Material-UI's `Rating` component for displaying ratings.
 * - Bootstrap's `Card` component is used for styling the layout.
 *
 * @example
 * ```tsx
 * const eventData = {
 *   event: {
 *     feedback: [
 *       { _id: '1', rating: 4, review: 'Great event!' },
 *       { _id: '2', rating: 5, review: 'Amazing experience!' },
 *     ],
 *   },
 * };
 *
 * <ReviewStats data={eventData} />
 * ```
 */
import React from 'react';
import Card from 'react-bootstrap/Card';
import Rating from '@mui/material/Rating';
import styles from './Review.module.css';
import type { Feedback } from 'types/Event/type';
import type { InterfaceStatsModal } from 'types/Event/interface';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { useTranslation } from 'react-i18next';

export const ReviewStats = ({ data }: InterfaceStatsModal): JSX.Element => {
  const { t: tErrors } = useTranslation('errors');
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventStats.reviews',
  });
  // Filter out feedback that has a review
  const reviews = data.event.feedback.filter(
    (feedback: Feedback) => feedback.review != null,
  );

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <Card className={styles.reviewCard}>
        <Card.Body>
          <Card.Title>
            <h3>{t('title')}</h3>
          </Card.Title>
          <h5>{t('filledByCount', { count: reviews.length })}</h5>
          {reviews.length ? (
            reviews.map((review) => (
              <div className="card user-review m-1" key={review._id}>
                <div className="card-body">
                  <Rating name="read-only" value={review.rating} readOnly />
                  <p className="card-text">{review.review}</p>
                </div>
              </div>
            ))
          ) : (
            <>{t('emptyState')}</>
          )}
        </Card.Body>
      </Card>
    </ErrorBoundaryWrapper>
  );
};
