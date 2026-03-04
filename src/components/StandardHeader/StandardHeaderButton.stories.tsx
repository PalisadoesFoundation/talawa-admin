import type { Meta, StoryObj } from '@storybook/react';
import StandardHeaderButton from './StandardHeaderButton';

const meta: Meta<typeof StandardHeaderButton> = {
  title: 'StandardHeader/StandardHeaderButton',
  component: StandardHeaderButton,
};

export default meta;

type Story = StoryObj<typeof StandardHeaderButton>;

export const Default: Story = {
  args: {
    children: 'Edit',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Create Event',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Add Member',
    icon: <span>⭐</span>,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Saving',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};
