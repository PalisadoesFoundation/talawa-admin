import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import EventHeader from './EventHeader';
import { ViewType } from '../../screens/OrganizationEvents/OrganizationEvents';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { act } from 'react-dom/test-utils'; // Import act for async testing

describe('EventHeader Component', () => {
  const viewType = ViewType.MONTH;
  const handleChangeView = jest.fn();
  const showInviteModal = jest.fn();

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
      fireEvent.click(getByTestId('events'));
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
