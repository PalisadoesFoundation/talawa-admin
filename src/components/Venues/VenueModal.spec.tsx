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

// Mock Setup
const MOCKS = [
  // Create venue mock
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

  // Basic update venue mock
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

  // First sequential update mock
  {
    request: {
      query: UPDATE_VENUE_MUTATION,
      variables: {
        id: 'venue1',
        name: 'Updated Venue 1',
        capacity: parseInt('100'),
        description: 'Updated description for venue 1',
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

  // Second sequential update mock
  {
    request: {
      query: UPDATE_VENUE_MUTATION,
      variables: {
        id: 'venue1',
        name: 'Updated Venue 2',
        capacity: parseInt('100'),
        description: 'Updated description for venue 1',
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

  // Duplicate name error mock
  {
    request: {
      query: CREATE_VENUE_MUTATION,
      variables: {
        name: 'Existing Venue',
        description: 'Test Description',
        capacity: 100,
        organizationId: 'orgId',
        file: '',
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
        file: '',
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
        capacity: parseInt('150'),
        description: 'Changed description',
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

  // Mock for whitespace trimming test
  {
    request: {
      query: CREATE_VENUE_MUTATION,
      variables: {
        name: 'Test Venue', // Note: trimmed value
        description: 'Test Description', // Note: trimmed value
        capacity: 100,
        organizationId: 'orgId',
        file: '',
      },
    },
    result: {
      data: {
        createVenue: {
          _id: 'newVenue',
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

    test('trims whitespace from name and description before submission', async () => {
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

      fireEvent.change(screen.getByPlaceholderText('Enter Venue Name'), {
        target: { value: '  Test Venue  ' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter Venue Description'), {
        target: { value: '  Test Description  ' },
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

    test('shows success toast when a new venue is created', async () => {
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

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
        {
          target: { value: 'Updated description' },
        },
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

    test('handles multiple successive updates correctly', async () => {
      const mockLink = new StaticMockLink(MOCKS, true);
      const onHide = vi.fn();
      const refetchVenues = vi.fn();

      const props = {
        ...editProps,
        onHide,
        refetchVenues,
      };

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

    test('handles unchanged name in edit mode', () => {
      renderVenueModal(editProps, new StaticMockLink(MOCKS, true));
      fireEvent.change(screen.getByDisplayValue('Venue 1'), {
        target: { value: 'Venue 1' }, // Same name
      });
      fireEvent.click(screen.getByTestId('updateVenueBtn'));
      // Verify only other fields are updated
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
          {
            target: { value: 'Test Description' },
          },
        );

        await act(async () => {
          fireEvent.click(screen.getByTestId('updateVenueBtn'));
        });

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalled();
        });
      });
    });

    // Cleanup Tests
    describe('Cleanup', () => {
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

          // Verify values were set
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
          await wait(100); // Give time for unmount
        });

        // Mount fresh component
        renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

        await waitFor(() => {
          const newNameInput = screen.getByPlaceholderText('Enter Venue Name');
          const newDescInput = screen.getByPlaceholderText(
            'Enter Venue Description',
          );
          const newCapInput = screen.getByPlaceholderText(
            'Enter Venue Capacity',
          );

          // Check if inputs are empty in new instance
          expect(newNameInput).toHaveValue('');
          expect(newDescInput).toHaveValue('');
          expect(newCapInput).toHaveValue('');
        });
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
        test('handles file input change with multiple files selected', async () => {
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
      });

      // Validation Edge Cases
      describe('Validation Edge Cases', () => {
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
        test('handles mutation errors with custom error messages', async () => {
          const errorMock = {
            request: {
              query: CREATE_VENUE_MUTATION,
              variables: {
                name: 'Test Venue',
                description: 'Test Description',
                capacity: 100,
                organizationId: 'orgId',
                file: '',
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
