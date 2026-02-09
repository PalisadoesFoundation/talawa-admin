import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type * as RouterTypes from 'react-router-dom';
import { GraphQLError } from 'graphql';

import { InterfaceVenueModalProps } from 'types/AdminPortal/Venues/interface';
import VenueModal from './VenueModal';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import {
  CREATE_VENUE_MUTATION,
  UPDATE_VENUE_MUTATION,
} from 'GraphQl/Mutations/mutations';
import {
  ApolloLink,
  Observable,
  InMemoryCache,
  ApolloProvider,
  ApolloClient,
} from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
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

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual(
    'react-router-dom',
  )) as typeof RouterTypes;
  return { ...actual, useParams: () => ({ orgId: mockId }) };
});
vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
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
      capacity: 100,
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
      <MemoryRouter initialEntries={['/']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...props} />
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('VenueModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  test('creates a new venue successfully', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <VenueModal {...defaultProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await user.type(
      screen.getByPlaceholderText('Enter Venue Name'),
      'Test Venue',
    );

    await user.type(
      screen.getByPlaceholderText('Enter Venue Description'),
      'Test Description',
    );

    await user.type(screen.getByPlaceholderText('Enter Venue Capacity'), '100');

    await user.click(screen.getByTestId('createVenueBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith({
        key: 'organizationVenuesNotification.venueCreated',
        namespace: 'translation',
      });
    });
  });

  test('handles duplicate venue name error with fallback message', async () => {
    const user = userEvent.setup();
    // Save original translation hook implementation
    const originalModule = await vi.importActual('react-i18next');

    // Mock translation to return undefined for venueNameExists to test fallback
    vi.doMock('react-i18next', () => ({
      ...originalModule,
      useTranslation: () => ({
        t: (key: string) =>
          key === 'organizationVenuesNotification.venueNameExists'
            ? undefined
            : `translation.${key}`,
        i18n: { changeLanguage: vi.fn() },
      }),
    }));

    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

    await user.type(
      screen.getByPlaceholderText('Enter Venue Name'),
      'Existing Venue',
    );

    await user.type(
      screen.getByPlaceholderText('Enter Venue Description'),
      'Test Description',
    );

    await user.type(screen.getByPlaceholderText('Enter Venue Capacity'), '100');

    await act(async () => {
      await user.click(screen.getByTestId('createVenueBtn'));
    });

    await waitFor(() => {
      // Should use the fallback message
      expect(NotificationToast.error).toHaveBeenCalled();
    });

    // Restore original implementation
    vi.restoreAllMocks();
  });

  test('clears image input correctly', async () => {
    const user = userEvent.setup();
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

    await user.click(screen.getByTestId('closeimage'));

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
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

  test('calls onHide when close button is clicked', async () => {
    const user = userEvent.setup();
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
    await user.click(screen.getByTestId('modalCloseBtn'));
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
    expect(screen.getByPlaceholderText('Enter Venue Description')).toHaveValue(
      '',
    );
    expect(screen.getByPlaceholderText('Enter Venue Capacity')).toHaveValue('');
  });

  test('tests undefined description fallback to empty string', async () => {
    const user = userEvent.setup();
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
    await user.type(
      screen.getByPlaceholderText('Enter Venue Name'),
      'Test Venue',
    );

    // Leave description undefined/null by not setting it

    // Set capacity
    await user.type(screen.getByPlaceholderText('Enter Venue Capacity'), '100');

    await act(async () => {
      await user.click(screen.getByTestId('createVenueBtn'));
    });

    // Verify success toast
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith({
        key: 'organizationVenuesNotification.venueCreated',
        namespace: 'translation',
      });
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
    const user = userEvent.setup();
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

    await user.type(
      screen.getByPlaceholderText('Enter Venue Name'),
      '  Test Venue  ',
    );
    // Leave description empty to test the trim() || '' fallback
    await user.type(
      screen.getByPlaceholderText('Enter Venue Description'),
      '   ',
    ); // Only whitespace);
    await user.type(screen.getByPlaceholderText('Enter Venue Capacity'), '100');

    await act(async () => {
      await user.click(screen.getByTestId('createVenueBtn'));
    });

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith({
        key: 'organizationVenuesNotification.venueCreated',
        namespace: 'translation',
      });
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

    vi.clearAllMocks();
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
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByTestId('closeimage')).toBeInTheDocument();
    });
  });

  test('removes image preview when clear button is clicked and tests fileInputRef is null', async () => {
    const user = userEvent.setup();
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
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    // Set ref to null before clearing to test the null check
    refValue.current = null as unknown as HTMLInputElement;

    await act(async () => {
      await user.click(screen.getByTestId('closeimage'));
    });

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByTestId('closeimage')).not.toBeInTheDocument();

    // Restore original
    vi.restoreAllMocks();
  });

  test('shows error when uploading file larger than 5MB', async () => {
    const user = userEvent.setup();
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

    const largeFile = new File(
      ['x'.repeat(6 * 1024 * 1024)],
      'large-image.png',
      { type: 'image/png' },
    );

    await user.upload(screen.getByTestId('venueImgUrl'), largeFile);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith({
        key: 'fileTooLarge',
        namespace: 'errors',
      });
    });
  });

  test('shows error toast when creating preview URL fails', async () => {
    const urlConstructorSpy = vi.spyOn(global, 'URL').mockImplementation(() => {
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
                capacity: 100,
                image: 'some-image.jpg',
              },
            }}
          />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith({
        key: 'unknownError',
        namespace: 'errors',
      });
    });

    urlConstructorSpy.mockRestore();
  });

  test('shows error toast when an empty file is selected', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <VenueModal {...defaultProps} />
        </I18nextProvider>
      </MockedProvider>,
    );

    const emptyFile = new File([], 'empty.png', { type: 'image/png' });

    const fileInput = screen.getByTestId('venueImgUrl');

    await act(async () => {
      await user.upload(fileInput, emptyFile);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith({
          key: 'emptyFile',
          namespace: 'errors',
        });
      });

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  // Validation Tests
  describe('Validation', () => {
    test('shows error when venue name is empty', async () => {
      const user = userEvent.setup();
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

      await user.type(
        screen.getByPlaceholderText('Enter Venue Capacity'),
        '100',
      );

      await act(async () => {
        await user.click(screen.getByTestId('createVenueBtn'));
      });

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith({
          key: 'organizationVenues.venueTitleError',
          namespace: 'translation',
        });
      });
    });

    test('shows error when venue capacity is not a positive number', async () => {
      const user = userEvent.setup();
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

      await user.type(
        screen.getByPlaceholderText('Enter Venue Name'),
        'Test Venue',
      );
      await user.type(
        screen.getByPlaceholderText('Enter Venue Capacity'),
        '-1',
      );

      await act(async () => {
        await user.click(screen.getByTestId('createVenueBtn'));
      });

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith({
          key: 'organizationVenues.venueCapacityError',
          namespace: 'translation',
        });
      });
    });

    test('validates capacity edge cases', async () => {
      const user = userEvent.setup();
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

      await user.type(
        screen.getByPlaceholderText('Enter Venue Name'),
        'Test Venue',
      );
      await user.type(screen.getByPlaceholderText('Enter Venue Capacity'), '0');

      await act(async () => {
        await user.click(screen.getByTestId('createVenueBtn'));
      });

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith({
          key: 'organizationVenues.venueCapacityError',
          namespace: 'translation',
        });
      });
    });

    // Mutation Tests
    describe('Mutations', () => {
      test('shows success toast when a new venue is created and tests result?.data?.createVenue condition', async () => {
        const user = userEvent.setup();
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

        const { unmount } = render(
          <MockedProvider mocks={mockWithoutData} addTypename={false}>
            <I18nextProvider i18n={i18nForTest}>
              <VenueModal {...defaultProps} />
            </I18nextProvider>
          </MockedProvider>,
        );

        await user.type(
          screen.getByPlaceholderText('Enter Venue Name'),
          'Test Venue',
        );
        await user.type(
          screen.getByPlaceholderText('Enter Venue Description'),
          'Test Venue Desc',
        );
        await user.type(
          screen.getByPlaceholderText('Enter Venue Capacity'),
          '100',
        );

        await act(async () => {
          await user.click(screen.getByTestId('createVenueBtn'));
        });
        expect(NotificationToast.success).not.toHaveBeenCalled();

        unmount();

        render(
          <MockedProvider mocks={MOCKS} addTypename={false}>
            <I18nextProvider i18n={i18nForTest}>
              <VenueModal {...defaultProps} />
            </I18nextProvider>
          </MockedProvider>,
        );

        await user.type(
          screen.getByPlaceholderText('Enter Venue Name'),
          'Test Venue',
        );
        await user.type(
          screen.getByPlaceholderText('Enter Venue Description'),
          'Test Venue Desc',
        );
        await user.type(
          screen.getByPlaceholderText('Enter Venue Capacity'),
          '100',
        );

        await act(async () => {
          await user.click(screen.getByTestId('createVenueBtn'));
        });

        await waitFor(() => {
          expect(NotificationToast.success).toHaveBeenCalledWith({
            key: 'organizationVenuesNotification.venueCreated',
            namespace: 'translation',
          });
        });
      });

      test('handles edit result?.data?.editVenue condition check', async () => {
        const user = userEvent.setup();
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
        renderVenueModal(editProps, new StaticMockLink(mockWithoutData, true));

        await user.type(screen.getByDisplayValue('Venue 1'), 'Updated Venue');
        await user.type(
          screen.getByDisplayValue('Updated description for venue 1'),
          'Updated description',
        );
        await user.type(screen.getByDisplayValue('100'), '200');

        await act(async () => {
          await user.click(screen.getByTestId('updateVenueBtn'));
        });

        expect(NotificationToast.success).not.toHaveBeenCalled();
      });

      test('handles duplicate venue name error with translation key', async () => {
        const user = userEvent.setup();
        const duplicateNameMock = {
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
        };

        renderVenueModal(
          defaultProps,
          new StaticMockLink([duplicateNameMock], true),
        );

        await user.type(
          screen.getByPlaceholderText('Enter Venue Name'),
          'Existing Venue',
        );
        await user.type(
          screen.getByPlaceholderText('Enter Venue Description'),
          'Test Description',
        );
        await user.type(
          screen.getByPlaceholderText('Enter Venue Capacity'),
          '100',
        );

        await act(async () => {
          await user.click(screen.getByTestId('createVenueBtn'));
        });

        await waitFor(() => {
          expect(NotificationToast.error).toHaveBeenCalledWith({
            key: 'organizationVenuesNotification.venueNameExists',
            namespace: 'translation',
          });
        });
      });

      test('handles network error during venue creation', async () => {
        const user = userEvent.setup();
        renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

        await user.type(
          screen.getByPlaceholderText('Enter Venue Name'),
          'Network Test Venue',
        );
        await user.type(
          screen.getByPlaceholderText('Enter Venue Description'),
          'Test Description',
        );
        await user.type(
          screen.getByPlaceholderText('Enter Venue Capacity'),
          '100',
        );

        await act(async () => {
          await user.click(screen.getByTestId('createVenueBtn'));
        });

        await waitFor(() => {
          expect(NotificationToast.error).toHaveBeenCalled();
        });
      });
    });

    describe('Venue Updates', () => {
      test('shows success toast when an existing venue is updated', async () => {
        const user = userEvent.setup();
        renderVenueModal(editProps, new StaticMockLink(MOCKS, true));

        const nameInput = screen.getByLabelText(/name of the venue/i);
        await user.clear(nameInput);
        await user.type(nameInput, 'Updated Venue');

        const descriptionInput = screen.getByLabelText(/description/i);
        await user.clear(descriptionInput);
        await user.type(descriptionInput, 'Updated description');

        const capacityInput = screen.getByLabelText(/capacity/i);
        await user.clear(capacityInput);
        await user.type(capacityInput, '200');

        await user.click(screen.getByTestId('updateVenueBtn'));

        await waitFor(() => {
          expect(NotificationToast.success).toHaveBeenCalledWith({
            key: 'organizationVenues.venueUpdated',
            namespace: 'translation',
          });
        });
      });

      test('tests description and objectName fallbacks in edit mode', async () => {
        const user = userEvent.setup();

        const editMockWithFallbacks = [
          {
            request: {
              query: UPDATE_VENUE_MUTATION,
              variables: {
                id: 'venue1',
                name: 'Updated Venue',
                capacity: 200,
                description: '',
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

        const customEditProps = {
          ...editProps,
          venueData: {
            node: {
              id: 'venue1',
              name: 'Venue 1',
              capacity: 100,
              description: null,
              image: null,
            },
          },
        };

        renderVenueModal(
          customEditProps,
          new StaticMockLink(editMockWithFallbacks, true),
        );

        const nameInput = screen.getByLabelText(/name of the venue/i);
        await user.clear(nameInput);
        await user.type(nameInput, 'Updated Venue');

        const capacityInput = screen.getByLabelText(/capacity/i);
        await user.clear(capacityInput);
        await user.type(capacityInput, '200');

        await user.click(screen.getByTestId('updateVenueBtn'));

        await waitFor(() => {
          expect(NotificationToast.success).toHaveBeenCalledWith({
            key: 'organizationVenues.venueUpdated',
            namespace: 'translation',
          });
        });
      });

      test('handles multiple successive updates correctly', async () => {
        const user = userEvent.setup();
        const mockLink = new StaticMockLink(MOCKS, true);
        const onHide = vi.fn();
        const refetchVenues = vi.fn();

        const props = { ...editProps, onHide, refetchVenues };

        const first = renderVenueModal(props, mockLink);

        const nameInput1 = screen.getByLabelText(/name of the venue/i);
        await user.clear(nameInput1);
        await user.type(nameInput1, 'Updated Venue 1');

        await user.click(screen.getByTestId('updateVenueBtn'));

        await waitFor(() => {
          expect(refetchVenues).toHaveBeenCalledTimes(1);
          expect(onHide).toHaveBeenCalledTimes(1);
        });

        first.unmount();

        renderVenueModal(props, mockLink);

        const nameInput2 = screen.getByLabelText(/name of the venue/i);
        await user.clear(nameInput2);
        await user.type(nameInput2, 'Updated Venue 2');

        await user.click(screen.getByTestId('updateVenueBtn'));

        await waitFor(() => {
          expect(refetchVenues).toHaveBeenCalledTimes(2);
          expect(onHide).toHaveBeenCalledTimes(2);
        });
      });

      test('handles unchanged name in edit mode', async () => {
        const user = userEvent.setup();
        renderVenueModal(editProps, new StaticMockLink(MOCKS, true));

        const capacityInput = screen.getByLabelText(/capacity/i);
        await user.clear(capacityInput);
        await user.type(capacityInput, '150');

        const descInput = screen.getByLabelText(/description/i);
        await user.clear(descInput);
        await user.type(descInput, 'Changed description');

        await user.click(screen.getByTestId('updateVenueBtn'));

        await waitFor(() => {
          expect(NotificationToast.success).toHaveBeenCalledWith({
            key: 'organizationVenues.venueUpdated',
            namespace: 'translation',
          });
        });
      });

      describe('Error Handling', () => {
        test('shows error toast when network error occurs during update', async () => {
          const user = userEvent.setup();
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

          await user.type(screen.getByDisplayValue('Venue 1'), 'Updated Venue');
          await user.type(
            screen.getByDisplayValue('Updated description for venue 1'),
            'Test Description',
          );

          await act(async () => {
            await user.click(screen.getByTestId('updateVenueBtn'));
          });

          await waitFor(() => {
            expect(NotificationToast.error).toHaveBeenCalled();
          });
        });
      });

      test('handles "alreadyExists" error with fallback message', async () => {
        const user = userEvent.setup();
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
          await user.click(screen.getByTestId('createVenueBtn'));
        });

        await waitFor(() => {
          expect(NotificationToast.error).toHaveBeenCalledWith({
            key: 'organizationVenuesNotification.venueNameExists',
            namespace: 'translation',
          });
        });
      });

      // Cleanup Tests
      describe('Cleanup', () => {
        test('handles mutation errors with custom error messages', async () => {
          const user = userEvent.setup();
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
            await user.click(screen.getByTestId('createVenueBtn'));
          });

          await waitFor(() => {
            expect(NotificationToast.error).toHaveBeenCalled();
          });
        });

        test('handles unexpected mutation errors', async () => {
          const user = userEvent.setup();
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
            await user.click(screen.getByTestId('updateVenueBtn'));
          });

          await waitFor(() => {
            expect(NotificationToast.error).toHaveBeenCalled();
          });
        });
      });

      test('resets form state when modal is closed and reopened', async () => {
        const { rerender } = renderVenueModal(
          defaultProps,
          new StaticMockLink(MOCKS, true),
        );

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

        renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

        await waitFor(() => {
          const newNameInput = screen.getByPlaceholderText('Enter Venue Name');
          const newDescInput = screen.getByPlaceholderText(
            'Enter Venue Description',
          );
          const newCapInput = screen.getByPlaceholderText(
            'Enter Venue Capacity',
          );

          expect(newNameInput).toHaveValue('');
          expect(newDescInput).toHaveValue('');
          expect(newCapInput).toHaveValue('');
        });
      });
      describe('VenueModal Additional Tests', () => {
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
            const longText = 'a'.repeat(501);

            await act(async () => {
              await userEvent.type(descInput, longText);
            });

            expect(descInput).toHaveValue(longText.slice(0, 500));
          });
        });

        describe('Image Handling Edge Cases', () => {
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

            expect(screen.getAllByRole('img')).toHaveLength(1);
          });
          describe('Validation Edge Cases', () => {
            test('handles empty venue name', async () => {
              const user = userEvent.setup();
              renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

              await user.type(
                screen.getByPlaceholderText('Enter Venue Capacity'),
                '100',
              );

              await act(async () => {
                await user.click(screen.getByTestId('createVenueBtn'));
              });

              await waitFor(() => {
                expect(NotificationToast.error).toHaveBeenCalledWith({
                  key: 'organizationVenues.venueTitleError',
                  namespace: 'translation',
                });
              });
            });

            test('handles empty description', async () => {
              const user = userEvent.setup();
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
                await user.click(screen.getByTestId('createVenueBtn'));
              });

              await waitFor(() => {
                expect(NotificationToast.success).toHaveBeenCalledWith({
                  key: 'organizationVenuesNotification.venueCreated',
                  namespace: 'translation',
                });
              });
            });

            test('handles empty image URL', async () => {
              const user = userEvent.setup();
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
                await user.click(screen.getByTestId('createVenueBtn'));
              });

              await waitFor(() => {
                expect(NotificationToast.success).toHaveBeenCalledWith({
                  key: 'organizationVenuesNotification.venueCreated',
                  namespace: 'translation',
                });
              });
            });

            test('handles generic error when translation is unavailable', async () => {
              const user = userEvent.setup();
              const genericErrorMock = {
                request: {
                  query: CREATE_VENUE_MUTATION,
                  variables: {
                    name: 'Test Venue',
                    description: 'Test Description',
                    capacity: 100,
                    organizationId: 'orgId',
                  },
                },
                error: new Error('Generic server error'),
              };

              const mockLink = new StaticMockLink([genericErrorMock], true);

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
                await user.click(screen.getByTestId('createVenueBtn'));
              });

              await waitFor(() => {
                expect(NotificationToast.error).toHaveBeenCalled();
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
            const user = userEvent.setup();
            renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
            const capacityInput = screen.getByPlaceholderText(
              'Enter Venue Capacity',
            );

            await act(async () => {
              await userEvent.type(capacityInput, 'abc');
            });

            await act(async () => {
              await user.click(screen.getByTestId('createVenueBtn'));
            });

            await waitFor(() => {
              expect(NotificationToast.error).toHaveBeenCalledWith({
                key: 'organizationVenues.venueTitleError',
                namespace: 'translation',
              });
            });
          });
        });

        describe('Error Handling', () => {
          test('handles image upload with no files', async () => {
            const user = userEvent.setup();
            renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
            const fileInput = screen.getByTestId('venueImgUrl');

            await user.upload(fileInput, []);

            expect(screen.getByPlaceholderText('Enter Venue Name')).toHaveValue(
              '',
            );
          });

          test('handles empty description with trim and empty image URL', async () => {
            const user = userEvent.setup();
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
                '   ',
              );
              await userEvent.type(
                screen.getByPlaceholderText('Enter Venue Capacity'),
                '100',
              );
              await user.click(screen.getByTestId('createVenueBtn'));
            });

            await waitFor(() => {
              expect(NotificationToast.success).toHaveBeenCalled();
            });
          });

          test('handles empty image URL during venue update', async () => {
            const user = userEvent.setup();

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
                    capacity: 100,
                  },
                },
              },
              new StaticMockLink([updateMock], true),
            );

            const nameInput = screen.getByLabelText(/name of the venue/i);

            await user.clear(nameInput);
            await user.type(nameInput, 'Updated Venue');

            await user.click(screen.getByTestId('updateVenueBtn'));

            await waitFor(() => {
              expect(NotificationToast.success).toHaveBeenCalledWith({
                key: 'organizationVenues.venueUpdated',
                namespace: 'translation',
              });
            });
          });

          test('handles form submission with undefined venueData in edit mode', async () => {
            const user = userEvent.setup();
            const editPropsWithUndefinedVenueData = {
              ...editProps,
              venueData: undefined,
            };

            const mockLink = new StaticMockLink(MOCKS, true);
            renderVenueModal(editPropsWithUndefinedVenueData, mockLink);

            await act(async () => {
              await user.click(screen.getByTestId('updateVenueBtn'));
            });

            expect(screen.getByTestId('updateVenueBtn')).toBeInTheDocument();
          });

          test('handles description truncation', async () => {
            renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
            const descInput = screen.getByPlaceholderText(
              'Enter Venue Description',
            );

            const longDescription = 'a'.repeat(600);

            await act(async () => {
              await userEvent.type(descInput, longDescription);
            });

            expect(descInput).toHaveValue(longDescription.slice(0, 500));
          });

          test('handles mutation errors with custom error messages', async () => {
            const user = userEvent.setup();
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

            renderVenueModal(
              defaultProps,
              new StaticMockLink([errorMock], true),
            );

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
              await user.click(screen.getByTestId('createVenueBtn'));
            });

            await waitFor(() => {
              expect(NotificationToast.error).toHaveBeenCalled();
            });
          });

          test('handles file input with no files selected', async () => {
            const user = userEvent.setup();
            renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
            const fileInput = screen.getByTestId('venueImgUrl');

            await user.upload(fileInput, []);

            expect(screen.queryByRole('img')).not.toBeInTheDocument();
          });

          test('handles file input with empty files array', async () => {
            const user = userEvent.setup();
            renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
            const fileInput = screen.getByTestId('venueImgUrl');

            await user.upload(fileInput, []);

            expect(screen.queryByRole('img')).not.toBeInTheDocument();
          });

          test('handles image preview URL cleanup on component unmount', async () => {
            const { unmount } = renderVenueModal(
              defaultProps,
              new StaticMockLink(MOCKS, true),
            );

            const file = new File(['test'], 'test.png', { type: 'image/png' });
            const fileInput = screen.getByTestId('venueImgUrl');

            await act(async () => {
              await userEvent.upload(fileInput, file);
            });

            await waitFor(() => {
              expect(screen.getByRole('img')).toBeInTheDocument();
            });

            expect(() => unmount()).not.toThrow();
          });

          test('handles venueData with undefined capacity', async () => {
            const propsWithUndefinedCapacity = {
              ...editProps,
              venueData: {
                node: {
                  id: 'venue1',
                  name: 'Venue 1',
                  description: 'Test Description',
                  capacity: undefined,
                  image: null,
                },
              },
            };

            renderVenueModal(
              propsWithUndefinedCapacity,
              new StaticMockLink(MOCKS, true),
            );

            expect(
              screen.getByPlaceholderText('Enter Venue Capacity'),
            ).toHaveValue('');
          });

          test('handles venueData with null capacity', async () => {
            const propsWithNullCapacity = {
              ...editProps,
              venueData: {
                node: {
                  id: 'venue1',
                  name: 'Venue 1',
                  description: 'Test Description',
                  capacity: undefined,
                  image: null,
                },
              },
            };

            renderVenueModal(
              propsWithNullCapacity,
              new StaticMockLink(MOCKS, true),
            );

            expect(
              screen.getByPlaceholderText('Enter Venue Capacity'),
            ).toHaveValue('');
          });

          test('handles venueData with undefined image', async () => {
            const propsWithUndefinedImage = {
              ...editProps,
              venueData: {
                node: {
                  id: 'venue1',
                  name: 'Venue 1',
                  description: 'Test Description',
                  capacity: 100,
                  image: undefined,
                },
              },
            };

            renderVenueModal(
              propsWithUndefinedImage,
              new StaticMockLink(MOCKS, true),
            );

            expect(screen.queryByRole('img')).not.toBeInTheDocument();
          });

          test('handles venueData with empty string image', async () => {
            const propsWithEmptyImage = {
              ...editProps,
              venueData: {
                node: {
                  id: 'venue1',
                  name: 'Venue 1',
                  description: 'Test Description',
                  capacity: 100,
                  image: '',
                },
              },
            };

            renderVenueModal(
              propsWithEmptyImage,
              new StaticMockLink(MOCKS, true),
            );

            expect(screen.queryByRole('img')).not.toBeInTheDocument();
          });

          test('handles form submission without attachments in create mode', async () => {
            const user = userEvent.setup();
            const createVenueWithoutAttachmentsMock = {
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

            renderVenueModal(
              defaultProps,
              new StaticMockLink([createVenueWithoutAttachmentsMock], true),
            );

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
              await user.click(screen.getByTestId('createVenueBtn'));
            });

            await waitFor(() => {
              expect(NotificationToast.success).toHaveBeenCalledWith({
                key: 'organizationVenuesNotification.venueCreated',
                namespace: 'translation',
              });
            });
          });

          test('handles form submission without attachments in edit mode', async () => {
            const user = userEvent.setup();

            const updateVenueWithoutAttachmentsMock = {
              request: {
                query: UPDATE_VENUE_MUTATION,
                variables: {
                  id: 'venue1',
                  name: 'Updated Venue',
                  capacity: 200,
                  description: 'Updated description for venue 1',
                },
              },
              result: { data: { updateVenue: { id: 'venue1' } } },
            };

            renderVenueModal(
              editProps,
              new StaticMockLink([updateVenueWithoutAttachmentsMock], true),
            );

            const nameInput = screen.getByLabelText(/name of the venue/i);
            const capacityInput = screen.getByLabelText(/capacity/i);

            await user.clear(nameInput);
            await user.type(nameInput, 'Updated Venue');

            await user.clear(capacityInput);
            await user.type(capacityInput, '200');

            await user.click(screen.getByTestId('updateVenueBtn'));

            await waitFor(() => {
              expect(NotificationToast.success).toHaveBeenCalledWith({
                key: 'organizationVenues.venueUpdated',
                namespace: 'translation',
              });
            });
          });

          test('handles clearImageInput when imagePreviewUrl is not a blob URL', async () => {
            const user = userEvent.setup();
            // Set a non-blob URL
            const propsWithNonBlobImage = {
              ...defaultProps,
              venueData: {
                node: {
                  id: 'venue1',
                  name: 'Venue 1',
                  description: 'Test Description',
                  capacity: 100,
                  image: 'https://example.com/image.jpg',
                },
              },
            };

            renderVenueModal(
              propsWithNonBlobImage,
              new StaticMockLink(MOCKS, true),
            );

            await act(async () => {
              await user.click(screen.getByTestId('closeimage'));
            });

            expect(screen.queryByRole('img')).not.toBeInTheDocument();
          });

          test('handles capacity validation with zero value', async () => {
            const user = userEvent.setup();
            const emptyMocks: never[] = [];
            renderVenueModal(
              defaultProps,
              new StaticMockLink(emptyMocks, true),
            );

            await user.type(
              screen.getByPlaceholderText('Enter Venue Name'),
              'Test Venue',
            );
            await user.type(
              screen.getByPlaceholderText('Enter Venue Capacity'),
              '0',
            );

            await act(async () => {
              await user.click(screen.getByTestId('createVenueBtn'));
            });

            await waitFor(() => {
              expect(NotificationToast.error).toHaveBeenCalledWith({
                key: 'organizationVenues.venueCapacityError',
                namespace: 'translation',
              });
            });
          });

          test('handles capacity validation with negative value', async () => {
            const user = userEvent.setup();
            const emptyMocks: never[] = [];
            renderVenueModal(
              defaultProps,
              new StaticMockLink(emptyMocks, true),
            );

            await user.type(
              screen.getByPlaceholderText('Enter Venue Name'),
              'Test Venue',
            );
            await user.type(
              screen.getByPlaceholderText('Enter Venue Capacity'),
              '-5',
            );

            await act(async () => {
              await user.click(screen.getByTestId('createVenueBtn'));
            });

            await waitFor(() => {
              expect(NotificationToast.error).toHaveBeenCalledWith({
                key: 'organizationVenues.venueCapacityError',
                namespace: 'translation',
              });
            });
          });

          test('handles capacity validation with decimal value', async () => {
            const user = userEvent.setup();
            const createVenueWithDecimalCapacityMock = {
              request: {
                query: CREATE_VENUE_MUTATION,
                variables: {
                  name: 'Test Venue',
                  description: '',
                  capacity: 10,
                  organizationId: 'orgId',
                },
              },
              result: { data: { createVenue: { id: 'newVenue' } } },
            };

            renderVenueModal(
              defaultProps,
              new StaticMockLink([createVenueWithDecimalCapacityMock], true),
            );

            await user.type(
              screen.getByPlaceholderText('Enter Venue Name'),
              'Test Venue',
            );
            await user.type(
              screen.getByPlaceholderText('Enter Venue Capacity'),
              '10.5',
            );

            await act(async () => {
              await user.click(screen.getByTestId('createVenueBtn'));
            });

            await waitFor(() => {
              expect(NotificationToast.success).toHaveBeenCalledWith({
                key: 'organizationVenuesNotification.venueCreated',
                namespace: 'translation',
              });
            });
          });

          test('handles capacity validation with string that cannot be parsed', async () => {
            const user = userEvent.setup();
            const emptyMocks: never[] = [];
            renderVenueModal(
              defaultProps,
              new StaticMockLink(emptyMocks, true),
            );

            await user.type(
              screen.getByPlaceholderText('Enter Venue Name'),
              'Test Venue',
            );
            await user.type(
              screen.getByPlaceholderText('Enter Venue Capacity'),
              'not-a-number',
            );

            await act(async () => {
              await user.click(screen.getByTestId('createVenueBtn'));
            });

            await waitFor(() => {
              expect(NotificationToast.error).toHaveBeenCalledWith({
                key: 'organizationVenues.venueCapacityError',
                namespace: 'translation',
              });
            });
          });

          test('handles URL creation error in useEffect', async () => {
            const originalURL = global.URL;
            global.URL = class extends URL {
              constructor() {
                super('about:blank');
                throw new Error('Invalid URL');
              }
            } as unknown as typeof URL;

            const propsWithInvalidImage = {
              ...editProps,
              venueData: {
                node: {
                  id: 'venue1',
                  name: 'Venue 1',
                  description: 'Test Description',
                  capacity: 100,
                  image: 'invalid-image-url',
                },
              },
            };

            renderVenueModal(
              propsWithInvalidImage,
              new StaticMockLink(MOCKS, true),
            );

            await waitFor(() => {
              expect(NotificationToast.error).toHaveBeenCalledWith({
                key: 'unknownError',
                namespace: 'errors',
              });
            });

            global.URL = originalURL;
          });

          test('handles file upload with file too large', async () => {
            renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

            const largeFile = new File(
              ['x'.repeat(6 * 1024 * 1024)],
              'large.png',
              { type: 'image/png' },
            );
            const fileInput = screen.getByTestId('venueImgUrl');

            await act(async () => {
              await userEvent.upload(fileInput, largeFile);
            });

            await waitFor(() => {
              expect(NotificationToast.error).toHaveBeenCalledWith({
                key: 'fileTooLarge',
                namespace: 'errors',
              });
            });
          });

          test('handles file upload with empty file', async () => {
            renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

            const emptyFile = new File([], 'empty.png', { type: 'image/png' });
            const fileInput = screen.getByTestId('venueImgUrl');

            await act(async () => {
              await userEvent.upload(fileInput, emptyFile);
            });

            await waitFor(() => {
              expect(NotificationToast.error).toHaveBeenCalledWith({
                key: 'emptyFile',
                namespace: 'errors',
              });
            });
          });

          test('handles form submission with unchanged name in edit mode', async () => {
            const user = userEvent.setup();

            const updateVenueUnchangedNameMock = {
              request: {
                query: UPDATE_VENUE_MUTATION,
                variables: {
                  id: 'venue1',
                  capacity: 150,
                  description: 'Updated description for venue 1',
                },
              },
              result: { data: { updateVenue: { id: 'venue1' } } },
            };

            renderVenueModal(
              editProps,
              new StaticMockLink([updateVenueUnchangedNameMock], true),
            );

            const capacityInput = screen.getByDisplayValue('100');

            await user.clear(capacityInput);
            await user.type(capacityInput, '150');

            await user.click(screen.getByTestId('updateVenueBtn'));

            await waitFor(() => {
              expect(NotificationToast.success).toHaveBeenCalledWith({
                key: 'organizationVenues.venueUpdated',
                namespace: 'translation',
              });
            });
          });

          test('handles clearImageInput with blob URL cleanup', async () => {
            const user = userEvent.setup();
            const revokeObjectURLSpy = vi.fn();
            const createObjectURLSpy = vi.fn().mockReturnValue('blob:mock-url');
            global.URL.revokeObjectURL = revokeObjectURLSpy;
            global.URL.createObjectURL = createObjectURLSpy;

            renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

            const file = new File(['test'], 'test.png', { type: 'image/png' });
            const fileInput = screen.getByTestId('venueImgUrl');

            await user.upload(fileInput, file);

            const clearButton = screen.getByTestId('closeimage');
            await act(async () => {
              await user.click(clearButton);
            });

            expect(revokeObjectURLSpy).toHaveBeenCalled();
          });

          test('handles component unmount with blob URL cleanup', async () => {
            const revokeObjectURLSpy = vi.fn();
            const createObjectURLSpy = vi.fn().mockReturnValue('blob:mock-url');
            global.URL.revokeObjectURL = revokeObjectURLSpy;
            global.URL.createObjectURL = createObjectURLSpy;

            const { unmount } = renderVenueModal(
              defaultProps,
              new StaticMockLink(MOCKS, true),
            );
            const file = new File(['test'], 'test.png', { type: 'image/png' });
            const fileInput = screen.getByTestId('venueImgUrl');

            await userEvent.upload(fileInput, file);

            unmount();

            expect(revokeObjectURLSpy).toHaveBeenCalled();
          });

          test('handles file upload with existing blob URL cleanup', async () => {
            const user = userEvent.setup();
            const revokeObjectURLSpy = vi.fn();
            const createObjectURLSpy = vi.fn().mockReturnValue('blob:mock-url');
            global.URL.revokeObjectURL = revokeObjectURLSpy;
            global.URL.createObjectURL = createObjectURLSpy;

            renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

            const file1 = new File(['test1'], 'test1.png', {
              type: 'image/png',
            });
            const fileInput = screen.getByTestId('venueImgUrl');

            await user.upload(fileInput, file1);

            const file2 = new File(['test2'], 'test2.png', {
              type: 'image/png',
            });

            await user.upload(fileInput, file2);

            expect(revokeObjectURLSpy).toHaveBeenCalled();
          });

          test('handles mutation error with alreadyExists message', async () => {
            const user = userEvent.setup();
            const createVenueAlreadyExistsMock = {
              request: {
                query: CREATE_VENUE_MUTATION,
                variables: {
                  name: 'Test Venue',
                  description: 'Test Description',
                  capacity: 100,
                  organizationId: 'orgId',
                },
              },
              error: new Error('alreadyExists'),
            };

            renderVenueModal(
              defaultProps,
              new StaticMockLink([createVenueAlreadyExistsMock], true),
            );

            await act(async () => {
              await user.type(
                screen.getByPlaceholderText('Enter Venue Name'),
                'Test Venue',
              );
              await user.type(
                screen.getByPlaceholderText('Enter Venue Description'),
                'Test Description',
              );
              await user.type(
                screen.getByPlaceholderText('Enter Venue Capacity'),
                '100',
              );
              await user.click(screen.getByTestId('createVenueBtn'));
            });

            await waitFor(() => {
              expect(NotificationToast.error).toHaveBeenCalledWith({
                key: 'organizationVenuesNotification.venueNameExists',
                namespace: 'translation',
              });
            });
          });

          test('handles mutation error with alreadyExists message and translation', async () => {
            const user = userEvent.setup();
            const createVenueAlreadyExistsMock = {
              request: {
                query: CREATE_VENUE_MUTATION,
                variables: {
                  name: 'Test Venue',
                  description: 'Test Description',
                  capacity: 100,
                  organizationId: 'orgId',
                },
              },
              error: new Error('alreadyExists'),
            };

            renderVenueModal(
              defaultProps,
              new StaticMockLink([createVenueAlreadyExistsMock], true),
            );

            await act(async () => {
              await user.type(
                screen.getByPlaceholderText('Enter Venue Name'),
                'Test Venue',
              );
              await user.type(
                screen.getByPlaceholderText('Enter Venue Description'),
                'Test Description',
              );
              await user.type(
                screen.getByPlaceholderText('Enter Venue Capacity'),
                '100',
              );
              await user.click(screen.getByTestId('createVenueBtn'));
            });

            await waitFor(() => {
              expect(NotificationToast.error).toHaveBeenCalledWith({
                key: 'organizationVenuesNotification.venueNameExists',
                namespace: 'translation',
              });
            });
          });

          test('handles form submission with name change in edit mode', async () => {
            const user = userEvent.setup();

            const updateVenueWithNameChangeMock = {
              request: {
                query: UPDATE_VENUE_MUTATION,
                variables: {
                  id: 'venue1',
                  name: 'New Venue Name',
                  capacity: 100,
                  description: 'Updated description for venue 1',
                },
              },
              result: { data: { updateVenue: { id: 'venue1' } } },
            };

            renderVenueModal(
              editProps,
              new StaticMockLink([updateVenueWithNameChangeMock], true),
            );

            const nameInput = screen.getByDisplayValue('Venue 1');

            await user.clear(nameInput);
            await user.type(nameInput, 'New Venue Name');

            await user.click(screen.getByTestId('updateVenueBtn'));

            await waitFor(() => {
              expect(NotificationToast.success).toHaveBeenCalledWith({
                key: 'organizationVenues.venueUpdated',
                namespace: 'translation',
              });
            });
          });

          test('handles capacity validation error in edit mode when name unchanged', async () => {
            const user = userEvent.setup();
            renderVenueModal(editProps, new StaticMockLink(MOCKS, true));

            const capacityInput = screen.getByDisplayValue('100');

            await user.clear(capacityInput);
            await user.type(capacityInput, 'invalid');

            await user.click(screen.getByTestId('updateVenueBtn'));

            await waitFor(() => {
              expect(NotificationToast.error).toHaveBeenCalledWith({
                key: 'organizationVenues.venueCapacityError',
                namespace: 'translation',
              });
            });
          });

          test('handles updateVenue mutation with falsy result data', async () => {
            const user = userEvent.setup();
            const falsyResultMock = {
              request: {
                query: UPDATE_VENUE_MUTATION,
                variables: {
                  id: 'venue1',
                  capacity: 100,
                  description: 'Updated description',
                },
              },
              result: { data: { updateVenue: null } },
            };

            renderVenueModal(
              editProps,
              new StaticMockLink([falsyResultMock], true),
            );

            await act(async () => {
              await user.type(screen.getByDisplayValue('100'), '100');
              await user.click(screen.getByTestId('updateVenueBtn'));
            });

            expect(NotificationToast.success).not.toHaveBeenCalled();
          });

          test('handles createVenue mutation with falsy result data', async () => {
            const user = userEvent.setup();
            const falsyResultMock = {
              request: {
                query: CREATE_VENUE_MUTATION,
                variables: {
                  name: 'Test Venue',
                  capacity: 100,
                  description: 'Test description',
                  organizationId: 'orgId',
                },
              },
              result: { data: { createVenue: null } },
            };

            renderVenueModal(
              defaultProps,
              new StaticMockLink([falsyResultMock], true),
            );

            await act(async () => {
              await user.type(
                screen.getByPlaceholderText('Enter Venue Name'),
                'Test Venue',
              );
              await user.type(
                screen.getByPlaceholderText('Enter Venue Description'),
                'Test description',
              );
              await user.type(
                screen.getByPlaceholderText('Enter Venue Capacity'),
                '100',
              );
              await user.click(screen.getByTestId('createVenueBtn'));
            });

            expect(NotificationToast.success).not.toHaveBeenCalled();
          });

          test('handles error with fallback message when translation fails', async () => {
            const user = userEvent.setup();

            const errorMock = {
              request: {
                query: CREATE_VENUE_MUTATION,
                variables: {
                  name: 'Test Venue',
                  capacity: 100,
                  description: 'Test description',
                  organizationId: 'orgId',
                },
              },
              result: {
                errors: [new GraphQLError('alreadyExists')],
              },
            };

            renderVenueModal(
              defaultProps,
              new StaticMockLink([errorMock], true),
            );

            await user.type(
              screen.getByPlaceholderText('Enter Venue Name'),
              'Test Venue',
            );
            await user.type(
              screen.getByPlaceholderText('Enter Venue Description'),
              'Test description',
            );
            await user.type(
              screen.getByPlaceholderText('Enter Venue Capacity'),
              '100',
            );

            await user.click(screen.getByTestId('createVenueBtn'));

            await waitFor(() => {
              expect(NotificationToast.error).toHaveBeenCalledWith({
                key: 'organizationVenuesNotification.venueNameExists',
                namespace: 'translation',
              });
            });

            await user.click(screen.getByTestId('modal-secondary-btn'));
          });

          test('handles empty description in form submission', async () => {
            const user = userEvent.setup();

            const emptyDescriptionMock = {
              request: {
                query: UPDATE_VENUE_MUTATION,
                variables: {
                  id: 'venue1',
                  capacity: 100,
                  description: '',
                },
              },
              result: { data: { updateVenue: { id: 'venue1' } } },
            };

            renderVenueModal(
              editProps,
              new StaticMockLink([emptyDescriptionMock], true),
            );

            const descInput = screen.getByDisplayValue(
              'Updated description for venue 1',
            );

            await user.clear(descInput);

            await user.click(screen.getByTestId('updateVenueBtn'));

            await waitFor(() => {
              expect(NotificationToast.success).toHaveBeenCalledWith({
                key: 'organizationVenues.venueUpdated',
                namespace: 'translation',
              });
            });
          });

          test('handles file input ref clearing in clearImageInput', async () => {
            const user = userEvent.setup();
            renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

            const file = new File(['test'], 'test.png', { type: 'image/png' });
            const fileInput = screen.getByTestId('venueImgUrl');

            await user.upload(fileInput, file);

            const clearButton = screen.getByTestId('closeimage');
            await act(async () => {
              await user.click(clearButton);
            });

            expect((fileInput as HTMLInputElement).value).toBe('');
          });

          test('handles form submission with null description in edit mode', async () => {
            const user = userEvent.setup();

            const updateVenueWithNullDescriptionMock = {
              request: {
                query: UPDATE_VENUE_MUTATION,
                variables: {
                  id: 'venue1',
                  capacity: 100,
                  description: '',
                },
              },
              result: { data: { updateVenue: { id: 'venue1' } } },
            };

            renderVenueModal(
              editProps,
              new StaticMockLink([updateVenueWithNullDescriptionMock], true),
            );

            const descInput = screen.getByDisplayValue(
              'Updated description for venue 1',
            );

            await user.clear(descInput);

            await user.click(screen.getByTestId('updateVenueBtn'));

            await waitFor(() => {
              expect(NotificationToast.success).toHaveBeenCalledWith({
                key: 'organizationVenues.venueUpdated',
                namespace: 'translation',
              });
            });
          });

          test('handles form submission with null description in create mode', async () => {
            const user = userEvent.setup();

            const createVenueWithNullDescriptionMock = {
              request: {
                query: CREATE_VENUE_MUTATION,
                variables: {
                  name: 'Test Venue',
                  capacity: 100,
                  description: '',
                  organizationId: 'orgId',
                },
              },
              result: { data: { createVenue: { id: 'newVenue' } } },
            };

            renderVenueModal(
              defaultProps,
              new StaticMockLink([createVenueWithNullDescriptionMock], true),
            );

            await user.type(
              screen.getByPlaceholderText('Enter Venue Name'),
              'Test Venue',
            );

            const descInput = screen.getByPlaceholderText(
              'Enter Venue Description',
            );
            await user.clear(descInput);

            await user.type(
              screen.getByPlaceholderText('Enter Venue Capacity'),
              '100',
            );

            await user.click(screen.getByTestId('createVenueBtn'));

            await waitFor(() => {
              expect(NotificationToast.success).toHaveBeenCalledWith({
                key: 'organizationVenuesNotification.venueCreated',
                namespace: 'translation',
              });
            });
          });
        });
      });
    });

    test('submits venue WITH attachments successfully', async () => {
      const user = userEvent.setup();
      // Use a flexible link that doesn't strictly match File objects
      const mutationSpy = vi.fn().mockResolvedValue({
        data: { createVenue: { id: 'newVenue' } },
      });

      const flexibleLink = new ApolloLink((operation) => {
        const variables = operation.variables;

        if (variables.attachments && variables.attachments.length > 0) {
          expect(variables.attachments[0]).toBeInstanceOf(File);
        }

        mutationSpy(variables);
        return Observable.of({
          data: { createVenue: { id: 'newVenue' } },
        });
      });

      render(
        <MockedProvider link={flexibleLink} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...defaultProps} />
          </I18nextProvider>
        </MockedProvider>,
      );

      await user.type(
        screen.getByPlaceholderText('Enter Venue Name'),
        'Test Venue',
      );
      await user.type(
        screen.getByPlaceholderText('Enter Venue Capacity'),
        '100',
      );

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = screen.getByTestId('venueImgUrl');
      await userEvent.upload(fileInput, file);

      await act(async () => {
        await user.click(screen.getByTestId('createVenueBtn'));
      });

      await waitFor(() => {
        expect(mutationSpy).toHaveBeenCalled();
        const callArgs = mutationSpy.mock.calls[0][0];
        expect(callArgs.attachments).toBeDefined();
        expect(callArgs.attachments.length).toBe(1);
      });
    });

    test('handles unchanged name in edit mode - correct mock', async () => {
      const user = userEvent.setup();

      const unchangedNameMock = {
        request: {
          query: UPDATE_VENUE_MUTATION,
          variables: {
            id: 'venue1',
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
              capacity: 150,
            },
          },
        },
      };

      renderVenueModal(
        editProps,
        new StaticMockLink([unchangedNameMock], true),
      );

      const capacityInput = screen.getByLabelText(/capacity/i);
      await user.clear(capacityInput);
      await user.type(capacityInput, '150');

      // Description
      const descInput = screen.getByLabelText(/description/i);
      await user.clear(descInput);
      await user.type(descInput, 'Changed description');

      await user.click(screen.getByTestId('updateVenueBtn'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith({
          key: 'organizationVenues.venueUpdated',
          namespace: 'translation',
        });
      });
    });

    test('updates venue with changed name and attachments', async () => {
      const user = userEvent.setup();
      const file = new File(['test'], 'test.png', { type: 'image/png' });

      // Create a flexible mock using ApolloLink
      const mutationSpy = vi.fn().mockReturnValue(
        Observable.of({
          data: {
            updateVenue: {
              id: 'venue1',
              name: 'New Venue Name',
              description: 'Updated description for venue 1',
              capacity: 100,
            },
          },
        }),
      );

      const flexibleLink = new ApolloLink((operation) => {
        const vars = operation.variables;

        // Verify the operation includes all expected fields
        expect(vars.id).toBe('venue1');
        expect(vars.name).toBe('New Venue Name');
        expect(vars.capacity).toBe(100);
        expect(vars.attachments).toBeDefined();
        expect(vars.attachments[0]).toBeInstanceOf(File);

        return mutationSpy();
      });

      const client = new ApolloClient({
        link: flexibleLink,
        cache: new InMemoryCache(),
      });

      render(
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...editProps} />
          </I18nextProvider>
        </ApolloProvider>,
      );

      const nameInput = screen.getByDisplayValue('Venue 1');
      await user.clear(nameInput);
      await user.type(nameInput, 'New Venue Name');

      // Upload file
      const fileInput = screen.getByTestId('venueImgUrl');
      await user.upload(fileInput, file);

      // Submit
      await user.click(screen.getByTestId('updateVenueBtn'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith({
          key: 'organizationVenues.venueUpdated',
          namespace: 'translation',
        });
      });
    });

    test('creates venue with attachments successfully', async () => {
      const user = userEvent.setup();
      const file = new File(['test'], 'test.png', { type: 'image/png' });

      const mutationSpy = vi.fn().mockReturnValue(
        Observable.of({
          data: {
            createVenue: {
              id: 'newVenue',
              name: 'New Venue',
              description: 'Test Description',
              capacity: 100,
            },
          },
        }),
      );

      const flexibleLink = new ApolloLink((operation) => {
        const vars = operation.variables;

        // Verify all fields including attachments
        expect(vars.name).toBe('New Venue');
        expect(vars.capacity).toBe(100);
        expect(vars.description).toBe('Test Description');
        expect(vars.organizationId).toBe('orgId');
        expect(vars.attachments).toBeDefined();
        expect(vars.attachments.length).toBe(1);
        expect(vars.attachments[0]).toBeInstanceOf(File);

        return mutationSpy();
      });

      render(
        <MockedProvider link={flexibleLink} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...defaultProps} />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Fill form
      await user.type(
        screen.getByPlaceholderText('Enter Venue Name'),
        'New Venue',
      );
      await user.type(
        screen.getByPlaceholderText('Enter Venue Description'),
        'Test Description',
      );
      await user.type(
        screen.getByPlaceholderText('Enter Venue Capacity'),
        '100',
      );

      // Upload file
      const fileInput = screen.getByTestId('venueImgUrl');
      await act(async () => {
        await userEvent.upload(fileInput, file);
      });

      await act(async () => {
        await user.click(screen.getByTestId('createVenueBtn'));
      });

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith({
          key: 'organizationVenuesNotification.venueCreated',
          namespace: 'translation',
        });
      });
    });

    test('clears blob URL when clearing image preview', async () => {
      const user = userEvent.setup();
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');
      const createObjectURLSpy = vi
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue('blob:http://localhost/test-blob');

      const { unmount } = render(
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...defaultProps} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = screen.getByTestId('venueImgUrl');

      await act(async () => {
        await user.upload(fileInput, file);
      });

      expect(createObjectURLSpy).toHaveBeenCalled();

      const clearButton = screen.getByTestId('closeimage');
      await act(async () => {
        await user.click(clearButton);
      });

      expect(revokeObjectURLSpy).toHaveBeenCalledWith(
        'blob:http://localhost/test-blob',
      );

      unmount();
      revokeObjectURLSpy.mockRestore();
      createObjectURLSpy.mockRestore();
    });

    test('cleans up blob URL when component unmounts', async () => {
      const user = userEvent.setup();
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');
      const createObjectURLSpy = vi
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue('blob:http://localhost/unmount-test');

      const { unmount } = render(
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...defaultProps} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = screen.getByTestId('venueImgUrl');

      await act(async () => {
        await user.upload(fileInput, file);
      });

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      revokeObjectURLSpy.mockClear();

      unmount();

      expect(revokeObjectURLSpy).toHaveBeenCalledWith(
        'blob:http://localhost/unmount-test',
      );

      revokeObjectURLSpy.mockRestore();
      createObjectURLSpy.mockRestore();
    });

    test('handles updateVenue mutation with falsy result data', async () => {
      const user = userEvent.setup();
      const falsyResultMock = {
        request: {
          query: UPDATE_VENUE_MUTATION,
          variables: {
            id: 'venue1',
            name: 'Updated Venue Name',
            capacity: 100,
            description: 'Updated description',
          },
        },
        result: {
          data: {
            updateVenue: null,
          },
        },
      };

      renderVenueModal(editProps, new StaticMockLink([falsyResultMock], true));

      await user.type(
        screen.getByDisplayValue('Venue 1'),
        'Updated Venue Name',
      );
      await user.type(screen.getByDisplayValue('100'), '100');

      await act(async () => {
        await user.click(screen.getByTestId('updateVenueBtn'));
      });

      await waitFor(() => {
        expect(NotificationToast.success).not.toHaveBeenCalled();
      });
    });

    test('covers line 134 - update success when name unchanged', async () => {
      const user = userEvent.setup();
      const venueData = {
        node: {
          id: 'venue1',
          name: 'Original Name',
          description: 'Original description',
          capacity: 100,
          image: null,
        },
      };

      const updateMock = {
        request: {
          query: UPDATE_VENUE_MUTATION,
          variables: {
            id: 'venue1',
            capacity: 150,
            description: 'Updated description',
          },
        },
        result: {
          data: {
            updateVenue: {
              id: 'venue1',
              name: 'Original Name',
              description: 'Updated description',
              capacity: 150,
            },
          },
        },
      };

      const editProps = {
        show: true,
        onHide: vi.fn(),
        refetchVenues: vi.fn(),
        orgId: 'orgId',
        venueData: venueData,
        edit: true,
      };

      render(
        <MockedProvider mocks={[updateMock]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...editProps} />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('Original Name')).toBeInTheDocument();
      });

      const capacityInput = screen.getByDisplayValue('100');
      const descInput = screen.getByDisplayValue('Original description');

      await act(async () => {
        await user.clear(capacityInput);
        await user.type(capacityInput, '150');

        await user.clear(descInput);
        await user.type(descInput, 'Updated description');
      });

      const updateBtn = screen.getByTestId('updateVenueBtn');

      await act(async () => {
        await user.click(updateBtn);
      });

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });
    });

    test('covers line 169 - create venue success', async () => {
      const user = userEvent.setup();
      const createMock = {
        request: {
          query: CREATE_VENUE_MUTATION,
          variables: {
            name: 'Brand New Venue',
            capacity: 200,
            description: 'Test description',
            organizationId: 'orgId',
          },
        },
        result: {
          data: {
            createVenue: {
              id: 'new-venue-123',
              name: 'Brand New Venue',
              capacity: 200,
              description: 'Test description',
            },
          },
        },
      };

      const createProps = {
        show: true,
        onHide: vi.fn(),
        refetchVenues: vi.fn(),
        orgId: 'orgId',
        edit: false,
      };

      render(
        <MockedProvider mocks={[createMock]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...createProps} />
          </I18nextProvider>
        </MockedProvider>,
      );

      await act(async () => {
        await user.type(
          screen.getByPlaceholderText(/Enter Venue Name/i),
          'Brand New Venue',
        );
        await user.type(
          screen.getByPlaceholderText(/Enter Venue Capacity/i),
          '200',
        );
        await user.type(
          screen.getByPlaceholderText(/Enter Venue Description/i),
          'Test description',
        );
      });

      const createBtn = screen.getByTestId('createVenueBtn');

      await act(async () => {
        await user.click(createBtn);
      });

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });
    });

    test('covers line 198 - blob URL cleanup when clearing image', async () => {
      const user = userEvent.setup();
      const createObjectURLMock = vi.fn(
        () => 'blob:http://localhost:3000/test-uuid',
      );
      const revokeObjectURLMock = vi.fn();

      global.URL.createObjectURL = createObjectURLMock;
      global.URL.revokeObjectURL = revokeObjectURLMock;

      const props = {
        show: true,
        onHide: vi.fn(),
        refetchVenues: vi.fn(),
        orgId: 'orgId',
        edit: false,
      };

      const { unmount } = render(
        <MockedProvider mocks={[]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...props} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const file = new File(['dummy content'], 'test.png', {
        type: 'image/png',
      });
      const fileInput = screen.getByTestId('venueImgUrl');

      await act(async () => {
        await user.upload(fileInput, file);
      });

      await waitFor(() => {
        expect(createObjectURLMock).toHaveBeenCalledWith(file);
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      const clearBtn = screen.getByTestId('closeimage');

      await act(async () => {
        await user.click(clearBtn);
      });

      expect(revokeObjectURLMock).toHaveBeenCalledWith(
        'blob:http://localhost:3000/test-uuid',
      );

      unmount();
    });

    test('covers line 223 - blob URL cleanup on unmount', async () => {
      const createObjectURLMock = vi.fn(
        () => 'blob:http://localhost:3000/unmount-test',
      );
      const revokeObjectURLMock = vi.fn();

      global.URL.createObjectURL = createObjectURLMock;
      global.URL.revokeObjectURL = revokeObjectURLMock;

      const props = {
        show: true,
        onHide: vi.fn(),
        refetchVenues: vi.fn(),
        orgId: 'orgId',
        edit: false,
      };

      const { unmount } = render(
        <MockedProvider mocks={[]} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...props} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const file = new File(['dummy content'], 'test.png', {
        type: 'image/png',
      });
      const fileInput = screen.getByTestId('venueImgUrl');

      await act(async () => {
        await userEvent.upload(fileInput, file);
      });

      await waitFor(() => {
        expect(createObjectURLMock).toHaveBeenCalled();
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      revokeObjectURLMock.mockClear();
      await act(async () => {
        unmount();
      });

      expect(revokeObjectURLMock).toHaveBeenCalledWith(
        'blob:http://localhost:3000/unmount-test',
      );
    });
  });
});
