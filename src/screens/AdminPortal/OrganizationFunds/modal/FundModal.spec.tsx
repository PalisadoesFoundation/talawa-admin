import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { MOCKS, MOCKS_ERROR } from '../OrganizationFundsMocks';
import type { InterfaceFundModal } from './FundModal';
import FundModal from './FundModal';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import * as apollo from '@apollo/client';

dayjs.extend(utc);

const MOCK_CREATED_AT = dayjs
  .utc()
  .year(2025)
  .month(5)
  .date(22)
  .hour(0)
  .minute(0)
  .second(0)
  .millisecond(0)
  .format('YYYY-MM-DD');
const MOCK_START_DATE = dayjs
  .utc()
  .year(2025)
  .month(0)
  .date(1)
  .hour(0)
  .minute(0)
  .second(0)
  .millisecond(0)
  .format('YYYY-MM-DD');
const MOCK_END_DATE = dayjs
  .utc()
  .year(2025)
  .month(11)
  .date(31)
  .hour(0)
  .minute(0)
  .second(0)
  .millisecond(0)
  .format('YYYY-MM-DD');

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
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
    fund: null,
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
      createdAt: MOCK_CREATED_AT,
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
          startDate: MOCK_START_DATE,
          endDate: MOCK_END_DATE,
          currency: 'USD',
          createdAt: MOCK_CREATED_AT,
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

const mutationReturn = [
  vi.fn().mockResolvedValue({ data: {} }),
  {
    loading: false,
    called: false,
    reset: vi.fn(),
    client: {} as never,
  },
] satisfies ReturnType<typeof apollo.useMutation>;

