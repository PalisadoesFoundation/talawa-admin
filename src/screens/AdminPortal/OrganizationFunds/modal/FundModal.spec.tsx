import React from 'react';
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
import { MOCKS, MOCKS_ERROR } from '../OrganizationFundsMocks';
import type { InterfaceFundModal } from './FundModal';
import FundModal from './FundModal';
import { vi } from 'vitest';
import dayjs from 'dayjs';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_ERROR);
const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.funds),
);

const fundProps: InterfaceFundModal[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    fund: {
      id: 'fundId',
      name: 'Fund 1',
      refrenceNumber: '1111',
      isTaxDeductible: true,
      isArchived: false,
      isDefault: false,
      createdAt: dayjs().month(5).date(22).format('YYYY-MM-DD'),
      organizationId: 'orgId',
      creator: {
        name: 'John Doe',
      },
      organization: {
        name: 'Organization 1',
      },
      updater: {
        name: 'John Doe',
      },
      edges: {
        node: {
          id: 'nodeId',
          name: 'Node Name',
          fundingGoal: 1000,
          startDate: dayjs().format('YYYY-MM-DD'),
          endDate: dayjs().endOf('year').format('YYYY-MM-DD'),
          currency: 'USD',
          createdAt: dayjs().month(5).date(22).format('YYYY-MM-DD'),
        },
      },
    },
    refetchFunds: vi.fn(),
    orgId: 'orgId',
    mode: 'create',
  },
  {
    isOpen: true,
    hide: vi.fn(),
    fund: {
      id: 'fundId',
      name: 'Fund 1',
      refrenceNumber: '1111',
      isTaxDeductible: true,
      isArchived: false,
      isDefault: false,
      createdAt: dayjs().month(5).date(22).format('YYYY-MM-DD'),
      organizationId: 'orgId',
      creator: {
        name: 'John Doe',
      },
      organization: {
        name: 'Organization 1',
      },
      updater: {
        name: 'John Doe',
      },
      edges: {
        node: {
          id: 'nodeId',
          name: 'Node Name',
          fundingGoal: 1000,
          startDate: dayjs().format('YYYY-MM-DD'),
          endDate: dayjs().endOf('year').format('YYYY-MM-DD'),
          currency: 'USD',
          createdAt: dayjs().month(5).date(22).format('YYYY-MM-DD'),
        },
      },
    },
    refetchFunds: vi.fn(),
    orgId: 'orgId',
    mode: 'edit',
  },
];

