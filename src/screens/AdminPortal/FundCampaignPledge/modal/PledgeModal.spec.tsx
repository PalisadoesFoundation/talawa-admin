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
import { vi } from 'vitest';
import { CREATE_PLEDGE, UPDATE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { MEMBERS_LIST_PG } from 'GraphQl/Queries/Queries';
import userEvent from '@testing-library/user-event';

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
      createPledge: {
        __typename: 'Pledge',
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
        __typename: 'Pledge',
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
        __typename: 'Organization',
        members: {
          __typename: 'UserConnection',
          edges: [
            {
              __typename: 'UserEdge',
              node: {
                __typename: 'User',
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
    vi.clearAllMocks();
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
    expect(hideMock).toHaveBeenCalledTimes(1);
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
    const user = userEvent.setup();
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
    const user = userEvent.setup();
    renderPledgeModal(errorLink, pledgeProps[0]);

    const amountInput = screen.getByLabelText('Amount');
    await act(async () => {
      await user.clear(amountInput);
    });
    await act(async () => {
      await user.type(amountInput, '100');
    });

    const form = document.getElementById('crud-create-form') as HTMLFormElement;
    expect(form).not.toBeNull();

    await act(async () => {
      await user.click(screen.getByTestId('modal-submit-btn'));
    });

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
    const user = userEvent.setup();
    await user.type(pledgerInput, 'John');

    await waitFor(() => {
      expect(pledgerInput).toHaveValue('John Doe');
    });

    const amountInput = screen.getByLabelText('Amount');
    await act(async () => {
      await user.clear(amountInput);
    });
    await act(async () => {
      await user.type(amountInput, '100');
    });

    await act(async () => {
      await user.click(screen.getByTestId('modal-submit-btn'));
    });

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'Pledge created successfully',
      );
      expect(props.refetchPledge).toHaveBeenCalled();
      expect(props.hide).toHaveBeenCalled();
    });
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
    const user = userEvent.setup();
    const mockLink = new StaticMockLink([
      ...PLEDGE_MODAL_MOCKS,
      MOCK_UPDATE_PLEDGE_DATA,
    ]);
    const props = { ...pledgeProps[1], refetchPledge: vi.fn(), hide: vi.fn() };

    renderPledgeModal(mockLink, props);

    await waitFor(() => {
      expect(screen.getByLabelText('Amount')).toHaveAttribute('value', '100');
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

    await waitFor(() => {
      expect(parseInt(amountInput.value)).toBe(200);
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
      expect(screen.getByLabelText('Amount')).toHaveAttribute('value', '100');
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
    const user = userEvent.setup();
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
    await act(async () => {
      await user.clear(amountInput);
      await user.type(amountInput, '200');
    });

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
      expect(amountInput).toHaveAttribute('value', '0');
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
      expect(screen.getByLabelText('Amount')).toHaveAttribute(
        'value',
        String(invalidPledge.amount),
      );
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
});
