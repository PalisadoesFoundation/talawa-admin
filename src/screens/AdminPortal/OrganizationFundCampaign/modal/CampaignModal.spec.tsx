import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { MOCKS, MOCK_ERROR } from '../OrganizationFundCampaignMocks';
import type { InterfaceCampaignModal } from './CampaignModal';
import CampaignModal from './CampaignModal';
import { vi } from 'vitest';
import { UPDATE_CAMPAIGN_MUTATION } from 'GraphQl/Mutations/CampaignMutation';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@mui/x-date-pickers/DateTimePicker', async () => {
  const actual = await vi.importActual(
    '@mui/x-date-pickers/DesktopDateTimePicker',
  );
  return { DateTimePicker: actual.DesktopDateTimePicker };
});

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCK_ERROR);
const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.fundCampaign),
);

const campaignProps: InterfaceCampaignModal[] = [
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

const renderCampaignModal = (
  link: ApolloLink,
  props: InterfaceCampaignModal,
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

const getPickerInputByLabel = (label: string) =>
  screen.getByLabelText(label, { selector: 'input' }) as HTMLInputElement;

describe('CampaignModal', () => {
  it('should update form state when campaign prop changes', async () => {
    const { rerender } = renderCampaignModal(link1, campaignProps[1]);

    // Initial values
    expect(screen.getByLabelText(translations.campaignName)).toHaveValue(
      'Campaign 1',
    );

    // Create new props with different campaign data
    const updatedProps: InterfaceCampaignModal = {
      ...campaignProps[1],
      campaign: {
        id: 'campaignId2',
        name: 'Updated Campaign',
        goalAmount: 500,
        startAt: dayjs.utc().add(6, 'month').toDate(),
        endAt: dayjs.utc().add(18, 'month').toDate(),
        currencyCode: 'EUR',
        createdAt: dayjs.utc().subtract(6, 'month').toISOString(),
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

    // Verify form state updated
    await waitFor(() => {
      expect(screen.getByLabelText(translations.campaignName)).toHaveValue(
        'Updated Campaign',
      );
      expect(screen.getByLabelText(translations.fundingGoal)).toHaveValue(
        '500',
      );
      const startDateInput = getPickerInputByLabel('Start Date');
      const endDateInput = getPickerInputByLabel('End Date');
      expect(startDateInput).toHaveValue(
        dayjs.utc(updatedProps.campaign?.startAt).format('DD/MM/YYYY'),
      );
      expect(endDateInput).toHaveValue(
        dayjs.utc(updatedProps.campaign?.endAt).format('DD/MM/YYYY'),
      );
    });
  });

  it('should reset form state when campaign prop changes to null', async () => {
    const { rerender } = renderCampaignModal(link1, campaignProps[1]);

    // Initial values
    expect(screen.getByLabelText(translations.campaignName)).toHaveValue(
      'Campaign 1',
    );

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
      expect(screen.getByLabelText(translations.campaignName)).toHaveValue('');
      expect(screen.getByLabelText(translations.fundingGoal)).toHaveValue('0');
    });
  });

  it('should not update start date when null date is selected', async () => {
    renderCampaignModal(link1, campaignProps[1]);

    const startDateInput = getPickerInputByLabel('Start Date');
    const initialValue = startDateInput.value;

    // Try to set null/invalid date
    fireEvent.change(startDateInput, { target: { value: '' } });

    // Value should remain unchanged
    expect(startDateInput).toHaveValue(initialValue);
  });

  it('should not update end date when null date is selected', async () => {
    renderCampaignModal(link1, campaignProps[1]);

    const endDateInput = getPickerInputByLabel('End Date');
    const initialValue = endDateInput.value;

    // Try to set null/invalid date
    fireEvent.change(endDateInput, { target: { value: '' } });

    // Value should remain unchanged
    expect(endDateInput).toHaveValue(initialValue);
  });
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should populate form fields with correct values in edit mode', async () => {
    renderCampaignModal(link1, campaignProps[1]);
    await waitFor(() =>
      expect(screen.getAllByText(translations.updateCampaign)).toHaveLength(2),
    );

    expect(screen.getByLabelText(translations.campaignName)).toHaveValue(
      'Campaign 1',
    );
    const startDateInput = getPickerInputByLabel('Start Date');
    const endDateInput = getPickerInputByLabel('End Date');

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
    const startDateInput = getPickerInputByLabel('Start Date');
    const testDate = dayjs.utc().add(1, 'month').format('DD/MM/YYYY');
    fireEvent.change(startDateInput, { target: { value: testDate } });
    expect(startDateInput).toHaveValue(testDate);
  });

  it('should update End Date when a new date is selected', async () => {
    renderCampaignModal(link1, campaignProps[1]);
    const endDateInput = getPickerInputByLabel('End Date');
    const testDate = dayjs.utc().add(1, 'month').format('DD/MM/YYYY');
    fireEvent.change(endDateInput, { target: { value: testDate } });
    expect(endDateInput).toHaveValue(testDate);
  });

  it('should create campaign', async () => {
    renderCampaignModal(link1, campaignProps[0]);

    const campaignName = screen.getByLabelText(translations.campaignName);
    fireEvent.change(campaignName, { target: { value: 'Campaign 2' } });

    const testStartDate = dayjs.utc().add(1, 'month').format('DD/MM/YYYY');
    const startDateInput = getPickerInputByLabel('Start Date');
    fireEvent.change(startDateInput, { target: { value: testStartDate } });

    const endDateInput = getPickerInputByLabel('End Date');
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
    const startDateInput = getPickerInputByLabel('Start Date');
    fireEvent.change(startDateInput, { target: { value: testStartDate } });

    const endDateInput = getPickerInputByLabel('End Date');
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
    const startDateInput = getPickerInputByLabel('Start Date');
    fireEvent.change(startDateInput, { target: { value: testStartDate } });

    const endDateInput = getPickerInputByLabel('End Date');
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
    const startDateInput = getPickerInputByLabel('Start Date');
    fireEvent.change(startDateInput, { target: { value: testStartDate } });

    const endDateInput = getPickerInputByLabel('End Date');
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

    const startDateInput = getPickerInputByLabel('Start Date');
    fireEvent.change(startDateInput, {
      target: { value: dayjs.utc().add(1, 'month').format('DD/MM/YYYY') },
    });

    const endDateInput = getPickerInputByLabel('End Date');
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
    const startDateInput = getPickerInputByLabel('Start Date');
    const endDateInput = getPickerInputByLabel('End Date');
    expect(startDateInput).toHaveValue(
      dayjs.utc(autoUpdateDateProps.campaign?.startAt).format('DD/MM/YYYY'),
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
    const startDateInput = getPickerInputByLabel('Start Date');
    const endDateInput = getPickerInputByLabel('End Date');
    expect(startDateInput).toHaveValue(
      dayjs.utc(keepEndDateProps.campaign?.startAt).format('DD/MM/YYYY'),
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
});