describe('PledgeModal', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should populate form fields with correct values in edit mode', async () => {
    renderFundModal(link1, fundProps[1]);
    await waitFor(() =>
      expect(
        screen.getAllByText(translations.fundUpdate)[0],
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByLabelText(translations.fundName, { exact: false }),
    ).toHaveValue('Fund 1');
    expect(
      screen.getByLabelText(translations.fundId, { exact: false }),
    ).toHaveValue('1111');
    expect(screen.getByTestId('setisTaxDeductibleSwitch')).toBeChecked();
    expect(screen.getByTestId('setDefaultSwitch')).not.toBeChecked();
    expect(screen.getByTestId('archivedSwitch')).not.toBeChecked();
  });

  it('should update Fund Name when input value changes', async () => {
    const user = userEvent.setup({ delay: null });
    renderFundModal(link1, fundProps[1]);
    const fundNameInput = screen.getByLabelText(translations.fundName, {
      exact: false,
    });
    expect(fundNameInput).toHaveValue('Fund 1');
    await user.clear(fundNameInput);
    await user.type(fundNameInput, 'Fund 2');
    await waitFor(() => expect(fundNameInput).toHaveValue('Fund 2'));
  });

  it('should update Fund Reference ID when input value changes', async () => {
    const user = userEvent.setup({ delay: null });
    renderFundModal(link1, fundProps[1]);
    const fundIdInput = screen.getByLabelText(translations.fundId, {
      exact: false,
    });
    expect(fundIdInput).toHaveValue('1111');
    await user.clear(fundIdInput);
    await user.type(fundIdInput, '2222');
    await waitFor(() => expect(fundIdInput).toHaveValue('2222'));
  });

  it('should show required error when Fund Name is empty and touched', async () => {
    const user = userEvent.setup({ delay: null });
    // Start with a fund that has a name (edit mode)
    renderFundModal(link1, fundProps[1]);

    const fundNameInput = await screen.findByLabelText(/fund name/i);

    // Clear the input (this already makes it empty)
    await user.clear(fundNameInput);

    // Trigger blur to mark as touched
    await user.tab();

    await waitFor(() =>
      expect(screen.getByText('Required')).toBeInTheDocument(),
    );
  });

  it('should show required error when Fund Reference ID is empty and touched', async () => {
    const user = userEvent.setup({ delay: null });
    renderFundModal(link1, fundProps[1]);

    const fundIdInput = await screen.findByLabelText(/fund \(reference\) id/i);

    // Clear the input (now it's empty)
    await user.clear(fundIdInput);

    await user.tab();

    await waitFor(() =>
      expect(screen.getByText('Required')).toBeInTheDocument(),
    );
  });

  it('should update Tax Deductible Switch when input value changes', async () => {
    const user = userEvent.setup({ delay: null });
    renderFundModal(link1, fundProps[1]);
    const taxDeductibleSwitch = screen.getByTestId('setisTaxDeductibleSwitch');
    expect(taxDeductibleSwitch).toBeChecked();
    await user.click(taxDeductibleSwitch);
    await waitFor(() => expect(taxDeductibleSwitch).not.toBeChecked());
  });

  it('should update Tax Default switch when input value changes', async () => {
    const user = userEvent.setup({ delay: null });
    renderFundModal(link1, fundProps[1]);
    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    expect(defaultSwitch).not.toBeChecked();
    await user.click(defaultSwitch);
    await waitFor(() => expect(defaultSwitch).toBeChecked());
  });

  it('should update Tax isArchived switch when input value changes', async () => {
    const user = userEvent.setup({ delay: null });
    renderFundModal(link1, fundProps[1]);
    const archivedSwitch = screen.getByTestId('archivedSwitch');
    expect(archivedSwitch).not.toBeChecked();
    await user.click(archivedSwitch);
    await waitFor(() => expect(archivedSwitch).toBeChecked());
  });

  it('should not update the fund when no fields are changed', async () => {
    const user = userEvent.setup({ delay: null });
    renderFundModal(link1, fundProps[1]);

    // Simulate no change to the fields
    const fundNameInput = screen.getByLabelText(translations.fundName, {
      exact: false,
    });
    await user.clear(fundNameInput);
    await user.type(fundNameInput, 'Fund 1');

    const fundIdInput = screen.getByLabelText(translations.fundId, {
      exact: false,
    });
    await user.clear(fundIdInput);
    await user.type(fundIdInput, '1111');

    const taxDeductibleSwitch = screen.getByTestId('setisTaxDeductibleSwitch');
    await user.click(taxDeductibleSwitch);
    await user.click(taxDeductibleSwitch);

    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    await user.click(defaultSwitch);
    await user.click(defaultSwitch);

    const archivedSwitch = screen.getByTestId('archivedSwitch');
    await user.click(archivedSwitch);
    await user.click(archivedSwitch);

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.success).not.toHaveBeenCalled();
      expect(fundProps[1].refetchFunds).not.toHaveBeenCalled();
      expect(fundProps[1].hide).not.toHaveBeenCalled();
    });
  });

  it('should create fund', async () => {
    const user = userEvent.setup({ delay: null });
    renderFundModal(link2, fundProps[0]);

    const fundNameInput = screen.getByLabelText(translations.fundName, {
      exact: false,
    });
    await user.clear(fundNameInput);
    await user.type(fundNameInput, 'Fund 2');

    const fundIdInput = screen.getByLabelText(translations.fundId, {
      exact: false,
    });
    await user.clear(fundIdInput);
    await user.type(fundIdInput, '2222');

    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    await user.click(defaultSwitch);

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Mock graphql error',
      );
    });
  });

  it('should update fund', async () => {
    const user = userEvent.setup({ delay: null });
    renderFundModal(link2, fundProps[1]);

    const fundNameInput = screen.getByLabelText(translations.fundName, {
      exact: false,
    });
    await user.clear(fundNameInput);
    await user.type(fundNameInput, 'Fund 2');

    const fundIdInput = screen.getByLabelText(translations.fundId, {
      exact: false,
    });
    await user.clear(fundIdInput);
    await user.type(fundIdInput, '2222');

    const taxDeductibleSwitch = screen.getByTestId('setisTaxDeductibleSwitch');
    await user.click(taxDeductibleSwitch);

    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    await user.click(defaultSwitch);

    const archivedSwitch = screen.getByTestId('archivedSwitch');
    await user.click(archivedSwitch);

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Mock graphql error',
      );
    });
  });

  it('should update form state when fund prop changes', async () => {
    const { rerender } = renderFundModal(link1, fundProps[1]);

    // Initial values
    expect(
      screen.getByLabelText(translations.fundName, { exact: false }),
    ).toHaveValue('Fund 1');

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
        createdAt: MOCK_CREATED_AT,
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
            startDate: MOCK_START_DATE,
            endDate: MOCK_END_DATE,
            currency: 'USD',
            createdAt: MOCK_CREATED_AT,
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
      expect(
        screen.getByLabelText(translations.fundName, { exact: false }),
      ).toHaveValue('Updated Fund');
      expect(
        screen.getByLabelText(translations.fundId, { exact: false }),
      ).toHaveValue('9999');
      expect(screen.getByTestId('setisTaxDeductibleSwitch')).not.toBeChecked();
      expect(screen.getByTestId('setDefaultSwitch')).toBeChecked();
      expect(screen.getByTestId('archivedSwitch')).toBeChecked();
    });
  });

  it('should reset form state when fund prop changes to null', async () => {
    const { rerender } = renderFundModal(link1, fundProps[1]);

    // Initial values
    expect(
      screen.getByLabelText(translations.fundName, { exact: false }),
    ).toHaveValue('Fund 1');

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
      expect(
        screen.getByLabelText(translations.fundName, { exact: false }),
      ).toHaveValue('');
      expect(
        screen.getByLabelText(translations.fundId, { exact: false }),
      ).toHaveValue('');
    });
  });

  it('should reset touched state when modal reopens', async () => {
    const user = userEvent.setup({ delay: null });
    const { rerender } = renderFundModal(link1, {
      ...fundProps[1],
      isOpen: true,
    });

    // Wait for modal field to be available
    const fundNameInput = await screen.findByLabelText(/fund name/i);

    await user.clear(fundNameInput);
    await user.tab();

    await waitFor(() =>
      expect(screen.getByText('Required')).toBeInTheDocument(),
    );

    // Close modal
    rerender(
      <MockedProvider link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <FundModal {...fundProps[1]} isOpen={false} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    // Reopen modal
    rerender(
      <MockedProvider link={link1}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <FundModal {...fundProps[1]} isOpen={true} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    // Wait for modal to re-render
    await screen.findByLabelText(/fund name/i);

    // Error should be gone because touched state is reset
    await waitFor(() =>
      expect(screen.queryByText('Required')).not.toBeInTheDocument(),
    );
  });

  it('should create fund successfully and call side effects', async () => {
    const user = userEvent.setup({ delay: null });
    vi.spyOn(apollo, 'useMutation').mockReturnValue(mutationReturn);

    const hide = vi.fn();
    const refetchFunds = vi.fn();

    renderFundModal(link1, {
      ...fundProps[0],
      hide,
      refetchFunds,
      mode: 'create',
    });

    const fundNameInput = screen.getByLabelText(translations.fundName, {
      exact: false,
    });
    await user.clear(fundNameInput);
    await user.type(fundNameInput, 'New Fund');

    const fundIdInput = screen.getByLabelText(translations.fundId, {
      exact: false,
    });
    await user.clear(fundIdInput);
    await user.type(fundIdInput, '1234');

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
      expect(refetchFunds).toHaveBeenCalled();
      expect(hide).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText(translations.fundName, { exact: false }),
      ).toHaveValue('');
      expect(
        screen.getByLabelText(translations.fundId, { exact: false }),
      ).toHaveValue('');
    });
  });

  it('should update fund successfully and call side effects', async () => {
    const user = userEvent.setup({ delay: null });
    vi.spyOn(apollo, 'useMutation').mockReturnValue(mutationReturn);

    const hide = vi.fn();
    const refetchFunds = vi.fn();

    renderFundModal(link1, {
      ...fundProps[1],
      hide,
      refetchFunds,
      mode: 'edit',
    });

    const fundNameInput = screen.getByLabelText(translations.fundName, {
      exact: false,
    });
    await user.clear(fundNameInput);
    await user.type(fundNameInput, 'Updated Fund');

    await user.click(screen.getByTestId('modal-submit-btn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
      expect(refetchFunds).toHaveBeenCalled();
      expect(hide).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText(translations.fundName, { exact: false }),
      ).toHaveValue('');
    });
  });
});
