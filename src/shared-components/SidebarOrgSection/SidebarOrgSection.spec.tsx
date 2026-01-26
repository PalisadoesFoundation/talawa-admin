import React from 'react';
import { describe, it, vi, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider, type MockedResponse } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import SidebarOrgSection from './SidebarOrgSection';
import type { ISidebarOrgSectionProps } from 'types/shared-components/SidebarOrgSection/interface';
import { GET_ORGANIZATION_BASIC_DATA } from 'GraphQl/Queries/Queries';
import dayjs from 'dayjs';

// Mock Avatar component
vi.mock('shared-components/Avatar/Avatar', () => ({
  default: ({ name, alt }: { name: string; alt: string }) => (
    <div data-testid="avatar" data-name={name} data-alt={alt}>
      Avatar: {name}
    </div>
  ),
}));

// Mock SVG icon
vi.mock('assets/svgs/angleRight.svg?react', () => ({
  default: ({ fill }: { fill: string }) => (
    <div data-testid="angle-right-icon" data-fill={fill} />
  ),
}));

// Mock translations
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, options?: { entity?: string; name?: string }) => {
        if (options?.entity) return `Error loading ${options.entity}`;
        if (key === 'picture' && options?.name)
          return `${options.name} Picture`;
        return key;
      },
    }),
  };
});
describe('SidebarOrgSection Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockOrgId = '123456';

  const mockOrganizationData = {
    organization: {
      id: '123456',
      name: 'Test Organization',
      description: 'Test Description',
      addressLine1: '123 Test St',
      addressLine2: 'Suite 100',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      countryCode: 'US',
      avatarURL: 'https://example.com/avatar.png',
      // Use dynamic dates to avoid test staleness
      createdAt: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
      isUserRegistrationRequired: false,
      __typename: 'Organization',
    },
  };

  const mockOrganizationWithoutAvatar = {
    organization: {
      ...mockOrganizationData.organization,
      avatarURL: null,
    },
  };

  const mockOrganizationWithoutCity = {
    organization: {
      ...mockOrganizationData.organization,
      city: null,
    },
  };

  const successMocks = [
    {
      request: {
        query: GET_ORGANIZATION_BASIC_DATA,
        variables: { id: mockOrgId },
      },
      result: {
        data: mockOrganizationData,
      },
    },
  ];

  const loadingMocks = [
    {
      request: {
        query: GET_ORGANIZATION_BASIC_DATA,
        variables: { id: mockOrgId },
      },
      delay: 1000000, // Very long delay to keep in loading state
      result: {
        data: mockOrganizationData,
      },
    },
  ];

  const errorMocks = [
    {
      request: {
        query: GET_ORGANIZATION_BASIC_DATA,
        variables: { id: mockOrgId },
      },
      result: {
        data: { organization: null },
      },
    },
  ];

  const noAvatarMocks = [
    {
      request: {
        query: GET_ORGANIZATION_BASIC_DATA,
        variables: { id: mockOrgId },
      },
      result: {
        data: mockOrganizationWithoutAvatar,
      },
    },
  ];

  const noCityMocks = [
    {
      request: {
        query: GET_ORGANIZATION_BASIC_DATA,
        variables: { id: mockOrgId },
      },
      result: {
        data: mockOrganizationWithoutCity,
      },
    },
  ];

  const renderComponent = (
    props: Partial<ISidebarOrgSectionProps> = {},
    mocks: ReadonlyArray<MockedResponse> = successMocks,
  ) => {
    const defaultProps = {
      orgId: mockOrgId,
      hideDrawer: false,
      isProfilePage: false,
    };

    return render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18n}>
          <SidebarOrgSection {...defaultProps} {...props} />
        </I18nextProvider>
      </MockedProvider>,
    );
  };

  describe('Visibility', () => {
    it('returns null when drawer is hidden', () => {
      const { container } = renderComponent({ hideDrawer: true });
      expect(container.firstChild).toBeNull();
    });

    it('renders when drawer is not hidden', () => {
      renderComponent({ hideDrawer: false });
      expect(screen.getByTestId('orgBtn')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows shimmer loading state while fetching data', () => {
      renderComponent({}, loadingMocks);
      const loadingButton = screen.getByTestId('orgBtn');
      expect(loadingButton.className).toContain('shimmer');
    });

    it('has correct button type during loading', () => {
      renderComponent({}, loadingMocks);
      const loadingButton = screen.getByTestId('orgBtn');
      expect(loadingButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Error State', () => {
    it('shows error message when organization data is not available', async () => {
      renderComponent({ isProfilePage: false }, errorMocks);
      await waitFor(() => {
        expect(
          screen.getByText(/Error loading Organization/i),
        ).toBeInTheDocument();
      });
    });

    it('does not show error on profile page when data is not available', async () => {
      renderComponent({ isProfilePage: true }, errorMocks);
      await waitFor(() => {
        expect(
          screen.queryByText(/Error loading Organization/i),
        ).not.toBeInTheDocument();
      });
    });

    it('error button is disabled', async () => {
      renderComponent({ isProfilePage: false }, errorMocks);
      await waitFor(() => {
        const errorContainer = screen
          .getByText(/Error loading Organization/i)
          .closest('button');
        expect(errorContainer).toBeDisabled();
      });
    });

    it('error button has correct styling', async () => {
      renderComponent({ isProfilePage: false }, errorMocks);
      await waitFor(() => {
        const errorButton = screen
          .getByText(/Error loading Organization/i)
          .closest('button');
        expect(errorButton?.className).toContain('bgDanger');
        expect(errorButton?.className).toContain('text-white');
      });
    });
  });

  describe('Success State', () => {
    it('renders organization name', async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('Test Organization')).toBeInTheDocument();
      });
    });

    it('renders organization city', async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('Test City')).toBeInTheDocument();
      });
    });

    it('renders N/A when city is null', async () => {
      renderComponent({}, noCityMocks);
      await waitFor(() => {
        expect(screen.getByText('N/A')).toBeInTheDocument();
      });
    });

    it('renders organization avatar image when avatarURL is provided', async () => {
      renderComponent();
      await waitFor(() => {
        const img = screen.getByAltText('Test Organization');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://example.com/avatar.png');
      });
    });

    it('sets correct image attributes for security', async () => {
      renderComponent();
      await waitFor(() => {
        const img = screen.getByAltText('Test Organization');
        expect(img).toHaveAttribute('crossOrigin', 'anonymous');
        expect(img).toHaveAttribute('referrerPolicy', 'no-referrer');
        expect(img).toHaveAttribute('loading', 'lazy');
        expect(img).toHaveAttribute('decoding', 'async');
      });
    });

    it('renders Avatar component when avatarURL is not provided', async () => {
      renderComponent({}, noAvatarMocks);
      await waitFor(() => {
        const avatar = screen.getByTestId('avatar');
        expect(avatar).toBeInTheDocument();
        expect(avatar).toHaveAttribute('data-name', 'Test Organization');
      });
    });

    it('renders angle right icon', async () => {
      renderComponent();
      await waitFor(() => {
        const icon = screen.getByTestId('angle-right-icon');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('data-fill', 'var(--bs-secondary)');
      });
    });

    it('has correct button testId', async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('OrgBtn')).toBeInTheDocument();
      });
    });

    it('has correct button type', async () => {
      renderComponent();
      await waitFor(() => {
        const button = screen.getByTestId('OrgBtn');
        expect(button).toHaveAttribute('type', 'button');
      });
    });
  });

  describe('GraphQL Query', () => {
    it('calls query with correct variables', async () => {
      const customOrgId = 'customOrg123';
      renderComponent({ orgId: customOrgId }, [
        {
          request: {
            query: GET_ORGANIZATION_BASIC_DATA,
            variables: { id: customOrgId },
          },
          result: {
            data: mockOrganizationData,
          },
        },
      ]);

      await waitFor(() => {
        expect(screen.getByTestId('OrgBtn')).toBeInTheDocument();
      });
    });
  });

  describe('Layout Structure', () => {
    it('has correct container class', () => {
      renderComponent();
      const container = screen.getByTestId('orgBtn').parentElement;
      expect(container?.className).toContain('organizationContainer');
      expect(container?.className).toContain('pe-3');
    });

    it('has correct profile container class in success state', async () => {
      renderComponent();
      await waitFor(() => {
        const button = screen.getByTestId('OrgBtn');
        expect(button.className).toContain('profileContainer');
      });
    });

    it('has image container for avatar', async () => {
      renderComponent();
      await waitFor(() => {
        const button = screen.getByTestId('OrgBtn');
        // Verify structure exists by checking the button has content
        expect(button).toBeInTheDocument();
        expect(screen.getByAltText('Test Organization')).toBeInTheDocument();
      });
    });

    it('has profile text container', async () => {
      renderComponent();
      await waitFor(() => {
        // Verify both name and city are present
        expect(screen.getByText('Test Organization')).toBeInTheDocument();
        expect(screen.getByText('Test City')).toBeInTheDocument();
      });
    });
  });
});
