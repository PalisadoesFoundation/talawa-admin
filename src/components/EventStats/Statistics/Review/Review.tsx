/**
 * Component: ReviewStats
 *
 * This component displays a list of reviews for an event. It filters the feedback
 * data to include only those entries that have a review and renders them in a card
 * layout. Each review includes a rating and the review text.
 *
 * @param {InterfaceStatsModal} props - The props object containing event statistics data.
 * @param {Object} props.data - The event data passed to the component.
 * @param {Object} props.data.event - The event object containing feedback details.
 * @param {Feedback[]} props.data.event.feedback - An array of feedback objects for the event.
 *
 * @returns {JSX.Element} A JSX element rendering the reviews in a scrollable card.
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
import type { Feedback } from 'types/Event/type';
import type { InterfaceStatsModal } from 'types/Event/interface';

export const ReviewStats = ({ data }: InterfaceStatsModal): JSX.Element => {
  // Filter out feedback that has a review
  const reviews = data.event.feedback.filter(
    (feedback: Feedback) => feedback.review != null,
  );

  return (
    <>
      <Card
        style={{
          width: '300px',
          maxHeight: '350px',
          overflow: 'auto',
          marginBottom: '5px',
        }}
      >
        <Card.Body>
          <Card.Title>
            <h3>Reviews</h3>
          </Card.Title>
          <h5>Filled by {reviews.length} people.</h5>
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
            <>Waiting for people to talk about the event...</>
          )}
        </Card.Body>
      </Card>
    </>
  );
};
