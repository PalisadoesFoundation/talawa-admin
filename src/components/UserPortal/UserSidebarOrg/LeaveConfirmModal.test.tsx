import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LeaveConfirmModal from './LeaveConfirmModal';
import { MockedProvider } from '@apollo/client/testing';
import { LEAVE_ORGANIZATION } from 'GraphQl/Mutations/OrganizationMutations';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('react-router-dom', () => ({
    redirect: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

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
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <LeaveConfirmModal show={true} onHide={onHide} orgId="6437904485008f171cf29924" />
            </MockedProvider>
        );

        fireEvent.click(screen.getByText('cancel'));
        expect(onHide).toHaveBeenCalled();
    });

    it('calls leaveOrganization mutation and handles success', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <LeaveConfirmModal show={true} onHide={onHide} orgId="6437904485008f171cf29924" />
            </MockedProvider>
        );

        fireEvent.click(screen.getByText('confirm'));

        await waitFor(() => {
            expect(toast.success);
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
                error: new Error('An error occurred. Please try again later.'),
            },
        ];

        render(
            <MockedProvider mocks={errorMocks} addTypename={false}>
                <LeaveConfirmModal show={true} onHide={onHide} orgId="6437904485008f171cf29924" />
            </MockedProvider>
        );

        fireEvent.click(screen.getByText('confirm'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('errorOccured');
            expect(onHide).toHaveBeenCalled();
        });
    });
});