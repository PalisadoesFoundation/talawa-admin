import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(customParseFormat);
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
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
import type { ReactNode } from 'react';

import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { MOCKS, MOCK_ERROR } from '../OrganizationFundCampaignMocks';
import type { InterfaceCampaignModalProps } from 'types/AdminPortal/CampaignModal/interface';
import { vi } from 'vitest';
import { UPDATE_CAMPAIGN_MUTATION } from 'GraphQl/Mutations/CampaignMutation';
import CampaignModal, { getUpdatedDateIfChanged } from './CampaignModal';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('shared-components/DatePicker', () => ({
  __esModule: true,
  default: ({
    label,
    value,
    onChange,
    minDate,
    format,
    'data-testid': dataTestId,
  }: {
    label?: string;
    value?: dayjs.Dayjs | null;
    onChange: (date: dayjs.Dayjs | null) => void;
    minDate?: dayjs.Dayjs;
    format?: string;
    'data-testid'?: string;
  }) => {
    const displayFormat = format ?? 'MM/DD/YYYY';
    return (
      <div data-testid={`${dataTestId || label}-wrapper`}>
        {label ? <label htmlFor={dataTestId || label}>{label}</label> : null}
        <input
          data-testid={dataTestId || label}
          id={dataTestId || label}
          value={value ? value.format(displayFormat) : ''}
          onChange={(e) => {
            const nextValue = e.target.value;
            const nextDate = nextValue ? dayjs(nextValue, displayFormat) : null;
            if (
              !minDate ||
              !nextDate ||
              nextDate.isAfter(minDate, 'day') ||
              nextDate.isSame(minDate, 'day')
            ) {
              onChange(nextDate);
            }
          }}
        />
      </div>
    );
  },
}));

vi.mock('@mui/x-date-pickers/DateTimePicker', async () => {
  const actual = await vi.importActual(
    '@mui/x-date-pickers/DesktopDateTimePicker',
  );
  return { DateTimePicker: actual.DesktopDateTimePicker };
});

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
    ...actual, // keeps LocalizationProvider + AdapterDayjs

    default: ({ value, onChange, dataTestId }: DateRangePickerProps) => (
      <div data-testid={dataTestId}>
        <input
          data-testid={`${dataTestId}-start-input`}
          value={value?.startDate ? formatDateForInput(value.startDate) : ''}
          onChange={(e) => {
            const nextStart = e.target.value
              ? dayjs.utc(e.target.value, 'DD/MM/YYYY', true).toDate()
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
          onChange={(e) =>
            onChange({
              startDate: value?.startDate ?? null,
              endDate: e.target.value
                ? dayjs.utc(e.target.value, 'DD/MM/YYYY', true).toDate()
                : null,
            })
          }
        />
      </div>
    ),
  };
});

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCK_ERROR);
const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.fundCampaign),
);

const campaignProps: InterfaceCampaignModalProps[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    fundId: 'fundId',
    orgId: 'orgId',
    campaign: {
      id: 'campaignId1',
      name: 'Campaign 1',
      goalAmount: 100,
      startAt: dayjs.utc().add(12, 'month').toDate(),
      endAt: dayjs.utc().add(24, 'month').toDate(),
      currencyCode: 'USD',
      createdAt: dayjs.utc().subtract(12, 'month').toISOString(),
    },
    refetchCampaign: vi.fn(),
    mode: 'create',
  },
  {
    isOpen: true,
    hide: vi.fn(),
    fundId: 'fundId',
    orgId: 'orgId',
    campaign: {
      id: 'campaignId1',
      name: 'Campaign 1',
      goalAmount: 100,
      startAt: dayjs.utc().add(12, 'month').toDate(),
      endAt: dayjs.utc().add(24, 'month').toDate(),
      currencyCode: 'USD',
      createdAt: dayjs.utc().subtract(12, 'month').toISOString(),
    },
    refetchCampaign: vi.fn(),
    mode: 'edit',
  },
];

