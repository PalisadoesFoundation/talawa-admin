[Admin Docs](/)

***

# Function: default()

> **default**(`onPerfEntry`?): `void`

Defined in: [src/reportWebVitals.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/reportWebVitals.ts#L41)

Reports Core Web Vitals metrics to a callback function.

This function dynamically imports the web-vitals library to avoid increasing
the bundle size for users who don't need performance monitoring. It measures
the following Core Web Vitals:

- **CLS** (Cumulative Layout Shift): Measures visual stability
- **FCP** (First Contentful Paint): Measures loading performance
- **LCP** (Largest Contentful Paint): Measures loading performance
- **TTFB** (Time to First Byte): Measures server responsiveness
- **INP** (Interaction to Next Paint): Measures interaction responsiveness (new in v5.x)

## Parameters

### onPerfEntry?

(`metric`) => `void`

Optional callback function to handle metric data

## Returns

`void`

void

## Example

```typescript
import reportWebVitals from './reportWebVitals';

// Report to console
reportWebVitals(console.log);

// Report to analytics service
reportWebVitals((metric) => {
  analytics.track('Web Vitals', metric);
});
```
