import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VenueCard from './VenueCard';
import {
  MOCK_VENUE_ITEM,
  MOCK_VENUE_ITEM_WITH_IMAGE,
  MOCK_VENUE_ITEM_LONG_TEXT,
  MOCK_HANDLE_EDIT,
  MOCK_HANDLE_DELETE,
} from './VenueCardMocks';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';

describe('VenueCard Component', () => {
  it('renders venue details correctly', (): void => {
    render(
      <I18nextProvider i18n={i18nForTest}>
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
      screen.getByText('A spacious venue for large events.'),
    ).toBeInTheDocument();
  });

  it('displays default image when venue has no image', (): void => {
    render(
      <I18nextProvider i18n={i18nForTest}>
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

  it('displays provided image when available', (): void => {
    render(
      <I18nextProvider i18n={i18nForTest}>
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

  it('handles edit button click', (): void => {
    render(
      <I18nextProvider i18n={i18nForTest}>
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

  it('handles delete button click', (): void => {
    render(
      <I18nextProvider i18n={i18nForTest}>
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

  it('truncates long venue name correctly', (): void => {
    render(
      <I18nextProvider i18n={i18nForTest}>
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

  it('displays short name and description without truncation', (): void => {
    render(
      <I18nextProvider i18n={i18nForTest}>
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
      screen.getByText('A spacious venue for large events.'),
    ).toBeInTheDocument();
  });
});
