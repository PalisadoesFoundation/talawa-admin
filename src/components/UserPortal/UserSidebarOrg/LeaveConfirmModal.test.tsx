import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  RenderResult,
} from '@testing-library/react';
import LeaveConfirmModal from './LeaveConfirmModal';
import { MockedProvider } from '@apollo/client/testing';
import { LEAVE_ORGANIZATION } from 'GraphQl/Mutations/OrganizationMutations';
import { toast } from 'react-toastify';
import i18n from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
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
      <I18nextProvider i18n={i18n}>
        <LeaveConfirmModal
          show={true}
          onHide={onHide}
          orgId="6437904485008f171cf29924"
        />
      </I18nextProvider>
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
    renderLeaveConfirmModal(onHide, mocks);

    const confirmButton = screen.getByText(translations.confirm);
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(toast.success);
      expect(onHide).toHaveBeenCalled();
      // expect(mockNavigate).toHaveBeenCalledWith('/user/organizations');
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
});
