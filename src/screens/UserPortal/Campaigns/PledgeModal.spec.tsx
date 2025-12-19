import type { ApolloLink } from '@apollo/client';
import { MockedProvider, type MockedResponse } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import dayjs from 'dayjs';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { InterfaceUserInfoPG } from 'utils/interfaces';
import type { DatePickerProps } from '@mui/x-date-pickers';
import { act } from 'react';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { CREATE_PLEDGE, UPDATE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { vi } from 'vitest';
import { setupLocalStorageMock } from 'test-utils/localStorageMock';
import PledgeModal, {
  type InterfacePledgeModal,
  areOptionsEqual,
  getMemberLabel,
  computeAdjustedEndDate,
} from './PledgeModal';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// UPDATE: Add the generic type here
vi.mock('@mui/x-date-pickers', async () => {
  const actual = await vi.importActual<typeof import('@mui/x-date-pickers')>(
    '@mui/x-date-pickers',
  );
  interface MockDatePickerProps {
    label?: string;
    value?: dayjs.Dayjs | null;
    onChange?: (value: dayjs.Dayjs | null) => void;
    [key: string]: any;
  }

  return {
    ...actual,
    DatePicker: ({ label, value, onChange }: MockDatePickerProps) => (
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
      startDate: '2024-01-01',
      endDate: '2024-01-10',
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
    endDate: new Date(),
    mode: 'create',
  },
  {
    isOpen: true,
    hide: vi.fn(),
    pledge: {
      id: '1',
      amount: 100,
      currency: 'USD',
      startDate: '2024-01-01',
      endDate: '2024-01-10',
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
    endDate: new Date(),
    mode: 'edit',
  },
];

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
        firstName: 'Harve',
        lastName: 'Lance',
        image: null,
        __typename: 'User',
      },
    },
  },
};

