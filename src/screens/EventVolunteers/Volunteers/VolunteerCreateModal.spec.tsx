import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18n from 'utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from './Volunteers.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { InterfaceVolunteerCreateModal } from './VolunteerCreateModal';
import VolunteerCreateModal from './VolunteerCreateModal';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

/**
 * Mock implementation of the `react-toastify` module.
 * Mocks the `toast` object with `success` and `error` methods to allow testing
 * without triggering actual toast notifications.
 */

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
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
    <MockedProvider link={link} addTypename={false}>
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
  it('VolunteerCreateModal -> Create', async () => {
    renderCreateModal(link1, itemProps[0]);
    expect(screen.getAllByText(t.addVolunteer)).toHaveLength(2);

    // Select Volunteers
    const membersSelect = await screen.findByTestId('membersSelect');
    expect(membersSelect).toBeInTheDocument();
    const volunteerInputField = within(membersSelect).getByRole('combobox');
    fireEvent.mouseDown(volunteerInputField);

    const volunteerOption = await screen.findByText('John Doe');
    expect(volunteerOption).toBeInTheDocument();
    fireEvent.click(volunteerOption);

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.volunteerAdded);
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
    fireEvent.mouseDown(volunteerInputField);

    const volunteerOption = await screen.findByText('John Doe');
    expect(volunteerOption).toBeInTheDocument();
    fireEvent.click(volunteerOption);

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
