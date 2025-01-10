import React, { act } from 'react'; // Import act for async testing
import { render, fireEvent } from '@testing-library/react';
import EventHeader from './EventHeader';
import { ViewType } from '../../screens/OrganizationEvents/OrganizationEvents';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { vi } from 'vitest';

describe('EventHeader Component', () => {
  const viewType = ViewType.MONTH;

  /**
   * Mock function to handle view type changes.
   */
  const handleChangeView = vi.fn();

  /**
   * Mock function to handle the display of the invite modal.
   */
  const showInviteModal = vi.fn();

  it('renders correctly', () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={viewType}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    expect(getByTestId('searchEvent')).toBeInTheDocument();
    expect(getByTestId('createEventModalBtn')).toBeInTheDocument();
  });

  it('calls handleChangeView with selected view type', async () => {
    // Add async keyword
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={viewType}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    fireEvent.click(getByTestId('selectViewType'));

    await act(async () => {
      fireEvent.click(getByTestId('selectDay'));
    });

    // Expect handleChangeView to be called with the new view type
    expect(handleChangeView).toHaveBeenCalledTimes(1);
  });
  it('calls handleChangeView with selected event type', async () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={viewType}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    fireEvent.click(getByTestId('eventType'));

    await act(async () => {
      fireEvent.click(getByTestId('Events'));
    });

    expect(handleChangeView).toHaveBeenCalledTimes(1);
  });

  it('calls showInviteModal when create event button is clicked', () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={viewType}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    fireEvent.click(getByTestId('createEventModalBtn'));
    expect(showInviteModal).toHaveBeenCalled();
  });
  it('updates the input value when changed', () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={viewType}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    const input = getByTestId('searchEvent') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test event' } });

    expect(input.value).toBe('test event');
  });
});
