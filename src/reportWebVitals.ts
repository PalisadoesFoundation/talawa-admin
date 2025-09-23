import type { MetricType } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: (metric: MetricType) => void): void => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry, { reportAllChanges: true });
      onFCP(onPerfEntry);
      onINP(onPerfEntry, { reportAllChanges: true });
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