const getStartDateInput = () =>
  screen.getByTestId('campaign-date-range-start-input') as HTMLInputElement;

const getEndDateInput = () =>
  screen.getByTestId('campaign-date-range-end-input') as HTMLInputElement;

const renderCampaignModal = (
  link: ApolloLink,
  props: InterfaceCampaignModalProps,
): RenderResult => {
  return render(
    <MockedProvider link={link}>
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
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should populate form fields with correct values in edit mode', async () => {
    renderCampaignModal(link1, campaignProps[1]);
    const modal = screen.getByTestId('campaignModal');

    await waitFor(() => {
      expect(
        within(modal).getByRole('heading', {
          name: translations.updateCampaign,
        }),
      ).toBeInTheDocument();
    });

    expect(screen.getByLabelText(translations.campaignName)).toHaveValue(
      'Campaign 1',
    );
    const startDateInput = getStartDateInput();
    const endDateInput = getEndDateInput();

    expect(startDateInput).toHaveValue(
      dayjs.utc(campaignProps[1].campaign?.startAt).format('DD/MM/YYYY'),
    );
    expect(endDateInput).toHaveValue(
      dayjs.utc(campaignProps[1].campaign?.endAt).format('DD/MM/YYYY'),
    );
    expect(screen.getByLabelText(translations.currency)).toHaveTextContent(
      'USD ($)',
    );
    expect(screen.getByLabelText(translations.fundingGoal)).toHaveValue('100');
  });

  it('should update fundingGoal when input value changes', async () => {
    renderCampaignModal(link1, campaignProps[1]);
    const goalInput = screen.getByLabelText(translations.fundingGoal);
    expect(goalInput).toHaveValue('100');
    fireEvent.change(goalInput, { target: { value: '200' } });
    expect(goalInput).toHaveValue('200');
  });

  it('should not update fundingGoal when input value is less than or equal to 0', async () => {
    renderCampaignModal(link1, campaignProps[1]);
    const goalInput = screen.getByLabelText(translations.fundingGoal);
    expect(goalInput).toHaveValue('100');
    fireEvent.change(goalInput, { target: { value: '-10' } });
    expect(goalInput).toHaveValue('100');
  });

  it('should update Start Date when a new date is selected', async () => {
    renderCampaignModal(link1, campaignProps[1]);
    const startDateInput = getStartDateInput();
    const testDate = dayjs.utc().add(1, 'month').format('DD/MM/YYYY');
    fireEvent.change(startDateInput, { target: { value: testDate } });
    expect(startDateInput).toHaveValue(testDate);
  });

  it('should update End Date when a new date is selected', async () => {
    renderCampaignModal(link1, campaignProps[1]);
    const endDateInput = getEndDateInput();
    const testDate = dayjs.utc().add(1, 'month').format('DD/MM/YYYY');
    fireEvent.change(endDateInput, { target: { value: testDate } });
    expect(endDateInput).toHaveValue(testDate);
  });

  it('should create campaign', async () => {
    renderCampaignModal(link1, campaignProps[0]);

    const campaignName = screen.getByLabelText(translations.campaignName);
    fireEvent.change(campaignName, { target: { value: 'Campaign 2' } });

    const testStartDate = dayjs.utc().add(1, 'month').format('DD/MM/YYYY');
    const startDateInput = getStartDateInput();
    fireEvent.change(startDateInput, { target: { value: testStartDate } });

    const endDateInput = getEndDateInput();
    const testEndDate = dayjs.utc().add(2, 'month').format('DD/MM/YYYY');
    fireEvent.change(endDateInput, { target: { value: testEndDate } });
    const fundingGoal = screen.getByLabelText(translations.fundingGoal);
    fireEvent.change(fundingGoal, { target: { value: '200' } });

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.createdCampaign,
      );
      expect(campaignProps[0].refetchCampaign).toHaveBeenCalled();
      expect(campaignProps[0].hide).toHaveBeenCalled();
    });
  });

  it('should update campaign', async () => {
    renderCampaignModal(link1, campaignProps[1]);

    const campaignName = screen.getByLabelText(translations.campaignName);
    fireEvent.change(campaignName, { target: { value: 'Campaign 4' } });

    const testStartDate = dayjs.utc().add(1, 'month').format('DD/MM/YYYY');
    const startDateInput = getStartDateInput();
    fireEvent.change(startDateInput, { target: { value: testStartDate } });

    const endDateInput = getEndDateInput();
    const testEndDate = dayjs.utc().add(2, 'month').format('DD/MM/YYYY');
    fireEvent.change(endDateInput, { target: { value: testEndDate } });
    const fundingGoal = screen.getByLabelText(translations.fundingGoal);
    fireEvent.change(fundingGoal, { target: { value: '400' } });

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    expect(submitBtn).toBeInTheDocument();

    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.updatedCampaign,
      );
      expect(campaignProps[1].refetchCampaign).toHaveBeenCalled();
      expect(campaignProps[1].hide).toHaveBeenCalled();
    });
  });

  it('Error: should create campaign', async () => {
    renderCampaignModal(link2, campaignProps[0]);

    const campaignName = screen.getByLabelText(translations.campaignName);
    fireEvent.change(campaignName, { target: { value: 'Campaign 2' } });

    const testStartDate = dayjs.utc().add(1, 'month').format('DD/MM/YYYY');
    const startDateInput = getStartDateInput();
    fireEvent.change(startDateInput, { target: { value: testStartDate } });

    const endDateInput = getEndDateInput();
    const testEndDate = dayjs.utc().add(2, 'month').format('DD/MM/YYYY');
    fireEvent.change(endDateInput, { target: { value: testEndDate } });
    const fundingGoal = screen.getByLabelText(translations.fundingGoal);
    fireEvent.change(fundingGoal, { target: { value: '200' } });

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Mock graphql error',
      );
    });
  });

  it('Error: should update campaign', async () => {
    renderCampaignModal(link2, campaignProps[1]);

    const campaignName = screen.getByLabelText(translations.campaignName);
    fireEvent.change(campaignName, { target: { value: 'Campaign 4' } });

    const testStartDate = dayjs.utc().add(1, 'month').format('DD/MM/YYYY');
    const startDateInput = getStartDateInput();
    fireEvent.change(startDateInput, { target: { value: testStartDate } });

    const endDateInput = getEndDateInput();
    const testEndDate = dayjs.utc().add(2, 'month').format('DD/MM/YYYY');
    fireEvent.change(endDateInput, { target: { value: testEndDate } });
    const fundingGoal = screen.getByLabelText(translations.fundingGoal);
    fireEvent.change(fundingGoal, { target: { value: '400' } });

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Mock graphql error',
      );
    });
  });

  it('should only update changed fields', async () => {
    // Create a component with edit mode and specific campaign data
    const editProps = {
      ...campaignProps[1],
      campaign: {
        id: 'campaignId1',
        name: 'Original Name',
        goalAmount: 100,
        startAt: dayjs.utc().add(1, 'year').toDate(),
        endAt: dayjs.utc().add(2, 'year').toDate(),
        currencyCode: 'USD',
        createdAt: dayjs.utc().subtract(1, 'year').toISOString(),
      },
    };

    renderCampaignModal(nameOnlyMockLink, editProps);

    // Only change the name field
    const campaignName = screen.getByLabelText(translations.campaignName);
    fireEvent.change(campaignName, { target: { value: 'Updated Name' } });

    // Submit the form
    const submitBtn = screen.getByTestId('submitCampaignBtn');
    fireEvent.click(submitBtn);

    // Wait for success message which indicates the mutation was called
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.updatedCampaign,
      );
    });
  });

  it('should update all fields when all are changed', async () => {
    // Create a component with edit mode and specific campaign data
    const editProps = {
      ...campaignProps[1],
      campaign: {
        id: 'campaignId1',
        name: 'Original Name',
        goalAmount: 100,
        startAt: dayjs.utc().add(10, 'year').toDate(),
        endAt: dayjs.utc().add(11, 'year').toDate(),
        currencyCode: 'USD',
        createdAt: dayjs.utc().subtract(1, 'year').toISOString(),
      },
    };

    renderCampaignModal(allFieldsMockLink, editProps);

    // Change all fields
    const campaignName = screen.getByLabelText(translations.campaignName);
    fireEvent.change(campaignName, { target: { value: 'Updated Name' } });

    const fundingGoal = screen.getByLabelText(translations.fundingGoal);
    fireEvent.change(fundingGoal, { target: { value: '500' } });

    const startDateInput = getStartDateInput();
    fireEvent.change(startDateInput, {
      target: { value: dayjs.utc().add(1, 'month').format('DD/MM/YYYY') },
    });

    const endDateInput = getEndDateInput();
    fireEvent.change(endDateInput, {
      target: { value: dayjs.utc().add(2, 'month').format('DD/MM/YYYY') },
    });
    // Submit the form
    const submitBtn = screen.getByTestId('submitCampaignBtn');
    fireEvent.click(submitBtn);

    // Wait for success message which indicates the mutation was called
  });

  it('should not update any fields when nothing is changed', async () => {
    // Create props where the campaign data matches the form state exactly
    const unchangedProps = {
      ...campaignProps[1],
      campaign: {
        id: 'campaignId1',
        name: 'Campaign 1',
        goalAmount: 100,
        startAt: dayjs.utc().add(1, 'year').toDate(),
        endAt: dayjs.utc().add(2, 'year').toDate(),
        currencyCode: 'USD',
        createdAt: dayjs.utc().subtract(1, 'year').toISOString(),
      },
    };

    renderCampaignModal(noFieldsMockLink, unchangedProps);

    // Don't change any values, just submit the form
    const submitBtn = screen.getByTestId('submitCampaignBtn');
    fireEvent.click(submitBtn);

    // Wait for success message which indicates the mutation was called
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.updatedCampaign,
      );
    });
  });

  it('should auto-update end date when start date is set to a later date', async () => {
    // Create props with start date before end date
    const autoUpdateDateProps = {
      ...campaignProps[1],
      campaign: {
        id: 'campaignId1',
        name: 'Campaign 1',
        goalAmount: 100,
        startAt: dayjs.utc().add(1, 'year').toDate(),
        endAt: dayjs.utc().add(1, 'year').add(1, 'month').toDate(),
        currencyCode: 'USD',
        createdAt: dayjs.utc().subtract(1, 'year').toISOString(),
      },
    };

    renderCampaignModal(link1, autoUpdateDateProps);

    // Verify initial dates
    const startDateInput = getStartDateInput();
    const endDateInput = getEndDateInput();

    expect(startDateInput).toHaveValue(
      formatDateForInput(autoUpdateDateProps.campaign?.startAt),
    );
    expect(endDateInput).toHaveValue(
      dayjs.utc(autoUpdateDateProps.campaign?.endAt).format('DD/MM/YYYY'),
    );

    // Change start date to a date AFTER the current end date
    const testDate = dayjs
      .utc(autoUpdateDateProps.campaign.endAt)
      .add(1, 'month')
      .format('DD/MM/YYYY');
    fireEvent.change(startDateInput, { target: { value: testDate } });
    fireEvent.blur(startDateInput);

    // Verify that end date was automatically updated to match the new start date
    await waitFor(() => {
      expect(endDateInput).toHaveValue(testDate);
    });
  });

  it('should not change end date when start date is updated to a date still before end date', async () => {
    // Create props with start date and end date far apart
    const keepEndDateProps = {
      ...campaignProps[1],
      campaign: {
        id: 'campaignId1',
        name: 'Campaign 1',
        goalAmount: 100,
        startAt: dayjs.utc().add(1, 'year').toDate(),
        endAt: dayjs.utc().add(1, 'year').add(3, 'month').toDate(),
        currencyCode: 'USD',
        createdAt: dayjs.utc().subtract(1, 'year').toISOString(),
      },
    };

    renderCampaignModal(link1, keepEndDateProps);

    // Verify initial dates
    const startDateInput = getStartDateInput();
    const endDateInput = getEndDateInput();
    expect(startDateInput).toHaveValue(
      formatDateForInput(keepEndDateProps.campaign?.startAt),
    );
    expect(endDateInput).toHaveValue(
      dayjs.utc(keepEndDateProps.campaign?.endAt).format('DD/MM/YYYY'),
    );

    // Change start date to a date that is still BEFORE the end date
    const testDate = dayjs.utc().add(1, 'month');
    fireEvent.change(startDateInput, {
      target: { value: testDate.format('DD/MM/YYYY') },
    });

    // Verify that end date was NOT updated and remains the same
    await waitFor(() => {
      expect(startDateInput).toHaveValue(testDate.format('DD/MM/YYYY'));
      expect(endDateInput).toHaveValue(
        dayjs.utc(keepEndDateProps.campaign?.endAt).format('DD/MM/YYYY'),
      ); // End date should remain unchanged
    });
  });

  it('should only update currency code when only currency is changed', async () => {
    // Create a component with edit mode and specific campaign data
    const editProps = {
      ...campaignProps[1],
      campaign: {
        id: 'campaignId1',
        name: 'Campaign Name',
        goalAmount: 100,
        startAt: dayjs.utc().add(1, 'year').toDate(),
        endAt: dayjs.utc().add(2, 'year').toDate(),
        currencyCode: 'USD',
        createdAt: dayjs.utc().subtract(1, 'year').toISOString(),
      },
    };

    renderCampaignModal(currencyOnlyMockLink, editProps);

    // For MUI Select components, we use a simpler approach:
    // Find the Select component
    const currencySelect = screen.getByTestId('currencySelect');

    // Directly trigger the MUI Select onChange handler
    // This simulates selecting 'EUR' from the dropdown
    fireEvent.mouseDown(currencySelect);

    // Rather than trying to find dropdown items, we can simulate the onChange event directly
    const selectInput = currencySelect.querySelector('input');
    if (selectInput) {
      // Dispatch a custom event that the MUI Select will recognize
      fireEvent.change(selectInput, { target: { value: 'EUR' } });
    }

    // Submit the form
    const submitBtn = screen.getByTestId('submitCampaignBtn');
    fireEvent.click(submitBtn);

    // Wait for success message which indicates the mutation was called
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.updatedCampaign,
      );
    });
  });
  it('resets fundingGoal to 0 when input is cleared', async () => {
    renderCampaignModal(link1, campaignProps[1]);

    const goalInput = screen.getByLabelText(translations.fundingGoal);

    fireEvent.change(goalInput, { target: { value: '500' } });
    expect(goalInput).toHaveValue('500');

    fireEvent.change(goalInput, { target: { value: '' } });

    await waitFor(() => {
      expect(goalInput).toHaveValue('0');
    });
  });
  it('does not update fundingGoal when input is non-numeric', async () => {
    renderCampaignModal(link1, campaignProps[1]);

    const goalInput = screen.getByLabelText(translations.fundingGoal);
    expect(goalInput).toHaveValue('100');

    fireEvent.change(goalInput, { target: { value: 'abc' } });

    expect(goalInput).toHaveValue('100');
  });
  it('shows error when campaign name is empty in edit mode', async () => {
    renderCampaignModal(link1, campaignProps[1]);

    fireEvent.change(screen.getByLabelText(translations.campaignName), {
      target: { value: '   ' },
    });

    const start = dayjs.utc().add(1, 'year').format('DD/MM/YYYY');
    const end = dayjs.utc().add(2, 'year').format('DD/MM/YYYY');

    fireEvent.change(getStartDateInput(), { target: { value: start } });
    fireEvent.change(getEndDateInput(), { target: { value: end } });

    fireEvent.click(screen.getByTestId('submitCampaignBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.campaignNameRequired,
      );
    });
  });
  it('shows error when date range is missing in edit mode', async () => {
    renderCampaignModal(link1, campaignProps[1]);

    fireEvent.change(screen.getByLabelText(translations.campaignName), {
      target: { value: 'Valid Name' },
    });

    fireEvent.change(getStartDateInput(), { target: { value: '' } });
    fireEvent.change(getEndDateInput(), { target: { value: '' } });

    fireEvent.click(screen.getByTestId('submitCampaignBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.dateRangeRequired,
      );
    });
  });

  it('shows error when campaign name is empty', async () => {
    renderCampaignModal(link1, campaignProps[0]);

    fireEvent.change(screen.getByLabelText(translations.campaignName), {
      target: { value: '' },
    });

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.campaignNameRequired,
      );
    });
  });

  it('shows error when submitting without date range', async () => {
    renderCampaignModal(link1, campaignProps[0]);

    fireEvent.change(screen.getByLabelText(translations.campaignName), {
      target: { value: 'Valid name' },
    });

    fireEvent.change(getStartDateInput(), { target: { value: '' } });
    fireEvent.change(getEndDateInput(), { target: { value: '' } });

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.dateRangeRequired,
      );
    });
  });

  it('shows error when updating without campaign id', async () => {
    const badProps: InterfaceCampaignModalProps = {
      ...campaignProps[1],
      campaign: null,
    };

    renderCampaignModal(link1, badProps);

    fireEvent.change(screen.getByLabelText(translations.campaignName), {
      target: { value: 'Valid Name' },
    });

    const start = dayjs.utc().add(1, 'year').format('DD/MM/YYYY');
    const end = dayjs.utc().add(2, 'year').format('DD/MM/YYYY');

    fireEvent.change(getStartDateInput(), { target: { value: start } });
    fireEvent.change(getEndDateInput(), { target: { value: end } });

    fireEvent.click(screen.getByTestId('submitCampaignBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.campaignNotFound,
      );
    });
  });

  it('re-enables submit button after update error', async () => {
    renderCampaignModal(link2, campaignProps[1]);

    fireEvent.change(screen.getByLabelText(translations.campaignName), {
      target: { value: 'New Name' },
    });

    const start = dayjs.utc().add(1, 'month').format('DD/MM/YYYY');
    const end = dayjs.utc().add(2, 'month').format('DD/MM/YYYY');

    fireEvent.change(getStartDateInput(), { target: { value: start } });
    fireEvent.change(getEndDateInput(), { target: { value: end } });

    const submitBtn = screen.getByTestId('submitCampaignBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
      expect(submitBtn).not.toBeDisabled();
    });
  });
});

describe('getUpdatedDateIfChanged', () => {
  it('returns undefined when newDate is null', () => {
    expect(getUpdatedDateIfChanged(null, new Date())).toBeUndefined();
  });

  it('returns undefined when dates are same', () => {
    const d = dayjs().toISOString();
    expect(getUpdatedDateIfChanged(d, d)).toBeUndefined();
  });

  it('returns ISO string when dates are different', () => {
    const oldDate = dayjs().toISOString();
    const newDate = dayjs().add(1, 'day').toDate();

    const result = getUpdatedDateIfChanged(newDate, oldDate);
    expect(result).toBeDefined();
    expect(dayjs(result).isValid()).toBe(true);
    expect(dayjs(result).isSame(dayjs(newDate), 'second')).toBe(true);
  });
});
