/**
 * Toast Test Component
 * Simple component to test all toast functionality
 * Add this to a route to test the toast system
 */

import React from 'react';
import { useToast, ToastType, ToastPosition } from 'components/Toast';
import styles from './ToastTest.module.css';

export const ToastTest: React.FC = () => {
  const toast = useToast();

  const testBasicToasts = (): void => {
    toast.showSuccess('Success! Operation completed.');
    setTimeout(() => toast.showError('Error! Something went wrong.'), 500);
    setTimeout(() => toast.showWarning('Warning! Please be careful.'), 1000);
    setTimeout(() => toast.showInfo('Info: Here is some information.'), 1500);
  };

  const testLoadingToast = (): void => {
    const id = toast.showLoading('Processing your request...');

    setTimeout(() => {
      toast.updateToast(id, 'Request completed successfully!', {
        type: ToastType.SUCCESS,
        duration: 3000,
      });
    }, 3000);
  };

  const testToastWithActions = (): void => {
    toast.showError('Upload failed', {
      duration: false,
      actions: [
        {
          label: 'Retry',
          onClick: () => {
            toast.showInfo('Retrying upload...');
          },
        },
        {
          label: 'Cancel',
          onClick: () => {
            toast.showInfo('Upload cancelled');
          },
        },
      ],
    });
  };

  const testUndoAction = (): void => {
    toast.showSuccess('Item deleted', {
      duration: 7000,
      actions: [
        {
          label: 'Undo',
          onClick: () => {
            toast.showInfo('Item restored!');
          },
        },
      ],
    });
  };

  const testPositions = (): void => {
    toast.showInfo('Top Left', { position: ToastPosition.TOP_LEFT });
    setTimeout(
      () =>
        toast.showInfo('Top Center', { position: ToastPosition.TOP_CENTER }),
      200,
    );
    setTimeout(
      () => toast.showInfo('Top Right', { position: ToastPosition.TOP_RIGHT }),
      400,
    );
    setTimeout(
      () =>
        toast.showInfo('Bottom Left', { position: ToastPosition.BOTTOM_LEFT }),
      600,
    );
    setTimeout(
      () =>
        toast.showInfo('Bottom Center', {
          position: ToastPosition.BOTTOM_CENTER,
        }),
      800,
    );
    setTimeout(
      () =>
        toast.showInfo('Bottom Right', {
          position: ToastPosition.BOTTOM_RIGHT,
        }),
      1000,
    );
  };

  const testCustomDuration = (): void => {
    toast.showInfo('Quick toast (2s)', { duration: 2000 });
    setTimeout(
      () => toast.showWarning('Normal toast (5s)', { duration: 5000 }),
      300,
    );
    setTimeout(
      () =>
        toast.showError('Persistent toast (no auto-close)', {
          duration: false,
        }),
      600,
    );
  };

  return (
    <div className={styles.container}>
      <h1>🔔 Toast Notification System Test</h1>
      <p>Click the buttons below to test different toast notifications</p>

      <div className={styles.section}>
        <h2>Basic Toasts</h2>
        <button
          type="button"
          onClick={testBasicToasts}
          className={styles.button}
        >
          Test All Basic Types
        </button>
      </div>

      <div className={styles.section}>
        <h2>Individual Toasts</h2>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => toast.showSuccess('Success!')}
            className={`${styles.button} ${styles.success}`}
          >
            Success
          </button>
          <button
            type="button"
            onClick={() => toast.showError('Error!')}
            className={`${styles.button} ${styles.error}`}
          >
            Error
          </button>
          <button
            type="button"
            onClick={() => toast.showWarning('Warning!')}
            className={`${styles.button} ${styles.warning}`}
          >
            Warning
          </button>
          <button
            type="button"
            onClick={() => toast.showInfo('Info!')}
            className={`${styles.button} ${styles.info}`}
          >
            Info
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Loading State</h2>
        <button
          type="button"
          onClick={testLoadingToast}
          className={styles.button}
        >
          Test Loading Toast
        </button>
      </div>

      <div className={styles.section}>
        <h2>Action Buttons</h2>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={testToastWithActions}
            className={styles.button}
          >
            Error with Retry/Cancel
          </button>
          <button
            type="button"
            onClick={testUndoAction}
            className={styles.button}
          >
            Delete with Undo
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Positions</h2>
        <button type="button" onClick={testPositions} className={styles.button}>
          Test All Positions
        </button>
      </div>

      <div className={styles.section}>
        <h2>Custom Duration</h2>
        <button
          type="button"
          onClick={testCustomDuration}
          className={styles.button}
        >
          Test Different Durations
        </button>
      </div>

      <div className={styles.section}>
        <h2>Utilities</h2>
        <button
          type="button"
          onClick={() => toast.dismissAll()}
          className={`${styles.button} ${styles.danger}`}
        >
          Dismiss All Toasts
        </button>
      </div>

      <div className={styles.infoBox}>
        <h3>✅ Features Tested:</h3>
        <ul>
          <li>✓ Success, Error, Warning, Info, Loading toasts</li>
          <li>✓ Action buttons (Retry, Cancel, Undo)</li>
          <li>✓ Loading state with updates</li>
          <li>✓ All 6 position options</li>
          <li>✓ Custom durations</li>
          <li>✓ Auto-dismiss and manual close</li>
          <li>✓ Toast stacking</li>
          <li>✓ Dismiss all functionality</li>
        </ul>
      </div>
    </div>
  );
};

export default ToastTest;
