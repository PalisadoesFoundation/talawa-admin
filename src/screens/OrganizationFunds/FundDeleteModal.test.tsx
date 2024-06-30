import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18nForTest from '../../utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { InterfaceDeleteFundModal } from './FundDeleteModal';
import FundDeleteModal from './FundDeleteModal';
import { MOCKS, MOCKS_ERROR } from './OrganizationFundsMocks';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_ERROR);
const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.funds),
);

const fundProps: InterfaceDeleteFundModal = {
  isOpen: true,
  hide: jest.fn(),
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
  refetchFunds: jest.fn(),
};
const renderFundDeleteModal = (
  link: ApolloLink,
  props: InterfaceDeleteFundModal,
): RenderResult => {
  return render(
    <MockedProvider link={link} addTypename={false}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <FundDeleteModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('FundDeleteModal', () => {
  it('should render FundDeleteModal', () => {
    renderFundDeleteModal(link1, fundProps);
    expect(screen.getByTestId('deleteFundCloseBtn')).toBeInTheDocument();
  });

  it('should successfully Delete Fund', async () => {
    renderFundDeleteModal(link1, fundProps);
    expect(screen.getByTestId('deleteFundCloseBtn')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('deleteyesbtn'));

    await waitFor(() => {
      expect(fundProps.refetchFunds).toHaveBeenCalled();
      expect(fundProps.hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(translations.fundDeleted);
    });
  });

  it('should fail to Delete Fund', async () => {
    renderFundDeleteModal(link2, fundProps);
    expect(screen.getByTestId('deleteFundCloseBtn')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('deleteyesbtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mock graphql error');
    });
  });
});
