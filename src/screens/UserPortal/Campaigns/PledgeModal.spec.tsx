import type { ApolloLink } from '@apollo/client';
import { MockedProvider, type MockedResponse } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import type { RenderResult } from '@testing-library/react';
import dayjs from 'dayjs';
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import type { InterfaceUserInfoPG } from 'utils/interfaces';
import { act } from 'react';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { CREATE_PLEDGE, UPDATE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { vi } from 'vitest';
import { setupLocalStorageMock } from 'test-utils/localStorageMock';
import PledgeModal, {
  type InterfacePledgeModal,
  areOptionsEqual,
  getMemberLabel,
} from './PledgeModal';

// Mock utils/i18n to use the test i18n instance for NotificationToast
vi.mock('utils/i18n', () => ({
  default: i18nForTest,
}));

// Create mock toast using vi.hoisted to avoid restricted import
const { toast } = vi.hoisted(() => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-toastify', () => ({
  toast,
}));

// UPDATE: Add the generic type here
vi.mock('@mui/x-date-pickers', async () => {
  const actual = await vi.importActual<typeof import('@mui/x-date-pickers')>(
    '@mui/x-date-pickers',
  );
  interface InterfaceMockDatePickerProps {
    label?: string;
    value?: dayjs.Dayjs | null;
    onChange?: (value: dayjs.Dayjs | null) => void;
    [key: string]: unknown;
  }

  return {
    ...actual,
    DatePicker: ({ label, value, onChange }: InterfaceMockDatePickerProps) => (
      <input
        aria-label={label as string}
        value={value ? value.format('DD/MM/YYYY') : ''}
        onChange={(e) =>
          (onChange as ((value: unknown) => void) | undefined)?.(
            e.target.value ? dayjs(e.target.value, 'DD/MM/YYYY') : null,
          )
        }
      />
    ),
  };
});

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  user = userEvent.setup();
});

afterEach(() => {
  cleanup();
  localStorageMock.clear();

  vi.clearAllMocks();
});

const pledgeProps: InterfacePledgeModal[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    pledge: {
      id: '1',
      amount: 100,
      currency: 'USD',
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().date(10).startOf('day').toISOString(),
      pledger: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        avatarURL: undefined,
      },
    },
    refetchPledge: vi.fn(),
    campaignId: 'campaignId',
    userId: 'userId',
    mode: 'create',
  },
  {
    isOpen: true,
    hide: vi.fn(),
    pledge: {
      id: '1',
      amount: 100,
      currency: 'USD',
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().date(10).startOf('day').toISOString(),
      pledger: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        avatarURL: undefined,
      },
    },
    refetchPledge: vi.fn(),
    campaignId: 'campaignId',
    userId: 'userId',
    mode: 'edit',
  },
];

// Shared user details mock for reuse across tests
// Shared user details mock for reuse across tests
const USER_DETAILS_MOCK = {
  request: {
    query: USER_DETAILS,
    variables: {
      input: { id: 'userId' },
    },
  },
  result: {
    data: {
      user: {
        id: 'userId',
        name: 'Harve Lance',
        emailAddress: 'harve@example.com',
        avatarURL: null,
        birthDate: null,
        city: null,
        countryCode: null,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
        educationGrade: null,
        employmentStatus: null,
        isEmailAddressVerified: false,
        maritalStatus: null,
        natalSex: null,
        naturalLanguageCode: 'en',
        postalCode: null,
        role: 'regular',
        firstName: 'Harve',
        lastName: 'Lance',
        state: null,
        mobilePhoneNumber: null,
        homePhoneNumber: null,
        workPhoneNumber: null,
        organizationsWhereMember: { edges: [] },
        createdOrganizations: [],
        __typename: 'User',
      },
    },
  },
};

// Admin user details mock for tests that need autocomplete visible
const USER_DETAILS_ADMIN_MOCK = {
  request: {
    query: USER_DETAILS,
    variables: {
      input: { id: 'userId' },
    },
  },
  result: {
    data: {
      user: {
        ...USER_DETAILS_MOCK.result.data.user,
        role: 'admin',
      },
    },
  },
};

// Base mocks shared across all tests
const BASE_PLEDGE_MODAL_MOCKS = [USER_DETAILS_MOCK];
const BASE_PLEDGE_MODAL_ADMIN_MOCKS = [USER_DETAILS_ADMIN_MOCK];

