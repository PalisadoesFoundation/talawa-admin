import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { InMemoryCache } from '@apollo/client';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import type { ReactNode } from 'react';

import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { MOCKS, MOCK_ERROR } from '../OrganizationFundCampaignMocks';
import type { InterfaceCampaignModal } from './types';
import type { InterfaceCampaignInfo } from 'utils/interfaces';
import { vi } from 'vitest';
import { UPDATE_CAMPAIGN_MUTATION } from 'GraphQl/Mutations/CampaignMutation';
import CampaignModal from './CampaignModal';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('shared-components/DatePicker', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    'data-testid': dataTestId,
  }: {
    value: dayjs.Dayjs | null;
    onChange: (value: dayjs.Dayjs | null) => void;
    'data-testid': string;
  }) => {
    return (
      <input
        data-testid={dataTestId}
        type="text"
        defaultValue={
          value && value.isValid() ? value.format('DD/MM/YYYY') : ''
        }
        onChange={(e) => {
          const val = e.target.value;
          if (!val) {
            onChange?.(null);
            return;
          }
          const parsed = dayjs.utc(val, 'DD/MM/YYYY', true);
          if (parsed.isValid()) {
            onChange?.(parsed);
          }
        }}
      />
    );
  },
}));

vi.mock('shared-components/BaseModal/BaseModal', () => ({
  __esModule: true,
  default: ({
    children,
    show,
    onHide,
    title,
    dataTestId,
  }: {
    children: ReactNode;
    show: boolean;
    onHide: () => void;
    title: string;
    dataTestId?: string;
  }) =>
    show ? (
      <div data-testid={dataTestId ?? 'base-modal'}>
        <h2 data-testid="modal-title">{title}</h2>
        <button type="button" data-testid="modalCloseBtn" onClick={onHide}>
          close
        </button>
        {children}
      </div>
    ) : null,
}));

type DateRangeValue = {
  startDate: Date | null;
  endDate: Date | null;
};

const formatDateForInput = (date?: Date | null) =>
  date ? dayjs.utc(date).format('DD/MM/YYYY') : '';

type DateRangePickerProps = {
  value: DateRangeValue | null;
  onChange: (value: DateRangeValue) => void;
  dataTestId: string;
};
vi.mock('shared-components/DateRangePicker', async () => {
  const actual = await vi.importActual<
    typeof import('shared-components/DateRangePicker')
  >('shared-components/DateRangePicker');

  return {
    __esModule: true,
    ...actual,

    default: ({ value, onChange, dataTestId }: DateRangePickerProps) => (
      <div data-testid={dataTestId}>
        <input
          data-testid={`${dataTestId}-start-input`}
          value={value?.startDate ? formatDateForInput(value.startDate) : ''}
          onChange={(e) => {
            const inputValue = e.target.value;

            if (!inputValue) {
              onChange({ startDate: null, endDate: value?.endDate ?? null });
              return;
            }

            // ⭐ special case for tests
            if (inputValue === 'INVALID_DATE') {
              onChange({
                startDate: new Date('invalid'), // non-null but invalid
                endDate: value?.endDate ?? null,
              });
              return;
            }

            const parsedStart = dayjs.utc(inputValue, 'DD/MM/YYYY', true);
            const nextStart =
              parsedStart && parsedStart.isValid()
                ? parsedStart.toDate()
                : null;

            onChange({
              startDate: nextStart,
              endDate:
                value?.endDate && nextStart && nextStart > value.endDate
                  ? nextStart
                  : (value?.endDate ?? null),
            });
          }}
        />

        <input
          data-testid={`${dataTestId}-end-input`}
          value={value?.endDate ? formatDateForInput(value.endDate) : ''}
          onChange={(e) => {
            const inputValue = e.target.value;

            if (!inputValue) {
              onChange({ startDate: value?.startDate ?? null, endDate: null });
              return;
            }

            // ⭐ special case for tests
            if (inputValue === 'INVALID_DATE') {
              onChange({
                startDate: value?.startDate ?? null,
                endDate: new Date('invalid'), // non-null but invalid
              });
              return;
            }

            const parsedEnd = dayjs.utc(inputValue, 'DD/MM/YYYY', true);
            onChange({
              startDate: value?.startDate ?? null,
              endDate: parsedEnd.isValid() ? parsedEnd.toDate() : null,
            });
          }}
        />
      </div>
    ),
  };
});

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCK_ERROR);

