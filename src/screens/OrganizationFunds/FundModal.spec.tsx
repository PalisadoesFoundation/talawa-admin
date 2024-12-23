import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
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
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18nForTest from '../../utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import { MOCKS, MOCKS_ERROR } from './OrganizationFundsMocks';
import type { InterfaceFundModal } from './FundModal';
import FundModal from './FundModal';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
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
      _id: 'fundId',
      name: 'Fund 1',
      refrenceNumber: '1111',
      taxDeductible: true,
      isArchived: false,
      isDefault: false,
      createdAt: '2024-06-22',
      organizationId: 'orgId',
      creator: {
        _id: 'creatorId1',
        firstName: 'John',
        lastName: 'Doe',
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
      _id: 'fundId',
      name: 'Fund 1',
      refrenceNumber: '1111',
      taxDeductible: true,
      isArchived: false,
      isDefault: false,
      createdAt: '2024-06-22',
      organizationId: 'orgId',
      creator: {
        _id: 'creatorId1',
        firstName: 'John',
        lastName: 'Doe',
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
    <MockedProvider link={link} addTypename={false}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <FundModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
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
    expect(screen.getByTestId('setTaxDeductibleSwitch')).toBeChecked();
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

  it('should update Tax Deductible Switch when input value changes', async () => {
    renderFundModal(link1, fundProps[1]);
    const taxDeductibleSwitch = screen.getByTestId('setTaxDeductibleSwitch');
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

    const taxDeductibleSwitch = screen.getByTestId('setTaxDeductibleSwitch');
    fireEvent.click(taxDeductibleSwitch);

    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    fireEvent.click(defaultSwitch);

    fireEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.fundCreated);
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

    const taxDeductibleSwitch = screen.getByTestId('setTaxDeductibleSwitch');
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
      expect(toast.success).not.toHaveBeenCalled();
      expect(fundProps[1].refetchFunds).not.toHaveBeenCalled();
      expect(fundProps[1].hide).not.toHaveBeenCalled();
    });
  });

  it('should update fund', async () => {
    renderFundModal(link1, fundProps[1]);

    const fundNameInput = screen.getByLabelText(translations.fundName);
    fireEvent.change(fundNameInput, { target: { value: 'Fund 2' } });

    const fundIdInput = screen.getByLabelText(translations.fundId);
    fireEvent.change(fundIdInput, { target: { value: '2222' } });

    const taxDeductibleSwitch = screen.getByTestId('setTaxDeductibleSwitch');
    fireEvent.click(taxDeductibleSwitch);

    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    fireEvent.click(defaultSwitch);

    const archivedSwitch = screen.getByTestId('archivedSwitch');
    fireEvent.click(archivedSwitch);

    fireEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.fundUpdated);
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

    const taxDeductibleSwitch = screen.getByTestId('setTaxDeductibleSwitch');
    fireEvent.click(taxDeductibleSwitch);

    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    fireEvent.click(defaultSwitch);

    fireEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mock graphql error');
    });
  });

  it('Error: should update fund', async () => {
    renderFundModal(link2, fundProps[1]);

    const fundNameInput = screen.getByLabelText(translations.fundName);
    fireEvent.change(fundNameInput, { target: { value: 'Fund 2' } });

    const fundIdInput = screen.getByLabelText(translations.fundId);
    fireEvent.change(fundIdInput, { target: { value: '2222' } });

    const taxDeductibleSwitch = screen.getByTestId('setTaxDeductibleSwitch');
    fireEvent.click(taxDeductibleSwitch);

    const defaultSwitch = screen.getByTestId('setDefaultSwitch');
    fireEvent.click(defaultSwitch);

    const archivedSwitch = screen.getByTestId('archivedSwitch');
    fireEvent.click(archivedSwitch);

    fireEvent.click(screen.getByTestId('createFundFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mock graphql error');
    });
  });
});