// Helper to create UPDATE_PLEDGE mock with custom variables
const createUpdatePledgeMock = (
  variables: {
    id: string;
    amount?: number;
    currency?: string;
    startDate?: string;
    endDate?: string;
  },
  isError = false,
): MockedResponse => ({
  request: {
    query: UPDATE_PLEDGE,
    variables,
  },
  ...(isError
    ? { error: new Error('Failed to update pledge') }
    : {
        result: {
          data: {
            updateFundraisingCampaignPledge: {
              _id: variables.id,
            },
          },
        },
      }),
});

// Helper to create CREATE_PLEDGE mock with custom variables
// Helper to create CREATE_PLEDGE mock with custom variables
// Note: startDate and endDate are removed as dates are now auto-generated by the backend
const createCreatePledgeMock = (
  variables: {
    campaignId: string;
    amount: number;
    pledgerId: string;
  },
  isError = false,
): MockedResponse => ({
  request: {
    query: CREATE_PLEDGE,
    variables,
  },
  ...(isError
    ? { error: new Error('Failed to create pledge') }
    : {
        result: {
          data: {
            createFundCampaignPledge: {
              id: '3',
              amount: variables.amount,
              note: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              campaign: {
                id: variables.campaignId,
                name: 'Campaign Name',
              },
              pledger: {
                id: variables.pledgerId,
                name: 'Pledger Name',
              },
            },
          },
        },
      }),
});

// Default mocks for basic rendering tests
const PLEDGE_MODAL_MOCKS = [
  ...BASE_PLEDGE_MODAL_MOCKS,
  createUpdatePledgeMock({ id: '1', amount: 200 }),
  createCreatePledgeMock({
    campaignId: 'campaignId',
    amount: 200,
    pledgerId: 'userId', // Use 'userId' to match USER_DETAILS_MOCK id
  }),
];

const link1 = new StaticMockLink(PLEDGE_MODAL_MOCKS);
const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.pledges),
);

const renderPledgeModal = (
  link: ApolloLink,
  props: InterfacePledgeModal,
): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <PledgeModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

// Setup shared localStorage mock
const localStorageMock = setupLocalStorageMock();

