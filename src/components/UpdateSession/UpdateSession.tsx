/**
 * UpdateTimeout Component
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Form } from 'react-bootstrap';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useMutation, useQuery } from '@apollo/client';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG } from 'GraphQl/Queries/Queries';
import { errorHandler } from 'utils/errorHandler';
import { UPDATE_SESSION_TIMEOUT_PG } from 'GraphQl/Mutations/mutations';
import styles from 'style/app-fixed.module.css';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

interface TestInterfaceUpdateTimeoutProps {
  onValueChange?: (value: number) => void;
}

const UpdateTimeout: React.FC<TestInterfaceUpdateTimeoutProps> = ({
  onValueChange,
}): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'communityProfile',
  });

  const [timeout, setTimeout] = useState<number>(30);
  const [communityTimeout, setCommunityTimeout] = useState<number | undefined>(
    30,
  );

  const {
    data,
    loading,
    error: queryError,
  } = useQuery(GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG);
  const [uploadSessionTimeout] = useMutation(UPDATE_SESSION_TIMEOUT_PG);

  type TimeoutDataType = { inactivityTimeoutDuration: number };

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
   */
  const handleOnChange = (_event: Event, value: number | number[]): void => {
    const newValue = Array.isArray(value) ? value[0] : value;

    setTimeout(newValue);

    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const handleOnSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await uploadSessionTimeout({
        variables: { inactivityTimeoutDuration: timeout * 60 },
      });

      NotificationToast.success(t('profileChangedMsg'));
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
            Login Session Timeout
          </div>
        </Card.Header>
        <Card.Body className={styles.updateTimeoutCardBody}>
          <Form onSubmit={handleOnSubmit}>
            <div className={styles.updateTimeoutLabelsContainer}>
              <Form.Label className={styles.updateTimeoutCurrent}>
                Current Timeout:
                <span
                  className={styles.updateTimeoutValue}
                  data-testid="timeout-value"
                >
                  {communityTimeout !== undefined
                    ? ` ${communityTimeout} minutes`
                    : ' No timeout set'}
                </span>
              </Form.Label>

              <Form.Label className={styles.updateTimeoutLabel}>
                Update Timeout
              </Form.Label>
            </div>

            <Box>
              <Slider
                data-testid="slider-thumb"
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
              <span>15 min</span>
              <span>30 min</span>
              <span>45 min</span>
              <span>60 min</span>
            </div>
            <div className={styles.updateTimeoutButtonContainer}>
              <Button
                type="submit"
                className={styles.addButton}
                data-testid="update-button"
              >
                Update
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </LoadingState>
  );
};

export default UpdateTimeout;
