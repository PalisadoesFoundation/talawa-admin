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
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { MOCKS, MOCKS_ERROR } from '../OrganizationFundsMocks';
import type { InterfaceFundModal } from './FundModal';
import FundModal from './FundModal';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import * as apollo from '@apollo/client';

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

const mutationReturn = [
  vi.fn().mockResolvedValue({ data: {} }),
  {
    loading: false,
    called: false,
    reset: vi.fn(),
    client: {} as never,
  },
] satisfies ReturnType<typeof apollo.useMutation>;

describe('FundModal', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should populate form fields with correct values in edit mode', async () => {
    renderFundModal(link1, fundProps[1]);
    await waitFor(() =>
      expect(screen.getByTestId('modalTitle')).toHaveTextContent(
        translations.manageFunds,
      ),
    );
    expect(
      screen.getByLabelText(translations.fundName, { exact: false }),
    ).toHaveValue('Fund 1');
    expect(
      screen.getByLabelText(translations.fundId, { exact: false }),
    ).toHaveValue('1111');
    expect(screen.getByTestId('setisTaxDeductibleSwitch')).toBeChecked();
    expect(screen.getByTestId('setDefaultSwitch')).not.toBeChecked();
    expect(screen.getByTestId('archiveFundBtn')).toBeInTheDocument();
  });

  it('should update Fund Name when input value changes', async () => {
    renderFundModal(link1, fundProps[1]);
    const fundNameInput = screen.getByLabelText(translations.fundName, {
      exact: false,
    });
    expect(fundNameInput).toHaveValue('Fund 1');
    await userEvent.clear(fundNameInput);
    await userEvent.type(fundNameInput, 'Fund 2');
    expect(fundNameInput).toHaveValue('Fund 2');
  });

  it('should update Fund Reference ID when input value changes', async () => {
    renderFundModal(link1, fundProps[1]);
    const fundIdInput = screen.getByLabelText(translations.fundId, {
      exact: false,
    });
    expect(fundIdInput).toHaveValue('1111');
    await userEvent.clear(fundIdInput);
    await userEvent.type(fundIdInput, '2222');
    expect(fundIdInput).toHaveValue('2222');
  });

  it('should show required error when Fund Name is empty and touched', async () => {
    // Start with a fund that has a name (edit mode)
    renderFundModal(link1, fundProps[1]);

    const fundNameInput = await screen.findByLabelText(/fund name/i);

    // Clear the input (this already makes it empty)
    await userEvent.clear(fundNameInput);

    // Trigger blur to mark as touched
    await userEvent.tab();

    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('should show required error when Fund Reference ID is empty and touched', async () => {
    renderFundModal(link1, fundProps[1]);

    const fundIdInput = await screen.findByLabelText(/fund id/i);

    // Clear the input (now it's empty)
    await userEvent.clear(fundIdInput);

    await userEvent.tab();

    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('should update Tax Deductible Switch when input value changes', async () => {
    renderFundModal(link1, fundProps[1]);
    const taxDeductibleSwitch = screen.getByTestId('setisTaxDeductibleSwitch');
    expect(taxDeductibleSwitch).toBeChecked();
    await userEvent.click(taxDeductibleSwitch);
    expect(taxDeductibleSwitch).not.toBeChecked();
  });

  it('should update Tax Default switch when input value changes', async () => {
    renderFundModal(link1, fundProps[1]);
    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    expect(defaultSwitch).not.toBeChecked();
    await userEvent.click(defaultSwitch);
    expect(defaultSwitch).toBeChecked();
  });

  it('should toggle isArchived when Archive button is clicked', async () => {
    const props = {
      ...fundProps[1],
      hide: vi.fn(),
      refetchFunds: vi.fn(),
    };
    renderFundModal(link1, props);
    const archiveBtn = screen.getByTestId('archiveFundBtn');
    expect(archiveBtn).toBeInTheDocument();
    // Click the archive button to archive the fund
    await userEvent.click(archiveBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.fundArchived,
      );
    });

    expect(props.hide).toHaveBeenCalled();
    expect(props.refetchFunds).toHaveBeenCalled();
  });

  it('should unarchive fund when Unarchive button is clicked on archived fund', async () => {
    const baseFund = fundProps[1].fund;
    const props = {
      ...fundProps[1],
      fund: baseFund
        ? {
            ...baseFund,
            isArchived: true,
          }
        : null,
      hide: vi.fn(),
      refetchFunds: vi.fn(),
    };
    renderFundModal(link1, props);
    const unarchiveBtn = screen.getByTestId('archiveFundBtn');
    expect(unarchiveBtn).toBeInTheDocument();
    expect(unarchiveBtn).toHaveTextContent(translations.unarchive);
    // Click the button to unarchive the fund
    await userEvent.click(unarchiveBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.fundUnarchived,
      );
    });

    expect(props.hide).toHaveBeenCalled();
    expect(props.refetchFunds).toHaveBeenCalled();
  });

  it('should not update the fund when no fields are changed', async () => {
    renderFundModal(link1, fundProps[1]);

    // Simulate no change to the fields
    const fundNameInput = screen.getByLabelText(translations.fundName, {
      exact: false,
    });
    await userEvent.clear(fundNameInput);
    await userEvent.type(fundNameInput, 'Fund 1');

    const fundIdInput = screen.getByLabelText(translations.fundId, {
      exact: false,
    });
    await userEvent.clear(fundIdInput);
    await userEvent.type(fundIdInput, '1111');

    const taxDeductibleSwitch = screen.getByTestId('setisTaxDeductibleSwitch');
    await userEvent.click(taxDeductibleSwitch);
    await userEvent.click(taxDeductibleSwitch);

    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    await userEvent.click(defaultSwitch);
    await userEvent.click(defaultSwitch);

    // Note: Archive button is not toggled here since it triggers a mutation directly

    await userEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).not.toHaveBeenCalled();
      expect(fundProps[1].refetchFunds).not.toHaveBeenCalled();
      expect(fundProps[1].hide).not.toHaveBeenCalled();
    });
  });

  it('should create fund', async () => {
    renderFundModal(link2, fundProps[0]);

    const fundNameInput = screen.getByLabelText(translations.fundName, {
      exact: false,
    });
    await userEvent.clear(fundNameInput);
    await userEvent.type(fundNameInput, 'Fund 2');

    const fundIdInput = screen.getByLabelText(translations.fundId, {
      exact: false,
    });
    await userEvent.clear(fundIdInput);
    await userEvent.type(fundIdInput, '2222');

    const taxDeductibleSwitch = screen.getByTestId('setisTaxDeductibleSwitch');
    await userEvent.click(taxDeductibleSwitch);

    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    await userEvent.click(defaultSwitch);

    await userEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Mock graphql error',
      );
    });
  });

  it('should update fund', async () => {
    renderFundModal(link2, fundProps[1]);

    const fundNameInput = screen.getByLabelText(translations.fundName, {
      exact: false,
    });
    await userEvent.clear(fundNameInput);
    await userEvent.type(fundNameInput, 'Fund 2');

    const fundIdInput = screen.getByLabelText(translations.fundId, {
      exact: false,
    });
    await userEvent.clear(fundIdInput);
    await userEvent.type(fundIdInput, '2222');

    const taxDeductibleSwitch = screen.getByTestId('setisTaxDeductibleSwitch');
    await userEvent.click(taxDeductibleSwitch);

    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    await userEvent.click(defaultSwitch);

    const archiveBtn = screen.getByTestId('archiveFundBtn');
    await userEvent.click(archiveBtn);

    await userEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

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
      expect(
        screen.getByLabelText(translations.fundName, { exact: false }),
      ).toHaveValue('Updated Fund');
      expect(
        screen.getByLabelText(translations.fundId, { exact: false }),
      ).toHaveValue('9999');
      expect(screen.getByTestId('setisTaxDeductibleSwitch')).not.toBeChecked();
      expect(screen.getByTestId('setDefaultSwitch')).toBeChecked();
      // Archive button is present - the isArchived state is internal and toggled by clicking the button
      expect(screen.getByTestId('archiveFundBtn')).toBeInTheDocument();
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
    const { rerender } = renderFundModal(link1, {
      ...fundProps[1],
      isOpen: true,
    });

    // Wait for modal field to be available
    const fundNameInput = await screen.findByLabelText(/fund name/i);

    await userEvent.clear(fundNameInput);
    await userEvent.tab();

    expect(screen.getByText('Required')).toBeInTheDocument();

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
    expect(screen.queryByText('Required')).not.toBeInTheDocument();
  });

  it('should delete fund when delete button is clicked', async () => {
    renderFundModal(link1, fundProps[1]);

    // Click the delete button
    await userEvent.click(screen.getByTestId('deleteFundBtn'));

    // Wait for the success notification
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.fundDeleted,
      );
      // Verify modal closed and refetch called
      expect(fundProps[1].hide).toHaveBeenCalled();
      expect(fundProps[1].refetchFunds).toHaveBeenCalled();
    });
  });

  it('should show error notification when delete fund fails', async () => {
    renderFundModal(link2, fundProps[1]);

    // Click the delete button
    await userEvent.click(screen.getByTestId('deleteFundBtn'));

    // Wait for the error notification
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('should successfully create fund and show success notification', async () => {
    const props = {
      ...fundProps[0],
      hide: vi.fn(),
      refetchFunds: vi.fn(),
    };
    renderFundModal(link1, props);

    const fundNameInput = screen.getByLabelText(translations.fundName, {
      exact: false,
    });
    await userEvent.clear(fundNameInput);
    await userEvent.type(fundNameInput, 'Fund 2');

    const fundIdInput = screen.getByLabelText(translations.fundId, {
      exact: false,
    });
    await userEvent.clear(fundIdInput);
    await userEvent.type(fundIdInput, '2222');

    const taxDeductibleSwitch = screen.getByTestId('setisTaxDeductibleSwitch');
    await userEvent.click(taxDeductibleSwitch);

    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    await userEvent.click(defaultSwitch);

    await userEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.fundCreated,
      );
      expect(props.hide).toHaveBeenCalled();
      expect(props.refetchFunds).toHaveBeenCalled();
    });
  });

  it('should successfully update fund and show success notification', async () => {
    const props = {
      ...fundProps[1],
      hide: vi.fn(),
      refetchFunds: vi.fn(),
    };
    renderFundModal(link1, props);

    const fundNameInput = screen.getByLabelText(translations.fundName, {
      exact: false,
    });
    await userEvent.clear(fundNameInput);
    await userEvent.type(fundNameInput, 'Fund 2');

    const taxDeductibleSwitch = screen.getByTestId('setisTaxDeductibleSwitch');
    await userEvent.click(taxDeductibleSwitch);

    await userEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.fundUpdated,
      );
      expect(props.hide).toHaveBeenCalled();
      expect(props.refetchFunds).toHaveBeenCalled();
    });
  });
});