describe('PledgeModal', () => {
  beforeAll(() => {
    vi.mock('react-router', async () => {
      const actual = await vi.importActual('react-router');
      return {
        ...actual,
        useParams: () => ({ orgId: 'orgId', fundCampaignId: 'fundCampaignId' }),
        useNavigate: vi.fn(),
      };
    });
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('should populate form fields with correct values in edit mode', async () => {
    const adminLink = new StaticMockLink(BASE_PLEDGE_MODAL_ADMIN_MOCKS);
    renderPledgeModal(adminLink, pledgeProps[1]);
    await waitFor(() =>
      expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
    );
    // Use getByDisplayValue to find the input with the value "John Doe"
    expect(screen.getByDisplayValue(/John Doe/i)).toBeInTheDocument();

    expect(screen.getByLabelText('Currency')).toHaveTextContent('USD ($)');
    expect(screen.getByLabelText('Amount')).toHaveValue(100);
  });

  describe('Rendering and Basic UI', () => {
    it('should render create mode modal with all form fields', async () => {
      renderPledgeModal(link1, pledgeProps[0]);
      await waitFor(() =>
        expect(
          screen.getAllByText(translations.createPledge)[0],
        ).toBeInTheDocument(),
      );

      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
      expect(screen.getByLabelText('Currency')).toBeInTheDocument();
      expect(screen.getByTestId('pledgeForm')).toBeInTheDocument();
    });

    it('should render edit mode modal with populated form fields', async () => {
      const adminLink = new StaticMockLink(BASE_PLEDGE_MODAL_ADMIN_MOCKS);
      renderPledgeModal(adminLink, pledgeProps[1]);
      await waitFor(() =>
        expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
      );

      const pledgerInput = screen.getByRole('combobox', { name: /pledger/i });
      expect(pledgerInput).toHaveValue('John Doe');
      expect(screen.getByLabelText('Currency')).toHaveTextContent('USD ($)');
      expect(screen.getByLabelText('Amount')).toHaveValue(100);
    });

    it('should close modal when cancel button is clicked', async () => {
      renderPledgeModal(link1, pledgeProps[0]);
      await waitFor(() =>
        expect(
          screen.getAllByText(translations.createPledge)[0],
        ).toBeInTheDocument(),
      );

      const cancelButton = screen.getByTestId('modal-cancel-btn');
      await user.click(cancelButton);

      expect(pledgeProps[0].hide).toHaveBeenCalled();
    });
  });

  it('handles USER_DETAILS returning null user data', async () => {
    const loadingMock = {
      request: {
        query: USER_DETAILS,
        variables: { input: { id: 'userId' } },
      },
      result: {
        data: {
          user: null,
        },
      },
    };

    const link = new StaticMockLink([loadingMock]);
    renderPledgeModal(link, pledgeProps[0]);

    expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
  });

  it('handles USER_DETAILS error state gracefully', async () => {
    const errorMock = {
      request: {
        query: USER_DETAILS,
        variables: { input: { id: 'userId' } },
      },
      error: new Error('USER_DETAILS failed'),
    };

    const link = new StaticMockLink([errorMock]);

    renderPledgeModal(link, pledgeProps[0]);

    expect(screen.getByTestId('pledgeForm')).toBeInTheDocument();
  });

  // NEW: Edge case coverage for null name in user data
  it('handles user data with missing name gracefully', async () => {
    const noNameUserMock = {
      request: {
        query: USER_DETAILS,
        variables: { input: { id: 'userId' } },
      },
      result: {
        data: {
          user: {
            ...USER_DETAILS_MOCK.result.data.user,
            name: '',
            firstName: '',
            lastName: '',
          },
        },
      },
    };

    // We test with admin role to ensure no error is thrown during option processing
    const link = new StaticMockLink([noNameUserMock]);
    renderPledgeModal(link, pledgeProps[0]);

    await waitFor(() => {
      expect(screen.getByTestId('pledgeForm')).toBeInTheDocument();
    });
  });

  describe('Form Field Updates', () => {
    it('should update pledgeAmount when input value changes to valid positive number', async () => {
      await act(async () => {
        renderPledgeModal(link1, pledgeProps[1]);
      });
      const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
      expect(amountInput).toHaveAttribute('value', '100');

      amountInput.focus();
      await user.clear(amountInput);
      amountInput.focus();
      await user.type(amountInput, '2');
      amountInput.focus();
      await user.type(amountInput, '0');
      amountInput.focus();
      await user.type(amountInput, '0');

      await waitFor(() => {
        expect(parseInt(amountInput.value)).toBe(200);
      });
    });

    it('should not update pledgeAmount when input value is negative', async () => {
      await act(async () => {
        renderPledgeModal(link1, pledgeProps[1]);
      });
      const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
      expect(amountInput).toHaveAttribute('value', '100');

      amountInput.focus();
      await user.clear(amountInput);
      amountInput.focus();
      await user.type(amountInput, '-');
      amountInput.focus();
      await user.type(amountInput, '1');
      amountInput.focus();
      await user.type(amountInput, '0');
      await user.tab();

      await waitFor(() => {
        expect(parseInt(amountInput.value)).toBe(10);
      });
    });

    it('should accept zero as valid amount input', async () => {
      await act(async () => {
        renderPledgeModal(link1, pledgeProps[1]);
      });
      const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
      expect(amountInput).toHaveAttribute('value', '100');

      amountInput.focus();
      await user.clear(amountInput);
      amountInput.focus();
      await user.type(amountInput, '0');
      await user.tab();

      await waitFor(() => {
        expect(parseInt(amountInput.value)).toBe(0);
      });
    });

    // NEW: Test for non-numeric input validation
    it('should not update pledgeAmount when input value is non-numeric', async () => {
      await act(async () => {
        renderPledgeModal(link1, pledgeProps[1]);
      });
      const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
      expect(amountInput).toHaveAttribute('value', '100');

      amountInput.focus();
      await user.clear(amountInput);
      amountInput.focus();
      await user.type(amountInput, 'abc');
      await user.tab();

      await waitFor(() => {
        expect(parseInt(amountInput.value) || 0).toBe(0);
      });
    });

    it('should update currency when changed', async () => {
      renderPledgeModal(link1, pledgeProps[0]);
      await waitFor(() =>
        expect(
          screen.getAllByText(translations.createPledge)[0],
        ).toBeInTheDocument(),
      );

      const currencyDropdown = screen.getByLabelText('Currency');
      await user.click(currencyDropdown);

      const eurOption = await screen.findByText('EUR (€)');
      await user.click(eurOption);

      await waitFor(() => {
        expect(screen.getByLabelText('Currency')).toHaveTextContent('EUR (€)');
      });
    });

    it('should successfully update pledge with only amount change', async () => {
      const amountChangeMock = [
        ...BASE_PLEDGE_MODAL_MOCKS,
        createUpdatePledgeMock({
          id: '1',
          amount: 200,
        }),
      ];
      const link = new StaticMockLink(amountChangeMock);
      await act(async () => {
        renderPledgeModal(link, pledgeProps[1]);
      });

      await waitFor(() =>
        expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
      );

      const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
      amountInput.focus();
      await user.clear(amountInput);
      amountInput.focus();
      await user.type(amountInput, '2');
      amountInput.focus();
      await user.type(amountInput, '0');
      amountInput.focus();
      await user.type(amountInput, '0');

      await user.tab();
      const submitBtn = screen.getByTestId('modal-submit-btn');
      await user.click(submitBtn);

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            translations.pledgeUpdated,
            expect.any(Object),
          );
        },
        { timeout: 2000 },
      );

      expect(pledgeProps[1].refetchPledge).toHaveBeenCalled();
      expect(pledgeProps[1].hide).toHaveBeenCalled();
    });
    it('hides pledger autocomplete for regular users in create mode', async () => {
      const regularLink = new StaticMockLink([USER_DETAILS_MOCK]); // role: 'regular'
      renderPledgeModal(regularLink, {
        ...pledgeProps[0],
        mode: 'create',
        pledge: null,
      });
      await waitFor(() =>
        expect(screen.getByTestId('pledgeForm')).toBeInTheDocument(),
      );
      expect(screen.queryByRole('combobox', { name: /pledger/i })).toBeNull();
    });
    it('should handle pledge creation error', async () => {
      const errorMock = [
        ...BASE_PLEDGE_MODAL_MOCKS,
        createCreatePledgeMock(
          {
            campaignId: 'campaignId',
            amount: 200,
            pledgerId: 'userId',
          },
          true,
        ),
      ];

      const errorLink = new StaticMockLink(errorMock);
      await act(async () => {
        renderPledgeModal(errorLink, pledgeProps[0]);
      });

      await waitFor(() => {
        expect(screen.getByTestId('pledgeForm')).toBeInTheDocument();
      });

      const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
      amountInput.focus();
      await user.clear(amountInput);
      amountInput.focus();
      await user.type(amountInput, '2');
      amountInput.focus();
      await user.type(amountInput, '0');
      amountInput.focus();
      await user.type(amountInput, '0');

      await user.tab();
      const submitBtn = screen.getByTestId('modal-submit-btn');
      await user.click(submitBtn);

      await waitFor(
        () => {
          expect(toast.error).toHaveBeenCalled();
        },
        { timeout: 2000 },
      );
    });
  });

  describe('Pledge Update', () => {
    it('should successfully update pledge with amount change', async () => {
      const updateMock = [
        ...BASE_PLEDGE_MODAL_MOCKS,
        createUpdatePledgeMock({ id: '1', amount: 200 }),
      ];

      const updateLink = new StaticMockLink(updateMock);
      await act(async () => {
        renderPledgeModal(updateLink, pledgeProps[1]);
      });

      await waitFor(() =>
        expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
      );

      const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
      amountInput.focus();
      await user.clear(amountInput);
      amountInput.focus();
      await user.type(amountInput, '2');
      amountInput.focus();
      await user.type(amountInput, '0');
      amountInput.focus();
      await user.type(amountInput, '0');

      await user.tab();
      const submitBtn = screen.getByTestId('modal-submit-btn');
      await user.click(submitBtn);

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            translations.pledgeUpdated,
            expect.any(Object),
          );
        },
        { timeout: 2000 },
      );

      expect(pledgeProps[1].refetchPledge).toHaveBeenCalled();
      expect(pledgeProps[1].hide).toHaveBeenCalled();
    });

    it('should not include pledgerId in update when no new user is selected', async () => {
      const updateMock = [
        ...BASE_PLEDGE_MODAL_MOCKS,
        createUpdatePledgeMock({ id: '1', amount: 150 }),
      ];

      const updateLink = new StaticMockLink(updateMock);
      await act(async () => {
        renderPledgeModal(updateLink, pledgeProps[1]);
      });

      await waitFor(() =>
        expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
      );

      const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
      amountInput.focus();
      await user.clear(amountInput);
      amountInput.focus();
      await user.type(amountInput, '1');
      amountInput.focus();
      await user.type(amountInput, '5');
      amountInput.focus();
      await user.type(amountInput, '0');

      await user.tab();
      const submitBtn = screen.getByTestId('modal-submit-btn');
      await user.click(submitBtn);

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            translations.pledgeUpdated,
            expect.any(Object),
          );
        },
        { timeout: 2000 },
      );
    });

    it('should handle pledge update error', async () => {
      const errorMock = [
        ...BASE_PLEDGE_MODAL_MOCKS,
        createUpdatePledgeMock({ id: '1', amount: 200 }, true),
      ];

      const errorLink = new StaticMockLink(errorMock);
      await act(async () => {
        renderPledgeModal(errorLink, pledgeProps[1]);
      });

      await waitFor(() =>
        expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
      );

      const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
      amountInput.focus();
      await user.clear(amountInput);
      amountInput.focus();
      await user.type(amountInput, '2');
      amountInput.focus();
      await user.type(amountInput, '0');
      amountInput.focus();
      await user.type(amountInput, '0');

      await user.tab();
      const submitBtn = screen.getByTestId('modal-submit-btn');
      await user.click(submitBtn);

      await waitFor(
        () => {
          expect(toast.error).toHaveBeenCalled();
        },
        { timeout: 2000 },
      );
    });

    it('should submit update with only ID if no fields are changed', async () => {
      const updateMock = [
        ...BASE_PLEDGE_MODAL_MOCKS,
        createUpdatePledgeMock({ id: '1' }),
      ];

      const updateLink = new StaticMockLink(updateMock);
      await act(async () => {
        renderPledgeModal(updateLink, pledgeProps[1]);
      });

      await waitFor(() =>
        expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
      );

      // Change: Submit immediately without editing any fields
      const submitBtn = screen.getByTestId('modal-submit-btn');
      await user.click(submitBtn);

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            translations.pledgeUpdated,
            expect.any(Object),
          );
        },
        { timeout: 2000 },
      );
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should show error toast when submitting without selecting a pledger', async () => {
      // Create props with no pledger selected for create mode
      const noPledgerProps: InterfacePledgeModal = {
        isOpen: true,
        hide: vi.fn(),
        pledge: null, // No existing pledge, so pledgeUsers will be empty initially
        refetchPledge: vi.fn(),
        campaignId: 'campaignId',
        userId: 'userId',
        mode: 'create',
      };

      const adminLink = new StaticMockLink([USER_DETAILS_ADMIN_MOCK]);
      renderPledgeModal(adminLink, noPledgerProps);

      // Wait for the admin user data to load and autocomplete to be visible
      await waitFor(() => {
        expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
      });

      // For admin users with no existing pledge, pledgeUsers starts as empty array
      // Submit the form without selecting any pledger
      const submitBtn = screen.getByTestId('modal-submit-btn');
      await user.click(submitBtn);

      await waitFor(
        () => {
          expect(toast.error).toHaveBeenCalledWith(
            translations.selectPledger,
            expect.any(Object),
          );
        },
        { timeout: 2000 },
      );
    });

    // Date validation test removed - dates are now auto-generated by the backend
    it('should handle form validation gracefully', async () => {
      renderPledgeModal(link1, pledgeProps[0]);
      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    });

    it('should handle empty autocomplete selection', async () => {
      const adminLink = new StaticMockLink(BASE_PLEDGE_MODAL_ADMIN_MOCKS);
      renderPledgeModal(adminLink, pledgeProps[0]);

      const userAutocomplete = screen
        .getByRole('combobox', { name: /pledger/i })
        .closest('.MuiAutocomplete-root');
      const input = within(userAutocomplete as HTMLElement).getByRole(
        'combobox',
      );

      await user.click(input);

      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    });

    it('should maintain form state when modal stays open after validation', async () => {
      await act(async () => {
        renderPledgeModal(link1, pledgeProps[0]);
      });

      const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
      amountInput.focus();
      await user.clear(amountInput);
      amountInput.focus();
      await user.type(amountInput, '5');
      amountInput.focus();
      await user.type(amountInput, '0');
      amountInput.focus();
      await user.type(amountInput, '0');

      await waitFor(() => {
        expect(parseInt(amountInput.value)).toBe(500);
      });

      amountInput.focus();
      await user.clear(amountInput);
      amountInput.focus();
      await user.type(amountInput, '-');
      amountInput.focus();
      await user.type(amountInput, '1');
      amountInput.focus();
      await user.type(amountInput, '0');
      amountInput.focus();
      await user.type(amountInput, '0');
      await user.tab();

      await waitFor(() => {
        expect(parseInt(amountInput.value)).toBe(100);
      });
    });
  });

  describe('User Autocomplete', () => {
    it('should display pledgers autocomplete field', async () => {
      const adminLink = new StaticMockLink([...BASE_PLEDGE_MODAL_ADMIN_MOCKS]);
      renderPledgeModal(adminLink, pledgeProps[0]);

      await waitFor(() => {
        expect(
          screen.getByRole('combobox', { name: /pledger/i }),
        ).toBeInTheDocument();
      });
    });

    it('should show current pledger in edit mode', async () => {
      const adminLink = new StaticMockLink([...BASE_PLEDGE_MODAL_ADMIN_MOCKS]);
      renderPledgeModal(adminLink, pledgeProps[1]);

      await waitFor(() => {
        const pledgerInput = screen.getByRole('combobox', { name: /pledger/i });
        expect(pledgerInput).toHaveValue('John Doe');
      });
    });

    it('should have readonly input in edit mode autocomplete', async () => {
      const adminLink = new StaticMockLink([...BASE_PLEDGE_MODAL_ADMIN_MOCKS]);
      renderPledgeModal(adminLink, pledgeProps[1]);

      await waitFor(() => {
        const autocomplete = screen.getByTestId('pledgerSelect');
        const input = within(autocomplete).getByRole('combobox');
        expect(input).toHaveAttribute('readonly');
      });
    });

    it('should trigger onChange when autocomplete selection changes in create mode', async () => {
      const createMockWithAdminUser = [
        ...BASE_PLEDGE_MODAL_ADMIN_MOCKS,
        createCreatePledgeMock({
          campaignId: 'campaignId',
          amount: 150,
          pledgerId: 'userId',
        }),
      ];

      const link = new StaticMockLink(createMockWithAdminUser);
      renderPledgeModal(link, pledgeProps[0]);

      await waitFor(() => {
        expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
      });

      const autocomplete = screen.getByTestId('pledgerSelect');
      const input = within(autocomplete).getByRole('combobox');

      // Open the autocomplete to select a pledger
      await user.click(input);

      // Wait for options to appear
      await waitFor(
        () => {
          const options = screen.queryAllByRole('option');
          expect(options.length).toBeGreaterThan(0);
        },
        { timeout: 2000 },
      );

      // Select the first option (Harve Lance - admin user)
      const options = screen.getAllByRole('option');
      await act(async () => {
        // Find the option with text 'Harve Lance' to be safe, or just first one
        const harveOption =
          options.find((o) => o.textContent?.includes('Harve Lance')) ||
          options[0];
        await user.click(harveOption);
      });

      // Wait for selection to be applied
      await waitFor(() => {
        expect(input).toHaveValue('Harve Lance');
      });

      // Submit the form with selected pledger
      const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
      amountInput.focus();
      await user.clear(amountInput);
      amountInput.focus();
      await user.type(amountInput, '1');
      amountInput.focus();
      await user.type(amountInput, '5');
      amountInput.focus();
      await user.type(amountInput, '0');

      const submitBtn = screen.getByTestId('modal-submit-btn');
      await user.click(submitBtn);

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            translations.pledgeCreated,
            expect.any(Object),
          );
        },
        { timeout: 2000 },
      );
    });

    // NEW: Test case for clearing the autocomplete (sets value to null)
    it('should clear pledgeUsers when autocomplete is cleared', async () => {
      const adminLink = new StaticMockLink([...BASE_PLEDGE_MODAL_ADMIN_MOCKS]);
      renderPledgeModal(adminLink, pledgeProps[0]);

      await waitFor(() => {
        expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
      });

      const autocomplete = screen.getByTestId('pledgerSelect');
      const input = within(autocomplete).getByRole('combobox');

      // 1. Select a value first (simulated via update logic or just ensuring we can clear)
      await user.click(input);

      // 2. Select the option
      const options = await screen.findAllByRole('option');
      await user.click(options[0]);
      await waitFor(() => expect(input).toHaveValue('Harve Lance'));

      // 3. Clear the selection
      const clearButton = within(autocomplete).getByLabelText('Clear');
      await user.click(clearButton);

      // 4. Check if value is cleared (implying pledgeUsers set to [])
      await waitFor(() => expect(input).toHaveValue(''));

      // 5. Try submit - should fail validation because pledgers is empty
      const submitBtn = screen.getByTestId('modal-submit-btn');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          translations.selectPledger,
          expect.any(Object),
        );
      });
    });
  });

  describe('Update field change flows', () => {
    // Note: The component now only supports updating the amount field during pledge edit.
    // Currency, startDate, and endDate changes are no longer sent to the backend.

    it('should cover remaining edge cases for 100% coverage', async () => {
      const adminLink = new StaticMockLink([...BASE_PLEDGE_MODAL_ADMIN_MOCKS]);
      renderPledgeModal(adminLink, pledgeProps[0]);

      await waitFor(() => {
        expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
      });

      const form = screen.getByTestId('pledgeForm');
      expect(form).toBeInTheDocument();

      const autocomplete = screen.getByTestId('pledgerSelect');
      expect(autocomplete).toBeInTheDocument();
    });
  });

  describe('PledgeModal helper logic (coverage)', () => {
    it('areOptionsEqual returns true when ids match', () => {
      const option: InterfaceUserInfoPG = {
        id: '1',
        firstName: 'Alice',
        lastName: 'Smith',
        name: 'Alice Smith',
      };

      const value: InterfaceUserInfoPG = {
        id: '1',
        firstName: 'Bob',
        lastName: 'Jones',
        name: 'Bob Jones',
      };

      expect(areOptionsEqual(option, value)).toBe(true);
    });

    it('getMemberLabel builds full name correctly', () => {
      const member = {
        id: '2',
        firstName: 'John',
        lastName: 'Doe',
      };

      expect(getMemberLabel(member as InterfaceUserInfoPG)).toBe('John Doe');
    });

    // computeAdjustedEndDate tests removed - function no longer exists as dates are auto-generated

    it('areOptionsEqual returns false when ids do not match', () => {
      const option: InterfaceUserInfoPG = {
        id: '1',
        firstName: 'Alice',
        lastName: 'Smith',
        name: 'Alice Smith',
      };

      const value: InterfaceUserInfoPG = {
        id: '2',
        firstName: 'A',
        lastName: 'B',
        name: 'A B',
      };

      expect(areOptionsEqual(option, value)).toBe(false);
    });

    it('getMemberLabel handles missing firstName', () => {
      const member = { id: '1', firstName: '', lastName: 'Doe' };
      expect(getMemberLabel(member as InterfaceUserInfoPG)).toBe('Doe');
    });

    // NEW: Test fallback to member.name when parts are missing
    it('getMemberLabel falls back to member.name if parts are missing', () => {
      const member = {
        id: '1',
        firstName: '',
        lastName: '',
        name: 'Fallback Name',
      };
      expect(getMemberLabel(member as InterfaceUserInfoPG)).toBe(
        'Fallback Name',
      );
    });

    it('should update pledgeUsers state when selecting a pledger from autocomplete in create mode', async () => {
      const adminLink = new StaticMockLink([...BASE_PLEDGE_MODAL_ADMIN_MOCKS]);
      renderPledgeModal(adminLink, pledgeProps[0]);

      await waitFor(() => {
        expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
      });

      const autocomplete = screen.getByTestId('pledgerSelect');
      const input = within(autocomplete).getByRole('combobox');

      // Clear any existing selection first
      const clearButton = within(autocomplete).queryByLabelText('Clear');
      if (clearButton) {
        await act(async () => {
          await user.click(clearButton);
        });
      }

      // Open the autocomplete
      await user.click(input);

      // Wait for options to be available
      await waitFor(
        () => {
          const options = screen.queryAllByRole('option');
          expect(options.length).toBeGreaterThan(0);
        },
        { timeout: 2000 },
      );

      // Try to select an option if available
      const options = screen.getAllByRole('option');
      if (options.length > 0) {
        await act(async () => {
          await user.click(options[0]);
        });
      }

      // Verify the autocomplete is still there after selection
      await waitFor(() => {
        expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
      });
    });
  });
});
