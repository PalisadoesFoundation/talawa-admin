import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VenueCard from './VenueCard';
import {
  MOCK_VENUE_ITEM,
  MOCK_VENUE_ITEM_WITH_IMAGE,
  MOCK_VENUE_ITEM_LONG_TEXT,
  MOCK_HANDLE_EDIT,
  MOCK_HANDLE_DELETE,
} from './VenueCardMocks';
import i18n from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';

describe('VenueCard Component', () => {
  test('renders venue details correctly', (): void => {
    render(
      <I18nextProvider i18n={i18n}>
        <VenueCard
          venueItem={MOCK_VENUE_ITEM}
          index={0}
          showEditVenueModal={MOCK_HANDLE_EDIT}
          handleDelete={MOCK_HANDLE_DELETE}
        />
      </I18nextProvider>,
    );
    expect(screen.getByText('Grand Hall')).toBeInTheDocument();
    expect(
      screen.getByText('A spacious venue for large events and gatherings.'),
    ).toBeInTheDocument();
  });

  test('displays default image when venue has no image', (): void => {
    render(
      <I18nextProvider i18n={i18n}>
        <VenueCard
          venueItem={MOCK_VENUE_ITEM}
          index={0}
          showEditVenueModal={MOCK_HANDLE_EDIT}
          handleDelete={MOCK_HANDLE_DELETE}
        />
      </I18nextProvider>,
    );
    const imgElement = screen.getByAltText(
      'image not found',
    ) as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.src).toContain('defaultImg.png');
  });

  test('displays provided image when available', (): void => {
    render(
      <I18nextProvider i18n={i18n}>
        <VenueCard
          venueItem={MOCK_VENUE_ITEM_WITH_IMAGE}
          index={0}
          showEditVenueModal={MOCK_HANDLE_EDIT}
          handleDelete={MOCK_HANDLE_DELETE}
        />
      </I18nextProvider>,
    );
    const imgElement = screen.getByAltText(
      'image not found',
    ) as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.src).toBe('https://surl.li/odyiad');
  });

  test('handles edit button click', (): void => {
    render(
      <I18nextProvider i18n={i18n}>
        <VenueCard
          venueItem={MOCK_VENUE_ITEM}
          index={0}
          showEditVenueModal={MOCK_HANDLE_EDIT}
          handleDelete={MOCK_HANDLE_DELETE}
        />
      </I18nextProvider>,
    );
    const editButton = screen.getByTestId('updateVenueBtn1');
    fireEvent.click(editButton);
    expect(MOCK_HANDLE_EDIT).toHaveBeenCalledWith(MOCK_VENUE_ITEM);
  });

  test('handles delete button click', (): void => {
    render(
      <I18nextProvider i18n={i18n}>
        <VenueCard
          venueItem={MOCK_VENUE_ITEM}
          index={0}
          showEditVenueModal={MOCK_HANDLE_EDIT}
          handleDelete={MOCK_HANDLE_DELETE}
        />
      </I18nextProvider>,
    );
    const deleteButton = screen.getByTestId('deleteVenueBtn1');
    fireEvent.click(deleteButton);
    expect(MOCK_HANDLE_DELETE).toHaveBeenCalledWith('1');
  });

  test('truncates long venue name correctly', (): void => {
    render(
      <I18nextProvider i18n={i18n}>
        <VenueCard
          venueItem={MOCK_VENUE_ITEM_LONG_TEXT}
          index={0}
          showEditVenueModal={MOCK_HANDLE_EDIT}
          handleDelete={MOCK_HANDLE_DELETE}
        />
      </I18nextProvider>,
    );

    expect(
      screen.getByText('This is a very long venue...'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        'This is a very long venue name that should definitely be truncated in the display',
      ),
    ).not.toBeInTheDocument();
  });

  test('displays short name and description without truncation', (): void => {
    render(
      <I18nextProvider i18n={i18n}>
        <VenueCard
          venueItem={MOCK_VENUE_ITEM}
          index={0}
          showEditVenueModal={MOCK_HANDLE_EDIT}
          handleDelete={MOCK_HANDLE_DELETE}
        />
      </I18nextProvider>,
    );

    expect(screen.getByText('Grand Hall')).toBeInTheDocument();
    expect(
      screen.getByText('A spacious venue for large events and gatherings.'),
    ).toBeInTheDocument();
  });
});
