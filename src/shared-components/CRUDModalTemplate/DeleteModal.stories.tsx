import type { Meta, StoryObj } from '@storybook/react';
import { DeleteModal } from './DeleteModal';

// Demo content for stories - not user-facing, only for Storybook documentation
// i18n-ignore-next-line
const DEMO_TEXT = {
  recurringPrompt: 'This is a recurring event. How would you like to proceed?',
  deleteOnlyThis: 'Delete only this occurrence',
  deleteAll: 'Delete all occurrences',
  deleteFuture: 'Delete this and all future occurrences',
};

const meta: Meta<typeof DeleteModal> = {
  title: 'Shared Components/CRUDModalTemplate/DeleteModal',
  component: DeleteModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A modal template for deleting entities. Displays a confirmation message with the entity name and supports optional warning messages and recurring event handling.',
      },
    },
  },
  argTypes: {
    title: {
      description: 'The title displayed in the modal header',
      control: 'text',
    },
    onClose: {
      description: 'Callback function when the modal is closed',
      action: 'closed',
    },
    onDelete: {
      description: 'Callback function when the delete action is confirmed',
      action: 'deleted',
    },
    entityName: {
      description:
        'The name of the entity being deleted, displayed in the confirmation message',
      control: 'text',
    },
    showWarning: {
      description:
        'Shows a warning alert about the irreversible nature of the action',
      control: 'boolean',
    },
    recurringEventContent: {
      description:
        'Optional content for handling recurring event deletion options',
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof DeleteModal>;

/**
 * Basic usage of DeleteModal with entity name
 */
export const BasicUsage: Story = {
  args: {
    title: 'Delete Item',
    entityName: 'Sample Item',
    showWarning: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A basic DeleteModal showing the confirmation message with the entity name.',
      },
    },
  },
};

/**
 * DeleteModal with warning message
 */
export const WithWarning: Story = {
  args: {
    title: 'Delete Event',
    entityName: 'Annual Conference 2024',
    showWarning: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'DeleteModal with a warning alert indicating that the action cannot be undone.',
      },
    },
  },
};

/**
 * DeleteModal for recurring events
 */
export const RecurringEvent: Story = {
  args: {
    title: 'Delete Recurring Event',
    entityName: 'Weekly Team Meeting',
    showWarning: true,
    recurringEventContent: (
      <fieldset className="mt-3 border-0 p-0">
        <legend className="mb-2 fs-6 fw-normal">
          {DEMO_TEXT.recurringPrompt}
        </legend>
        <div className="d-flex flex-column gap-2">
          <div className="d-flex align-items-center gap-2">
            <input
              type="radio"
              name="deleteOption"
              id="delete-option-single"
              value="single"
              defaultChecked
            />
            <label htmlFor="delete-option-single">
              {DEMO_TEXT.deleteOnlyThis}
            </label>
          </div>
          <div className="d-flex align-items-center gap-2">
            <input
              type="radio"
              name="deleteOption"
              id="delete-option-all"
              value="all"
            />
            <label htmlFor="delete-option-all">{DEMO_TEXT.deleteAll}</label>
          </div>
          <div className="d-flex align-items-center gap-2">
            <input
              type="radio"
              name="deleteOption"
              id="delete-option-future"
              value="future"
            />
            <label htmlFor="delete-option-future">
              {DEMO_TEXT.deleteFuture}
            </label>
          </div>
        </div>
      </fieldset>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'DeleteModal with additional options for handling recurring event deletion, allowing users to choose between deleting a single occurrence or all occurrences.',
      },
    },
  },
};

/**
 * DeleteModal for user deletion
 */
export const DeleteUser: Story = {
  args: {
    title: 'Delete User',
    entityName: 'John Doe',
    showWarning: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'DeleteModal configured for user deletion with a warning about the irreversible action.',
      },
    },
  },
};

/**
 * DeleteModal for organization deletion
 */
export const DeleteOrganization: Story = {
  args: {
    title: 'Delete Organization',
    entityName: 'Tech Community Group',
    showWarning: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'DeleteModal for deleting an organization, showing a warning about the permanent nature of the action.',
      },
    },
  },
};
