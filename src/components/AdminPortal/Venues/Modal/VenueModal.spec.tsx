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
import {
  NotificationToastMessage,
  InterfaceNotificationToastI18nMessage,
} from 'types/shared-components/NotificationToast/interface';

import type { InterfaceVenueModalProps } from './VenueModal';
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
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
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

const delayedMockClient = new ApolloClient({
  link: new ApolloLink((_operation) => {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          data: { createVenue: { id: '1', name: 'Test Venue' } },
        });
        observer.complete();
      }, 100);
    });
  }),
  cache: new InMemoryCache(),
});

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
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
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

    await user.click(screen.getByTestId('createVenueBtn'));

    await waitFor(() => {
      // Should use the fallback message
      expect(NotificationToast.error).toHaveBeenCalled();
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
    await user.upload(fileInput, file);

    await user.click(screen.getByTestId('closeimage'));

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

// Basic Rendering Tests
describe('Rendering', () => {
  const user = userEvent.setup();
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
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
    await user.click(screen.getByTestId('modalCloseBtn'));
    expect(defaultProps.onHide).toHaveBeenCalled();
  });
});

// Form Field Tests
describe('Form Fields', () => {
  const user = userEvent.setup();
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

    await user.click(screen.getByTestId('createVenueBtn'));

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
});