// Base mocks shared across all tests
const BASE_PLEDGE_MODAL_MOCKS = [USER_DETAILS_MOCK];

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
const createCreatePledgeMock = (
  variables: {
    campaignId: string;
    amount: number;
    currency: string;
    startDate: string;
    endDate: string;
    userIds: string[];
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
          createFundraisingCampaignPledge: {
            _id: '3',
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
    currency: 'USD',
    startDate: '2024-01-02',
    endDate: '2024-01-02',
    userIds: ['1'],
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
    renderPledgeModal(link1, pledgeProps[1]);
    await waitFor(() =>
      expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
    );
    // Use getAllByText to find the text content anywhere in the component
    expect(screen.getAllByText(/John Doe/i)[0]).toBeInTheDocument();
    const startDateInput = screen.getAllByLabelText(/start date/i)[0];
    const endDateInput = screen.getAllByLabelText(/end date/i)[0];

    expect(endDateInput).toHaveValue('10/01/2024');
    await waitFor(() => {
      expect(startDateInput).toHaveValue('01/01/2024');
    });

    expect(screen.getByLabelText('Currency')).toHaveTextContent('USD ($)');
    expect(screen.getByLabelText('Amount')).toHaveValue('100');
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
      expect(screen.getAllByLabelText(/start date/i)[0]).toBeInTheDocument();
      expect(screen.getAllByLabelText(/end date/i)[0]).toBeInTheDocument();
      expect(screen.getByTestId('pledgeForm')).toBeInTheDocument();
    });

    it('should render edit mode modal with populated form fields', async () => {
      renderPledgeModal(link1, pledgeProps[1]);
      await waitFor(() =>
        expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
      );

      const startDateInput = screen.getAllByLabelText(/start date/i)[0];
      const endDateInput = screen.getAllByLabelText(/end date/i)[0];

      expect(screen.getAllByText(/John Doe/i)[0]).toBeInTheDocument();
      expect(startDateInput).toHaveValue('01/01/2024');
      expect(endDateInput).toHaveValue('10/01/2024');
      expect(screen.getByLabelText('Currency')).toHaveTextContent('USD ($)');
      expect(screen.getByLabelText('Amount')).toHaveValue('100');
    });

    it('should close modal when close button is clicked', async () => {
      renderPledgeModal(link1, pledgeProps[0]);
      await waitFor(() =>
        expect(
          screen.getAllByText(translations.createPledge)[0],
        ).toBeInTheDocument(),
      );

      const closeButton = screen.getByTestId('pledgeModalCloseBtn');
      fireEvent.click(closeButton);

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

  describe('Form Field Updates', () => {
    it('should update pledgeAmount when input value changes to valid positive number', async () => {
      renderPledgeModal(link1, pledgeProps[1]);
      const amountInput = screen.getByLabelText('Amount');
      expect(amountInput).toHaveValue('100');

      fireEvent.change(amountInput, { target: { value: '200' } });
      expect(amountInput).toHaveValue('200');
    });

    it('should not update pledgeAmount when input value is negative', async () => {
      renderPledgeModal(link1, pledgeProps[1]);
      const amountInput = screen.getByLabelText('Amount');
      expect(amountInput).toHaveValue('100');

      fireEvent.change(amountInput, { target: { value: '-10' } });
      expect(amountInput).toHaveValue('100');
    });

    it('should not update pledgeAmount when input value is zero', async () => {
      renderPledgeModal(link1, pledgeProps[1]);
      const amountInput = screen.getByLabelText('Amount');
      expect(amountInput).toHaveValue('100');

      fireEvent.change(amountInput, { target: { value: '0' } });
      expect(amountInput).toHaveValue('100');
    });

    it('keeps form stable when endDate is empty and start date changes', async () => {
      const existingPledge = pledgeProps[1].pledge;

      if (!existingPledge) {
        throw new Error('Existing pledge data is missing for test');
      }

      renderPledgeModal(link1, {
        ...pledgeProps[1],
        pledge: {
          ...existingPledge,

          endDate: undefined as unknown as string,
        },
      });

      await waitFor(() => {
        expect(screen.getByTestId('pledgeForm')).toBeInTheDocument();
      });

      const startDateInput = screen.getAllByLabelText(/start date/i)[0];
      const endDateInput = screen.getAllByLabelText(/end date/i)[0];

      fireEvent.change(startDateInput, { target: { value: '25/12/2025' } });

      expect(endDateInput).toHaveValue('25/12/2025');
      expect(screen.getByTestId('pledgeForm')).toBeInTheDocument();
    });

    it('should handle pledgeStartDate onChange when value is null', async () => {
      renderPledgeModal(link1, pledgeProps[1]);
      const startDateInput = screen.getAllByLabelText(/start date/i)[0];

      fireEvent.change(startDateInput, { target: { value: '' } });
      // MUI X DatePicker: clearing is prevented; last valid value remains
      // Component uses DD/MM/YYYY format
      await waitFor(() => {
        expect((startDateInput as HTMLInputElement).value).toBeTruthy(); // Value should not be empty
      });
    });

    it('should update pledgeEndDate when a new date is selected', async () => {
      renderPledgeModal(link1, pledgeProps[1]);
      const endDateInput = screen.getAllByLabelText(/end date/i)[0];

      fireEvent.change(endDateInput, { target: { value: '02/01/2024' } });
      expect(endDateInput).toHaveValue('02/01/2024');
    });

    it('should handle pledgeEndDate onChange when value is null', async () => {
      renderPledgeModal(link1, pledgeProps[1]);
      const endDateInput = screen.getAllByLabelText(/end date/i)[0];

      fireEvent.change(endDateInput, { target: { value: '' } });
      // MUI X DatePicker: clearing is prevented; last valid value remains
      await waitFor(() => {
        expect((endDateInput as HTMLInputElement).value).toBeTruthy(); // Value should not be empty
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
      fireEvent.mouseDown(currencyDropdown);

      const eurOption = await screen.findByText('EUR (€)');
      fireEvent.click(eurOption);

      await waitFor(() => {
        expect(screen.getByLabelText('Currency')).toHaveTextContent('EUR (€)');
      });
    });

    it('preserves end date when start date does not exceed end date', async () => {
      renderPledgeModal(link1, pledgeProps[1]);

      const startDateInput = screen.getAllByLabelText(/start date/i)[0];
      const endDateInput = screen.getAllByLabelText(/end date/i)[0];

      expect(endDateInput).toHaveValue('10/01/2024');
      fireEvent.change(startDateInput, { target: { value: '01/01/2024' } });

      expect(endDateInput).toHaveValue('10/01/2024');
    });

    it('maintains selected pledger display after autocomplete focus and blur', async () => {
      renderPledgeModal(link1, pledgeProps[1]); // edit mode has pledger

      await waitFor(() => {
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      });

      const autocomplete = screen.getByTestId('pledgerSelect');
      const input = within(autocomplete).getByRole('combobox');

      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
  });

  describe('Pledge Creation', () => {
    it('should successfully create a new pledge with all fields', async () => {
      renderPledgeModal(link1, pledgeProps[0]);

      const startDateInput = screen.getAllByLabelText(/start date/i)[0];
      const endDateInput = screen.getAllByLabelText(/end date/i)[0];

      fireEvent.change(screen.getByLabelText('Amount'), {
        target: { value: '200' },
      });
      fireEvent.change(startDateInput, {
        target: { value: '02/01/2024' },
      });
      fireEvent.change(endDateInput, {
        target: { value: '02/01/2024' },
      });

      const form = screen.getByTestId('pledgeForm');
      fireEvent.submit(form);

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            translations.pledgeCreated,
          );
        },
        { timeout: 2000 },
      );

      expect(pledgeProps[0].refetchPledge).toHaveBeenCalled();
      expect(pledgeProps[0].hide).toHaveBeenCalled();
    });

    it('should handle pledge creation error', async () => {
      const errorMock = [
        ...BASE_PLEDGE_MODAL_MOCKS,
        createCreatePledgeMock(
          {
            campaignId: 'campaignId',
            amount: 200,
            currency: 'USD',
            startDate: '2024-01-02',
            endDate: '2024-01-02',
            userIds: ['1'],
          },
          true,
        ),
      ];

      const errorLink = new StaticMockLink(errorMock);
      renderPledgeModal(errorLink, pledgeProps[0]);

      await waitFor(() => {
        expect(screen.getByTestId('pledgeForm')).toBeInTheDocument();
      });

      const startDateInput = screen.getAllByLabelText(/start date/i)[0];
      const endDateInput = screen.getAllByLabelText(/end date/i)[0];

      fireEvent.change(screen.getByLabelText('Amount'), {
        target: { value: '200' },
      });
      fireEvent.change(startDateInput, {
        target: { value: '02/01/2024' },
      });
      fireEvent.change(endDateInput, {
        target: { value: '02/01/2024' },
      });

      const form = screen.getByTestId('pledgeForm');
      fireEvent.submit(form);

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
      renderPledgeModal(updateLink, pledgeProps[1]);

      await waitFor(() =>
        expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
      );

      const amountInput = screen.getByLabelText('Amount');
      fireEvent.change(amountInput, { target: { value: '200' } });

      const form = screen.getByTestId('pledgeForm');
      fireEvent.submit(form);

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            translations.pledgeUpdated,
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
      renderPledgeModal(updateLink, pledgeProps[1]);

      await waitFor(() =>
        expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
      );

      const amountInput = screen.getByLabelText('Amount');
      fireEvent.change(amountInput, { target: { value: '150' } });

      const form = screen.getByTestId('pledgeForm');
      fireEvent.submit(form);

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            translations.pledgeUpdated,
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
      renderPledgeModal(errorLink, pledgeProps[1]);

      await waitFor(() =>
        expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
      );

      const amountInput = screen.getByLabelText('Amount');
      fireEvent.change(amountInput, { target: { value: '200' } });

      const form = screen.getByTestId('pledgeForm');
      fireEvent.submit(form);

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
      renderPledgeModal(updateLink, pledgeProps[1]);

      await waitFor(() =>
        expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
      );

      // Change: Submit immediately without editing any fields
      const form = screen.getByTestId('pledgeForm');
      fireEvent.submit(form);

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            translations.pledgeUpdated,
          );
        },
        { timeout: 2000 },
      );
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle invalid date formats gracefully', async () => {
      renderPledgeModal(link1, pledgeProps[0]);

      const startDateInput = screen.getAllByLabelText(/start date/i)[0];
      fireEvent.change(startDateInput, { target: { value: 'invalid-date' } });

      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    });

    it('should handle empty autocomplete selection', async () => {
      renderPledgeModal(link1, pledgeProps[0]);

      const userAutocomplete = screen
        .getByLabelText(translations.pledgers)
        .closest('.MuiAutocomplete-root');
      const input = within(userAutocomplete as HTMLElement).getByRole(
        'combobox',
      );

      await act(async () => {
        input.focus();
        fireEvent.change(input, { target: { value: '' } });
      });

      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    });

    it('should maintain form state when modal stays open after validation', async () => {
      renderPledgeModal(link1, pledgeProps[0]);

      const amountInput = screen.getByLabelText('Amount');
      fireEvent.change(amountInput, { target: { value: '500' } });

      expect(amountInput).toHaveValue('500');

      fireEvent.change(amountInput, { target: { value: '-100' } });

      expect(amountInput).toHaveValue('500');
    });
  });

  describe('User Autocomplete', () => {
    it('should display pledgers autocomplete field', async () => {
      renderPledgeModal(link1, pledgeProps[0]);

      await waitFor(() => {
        expect(
          screen.getByLabelText(translations.pledgers),
        ).toBeInTheDocument();
      });
    });

    it('should show current pledger in edit mode', async () => {
      renderPledgeModal(link1, pledgeProps[1]);

      await waitFor(() => {
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      });
    });

    it('should have readonly input in edit mode autocomplete', async () => {
      renderPledgeModal(link1, pledgeProps[1]);

      await waitFor(() => {
        const autocomplete = screen.getByTestId('pledgerSelect');
        const input = within(autocomplete).getByRole('combobox');
        expect(input).toHaveAttribute('readonly');
      });
    });

    it('should trigger onChange when autocomplete selection changes in create mode', async () => {
      const createMockWithEmptyUsers = [
        ...BASE_PLEDGE_MODAL_MOCKS,
        createCreatePledgeMock({
          campaignId: 'campaignId',
          amount: 150,
          currency: 'USD',
          startDate: '2024-01-02',
          endDate: '2024-01-02',
          userIds: [],
        }),
      ];

      const link = new StaticMockLink(createMockWithEmptyUsers);
      renderPledgeModal(link, pledgeProps[0]);

      await waitFor(() => {
        expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
      });

      const autocomplete = screen.getByTestId('pledgerSelect');
      const clearButton = within(autocomplete).queryByLabelText('Clear');

      if (clearButton) {
        await act(async () => {
          fireEvent.click(clearButton);
        });

        // Verify that clearing the autocomplete removes the selected users
        await waitFor(() => {
          const chips = within(autocomplete).queryAllByRole('button', {
            name: /remove/i,
          });
          expect(chips).toHaveLength(0);
        });
      }

      const startDateInput = screen.getAllByLabelText(/start date/i)[0];
      const endDateInput = screen.getAllByLabelText(/end date/i)[0];

      // Submit the form to verify empty userIds is sent to GraphQL
      fireEvent.change(screen.getByLabelText('Amount'), {
        target: { value: '150' },
      });
      fireEvent.change(startDateInput, {
        target: { value: '02/01/2024' },
      });
      fireEvent.change(endDateInput, {
        target: { value: '02/01/2024' },
      });

      const form = screen.getByTestId('pledgeForm');
      fireEvent.submit(form);

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            translations.pledgeCreated,
          );
        },
        { timeout: 2000 },
      );
    });
  });

  describe('Update field change flows', () => {
    it('should update pledge with currency change', async () => {
      const updateMock = [
        ...PLEDGE_MODAL_MOCKS,
        {
          request: {
            query: UPDATE_PLEDGE,
            variables: {
              id: '1',
              currency: 'EUR',
            },
          },
          result: {
            data: {
              updateFundraisingCampaignPledge: {
                _id: '1',
              },
            },
          },
        },
      ];

      const updateLink = new StaticMockLink(updateMock);
      renderPledgeModal(updateLink, pledgeProps[1]);

      await waitFor(() =>
        expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
      );

      // Change currency
      const currencyDropdown = screen.getByLabelText('Currency');
      fireEvent.mouseDown(currencyDropdown);
      const eurOption = await screen.findByText('EUR (€)');
      fireEvent.click(eurOption);

      const form = screen.getByTestId('pledgeForm');
      fireEvent.submit(form);

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            translations.pledgeUpdated,
          );
        },
        { timeout: 2000 },
      );
    });

    it('should update pledge with start date change', async () => {
      const updateMock = [
        ...PLEDGE_MODAL_MOCKS,
        {
          request: {
            query: UPDATE_PLEDGE,
            variables: {
              id: '1',
              startDate: '2024-01-02',
            },
          },
          result: {
            data: {
              updateFundraisingCampaignPledge: {
                _id: '1',
              },
            },
          },
        },
      ];

      const updateLink = new StaticMockLink(updateMock);
      renderPledgeModal(updateLink, pledgeProps[1]);

      await waitFor(() =>
        expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
      );

      const startDateInput = screen.getAllByLabelText(/start date/i)[0];

      fireEvent.change(startDateInput, { target: { value: '02/01/2024' } });

      const form = screen.getByTestId('pledgeForm');
      fireEvent.submit(form);

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            translations.pledgeUpdated,
          );
        },
        { timeout: 2000 },
      );
    });

    it('should update pledge with endDate change', async () => {
      const updateMock = [
        ...PLEDGE_MODAL_MOCKS,
        {
          request: {
            query: UPDATE_PLEDGE,
            variables: {
              id: '1',
              endDate: '2024-01-15',
            },
          },
          result: {
            data: {
              updateFundraisingCampaignPledge: {
                _id: '1',
              },
            },
          },
        },
      ];

      const updateLink = new StaticMockLink(updateMock);
      renderPledgeModal(updateLink, pledgeProps[1]);

      await waitFor(() =>
        expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
      );

      const endDateInput = screen.getAllByLabelText(/end date/i)[0];

      fireEvent.change(endDateInput, { target: { value: '15/01/2024' } });

      const form = screen.getByTestId('pledgeForm');
      fireEvent.submit(form);

      await waitFor(
        () => {
          expect(toast.success).toHaveBeenCalledWith(
            translations.pledgeUpdated,
          );
        },
        { timeout: 2000 },
      );
    });

    it('should render all required interactive form controls in create mode', async () => {
      renderPledgeModal(link1, pledgeProps[0]);

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

    it('computeAdjustedEndDate returns later date when start exceeds end', () => {
      const existingEndDate = new Date('2024-01-01');
      const newStartDate = dayjs('2025-01-01');

      const result = computeAdjustedEndDate(existingEndDate, newStartDate);

      expect(result?.toISOString()).toBe(newStartDate.toDate().toISOString());
    });

    it('computeAdjustedEndDate returns original end date when date is null', () => {
      const existingEndDate = new Date('2024-01-01');

      const result = computeAdjustedEndDate(existingEndDate, null);

      expect(result).toBe(existingEndDate);
    });

    it('areOptionsEqual returns false when ids do not match', () => {
      const option: InterfaceUserInfoPG = {
        id: '1',
        firstName: 'A',
        lastName: 'B',
        name: 'A B',
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

    it('getMemberLabel handles missing lastName', () => {
      const member = { id: '2', firstName: 'John', lastName: '' };
      expect(getMemberLabel(member as InterfaceUserInfoPG)).toBe('John');
    });

    it('computeAdjustedEndDate returns undefined when pledgeEndDate is undefined', () => {
      const newStartDate = dayjs('2024-01-01');
      const result = computeAdjustedEndDate(undefined, newStartDate);
      expect(result).toBeUndefined();
    });

    it('computeAdjustedEndDate keeps end date when start is before end', () => {
      const end = new Date('2025-12-31');
      const start = dayjs('2025-01-01');
      const result = computeAdjustedEndDate(end, start);
      expect(result).toBe(end);
    });

    it('getMemberLabel falls back to name when first and last names are missing', () => {
      const member = {
        id: '3',
        firstName: '',
        lastName: '',
        name: 'Fallback Name',
      };
      expect(getMemberLabel(member as InterfaceUserInfoPG)).toBe(
        'Fallback Name',
      );
    });
  });
});
