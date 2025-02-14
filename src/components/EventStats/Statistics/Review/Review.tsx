import React from 'react';
import Card from 'react-bootstrap/Card';
import Rating from '@mui/material/Rating';
import type { Feedback } from 'types/Event/type';
import type { InterfaceStatsModal } from 'types/Event/interface';

/**
 * Component that displays reviews for an event.
 * Shows a list of reviews with ratings and text.
 *
 * @param data - Data containing event feedback to be displayed.
 * @returns JSX element representing the reviews card.
 */
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
