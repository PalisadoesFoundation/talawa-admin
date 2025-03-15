import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import type { InterfaceVenueCardProps } from './VenueCard';
import VenueCard from './VenueCard';

// mocks
vi.mock('/src/assets/images/defaultImg.png', () => ({
  default: 'default-image-url',
}));
const mockVenueItem = {
  id: '1',
  name: 'venue1',
  description: 'description',
  attachments: [
    {
      url: 'test-img-url',
      mimeType: 'image/jpg',
    },
  ],
  capacity: 50,
};
const showEditVenueModal = vi.fn();
const handleDelete = vi.fn();

const mockVenueItemWithoutImg = {
  id: '2',
  name: 'venue1-no-img',
  description: 'description',
  capacity: 50,
};
const defaultPropsMock: InterfaceVenueCardProps = {
  venueItem: mockVenueItem,
  index: 1,
  showEditVenueModal: showEditVenueModal,
  handleDelete: handleDelete,
};
const renderVenueCardModel = (props: InterfaceVenueCardProps): RenderResult => {
  return render(
    <BrowserRouter>
      <Provider store={store}>
        <I18nextProvider i18n={i18nForTest}>
          <VenueCard {...props} />
        </I18nextProvider>
      </Provider>
    </BrowserRouter>,
  );
};

beforeAll(() => {
  vi.clearAllMocks();
});

describe(' VenueCard', () => {
  it('renders the venue card with correct data', () => {
    renderVenueCardModel(defaultPropsMock);

    expect(screen.getByText('venue1')).toBeInTheDocument();
    expect(screen.getByText('description')).toBeInTheDocument();
    expect(screen.getByText('Capacity: 50')).toBeInTheDocument();
    expect(screen.getByTestId('updateVenueBtn2')).toBeInTheDocument();
    expect(screen.getByTestId('deleteVenueBtn2')).toBeInTheDocument();
    expect(screen.getByAltText('image not found')).toBeInTheDocument();

    // venue image source is used
    const venueImage = screen.getByAltText('image not found');
    expect(venueImage).toHaveAttribute('src', 'test-img-url');
  });

  it('render with default image when no image is provided', () => {
    renderVenueCardModel({
      ...defaultPropsMock,
      venueItem: mockVenueItemWithoutImg,
    });

    // default image is used source is used
    const venueImage = screen.getByAltText('image not found');
    expect(venueImage).toHaveAttribute('src', 'default-image-url');
  });

  it('truncate name if its long', () => {
    const longNameVenueItem = {
      ...mockVenueItem,
      name: 'This is very long name thats need to be truncated and "..." should be appended :)',
    };

    renderVenueCardModel({
      ...defaultPropsMock,
      venueItem: longNameVenueItem,
    });
    expect(screen.getByTestId('venue-name2')).toHaveTextContent(
      'This is very long name th...',
    );
  });
  it('truncate decription if its long', () => {
    const longDescVenueItem = {
      ...mockVenueItem,
      description:
        'This is very long description thats need to be truncated and "..." should be appended :)',
    };

    renderVenueCardModel({
      ...defaultPropsMock,
      venueItem: longDescVenueItem,
    });
    expect(
      screen.getByText(
        'This is very long description thats need to be truncated and "..." should b...',
      ),
    );
  });

  it('calls showEditVenueModal when the btn clicked ', async () => {
    renderVenueCardModel(defaultPropsMock);
    const editBtn = screen.getByTestId('updateVenueBtn2');
    expect(editBtn).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.click(editBtn);
    });

    expect(showEditVenueModal).toHaveBeenCalledWith(mockVenueItem);
  });
  it('calls handleDelete when the btn clicked ', async () => {
    renderVenueCardModel(defaultPropsMock);
    const deleteBtn = screen.getByTestId('deleteVenueBtn2');
    expect(deleteBtn).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.click(deleteBtn);
    });

    expect(handleDelete).toHaveBeenCalledWith('1'); // id of the venue to be deleted
  });
});
