import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  RenderResult,
  act,
} from '@testing-library/react';
import LeaveConfirmModal from './LeaveConfirmModal';
import { MockedProvider } from '@apollo/client/testing';
import { LEAVE_ORGANIZATION } from 'GraphQl/Mutations/OrganizationMutations';
import { toast } from 'react-toastify';
import i18n from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const translations = {
  ...JSON.parse(
    JSON.stringify(i18n.getDataByLanguage('en')?.translation.orgLeave ?? {}),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const renderLeaveConfirmModal = (
  onHide: () => void,
  mocks: any,
): RenderResult => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <LeaveConfirmModal
            show={true}
            onHide={onHide}
            orgId="6437904485008f171cf29924"
          />
        </I18nextProvider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

const mocks = [
  {
    request: {
      query: LEAVE_ORGANIZATION,
      variables: { organizationId: '6437904485008f171cf29924' },
    },
    result: {
      data: {
        leaveOrganization: true,
      },
    },
  },
];

describe('LeaveConfirmModal', () => {
  const onHide = jest.fn();

  it('calls onHide when cancel button is clicked', () => {
    renderLeaveConfirmModal(onHide, mocks);

    const cancelButton = screen.getByText(translations.cancel);
    fireEvent.click(cancelButton);
    expect(onHide).toHaveBeenCalled();
  });

  it('calls leaveOrganization mutation and handles success', async () => {
    const { debug } = renderLeaveConfirmModal(onHide, mocks);

    const confirmButton = screen.getByTestId('leave-confirm-modal-confirm-btn');

    fireEvent.click(confirmButton);

    await wait();

    await waitFor(() => {
      debug();
      expect(onHide).toHaveBeenCalled();
    });
  });

  it('handles error when leaveOrganization mutation fails', async () => {
    const errorMocks = [
      {
        request: {
          query: LEAVE_ORGANIZATION,
          variables: { organizationId: '6437904485008f171cf29924' },
        },
        error: new Error(translations.errorOccured),
      },
    ];

    renderLeaveConfirmModal(onHide, errorMocks);

    fireEvent.click(screen.getByText(translations.confirm));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(translations.errorOccured);
      expect(onHide).toHaveBeenCalled();
    });
  });

  it('LEAVE_ORGANIZATION mock has correct query', () => {
    expect(mocks[0].request.query).toBe(LEAVE_ORGANIZATION);
  });

  it('LEAVE_ORGANIZATION mock has correct variables', () => {
    expect(mocks[0].request.variables).toEqual({
      organizationId: '6437904485008f171cf29924',
    });
  });

  it('LEAVE_ORGANIZATION mock has correct result', () => {
    expect(mocks[0].result).toEqual({ data: { leaveOrganization: true } });
  });
});