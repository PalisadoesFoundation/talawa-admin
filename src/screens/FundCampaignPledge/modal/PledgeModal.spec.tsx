import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18nForTest from '../../../utils/i18nForTest';
import { PLEDGE_MODAL_MOCKS, PLEDGE_MODAL_ERROR_MOCKS } from '../PledgesMocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { InterfacePledgeModal } from './PledgeModal';
import PledgeModal from './PledgeModal';
import { vi } from 'vitest';
import { CREATE_PLEDGE, UPDATE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { MEMBERS_LIST_PG } from 'GraphQl/Queries/Queries';

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const link1 = new StaticMockLink(PLEDGE_MODAL_MOCKS, false);
const errorLink = new StaticMockLink(PLEDGE_MODAL_ERROR_MOCKS, false);
const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.pledges),
);

const createPledgeProps = (): InterfacePledgeModal => ({
  isOpen: true,
  hide: vi.fn(),
  pledge: null,
  refetchPledge: vi.fn(),
  campaignId: 'campaignId',
  orgId: 'orgId',
  endDate: new Date('2024-12-31'),
  mode: 'create',
});

const editPledgeProps = (): InterfacePledgeModal => ({
  ...createPledgeProps(),
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
      avatarURL: 'img-url',
    },
    campaign: {
      id: '101',
      name: 'Campaign Name',
      endAt: new Date('2024-01-15'),
      currencyCode: 'USD',
      goalAmount: 500,
    },
  },
  mode: 'edit',
});

const pledgeProps: InterfacePledgeModal[] = [
  createPledgeProps(),
  editPledgeProps(),
];

const renderPledgeModal = (link: ApolloLink, props: InterfacePledgeModal) => {
  return {
    user: userEvent.setup(),
    ...render(
      <MockedProvider link={link} addTypename={false}>
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
    ),
  };
};

const MOCK_PLEDGE_DATA = {
  request: {
    query: CREATE_PLEDGE,
    variables: {
      campaignId: 'campaignId',
      amount: 100,
      pledgerId: '1',
    },
  },
  result: {
    data: {
      createPledge: {
        id: '1',
        amount: 100,
        currency: 'USD',
      },
    },
  },
};

const MOCK_UPDATE_PLEDGE_DATA = {
  request: {
    query: UPDATE_PLEDGE,
    variables: {
      id: '1',
      amount: 200,
    },
  },
  result: {
    data: {
      updatePledge: {
        id: '1',
        amount: 200,
        currency: 'USD',
      },
    },
  },
};

const MEMBERS_MOCK = {
  request: {
    query: MEMBERS_LIST_PG,
    variables: { input: { id: 'orgId' } },
  },
  result: {
    data: {
      organization: {
        members: {
          edges: [
            {
              node: {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                name: 'John Doe',
              },
            },
          ],
        },
      },
    },
  },
};

const mockLink = new StaticMockLink(
  [...PLEDGE_MODAL_MOCKS, MOCK_PLEDGE_DATA, MEMBERS_MOCK],
  false,
);

