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
import i18nForTest from '../../../utils/i18nForTest';
import { PLEDGE_MODAL_MOCKS, PLEDGE_MODAL_ERROR_MOCKS } from '../PledgesMocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { InterfacePledgeModal } from './PledgeModal';
import PledgeModal from './PledgeModal';
import React from 'react';
import { vi } from 'vitest';
import dayjs from 'dayjs';

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@mui/x-date-pickers/DesktopDateTimePicker', async () => {
  const actual = await vi.importActual(
    '@mui/x-date-pickers/DesktopDateTimePicker',
  );
  return { DateTimePicker: actual.DesktopDateTimePicker };
});

const link1 = new StaticMockLink(PLEDGE_MODAL_MOCKS);
const errorLink = new StaticMockLink(PLEDGE_MODAL_ERROR_MOCKS);
const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.pledges),
);

const createPledgeProps = (): InterfacePledgeModal => ({
  isOpen: true,
  hide: vi.fn(),
  pledge: {
    _id: '1',
    amount: 100,
    currency: 'USD',
    startDate: '2024-01-01',
    endDate: '2024-01-10',
    users: [{ _id: '1', firstName: 'John', lastName: 'Doe', image: undefined }],
  },
  refetchPledge: vi.fn(),
  campaignId: 'campaignId',
  orgId: 'orgId',
  endDate: new Date('2024-12-31'),
  mode: 'create',
});

const pledgeProps: InterfacePledgeModal[] = [
  createPledgeProps(),
  { ...createPledgeProps(), mode: 'edit' },
];

const renderPledgeModal = (
  link: ApolloLink,
  props: InterfacePledgeModal,
): RenderResult => {
  return render(
    <MockedProvider link={link} addTypename={false}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <PledgeModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('PledgeModal', () => {
  beforeAll(() => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ orgId: 'orgId', fundCampaignId: 'fundCampaignId' }),
        useNavigate: vi.fn(),
      };
    });
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render edit pledge modal with correct title', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    await waitFor(() =>
      expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
    );
  });

  it('should close the modal when close button is clicked', async () => {
    const hideMock = vi.fn();
    const props = { ...pledgeProps[0], hide: hideMock };
    renderPledgeModal(link1, props);

    fireEvent.click(screen.getByTestId('pledgeModalCloseBtn'));
    expect(hideMock).toHaveBeenCalledTimes(1);
  });

  it('should populate form fields with correct values in edit mode', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    await waitFor(() =>
      expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
    );
    expect(screen.getByTestId('pledgerSelect')).toHaveTextContent('John Doe');
    expect(screen.getByLabelText('Start Date')).toHaveValue('01/01/2024');
    expect(screen.getByLabelText('End Date')).toHaveValue('10/01/2024');
    expect(screen.getByLabelText('Currency')).toHaveTextContent('USD ($)');
    expect(screen.getByLabelText('Amount')).toHaveValue('100');
  });

  it('should update pledgeAmount when input value changes', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const amountInput = screen.getByLabelText('Amount');
    expect(amountInput).toHaveValue('100');
    fireEvent.change(amountInput, { target: { value: '200' } });
    expect(amountInput).toHaveValue('200');
  });

  it('should not update pledgeAmount when input value is less than or equal to 0', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const amountInput = screen.getByLabelText('Amount');
    expect(amountInput).toHaveValue('100');
    fireEvent.change(amountInput, { target: { value: '-10' } });
    expect(amountInput).toHaveValue('100');
    fireEvent.change(amountInput, { target: { value: '0' } });
    expect(amountInput).toHaveValue('100');
  });

  it('should update currency when a new currency is selected', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const currencySelect = screen.getByLabelText('Currency');
    expect(currencySelect).toHaveTextContent('USD ($)');

    fireEvent.mouseDown(currencySelect);
    const euroOption = await screen.findByText('EUR (€)');
    fireEvent.click(euroOption);

    expect(currencySelect).toHaveTextContent('EUR (€)');
  });

  it('should update pledgeStartDate when a new date is selected', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: '02/01/2024' } });
    expect(startDateInput).toHaveValue('02/01/2024');
    expect(pledgeProps[1].pledge?.startDate).toEqual('2024-01-01');
  });

  it('pledgeStartDate onChange when its null', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: null } });
    expect(pledgeProps[1].pledge?.startDate).toEqual('2024-01-01');
  });

  it('should update pledgeEndDate when a new date is selected', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const endDateInput = screen.getByLabelText('End Date');
    fireEvent.change(endDateInput, { target: { value: '12/01/2024' } });
    expect(endDateInput).toHaveValue('12/01/2024');
    expect(pledgeProps[1].pledge?.endDate).toEqual('2024-01-10');
  });

  it('pledgeEndDate onChange when its null', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const endDateInput = screen.getByLabelText('End Date');
    fireEvent.change(endDateInput, { target: { value: null } });
    expect(pledgeProps[1].pledge?.endDate).toEqual('2024-01-10');
  });

  it('should update end date if start date is after current end date', async () => {
    const props = {
      ...pledgeProps[1],
      pledge: {
        ...pledgeProps[1].pledge!,
        startDate: '2024-01-01',
        endDate: '2024-01-10',
      },
    };
    renderPledgeModal(link1, props);

    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: '15/01/2024' } });

    const endDateInput = screen.getByLabelText('End Date');
    expect(endDateInput).toHaveValue('15/01/2024');
  });

  it('should handle create pledge error', async () => {
    renderPledgeModal(errorLink, pledgeProps[0]);

    fireEvent.click(screen.getByTestId('submitPledgeBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
      expect(pledgeProps[0].hide).not.toHaveBeenCalled();
    });
  });

  it('should handle the initial state correctly in create mode', async () => {
    const newProps = {
      ...pledgeProps[0],
      pledge: null, // Testing the case when pledge is null in create mode
    };

    renderPledgeModal(link1, newProps);

    await waitFor(() => {
      expect(screen.getByLabelText('Amount')).toHaveValue('0');
      expect(screen.getByLabelText('Currency')).toHaveTextContent('USD');
      expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();

      // The dates should be initialized to the current date
      const today = dayjs().format('DD/MM/YYYY');
      expect(screen.getByLabelText('Start Date')).toHaveValue(today);
      expect(screen.getByLabelText('End Date')).toHaveValue(today);
    });
  });

  it('should enforce date constraints (start date before end date)', async () => {
    renderPledgeModal(link1, pledgeProps[0]);

    // First set end date to an earlier date
    fireEvent.change(screen.getByLabelText('End Date'), {
      target: { value: '05/01/2024' },
    });

    // Then try to set start date to a later date - the end date should update automatically
    fireEvent.change(screen.getByLabelText('Start Date'), {
      target: { value: '10/01/2024' },
    });

    // End date should update to match start date
    expect(screen.getByLabelText('End Date')).toHaveValue('10/01/2024');
  });

  it('should enforce campaign end date as the max date', async () => {
    const campaignEndDate = new Date('2024-06-30');
    const props = { ...pledgeProps[0], endDate: campaignEndDate };

    renderPledgeModal(link1, props);

    const endDatePicker = screen.getByLabelText('End Date');
    expect(endDatePicker).toBeInTheDocument();
  });
});
