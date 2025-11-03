/**
 * Toast Notification Usage Examples
 * This file demonstrates various ways to use the toast notification system
 * Copy these patterns into your components as needed
 */

import React from 'react';
import { useToast, ToastType, ToastPosition } from 'components/Toast';

/**
 * Example 1: Basic Toast Notifications
 */
export const BasicToastExample: React.FC = () => {
  const toast = useToast();

  return (
    <div>
      <h2>Basic Toast Examples</h2>

      <button
        type="button"
        onClick={() => toast.showSuccess('Operation successful!')}
      >
        Show Success
      </button>

      <button
        type="button"
        onClick={() => toast.showError('An error occurred!')}
      >
        Show Error
      </button>

      <button
        type="button"
        onClick={() => toast.showWarning('This is a warning!')}
      >
        Show Warning
      </button>

      <button
        type="button"
        onClick={() => toast.showInfo('Here is some information.')}
      >
        Show Info
      </button>
    </div>
  );
};

/**
 * Example 2: Form Submission with Loading State
 */
export const FormSubmissionExample: React.FC = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (formData: any): Promise<void> => {
    setIsLoading(true);
    const loadingId = toast.showLoading('Saving your data...');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update the loading toast to success
      toast.updateToast(loadingId, 'Data saved successfully!', {
        type: ToastType.SUCCESS,
        duration: 3000,
      });
    } catch (error) {
      // Update to error with retry option
      toast.updateToast(loadingId, 'Failed to save data', {
        type: ToastType.ERROR,
        actions: [
          {
            label: 'Retry',
            onClick: () => void handleSubmit(formData),
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleSubmit({ name: 'Test' })}
      disabled={isLoading}
    >
      {isLoading ? 'Submitting...' : 'Submit Form'}
    </button>
  );
};

/**
 * Example 3: Delete with Undo Action
 */
export const DeleteWithUndoExample: React.FC = () => {
  const toast = useToast();
  const [items, setItems] = React.useState(['Item 1', 'Item 2', 'Item 3']);

  const handleDelete = (itemName: string): void => {
    // Store the deleted item
    const deletedItem = itemName;
    const deletedIndex = items.indexOf(itemName);

    // Optimistically remove from UI
    setItems((prev) => prev.filter((item) => item !== itemName));

    // Show toast with undo option
    toast.showSuccess(`"${itemName}" deleted`, {
      duration: 7000,
      actions: [
        {
          label: 'Undo',
          onClick: () => {
            // Restore the item
            setItems((prev) => {
              const newItems = [...prev];
              newItems.splice(deletedIndex, 0, deletedItem);
              return newItems;
            });
            toast.showInfo('Item restored');
          },
        },
      ],
    });

    // Permanently delete after timeout (if not undone)
    setTimeout(() => {
      // Here you would make the API call to delete permanently
      console.log('Permanently deleted:', itemName);
    }, 7000);
  };

  return (
    <div>
      <h2>Items</h2>
      {items.map((item) => (
        <div key={item}>
          {item}
          <button type="button" onClick={() => handleDelete(item)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

/**
 * Example 4: Network Error Handling
 */
export const NetworkErrorExample: React.FC = () => {
  const toast = useToast();

  const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch('https://api.example.com/data');
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      toast.showSuccess('Data loaded successfully!');
      console.log(data);
    } catch (error) {
      // Check if it's a network error
      if (
        !navigator.onLine ||
        error instanceof TypeError ||
        (error instanceof Error && error.message === 'Failed to fetch')
      ) {
        toast.showError('No internet connection', {
          toastId: 'network-error', // Prevent duplicates
          duration: false, // Don't auto-dismiss
          actions: [
            {
              label: 'Retry',
              onClick: () => {
                toast.dismissToast('network-error');
                void fetchData();
              },
            },
          ],
        });
      } else {
        toast.showError('Failed to load data. Please try again.');
      }
    }
  };

  return (
    <button type="button" onClick={() => void fetchData()}>
      Load Data
    </button>
  );
};

/**
 * Example 5: Multiple Action Buttons
 */
export const MultipleActionsExample: React.FC = () => {
  const toast = useToast();

  const handleConflict = (): void => {
    toast.showWarning('File already exists. What would you like to do?', {
      duration: false,
      actions: [
        {
          label: 'Replace',
          onClick: () => {
            console.log('Replacing file...');
            toast.showInfo('File replaced');
          },
        },
        {
          label: 'Keep Both',
          onClick: () => {
            console.log('Keeping both files...');
            toast.showInfo('Created a copy');
          },
        },
        {
          label: 'Cancel',
          onClick: () => {
            toast.showInfo('Operation cancelled');
          },
        },
      ],
    });
  };

  return (
    <button type="button" onClick={handleConflict}>
      Upload File
    </button>
  );
};

/**
 * Example 6: Custom Positioned Toast
 */
export const CustomPositionExample: React.FC = () => {
  const toast = useToast();

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          toast.showInfo('Top Right', { position: ToastPosition.TOP_RIGHT })
        }
      >
        Top Right
      </button>

      <button
        type="button"
        onClick={() =>
          toast.showInfo('Bottom Center', {
            position: ToastPosition.BOTTOM_CENTER,
          })
        }
      >
        Bottom Center
      </button>

      <button
        type="button"
        onClick={() =>
          toast.showInfo('Top Left', { position: ToastPosition.TOP_LEFT })
        }
      >
        Top Left
      </button>
    </div>
  );
};

/**
 * Example 7: Validation Errors
 */
export const ValidationExample: React.FC = () => {
  const toast = useToast();

  const validateForm = (formData: {
    email?: string;
    password?: string;
  }): boolean => {
    const errors: string[] = [];

    if (!formData.email) errors.push('Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.push('Email is invalid');

    if (!formData.password) errors.push('Password is required');
    else if (formData.password.length < 8)
      errors.push('Password must be at least 8 characters');

    if (errors.length > 0) {
      toast.showWarning(
        <div>
          <strong>Please fix the following errors:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>,
        {
          duration: 8000,
        },
      );
      return false;
    }

    return true;
  };

  const handleSubmit = (): void => {
    const formData = { email: '', password: 'short' };
    if (validateForm(formData)) {
      toast.showSuccess('Form submitted!');
    }
  };

  return (
    <button type="button" onClick={handleSubmit}>
      Submit
    </button>
  );
};

/**
 * Example 8: Progress Updates
 */
export const ProgressUpdateExample: React.FC = () => {
  const toast = useToast();

  const uploadFiles = async (): Promise<void> => {
    const toastId = toast.showLoading('Uploading files... 0%');

    // Simulate progress updates
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (progress < 100) {
        toast.updateToast(toastId, `Uploading files... ${progress}%`, {
          type: ToastType.LOADING,
        });
      } else {
        toast.updateToast(toastId, 'Upload complete!', {
          type: ToastType.SUCCESS,
          duration: 3000,
        });
      }
    }
  };

  return (
    <button type="button" onClick={() => void uploadFiles()}>
      Upload Files
    </button>
  );
};

/**
 * Example 9: Preventing Duplicate Toasts
 */
export const NoDuplicateExample: React.FC = () => {
  const toast = useToast();
  const TOAST_ID = 'unique-notification';

  const showNotification = (): void => {
    // This will only show one toast even if clicked multiple times
    if (!toast.isActive(TOAST_ID)) {
      toast.showInfo('This notification appears only once', {
        toastId: TOAST_ID,
        duration: 5000,
      });
    }
  };

  return (
    <button type="button" onClick={showNotification}>
      Show Unique Notification
    </button>
  );
};

/**
 * Example 10: Dismiss All Toasts
 */
export const DismissAllExample: React.FC = () => {
  const toast = useToast();

  const showMultiple = (): void => {
    toast.showInfo('First notification');
    setTimeout(() => toast.showInfo('Second notification'), 100);
    setTimeout(() => toast.showInfo('Third notification'), 200);
  };

  return (
    <div>
      <button type="button" onClick={showMultiple}>
        Show Multiple Toasts
      </button>
      <button type="button" onClick={() => toast.dismissAll()}>
        Dismiss All
      </button>
    </div>
  );
};

/**
 * Example Component: Complete Real-World Example
 * Demonstrates a user profile update with comprehensive error handling
 */
export const UserProfileUpdateExample: React.FC = () => {
  const toast = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const updateProfile = async (profileData: any): Promise<void> => {
    if (isSaving) {
      toast.showWarning('Please wait for the current operation to complete');
      return;
    }

    setIsSaving(true);
    const loadingId = toast.showLoading('Updating your profile...');

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Randomly succeed or fail for demo
          Math.random() > 0.3 ? resolve(true) : reject(new Error('API Error'));
        }, 2000);
      });

      // Success
      toast.updateToast(loadingId, 'Profile updated successfully!', {
        type: ToastType.SUCCESS,
        duration: 3000,
      });
    } catch (error) {
      // Error with retry option
      toast.updateToast(
        loadingId,
        'Failed to update profile. Please try again.',
        {
          type: ToastType.ERROR,
          duration: false,
          actions: [
            {
              label: 'Retry',
              onClick: () => {
                toast.dismissToast(loadingId);
                void updateProfile(profileData);
              },
            },
            {
              label: 'Cancel',
              onClick: () => {
                toast.dismissToast(loadingId);
                toast.showInfo('Update cancelled');
              },
            },
          ],
        },
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => void updateProfile({ name: 'John Doe' })}
        disabled={isSaving}
      >
        Update Profile
      </button>
    </div>
  );
};

export default {
  BasicToastExample,
  FormSubmissionExample,
  DeleteWithUndoExample,
  NetworkErrorExample,
  MultipleActionsExample,
  CustomPositionExample,
  ValidationExample,
  ProgressUpdateExample,
  NoDuplicateExample,
  DismissAllExample,
  UserProfileUpdateExample,
};
