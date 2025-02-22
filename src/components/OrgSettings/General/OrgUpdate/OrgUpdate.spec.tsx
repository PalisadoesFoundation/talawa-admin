import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18n';
import OrgUpdate from './OrgUpdate';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';

// Mock the modules
jest.mock('react-toastify');
jest.mock('utils/convertToBase64', () => ({
  __esModule: true,
  default: async () => 'base64String',
}));

describe('OrgUpdate Component', () => {
  const mockOrgId = 'org123';
  const mockOrganization = {
    id: mockOrgId,
    name: 'Test Org',
    description: 'Test Description',
    addressLine1: '123 Main St',
    addressLine2: 'Suite 100',
    city: 'Test City',
    state: 'Test State',
    postalCode: '12345',
    countryCode: 'US',
    avatarURL: null,
  };

  const mocks = [
    {
      request: {
        query: ORGANIZATIONS_LIST,
        variables: { input: { id: mockOrgId } },
      },
      result: {
        data: {
          organization: mockOrganization,
        },
      },
    },
    {
      request: {
        query: UPDATE_ORGANIZATION_MUTATION,
        variables: {
          input: {
            id: mockOrgId,
            name: 'Updated Org',
            description: 'Updated Description',
            addressLine1: '123 Main St',
            addressLine2: 'Suite 100',
            city: 'Test City',
            state: 'Test State',
            postalCode: '12345',
            countryCode: 'US',
            avatar: null,
          },
        },
      },
      result: {
        data: {
          updateOrganization: {
            organization: {
              ...mockOrganization,
              name: 'Updated Org',
              description: 'Updated Description',
            },
          },
        },
      },
    },
  ];

  const renderComponent = (): ReturnType<typeof render> => {
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId={mockOrgId} />
        </I18nextProvider>
      </MockedProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    renderComponent();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays organization data after loading', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    });
  });

  it('handles form input changes', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue('Test Org');
    fireEvent.change(nameInput, { target: { value: 'Updated Org' } });
    expect(nameInput).toHaveValue('Updated Org');
  });

  it('handles successful organization update', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('save-org-changes-btn'));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('displays error state when query fails', async () => {
    const errorMock = [
      {
        request: {
          query: ORGANIZATIONS_LIST,
          variables: { input: { id: mockOrgId } },
        },
        error: new Error('Failed to fetch organization'),
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId={mockOrgId} />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Error occured while loading Organization Data/i),
      ).toBeInTheDocument();
    });
  });

  it('handles image upload', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByTestId('organisationImage')).toBeInTheDocument();
    });

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('organisationImage'), {
      target: { files: [file] },
    });
  });
});
