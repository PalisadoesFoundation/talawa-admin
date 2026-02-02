import React from 'react';
import { render } from '@testing-library/react';
import EventHeader from './EventHeader';
import { ViewType } from 'screens/AdminPortal/OrganizationEvents/OrganizationEvents';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('EventHeader Component', () => {
  const viewType = ViewType.MONTH;
  let handleChangeView: ReturnType<typeof vi.fn>;
  let showInviteModal: ReturnType<typeof vi.fn>;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    handleChangeView = vi.fn();
    showInviteModal = vi.fn();
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.clearAllMocks();
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
    expect(getByTestId('selectViewType-container')).toBeInTheDocument();
    expect(getByTestId('eventType-container')).toBeInTheDocument();
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

    expect(getByTestId('selectViewType-container')).toBeInTheDocument();
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

    await user.click(getByTestId('selectViewType-toggle'));

    await user.click(getByTestId('selectViewType-item-Month View'));

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

    await user.click(getByTestId('selectViewType-toggle'));

    await user.click(getByTestId('selectViewType-item-Day'));

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

    await user.click(getByTestId('selectViewType-toggle'));

    await user.click(getByTestId('selectViewType-item-Year View'));

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

    await user.click(getByTestId('eventType-toggle'));

    await user.click(getByTestId('eventType-item-Events'));

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

    await user.click(getByTestId('eventType-toggle'));

    await user.click(getByTestId('eventType-item-Workshops'));

    expect(handleChangeView).not.toHaveBeenCalled();
  });

  it('calls showInviteModal when create event button is clicked', async () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={viewType}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    await user.click(getByTestId('createEventModalBtn'));
    expect(showInviteModal).toHaveBeenCalledTimes(1);
  });

  it('calls showInviteModal multiple times when clicked repeatedly', async () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <EventHeader
          viewType={viewType}
          handleChangeView={handleChangeView}
          showInviteModal={showInviteModal}
        />
      </I18nextProvider>,
    );

    await user.click(getByTestId('createEventModalBtn'));
    await user.click(getByTestId('createEventModalBtn'));
    expect(showInviteModal).toHaveBeenCalledTimes(2);
  });

  it('updates the search input value when changed', async () => {
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
    await user.clear(input);
    await user.type(input, 'test event');

    expect(input.value).toBe('test event');
  });

  it('allows search to be performed', async () => {
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

    await user.clear(input);
    await user.type(input, 'conference');
    await user.click(searchButton);

    expect(input.value).toBe('conference');
  });

  it('allows search with no input', async () => {
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
    await user.click(searchButton);

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

    expect(getByTestId('selectViewType-container')).toBeInTheDocument();
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

    expect(getByTestId('selectViewType-container')).toBeInTheDocument();
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
    await user.click(getByTestId('selectViewType-toggle'));
    await user.click(getByTestId('selectViewType-item-Day'));

    expect(handleChangeView).toHaveBeenCalledWith(ViewType.DAY);

    // Change event type
    await user.click(getByTestId('eventType-toggle'));
    await user.click(getByTestId('eventType-item-Events'));

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
    await user.click(getByTestId('createEventModalBtn'));
    await user.click(getByTestId('createEventModalBtn'));
    await user.click(getByTestId('createEventModalBtn'));

    expect(showInviteModal).toHaveBeenCalledTimes(3);
  });

  it('search input accepts special characters', async () => {
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
    await user.clear(input);
    await user.type(input, '@#$%^&*()');

    expect(input.value).toBe('@#$%^&*()');
  });

  it('search input handles long strings', async () => {
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
    await user.clear(input);
    await user.type(input, longString);

    expect(input.value).toBe(longString);
  });
});
