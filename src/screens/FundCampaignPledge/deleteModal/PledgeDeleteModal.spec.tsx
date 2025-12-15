import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import type { InterfaceDeletePledgeModal } from './PledgeDeleteModal';
import PledgeDeleteModal from './PledgeDeleteModal';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18nForTest from '../../../utils/i18nForTest';
import { MOCKS_DELETE_PLEDGE_ERROR, MOCKS } from '../PledgesMocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import { vi } from 'vitest';

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: toastMocks,
}));

const link = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_DELETE_PLEDGE_ERROR);
const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.pledges),
);

const pledgeProps: InterfaceDeletePledgeModal = {
  isOpen: true,
  hide: vi.fn(),
  pledge: {
    id: '1',
    amount: 100,
    currency: 'USD',
    startDate: '2024-01-01',
    endDate: '2024-01-10',
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
      endAt: new Date('2024-01-15'),
      currencyCode: 'USD',
      goalAmount: 500,
    },
  },
  refetchPledge: vi.fn(),
};

const renderPledgeDeleteModal = (
  link: ApolloLink,
  props: InterfaceDeletePledgeModal,
): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <PledgeDeleteModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('PledgeDeleteModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (pledgeProps.hide as unknown as ReturnType<typeof vi.fn>).mockClear();
    (
      pledgeProps.refetchPledge as unknown as ReturnType<typeof vi.fn>
    ).mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render PledgeDeleteModal', () => {
    renderPledgeDeleteModal(link, pledgeProps);
    expect(screen.getByTestId('deletePledgeCloseBtn')).toBeInTheDocument();
  });

  it('should successfully Delete pledge', async () => {
    renderPledgeDeleteModal(link, pledgeProps);
    expect(screen.getByTestId('deletePledgeCloseBtn')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('deleteyesbtn'));

    await waitFor(() => {
      expect(pledgeProps.refetchPledge).toHaveBeenCalled();
      expect(pledgeProps.hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(translations.pledgeDeleted);
    });
  });

  it('should fail to Delete pledge', async () => {
    renderPledgeDeleteModal(link2, pledgeProps);
    expect(screen.getByTestId('deletePledgeCloseBtn')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('deleteyesbtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error deleting pledge');
    });
  });
});
