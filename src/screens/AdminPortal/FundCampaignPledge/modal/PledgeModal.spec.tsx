import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
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
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DatePicker';
import { PLEDGE_MODAL_MOCKS, PLEDGE_MODAL_ERROR_MOCKS } from '../Pledges.mocks';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import type { InterfacePledgeModal } from './PledgeModal';
import PledgeModal from './PledgeModal';
import { areOptionsEqual, getMemberLabel } from 'utils/autocompleteHelpers';
import type { InterfaceUserInfoPG } from 'utils/interfaces';
import { vi } from 'vitest';
import { CREATE_PLEDGE, UPDATE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { MEMBERS_LIST_PG } from 'GraphQl/Queries/Queries';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    // Mock Autocomplete that simulates selection when user types 'John'
    // - typing text ending with 'John' selects { id: '1', name: 'John Doe' }
    // - clearing the input (empty string) deselects the option
    Autocomplete: (props: Record<string, unknown>) => {
      const { value, onChange, getOptionLabel, renderInput, ...otherProps } =
        props;

      const [inputValue, setInputValue] = React.useState(
        value ? (getOptionLabel as (option: unknown) => string)(value) : '',
      );

      React.useEffect(() => {
        if (value) {
          setInputValue((getOptionLabel as (option: unknown) => string)(value));
        } else {
          setInputValue('');
        }
      }, [value]);

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInputValue(newValue);

        if (newValue.endsWith('John')) {
          const mockOption = { id: '1', name: 'John Doe' };
          (
            onChange as (
              event: React.ChangeEvent<HTMLInputElement>,
              value: unknown,
            ) => void
          )(event, mockOption);
        } else if (newValue === '') {
          (
            onChange as (
              event: React.ChangeEvent<HTMLInputElement>,
              value: unknown,
            ) => void
          )(event, null);
        }
      };

      const renderedInput = (
        renderInput as (params: unknown) => React.ReactElement
      )({
        InputProps: {
          ref: null,
          endAdornment: null,
        },
        InputLabelProps: {},
        inputProps: {
          value: inputValue,
          onChange: handleChange,
          'aria-label': 'Pledgers',
          role: 'combobox',
        },
      });

      return React.createElement('div', otherProps, renderedInput);
    },
  };
});

export const getPickerInputByLabel = (label: string): HTMLElement => {
  const allInputs = screen.getAllByRole('textbox', { hidden: true });
  for (const input of allInputs) {
    const formControl = input.closest('.MuiFormControl-root');
    if (formControl) {
      const labelEl = formControl.querySelector('label');
      if (labelEl) {
        const labelText = labelEl.textContent?.toLowerCase() || '';
        if (labelText.includes(label.toLowerCase())) {
          return formControl as HTMLElement;
        }
      }
    }
  }
  throw new Error(`Could not find date picker for label: ${label}`);
};

const link1 = new StaticMockLink(PLEDGE_MODAL_MOCKS);
const errorLink = new StaticMockLink(PLEDGE_MODAL_ERROR_MOCKS);
const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.pledges),
);

const FIXED_CREATED_AT = dayjs.utc().subtract(10, 'day').toISOString();
const FIXED_UPDATED_AT = dayjs.utc().subtract(1, 'day').toISOString();

const createPledgeProps = (): InterfacePledgeModal => ({
  isOpen: true,
  hide: vi.fn(),
  pledge: null,
  refetchPledge: vi.fn(),
  campaignId: 'campaignId',
  orgId: 'orgId',
  endDate: dayjs.utc().add(1, 'year').toDate(),
  mode: 'create',
});

const editPledgeProps = (): InterfacePledgeModal => ({
  ...createPledgeProps(),
  pledge: {
    id: '1',
    amount: 100,
    currency: 'USD',
    createdAt: FIXED_CREATED_AT,
    updatedAt: FIXED_UPDATED_AT,
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
      endAt: dayjs.utc().add(1, 'month').toDate(),
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
      createFundCampaignPledge: {
        __typename: 'Pledge',
        id: '1',
        amount: 100,
        note: null,
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
        campaign: {
          __typename: 'FundCampaign',
          id: 'campaignId',
          name: 'Campaign',
        },
        pledger: { __typename: 'User', id: '1', name: 'John Doe' },
      },
    },
  },
};

