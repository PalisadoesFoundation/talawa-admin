import React from 'react';
import { toast } from 'react-toastify';

// Single component containing all violations (JSX text, attrs, toasts)
export function ViolationsFixture() {
  React.useEffect(() => {
    toast.error('Something went wrong');
    toast.success('Operation completed successfully');
    toast.warning('Please check your input');
    toast.info('New update available');
  }, []);

  return (
    <div>
      <h1>Welcome to Dashboard</h1>
      <button>Click Me</button>
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
