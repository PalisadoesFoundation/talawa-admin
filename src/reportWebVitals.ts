import type { MetricType } from 'web-vitals';

const reportWebVitals = async (
  onPerfEntry?: (metric: MetricType) => void,
): Promise<void> => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    const { onCLS, onFCP, onLCP, onTTFB } = await import('web-vitals');
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
