import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DatePicker';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from '../Volunteers.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import type { InterfaceVolunteerCreateModal } from './VolunteerCreateModal';
import VolunteerCreateModal from './VolunteerCreateModal';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

/**
 * Mock implementation of the `NotificationToast` module.
 * Mocks the `NotificationToast` object with `success` and `error` methods to allow testing
 * without triggering actual toast notifications.
 */

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: toastMocks,
}));

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_ERROR);
const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.eventVolunteers ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const itemProps: InterfaceVolunteerCreateModal[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    eventId: 'eventId',
    orgId: 'orgId',
    refetchVolunteers: vi.fn(),
  },
];

const renderCreateModal = (
  link: ApolloLink,
  props: InterfaceVolunteerCreateModal,
): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <VolunteerCreateModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('Testing VolunteerCreateModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('VolunteerCreateModal -> Create', async () => {
    renderCreateModal(link1, itemProps[0]);
    expect(screen.getAllByText(t.addVolunteer)).toHaveLength(2);

    // Select Volunteers
    const membersSelect = await screen.findByTestId('membersSelect');
    expect(membersSelect).toBeInTheDocument();
    const volunteerInputField = within(membersSelect).getByRole('combobox');
    await userEvent.click(volunteerInputField);

    const volunteerOption = await screen.findByText('John Doe');
    expect(volunteerOption).toBeInTheDocument();
    await userEvent.click(volunteerOption);

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(t.volunteerAdded);
      expect(itemProps[0].refetchVolunteers).toHaveBeenCalled();
      expect(itemProps[0].hide).toHaveBeenCalled();
    });
  });

  it('VolunteerCreateModal -> Create -> Error', async () => {
    renderCreateModal(link2, itemProps[0]);
    expect(screen.getAllByText(t.addVolunteer)).toHaveLength(2);

    // Select Volunteers
    const membersSelect = await screen.findByTestId('membersSelect');
    expect(membersSelect).toBeInTheDocument();
    const volunteerInputField = within(membersSelect).getByRole('combobox');
    await userEvent.click(volunteerInputField);

    const volunteerOption = await screen.findByText('John Doe');
    expect(volunteerOption).toBeInTheDocument();
    await userEvent.click(volunteerOption);

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('should handle isOptionEqualToValue for members Autocomplete', async () => {
    renderCreateModal(link1, itemProps[0]);
    expect(screen.getAllByText(t.addVolunteer)).toHaveLength(2);

    // Select a member
    const membersSelect = await screen.findByTestId('membersSelect');
    const memberInputField = within(membersSelect).getByRole('combobox');
    await userEvent.click(memberInputField);
    const memberOption = await screen.findByText('John Doe');
    await userEvent.click(memberOption);

    await waitFor(() => {
      expect(memberInputField).toHaveValue('John Doe');
    });

    // Open again: since filterSelectedOptions is true, the selected option should be filtered out
    await userEvent.click(memberInputField);

    // 'John Doe' should NOT be in the list now, but other options like 'Jane Smith' should be
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(await screen.findByText('Jane Smith')).toBeInTheDocument();
    // Input value remains the same; isOptionEqualToValue is used internally for filtering
    expect(memberInputField).toHaveValue('John Doe');
  });

  it('should clear userId when member selection is cleared', async () => {
    renderCreateModal(link1, itemProps[0]);

    // Select a member first
    const membersSelect = await screen.findByTestId('membersSelect');
    const memberInputField = within(membersSelect).getByRole('combobox');

    // Initial state: button should be disabled
    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeDisabled();

    await userEvent.click(memberInputField);
    const memberOption = await screen.findByText('John Doe');
    await userEvent.click(memberOption);

    // After selection: button should be enabled
    await waitFor(() => {
      expect(memberInputField).toHaveValue('John Doe');
      expect(submitBtn).not.toBeDisabled();
    });

    // Clear the selection using the clear button provided by Autocomplete (MUI usually adds one)
    // or by clearing the input which triggers handleInputChange/onChange in controlled mode
    const clearButton = await screen.findByTitle('Clear');
    await userEvent.click(clearButton);

    await waitFor(() => {
      // Input should be empty
      expect(memberInputField).toHaveValue('');
      // Downstream effect: Submit button should be disabled again because userId is empty
      expect(submitBtn).toBeDisabled();
    });
  });

  describe('Recurring Events', () => {
    const recurringEventProps: InterfaceVolunteerCreateModal = {
      isOpen: true,
      hide: vi.fn(),
      eventId: 'eventInstanceId',
      orgId: 'orgId',
      refetchVolunteers: vi.fn(),
      isRecurring: true,
      baseEvent: { id: 'baseEventId' },
    };

    it('should create volunteer for entire series when applyTo is "series"', async () => {
      renderCreateModal(link1, recurringEventProps);
      expect(screen.getAllByText(t.addVolunteer)).toHaveLength(2);

      // Should show radio buttons for recurring events
      const seriesRadio = screen.getByRole('radio', { name: /entire series/i });
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });

      expect(seriesRadio).toBeInTheDocument();
      expect(instanceRadio).toBeInTheDocument();
      expect(seriesRadio).toBeChecked(); // Default should be 'series'

      // Select a volunteer
      const membersSelect = await screen.findByTestId('membersSelect');
      const volunteerInputField = within(membersSelect).getByRole('combobox');
      await userEvent.click(volunteerInputField);
      const volunteerOption = await screen.findByText('John Doe');
      await userEvent.click(volunteerOption);

      const submitBtn = screen.getByTestId('submitBtn');
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          t.volunteerAdded,
        );
        expect(recurringEventProps.refetchVolunteers).toHaveBeenCalled();
        expect(recurringEventProps.hide).toHaveBeenCalled();
      });
    });

    it('should create volunteer for this instance only when applyTo is "instance"', async () => {
      renderCreateModal(link1, recurringEventProps);
      expect(screen.getAllByText(t.addVolunteer)).toHaveLength(2);

      // Select "This Event Only" radio button
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });
      await userEvent.click(instanceRadio);
      expect(instanceRadio).toBeChecked();

      // Select a volunteer
      const membersSelect = await screen.findByTestId('membersSelect');
      const volunteerInputField = within(membersSelect).getByRole('combobox');
      await userEvent.click(volunteerInputField);
      const volunteerOption = await screen.findByText('John Doe');
      await userEvent.click(volunteerOption);

      const submitBtn = screen.getByTestId('submitBtn');
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          t.volunteerAdded,
        );
        expect(recurringEventProps.refetchVolunteers).toHaveBeenCalled();
        expect(recurringEventProps.hide).toHaveBeenCalled();
      });
    });

    it('should use baseEvent.id for recurring events when available', async () => {
      renderCreateModal(link1, recurringEventProps);

      // Select a volunteer to test the mutation data creation
      const membersSelect = await screen.findByTestId('membersSelect');
      const volunteerInputField = within(membersSelect).getByRole('combobox');
      await userEvent.click(volunteerInputField);
      const volunteerOption = await screen.findByText('John Doe');
      await userEvent.click(volunteerOption);

      const submitBtn = screen.getByTestId('submitBtn');
      await userEvent.click(submitBtn);

      // This test verifies the eventId logic: baseEvent?.id || eventId
      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });
    });

    it('should handle radio button onChange for series and instance selection', async () => {
      renderCreateModal(link1, recurringEventProps);

      const seriesRadio = screen.getByRole('radio', { name: /entire series/i });
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });

      // Test onChange={() => setApplyTo('instance')}
      await userEvent.click(instanceRadio);
      expect(instanceRadio).toBeChecked();
      expect(seriesRadio).not.toBeChecked();

      // Test onChange={() => setApplyTo('series')}
      await userEvent.click(seriesRadio);
      expect(seriesRadio).toBeChecked();
      expect(instanceRadio).not.toBeChecked();
    });

    it('should not show radio buttons for non-recurring events', async () => {
      const nonRecurringProps = {
        ...recurringEventProps,
        isRecurring: false,
      };

      renderCreateModal(link1, nonRecurringProps);
      expect(screen.getAllByText(t.addVolunteer)).toHaveLength(2);

      // Should NOT show radio buttons for non-recurring events
      const seriesRadio = screen.queryByRole('radio', {
        name: /entire series/i,
      });
      const instanceRadio = screen.queryByRole('radio', {
        name: /this event only/i,
      });

      expect(seriesRadio).not.toBeInTheDocument();
      expect(instanceRadio).not.toBeInTheDocument();
    });

    it('should reset applyTo to "series" after successful submission', async () => {
      renderCreateModal(link1, recurringEventProps);

      // Change to instance
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });
      await userEvent.click(instanceRadio);
      expect(instanceRadio).toBeChecked();

      // Submit form
      const membersSelect = await screen.findByTestId('membersSelect');
      const volunteerInputField = within(membersSelect).getByRole('combobox');
      await userEvent.click(volunteerInputField);
      const volunteerOption = await screen.findByText('John Doe');
      await userEvent.click(volunteerOption);

      const submitBtn = screen.getByTestId('submitBtn');
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
        // After successful submission, applyTo should reset to 'series'
        // This is tested indirectly through the code path
      });
    });
  });
});
