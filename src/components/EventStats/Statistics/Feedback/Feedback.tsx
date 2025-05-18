/**
 * FeedbackStats Component
 *
 * This component renders a feedback analysis section for an event, including a pie chart
 * visualization of feedback ratings and a summary of the number of attendees who provided feedback.
 *
 * @param {InterfaceStatsModal} props - The props object containing event data.
 * @param {Object} props.data - The data object containing event details.
 * @param {Object} props.data.event - The event object.
 * @param {Feedback[]} props.data.event.feedback - An array of feedback objects for the event.
 *
 * @returns {JSX.Element} A React component that displays a feedback analysis card with a pie chart.
 *
 * @remarks
 * - The pie chart uses the `@mui/x-charts/PieChart` library for visualization.
 * - Feedback ratings are visualized with colors ranging from green (high ratings) to red (low ratings).
 * - If no feedback is available, a message prompts attendees to submit feedback.
 *
 * @example
 * ```tsx
 * const eventData = {
 *   event: {
 *     feedback: [
 *       { rating: 5 },
 *       { rating: 4 },
 *       { rating: 3 },
 *     ],
 *   },
 * };
 * <FeedbackStats data={eventData} />;
 * ```
 *
 */
import React from 'react';
import {
  PieChart,
  pieArcClasses,
  pieArcLabelClasses,
} from '@mui/x-charts/PieChart';
import Card from 'react-bootstrap/Card';
import type { Feedback } from 'types/Event/type';
import type { InterfaceStatsModal } from 'types/Event/interface';

export const FeedbackStats = ({ data }: InterfaceStatsModal): JSX.Element => {
  // Colors for the pie chart slices, from green (high ratings) to red (low ratings)
  const ratingColors = [
    '#57bb8a', // Green
    '#94bd77',
    '#d4c86a',
    '#e9b861',
    '#e79a69',
    '#dd776e', // Red
  ];

  // Count the number of feedbacks for each rating
  const count: Record<number, number> = {};

  data.event.feedback.forEach((feedback: Feedback) => {
    if (feedback.rating in count) count[feedback.rating]++;
    else count[feedback.rating] = 1;
  });

  // Prepare data for the pie chart
  const chartData = [];
  for (let rating = 0; rating <= 5; rating++) {
    if (rating in count)
      chartData.push({
        id: rating,
        value: count[rating],
        label: `${rating} (${count[rating]})`,
        color: ratingColors[5 - rating],
      });
  }

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>
            <h3>Feedback Analysis</h3>
          </Card.Title>
          <h5>
            {data.event.feedback.length} people have filled feedback for this
            event.
          </h5>
          {data.event.feedback.length ? (
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
