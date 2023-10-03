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
  const [, setReviews] = useState<string[]>([]);

  const {
    data: feedbackData,
    loading: feedbackLoading,
    error: feedbackError,
  } = useQuery(EVENT_FEEDBACKS, {
    variables: { id: props.eventId },
  });

  useEffect(() => {
    if (feedbackLoading) {
      setChartData([]);
      return;
    }

    console.log(feedbackData);
    const count: Record<number, number> = {};
    const reviews: string[] = [];

    feedbackData.event.feedback.forEach((feedback: FeedbackType) => {
      if (feedback.rating in count) count[feedback.rating]++;
      else count[feedback.rating] = 1;
      if (feedback.review) reviews.push(feedback.review);
    });

    const chartData = [];
    for (let rating = 0; rating <= 10; rating++) {
      if (rating in count)
        chartData.push({
          value: count[rating],
          label: rating.toString(),
          color: ratingColors[10 - rating],
        });
    }
    console.log(chartData);
    setChartData(chartData);
    setReviews(reviews);
  }, [feedbackData, props.eventId, feedbackLoading]);

  // Render the loading screen
  if (feedbackLoading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  // Render the error screen
  if (feedbackError) {
    return (
      <>
        <h1>Oops! An error occured!</h1>
        <div className="text text-lg">{feedbackError.message}</div>
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
          <Card.Text>
            {feedbackData.event.feedback.length} people have filled feedback for
            this event.
          </Card.Text>
          <PieChart
            colors={ratingColors}
            series={[
              {
                data: chartData,
                arcLabel: (item) => `${item.label} (${item.value})`,
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
            width={400}
            height={300}
          />
        </Card.Body>
      </Card>
    </>
  );
};
