import React from 'react';
import { NotificationToast } from '../../src/shared-components/NotificationToast/NotificationToast';
import Button from '../../src/shared-components/Button/Button.tsx';

// Single component containing all violations (JSX text, attrs, toasts)
export function ViolationsFixture() {
  React.useEffect(() => {
    NotificationToast.error('Something went wrong');
    NotificationToast.success('Operation completed successfully');
    NotificationToast.warning('Please check your input');
    NotificationToast.info('New update available');
  }, []);

  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <Button>Click Me</Button>
      <p>This is hardcoded text</p>
      <input
        placeholder="Enter your name"
        title="User Name Field"
        aria-label="Name input"
        aria-placeholder="Start typing here"
        alt="Profile picture"
      />
      <select>
        <option label="Select an option">Default</option>
      </select>
    </div>
  );
}
