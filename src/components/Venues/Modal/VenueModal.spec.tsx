import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { vi } from 'vitest';
import type * as RouterTypes from 'react-router';

import type { InterfaceVenueModalProps } from './VenueModal';
import VenueModal from './VenueModal';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import {
  CREATE_VENUE_MUTATION,
  UPDATE_VENUE_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { ApolloLink, Observable } from '@apollo/client';

// Mock Setup
const MOCKS = [
  // Basic create venue mock
  {
    request: {
      query: CREATE_VENUE_MUTATION,
      variables: {
        name: 'Test Venue',
        description: 'Test description',
        capacity: 100,
        organizationId: 'orgId',
      },
    },
    result: {
      data: {
        createVenue: {
          id: 'new-venue-id',
          name: 'Test Venue',
          description: 'Test description',
        },
      },
    },
  },

  // Mock for "Test No Image" test case
  {
    request: {
      query: CREATE_VENUE_MUTATION,
      variables: {
        name: 'Test No Image',
        description: 'Test Description',
        capacity: 100,
        organizationId: 'orgId',
      },
    },
    result: {
      data: {
        createVenue: {
          id: 'new-venue-id-no-img',
          name: 'Test No Image',
          description: 'Test Description',
        },
      },
    },
  },

  // Mock for successful create test case
  {
    request: {
      query: CREATE_VENUE_MUTATION,
      variables: {
        name: 'Test Venue',
        description: 'Test Venue Desc',
        capacity: 100,
        organizationId: 'orgId',
      },
    },
    result: {
      data: {
        createVenue: {
          id: 'new-venue-success',
          name: 'Test Venue',
          description: 'Test Venue Desc',
        },
      },
    },
  },

  // Basic update venue mock - matches changed name case
  {
    request: {
      query: UPDATE_VENUE_MUTATION,
      variables: {
        id: 'venue1',
        name: 'Updated Venue',
        description: 'Updated description',
        capacity: 200,
      },
    },
    result: {
      data: {
        updateVenue: {
          id: 'venue1',
          name: 'Updated Venue',
          description: 'Updated description',
        },
      },
    },
  },

  // First sequential update mock
  {
    request: {
      query: UPDATE_VENUE_MUTATION,
      variables: {
        id: 'venue1',
        name: 'Updated Venue 1',
        description: 'Updated description for venue 1',
        capacity: 100,
      },
    },
    result: {
      data: {
        updateVenue: {
          id: 'venue1',
          name: 'Updated Venue 1',
          description: 'Updated description for venue 1',
        },
      },
    },
  },

  // Second sequential update mock
  {
    request: {
      query: UPDATE_VENUE_MUTATION,
      variables: {
        id: 'venue1',
        name: 'Updated Venue 2',
        description: 'Updated description for venue 1',
        capacity: 100,
      },
    },
    result: {
      data: {
        updateVenue: {
          id: 'venue1',
          name: 'Updated Venue 2',
          description: 'Updated description for venue 1',
        },
      },
    },
  },

  // Duplicate name error mock
  {
    request: {
      query: CREATE_VENUE_MUTATION,
      variables: {
        name: 'Existing Venue',
        description: 'Test Description',
        capacity: 100,
        organizationId: 'orgId',
      },
    },
    error: new Error('alreadyExists'),
  },

  // Network error mock
  {
    request: {
      query: CREATE_VENUE_MUTATION,
      variables: {
        name: 'Network Test Venue',
        description: 'Test Description',
        capacity: 100,
        organizationId: 'orgId',
      },
    },
    error: new Error('Network error'),
  },

  // Update with unchanged name mock
  {
    request: {
      query: UPDATE_VENUE_MUTATION,
      variables: {
        id: 'venue1',
        // No name field when unchanged
        capacity: 150,
        description: 'Changed description',
      },
    },
    result: {
      data: {
        updateVenue: {
          id: 'venue1',
          name: 'Venue 1',
          description: 'Changed description',
        },
      },
    },
  },

  // Mock for whitespace trimming test
  {
    request: {
      query: CREATE_VENUE_MUTATION,
      variables: {
        name: 'Test Venue', // Note: trimmed value
        description: 'Test Description', // Note: trimmed value
        capacity: 100,
        organizationId: 'orgId',
      },
    },
    result: {
      data: {
        createVenue: {
          id: 'newVenue',
          name: 'Test Venue',
          description: 'Test Description',
        },
      },
    },
  },
];
const mockId = 'orgId';

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as typeof RouterTypes;
  return { ...actual, useParams: () => ({ orgId: mockId }) };
});

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), warning: vi.fn(), error: vi.fn() },
}));