const NO_CHANGE_MOCK = {
  request: {
    query: UPDATE_PLEDGE,
    variables: { id: '1' },
  },
  result: {
    data: {
      updatePledge: {
        id: '1',
        amount: 100,
        currency: 'USD',
      },
    },
  },
};

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

  afterEach(() => {
    cleanup();
  });

  it('should render edit pledge modal with correct title', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    await waitFor(() => {
      expect(screen.getByText(translations.editPledge)).toBeInTheDocument();
    });
  });

  it('should close the modal when close button is clicked', async () => {
    const hideMock = vi.fn();
    const props = { ...pledgeProps[0], hide: hideMock };
    const { user } = renderPledgeModal(link1, props);
    await user.click(screen.getByTestId('pledgeModalCloseBtn'));
    expect(hideMock).toHaveBeenCalledTimes(1);
  });

  it('should populate form fields with correct values in edit mode', async () => {
    renderPledgeModal(link1, pledgeProps[1]);

    await waitFor(async () => {
      const pledgerInput = within(
        screen.getByTestId('pledgerSelect'),
      ).getByRole('combobox');
      expect(pledgerInput.getAttribute('aria-label')).toBe('Pledgers');

      const startDate = pledgeProps[1].pledge?.startDate;
      const endDate = pledgeProps[1].pledge?.endDate;

      expect(startDate).toBe('2024-01-01');
      expect(endDate).toBe('2024-01-10');
    });
  });

  it('should update pledgeAmount when input value changes', async () => {
    const { user } = renderPledgeModal(link1, pledgeProps[1]);
    const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
    expect(amountInput).toHaveAttribute('value', '100');

    await user.type(amountInput, '{Control>}{a}{/Control}200');
    expect(amountInput).toHaveValue(200);
  });

  it('should not update pledgeAmount when input value is less than or equal to 0', async () => {
    const { user } = renderPledgeModal(link1, pledgeProps[1]);

    const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;

    await user.type(amountInput, '{Control>}{a}{/Control}0');

    await waitFor(() => {
      expect(amountInput).toHaveValue(0);
    });
  });

  it('should update currency when a new currency is selected', async () => {
    renderPledgeModal(link1, pledgeProps[1]);

    await waitFor(() => {
      const currencySelect = screen.getByLabelText('Currency');
      expect(currencySelect).toBeInTheDocument();

      const selectElement = currencySelect.closest('.MuiSelect-select');
      expect(selectElement).toHaveClass('Mui-disabled');
    });
  });

  it('should keep pledgeStartDate unchanged when disabled', () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const startDateInput = screen.getByLabelText('Start Date');
    expect(startDateInput).toBeDisabled();
    expect(pledgeProps[1].pledge?.startDate).toEqual('2024-01-01');
  });

  it('pledgeStartDate remains unchanged when input is disabled', () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const startDateInput = screen.getByLabelText('Start Date');
    expect(startDateInput).toBeDisabled();
    expect(pledgeProps[1].pledge?.startDate).toEqual('2024-01-01');
  });

  it('should keep pledgeEndDate unchanged when disabled', () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const endDateInput = screen.getByLabelText('End Date');
    expect(endDateInput).toBeDisabled();
    expect(pledgeProps[1].pledge?.endDate).toEqual('2024-01-10');
  });

  it('pledgeEndDate remains unchanged when input is disabled', () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const endDateInput = screen.getByLabelText('End Date');
    expect(endDateInput).toBeDisabled();
    expect(pledgeProps[1].pledge?.endDate).toEqual('2024-01-10');
  });

  it('should update end date if start date is after current end date', () => {
    renderPledgeModal(link1, pledgeProps[1]);

    const endDateInput = screen.getByLabelText('End Date');
    expect(endDateInput).toBeDisabled();
  });

  it('should handle create pledge error', async () => {
    const { user } = renderPledgeModal(errorLink, pledgeProps[0]);

    const amountInput = screen.getByLabelText('Amount');
    await user.clear(amountInput);
    await user.type(amountInput, '100');
    // Find submit button instead of submitting form
    const submitBtn = screen.getByTestId('submitPledgeBtn');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create pledge');
    });
  });

  it('should handle the initial state correctly in create mode', async () => {
    renderPledgeModal(link1, pledgeProps[0]);

    await waitFor(() => {
      const amountInput = screen.getByLabelText('Amount');
      expect(amountInput).toHaveAttribute('value', '0');

      const currencySelect = screen.getByLabelText('Currency');
      expect(currencySelect.textContent).toContain('USD');

      expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
    });
  });

  it('should enforce date constraints (start date before end date)', () => {
    renderPledgeModal(link1, pledgeProps[1]);

    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date');

    expect(startDateInput).toBeDisabled();
    expect(endDateInput).toBeDisabled();
  });

  it('should enforce campaign end date as the max date', async () => {
    const campaignEndDate = new Date('2024-06-30');
    const props = { ...pledgeProps[0], endDate: campaignEndDate };

    renderPledgeModal(link1, props);

    const endDatePicker = screen.getByLabelText('End Date');
    expect(endDatePicker).toBeInTheDocument();
  });

  it('should reset form state after successful pledge creation', async () => {
    const props = { ...pledgeProps[0], refetchPledge: vi.fn(), hide: vi.fn() };

    const { user } = renderPledgeModal(mockLink, props);

    const pledgerSelect = screen.getByTestId('pledgerSelect');
    const pledgerInput = within(pledgerSelect).getByRole('combobox');

    await user.click(pledgerInput);

    const option = await screen.findByRole('option', { name: 'John Doe' });
    await user.click(option);

    const amountInput = screen.getByLabelText('Amount');
    await user.type(amountInput, '{Control>}{a}{/Control}100');

    await user.click(screen.getByTestId('submitPledgeBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Pledge created successfully');
      expect(props.refetchPledge).toHaveBeenCalled();
      expect(props.hide).toHaveBeenCalled();
    });
  });

  it('should have proper aria labels for accessibility', () => {
    renderPledgeModal(link1, pledgeProps[0]);

    expect(screen.getByLabelText('Pledgers')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Currency')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
  });

  it('should show validation error when submitting without required fields', async () => {
    const { user } = renderPledgeModal(mockLink, pledgeProps[0]);

    await user.click(screen.getByTestId('submitPledgeBtn'));

    await waitFor(() => {
      expect(screen.getByText('Amount must be at least 1')).toBeInTheDocument();
    });
  });

  it('should support keyboard navigation in pledger select', async () => {
    const { user } = renderPledgeModal(mockLink, pledgeProps[0]);

    const pledgerSelect = screen.getByTestId('pledgerSelect');
    const pledgerInput = within(pledgerSelect).getByRole('combobox');

    await user.click(pledgerInput);

    await waitFor(() => {
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
      const option = within(listbox).getByText('John Doe');
      expect(option).toBeInTheDocument();
    });

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      const selectedValue = within(pledgerSelect).getByRole('combobox');
      expect(selectedValue).toHaveAttribute('value', 'John Doe');
    });
  });

  it('should update pledge amount in edit mode', async () => {
    const mockLink = new StaticMockLink(
      [...PLEDGE_MODAL_MOCKS, MOCK_UPDATE_PLEDGE_DATA],
      false,
    );
    const props = { ...pledgeProps[1], refetchPledge: vi.fn(), hide: vi.fn() };

    const { user } = renderPledgeModal(mockLink, props);

    const amountInput = screen.getByLabelText('Amount');
    await user.type(amountInput, '{Control>}{a}{/Control}200');

    await user.click(screen.getByTestId('submitPledgeBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Pledge updated successfully');
      expect(props.refetchPledge).toHaveBeenCalled();
      expect(props.hide).toHaveBeenCalled();
    });
  });

  it('should handle form submission when pledge amount has not changed', async () => {
    const mockLink = new StaticMockLink(
      [...PLEDGE_MODAL_MOCKS, NO_CHANGE_MOCK],
      false,
    );
    const props = { ...pledgeProps[1], refetchPledge: vi.fn(), hide: vi.fn() };
    const { user } = renderPledgeModal(mockLink, props);

    await waitFor(() => {
      expect(screen.getByLabelText('Amount')).toHaveAttribute('value', '100');
    });

    await user.click(screen.getByTestId('submitPledgeBtn'));

    await waitFor(() => {
      expect(props.refetchPledge).toHaveBeenCalled();
      expect(props.hide).toHaveBeenCalled();
    });
  });

  it('should disable submit button when amount is invalid', async () => {
    const { user } = renderPledgeModal(link1, pledgeProps[0]);

    const amountInput = screen.getByLabelText('Amount');
    await user.type(amountInput, '{Control>}{a}{/Control}0');

    await waitFor(() => {
      const submitButton = screen.getByTestId('submitPledgeBtn');
      expect(submitButton).toBeDisabled();
      expect(screen.getByText('Amount must be at least 1')).toBeInTheDocument();
    });
  });

  it('should handle update pledge error', async () => {
    const updateErrorMock = {
      request: {
        query: UPDATE_PLEDGE,
        variables: { id: '1', amount: 200 },
      },
      error: new Error('Update failed'),
    };

    const mockLink = new StaticMockLink([updateErrorMock], false);
    const props = { ...pledgeProps[1], refetchPledge: vi.fn(), hide: vi.fn() };
    const { user } = renderPledgeModal(mockLink, props);

    const amountInput = screen.getByLabelText('Amount');
    await user.type(amountInput, '{Control>}{a}{/Control}200');
    await user.click(screen.getByTestId('submitPledgeBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Update failed');
    });
  });

  it('should handle empty string in amount input', async () => {
    const { user } = renderPledgeModal(link1, pledgeProps[0]);

    const amountInput = screen.getByLabelText('Amount');
    await user.type(amountInput, '{Control>}{a}{/Control}{Backspace}');

    await waitFor(() => {
      expect(amountInput).toHaveValue(0);
      const submitButton = screen.getByTestId('submitPledgeBtn');
      expect(submitButton).toBeDisabled();
    });
  });

  it('should initialize with default values when pledge is null', async () => {
    const propsWithNullPledge = { ...pledgeProps[0], pledge: null };
    renderPledgeModal(link1, propsWithNullPledge);

    await waitFor(() => {
      const amountInput = screen.getByLabelText('Amount');
      expect(amountInput).toHaveAttribute('value', '0');
      expect(screen.getByLabelText('Currency')).toBeInTheDocument();
      const startDateInput = screen.getByLabelText('Start Date');
      const endDateInput = screen.getByLabelText('End Date');
      expect(startDateInput).toBeDisabled();
      expect(endDateInput).toBeDisabled();
    });
  });

  it('should handle missing pledgeUsers array', async () => {
    const invalidPledge = {
      ...(pledgeProps[1].pledge ? pledgeProps[1].pledge : {}),
      pledger: undefined,
    };

    const props = {
      ...pledgeProps[1],
      pledge: invalidPledge as unknown as InterfacePledgeModal['pledge'],
    };

    await act(async () => {
      renderPledgeModal(link1, props);
    });

    await waitFor(() => {
      const pledgerSelect = screen.getByTestId('pledgerSelect');
      expect(within(pledgerSelect).getByRole('combobox')).toHaveValue('');
      expect(screen.getByLabelText('Amount')).toHaveAttribute(
        'value',
        String(invalidPledge.amount),
      );
    });
  });
});