// Image Handling Tests
describe('Image Handling', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let errorCalls: NotificationToastMessage[] = [];
  let originalError: typeof NotificationToast.error;
  let originalCreateObjectURL: typeof URL.createObjectURL;

  beforeEach(() => {
    user = userEvent.setup();
    originalCreateObjectURL = URL.createObjectURL;

    URL.createObjectURL = (file: File) => {
      return `blob://fake-url/${file.name}`;
    };

    errorCalls = [];

    originalError = NotificationToast.error;
    NotificationToast.error = ((
      message: NotificationToastMessage,
      _options?: unknown,
    ) => {
      errorCalls.push(message);
      return 0 as unknown as ReturnType<typeof NotificationToast.error>;
    }) as typeof NotificationToast.error;
  });

  afterEach(() => {
    NotificationToast.error = originalError;
    URL.createObjectURL = originalCreateObjectURL;

    vi.clearAllMocks();
  });

  test('displays image preview and clear button when an image is selected', async () => {
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('venueImgUrl');

    await user.upload(fileInput, file);

    // Wait for the image preview to appear (local preview, no upload needed)
    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByTestId('closeimage')).toBeInTheDocument();
    });
  });

  test('removes image preview when clear button is clicked and tests fileInputRef is null', async () => {
    // Create component with custom fileInputRef mock
    const originalUseRef = React.useRef;
    const refValue = { current: document.createElement('input') };

    vi.spyOn(React, 'useRef').mockImplementation((initialValue) => {
      if (initialValue === null) {
        return refValue;
      }
      return originalUseRef(initialValue);
    });

    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('venueImgUrl');

    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    refValue.current = null as unknown as HTMLInputElement;

    await user.click(screen.getByTestId('closeimage'));

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByTestId('closeimage')).not.toBeInTheDocument();

    vi.restoreAllMocks();
  });

  test('shows error when uploading file larger than 5MB', async () => {
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

    const largeFile = new File(
      ['x'.repeat(6 * 1024 * 1024)],
      'large-image.png',
      { type: 'image/png' },
    );

    await user.upload(screen.getByTestId('venueImgUrl'), largeFile);

    await waitFor(() => {
      const found = errorCalls.some(
        (call) =>
          typeof call === 'object' &&
          call !== null &&
          call.key === 'fileTooLarge' &&
          call.namespace === 'errors',
      );

      if (!found) {
        throw new Error(
          'NotificationToast.error not called for file too large',
        );
      }
    });
  });

  test('shows error when uploading non-image file', async () => {
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

    const input = screen.getByTestId('venueImgUrl') as HTMLInputElement;

    const originalAccept = input.getAttribute('accept');
    input.removeAttribute('accept');

    const pdfFile = new File(['test content'], 'document.pdf', {
      type: 'application/pdf',
    });

    await user.upload(input, pdfFile);

    await waitFor(() => {
      const found = errorCalls.some(
        (call) =>
          typeof call === 'object' &&
          call !== null &&
          call.key === 'invalidFileType' &&
          call.namespace === 'errors',
      );

      if (!found) {
        throw new Error(
          'NotificationToast.error not called for invalid file type',
        );
      }
    });

    if (originalAccept) {
      input.setAttribute('accept', originalAccept);
    }
  });

  test('shows error toast when creating preview URL fails', async () => {
    const originalCreateObjectURL = URL.createObjectURL;

    URL.createObjectURL = (() => {
      throw new Error('Invalid URL');
    }) as typeof URL.createObjectURL;

    try {
      renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

      const fileInput = screen.getByTestId('venueImgUrl');
      const imageFile = new File(['fake-image-content'], 'image.png', {
        type: 'image/png',
      });

      await user.upload(fileInput, imageFile);

      await waitFor(() => {
        const found = errorCalls.some(
          (call): call is InterfaceNotificationToastI18nMessage => {
            // Narrow to object type
            return (
              typeof call === 'object' &&
              call !== null &&
              'key' in call &&
              'namespace' in call
            );
          },
        );

        if (!found) {
          throw new Error(
            'NotificationToast.error not called for preview URL failure',
          );
        }
      });
    } finally {
      URL.createObjectURL = originalCreateObjectURL;
    }
  });

  test('shows error toast when an empty file is selected', async () => {
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

    const emptyFile = new File([], 'empty.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('venueImgUrl');

    await user.upload(fileInput, emptyFile);

    await waitFor(() => {
      const found = errorCalls.some(
        (call) =>
          typeof call === 'object' &&
          call !== null &&
          'key' in call &&
          call.key === 'emptyFile' &&
          call.namespace === 'errors',
      );

      if (!found)
        throw new Error('NotificationToast.error not called for empty file');
    });

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

// Validation Tests

describe('Validation', () => {
  const user = userEvent.setup();
  test('shows error when venue name is empty', async () => {
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

    await user.type(screen.getByPlaceholderText('Enter Venue Capacity'), '100');

    await user.click(screen.getByTestId('createVenueBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith({
        key: 'organizationVenues.venueTitleError',
        namespace: 'translation',
      });
    });
  });

  test('shows error when venue capacity is not a positive number', async () => {
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

    await user.type(
      screen.getByPlaceholderText('Enter Venue Name'),
      'Test Venue',
    );
    await user.type(screen.getByPlaceholderText('Enter Venue Capacity'), '-1');

    await user.click(screen.getByTestId('createVenueBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith({
        key: 'organizationVenues.venueCapacityError',
        namespace: 'translation',
      });
    });
  });

  test('validates capacity edge cases', async () => {
    renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

    // Test zero capacity
    await user.type(
      screen.getByPlaceholderText('Enter Venue Name'),
      'Test Venue',
    );
    await user.type(screen.getByPlaceholderText('Enter Venue Capacity'), '0');

    await user.click(screen.getByTestId('createVenueBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith({
        key: 'organizationVenues.venueCapacityError',
        namespace: 'translation',
      });
    });
  });

  // Mutation Tests
  describe('Mutations', () => {
    const user = userEvent.setup();

    test('submit button disables during mutation loading state', async () => {
      render(
        <ApolloProvider client={delayedMockClient}>
          <VenueModal
            show={true}
            onHide={() => {}}
            refetchVenues={() => {}}
            orgId="org1"
            edit={false}
            venueData={null}
          />
        </ApolloProvider>,
      );

      const nameInput = screen.getByTestId('venueTitleInput');
      const descInput = screen.getByPlaceholderText('Enter Venue Description');
      const capacityInput = screen.getByPlaceholderText('Enter Venue Capacity');
      const submitButton = screen.getByTestId('createVenueBtn');

      await user.type(nameInput, 'Test Venue');
      await user.type(descInput, 'Some Description');
      await user.type(capacityInput, '100');

      expect(submitButton).not.toBeDisabled();

      await user.click(submitButton);

      expect(submitButton).toBeDisabled();

      await waitFor(() => expect(submitButton).not.toBeDisabled(), {
        timeout: 2000,
      });
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

      await user.click(screen.getByTestId('createVenueBtn'));

      // No success toast should be called with null data
      expect(NotificationToast.success).not.toHaveBeenCalled();

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

      await user.click(screen.getByTestId('createVenueBtn'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith({
          key: 'organizationVenuesNotification.venueCreated',
          namespace: 'translation',
        });
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

      await user.type(screen.getByDisplayValue('Venue 1'), 'Updated Venue');
      await user.type(
        screen.getByDisplayValue('Updated description for venue 1'),
        'Updated description',
      );
      await user.type(screen.getByDisplayValue('100'), '200');

      await user.click(screen.getByTestId('updateVenueBtn'));

      // No success toast should be called with null data
      expect(NotificationToast.success).not.toHaveBeenCalled();
    });

    test('handles duplicate venue name error with translation key', async () => {
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

      await user.click(screen.getByTestId('createVenueBtn'));

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith({
          key: 'organizationVenuesNotification.venueNameExists',
          namespace: 'translation',
        });
      });
    });

    test('handles network error during venue creation', async () => {
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

      await user.click(screen.getByTestId('createVenueBtn'));

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalled();
      });
    });
  });

  // Update Tests
  describe('Venue Updates', () => {
    const user = userEvent.setup();

    test('shows success toast when an existing venue is updated', async () => {
      renderVenueModal(editProps, new StaticMockLink(MOCKS, true));

      const nameInput = screen.getByTestId('venueTitleInput');
      const descriptionInput = screen.getByRole('textbox', {
        name: /description/i,
      });
      const capacityInput = screen.getByRole('textbox', { name: /capacity/i });

      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Venue');

      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Updated description');

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
            capacity: 100,
            description: null, // Changed to null from undefined
            image: null, // Changed to null from undefined
          },
        },
      };

      renderVenueModal(
        customEditProps,
        new StaticMockLink(editMockWithFallbacks, true),
      );

      const nameInput = screen.getByTestId('venueTitleInput');
      const capacityInput = screen.getByRole('textbox', { name: /capacity/i });

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

    test('handles multiple successive updates correctly', async () => {
      const mockLink = new StaticMockLink(MOCKS, true);
      const onHide = vi.fn();
      const refetchVenues = vi.fn();

      const props = { ...editProps, onHide, refetchVenues };

      renderVenueModal(props, mockLink);

      const nameInput = screen.getByTestId('venueTitleInput');

      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Venue 1');

      await user.click(screen.getByTestId('updateVenueBtn'));

      await waitFor(() => {
        expect(refetchVenues).toHaveBeenCalledTimes(1);
      });

      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Venue 2');

      await user.click(screen.getByTestId('updateVenueBtn'));

      await waitFor(() => {
        expect(refetchVenues).toHaveBeenCalledTimes(2);
        expect(onHide).toHaveBeenCalledTimes(2);
      });
    });

    test('handles unchanged name in edit mode', async () => {
      renderVenueModal(editProps, new StaticMockLink(MOCKS, true));

      const capacityInput = screen.getByRole('textbox', {
        name: /capacity required/i,
      });

      const descriptionInput = screen.getByRole('textbox', {
        name: /description required/i,
      });

      await user.clear(capacityInput);
      await user.type(capacityInput, '150');

      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Changed description');

      await user.click(screen.getByTestId('updateVenueBtn'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith({
          key: 'organizationVenues.venueUpdated',
          namespace: 'translation',
        });
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

        await user.type(screen.getByDisplayValue('Venue 1'), 'Updated Venue');
        await user.type(
          screen.getByDisplayValue('Updated description for venue 1'),
          'Test Description',
        );

        await user.click(screen.getByTestId('updateVenueBtn'));

        await waitFor(() => {
          expect(NotificationToast.error).toHaveBeenCalled();
        });
      });
    });

    test('handles "alreadyExists" error with fallback message', async () => {
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
        await user.type(
          screen.getByPlaceholderText('Enter Venue Name'),
          'Duplicate Venue',
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
          expect(NotificationToast.error).toHaveBeenCalled();
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

        await user.click(screen.getByTestId('updateVenueBtn'));

        await waitFor(() => {
          expect(NotificationToast.error).toHaveBeenCalled();
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

        await user.type(nameInput, 'Test Venue');
        await user.type(descInput, 'Test Description');
        await user.type(capInput, '100');

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

          await user.type(descInput, 'New Description');

          expect(descInput).toHaveValue('New Description');
        });

        test('enforces maximum length for description', async () => {
          renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
          const descInput = screen.getByPlaceholderText(
            'Enter Venue Description',
          );
          const longText = 'a'.repeat(501); // Exceeds 500 char limit

          await user.type(descInput, longText);

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

          await user.upload(fileInput, files);

          // Should only use the first file
          expect(screen.getAllByRole('img')).toHaveLength(1);
        });
        // Validation Edge Cases
        describe('Validation Edge Cases', () => {
          test('handles empty venue name', async () => {
            renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

            await user.type(
              screen.getByPlaceholderText('Enter Venue Capacity'),
              '100',
            );

            await user.click(screen.getByTestId('createVenueBtn'));

            await waitFor(() => {
              expect(NotificationToast.error).toHaveBeenCalledWith({
                key: 'organizationVenues.venueTitleError',
                namespace: 'translation',
              });
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
              await user.type(
                screen.getByPlaceholderText('Enter Venue Name'),
                'Test Venue',
              );
              await user.type(
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
              expect(NotificationToast.success).toHaveBeenCalledWith({
                key: 'organizationVenuesNotification.venueCreated',
                namespace: 'translation',
              });
            });
          });

          // Test for generic error handling when translation fails
          test('handles generic error when translation is unavailable', async () => {
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
              // Check that error handling is called for generic errors
              expect(NotificationToast.error).toHaveBeenCalled();
            });
          });
        });

        test('handles special characters in venue name', async () => {
          renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
          const nameInput = screen.getByPlaceholderText('Enter Venue Name');

          await user.type(nameInput, '!@#$%^&*()');

          expect(nameInput).toHaveValue('!@#$%^&*()');
        });

        test('handles non-numeric input for capacity', async () => {
          renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
          const capacityInput = screen.getByPlaceholderText(
            'Enter Venue Capacity',
          );

          await user.type(capacityInput, 'abc');

          await user.click(screen.getByTestId('createVenueBtn'));

          await waitFor(() => {
            expect(NotificationToast.error).toHaveBeenCalledWith({
              key: 'organizationVenues.venueTitleError',
              namespace: 'translation',
            });
          });
        });
      });

      // Error Boundary Tests
      describe('Error Handling', () => {
        const user = userEvent.setup();
        test('handles image upload with no files', async () => {
          renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
          const fileInput = screen.getByTestId('venueImgUrl');

          await user.upload(fileInput, []);

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
            await user.type(
              screen.getByPlaceholderText('Enter Venue Name'),
              'Test Venue',
            );
            await user.type(
              screen.getByPlaceholderText('Enter Venue Description'),
              '   ', // Only whitespace
            );
            await user.type(
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

          const nameInput = screen.getByDisplayValue('Original Venue');

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
          const editPropsWithUndefinedVenueData = {
            ...editProps,
            venueData: undefined,
          };

          const mockLink = new StaticMockLink(MOCKS, true);
          renderVenueModal(editPropsWithUndefinedVenueData, mockLink);

          await user.click(screen.getByTestId('updateVenueBtn'));

          // This test ensures no runtime errors occur
          expect(screen.getByTestId('updateVenueBtn')).toBeInTheDocument();
        });

        test('handles description truncation', async () => {
          renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));
          const descInput = screen.getByPlaceholderText(
            'Enter Venue Description',
          );

          const longDescription = 'a'.repeat(600); // More than 500 characters

          await user.type(descInput, longDescription);

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
            expect(NotificationToast.error).toHaveBeenCalled();
          });
        });

        test('handles file input with no files selected', async () => {
          renderVenueModal(defaultProps, new StaticMockLink(MOCKS, true));

          const fileInput = screen.getByTestId('venueImgUrl');

          await user.upload(fileInput, []);

          // Verify that no image preview is shown
          expect(screen.queryByRole('img')).not.toBeInTheDocument();
        });
      });
    });

    test('submits venue WITH attachments successfully', async () => {
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
      await user.upload(fileInput, file);

      await user.click(screen.getByTestId('createVenueBtn'));

      await waitFor(() => {
        expect(mutationSpy).toHaveBeenCalled();
        const callArgs = mutationSpy.mock.calls[0][0];
        expect(callArgs.attachments).toBeDefined();
        expect(callArgs.attachments.length).toBe(1);
      });
    });

    test('handles unchanged name in edit mode - correct mock', async () => {
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

      const capacityInput = await screen.findByLabelText(/capacity/i);
      const descInput = await screen.findByLabelText(/description/i);

      await waitFor(() => {
        expect(capacityInput).toHaveValue('100');
      });

      await user.clear(capacityInput);
      await user.type(capacityInput, '150');

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
      const file = new File(['test'], 'test.png', { type: 'image/png' });

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

        expect(vars.id).toBe('venue1');
        expect(vars.name).toBe('New Venue Name');
        expect(vars.capacity).toBe(100);
        expect(vars.attachments).toBeDefined();
        expect(vars.attachments[0]).toBeInstanceOf(File);

        return mutationSpy();
      });

      render(
        <MockedProvider link={flexibleLink} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <VenueModal {...editProps} />
          </I18nextProvider>
        </MockedProvider>,
      );

      const nameInput = screen.getByDisplayValue('Venue 1');

      await user.clear(nameInput);
      await user.type(nameInput, 'New Venue Name');

      const fileInput = screen.getByTestId('venueImgUrl');
      await user.upload(fileInput, file);

      await user.click(screen.getByTestId('updateVenueBtn'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith({
          key: 'organizationVenues.venueUpdated',
          namespace: 'translation',
        });
      });
    });

    test('creates venue with attachments successfully', async () => {
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

      const fileInput = screen.getByTestId('venueImgUrl');
      await user.upload(fileInput, file);

      await user.click(screen.getByTestId('createVenueBtn'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith({
          key: 'organizationVenuesNotification.venueCreated',
          namespace: 'translation',
        });
      });
    });

    test('clears blob URL when clearing image preview', async () => {
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

      await user.upload(fileInput, file);

      expect(createObjectURLSpy).toHaveBeenCalled();

      const clearButton = screen.getByTestId('closeimage');
      await user.click(clearButton);

      expect(revokeObjectURLSpy).toHaveBeenCalledWith(
        'blob:http://localhost/test-blob',
      );

      unmount();
      revokeObjectURLSpy.mockRestore();
      createObjectURLSpy.mockRestore();
    });

    test('cleans up blob URL when component unmounts', async () => {
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

      await user.upload(fileInput, file);
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

      await user.click(screen.getByTestId('updateVenueBtn'));
      await waitFor(() => {
        expect(NotificationToast.success).not.toHaveBeenCalled();
      });
    });

    test('covers line 134 - update success when name unchanged', async () => {
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

      const capacityInput = screen.getByDisplayValue('100');
      const descInput = screen.getByDisplayValue('Original description');

      await user.clear(capacityInput);
      await user.type(capacityInput, '150');

      await user.clear(descInput);
      await user.type(descInput, 'Updated description');

      const updateBtn = screen.getByTestId('updateVenueBtn');

      await user.click(updateBtn);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });
    });

    test('covers line 169 - create venue success', async () => {
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

      await user.click(createBtn);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });
    });

    test('covers line 198 - blob URL cleanup when clearing image', async () => {
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

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(createObjectURLMock).toHaveBeenCalledWith(file);
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      const clearBtn = screen.getByTestId('closeimage');

      await user.click(clearBtn);

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

      await user.upload(fileInput, file);

      await waitFor(() => {
        expect(createObjectURLMock).toHaveBeenCalled();
        expect(screen.getByRole('img')).toBeInTheDocument();
      });

      revokeObjectURLMock.mockClear();

      unmount();

      expect(revokeObjectURLMock).toHaveBeenCalledWith(
        'blob:http://localhost:3000/unmount-test',
      );
    });
  });
});
