import type { Meta, StoryObj } from '@storybook/react';
import { CreateModal } from './CreateModal';

// Demo content for stories - not user-facing, only for Storybook documentation
// i18n-ignore-next-line
const DEMO_LABELS = {
  name: 'Name',
  description: 'Description',
  eventName: 'Event Name',
  eventDate: 'Event Date',
  location: 'Location',
  category: 'Category',
  selectCategory: 'Select category',
  meeting: 'Meeting',
  workshop: 'Workshop',
  socialEvent: 'Social Event',
  enterName: 'Enter name',
  enterDescription: 'Enter description',
  enterEventName: 'Enter event name',
  enterLocation: 'Enter location',
};

const meta: Meta<typeof CreateModal> = {
  title: 'Shared Components/CRUDModalTemplate/CreateModal',
  component: CreateModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A modal template for creating new entities. Provides a standardized layout with form submission handling, loading states, and auto-focus on the first input.',
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
    onSubmit: {
      description: 'Callback function when the form is submitted',
      action: 'submitted',
    },
    loading: {
      description: 'Shows a loading spinner on the submit button when true',
      control: 'boolean',
    },
    submitDisabled: {
      description: 'Disables the submit button when true',
      control: 'boolean',
    },
    children: {
      description: 'Form fields to render inside the modal body',
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof CreateModal>;

/**
 * Basic usage of CreateModal with a simple form
 */
export const BasicUsage: Story = {
  args: {
    title: 'Create New Item',
    loading: false,
    submitDisabled: false,
    children: (
      <>
        <div className="mb-3">
          <label htmlFor="basic-name-input" className="form-label">
            {DEMO_LABELS.name}
          </label>
          <input
            id="basic-name-input"
            type="text"
            className="form-control"
            placeholder={DEMO_LABELS.enterName}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="basic-description-textarea" className="form-label">
            {DEMO_LABELS.description}
          </label>
          <textarea
            id="basic-description-textarea"
            className="form-control"
            rows={3}
            placeholder={DEMO_LABELS.enterDescription}
          />
        </div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A basic CreateModal with text input fields for creating a new item.',
      },
    },
  },
};

/**
 * CreateModal in loading state during form submission
 */
export const LoadingState: Story = {
  args: {
    title: 'Create New Item',
    loading: true,
    submitDisabled: false,
    children: (
      <>
        <div className="mb-3">
          <label htmlFor="loading-name-input" className="form-label">
            {DEMO_LABELS.name}
          </label>
          <input
            id="loading-name-input"
            type="text"
            className="form-control"
            placeholder={DEMO_LABELS.enterName}
            value="Sample Item"
            readOnly
          />
        </div>
        <div className="mb-3">
          <label htmlFor="loading-description-textarea" className="form-label">
            {DEMO_LABELS.description}
          </label>
          <textarea
            id="loading-description-textarea"
            className="form-control"
            rows={3}
            value="This is a sample description"
            readOnly
          />
        </div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'CreateModal showing the loading state when form submission is in progress.',
      },
    },
  },
};

/**
 * CreateModal with submit button disabled
 */
export const SubmitDisabled: Story = {
  args: {
    title: 'Create New Item',
    loading: false,
    submitDisabled: true,
    children: (
      <>
        <div className="mb-3">
          <label htmlFor="disabled-name-input" className="form-label">
            {DEMO_LABELS.name}
          </label>
          <input
            id="disabled-name-input"
            type="text"
            className="form-control"
            placeholder={DEMO_LABELS.enterName}
          />
        </div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'CreateModal with the submit button disabled, typically used when form validation fails.',
      },
    },
  },
};

/**
 * CreateModal with multiple form fields
 */
export const ComplexForm: Story = {
  args: {
    title: 'Create New Event',
    loading: false,
    submitDisabled: false,
    children: (
      <>
        <div className="mb-3">
          <label htmlFor="complex-event-name-input" className="form-label">
            {DEMO_LABELS.eventName}
          </label>
          <input
            id="complex-event-name-input"
            type="text"
            className="form-control"
            placeholder={DEMO_LABELS.enterEventName}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="complex-event-date-input" className="form-label">
            {DEMO_LABELS.eventDate}
          </label>
          <input
            id="complex-event-date-input"
            type="date"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="complex-location-input" className="form-label">
            {DEMO_LABELS.location}
          </label>
          <input
            id="complex-location-input"
            type="text"
            className="form-control"
            placeholder={DEMO_LABELS.enterLocation}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="complex-category-select" className="form-label">
            {DEMO_LABELS.category}
          </label>
          <select id="complex-category-select" className="form-select">
            <option value="">{DEMO_LABELS.selectCategory}</option>
            <option value="meeting">{DEMO_LABELS.meeting}</option>
            <option value="workshop">{DEMO_LABELS.workshop}</option>
            <option value="social">{DEMO_LABELS.socialEvent}</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="complex-description-textarea" className="form-label">
            {DEMO_LABELS.description}
          </label>
          <textarea
            id="complex-description-textarea"
            className="form-control"
            rows={3}
            placeholder={DEMO_LABELS.enterDescription}
          />
        </div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'CreateModal with a more complex form containing multiple input types including text, date, select, and textarea.',
      },
    },
  },
};