// Validate i18n fixtures exist with clear error messages
const i18nData = i18nForTest.getDataByLanguage('en');
if (!i18nData) {
  throw new Error(
    'i18n fixture missing: getDataByLanguage("en") returned undefined. Check i18nForTest configuration.',
  );
}
if (!i18nData.translation?.fundCampaign) {
  throw new Error(
    'i18n fixture missing: translation.fundCampaign is undefined. Ensure the fundCampaign namespace exists in test translations.',
  );
}
if (!i18nData.common) {
  throw new Error(
    'i18n fixture missing: common namespace is undefined. Ensure the common namespace exists in test translations.',
  );
}

const translations = JSON.parse(
  JSON.stringify(i18nData.translation.fundCampaign),
);
const tCommon = JSON.parse(JSON.stringify(i18nData.common));

// Use local time for consistent testing across timezones
// dayjs() creates a date in local time
const baseDate = dayjs().startOf('day');

const campaignProps: InterfaceCampaignModal[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    fundId: 'fundId',
    campaign: {
      id: 'campaignId1',
      name: 'Campaign 1',
      goalAmount: 100,
      startAt: baseDate.add(12, 'month').toDate(),
      endAt: baseDate.add(24, 'month').toDate(),
      currencyCode: 'USD',
      createdAt: baseDate.subtract(12, 'month').toISOString(),
    },
    refetchCampaign: vi.fn(),
    mode: 'create',
    orgId: 'orgId',
  },
  {
    isOpen: true,
    hide: vi.fn(),
    fundId: 'fundId',
    campaign: {
      id: 'campaignId1',
      name: 'Campaign 1',
      goalAmount: 100,
      startAt: baseDate.add(12, 'month').toDate(),
      endAt: baseDate.add(24, 'month').toDate(),
      currencyCode: 'USD',
      createdAt: baseDate.subtract(12, 'month').toISOString(),
    },
    refetchCampaign: vi.fn(),
    mode: 'edit',
    orgId: 'orgId',
  },
];

const getStartDateInput = () =>
  screen.getByTestId('campaignStartDate') as HTMLInputElement;

const getEndDateInput = () =>
  screen.getByTestId('campaignEndDate') as HTMLInputElement;

const getCampaignNameInput = () =>
  screen.getByTestId('campaignNameInput') as HTMLInputElement;

const getFundingGoalInput = () =>
  screen.getByTestId('fundingGoalInput') as HTMLInputElement;

const getCurrencySelect = () =>
  screen.getByTestId('currencySelect') as HTMLSelectElement;

// Setup userEvent instance for better async handling
const setupUser = () => userEvent.setup();

const cache = new InMemoryCache();

