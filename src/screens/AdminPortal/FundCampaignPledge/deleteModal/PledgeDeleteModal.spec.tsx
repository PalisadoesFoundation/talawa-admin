import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import type { InterfaceDeletePledgeModal } from './PledgeDeleteModal';
import PledgeDeleteModal from './PledgeDeleteModal';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import i18nForTest from 'utils/i18nForTest';
import { MOCKS_DELETE_PLEDGE_ERROR, MOCKS } from '../Pledges.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: toastMocks,
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
    createdAt: dayjs.utc().subtract(10, 'day').toISOString(),
    updatedAt: dayjs.utc().toISOString(),
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
      endAt: dayjs.utc().add(1, 'month').toDate(),
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
    expect(screen.getByTestId('pledge-delete-modal')).toBeInTheDocument();
    expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();
  });

  it('should successfully Delete pledge', async () => {
    renderPledgeDeleteModal(link, pledgeProps);
    expect(screen.getByTestId('pledge-delete-modal')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByTestId('modal-delete-btn'));

    await waitFor(() => {
      expect(pledgeProps.refetchPledge).toHaveBeenCalled();
      expect(pledgeProps.hide).toHaveBeenCalled();
      expect(NotificationToast.success).toHaveBeenCalledWith(
        translations.pledgeDeleted,
      );
    });
  });

  it('should fail to Delete pledge', async () => {
    renderPledgeDeleteModal(link2, pledgeProps);
    expect(screen.getByTestId('pledge-delete-modal')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByTestId('modal-delete-btn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Error deleting pledge',
      );
    });
  });
});