global.URL.createObjectURL = vi.fn(() => 'mock-url');

// Helper Functions
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
    node: {
      id: 'venue1',
      name: 'Venue 1',
      description: 'Updated description for venue 1',
      capacity: '100',
    },
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
    vi.resetModules();
  });

  test('creates a new venue successfully', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <VenueModal {...defaultProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    fireEvent.change(screen.getByPlaceholderText('Enter Venue Name'), {
      target: { value: 'Test Venue' },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter Venue Description'), {
      target: { value: 'Test Description' },
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

  test('handles duplicate venue name error with fallback message', async () => {
    // Save original translation hook implementation
    const originalModule = await vi.importActual('react-i18next');

    // Mock translation to return undefined for venueNameExists to test fallback
    vi.doMock('react-i18next', () => ({
      ...originalModule,
      useTranslation: () => ({
        t: (key: string) =>
          key === 'venueNameExists' ? undefined : `organizationVenues.${key}`,
        i18n: { changeLanguage: vi.fn() },
      }),
    }));

    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

    fireEvent.change(screen.getByPlaceholderText('Enter Venue Name'), {
      target: { value: 'Existing Venue' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter Venue Description'), {
      target: { value: 'Test Description' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter Venue Capacity'), {
      target: { value: '100' },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('createVenueBtn'));
    });

    await waitFor(() => {
      // Should use the fallback message
      expect(toast.error).toHaveBeenCalled();
    });

    // Restore original implementation
    vi.restoreAllMocks();
  });

  test('clears image input correctly', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <VenueModal {...editProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('venueImgUrl');
    await userEvent.upload(fileInput, file);

    fireEvent.click(screen.getByTestId('closeimage'));

    expect(
      screen.queryByAltText('Venue Image Preview'),
    ).not.toBeInTheDocument();
  });

  // Basic Rendering Tests
  describe('Rendering', () => {
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

    test('calls onHide when close button is clicked', () => {
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
      fireEvent.click(screen.getByTestId('createVenueModalCloseBtn'));
      expect(defaultProps.onHide).toHaveBeenCalled();
    });
  });

  // Form Field Tests
  describe('Form Fields', () => {
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
      expect(
        screen.getByPlaceholderText('Enter Venue Description'),
      ).toHaveValue('');
      expect(screen.getByPlaceholderText('Enter Venue Capacity')).toHaveValue(
        '',
      );
    });

    test('tests undefined description fallback to empty string', async () => {
      // Create a spy to capture the mutation variables
      const mutationSpy = vi.fn().mockImplementation(() => {
        return {
          data: { createVenue: { id: 'newVenue' } },
        };
      });

      // Create a custom mock link that captures the variables
      const mockLink = new ApolloLink((operation) => {
        // This will capture the actual variables being sent
        mutationSpy(operation);
        return Observable.of({ data: { createVenue: { id: 'newVenue' } } });
      });

      // Create a component with the spy link
      const { unmount } = render(
        <MockedProvider link={mockLink} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...defaultProps} />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Set name
      fireEvent.change(screen.getByPlaceholderText('Enter Venue Name'), {
        target: { value: 'Test Venue' },
      });

      // Leave description undefined/null by not setting it

      // Set capacity
      fireEvent.change(screen.getByPlaceholderText('Enter Venue Capacity'), {
        target: { value: '100' },
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('createVenueBtn'));
      });

      // Verify success toast
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'organizationVenues.venueCreated',
        );
      });

      // Verify the mutation variables
      await waitFor(() => {
        expect(mutationSpy).toHaveBeenCalled();
        // Check that the first call to the spy has the expected variables
        const operation = mutationSpy.mock.calls[0][0];
        const variables = operation.variables;
        expect(variables.description).toBe('');
      });

      unmount();
    });

    test('trims whitespace from name and description before submission', async () => {
      // Create a mock with empty description to test fallback
      const emptyDescriptionMock = [
        {
          request: {
            query: CREATE_VENUE_MUTATION,
            variables: {
              name: 'Test Venue',
              description: '', // Test the || '' fallback
              capacity: 100,
              organizationId: 'orgId',
            },
          },
          result: { data: { createVenue: { id: 'newVenue' } } },
        },
      ];

      renderVenueModal(
        defaultProps,
        new StaticMockLink(emptyDescriptionMock, true),
      );

      fireEvent.change(screen.getByPlaceholderText('Enter Venue Name'), {
        target: { value: '  Test Venue  ' },
      });
      // Leave description empty to test the trim() || '' fallback
      fireEvent.change(screen.getByPlaceholderText('Enter Venue Description'), {
        target: { value: '   ' }, // Only whitespace
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
  });

  // Image Handling Tests
  describe('Image Handling', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      vi.clearAllMocks();
      // Use a spy instead of overriding console.error
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      // Restore console.error after each test
      consoleErrorSpy.mockRestore();
    });

    test('displays image preview and clear button when an image is selected', async () => {
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = screen.getByTestId('venueImgUrl');

      await act(async () => {
        await userEvent.upload(fileInput, file);
      });

      // Wait for the image preview to appear (local preview, no upload needed)
      await waitFor(() => {
        expect(screen.getByAltText('Venue Image Preview')).toBeInTheDocument();
        expect(screen.getByTestId('closeimage')).toBeInTheDocument();
      });
    });

    test('removes image preview when clear button is clicked and tests fileInputRef is null', async () => {
      // Create component with custom fileInputRef mock
      const originalUseRef = React.useRef;
      const refValue = { current: document.createElement('input') };

      // Mock useRef to return our controlled ref
      vi.spyOn(React, 'useRef').mockImplementation((initialValue) => {
        if (initialValue === null) {
          return refValue;
        }
        return originalUseRef(initialValue);
      });

      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = screen.getByTestId('venueImgUrl');

      await act(async () => {
        await userEvent.upload(fileInput, file);
      });

      await waitFor(() => {
        expect(screen.getByAltText('Venue Image Preview')).toBeInTheDocument();
      });

      // Set ref to null before clearing to test the null check
      refValue.current = null as unknown as HTMLInputElement;

      await act(async () => {
        fireEvent.click(screen.getByTestId('closeimage'));
      });

      expect(
        screen.queryByAltText('Venue Image Preview'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('closeimage')).not.toBeInTheDocument();

      // Restore original
      vi.restoreAllMocks();
    });

    test('shows error when uploading file larger than 5MB', async () => {
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

      const largeFile = new File(
        ['x'.repeat(6 * 1024 * 1024)],
        'large-image.png',
        { type: 'image/png' },
      );

      await act(async () => {
        fireEvent.change(screen.getByTestId('venueImgUrl'), {
          target: { files: [largeFile] },
        });
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'File too large: large-image.png',
        );
      });
    });

    test('shows error when uploading non-image file', async () => {
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

      const pdfFile = new File(['test content'], 'document.pdf', {
        type: 'application/pdf',
      });

      await act(async () => {
        fireEvent.change(screen.getByTestId('venueImgUrl'), {
          target: { files: [pdfFile] },
        });
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Invalid file type: document.pdf',
        );
      });
    });

    test('shows error toast when creating preview URL fails', async () => {
      const urlConstructorSpy = vi
        .spyOn(global, 'URL')
        .mockImplementation(() => {
          throw new Error('Invalid URL');
        });

      render(
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal
              {...defaultProps}
              venueData={{
                node: {
                  id: '123',
                  name: 'Test Venue',
                  description: 'Test Description',
                  capacity: '100',
                  image: 'some-image.jpg',
                },
              }}
            />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error creating preview URL');
      });

      urlConstructorSpy.mockRestore();
    });

    test('shows error toast when an empty file is selected', async () => {
      render(
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...defaultProps} />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Create an empty file (with size 0)
      const emptyFile = new File([], 'empty.png', { type: 'image/png' });

      // Get file input and upload the empty file
      const fileInput = screen.getByTestId('venueImgUrl');

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [emptyFile] } });
      });

      // Check that toast.error was called with the expected message
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Empty file selected');
      });

      // Verify that no image preview is shown
      expect(
        screen.queryByAltText('Venue Image Preview'),
      ).not.toBeInTheDocument();
    });
  });

  // Validation Tests
  describe('Validation', () => {
    test('shows error when venue name is empty', async () => {
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

      fireEvent.change(screen.getByPlaceholderText('Enter Venue Capacity'), {
        target: { value: '100' },
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('createVenueBtn'));
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Venue title cannot be empty!',
        );
      });
    });

    test('shows error when venue capacity is not a positive number', async () => {
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

      fireEvent.change(screen.getByPlaceholderText('Enter Venue Name'), {
        target: { value: 'Test Venue' },
      });
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

    test('validates capacity edge cases', async () => {
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

      // Test zero capacity
      fireEvent.change(screen.getByPlaceholderText('Enter Venue Name'), {
        target: { value: 'Test Venue' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter Venue Capacity'), {
        target: { value: '0' },
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
  });

  // Mutation Tests
  describe('Mutations', () => {
    test('disables submit button during mutation loading state', async () => {
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

      fireEvent.change(screen.getByPlaceholderText('Enter Venue Name'), {
        target: { value: 'Test Venue' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter Venue Capacity'), {
        target: { value: '100' },
      });

      const submitButton = screen.getByTestId('createVenueBtn');
      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
    });

    test('shows success toast when a new venue is created and tests result?.data?.createVenue condition', async () => {
      // Mock with null result data to test the condition
      const mockWithoutData = [
        {
          request: {
            query: CREATE_VENUE_MUTATION,
            variables: {
              name: 'Test Venue',
              description: 'Test Venue Desc',
              capacity: 100,
              organizationId: 'orgId',
            },
          },
          result: { data: null },
        },
      ];

      // Use render with cleanup to properly isolate test renders
      const { unmount } = render(
        <MockedProvider mocks={mockWithoutData} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...defaultProps} />
          </I18nextProvider>
        </MockedProvider>,
      );

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

      // No success toast should be called with null data
      expect(toast.success).not.toHaveBeenCalled();

      // Clean up the previous render completely
      unmount();

      // Now render with proper data
      render(
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...defaultProps} />
          </I18nextProvider>
        </MockedProvider>,
      );

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

    test('handles edit result?.data?.editVenue condition check', async () => {
      // Mock with null result data to test the condition
      const mockWithoutData = [
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
          result: { data: null },
        },
      ];

      // First render with mock that will not trigger success path
      renderVenueModal(editProps, new StaticMockLink(mockWithoutData, true));

      fireEvent.change(screen.getByDisplayValue('Venue 1'), {
        target: { value: 'Updated Venue' },
      });
      fireEvent.change(
        screen.getByDisplayValue('Updated description for venue 1'),
        { target: { value: 'Updated description' } },
      );
      fireEvent.change(screen.getByDisplayValue('100'), {
        target: { value: '200' },
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('updateVenueBtn'));
      });

      // No success toast should be called with null data
      expect(toast.success).not.toHaveBeenCalled();
    });

    test('handles duplicate venue name error', async () => {
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

      fireEvent.change(screen.getByPlaceholderText('Enter Venue Name'), {
        target: { value: 'Existing Venue' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter Venue Description'), {
        target: { value: 'Test Description' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter Venue Capacity'), {
        target: { value: '100' },
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('createVenueBtn'));
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'organizationVenues.venueNameExists',
        );
      });
    });

    test('handles network error during venue creation', async () => {
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

      fireEvent.change(screen.getByPlaceholderText('Enter Venue Name'), {
        target: { value: 'Network Test Venue' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter Venue Description'), {
        target: { value: 'Test Description' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter Venue Capacity'), {
        target: { value: '100' },
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('createVenueBtn'));
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });
  });

  // Update Tests
  describe('Venue Updates', () => {
    test('shows success toast when an existing venue is updated', async () => {
      renderVenueModal(editProps, new StaticMockLink(MOCKS, true));

      fireEvent.change(screen.getByDisplayValue('Venue 1'), {
        target: { value: 'Updated Venue' },
      });
      fireEvent.change(
        screen.getByDisplayValue('Updated description for venue 1'),
        { target: { value: 'Updated description' } },
      );
      fireEvent.change(screen.getByDisplayValue('100'), {
        target: { value: '200' },
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('updateVenueBtn'));
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Venue details updated successfully',
        );
      });
    });

    test('tests description and objectName fallbacks in edit mode', async () => {
      // Mock for edit with null description and empty file
      const editMockWithFallbacks = [
        {
          request: {
            query: UPDATE_VENUE_MUTATION,
            variables: {
              id: 'venue1',
              name: 'Updated Venue',
              capacity: 200,
              description: '', // Test description fallback
            },
          },
          result: {
            data: {
              updateVenue: {
                id: 'venue1',
                name: 'Updated Venue',
                description: '',
              },
            },
          },
        },
      ];

      // Create a custom editProps with undefined description and image
      const customEditProps = {
        ...editProps,
        venueData: {
          node: {
            id: 'venue1', // Keep the required fields
            name: 'Venue 1',
            capacity: '100',
            description: null, // Changed to null from undefined
            image: null, // Changed to null from undefined
          },
        },
      };

      renderVenueModal(
        customEditProps,
        new StaticMockLink(editMockWithFallbacks, true),
      );

      fireEvent.change(screen.getByDisplayValue('Venue 1'), {
        target: { value: 'Updated Venue' },
      });
      // Don't set a description value
      fireEvent.change(screen.getByDisplayValue('100'), {
        target: { value: '200' },
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('updateVenueBtn'));
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Venue details updated successfully',
        );
      });
    });

    test('handles multiple successive updates correctly', async () => {
      const mockLink = new StaticMockLink(MOCKS, true);
      const onHide = vi.fn();
      const refetchVenues = vi.fn();

      const props = { ...editProps, onHide, refetchVenues };

      renderVenueModal(props, mockLink);

      // First update
      fireEvent.change(screen.getByDisplayValue('Venue 1'), {
        target: { value: 'Updated Venue 1' },
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('updateVenueBtn'));
        await wait(0);
      });

      await waitFor(() => {
        expect(refetchVenues).toHaveBeenCalledTimes(1);
      });

      // Second update
      fireEvent.change(screen.getByDisplayValue('Updated Venue 1'), {
        target: { value: 'Updated Venue 2' },
      });

      await act(async () => {
        fireEvent.click(screen.getByTestId('updateVenueBtn'));
        await wait(0);
      });

      await waitFor(() => {
        expect(refetchVenues).toHaveBeenCalledTimes(2);
        expect(onHide).toHaveBeenCalledTimes(2);
      });
    });

    test('handles unchanged name in edit mode', async () => {
      renderVenueModal(editProps, new StaticMockLink(MOCKS, true));

      fireEvent.change(screen.getByDisplayValue('Venue 1'), {
        target: { value: 'Venue 1' }, // Same name
      });
      fireEvent.change(screen.getByDisplayValue('100'), {
        target: { value: '150' },
      });
      fireEvent.change(
        screen.getByDisplayValue('Updated description for venue 1'),
        { target: { value: 'Changed description' } },
      );

      await act(async () => {
        fireEvent.click(screen.getByTestId('updateVenueBtn'));
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Venue details updated successfully',
        );
      });
    });
    // Error Handling Tests
    describe('Error Handling', () => {
      test('shows error toast when network error occurs during update', async () => {
        const errorMock = [
          {
            request: {
              query: UPDATE_VENUE_MUTATION,
              variables: {
                id: 'venue1',
                name: 'Updated Venue',
                capacity: parseInt('100'),
                description: 'Test Description',
                file: 'image1',
              },
            },
            error: new Error('Network error'),
          },
        ];

        renderVenueModal(editProps, new StaticMockLink(errorMock, true));

        fireEvent.change(screen.getByDisplayValue('Venue 1'), {
          target: { value: 'Updated Venue' },
        });
        fireEvent.change(
          screen.getByDisplayValue('Updated description for venue 1'),
          { target: { value: 'Test Description' } },
        );

        await act(async () => {
          fireEvent.click(screen.getByTestId('updateVenueBtn'));
        });

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalled();
        });
      });
    });

    test('handles "alreadyExists" error specifically', async () => {
      const duplicateNameMock = {
        request: {
          query: CREATE_VENUE_MUTATION,
          variables: {
            name: 'Duplicate Venue',
            description: 'Test Description',
            capacity: 100,
            organizationId: 'orgId',
          },
        },
        error: new Error('alreadyExists'),
      };

      renderVenueModal(
        defaultProps,
        new StaticMockLink([duplicateNameMock], true),
      );

      await act(async () => {
        await userEvent.type(
          screen.getByPlaceholderText('Enter Venue Name'),
          'Duplicate Venue',
        );
        await userEvent.type(
          screen.getByPlaceholderText('Enter Venue Description'),
          'Test Description',
        );
        await userEvent.type(
          screen.getByPlaceholderText('Enter Venue Capacity'),
          '100',
        );
        fireEvent.click(screen.getByTestId('createVenueBtn'));
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'organizationVenues.venueNameExists',
        );
      });
    });

    // Cleanup Tests
    describe('Cleanup', () => {
      test('handles mutation errors with custom error messages', async () => {
        const errorMock = {
          request: {
            query: CREATE_VENUE_MUTATION,
            variables: {
              name: 'Test Venue',
              description: 'Test Description',
              capacity: 100,
              organizationId: 'orgId',
            },
          },
          error: new Error('Custom error message'),
        };

        renderVenueModal(defaultProps, new StaticMockLink([errorMock], true));

        await act(async () => {
          await userEvent.type(
            screen.getByPlaceholderText('Enter Venue Name'),
            'Test Venue',
          );
          await userEvent.type(
            screen.getByPlaceholderText('Enter Venue Description'),
            'Test Description',
          );
          await userEvent.type(
            screen.getByPlaceholderText('Enter Venue Capacity'),
            '100',
          );
          fireEvent.click(screen.getByTestId('createVenueBtn'));
        });

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalled();
        });
      });

      test('handles unexpected mutation errors', async () => {
        const errorMock = {
          request: {
            query: UPDATE_VENUE_MUTATION,
            variables: {
              id: 'venue1',
              capacity: 100,
              description: 'Test Description',
              file: 'image1',
            },
          },
          error: new Error('Unexpected error'),
        };

        renderVenueModal(editProps, new StaticMockLink([errorMock], true));

        await act(async () => {
          fireEvent.click(screen.getByTestId('updateVenueBtn'));
        });

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalled();
        });
      });
    });

    // Form State Management
    test('resets form state when modal is closed and reopened', async () => {
      const { rerender } = renderVenueModal(
        defaultProps,
        new StaticMockLink(MOCKS, true),
      );

      // Fill in form
      await act(async () => {
        const nameInput = screen.getByPlaceholderText('Enter Venue Name');
        const descInput = screen.getByPlaceholderText(
          'Enter Venue Description',
        );
        const capInput = screen.getByPlaceholderText('Enter Venue Capacity');

        await userEvent.type(nameInput, 'Test Venue');
        await userEvent.type(descInput, 'Test Description');
        await userEvent.type(capInput, '100');

        expect(nameInput).toHaveValue('Test Venue');
        expect(descInput).toHaveValue('Test Description');
        expect(capInput).toHaveValue('100');
      });

      // Completely unmount by setting show to false
      await act(async () => {
        rerender(
          <MockedProvider
            addTypename={false}
            link={new StaticMockLink(MOCKS, true)}
          >
            <BrowserRouter>
              <Provider store={store}>
                <I18nextProvider i18n={i18nForTest}>
                  <VenueModal {...defaultProps} show={false} />
                </I18nextProvider>
              </Provider>
            </BrowserRouter>
          </MockedProvider>,
        );
        await wait(100);
      });

      // Mount fresh component
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

      await waitFor(() => {
        const newNameInput = screen.getByPlaceholderText('Enter Venue Name');
        const newDescInput = screen.getByPlaceholderText(
          'Enter Venue Description',
        );
        const newCapInput = screen.getByPlaceholderText('Enter Venue Capacity');

        // Check if inputs are empty in new instance
        expect(newNameInput).toHaveValue('');
        expect(newDescInput).toHaveValue('');
        expect(newCapInput).toHaveValue('');
      });
    });
    describe('VenueModal Additional Tests', () => {
      // Form State Management Tests
      describe('Form State Management', () => {
        test('updates form state when description is changed', async () => {
          renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
          const descInput = screen.getByPlaceholderText(
            'Enter Venue Description',
          );

          await act(async () => {
            await userEvent.type(descInput, 'New Description');
          });

          expect(descInput).toHaveValue('New Description');
        });

        test('enforces maximum length for description', async () => {
          renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
          const descInput = screen.getByPlaceholderText(
            'Enter Venue Description',
          );
          const longText = 'a'.repeat(501); // Exceeds 500 char limit

          await act(async () => {
            await userEvent.type(descInput, longText);
          });

          expect(descInput).toHaveValue(longText.slice(0, 500));
        });
      });

      // Image Handling Edge Cases
      describe('Image Handling Edge Cases', () => {
        // In VenueModal.spec.tsx
        test('handles multiple files selected in image upload', async () => {
          renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
          const fileInput = screen.getByTestId('venueImgUrl');
          const files = [
            new File(['test1'], 'test1.png', { type: 'image/png' }),
            new File(['test2'], 'test2.png', { type: 'image/png' }),
          ];

          await act(async () => {
            await userEvent.upload(fileInput, files);
          });

          // Should only use the first file
          expect(screen.getAllByAltText('Venue Image Preview')).toHaveLength(1);
        });

        // Validation Edge Cases
        describe('Validation Edge Cases', () => {
          test('handles empty venue name', async () => {
            renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

            fireEvent.change(
              screen.getByPlaceholderText('Enter Venue Capacity'),
              { target: { value: '100' } },
            );

            await act(async () => {
              fireEvent.click(screen.getByTestId('createVenueBtn'));
            });

            await waitFor(() => {
              expect(toast.error).toHaveBeenCalledWith(
                'Venue title cannot be empty!',
              );
            });
          });

          test('handles empty description', async () => {
            const createVenueMock = {
              request: {
                query: CREATE_VENUE_MUTATION,
                variables: {
                  name: 'Test Venue',
                  description: '',
                  capacity: 100,
                  organizationId: 'orgId',
                },
              },
              result: { data: { createVenue: { id: 'newVenue' } } },
            };

            const mockLink = new StaticMockLink([createVenueMock], true);

            renderVenueModal(defaultProps, mockLink);

            await act(async () => {
              await userEvent.type(
                screen.getByPlaceholderText('Enter Venue Name'),
                'Test Venue',
              );
              await userEvent.type(
                screen.getByPlaceholderText('Enter Venue Capacity'),
                '100',
              );
              fireEvent.click(screen.getByTestId('createVenueBtn'));
            });

            await waitFor(() => {
              expect(toast.success).toHaveBeenCalledWith(
                'organizationVenues.venueCreated',
              );
            });
          });

          test('handles empty image URL', async () => {
            const createVenueMock = {
              request: {
                query: CREATE_VENUE_MUTATION,
                variables: {
                  name: 'Test Venue',
                  description: 'Test Description',
                  capacity: 100,
                  organizationId: 'orgId',
                },
              },
              result: { data: { createVenue: { id: 'newVenue' } } },
            };

            const mockLink = new StaticMockLink([createVenueMock], true);

            renderVenueModal(defaultProps, mockLink);

            await act(async () => {
              await userEvent.type(
                screen.getByPlaceholderText('Enter Venue Name'),
                'Test Venue',
              );
              await userEvent.type(
                screen.getByPlaceholderText('Enter Venue Description'),
                'Test Description',
              );
              await userEvent.type(
                screen.getByPlaceholderText('Enter Venue Capacity'),
                '100',
              );
              fireEvent.click(screen.getByTestId('createVenueBtn'));
            });

            await waitFor(() => {
              expect(toast.success).toHaveBeenCalledWith(
                'organizationVenues.venueCreated',
              );
            });
          });

          // Test for fallback error message when venue name already exists
          test('uses fallback error message when venue name exists', async () => {
            const duplicateNameMock = {
              request: {
                query: CREATE_VENUE_MUTATION,
                variables: {
                  name: 'Duplicate Venue',
                  description: 'Test Description',
                  capacity: 100,
                  organizationId: 'orgId',
                },
              },
              error: new Error('alreadyExists'),
            };

            const mockLink = new StaticMockLink([duplicateNameMock], true);

            // Mock toast.error to check the exact message
            const toastErrorSpy = vi.spyOn(toast, 'error');

            renderVenueModal(defaultProps, mockLink);

            await act(async () => {
              await userEvent.type(
                screen.getByPlaceholderText('Enter Venue Name'),
                'Duplicate Venue',
              );
              await userEvent.type(
                screen.getByPlaceholderText('Enter Venue Description'),
                'Test Description',
              );
              await userEvent.type(
                screen.getByPlaceholderText('Enter Venue Capacity'),
                '100',
              );
              fireEvent.click(screen.getByTestId('createVenueBtn'));
            });

            await waitFor(() => {
              // Check that the error was called with either the translated message or the fallback
              expect(toastErrorSpy).toHaveBeenCalledWith(
                expect.stringMatching('organizationVenues.venueNameExists'),
              );
            });
          });
        });

        test('handles special characters in venue name', async () => {
          renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
          const nameInput = screen.getByPlaceholderText('Enter Venue Name');

          await act(async () => {
            await userEvent.type(nameInput, '!@#$%^&*()');
          });

          expect(nameInput).toHaveValue('!@#$%^&*()');
        });

        test('handles non-numeric input for capacity', async () => {
          renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
          const capacityInput = screen.getByPlaceholderText(
            'Enter Venue Capacity',
          );

          await act(async () => {
            await userEvent.type(capacityInput, 'abc');
          });

          await act(async () => {
            fireEvent.click(screen.getByTestId('createVenueBtn'));
          });

          await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(
              'Venue title cannot be empty!',
            );
          });
        });
      });

      // Error Boundary Tests
      describe('Error Handling', () => {
        test('handles image upload with no files', async () => {
          renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
          const fileInput = screen.getByTestId('venueImgUrl');

          await act(async () => {
            // Simulate file input event with no files
            fireEvent.change(fileInput, { target: { files: null } });
          });

          // Verify that the form state remains unchanged
          expect(screen.getByPlaceholderText('Enter Venue Name')).toHaveValue(
            '',
          );
        });

        test('handles empty description with trim and empty image URL', async () => {
          const createVenueMock = {
            request: {
              query: CREATE_VENUE_MUTATION,
              variables: {
                name: 'Test Venue',
                description: '',
                capacity: 100,
                organizationId: 'orgId',
              },
            },
            result: { data: { createVenue: { id: 'newVenue' } } },
          };

          renderVenueModal(
            defaultProps,
            new StaticMockLink([createVenueMock], true),
          );

          await act(async () => {
            await userEvent.type(
              screen.getByPlaceholderText('Enter Venue Name'),
              'Test Venue',
            );
            await userEvent.type(
              screen.getByPlaceholderText('Enter Venue Description'),
              '   ', // Only whitespace
            );
            await userEvent.type(
              screen.getByPlaceholderText('Enter Venue Capacity'),
              '100',
            );
            fireEvent.click(screen.getByTestId('createVenueBtn'));
          });

          await waitFor(() => {
            expect(toast.success).toHaveBeenCalled();
          });
        });

        test('handles empty image URL during venue update', async () => {
          const updateMock = {
            request: {
              query: UPDATE_VENUE_MUTATION,
              variables: {
                id: 'venue1',
                name: 'Updated Venue',
                capacity: 100,
                description: '',
              },
            },
            result: { data: { updateVenue: { id: 'venue1' } } },
          };

          renderVenueModal(
            {
              ...editProps,
              venueData: {
                node: {
                  id: 'venue1',
                  name: 'Original Venue',
                  description: '',
                  image: '',
                  capacity: '100',
                },
              },
            },
            new StaticMockLink([updateMock], true),
          );

          await act(async () => {
            fireEvent.change(screen.getByDisplayValue('Original Venue'), {
              target: { value: 'Updated Venue' },
            });
            fireEvent.click(screen.getByTestId('updateVenueBtn'));
          });

          await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith(
              'Venue details updated successfully',
            );
          });
        });

        test('handles form submission with undefined venueData in edit mode', async () => {
          const editPropsWithUndefinedVenueData = {
            ...editProps,
            venueData: undefined,
          };

          const mockLink = new StaticMockLink(MOCKS, true);
          renderVenueModal(editPropsWithUndefinedVenueData, mockLink);

          // Attempt to submit form
          await act(async () => {
            fireEvent.click(screen.getByTestId('updateVenueBtn'));
          });

          // This test ensures no runtime errors occur
          expect(screen.getByTestId('updateVenueBtn')).toBeInTheDocument();
        });

        test('handles description truncation', async () => {
          renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
          const descInput = screen.getByPlaceholderText(
            'Enter Venue Description',
          );

          const longDescription = 'a'.repeat(600); // More than 500 characters

          await act(async () => {
            await userEvent.type(descInput, longDescription);
          });

          // Verify that the description is truncated to 500 characters
          expect(descInput).toHaveValue(longDescription.slice(0, 500));
        });

        test('handles mutation errors with custom error messages', async () => {
          const errorMock = {
            request: {
              query: CREATE_VENUE_MUTATION,
              variables: {
                name: 'Test Venue',
                description: 'Test Description',
                capacity: 100,
                organizationId: 'orgId',
              },
            },
            error: new Error('Custom error message'),
          };

          renderVenueModal(defaultProps, new StaticMockLink([errorMock], true));

          await act(async () => {
            await userEvent.type(
              screen.getByPlaceholderText('Enter Venue Name'),
              'Test Venue',
            );
            await userEvent.type(
              screen.getByPlaceholderText('Enter Venue Description'),
              'Test Description',
            );
            await userEvent.type(
              screen.getByPlaceholderText('Enter Venue Capacity'),
              '100',
            );
            fireEvent.click(screen.getByTestId('createVenueBtn'));
          });

          await waitFor(() => {
            expect(toast.error).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
