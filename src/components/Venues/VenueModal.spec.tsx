import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import type { InterfaceVenueModalProps } from './VenueModal';
import VenueModal from './VenueModal';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import {
  CREATE_VENUE_MUTATION,
  UPDATE_VENUE_MUTATION,
} from 'GraphQl/Mutations/mutations';
import type { ApolloLink } from '@apollo/client';
import { vi } from 'vitest';
import type * as RouterTypes from 'react-router-dom';

const MOCKS = [
  {
    request: {
      query: CREATE_VENUE_MUTATION,
      variables: {
        name: 'Test Venue',
        description: 'Test Venue Desc',
        capacity: 100,
        organizationId: 'orgId',
        file: '',
      },
    },
    result: {
      data: {
        createVenue: {
          _id: 'orgId',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_VENUE_MUTATION,
      variables: {
        capacity: 200,
        description: 'Updated description',
        file: 'image1',
        id: 'venue1',
        name: 'Updated Venue',
        organizationId: 'orgId',
      },
    },
    result: {
      data: {
        editVenue: {
          _id: 'venue1',
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

const mockId = 'orgId';

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual(
    'react-router-dom',
  )) as typeof RouterTypes;
  return {
    ...actual,
    useParams: () => ({ orgId: mockId }),
  };
});

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

const props: InterfaceVenueModalProps[] = [
  {
    show: true,
    onHide: vi.fn(),
    edit: false,
    venueData: null,
    refetchVenues: vi.fn(),
    orgId: 'orgId',
  },
  {
    show: true,
    onHide: vi.fn(),
    edit: true,
    venueData: {
      _id: 'venue1',
      name: 'Venue 1',
      description: 'Updated description for venue 1',
      image: 'image1',
      capacity: '100',
    },
    refetchVenues: vi.fn(),
    orgId: 'orgId',
  },
];

const renderVenueModal = (
  props: InterfaceVenueModalProps,
  link: ApolloLink,
): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...props} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('VenueModal', () => {
  global.alert = vi.fn();

  test('renders correctly when show is true', async () => {
    renderVenueModal(props[0], link);
    expect(screen.getByText('Venue Details')).toBeInTheDocument();
  });

  test('does not render when show is false', () => {
    const { container } = renderVenueModal({ ...props[0], show: false }, link);
    expect(container.firstChild).toBeNull();
  });

  test('populates form fields correctly in edit mode', () => {
    renderVenueModal(props[1], link);
    expect(screen.getByDisplayValue('Venue 1')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Updated description for venue 1'),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
  });

  test('form fields are empty in create mode', () => {
    renderVenueModal(props[0], link);
    expect(screen.getByPlaceholderText('Enter Venue Name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter Venue Description')).toHaveValue(
      '',
    );
    expect(screen.getByPlaceholderText('Enter Venue Capacity')).toHaveValue('');
  });

  test('calls onHide when close button is clicked', () => {
    renderVenueModal(props[0], link);
    fireEvent.click(screen.getByTestId('createVenueModalCloseBtn'));
    expect(props[0].onHide).toHaveBeenCalled();
  });

  test('displays image preview and clear button when an image is selected', async () => {
    renderVenueModal(props[0], link);

    const file = new File(['chad'], 'chad.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('venueImgUrl');
    userEvent.upload(fileInput, file);

    await wait();

    expect(screen.getByAltText('Venue Image Preview')).toBeInTheDocument();
    expect(screen.getByTestId('closeimage')).toBeInTheDocument();
  });

  test('removes image preview when clear button is clicked', async () => {
    renderVenueModal(props[0], link);

    const file = new File(['chad'], 'chad.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('venueImgUrl');
    userEvent.upload(fileInput, file);

    await wait();

    const form = screen.getByTestId('venueForm');
    form.addEventListener('submit', (e) => e.preventDefault());
    fireEvent.click(screen.getByTestId('closeimage'));

    expect(
      screen.queryByAltText('Venue Image Preview'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('closeimage')).not.toBeInTheDocument();
  });

  test('shows error when venue name is empty', async () => {
    renderVenueModal(props[0], link);

    const form = screen.getByTestId('venueForm');
    form.addEventListener('submit', (e) => e.preventDefault());

    const submitButton = screen.getByTestId('createVenueBtn');
    fireEvent.click(submitButton);

    await wait();

    expect(toast.error).toHaveBeenCalledWith('Venue title cannot be empty!');
  });

  test('shows error when venue capacity is not a positive number', async () => {
    renderVenueModal(props[0], link);

    const nameInput = screen.getByPlaceholderText('Enter Venue Name');
    fireEvent.change(nameInput, { target: { value: 'Test venue' } });

    const capacityInput = screen.getByPlaceholderText('Enter Venue Capacity');
    fireEvent.change(capacityInput, { target: { value: '-1' } });

    const form = screen.getByTestId('venueForm');
    form.addEventListener('submit', (e) => e.preventDefault());

    const submitButton = screen.getByTestId('createVenueBtn');
    fireEvent.click(submitButton);

    await wait();

    expect(toast.error).toHaveBeenCalledWith(
      'Capacity must be a positive number!',
    );
  });

  test('shows success toast when a new venue is created', async () => {
    renderVenueModal(props[0], link);

    const nameInput = screen.getByPlaceholderText('Enter Venue Name');
    fireEvent.change(nameInput, { target: { value: 'Test Venue' } });
    const descriptionInput = screen.getByPlaceholderText(
      'Enter Venue Description',
    );
    fireEvent.change(descriptionInput, {
      target: { value: 'Test Venue Desc' },
    });

    const capacityInput = screen.getByPlaceholderText('Enter Venue Capacity');
    fireEvent.change(capacityInput, { target: { value: 100 } });
    const form = screen.getByTestId('venueForm');
    form.addEventListener('submit', (e) => e.preventDefault());

    const submitButton = screen.getByTestId('createVenueBtn');
    fireEvent.click(submitButton);

    await wait();

    expect(toast.success).toHaveBeenCalledWith('Venue added Successfully');
  });

  test('shows success toast when an existing venue is updated', async () => {
    renderVenueModal(props[1], link);

    const nameInput = screen.getByDisplayValue('Venue 1');
    fireEvent.change(nameInput, { target: { value: 'Updated Venue' } });
    const descriptionInput = screen.getByDisplayValue(
      'Updated description for venue 1',
    );
    fireEvent.change(descriptionInput, {
      target: { value: 'Updated description' },
    });

    const capacityInput = screen.getByDisplayValue('100');
    fireEvent.change(capacityInput, { target: { value: 200 } });
    const form = screen.getByTestId('venueForm');
    form.addEventListener('submit', (e) => e.preventDefault());

    const submitButton = screen.getByTestId('updateVenueBtn');
    fireEvent.click(submitButton);

    await wait();

    expect(toast.success).toHaveBeenCalledWith(
      'Venue details updated successfully',
    );
  });
});

describe('VenueModal with error scenarios', () => {
  test('displays error toast when creating a venue fails', async () => {
    const errorMocks = [
      {
        request: {
          query: CREATE_VENUE_MUTATION,
          variables: {
            name: 'Error Venue',
            description: 'This should fail',
            capacity: 50,
            organizationId: 'orgId',
            file: '',
          },
        },
        error: new Error('Failed to create venue'),
      },
    ];

    const errorLink = new StaticMockLink(errorMocks, true);
    renderVenueModal(props[0], errorLink);

    const nameInput = screen.getByPlaceholderText('Enter Venue Name');
    fireEvent.change(nameInput, { target: { value: 'Error Venue' } });

    const descriptionInput = screen.getByPlaceholderText(
      'Enter Venue Description',
    );
    fireEvent.change(descriptionInput, {
      target: { value: 'This should fail' },
    });

    const capacityInput = screen.getByPlaceholderText('Enter Venue Capacity');
    fireEvent.change(capacityInput, { target: { value: 50 } });

    const submitButton = screen.getByTestId('createVenueBtn');
    fireEvent.click(submitButton);

    await wait();

    expect(toast.error).toHaveBeenCalledWith('Failed to create venue');
  });

  test('displays error toast when updating a venue fails', async () => {
    const errorMocks = [
      {
        request: {
          query: UPDATE_VENUE_MUTATION,
          variables: {
            capacity: 150,
            description: 'Failed update description',
            file: 'image1',
            id: 'venue1',
            name: 'Failed Update Venue',
            organizationId: 'orgId',
          },
        },
        error: new Error('Failed to update venue'),
      },
    ];

    const errorLink = new StaticMockLink(errorMocks, true);
    renderVenueModal(props[1], errorLink);

    const nameInput = screen.getByDisplayValue('Venue 1');
    fireEvent.change(nameInput, { target: { value: 'Failed Update Venue' } });

    const descriptionInput = screen.getByDisplayValue(
      'Updated description for venue 1',
    );
    fireEvent.change(descriptionInput, {
      target: { value: 'Failed update description' },
    });

    const capacityInput = screen.getByDisplayValue('100');
    fireEvent.change(capacityInput, { target: { value: 150 } });

    const submitButton = screen.getByTestId('updateVenueBtn');
    fireEvent.click(submitButton);

    await wait();

    expect(toast.error).toHaveBeenCalledWith('Failed to update venue');
  });
});
