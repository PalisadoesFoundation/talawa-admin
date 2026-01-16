import type { Meta, StoryObj } from '@storybook/react';
import { EditModal } from './EditModal';

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
  makePublic: 'Make this event public',
  loading: 'Loading...',
};

const meta: Meta<typeof EditModal> = {
  title: 'Shared Components/CRUDModalTemplate/EditModal',
  component: EditModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A modal template for editing existing entities. Supports loading states for both data fetching and form submission, with auto-focus on the first input.',
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
    loadingData: {
      description: 'Shows a full modal loading state when fetching entity data',
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

type Story = StoryObj<typeof EditModal>;

/**
 * Basic usage of EditModal with pre-populated form fields
 */
export const BasicUsage: Story = {
  args: {
    title: 'Edit Item',
    loading: false,
    loadingData: false,
    submitDisabled: false,
    children: (
      <>
        <div className="mb-3">
          <label className="form-label">{DEMO_LABELS.name}</label>
          <input
            type="text"
            className="form-control"
            defaultValue="Existing Item Name"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{DEMO_LABELS.description}</label>
          <textarea
            className="form-control"
            rows={3}
            defaultValue="This is the existing description of the item."
          />
        </div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A basic EditModal with pre-populated form fields for editing an existing item.',
      },
    },
  },
};

/**
 * EditModal showing loading state while fetching entity data
 */
export const LoadingData: Story = {
  args: {
    title: 'Edit Item',
    loading: false,
    loadingData: true,
    submitDisabled: false,
    children: (
      <>
        <div className="mb-3">
          <label className="form-label">{DEMO_LABELS.name}</label>
          <input
            type="text"
            className="form-control"
            placeholder={DEMO_LABELS.loading}
          />
        </div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'EditModal showing the loading state when fetching entity data from the server.',
      },
    },
  },
};

/**
 * EditModal in loading state during form submission
 */
export const SubmittingState: Story = {
  args: {
    title: 'Edit Item',
    loading: true,
    loadingData: false,
    submitDisabled: false,
    children: (
      <>
        <div className="mb-3">
          <label className="form-label">{DEMO_LABELS.name}</label>
          <input
            type="text"
            className="form-control"
            defaultValue="Updated Item Name"
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{DEMO_LABELS.description}</label>
          <textarea
            className="form-control"
            rows={3}
            defaultValue="Updated description"
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
          'EditModal showing the loading state when form submission is in progress.',
      },
    },
  },
};

/**
 * EditModal with submit button disabled
 */
export const SubmitDisabled: Story = {
  args: {
    title: 'Edit Item',
    loading: false,
    loadingData: false,
    submitDisabled: true,
    children: (
      <>
        <div className="mb-3">
          <label className="form-label">{DEMO_LABELS.name}</label>
          <input
            type="text"
            className="form-control"
            defaultValue="Existing Item Name"
          />
        </div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'EditModal with the submit button disabled, typically used when no changes have been made or validation fails.',
      },
    },
  },
};

/**
 * EditModal with a complex form
 */
export const ComplexForm: Story = {
  args: {
    title: 'Edit Event',
    loading: false,
    loadingData: false,
    submitDisabled: false,
    children: (
      <>
        <div className="mb-3">
          <label className="form-label">{DEMO_LABELS.eventName}</label>
          <input
            type="text"
            className="form-control"
            defaultValue="Annual Conference 2024"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{DEMO_LABELS.eventDate}</label>
          <input
            type="date"
            className="form-control"
            defaultValue="2024-06-15"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{DEMO_LABELS.location}</label>
          <input
            type="text"
            className="form-control"
            defaultValue="Convention Center, Hall A"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{DEMO_LABELS.category}</label>
          <select className="form-select" defaultValue="workshop">
            <option value="">{DEMO_LABELS.selectCategory}</option>
            <option value="meeting">{DEMO_LABELS.meeting}</option>
            <option value="workshop">{DEMO_LABELS.workshop}</option>
            <option value="social">{DEMO_LABELS.socialEvent}</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">{DEMO_LABELS.description}</label>
          <textarea
            className="form-control"
            rows={3}
            defaultValue="Join us for our annual conference featuring workshops, keynote speakers, and networking opportunities."
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="publicEvent"
            defaultChecked
          />
          <label className="form-check-label" htmlFor="publicEvent">
            {DEMO_LABELS.makePublic}
          </label>
        </div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'EditModal with a complex form containing multiple input types including text, date, select, textarea, and checkbox.',
      },
    },
  },
};
