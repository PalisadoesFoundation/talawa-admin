import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react';
import EventHeader from './EventHeader';
import { ViewType } from 'screens/AdminPortal/OrganizationEvents/OrganizationEvents';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { vi } from 'vitest';

describe('EventHeader Component', () => {
  const viewType = ViewType.MONTH;
  let handleChangeView: ReturnType<typeof vi.fn> & (() => void) & (() => void);
  let showInviteModal: ReturnType<typeof vi.fn> & (() => void) & (() => void);

  beforeEach(() => {
    handleChangeView = vi.fn();
    showInviteModal = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restores all spies including consoleSpy
  });

  it('renders correctly with all elements', () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={viewType}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    expect(getByTestId('calendarEventHeader')).toBeInTheDocument();
    expect(getByTestId('searchEvent')).toBeInTheDocument();
    expect(getByTestId('searchButton')).toBeInTheDocument();
    expect(getByTestId('createEventModalBtn')).toBeInTheDocument();
    expect(getByTestId('selectViewType')).toBeInTheDocument();
    expect(getByTestId('eventType')).toBeInTheDocument();
  });

  it('renders with correct initial viewType', () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={ViewType.MONTH}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    expect(getByTestId('selectViewType')).toBeInTheDocument();
  });

  it('calls handleChangeView with MONTH view type', async () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={ViewType.DAY}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    fireEvent.click(getByTestId('selectViewType'));

    await act(async () => {
      fireEvent.click(getByTestId('Month View'));
    });

    expect(handleChangeView).toHaveBeenCalledWith(ViewType.MONTH);
    expect(handleChangeView).toHaveBeenCalledTimes(1);
  });

  it('calls handleChangeView with DAY view type', async () => {
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
      fireEvent.click(getByTestId('Day'));
    });

    expect(handleChangeView).toHaveBeenCalledWith(ViewType.DAY);
    expect(handleChangeView).toHaveBeenCalledTimes(1);
  });

  it('calls handleChangeView with YEAR view type', async () => {
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
      fireEvent.click(getByTestId('Year View'));
    });

    expect(handleChangeView).toHaveBeenCalledWith(ViewType.YEAR);
    expect(handleChangeView).toHaveBeenCalledTimes(1);
  });

  it('does not call handleChangeView when Events option is selected', async () => {
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

    expect(handleChangeView).not.toHaveBeenCalled();
  });

  it('does not call handleChangeView when Workshops option is selected', async () => {
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
      fireEvent.click(getByTestId('Workshops'));
    });

    expect(handleChangeView).not.toHaveBeenCalled();
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
    expect(showInviteModal).toHaveBeenCalledTimes(1);
  });

  it('calls showInviteModal multiple times when clicked repeatedly', () => {
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
    fireEvent.click(getByTestId('createEventModalBtn'));
    expect(showInviteModal).toHaveBeenCalledTimes(2);
  });

  it('updates the search input value when changed', () => {
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

  it('allows search to be performed', () => {
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
    const searchButton = getByTestId('searchButton');

    fireEvent.change(input, { target: { value: 'conference' } });
    fireEvent.click(searchButton);

    expect(input.value).toBe('conference');
  });

  it('allows search with no input', () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={viewType}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    const searchButton = getByTestId('searchButton');
    fireEvent.click(searchButton);

    expect(searchButton).toBeInTheDocument();
  });

  it('renders Create button with AddIcon and text', () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={viewType}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    const createButton = getByTestId('createEventModalBtn');
    expect(createButton).toHaveTextContent(/create/i);
  });

  it('renders with ViewType.DAY as initial viewType', () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={ViewType.DAY}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    expect(getByTestId('selectViewType')).toBeInTheDocument();
  });

  it('renders with ViewType.YEAR as initial viewType', () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={ViewType.YEAR}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    expect(getByTestId('selectViewType')).toBeInTheDocument();
  });

  it('maintains separate functionality for view type and event type dropdowns', async () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={viewType}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    // Change view type
    fireEvent.click(getByTestId('selectViewType'));
    await act(async () => {
      fireEvent.click(getByTestId('Day'));
    });

    expect(handleChangeView).toHaveBeenCalledWith(ViewType.DAY);

    // Change event type
    fireEvent.click(getByTestId('eventType'));
    await act(async () => {
      fireEvent.click(getByTestId('Events'));
    });

    expect(handleChangeView).toHaveBeenCalledTimes(1); // Only called once from view type change
  });

  it('handles rapid successive interactions correctly', async () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={viewType}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    // Rapid clicks on create button
    fireEvent.click(getByTestId('createEventModalBtn'));
    fireEvent.click(getByTestId('createEventModalBtn'));
    fireEvent.click(getByTestId('createEventModalBtn'));

    expect(showInviteModal).toHaveBeenCalledTimes(3);
  });

  it('search input accepts special characters', () => {
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
    fireEvent.change(input, { target: { value: '@#$%^&*()' } });

    expect(input.value).toBe('@#$%^&*()');
  });

  it('search input handles long strings', () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={viewType}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    const longString = 'a'.repeat(100);
    const input = getByTestId('searchEvent') as HTMLInputElement;
    fireEvent.change(input, { target: { value: longString } });

    expect(input.value).toBe(longString);
  });
});