const renderFundModal = (
  link: ApolloLink,
  props: InterfaceFundModal,
): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <FundModal {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('PledgeModal', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should populate form fields with correct values in edit mode', async () => {
    renderFundModal(link1, fundProps[1]);
    await waitFor(() =>
      expect(
        screen.getAllByText(translations.fundUpdate)[0],
      ).toBeInTheDocument(),
    );
    expect(screen.getByLabelText(translations.fundName)).toHaveValue('Fund 1');
    expect(screen.getByLabelText(translations.fundId)).toHaveValue('1111');
    expect(screen.getByTestId('setisTaxDeductibleSwitch')).toBeChecked();
    expect(screen.getByTestId('setDefaultSwitch')).not.toBeChecked();
    expect(screen.getByTestId('archivedSwitch')).not.toBeChecked();
  });

  it('should update Fund Name when input value changes', async () => {
    renderFundModal(link1, fundProps[1]);
    const fundNameInput = screen.getByLabelText(translations.fundName);
    expect(fundNameInput).toHaveValue('Fund 1');
    fireEvent.change(fundNameInput, { target: { value: 'Fund 2' } });
    expect(fundNameInput).toHaveValue('Fund 2');
  });

  it('should update Fund Reference ID when input value changes', async () => {
    renderFundModal(link1, fundProps[1]);
    const fundIdInput = screen.getByLabelText(translations.fundId);
    expect(fundIdInput).toHaveValue('1111');
    fireEvent.change(fundIdInput, { target: { value: '2222' } });
    expect(fundIdInput).toHaveValue('2222');
  });

  it('should show required error when Fund Name is empty and touched', async () => {
    // Start with a fund that has a name (edit mode)
    renderFundModal(link1, fundProps[1]);
    const fundNameInput = screen.getByLabelText(translations.fundName);

    // Clear the input
    fireEvent.change(fundNameInput, { target: { value: '' } });
    // Blur to trigger validation
    fireEvent.blur(fundNameInput);

    // Expect error message to be visible
    // The tCommon('required') usually resolves to "Required" or similar.
    // We can assume it's "Required" based on common translation files, or match generically
    // If we want to be safe we can use a regex or check if the implementation uses specific keys
    // In many setups, tCommon('required') -> "Required"
    // Since we mocked translations for 'funds' but tCommon comes from 'common',
    // and we mocked i18nForTest, let's verify if we can access the common translations or just match text.
    // The previous tests used JSON.parse(...) for funds translations.
    // Let's assume standard "Required" text from i18nForTest for common.
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('should show required error when Fund Reference ID is empty and touched', async () => {
    renderFundModal(link1, fundProps[1]);
    const fundIdInput = screen.getByLabelText(translations.fundId);

    fireEvent.change(fundIdInput, { target: { value: '' } });
    fireEvent.blur(fundIdInput);

    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('should update Tax Deductible Switch when input value changes', async () => {
    renderFundModal(link1, fundProps[1]);
    const taxDeductibleSwitch = screen.getByTestId('setisTaxDeductibleSwitch');
    expect(taxDeductibleSwitch).toBeChecked();
    fireEvent.click(taxDeductibleSwitch);
    expect(taxDeductibleSwitch).not.toBeChecked();
  });

  it('should update Tax Default switch when input value changes', async () => {
    renderFundModal(link1, fundProps[1]);
    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    expect(defaultSwitch).not.toBeChecked();
    fireEvent.click(defaultSwitch);
    expect(defaultSwitch).toBeChecked();
  });

  it('should update Tax isArchived switch when input value changes', async () => {
    renderFundModal(link1, fundProps[1]);
    const archivedSwitch = screen.getByTestId('archivedSwitch');
    expect(archivedSwitch).not.toBeChecked();
    fireEvent.click(archivedSwitch);
    expect(archivedSwitch).toBeChecked();
  });

  it('should create fund', async () => {
    renderFundModal(link1, fundProps[0]);

    const fundNameInput = screen.getByLabelText(translations.fundName);
    fireEvent.change(fundNameInput, { target: { value: 'Fund 2' } });

    const fundIdInput = screen.getByLabelText(translations.fundId);
    fireEvent.change(fundIdInput, { target: { value: '2222' } });

    const taxDeductibleSwitch = screen.getByTestId('setisTaxDeductibleSwitch');
    fireEvent.click(taxDeductibleSwitch);

    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    fireEvent.click(defaultSwitch);

    fireEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.fundCreated,
      );
      expect(fundProps[0].refetchFunds).toHaveBeenCalled();
      expect(fundProps[0].hide).toHaveBeenCalled();
    });
  });

  it('should not update the fund when no fields are changed', async () => {
    renderFundModal(link1, fundProps[1]);

    // Simulate no change to the fields
    const fundNameInput = screen.getByLabelText(translations.fundName);
    fireEvent.change(fundNameInput, { target: { value: 'Fund 1' } });

    const fundIdInput = screen.getByLabelText(translations.fundId);
    fireEvent.change(fundIdInput, { target: { value: '1111' } });

    const taxDeductibleSwitch = screen.getByTestId('setisTaxDeductibleSwitch');
    fireEvent.click(taxDeductibleSwitch);
    fireEvent.click(taxDeductibleSwitch);

    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    fireEvent.click(defaultSwitch);
    fireEvent.click(defaultSwitch);

    const archivedSwitch = screen.getByTestId('archivedSwitch');
    fireEvent.click(archivedSwitch);
    fireEvent.click(archivedSwitch);

    fireEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).not.toHaveBeenCalled();
      expect(fundProps[1].refetchFunds).not.toHaveBeenCalled();
      expect(fundProps[1].hide).not.toHaveBeenCalled();
    });
  });

  it('should update fund', async () => {
    renderFundModal(link1, fundProps[1]);

    const fundNameInput = screen.getByLabelText(translations.fundName);
    fireEvent.change(fundNameInput, { target: { value: 'Fund 2' } });

    const taxDeductibleSwitch = screen.getByTestId('setisTaxDeductibleSwitch');
    fireEvent.click(taxDeductibleSwitch); // This will make isTaxDeductible false

    fireEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.fundUpdated,
      );
      expect(fundProps[1].refetchFunds).toHaveBeenCalled();
      expect(fundProps[1].hide).toHaveBeenCalled();
    });
  });

  it('Error: should create fund', async () => {
    renderFundModal(link2, fundProps[0]);

    const fundNameInput = screen.getByLabelText(translations.fundName);
    fireEvent.change(fundNameInput, { target: { value: 'Fund 2' } });

    const fundIdInput = screen.getByLabelText(translations.fundId);
    fireEvent.change(fundIdInput, { target: { value: '2222' } });

    const taxDeductibleSwitch = screen.getByTestId('setisTaxDeductibleSwitch');
    fireEvent.click(taxDeductibleSwitch);

    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    fireEvent.click(defaultSwitch);

    fireEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Mock graphql error',
      );
    });
  });

  it('Error: should update fund', async () => {
    renderFundModal(link2, fundProps[1]);

    const fundNameInput = screen.getByLabelText(translations.fundName);
    fireEvent.change(fundNameInput, { target: { value: 'Fund 2' } });

    const fundIdInput = screen.getByLabelText(translations.fundId);
    fireEvent.change(fundIdInput, { target: { value: '2222' } });

    const taxDeductibleSwitch = screen.getByTestId('setisTaxDeductibleSwitch');
    fireEvent.click(taxDeductibleSwitch);

    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    fireEvent.click(defaultSwitch);

    const archivedSwitch = screen.getByTestId('archivedSwitch');
    fireEvent.click(archivedSwitch);

    fireEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Mock graphql error',
      );
    });
  });

  it('should update form state when fund prop changes', async () => {
    const { rerender } = renderFundModal(link1, fundProps[1]);

    // Initial values
    expect(screen.getByLabelText(translations.fundName)).toHaveValue('Fund 1');

    // Create new props with different fund data
    const updatedProps: InterfaceFundModal = {
      ...fundProps[1],
      fund: {
        id: 'fundId',
        name: 'Updated Fund',
        refrenceNumber: '9999',
        isTaxDeductible: false,
        isDefault: true,
        isArchived: true,
        createdAt: dayjs().month(5).date(22).format('YYYY-MM-DD'),
        organizationId: 'orgId',
        creator: {
          name: 'John Doe',
        },
        organization: {
          name: 'Organization 1',
        },
        updater: {
          name: 'John Doe',
        },
        edges: {
          node: {
            id: 'nodeId',
            name: 'Node Name',
            fundingGoal: 1000,
            startDate: dayjs().format('YYYY-MM-DD'),
            endDate: dayjs().endOf('year').format('YYYY-MM-DD'),
            currency: 'USD',
            createdAt: dayjs().month(5).date(22).format('YYYY-MM-DD'),
          },
        },
      },
    };

    // Re-render with new fund prop
    rerender(
      <MockedProvider link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <FundModal {...updatedProps} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    // Verify form state updated
    await waitFor(() => {
      expect(screen.getByLabelText(translations.fundName)).toHaveValue(
        'Updated Fund',
      );
      expect(screen.getByLabelText(translations.fundId)).toHaveValue('9999');
      expect(screen.getByTestId('setisTaxDeductibleSwitch')).not.toBeChecked();
      expect(screen.getByTestId('setDefaultSwitch')).toBeChecked();
      expect(screen.getByTestId('archivedSwitch')).toBeChecked();
    });
  });

  it('should reset form state when fund prop changes to null', async () => {
    const { rerender } = renderFundModal(link1, fundProps[1]);

    // Initial values
    expect(screen.getByLabelText(translations.fundName)).toHaveValue('Fund 1');

    // Create props with null fund
    const updatedProps: InterfaceFundModal = {
      ...fundProps[1],
      fund: null,
    };

    // Re-render with null fund
    rerender(
      <MockedProvider link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <FundModal {...updatedProps} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    // Verify form state is reset
    await waitFor(() => {
      expect(screen.getByLabelText(translations.fundName)).toHaveValue('');
      expect(screen.getByLabelText(translations.fundId)).toHaveValue('');
    });
  });
});