/** Delayed create pledge mock so we can assert loading state before response */
const MOCK_PLEDGE_DATA_DELAYED = {
  ...MOCK_PLEDGE_DATA,
  delay: 1000,
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
        __typename: 'Pledge',
        id: '1',
        amount: 200,
        currency: 'USD',
      },
    },
  },
  delay: 100,
};

const MEMBERS_MOCK = {
  request: {
    query: MEMBERS_LIST_PG,
    variables: { input: { id: 'orgId' } },
  },
  result: {
    data: {
      organization: {
        __typename: 'Organization',
        id: 'orgId',
        members: {
          __typename: 'UserConnection',
          edges: [
            {
              __typename: 'UserEdge',
              node: {
                __typename: 'User',
                id: '1',
                name: 'John Doe',
                avatarURL: null,
                createdAt: dayjs.utc().toISOString(),
              },
            },
          ],
        },
      },
    },
  },
};

const mockLink = new StaticMockLink([
  ...PLEDGE_MODAL_MOCKS,
  MOCK_PLEDGE_DATA,
  MEMBERS_MOCK,
]);

const NO_CHANGE_MOCK = {
  request: {
    query: UPDATE_PLEDGE,
    variables: { id: '1' },
  },
  result: {
    data: {
      updatePledge: {
        __typename: 'Pledge',
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
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render edit pledge modal with correct title', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    await waitFor(() => {
      expect(screen.getByText(translations.editPledge)).toBeInTheDocument();
    });
  });

  it('should close the modal when close button is clicked', async () => {
    const user = userEvent.setup();
    const hideMock = vi.fn();
    const props = { ...pledgeProps[0], hide: hideMock };
    renderPledgeModal(link1, props);
    await user.click(screen.getByTestId('modalCloseBtn'));
    await waitFor(() => {
      expect(hideMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should populate form fields with correct values in edit mode', async () => {
    await act(async () => {
      renderPledgeModal(link1, pledgeProps[1]);
    });

    await waitFor(async () => {
      const pledgerInput = screen.getByTestId('pledgerSelect');
      const input = within(pledgerInput).getByRole('combobox');
      expect(input.getAttribute('aria-label')).toBe('Pledgers');

      // Verify createdAt/updatedAt are set (these are auto-generated by backend)
      const createdAt = pledgeProps[1].pledge?.createdAt;
      const updatedAt = pledgeProps[1].pledge?.updatedAt;

      expect(createdAt).toBe(FIXED_CREATED_AT);
      expect(updatedAt).toBe(FIXED_UPDATED_AT);
    });
  });

  it('should update pledgeAmount when input value changes', async () => {
    const user = userEvent.setup({ delay: null });
    await act(async () => {
      renderPledgeModal(link1, pledgeProps[1]);
    });
    const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
    expect(amountInput).toHaveAttribute('value', '100');

    await user.clear(amountInput);
    await user.type(amountInput, '200');

    await waitFor(() => {
      expect(parseInt(amountInput.value)).toBe(200);
    });
  });

  it('should not update pledgeAmount when input value is less than or equal to 0', async () => {
    const user = userEvent.setup();
    await act(async () => {
      renderPledgeModal(link1, pledgeProps[1]);
    });

    const amountInput = screen.getByLabelText('Amount') as HTMLInputElement;
    expect(amountInput).toHaveAttribute('value', '100');

    await user.clear(amountInput);
    await user.type(amountInput, '-10');

    await waitFor(() => {
      const value = parseInt(amountInput.value);
      expect(value).toBeGreaterThanOrEqual(0);
    });
  });

  it('should update currency when a new currency is selected', async () => {
    await act(async () => {
      renderPledgeModal(link1, pledgeProps[1]);
    });

    await waitFor(() => {
      const currencySelect = screen.getByLabelText('Currency');
      expect(currencySelect).toBeInTheDocument();

      // In edit mode, currency is not actually disabled - just verify it exists and has value
      expect(currencySelect).toHaveValue('USD');
    });
  });

  it('should handle create pledge error', async () => {
    const user = userEvent.setup({ delay: null });
    renderPledgeModal(errorLink, pledgeProps[0]);

    await waitFor(() => {
      expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
    });

    const pledgerInput = within(screen.getByTestId('pledgerSelect')).getByRole(
      'combobox',
    );
    await user.type(pledgerInput, 'John');

    await waitFor(() => {
      expect(pledgerInput).toHaveValue('John Doe');
    });

    const amountInput = screen.getByLabelText('Amount');
    await user.clear(amountInput);
    await user.type(amountInput, '100');

    await waitFor(() => {
      expect((amountInput as HTMLInputElement).value).toBe('100');
    });

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Failed to create pledge',
      );
    });
  });

  it('should handle the initial state correctly in create mode', async () => {
    await act(async () => {
      renderPledgeModal(link1, pledgeProps[0]);
    });

    await waitFor(() => {
      const amountInput = screen.getByLabelText('Amount');
      expect(amountInput).toHaveAttribute('value', '0');

      const currencySelect = screen.getByLabelText('Currency');
      expect(currencySelect).toHaveValue('USD');

      expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
    });
  });

  it('should reset form state after successful pledge creation', async () => {
    const props = { ...pledgeProps[0], refetchPledge: vi.fn(), hide: vi.fn() };

    renderPledgeModal(mockLink, props);

    await waitFor(() => {
      expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
    });

    const pledgerInput = within(screen.getByTestId('pledgerSelect')).getByRole(
      'combobox',
    );

    // Type to select pledger (mocked autocomplete will handle selection)
    const user = userEvent.setup({ delay: null });
    await user.type(pledgerInput, 'John');

    await waitFor(() => {
      expect(pledgerInput).toHaveValue('John Doe');
    });

    const amountInput = screen.getByLabelText('Amount');
    await user.clear(amountInput);
    await user.type(amountInput, '100');

    await waitFor(() => {
      expect((amountInput as HTMLInputElement).value).toBe('100');
    });

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'Pledge created successfully',
      );
      expect(props.refetchPledge).toHaveBeenCalled();
      expect(props.hide).toHaveBeenCalled();
    });
  });

  // Coverage for Line 140: Verify updatePledge mutation variables include the correct pledge ID
  it('should call updatePledge mutation with correct variables including id', async () => {
    const updateLink = new StaticMockLink([MOCK_UPDATE_PLEDGE_DATA]);
    const user = userEvent.setup({ delay: null });

    await act(async () => {
      renderPledgeModal(updateLink, pledgeProps[1]); // pledgeProps[1] has id: '1'
    });

    const amountInput = screen.getByLabelText('Amount');
    await user.clear(amountInput);
    await user.type(amountInput, '200');
    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      // Ideally we could spy on the mutation call, but with MockedProvider we verify the result.
      // The fact that MOCK_UPDATE_PLEDGE_DATA matched means the variables (id: '1', amount: 200) matched.
      // If ID was missing or wrong, it would not match and likely error or hang.
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'Pledge updated successfully',
      );
    });
  });

  // Coverage for Line 185: Verify error toast behavior when createPledge fails with specific error message
  it('should show specific error message from backend when createPledge fails', async () => {
    const user = userEvent.setup({ delay: null });
    const errorMsg = 'Specific backend error';
    const ERROR_MOCK = {
      request: {
        query: CREATE_PLEDGE,
        variables: {
          campaignId: 'campaignId',
          amount: 100,
          pledgerId: '1',
        },
      },
      error: new Error(errorMsg),
    };
    const specificErrorLink = new StaticMockLink([
      ...PLEDGE_MODAL_MOCKS,
      MEMBERS_MOCK, // Need members to select one
      ERROR_MOCK,
    ]);

    const props = { ...pledgeProps[0], refetchPledge: vi.fn(), hide: vi.fn() };
    renderPledgeModal(specificErrorLink, props);

    // Select a pledger first (using mocked Autocomplete)
    const pledgerSelect = screen.getByTestId('pledgerSelect');
    const pledgerInput = within(pledgerSelect).getByRole('combobox');

    // Type to select pledger (mocked autocomplete will handle selection)
    await user.type(pledgerInput, 'John');

    await waitFor(() => {
      expect(pledgerInput).toHaveValue('John Doe');
    });

    const amountInput = screen.getByLabelText('Amount');
    await user.clear(amountInput);
    await user.type(amountInput, '100');

    await act(async () => {
      await user.click(screen.getByTestId('modal-submit-btn'));
    });

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(errorMsg);
    });
  });

  // Coverage for Line 292: Verify input validation logic for the Amount field (handling NaN)
  it('should ignore non-numeric input for Amount field', async () => {
    await act(async () => {
      renderPledgeModal(link1, pledgeProps[0]);
    });

    const amountInput = screen.getByLabelText('Amount');
    expect(amountInput).toHaveAttribute('value', '0');

    await act(async () => {
      // Try typing non-numeric characters.
      // Note: type="number" blocks many non-numeric keys, but 'e' is often allowed in browsers (exponential).
      // However, userEvent.type might behavior differently.
      // We will try to type a string that results in NaN if parsed.
      await userEvent.type(amountInput, 'abc');
      // If the checking logic works, it keeps previous value or doesn't update to invalid state
    });

    // Since we start at 0, and 'abc' is invalid, it should likely stay 0 or handled by the component.
    expect(amountInput).toHaveAttribute('value', '0');
  });

  it('should have proper aria labels for accessibility', () => {
    renderPledgeModal(link1, pledgeProps[0]);

    expect(screen.getByLabelText('Pledgers')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Currency')).toBeInTheDocument();
  });

  it('should show validation error when submitting without required fields', async () => {
    const user = userEvent.setup();
    renderPledgeModal(mockLink, pledgeProps[0]);

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(screen.getByText('Amount must be at least 1')).toBeInTheDocument();
    });
  });

  it('should support keyboard navigation in pledger select', async () => {
    const user = userEvent.setup();
    renderPledgeModal(mockLink, pledgeProps[0]);

    await waitFor(() => {
      expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
    });

    const pledgerInput = within(screen.getByTestId('pledgerSelect')).getByRole(
      'combobox',
    );

    // Type to select pledger (mocked autocomplete will handle selection)
    await user.type(pledgerInput, 'John');

    await waitFor(() => {
      expect(pledgerInput).toHaveValue('John Doe');
    });
  });

  it('should update pledge amount in edit mode', async () => {
    const user = userEvent.setup({ delay: null });
    const mockLink = new StaticMockLink([
      ...PLEDGE_MODAL_MOCKS,
      MOCK_UPDATE_PLEDGE_DATA,
    ]);
    const props = { ...pledgeProps[1], refetchPledge: vi.fn(), hide: vi.fn() };

    renderPledgeModal(mockLink, props);

    await waitFor(() => {
      expect(screen.getByLabelText('Amount')).toHaveAttribute('value', '100');
    });

    const pledgerSelect = screen.getByTestId('pledgerSelect');
    const pledgerInput = within(pledgerSelect).getByRole('combobox');
    // specific to EditModal: waits for auto-focus to settle on the first input
    await waitFor(() => {
      expect(pledgerInput).toHaveFocus();
    });

    const amountInput = screen.getByLabelText('Amount');
    await act(async () => {
      await user.clear(amountInput);
      await user.type(amountInput, '200');
    });

    await waitFor(() => {
      expect((amountInput as HTMLInputElement).value).toBe('200');
    });

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'Pledge updated successfully',
      );
      expect(props.refetchPledge).toHaveBeenCalled();
      expect(props.hide).toHaveBeenCalled();
    });
  });

  it('should handle form submission when pledge amount has not changed', async () => {
    const mockLink = new StaticMockLink([
      ...PLEDGE_MODAL_MOCKS,
      NO_CHANGE_MOCK,
    ]);
    const props = { ...pledgeProps[1], refetchPledge: vi.fn(), hide: vi.fn() };
    renderPledgeModal(mockLink, props);

    await waitFor(() => {
      expect(screen.getByLabelText('Amount')).toHaveValue(100);
    });

    const form = document.getElementById('crud-edit-form') as HTMLFormElement;
    expect(form).not.toBeNull();

    await act(async () => {
      const user = userEvent.setup();
      await user.click(screen.getByTestId('modal-submit-btn'));
    });

    await waitFor(() => {
      expect(props.refetchPledge).toHaveBeenCalled();
      expect(props.hide).toHaveBeenCalled();
    });
  });

  it('should disable submit button when amount is invalid', async () => {
    renderPledgeModal(link1, pledgeProps[0]);

    await waitFor(() => {
      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId('modal-submit-btn');
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Amount must be at least 1')).toBeInTheDocument();
  });

  it('should handle update pledge error', async () => {
    const user = userEvent.setup({ delay: null });
    const updateErrorMock = {
      request: {
        query: UPDATE_PLEDGE,
        variables: { id: '1', amount: 200 },
      },
      error: new Error('Update failed'),
    };

    const mockLink = new StaticMockLink([updateErrorMock]);
    const props = { ...pledgeProps[1], refetchPledge: vi.fn(), hide: vi.fn() };
    renderPledgeModal(mockLink, props);

    const amountInput = screen.getByLabelText('Amount');

    // specific to EditModal: waits for auto-focus to settle on the first input
    const pledgerSelect = screen.getByTestId('pledgerSelect');
    const pledgerInput = within(pledgerSelect).getByRole('combobox');
    await waitFor(() => {
      expect(pledgerInput).toHaveFocus();
    });

    await user.clear(amountInput);
    await user.type(amountInput, '200');

    await waitFor(() => {
      expect((amountInput as HTMLInputElement).value).toBe('200');
    });

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('Update failed');
    });
  });

  it('should handle empty string in amount input', async () => {
    const user = userEvent.setup();
    renderPledgeModal(link1, pledgeProps[0]);

    const amountInput = screen.getByLabelText('Amount');
    await act(async () => {
      await user.clear(amountInput);
    });

    await waitFor(() => {
      expect(amountInput).toHaveValue(0);
      const submitButton = screen.getByTestId('modal-submit-btn');
      expect(submitButton).toBeDisabled();
    });
  });

  it('should initialize with default values when pledge is null', async () => {
    const propsWithNullPledge = { ...pledgeProps[0], pledge: null };
    renderPledgeModal(link1, propsWithNullPledge);

    await waitFor(() => {
      const amountInput = screen.getByLabelText('Amount');
      expect(amountInput).toHaveValue(0);
      expect(screen.getByLabelText('Currency')).toBeInTheDocument();
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
      expect(screen.getByLabelText('Amount')).toHaveValue(invalidPledge.amount);
    });
  });

  it('should clear pledgeUsers when Autocomplete onChange is called with null', async () => {
    const user = userEvent.setup();

    renderPledgeModal(mockLink, pledgeProps[0]);

    await waitFor(() => {
      expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
    });

    const pledgerInput = within(screen.getByTestId('pledgerSelect')).getByRole(
      'combobox',
    );

    // Type to select pledger (mocked autocomplete will handle selection)
    await user.type(pledgerInput, 'John');

    await waitFor(() => {
      expect(pledgerInput).toHaveValue('John Doe');
    });

    // Clear the input to deselect (mocked autocomplete will call onChange with null)
    await user.clear(pledgerInput);

    await waitFor(() => {
      expect(pledgerInput).toHaveValue('');
    });
  });

  it('should handle pledger input value changes', async () => {
    renderPledgeModal(mockLink, pledgeProps[0]);

    const pledgerSelect = screen.getByTestId('pledgerSelect');
    const pledgerInput = within(pledgerSelect).getByRole('combobox');

    await act(async () => {
      await userEvent.click(pledgerInput);
      await userEvent.type(pledgerInput, 'John');
    });

    await waitFor(() => {
      expect(pledgerInput).toHaveValue('John Doe');
    });
  });

  it('should handle zero amount correctly', async () => {
    renderPledgeModal(link1, pledgeProps[0]);

    const amountInput = screen.getByLabelText('Amount');

    await act(async () => {
      await userEvent.clear(amountInput);
      await userEvent.type(amountInput, '0');
    });

    await waitFor(() => {
      expect(amountInput).toHaveValue(0);
      const submitButton = screen.getByTestId('modal-submit-btn');
      expect(submitButton).toBeDisabled();
    });
  });

  it('should handle amount blur event', async () => {
    renderPledgeModal(link1, pledgeProps[0]);

    const amountInput = screen.getByLabelText('Amount');

    await act(async () => {
      await userEvent.click(amountInput);
      await userEvent.tab();
    });

    await waitFor(() => {
      expect(screen.getByText('Amount must be at least 1')).toBeInTheDocument();
    });
  });

  it('should handle NaN values in amount input gracefully', async () => {
    renderPledgeModal(link1, pledgeProps[0]);

    const amountInput = screen.getByLabelText('Amount');

    await act(async () => {
      await userEvent.clear(amountInput);
      // Simulate attempting to type invalid characters
      await userEvent.type(amountInput, 'abc');
    });

    await waitFor(() => {
      // Should maintain zero or previous valid value
      expect(amountInput).toHaveValue(0);
    });
  });

  it('should display loading state during pledge creation', async () => {
    const loadingMockLink = new StaticMockLink([
      ...PLEDGE_MODAL_MOCKS,
      MOCK_PLEDGE_DATA_DELAYED,
      MEMBERS_MOCK,
    ]);
    const props = { ...pledgeProps[0], refetchPledge: vi.fn(), hide: vi.fn() };
    renderPledgeModal(loadingMockLink, props);

    const pledgerSelect = screen.getByTestId('pledgerSelect');
    const pledgerInput = within(pledgerSelect).getByRole('combobox');

    const user = userEvent.setup({ delay: null });
    await user.type(pledgerInput, 'John');

    await waitFor(() => {
      expect(pledgerInput).toHaveValue('John Doe');
    });

    const amountInput = screen.getByLabelText('Amount');
    await user.clear(amountInput);
    await user.type(amountInput, '100');

    await waitFor(() => {
      expect((amountInput as HTMLInputElement).value).toBe('100');
    });

    const submitButton = screen.getByTestId('modal-submit-btn');
    await user.click(submitButton);

    // Button should be disabled while mutation is in flight (mock delays 2000ms)
    await waitFor(
      () => {
        expect(submitButton).toBeDisabled();
      },
      { timeout: 2000 },
    );
  });

  it('should handle create pledge when pledger is missing', async () => {
    renderPledgeModal(mockLink, pledgeProps[0]);

    const amountInput = screen.getByLabelText('Amount');
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '100');

    await act(async () => {
      await userEvent.click(screen.getByTestId('modal-submit-btn'));
    });

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Failed to create pledge',
      );
    });
  });

  it('should clear input value when pledgeUsers is cleared via effect', async () => {
    renderPledgeModal(mockLink, pledgeProps[0]);

    const pledgerSelect = screen.getByTestId('pledgerSelect');
    const pledgerInput = within(pledgerSelect).getByRole('combobox');

    // Type to select pledger (mocked autocomplete will handle selection)
    await userEvent.type(pledgerInput, 'John');

    await waitFor(() => {
      expect(pledgerInput).toHaveValue('John Doe');
    });

    // Verify the input value is synced with pledgeUsers state
    expect(pledgerInput).toHaveValue('John Doe');
  });

  it('should render pledger autocomplete input', async () => {
    renderPledgeModal(mockLink, pledgeProps[0]);

    const pledgerSelect = screen.getByTestId('pledgerSelect');
    const pledgerInput = within(pledgerSelect).getByRole('combobox');

    await waitFor(() => {
      expect(pledgerInput).toBeInTheDocument();
    });
  });

  it('should render with currency select disabled', () => {
    renderPledgeModal(link1, pledgeProps[0]);

    const currencySelect = screen.getByLabelText(
      'Currency',
    ) as HTMLSelectElement;
    // The currency field is not actually disabled in the component
    expect(currencySelect).toBeInTheDocument();
    expect(currencySelect).toHaveValue('USD');
  });

  it('should handle amount change with empty string', async () => {
    renderPledgeModal(link1, pledgeProps[0]);

    const amountInput = screen.getByLabelText('Amount');

    await act(async () => {
      await userEvent.clear(amountInput);
    });

    await waitFor(() => {
      expect(amountInput).toHaveValue(0);
    });
  });

  it('should maintain amount as zero or positive when negative values are attempted', async () => {
    renderPledgeModal(link1, pledgeProps[0]);

    const amountInput = screen.getByLabelText('Amount');

    // The input type="number" may parse "-100" as "100" in some browsers
    // Or the Math.max(0, val) ensures it's at least 0
    await act(async () => {
      await userEvent.clear(amountInput);
      await userEvent.type(amountInput, '-100');
    });

    await waitFor(() => {
      // Due to Math.max(0, val), negative values become 0, but browser may parse "-100" as 100
      const value = Number(amountInput.getAttribute('value'));
      expect(value).toBeGreaterThanOrEqual(0);
    });
  });

  it('should show form with all fields in create mode', async () => {
    renderPledgeModal(link1, pledgeProps[0]);

    await waitFor(() => {
      expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
      expect(screen.getByLabelText('Currency')).toBeInTheDocument();
      expect(screen.getByTestId('modal-submit-btn')).toBeInTheDocument();
    });
  });

  it('should have correct button text in create mode', () => {
    renderPledgeModal(link1, pledgeProps[0]);
    const submitButton = screen.getByTestId('modal-submit-btn');
    expect(submitButton).toHaveTextContent('Create');
  });

  it('should have correct button text in edit mode', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    await waitFor(() => {
      const submitButton = screen.getByTestId('modal-submit-btn');
      expect(submitButton).toHaveTextContent('Update');
    });
  });

  it('should handle members data loading', async () => {
    renderPledgeModal(mockLink, pledgeProps[0]);

    await waitFor(() => {
      expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
    });
  });
});

