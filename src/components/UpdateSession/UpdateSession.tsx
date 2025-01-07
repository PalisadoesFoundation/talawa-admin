import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Form } from 'react-bootstrap';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useMutation, useQuery } from '@apollo/client';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA } from 'GraphQl/Queries/Queries';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import { UPDATE_SESSION_TIMEOUT } from 'GraphQl/Mutations/mutations';
import styles from '../../style/app.module.css';
import Loader from 'components/Loader/Loader';

/**
 * Component for updating the session timeout for a community.
 *
 * This component fetches the current session timeout value from the server
 * and allows the user to update it using a slider.
 *
 * The component also handles form submission, making a mutation request to update the session timeout.
 *
 * @returns JSX.Element - The rendered component.
 */

interface TestInterfaceUpdateTimeoutProps {
  onValueChange?: (value: number) => void;
}

const UpdateTimeout: React.FC<TestInterfaceUpdateTimeoutProps> = ({
  onValueChange,
}): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'communityProfile',
  });

  const [timeout, setTimeout] = useState<number | undefined>(30);
  const [communityTimeout, setCommunityTimeout] = useState<number | undefined>(
    30,
  ); // Timeout from database for the community

  const {
    data,
    loading,
    error: queryError,
  } = useQuery(GET_COMMUNITY_SESSION_TIMEOUT_DATA);
  const [uploadSessionTimeout] = useMutation(UPDATE_SESSION_TIMEOUT);

  type TimeoutDataType = {
    timeout: number;
  };

  /**
   * Effect that fetches the current session timeout from the server and sets the initial state.
   * If there is an error in fetching the data, it is handled using the error handler.
   */
  React.useEffect(() => {
    if (queryError) {
      errorHandler(t, queryError as Error);
    }

    const SessionTimeoutData: TimeoutDataType | undefined =
      data?.getCommunityData;

    if (SessionTimeoutData && SessionTimeoutData.timeout !== null) {
      setCommunityTimeout(SessionTimeoutData.timeout);
      setTimeout(SessionTimeoutData.timeout);
    } else {
      setCommunityTimeout(undefined); // Handle null or undefined data
    }
  }, [data, queryError]);

  /**
   * Handles changes to the slider value and updates the timeout state.
   *
   * @param e - The event triggered by slider movement.
   */
  const handleOnChange = (
    e: Event | React.ChangeEvent<HTMLInputElement>,
  ): void => {
    /* istanbul ignore else -- @preserve */
    if ('target' in e && e.target) {
      const target = e.target as HTMLInputElement;
      // Ensure the value is a number and not NaN
      const value = parseInt(target.value, 10);
      if (!Number.isNaN(value)) {
        setTimeout(value);
        /* istanbul ignore else -- @preserve */
        if (onValueChange) {
          onValueChange(value);
        }
      } else {
        console.warn('Invalid timeout value:', target.value);
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
        variables: {
          timeout: timeout,
        },
      });

      toast.success(t('profileChangedMsg'));
      setCommunityTimeout(timeout);
    } catch (error: unknown) {
      /* istanbul ignore next */
      errorHandler(t, error as Error);
    }
  };

  // Show a loader while the data is being fetched
  if (loading) {
    return <Loader />;
  }

  return (
    <>
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

            <Box sx={{ width: '100%' }}>
              <Slider
                data-testid="slider-thumb"
                value={timeout}
                valueLabelDisplay="auto"
                onChange={handleOnChange}
                step={5}
                min={15}
                max={60}
                sx={{
                  '& .MuiSlider-track': {
                    backgroundColor: '#00c451',
                    border: 'none',
                  },
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#31BB6B',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#E6E6E6',
                  },
                }}
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
                variant="success"
                className={styles.updateTimeoutButton}
                data-testid="update-button"
              >
                Update
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default UpdateTimeout;