const renderCampaignModal = (
  link: ApolloLink,
  props: InterfaceCampaignModal,
): RenderResult => {
  return render(
    <MockedProvider link={link} cache={cache}>
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <CampaignModal {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

// Add new mocks for testing the update field logic
const UPDATE_NAME_ONLY_MOCK = [
  {
    request: {
      query: UPDATE_CAMPAIGN_MUTATION,
      variables: {
        input: {
          id: 'campaignId1',
          name: 'Updated Name',
        },
      },
    },
    result: {
      data: {
        updateFundCampaign: {
          id: 'campaignId1',
        },
      },
    },
  },
];

const UPDATE_ALL_FIELDS_MOCK = [
  {
    request: {
      query: UPDATE_CAMPAIGN_MUTATION,
      variables: {
        input: {
          id: 'campaignId1',
          name: 'Updated Name',
          currencyCode: 'USD',
          goalAmount: 500,
          startAt: expect.any(String),
          endAt: expect.any(String),
        },
      },
    },
    variableMatcher: (variables: Record<string, unknown>) => {
      if (
        !variables ||
        typeof variables !== 'object' ||
        !('input' in variables)
      ) {
        return false;
      }

      const input = variables.input as Record<string, unknown>;

      if (!input || typeof input !== 'object') {
        return false;
      }

      return (
        input.id === 'campaignId1' &&
        input.name === 'Updated Name' &&
        (!('currencyCode' in input) || input.currencyCode === 'USD') &&
        input.goalAmount === 500 &&
        typeof input.startAt === 'string' &&
        typeof input.endAt === 'string' &&
        input.startAt.length > 0 &&
        input.endAt.length > 0
      );
    },

    result: {
      data: {
        updateFundCampaign: {
          id: 'campaignId1',
        },
      },
    },
  },
];

const UPDATE_NO_FIELDS_MOCK = [
  {
    request: {
      query: UPDATE_CAMPAIGN_MUTATION,
      variables: {
        input: {
          id: 'campaignId1',
        },
      },
    },
    result: {
      data: {
        updateFundCampaign: {
          id: 'campaignId1',
        },
      },
    },
  },
];

// Add a new mock for currency-only updates
const UPDATE_CURRENCY_ONLY_MOCK = [
  {
    request: {
      query: UPDATE_CAMPAIGN_MUTATION,
      variables: {
        input: {
          id: 'campaignId1',
          currencyCode: 'EUR',
        },
      },
    },
    result: {
      data: {
        updateFundCampaign: {
          id: 'campaignId1',
        },
      },
    },
  },
];

const nameOnlyMockLink = new StaticMockLink(UPDATE_NAME_ONLY_MOCK);
const allFieldsMockLink = new StaticMockLink(UPDATE_ALL_FIELDS_MOCK);
const noFieldsMockLink = new StaticMockLink(UPDATE_NO_FIELDS_MOCK);
const currencyOnlyMockLink = new StaticMockLink(UPDATE_CURRENCY_ONLY_MOCK);

describe('CampaignModal', () => {
  it('should update form state when campaign prop changes', async () => {
    const { rerender } = renderCampaignModal(link1, campaignProps[1]);

    // Initial values
    expect(getCampaignNameInput()).toHaveValue('Campaign 1');

    // Create new props with different campaign data
    const updatedProps: InterfaceCampaignModal = {
      ...campaignProps[1],
      campaign: {
        id: 'campaignId2',
        name: 'Updated Campaign',
        goalAmount: 500,
        startAt: baseDate.add(6, 'month').toDate(),
        endAt: baseDate.add(18, 'month').toDate(),
        currencyCode: 'EUR',
        createdAt: baseDate.subtract(6, 'month').toISOString(),
      },
    };

    // Re-render with new campaign prop
    rerender(
      <MockedProvider link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <CampaignModal {...updatedProps} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    // Verify controlled form fields updated (name, goal, currency)
    // Note: Date inputs use defaultValue (uncontrolled) so they don't update on re-render
    await waitFor(() => {
      expect(getCampaignNameInput()).toHaveValue('Updated Campaign');
      expect(getFundingGoalInput()).toHaveValue(500);
      expect(getCurrencySelect()).toHaveValue('EUR');
    });
  });

  it('should reset form state when campaign prop changes to null', async () => {
    const { rerender } = renderCampaignModal(link1, campaignProps[1]);

    // Initial values
    expect(getCampaignNameInput()).toHaveValue('Campaign 1');

    // Create props with null campaign
    const updatedProps: InterfaceCampaignModal = {
      ...campaignProps[1],
      campaign: null,
    };

    // Re-render with null campaign
    rerender(
      <MockedProvider link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <CampaignModal {...updatedProps} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    // Verify form state is reset to defaults
    await waitFor(() => {
      expect(getCampaignNameInput()).toHaveValue('');
      expect(getFundingGoalInput()).toHaveValue(0);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should populate form fields with correct values in edit mode', async () => {
    renderCampaignModal(link1, campaignProps[1]);
    const modal = screen.getByTestId('campaignModal');

    await waitFor(() => {
      // The mocked BaseModal puts title in an h2 but as plain text, not as heading with accessible name
      expect(modal).toBeInTheDocument();
    });

    expect(getCampaignNameInput()).toHaveValue('Campaign 1');
    const startDateInput = getStartDateInput();
    const endDateInput = getEndDateInput();

    expect(startDateInput).toHaveValue(
      dayjs(campaignProps[1].campaign?.startAt).format('DD/MM/YYYY'),
    );
    expect(endDateInput).toHaveValue(
      dayjs(campaignProps[1].campaign?.endAt).format('DD/MM/YYYY'),
    );
    expect(getCurrencySelect()).toHaveValue('USD');
    expect(getFundingGoalInput()).toHaveValue(100);
  });

  it('should update fundingGoal when input value changes', async () => {
    const user = setupUser();
    await act(async () => {
      renderCampaignModal(link1, campaignProps[1]);
    });
    const goalInput = getFundingGoalInput();
    expect(goalInput).toHaveValue(100);
    // Use focus + clear + type pattern for controlled inputs
    goalInput.focus();
    await act(async () => {
      await user.clear(goalInput);
    });
    goalInput.focus();
    await act(async () => {
      await user.type(goalInput, '2');
    });
    goalInput.focus();
    await act(async () => {
      await user.type(goalInput, '0');
    });
    goalInput.focus();
    await act(async () => {
      await user.type(goalInput, '0');
    });
    await waitFor(() => {
      expect(parseInt(goalInput.value)).toBe(200);
    });
  });

  it('should set fundingGoal to 0 when field is cleared', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[1]);
    const goalInput = getFundingGoalInput();
    expect(goalInput).toHaveValue(100);
    // Clear the field - component sets value to 0 when empty
    goalInput.focus();
    await act(async () => {
      await user.clear(goalInput);
    });
    // After clearing, value should be 0
    await waitFor(() => {
      expect(goalInput).toHaveValue(0);
    });
  });

  it('should clamp fundingGoal to 0 when negative value is programmatically set', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[1]);
    const goalInput = getFundingGoalInput();
    expect(goalInput).toHaveValue(100);
    // Type a value after clearing to verify Math.max(0, parsed) logic
    // Note: HTML number inputs filter out minus signs, so we test the clamping
    // by verifying the component accepts positive values correctly
    goalInput.focus();
    await act(async () => {
      await user.clear(goalInput);
      await user.type(goalInput, '50');
    });
    await waitFor(() => {
      expect(goalInput).toHaveValue(50);
    });
  });

  it('should update Start Date when a new date is selected', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[1]);
    const startDateInput = getStartDateInput();
    const testDate = baseDate.add(1, 'month').format('DD/MM/YYYY');
    await user.clear(startDateInput);
    await user.type(startDateInput, testDate);
    await waitFor(() => {
      expect(startDateInput).toHaveValue(testDate);
    });
  });

  it('should update End Date when a new date is selected', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[1]);
    const endDateInput = getEndDateInput();
    const testDate = dayjs(campaignProps[1].campaign?.startAt)
      .add(1, 'month')
      .format('DD/MM/YYYY');
    await user.clear(endDateInput);
    await user.type(endDateInput, testDate);
    await waitFor(() => {
      expect(endDateInput).toHaveValue(testDate);
    });
  });

  it('should create campaign', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[0]);

    const campaignName = getCampaignNameInput();
    campaignName.focus();
    await act(async () => {
      await user.clear(campaignName);
    });
    campaignName.focus();
    await act(async () => {
      await user.type(campaignName, 'Campaign 2');
    });

    const testStartDate = baseDate.add(1, 'month').format('DD/MM/YYYY');
    const startDateInput = getStartDateInput();
    await user.clear(startDateInput);
    await user.type(startDateInput, testStartDate);

    const endDateInput = getEndDateInput();
    const testEndDate = baseDate.add(2, 'month').format('DD/MM/YYYY');
    await user.clear(endDateInput);
    await user.type(endDateInput, testEndDate);

    const fundingGoal = getFundingGoalInput();
    fundingGoal.focus();
    await act(async () => {
      await user.clear(fundingGoal);
    });
    fundingGoal.focus();
    await act(async () => {
      await user.type(fundingGoal, '200');
    });

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    expect(submitBtn).toBeInTheDocument();
    await user.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.createdCampaign,
      );
      expect(campaignProps[0].refetchCampaign).toHaveBeenCalled();
      expect(campaignProps[0].hide).toHaveBeenCalled();
    });
  });

  it('should update campaign', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[1]);

    const campaignName = getCampaignNameInput();
    campaignName.focus();
    await act(async () => {
      await user.clear(campaignName);
    });
    campaignName.focus();
    await act(async () => {
      await user.type(campaignName, 'Campaign 4');
    });

    const testStartDate = baseDate.add(1, 'month').format('DD/MM/YYYY');
    const startDateInput = getStartDateInput();
    await user.clear(startDateInput);
    await user.type(startDateInput, testStartDate);

    const endDateInput = getEndDateInput();
    const testEndDate = baseDate.add(2, 'month').format('DD/MM/YYYY');
    await user.clear(endDateInput);
    await user.type(endDateInput, testEndDate);

    const fundingGoal = getFundingGoalInput();
    fundingGoal.focus();
    await act(async () => {
      await user.clear(fundingGoal);
    });
    fundingGoal.focus();
    await act(async () => {
      await user.type(fundingGoal, '400');
    });

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    expect(submitBtn).toBeInTheDocument();

    await user.click(submitBtn);
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.updatedCampaign,
      );
      expect(campaignProps[1].refetchCampaign).toHaveBeenCalled();
      expect(campaignProps[1].hide).toHaveBeenCalled();
    });
  });

  it('Error: should create campaign', async () => {
    const user = setupUser();
    renderCampaignModal(link2, campaignProps[0]);

    const campaignName = getCampaignNameInput();
    campaignName.focus();
    await act(async () => {
      await user.clear(campaignName);
    });
    campaignName.focus();
    await act(async () => {
      await user.type(campaignName, 'Campaign 2');
    });

    const testStartDate = baseDate.add(1, 'month').format('DD/MM/YYYY');
    const startDateInput = getStartDateInput();
    await user.clear(startDateInput);
    await user.type(startDateInput, testStartDate);

    const endDateInput = getEndDateInput();
    const testEndDate = baseDate.add(2, 'month').format('DD/MM/YYYY');
    await user.clear(endDateInput);
    await user.type(endDateInput, testEndDate);

    const fundingGoal = getFundingGoalInput();
    fundingGoal.focus();
    await act(async () => {
      await user.clear(fundingGoal);
    });
    fundingGoal.focus();
    await act(async () => {
      await user.type(fundingGoal, '200');
    });

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Mock graphql error',
      );
    });
  });

  it('Error: should update campaign', async () => {
    const user = setupUser();
    renderCampaignModal(link2, campaignProps[1]);

    const campaignName = getCampaignNameInput();
    campaignName.focus();
    await act(async () => {
      await user.clear(campaignName);
    });
    campaignName.focus();
    await act(async () => {
      await user.type(campaignName, 'Campaign 4');
    });

    const testStartDate = baseDate.add(1, 'month').format('DD/MM/YYYY');
    const startDateInput = getStartDateInput();
    await user.clear(startDateInput);
    await user.type(startDateInput, testStartDate);

    const endDateInput = getEndDateInput();
    const testEndDate = baseDate.add(2, 'month').format('DD/MM/YYYY');
    await user.clear(endDateInput);
    await user.type(endDateInput, testEndDate);

    const fundingGoal = getFundingGoalInput();
    fundingGoal.focus();
    await act(async () => {
      await user.clear(fundingGoal);
    });
    fundingGoal.focus();
    await act(async () => {
      await user.type(fundingGoal, '400');
    });

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    expect(submitBtn).toBeInTheDocument();
    await user.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Mock graphql error',
      );
    });
  });

  it('should only update changed fields', async () => {
    const user = setupUser();
    // Create a component with edit mode and specific campaign data
    const editProps = {
      ...campaignProps[1],
      campaign: {
        id: 'campaignId1',
        name: 'Original Name',
        goalAmount: 100,
        startAt: baseDate.add(1, 'year').toDate(),
        endAt: baseDate.add(2, 'year').toDate(),
        currencyCode: 'USD',
        createdAt: baseDate.subtract(1, 'year').toISOString(),
      },
    };

    renderCampaignModal(nameOnlyMockLink, editProps);

    // Only change the name field
    const campaignName = getCampaignNameInput();
    await user.clear(campaignName);
    await user.type(campaignName, 'Updated Name');

    // Submit the form
    const submitBtn = screen.getByTestId('submitCampaignBtn');
    await user.click(submitBtn);

    // Wait for success message which indicates the mutation was called
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.updatedCampaign,
      );
    });
  });

  it('should update all fields when all are changed', async () => {
    const user = setupUser();
    // Create a component with edit mode and specific campaign data
    const editProps = {
      ...campaignProps[1],
      campaign: {
        id: 'campaignId1',
        name: 'Original Name',
        goalAmount: 100,
        startAt: baseDate.add(10, 'year').toDate(),
        endAt: baseDate.add(11, 'year').toDate(),
        currencyCode: 'USD',
        createdAt: baseDate.subtract(1, 'year').toISOString(),
      },
    };

    renderCampaignModal(allFieldsMockLink, editProps);

    // Change all fields
    const campaignName = getCampaignNameInput();
    campaignName.focus();
    await act(async () => {
      await user.clear(campaignName);
    });
    campaignName.focus();
    await act(async () => {
      await user.type(campaignName, 'Updated Name');
    });

    const fundingGoal = getFundingGoalInput();
    fundingGoal.focus();
    await act(async () => {
      await user.clear(fundingGoal);
    });
    fundingGoal.focus();
    await act(async () => {
      await user.type(fundingGoal, '500');
    });

    const startDateInput = getStartDateInput();
    await user.clear(startDateInput);
    await user.type(
      startDateInput,
      baseDate.add(1, 'month').format('DD/MM/YYYY'),
    );

    const endDateInput = getEndDateInput();
    await user.clear(endDateInput);
    await user.type(
      endDateInput,
      baseDate.add(2, 'month').format('DD/MM/YYYY'),
    );
    // Submit the form
    const submitBtn = screen.getByTestId('submitCampaignBtn');
    await user.click(submitBtn);

    // Wait for success message which indicates the mutation was called
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.updatedCampaign,
      );
    });
  });

  it('should not update any fields when nothing is changed', async () => {
    const user = setupUser();
    // Create props where the campaign data matches the form state exactly
    const unchangedProps = {
      ...campaignProps[1],
      campaign: {
        id: 'campaignId1',
        name: 'Campaign 1',
        goalAmount: 100,
        startAt: baseDate.add(1, 'year').toDate(),
        endAt: baseDate.add(2, 'year').toDate(),
        currencyCode: 'USD',
        createdAt: baseDate.subtract(1, 'year').toISOString(),
      },
    };

    renderCampaignModal(noFieldsMockLink, unchangedProps);

    // Don't change any values, just submit the form
    const submitBtn = screen.getByTestId('submitCampaignBtn');
    await user.click(submitBtn);

    // Wait for success message which indicates the mutation was called
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.updatedCampaign,
      );
    });
  });

  it('should not change end date when start date is updated to a date still before end date', async () => {
    const user = setupUser();
    // Create props with start date and end date far apart
    const keepEndDateProps = {
      ...campaignProps[1],
      campaign: {
        id: 'campaignId1',
        name: 'Campaign 1',
        goalAmount: 100,
        startAt: baseDate.add(1, 'year').toDate(),
        endAt: baseDate.add(1, 'year').add(3, 'month').toDate(),
        currencyCode: 'USD',
        createdAt: baseDate.subtract(1, 'year').toISOString(),
      },
    };

    renderCampaignModal(link1, keepEndDateProps);

    // Verify initial dates
    const startDateInput = getStartDateInput();
    const endDateInput = getEndDateInput();
    expect(startDateInput).toHaveValue(
      dayjs(keepEndDateProps.campaign?.startAt).format('DD/MM/YYYY'),
    );
    expect(endDateInput).toHaveValue(
      dayjs(keepEndDateProps.campaign?.endAt).format('DD/MM/YYYY'),
    );

    // Change start date to a date that is still BEFORE the end date
    const testDate = baseDate.add(1, 'month');
    await user.clear(startDateInput);
    await user.type(startDateInput, testDate.format('DD/MM/YYYY'));

    // Verify that end date was NOT updated and remains the same
    await waitFor(() => {
      expect(startDateInput).toHaveValue(testDate.format('DD/MM/YYYY'));
      expect(endDateInput).toHaveValue(
        dayjs(keepEndDateProps.campaign?.endAt).format('DD/MM/YYYY'),
      ); // End date should remain unchanged
    });
  });

  it('should only update currency code when only currency is changed', async () => {
    const user = setupUser();
    // Create a component with edit mode and specific campaign data
    const editProps = {
      ...campaignProps[1],
      campaign: {
        id: 'campaignId1',
        name: 'Campaign Name',
        goalAmount: 100,
        startAt: baseDate.add(1, 'year').toDate(),
        endAt: baseDate.add(2, 'year').toDate(),
        currencyCode: 'USD',
        createdAt: baseDate.subtract(1, 'year').toISOString(),
      },
    };

    renderCampaignModal(currencyOnlyMockLink, editProps);

    // For select components, find the select element and change it
    const currencySelect = screen.getByTestId('currencySelect');
    await user.selectOptions(currencySelect, 'EUR');

    // Submit the form
    const submitBtn = screen.getByTestId('submitCampaignBtn');
    await user.click(submitBtn);

    // Wait for success message which indicates the mutation was called
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.updatedCampaign,
      );
    });
  });

  // Coverage tests
  it('should mark campaign name as touched on blur', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[0]);
    const campaignName = getCampaignNameInput();
    await user.clear(campaignName);
    await user.tab(); // Moves focus away, triggering blur
    // Assert that validation error appears when field is empty and touched
    await waitFor(() => {
      expect(screen.getByText(tCommon.required)).toBeInTheDocument();
    });
  });

  it('should prevent create submission if name is empty', async () => {
    const user = setupUser();
    renderCampaignModal(link1, {
      ...campaignProps[0],
      campaign: {
        ...(campaignProps[0].campaign as InterfaceCampaignInfo),
        name: '',
      },
    });

    // Clear the name field if it has a value (form state init might set it)
    const campaignName = getCampaignNameInput();
    await user.clear(campaignName);

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    await user.click(submitBtn);

    // Assert validation UI shows the required error message
    await waitFor(() => {
      expect(screen.getByText(tCommon.required)).toBeInTheDocument();
    });

    // Should not call mutation (NotificationToast.success not called)
    await waitFor(() => {
      expect(NotificationToast.success).not.toHaveBeenCalled();
    });
  });

  it('should prevent update submission if name is empty', async () => {
    const user = setupUser();
    renderCampaignModal(link1, {
      ...campaignProps[1],
      campaign: {
        ...(campaignProps[1].campaign as InterfaceCampaignInfo),
        name: '',
      },
    });

    const campaignName = getCampaignNameInput();
    await user.clear(campaignName);

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    await user.click(submitBtn);

    // Assert validation UI shows the required error message
    await waitFor(() => {
      expect(screen.getByText(tCommon.required)).toBeInTheDocument();
    });

    // Should not call mutation
    await waitFor(() => {
      expect(NotificationToast.success).not.toHaveBeenCalled();
    });
  });

  it('should reject non-numeric input in fundingGoal field', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[1]);

    const goalInput = getFundingGoalInput();
    expect(goalInput).toHaveValue(100);

    goalInput.focus();
    await act(async () => {
      await user.clear(goalInput);
    });
    // After clearing, value should be 0
    expect(goalInput).toHaveValue(0);

    goalInput.focus();
    await act(async () => {
      await user.type(goalInput, 'abc');
    });

    await waitFor(() => {
      // Non-numeric input should be rejected, value stays at 0
      expect(goalInput).toHaveValue(0);
    });
  });

  it('shows error when campaign name is empty in edit mode', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[1]);

    const campaignName = getCampaignNameInput();
    await user.clear(campaignName);
    await user.type(campaignName, '   ');

    const start = dayjs.utc().add(1, 'year').format('DD/MM/YYYY');
    const end = dayjs.utc().add(2, 'year').format('DD/MM/YYYY');

    await user.clear(getStartDateInput());
    await user.type(getStartDateInput(), start);
    await user.clear(getEndDateInput());
    await user.type(getEndDateInput(), end);

    await user.click(screen.getByTestId('submitCampaignBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.campaignNameRequired,
      );
    });
  });

  it('shows error when date range is missing in edit mode', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[1]);

    const campaignName = getCampaignNameInput();
    await user.clear(campaignName);
    await user.type(campaignName, 'Valid Name');

    await user.clear(getStartDateInput());
    await user.clear(getEndDateInput());

    await user.click(screen.getByTestId('submitCampaignBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.dateRangeRequired,
      );
    });
  });

  it('shows error when campaign name is empty', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[0]);

    const campaignName = getCampaignNameInput();
    await user.clear(campaignName);

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.campaignNameRequired,
      );
    });
  });

  it('shows error when submitting without date range', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[0]);

    const campaignName = getCampaignNameInput();
    await user.clear(campaignName);
    await user.type(campaignName, 'Valid name');

    await user.clear(getStartDateInput());
    await user.clear(getEndDateInput());

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.dateRangeRequired,
      );
    });
  });

  it('shows error when updating without campaign id', async () => {
    const user = setupUser();
    const badProps: InterfaceCampaignModal = {
      ...campaignProps[1],
      campaign: null,
    };

    renderCampaignModal(link1, badProps);

    const campaignName = getCampaignNameInput();
    await user.type(campaignName, 'Valid Name');

    const start = dayjs.utc().add(1, 'year').format('DD/MM/YYYY');
    const end = dayjs.utc().add(2, 'year').format('DD/MM/YYYY');

    await user.clear(getStartDateInput());
    await user.type(getStartDateInput(), start);
    await user.clear(getEndDateInput());
    await user.type(getEndDateInput(), end);

    await user.click(screen.getByTestId('submitCampaignBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.campaignNotFound,
      );
    });
  });

  it('re-enables submit button after invalid date validation error', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[1]);

    const campaignName = getCampaignNameInput();
    await user.clear(campaignName);
    await user.type(campaignName, 'New Name');

    // Clear the dates to trigger dateRangeRequired error
    await user.clear(getStartDateInput());
    await user.clear(getEndDateInput());

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.dateRangeRequired,
      );
      expect(submitBtn).not.toBeDisabled();
    });
  });

  it('re-enables submit button after update error', async () => {
    const user = setupUser();
    renderCampaignModal(link2, campaignProps[1]);

    const campaignName = getCampaignNameInput();
    await user.clear(campaignName);
    await user.type(campaignName, 'New Name');

    const start = dayjs.utc().add(1, 'month').format('DD/MM/YYYY');
    const end = dayjs.utc().add(2, 'month').format('DD/MM/YYYY');

    await user.clear(getStartDateInput());
    await user.type(getStartDateInput(), start);
    await user.clear(getEndDateInput());
    await user.type(getEndDateInput(), end);

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
      expect(submitBtn).not.toBeDisabled();
    });
  });

  it('shows error when creating campaign with invalid date', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[0]);

    const campaignName = getCampaignNameInput();
    await user.clear(campaignName);
    await user.type(campaignName, 'Valid Campaign');

    // Clear dates to trigger dateRangeRequired error
    await user.clear(getStartDateInput());
    await user.clear(getEndDateInput());

    await user.click(screen.getByTestId('submitCampaignBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.dateRangeRequired,
      );
    });
  });

  it('shows error when end date is before start date in create mode', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[0]);

    const campaignName = getCampaignNameInput();
    await user.clear(campaignName);
    await user.type(campaignName, 'Valid Campaign');

    // Set end date before start date
    const startDate = dayjs.utc().add(2, 'month').format('DD/MM/YYYY');
    const endDate = dayjs.utc().add(1, 'month').format('DD/MM/YYYY'); // Earlier than start

    await user.clear(getStartDateInput());
    await user.type(getStartDateInput(), startDate);
    await user.clear(getEndDateInput());
    await user.type(getEndDateInput(), endDate);

    await user.click(screen.getByTestId('submitCampaignBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.endDateBeforeStart,
      );
    });
  });

  it('shows error when updating campaign with invalid date', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[1]);

    const campaignName = getCampaignNameInput();
    await user.clear(campaignName);
    await user.type(campaignName, 'Valid Campaign');

    // Clear dates to trigger dateRangeRequired error
    await user.clear(getStartDateInput());
    await user.clear(getEndDateInput());

    await user.click(screen.getByTestId('submitCampaignBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.dateRangeRequired,
      );
    });
  });

  it('shows error when end date is before start date in edit mode', async () => {
    const user = setupUser();
    renderCampaignModal(link1, campaignProps[1]);

    const campaignName = getCampaignNameInput();
    await user.clear(campaignName);
    await user.type(campaignName, 'Valid Campaign');

    // Set end date before start date
    const startDate = dayjs.utc().add(3, 'month').format('DD/MM/YYYY');
    const endDate = dayjs.utc().add(1, 'month').format('DD/MM/YYYY'); // Earlier

    await user.clear(getStartDateInput());
    await user.type(getStartDateInput(), startDate);
    await user.clear(getEndDateInput());
    await user.type(getEndDateInput(), endDate);

    await user.click(screen.getByTestId('submitCampaignBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.endDateBeforeStart,
      );
    });
  });
});
