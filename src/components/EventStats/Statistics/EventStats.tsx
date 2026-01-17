/**
 * Component to display event statistics in a modal.
 *
 * This component fetches event feedback data using the `useQuery` hook
 * and displays various statistics such as feedback, reviews, and average ratings.
 *
 * @param props - The properties passed to the component.
 * @param show - Determines whether the modal is visible.
 * @param eventId - The unique identifier of the event for which statistics are displayed.
 * @param handleClose - Callback function to close the modal.
 *
 * @returns A modal containing event statistics.
 *
 * @remarks
 * - The component uses the `EVENT_FEEDBACKS` GraphQL query to fetch event feedback data.
 * - Displays a loading spinner while the data is being fetched.
 * - The modal is styled using `react-bootstrap` and custom CSS modules.
 *
 * @example
 * ```tsx
 * <EventStats
 *   show={true}
 *   eventId="12345"
 *   handleClose={() => console.log('Modal closed')}
 * />
 * ```
 *
 * Uses:-
 * - `BaseModal` from shared-components for modal UI.
 * - `@apollo/client` for GraphQL query handling.
 * - Custom CSS modules for styling.
 */
import React from 'react';
import { BaseModal } from 'shared-components/BaseModal';
import { FeedbackStats } from './Feedback/Feedback';
import { ReviewStats } from './Review/Review';
import { AverageRating } from './AverageRating/AverageRating';
import styles from './EventStats.module.css';
import { useQuery } from '@apollo/client';
import { EVENT_FEEDBACKS } from 'GraphQl/Queries/Queries';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { useTranslation } from 'react-i18next';

type ModalPropType = {
  show: boolean;
  eventId: string;
  handleClose: () => void;
};

export const EventStats = ({
  show,
  handleClose,
  eventId,
}: ModalPropType): JSX.Element => {
  const { t: tErrors } = useTranslation('errors');
  const { t } = useTranslation('translation', { keyPrefix: 'eventStats' });
  // Query to fetch event feedback data
  const { data, loading } = useQuery(EVENT_FEEDBACKS, {
    variables: { id: eventId },
  });

  // Show a loading screen while data is being fetched
  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <BaseModal
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
        size="lg"
        bodyClassName={styles.stackEvents}
        headerClassName={styles.headerPrimary}
        title={t('title')}
      >
        {/* Render feedback statistics */}
        <FeedbackStats data={data} />
        <div>
          {/* Render review statistics and average rating */}
          <ReviewStats data={data} />
          <AverageRating data={data} />
        </div>
      </BaseModal>
    </ErrorBoundaryWrapper>
  );
};
