import type { Meta, StoryObj } from '@storybook/react';
import { ViewModal } from './ViewModal';
import { Button } from 'shared-components/Button';

// Demo content for stories - not user-facing, only for Storybook documentation
// i18n-ignore-next-line
const DEMO_TEXT = {
  nameLabel: 'Name:',
  descriptionLabel: 'Description:',
  createdAtLabel: 'Created At:',
  eventNameLabel: 'Event Name:',
  dateLabel: 'Date:',
  locationLabel: 'Location:',
  fullNameLabel: 'Full Name:',
  emailLabel: 'Email:',
  roleLabel: 'Role:',
  memberSinceLabel: 'Member Since:',
  statusLabel: 'Status:',
  orgNameLabel: 'Organization Name:',
  membersLabel: 'Members:',
  foundedLabel: 'Founded:',
  sampleItem: 'Sample Item',
  sampleDescription:
    'This is a detailed description of the sample item with all relevant information.',
  sampleDate: 'January 15, 2024',
  loadingMessage: 'Content will appear here once loaded.',
  editEvent: 'Edit Event',
  deleteEvent: 'Delete Event',
  eventName: 'Annual Conference 2024',
  eventDate: 'June 15, 2024',
  eventLocation: 'Convention Center, Hall A',
  eventDescription:
    'Join us for our annual conference featuring workshops, keynote speakers, and networking opportunities.',
  userName: 'John Doe',
  userEmail: 'john.doe@example.com',
  userRole: 'Administrator',
  userMemberSince: 'March 10, 2023',
  userStatus: 'Active',
  viewMembers: 'View Members',
  editOrg: 'Edit Organization',
  orgName: 'Tech Community Group',
  orgDescription:
    'A community of technology enthusiasts dedicated to learning and sharing knowledge about the latest tech trends.',
  orgMembers: '1,234 members',
  orgLocation: 'San Francisco, CA',
  orgFounded: 'January 2020',
};

const meta: Meta<typeof ViewModal> = {
  title: 'Shared Components/CRUDModalTemplate/ViewModal',
  component: ViewModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A modal template for viewing entity details in read-only mode. Supports loading states for data fetching and optional custom action buttons.',
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
    loadingData: {
      description: 'Shows a loading state when fetching entity data',
      control: 'boolean',
    },
    customActions: {
      description:
        'Optional custom action buttons to display in the modal footer',
      control: false,
    },
    children: {
      description: 'Content to display inside the modal body',
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof ViewModal>;

/**
 * Basic usage of ViewModal displaying entity details
 */
export const BasicUsage: Story = {
  args: {
    title: 'View Item Details',
    loadingData: false,
    children: (
      <div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.nameLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.sampleItem}</p>
        </div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.descriptionLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.sampleDescription}</p>
        </div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.createdAtLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.sampleDate}</p>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A basic ViewModal displaying entity details in a read-only format.',
      },
    },
  },
};

/**
 * ViewModal in loading state while fetching data
 */
export const LoadingState: Story = {
  args: {
    title: 'View Item Details',
    loadingData: true,
    children: <div>{DEMO_TEXT.loadingMessage}</div>,
  },
  parameters: {
    docs: {
      description: {
        story:
          'ViewModal showing the loading state while fetching entity data from the server.',
      },
    },
  },
};

/**
 * ViewModal with custom action buttons
 */
export const WithCustomActions: Story = {
  args: {
    title: 'View Event Details',
    loadingData: false,
    customActions: (
      <>
        <Button variant="outline-primary" size="sm">
          {DEMO_TEXT.editEvent}
        </Button>
        <Button variant="outline-danger" size="sm">
          {DEMO_TEXT.deleteEvent}
        </Button>
      </>
    ),
    children: (
      <div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.eventNameLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.eventName}</p>
        </div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.dateLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.eventDate}</p>
        </div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.locationLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.eventLocation}</p>
        </div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.descriptionLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.eventDescription}</p>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'ViewModal with custom action buttons in the footer, allowing users to perform actions like editing or deleting the viewed entity.',
      },
    },
  },
};

/**
 * ViewModal displaying user profile information
 */
export const UserProfile: Story = {
  args: {
    title: 'View User Profile',
    loadingData: false,
    children: (
      <div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.fullNameLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.userName}</p>
        </div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.emailLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.userEmail}</p>
        </div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.roleLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.userRole}</p>
        </div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.memberSinceLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.userMemberSince}</p>
        </div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.statusLabel}</strong>
          <span className="badge bg-success">{DEMO_TEXT.userStatus}</span>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'ViewModal displaying user profile information with various data fields.',
      },
    },
  },
};

/**
 * ViewModal displaying organization details
 */
export const OrganizationDetails: Story = {
  args: {
    title: 'View Organization',
    loadingData: false,
    customActions: (
      <>
        <Button variant="outline-secondary" size="sm">
          {DEMO_TEXT.viewMembers}
        </Button>
        <Button variant="outline-primary" size="sm">
          {DEMO_TEXT.editOrg}
        </Button>
      </>
    ),
    children: (
      <div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.orgNameLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.orgName}</p>
        </div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.descriptionLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.orgDescription}</p>
        </div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.membersLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.orgMembers}</p>
        </div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.locationLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.orgLocation}</p>
        </div>
        <div className="mb-3">
          <strong>{DEMO_TEXT.foundedLabel}</strong>
          <p className="mb-0">{DEMO_TEXT.orgFounded}</p>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'ViewModal displaying organization details with custom action buttons for additional operations.',
      },
    },
  },
};
