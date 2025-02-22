import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import DeleteOrg from './DeleteOrg';
import { IS_SAMPLE_ORGANIZATION_QUERY } from 'GraphQl/Queries/Queries';

// Mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useMutation: jest.fn(() => [jest.fn(), { loading: false, error: undefined }]),
  useQuery: jest.fn(() => ({
    data: { isSampleOrganization: false },
    loading: false,
    error: undefined,
  })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    tCommon: (key: string) => key,
  }),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('utils/useLocalstorage', () => ({
  useLocalStorage: () => ({
    getItem: jest.fn().mockReturnValue('true'),
  }),
}));

const mockNavigate = jest.fn();
const mockOrgId = 'org123';

const sampleOrganizationMock = {
  request: {
    query: IS_SAMPLE_ORGANIZATION_QUERY,
    variables: { id: mockOrgId },
  },
  result: {
    data: {
      isSampleOrganization: true,
    },
  },
};

const regularOrganizationMock = {
  request: {
    query: IS_SAMPLE_ORGANIZATION_QUERY,
    variables: { id: mockOrgId },
  },
  result: {
    data: {
      isSampleOrganization: false,
    },
  },
};

describe('DeleteOrg Component', () => {
  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ orgId: mockOrgId });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useMutation as jest.Mock).mockImplementation(() => [
      jest.fn(),
      { loading: false },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders delete card when user has permission', () => {
    render(
      <MockedProvider mocks={[sampleOrganizationMock]} addTypename={false}>
        <DeleteOrg />
      </MockedProvider>,
    );

    expect(screen.getByTestId('openDeleteModalBtn')).toBeInTheDocument();
    expect(
      screen.getByText('deleteOrg.deleteOrganization'),
    ).toBeInTheDocument();
  });

  test('does not render delete card without permission', () => {
    // Mock getItem to return false
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('false');

    render(
      <MockedProvider mocks={[sampleOrganizationMock]} addTypename={false}>
        <DeleteOrg />
      </MockedProvider>,
    );

    expect(screen.queryByTestId('openDeleteModalBtn')).not.toBeInTheDocument();
  });

  test('opens and closes delete confirmation modal', async () => {
    render(
      <MockedProvider mocks={[regularOrganizationMock]} addTypename={false}>
        <DeleteOrg />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    expect(screen.getByTestId('orgDeleteModal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('closeDelOrgModalBtn'));
    expect(screen.queryByTestId('orgDeleteModal')).not.toBeInTheDocument();
  });

  test('deletes sample organization successfully', async () => {
    const removeSampleMock = jest
      .fn()
      .mockResolvedValue({ data: { removeSampleOrganization: true } });
    (useMutation as jest.Mock).mockImplementation(() => [removeSampleMock]);

    render(
      <MockedProvider mocks={[sampleOrganizationMock]} addTypename={false}>
        <DeleteOrg />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    fireEvent.click(screen.getByTestId('deleteOrganizationBtn'));

    await waitFor(() => {
      expect(removeSampleMock).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        'deleteOrg.successfullyDeletedSampleOrganization',
      );
      expect(mockNavigate).toHaveBeenCalledWith('/orglist');
    });
  });

  test('deletes regular organization successfully', async () => {
    const deleteMock = jest
      .fn()
      .mockResolvedValue({ data: { deleteOrganization: true } });
    (useMutation as jest.Mock).mockImplementation(() => [deleteMock]);

    render(
      <MockedProvider mocks={[regularOrganizationMock]} addTypename={false}>
        <DeleteOrg />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    fireEvent.click(screen.getByTestId('deleteOrganizationBtn'));

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith({
        variables: { input: { id: mockOrgId } },
      });
      expect(mockNavigate).toHaveBeenCalledWith('/orglist');
    });
  });

  test('handles deletion errors', async () => {
    const errorMessage = 'Deletion failed';
    const errorMock = jest.fn().mockRejectedValue(new Error(errorMessage));
    (useMutation as jest.Mock).mockImplementation(() => [errorMock]);

    render(
      <MockedProvider mocks={[regularOrganizationMock]} addTypename={false}>
        <DeleteOrg />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('openDeleteModalBtn'));
    fireEvent.click(screen.getByTestId('deleteOrganizationBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
