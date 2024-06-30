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
import { MOCKS, MOCK_ERROR } from './OrganizationFundCampaignMocks';
import CampaignDeleteModal, {
  type InterfaceDeleteCampaignModal,
} from './CampaignDeleteModal';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCK_ERROR);
const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.fundCampaign),
);

const campaignProps: InterfaceDeleteCampaignModal = {
  isOpen: true,
  hide: jest.fn(),
  campaign: {
    _id: 'campaignId1',
    name: 'Campaign 1',
    fundingGoal: 100,
    startDate: new Date('2021-01-01'),
    endDate: new Date('2024-01-01'),
    currency: 'USD',
    createdAt: '2021-01-01',
  },
  refetchCampaign: jest.fn(),
};
const renderFundDeleteModal = (
  link: ApolloLink,
  props: InterfaceDeleteCampaignModal,
): RenderResult => {
  return render(
    <MockedProvider link={link} addTypename={false}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <CampaignDeleteModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('CampaignDeleteModal', () => {
  it('should render CampaignDeleteModal', () => {
    renderFundDeleteModal(link1, campaignProps);
    expect(screen.getByTestId('deleteCampaignCloseBtn')).toBeInTheDocument();
  });

  it('should successfully Delete Campaign', async () => {
    renderFundDeleteModal(link1, campaignProps);
    expect(screen.getByTestId('deleteCampaignCloseBtn')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('deleteyesbtn'));

    await waitFor(() => {
      expect(campaignProps.refetchCampaign).toHaveBeenCalled();
      expect(campaignProps.hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(translations.deletedCampaign);
    });
  });

  it('should fail to Delete Campaign', async () => {
    renderFundDeleteModal(link2, campaignProps);
    expect(screen.getByTestId('deleteCampaignCloseBtn')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('deleteyesbtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mock graphql error');
    });
  });
});
