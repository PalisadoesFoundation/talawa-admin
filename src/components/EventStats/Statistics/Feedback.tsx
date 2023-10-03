import React, { useState, useEffect } from 'react';
import {
  PieChart,
  pieArcClasses,
  pieArcLabelClasses,
} from '@mui/x-charts/PieChart';
import styles from './Feedback.module.css';
import { useQuery } from '@apollo/client';
import { EVENT_FEEDBACKS } from 'GraphQl/Queries/Queries';
import Card from 'react-bootstrap/Card';

type ModalPropType = {
  eventId: string;
};

type DataEntryType = {
  id: number;
  value: number;
  label: string;
  color: string;
};

type FeedbackType = {
  _id: string;
  rating: number;
  review?: string;
};

export const FeedbackStats = (props: ModalPropType): JSX.Element => {
  const ratingColors = [
    '#57bb8a', // Green
    '#73b87e',
    '#94bd77',
    '#b0be6e',
    '#d4c86a',
    '#f5ce62',
    '#e9b861',
    '#ecac67',
    '#e79a69',
    '#e2886c',
    '#dd776e', // Red
  ];

  const [chartData, setChartData] = useState<DataEntryType[]>([]);

  const { data: feedbackData, loading: feedbackLoading } = useQuery(
    EVENT_FEEDBACKS,
    {
      variables: { id: props.eventId },
    }
  );

  useEffect(() => {
    if (feedbackLoading) {
      setChartData([]);
      return;
    }

    const count: Record<number, number> = {};

    feedbackData.event.feedback.forEach((feedback: FeedbackType) => {
      if (feedback.rating in count) count[feedback.rating]++;
      else count[feedback.rating] = 1;
    });

    const chartData = [];
    for (let rating = 0; rating <= 10; rating++) {
      if (rating in count)
        chartData.push({
          id: rating,
          value: count[rating],
          label: `${rating} (${count[rating]})`,
          color: ratingColors[10 - rating],
        });
    }
    setChartData(chartData);
  }, [feedbackData, props.eventId, feedbackLoading]);

  // Render the loading screen
  if (feedbackLoading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>
            <h3>Feedback Analysis</h3>
          </Card.Title>
          <h5>
            {feedbackData.event.feedback.length} people have filled feedback for
            this event.
          </h5>
          {feedbackData.event.feedback.length ? (
            <PieChart
              colors={ratingColors}
              series={[
                {
                  data: chartData,
                  arcLabel: (item) => `${item.id} (${item.value})`,
                  innerRadius: 30,
                  outerRadius: 120,
                  paddingAngle: 2,
                  cornerRadius: 5,
                  startAngle: 0,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30 },
                },
              ]}
              sx={{
                [`& .${pieArcClasses.faded}`]: {
                  fill: 'gray',
                },
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: 'black',
                  fontSize: '15px',
                },
                [`& .${pieArcLabelClasses.faded}`]: {
                  display: 'none',
                },
              }}
              width={380}
              height={380}
            />
          ) : (
            <>Please ask attendees to submit feedback for insights!</>
          )}
        </Card.Body>
      </Card>
    </>
  );
};
