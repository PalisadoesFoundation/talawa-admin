/**
 *
 * UpdateSession Component
 *
 * A React component that allows users to update the session timeout for a community.
 * It fetches the current timeout value from the server, displays it, and provides
 * a slider to update the timeout value. The updated value is submitted to the server
 * via a GraphQL mutation.
 *
 * Props interface: InterfaceUpdateSessionProps
 * - onValueChange: Optional callback function triggered when the slider value changes.
 *
 * @param props - Component props
 * @param onValueChange - Optional callback fired when the slider value changes.
 * @returns The rendered component.
 *
 * @example
 * ```tsx
 * <UpdateSession onValueChange={(value) => console.log(value)} />
 * ```
 *
 * @remarks
 * - Fetches the current session timeout using a GraphQL query.
 * - Allows users to update the timeout using a slider.
 * - Submits the updated timeout value to the server using a GraphQL mutation.
 * - Displays a success toast on successful update or handles errors gracefully.
 *
 * Dependencies:
 * - `react`, `react-bootstrap`, `@mui/material`, `@apollo/client`
 * - Custom modules: `GraphQl/Queries/Queries`, `GraphQl/Mutations/mutations`, `utils/errorHandler`, `shared-components/LoadingState/LoadingState`
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'react-bootstrap';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useMutation, useQuery } from '@apollo/client';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG } from 'GraphQl/Queries/Queries';
import { errorHandler } from 'utils/errorHandler';
import { UPDATE_SESSION_TIMEOUT_PG } from 'GraphQl/Mutations/mutations';
import styles from './UpdateSession.module.css';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import Button from 'shared-components/Button/Button';

import { InterfaceUpdateSessionProps } from 'types/AdminPortal/UpdateSession/interface';

const UpdateSession: React.FC<InterfaceUpdateSessionProps> = ({
  onValueChange,
}): JSX.Element => {
  const { t } = useTranslation('translation');

  const [timeout, setTimeout] = useState<number>(30);
  const [communityTimeout, setCommunityTimeout] = useState<number | undefined>(
    30,
  ); // Timeout from database for the community

  const {
    data,
    loading,
    error: queryError,
  } = useQuery(GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG);
  const [uploadSessionTimeout] = useMutation(UPDATE_SESSION_TIMEOUT_PG);

  type TimeoutDataType = { inactivityTimeoutDuration: number };

  /**
   * Effect that fetches the current session timeout from the server and sets the initial state.
   * If there is an error in fetching the data, it is handled using the error handler.
   */
  React.useEffect(() => {
    if (queryError) {
      errorHandler(t, queryError as Error);
    }

    const SessionTimeoutData: TimeoutDataType | undefined = data?.community;

    if (
      SessionTimeoutData &&
      SessionTimeoutData.inactivityTimeoutDuration !== null
    ) {
      const timeoutInMinutes = Math.floor(
        SessionTimeoutData.inactivityTimeoutDuration / 60,
      );
      setCommunityTimeout(timeoutInMinutes);
      setTimeout(timeoutInMinutes);
    } else {
      setCommunityTimeout(undefined);
    }
  }, [data, queryError]);

  /**
   * Handles changes to the slider value and updates the timeout state.
   *
   * @param e - The event triggered by slider movement.
   * @param newValue - The new value of the slider.
   */
  const handleOnChange = (e: Event, newValue: number | number[]): void => {
    if (typeof newValue === 'number') {
      setTimeout(newValue);

      if (onValueChange) {
        onValueChange(newValue);
      }
    }
  };

  /**
   * Handles form submission to update the session timeout.
   * It makes a mutation request to update the timeout value on the server.
   * If the update is successful, a success toast is shown, and the state is updated.
   *
   * @param e - The event triggered by form submission.
   */
  const handleOnSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await uploadSessionTimeout({
        variables: { inactivityTimeoutDuration: timeout * 60 },
      });

      NotificationToast.success(t('communityProfile.profileChangedMsg'));
      setCommunityTimeout(timeout);
    } catch (error: unknown) {
      errorHandler(t, error as Error);
    }
  };

  return (
    <LoadingState isLoading={loading} variant="spinner">
      <Card className={`${styles.updateTimeoutCard} rounded-4 shadow-sm`}>
        <Card.Header className={styles.updateTimeoutCardHeader}>
          <div className={styles.updateTimeoutCardTitle}>
            {t('communityProfile.sessionTimeout.title')}
          </div>
        </Card.Header>
        <Card.Body className={styles.updateTimeoutCardBody}>
          <form onSubmit={handleOnSubmit}>
            <div className={styles.updateTimeoutLabelsContainer}>
              <div className={`form-label ${styles.updateTimeoutCurrent}`}>
                {t('communityProfile.sessionTimeout.currentTimeout')}
                <span
                  className={styles.updateTimeoutValue}
                  data-testid="timeout-value"
                >
                  {communityTimeout !== undefined
                    ? t('communityProfile.sessionTimeout.minutes', {
                        count: communityTimeout,
                      })
                    : t('communityProfile.sessionTimeout.noTimeoutSet')}
                </span>
              </div>

              <label
                htmlFor="session-timeout-slider"
                className={`form-label ${styles.updateTimeoutLabel}`}
              >
                {t('communityProfile.sessionTimeout.updateSession')}
              </label>
            </div>

            <Box>
              <Slider
                data-testid="slider-thumb"
                id="session-timeout-slider"
                value={timeout}
                valueLabelDisplay="auto"
                onChange={handleOnChange}
                step={5}
                min={15}
                max={60}
                className={styles.slider}
              />
            </Box>

            <div
              className={styles.updateTimeoutSliderLabels}
              data-testid="slider-labels"
            >
              <span>{t('communityProfile.sessionTimeout.min15')}</span>
              <span>{t('communityProfile.sessionTimeout.min30')}</span>
              <span>{t('communityProfile.sessionTimeout.min45')}</span>
              <span>{t('communityProfile.sessionTimeout.min60')}</span>
            </div>
            <div className={styles.updateTimeoutButtonContainer}>
              <Button
                type="submit"
                className={styles.updateTimeoutButton}
                data-testid="update-button"
              >
                {t('communityProfile.sessionTimeout.update')}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </LoadingState>
  );
};

export default UpdateSession;
