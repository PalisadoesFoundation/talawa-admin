import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { vi } from 'vitest';
import type * as RouterTypes from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import type { InterfaceVenueModalProps } from './VenueModal';
import VenueModal from './VenueModal';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import {
  CREATE_VENUE_MUTATION,
  UPDATE_VENUE_MUTATION,
} from 'GraphQl/Mutations/mutations';
import type { ApolloLink } from '@apollo/client';

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
        id: 'venue1',
        name: 'Updated Venue',
        capacity: 200,
        description: 'Updated description',
        file: 'image1',
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

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

async function wait(ms = 100): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const defaultProps: InterfaceVenueModalProps = {
  show: true,
  onHide: vi.fn(),
  edit: false,
  venueData: null,
  refetchVenues: vi.fn(),
  orgId: 'orgId',
};

const editProps: InterfaceVenueModalProps = {
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
};

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders correctly when show is true', () => {
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
    expect(screen.getByText('Venue Details')).toBeInTheDocument();
  });

  test('does not render when show is false', () => {
    const props = { ...defaultProps, show: false };
    const { container } = renderVenueModal(
      props,
      new StaticMockLink(MOCKS, true),
    );
    expect(container.firstChild).toBeNull();
  });

  test('populates form fields correctly in edit mode', () => {
    renderVenueModal(editProps, new StaticMockLink(MOCKS, true));
    expect(screen.getByDisplayValue('Venue 1')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Updated description for venue 1'),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
  });

  test('form fields are empty in create mode', () => {
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
    expect(screen.getByPlaceholderText('Enter Venue Name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter Venue Description')).toHaveValue(
      '',
    );
    expect(screen.getByPlaceholderText('Enter Venue Capacity')).toHaveValue('');
  });

  test('calls onHide when close button is clicked', () => {
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
    fireEvent.click(screen.getByTestId('createVenueModalCloseBtn'));
    expect(defaultProps.onHide).toHaveBeenCalled();
  });

  test('displays image preview and clear button when an image is selected', async () => {
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('venueImgUrl');
    await userEvent.upload(fileInput, file);

    expect(screen.getByAltText('Venue Image Preview')).toBeInTheDocument();
    expect(screen.getByTestId('closeimage')).toBeInTheDocument();
  });

  test('removes image preview when clear button is clicked', async () => {
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('venueImgUrl');
    await userEvent.upload(fileInput, file);

    fireEvent.click(screen.getByTestId('closeimage'));
    expect(
      screen.queryByAltText('Venue Image Preview'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('closeimage')).not.toBeInTheDocument();
  });

  test('shows error when venue name is empty', async () => {
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

    // Fill capacity with valid value
    fireEvent.change(screen.getByPlaceholderText('Enter Venue Capacity'), {
      target: { value: '100' },
    });

    // Submit form without filling name
    await act(async () => {
      fireEvent.click(screen.getByTestId('createVenueBtn'));
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Venue title cannot be empty!');
    });
  });

  test('shows error when venue capacity is not a positive number', async () => {
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

    // Fill name with valid value
    fireEvent.change(screen.getByPlaceholderText('Enter Venue Name'), {
      target: { value: 'Test Venue' },
    });

    // Set invalid capacity
    fireEvent.change(screen.getByPlaceholderText('Enter Venue Capacity'), {
      target: { value: '-1' },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('createVenueBtn'));
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Capacity must be a positive number!',
      );
    });
  });

  test('shows success toast when a new venue is created', async () => {
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText('Enter Venue Name'), {
      target: { value: 'Test Venue' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Venue Description'), {
      target: { value: 'Test Venue Desc' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Venue Capacity'), {
      target: { value: '100' },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('createVenueBtn'));
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'organizationVenues.venueCreated',
      );
    });
  });

  test('shows success toast when an existing venue is updated', async () => {
    const mockLink = new StaticMockLink(MOCKS, true);
    renderVenueModal(editProps, mockLink);

    // Wait for initial render
    await wait(0);

    // Update form fields
    fireEvent.change(screen.getByDisplayValue('Venue 1'), {
      target: { value: 'Updated Venue' },
    });

    fireEvent.change(
      screen.getByDisplayValue('Updated description for venue 1'),
      {
        target: { value: 'Updated description' },
      },
    );

    fireEvent.change(screen.getByDisplayValue('100'), {
      target: { value: '200' },
    });

    // Trigger update
    await act(async () => {
      fireEvent.click(screen.getByTestId('updateVenueBtn'));
      await wait(0); // Wait for mutation to complete
    });

    // Wait for toast and callbacks
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Venue details updated successfully',
      );
    });

    expect(editProps.refetchVenues).toHaveBeenCalled();
    expect(editProps.onHide).toHaveBeenCalled();
  });
});
