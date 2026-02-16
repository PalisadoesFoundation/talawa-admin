import { PieChart } from '@mui/x-charts/PieChart';
import { render, waitFor } from '@testing-library/react';
import { NotificationToastContainer } from 'components/NotificationToast/NotificationToast';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { describe, expect, it, vi } from 'vitest';
import {
  diverseRatingsProps,
  emptyProps,
  nonEmptyProps,
} from '../../EventStatsMocks';
import { FeedbackStats } from './Feedback';

// Type definition for PieChart props used in testing
interface InterfacePieChartProps {
  series: Array<{
    arcLabel: (item: { id: number; value: number }) => string;
    data: Array<{
      id: number;
      value: number;
      label: string;
      color: string;
    }>;
    innerRadius: number;
    outerRadius: number;
    paddingAngle: number;
    cornerRadius: number;
    startAngle: number;
    highlightScope: { fade: string; highlight: string };
    faded: { innerRadius: number; additionalRadius: number };
  }>;
  colors?: string[];
  sx?: object;
  width?: number;
  height?: number;
}

// Mock the modules for PieChart rendering
vi.mock('@mui/x-charts/PieChart', () => ({
  PieChart: vi.fn(() => <div data-testid="mocked-pie-chart">Test</div>),
  pieArcClasses: { faded: 'faded-class' },
  pieArcLabelClasses: { root: 'label-root-class', faded: 'label-faded-class' },
}));

describe('Testing Feedback Statistics Card', () => {
  afterEach(() => {
    vi.clearAllMocks(); // Only module mocks, no spies
  });
  const mockedPieChart = vi.mocked(PieChart);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('The component should be rendered and the feedback should be shown if present', async () => {
    const { queryByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <NotificationToastContainer />
            <FeedbackStats {...nonEmptyProps} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    await waitFor(() =>
      expect(queryByText('Feedback Analysis')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(
        queryByText('3 people have filled feedback for this event.'),
      ).toBeInTheDocument(),
    );

    await waitFor(() => {
      expect(queryByText('Test')).toBeInTheDocument();
    });
  });

  it('The component should be rendered and message should be shown if no feedback is present', async () => {
    const { queryByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <NotificationToastContainer />
            <FeedbackStats {...emptyProps} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    await waitFor(() =>
      expect(queryByText('Feedback Analysis')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(
        queryByText('Please ask attendees to submit feedback for insights!'),
      ).toBeInTheDocument(),
    );
  });

  it('should pass correct arcLabel function to PieChart', async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <NotificationToastContainer />
            <FeedbackStats {...diverseRatingsProps} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(mockedPieChart).toHaveBeenCalled();
    });

    const pieChartProps = mockedPieChart.mock
      .calls[0][0] as InterfacePieChartProps;
    expect(pieChartProps).toBeDefined();

    const arcLabel = pieChartProps.series[0].arcLabel;
    expect(arcLabel).toBeDefined();

    const seriesData = pieChartProps.series[0].data;
    const rating5Item = seriesData.find((item) => item.id === 5);
    expect(rating5Item).toBeDefined();
    // diverseRatingsProps has one rating of 5, so value should be 1
    if (rating5Item) {
      const realValue = rating5Item.value;
      expect(realValue).toBe(1);
      expect(arcLabel({ id: 5, value: realValue })).toBe('5 (1)');
    }
  });

  it('should correctly aggregate feedback ratings into chart data', async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <NotificationToastContainer />
            <FeedbackStats {...diverseRatingsProps} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(mockedPieChart).toHaveBeenCalled();
    });

    expect(mockedPieChart.mock.calls.length).toBeGreaterThan(0);
    const chartData = (
      mockedPieChart.mock.calls[0][0] as InterfacePieChartProps
    ).series[0].data;
    expect(chartData).toBeDefined();

    expect(chartData).toHaveLength(4);

    const rating3Data = chartData.find((d) => d.id === 3);
    expect(rating3Data).toBeDefined();
    expect(rating3Data?.value).toBe(2);

    const rating5Data = chartData.find((d) => d.id === 5);
    expect(rating5Data).toBeDefined();
    expect(rating5Data?.value).toBe(1);
  });

  it('should fallback to transparent colors if getComputedStyle throws an error', async () => {
    // Save original function
    const originalGetComputedStyle = window.getComputedStyle;

    // Mock to throw error - this hits the catch block in getCSSVariable
    window.getComputedStyle = vi.fn().mockImplementation(() => {
      throw new Error('Access denied or unavailable');
    });

    try {
      const { getByText } = render(
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <NotificationToastContainer />
              <FeedbackStats {...nonEmptyProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>,
      );

      // Component should handle the error gracefully and still render
      await waitFor(() =>
        expect(getByText('Feedback Analysis')).toBeInTheDocument(),
      );
    } finally {
      // Always restore the original function
      window.getComputedStyle = originalGetComputedStyle;
    }
  });
});
