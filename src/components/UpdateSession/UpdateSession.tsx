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
import './UpdateSession.css';
import Loader from 'components/Loader/Loader';

const UpdateTimeout = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'communityProfile',
  });

  const [timeout, setTimeout] = useState<number | undefined>(30);
  const [communityTimeout, setCommunityTimeout] = useState<number | undefined>(
    30,
  ); //timeout from database for community

  const {
    data,
    loading,
    error: queryError,
  } = useQuery(GET_COMMUNITY_SESSION_TIMEOUT_DATA);
  const [uploadSessionTimeout] = useMutation(UPDATE_SESSION_TIMEOUT);

  type TimeoutDataType = {
    timeout: number;
  };

  //handle fetching timeout from community
  React.useEffect(() => {
    if (queryError) {
      errorHandler(t, queryError as Error);
    }

    const SessionTimeoutData: TimeoutDataType | undefined =
      data?.getCommunityData;

    if (SessionTimeoutData) {
      setCommunityTimeout(SessionTimeoutData.timeout);
      setTimeout(SessionTimeoutData.timeout);
    } else {
      setCommunityTimeout(undefined); // Handle null or undefined data
    }
  }, [data, queryError]);

  //handles slider changes
  const handleOnChange = (
    e: Event | React.ChangeEvent<HTMLInputElement>,
  ): void => {
    if ((e as React.ChangeEvent<HTMLInputElement>).target) {
      setTimeout(
        parseInt((e as React.ChangeEvent<HTMLInputElement>).target?.value),
      );
    }
  };

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

  if (loading) {
    <Loader />;
  }

  return (
    <>
      <Card className="update-timeout-card rounded-4 shadow-sm">
        <Card.Header className="update-timeout-card-header">
          <div className="update-timeout-card-title">Login Session Timeout</div>
        </Card.Header>
        <Card.Body className="update-timeout-card-body">
          <Form onSubmit={handleOnSubmit}>
            <div className="update-timeout-labels-container">
              <Form.Label className="update-timeout-current">
                Current Timeout:
                <span className="update-timeout-value">
                  {communityTimeout !== undefined
                    ? ` ${communityTimeout} minutes`
                    : ' No timeout set'}
                </span>
              </Form.Label>

              <Form.Label className="update-timeout-label">
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
              className="update-timeout-slider-labels"
              data-testid="slider-labels"
            >
              <span>15 min</span>
              <span>30 min</span>
              <span>45 min</span>
              <span>60 min</span>
            </div>
            <div className="update-timeout-button-container">
              <Button
                type="submit"
                variant="success"
                className="update-timeout-button"
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