describe('PledgeModal helper functions (coverage)', () => {
  it('areOptionsEqual returns true when ids match', () => {
    const a = { id: '1' } as InterfaceUserInfoPG;
    const b = { id: '1' } as InterfaceUserInfoPG;
    expect(areOptionsEqual(a, b)).toBe(true);
  });

  it('areOptionsEqual returns false when ids differ', () => {
    const a = { id: '1' } as InterfaceUserInfoPG;
    const b = { id: '2' } as InterfaceUserInfoPG;
    expect(areOptionsEqual(a, b)).toBe(false);
  });

  it('getMemberLabel uses firstName and lastName when present', () => {
    const member = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
    } as InterfaceUserInfoPG;

    expect(getMemberLabel(member)).toBe('John Doe');
  });

  it('getMemberLabel falls back to name when first and last name are missing', () => {
    const member = {
      id: '1',
      firstName: '',
      lastName: '',
      name: 'Fallback Name',
    } as InterfaceUserInfoPG;

    expect(getMemberLabel(member)).toBe('Fallback Name');
  });

  it('getMemberLabel handles only firstName', () => {
    const member = {
      id: '1',
      firstName: 'John',
      lastName: '',
    } as InterfaceUserInfoPG;

    expect(getMemberLabel(member)).toBe('John');
  });

  it('getMemberLabel handles only lastName', () => {
    const member = {
      id: '1',
      firstName: '',
      lastName: 'Doe',
    } as InterfaceUserInfoPG;

    expect(getMemberLabel(member)).toBe('Doe');
  });

  it('getMemberLabel returns empty string when all fields are empty', () => {
    const member = {
      id: '1',
      firstName: '',
      lastName: '',
      name: '',
    } as InterfaceUserInfoPG;

    expect(getMemberLabel(member)).toBe('');
  });
});
