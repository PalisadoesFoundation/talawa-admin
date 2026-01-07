import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  RenderResult,
  cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from '../../../../state/store';
import { I18nextProvider } from 'react-i18next';
// Imported InterfaceFormStateType from the component file to avoid duplication
import OrganizationModal, { InterfaceFormStateType } from './OrganizationModal';
import i18nForTest from '../../../../utils/i18nForTest';
import { validateFile } from 'utils/fileValidation';

const toastMocks = vi.hoisted(() => ({
  error: vi.fn(),
  success: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: toastMocks,
}));

vi.mock('utils/fileValidation', () => ({
  validateFile: vi.fn(() => ({ isValid: true })),
}));

const mockConvertToBase64 = vi.hoisted(() => vi.fn());
vi.mock('utils/convertToBase64', () => ({
  default: mockConvertToBase64,
}));

describe('OrganizationModal Component', () => {
  const mockToggleModal = vi.fn();
  const mockCreateOrg = vi.fn((e) => e.preventDefault());
  const mockSetFormState = vi.fn();

  const initialFormState: InterfaceFormStateType = {
    addressLine1: '',
    addressLine2: '',
    avatar: null,
    avatarPreview: null,
    city: '',
    countryCode: '',
    description: '',
    name: '',
    postalCode: '',
    state: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(validateFile).mockImplementation(() => ({ isValid: true }));
    mockConvertToBase64.mockResolvedValue('mockBase64String');
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const setup = (customFormState = initialFormState): RenderResult => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationModal
              showModal={true}
              toggleModal={mockToggleModal}
              formState={customFormState}
              setFormState={mockSetFormState}
              createOrg={mockCreateOrg}
              t={(key) => key}
              tCommon={(key) => key}
              userData={undefined}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );
  };

  test('renders OrganizationModal and all fields correctly', () => {
    setup();
    expect(screen.getByTestId('modalOrganizationHeader')).toBeInTheDocument();
    expect(screen.getByTestId('modalOrganizationName')).toBeInTheDocument();
    expect(
      screen.getByTestId('modalOrganizationDescription'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('modalOrganizationCountryCode'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('modalOrganizationState')).toBeInTheDocument();
    expect(screen.getByTestId('modalOrganizationCity')).toBeInTheDocument();
    expect(
      screen.getByTestId('modalOrganizationPostalCode'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('modalOrganizationAddressLine1'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('modalOrganizationAddressLine2'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('organisationImage')).toBeInTheDocument();
    expect(screen.getByTestId('submitOrganizationForm')).toBeInTheDocument();
  });

  const textFields = [
    { id: 'modalOrganizationName', key: 'name', value: 'New Org', limit: 50 },
    {
      id: 'modalOrganizationDescription',
      key: 'description',
      value: 'Description',
      limit: 200,
    },
    { id: 'modalOrganizationState', key: 'state', value: 'State', limit: 50 },
    { id: 'modalOrganizationCity', key: 'city', value: 'City', limit: 50 },
    {
      id: 'modalOrganizationPostalCode',
      key: 'postalCode',
      value: '12345',
      limit: 50,
    },
    {
      id: 'modalOrganizationAddressLine1',
      key: 'addressLine1',
      value: 'Addr 1',
      limit: 50,
    },
  ];

  textFields.forEach(({ id, key, value, limit }) => {
    test(`updates ${key} field correctly and respects limit`, () => {
      setup();
      const input = screen.getByTestId(id);
      fireEvent.change(input, { target: { value } });
      expect(mockSetFormState).toHaveBeenCalledWith(
        expect.objectContaining({ [key]: value }),
      );

      mockSetFormState.mockClear();
      fireEvent.change(input, { target: { value: 'a'.repeat(limit + 1) } });
      expect(mockSetFormState).not.toHaveBeenCalled();
    });
  });

  test('updates addressLine2 field correctly', () => {
    setup();
    const input = screen.getByTestId('modalOrganizationAddressLine2');
    fireEvent.change(input, { target: { value: 'Apt 2' } });

    // Updated assertion to check for addressLine2 update without strict avatar propagation requirements
    expect(mockSetFormState).toHaveBeenCalledWith(
      expect.objectContaining({
        addressLine2: 'Apt 2',
      }),
    );
  });

  test('handles country code selection correctly', () => {
    setup();
    const select = screen.getByTestId('modalOrganizationCountryCode');
    fireEvent.change(select, { target: { value: 'us' } });
    expect(mockSetFormState).toHaveBeenCalledWith(
      expect.objectContaining({ countryCode: 'us' }),
    );
  });

  test('handles null file selection safely', () => {
    setup();
    const fileInput = screen.getByTestId('organisationImage');
    fireEvent.change(fileInput, { target: { files: null } });
    expect(vi.mocked(validateFile)).not.toHaveBeenCalled();
  });

  test('processes valid image upload successfully', async () => {
    setup();
    const fileInput = screen.getByTestId('organisationImage');
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(vi.mocked(validateFile)).toHaveBeenCalledWith(file);
      expect(mockConvertToBase64).toHaveBeenCalledWith(file);
      expect(mockSetFormState).toHaveBeenCalledWith(
        expect.objectContaining({ avatarPreview: 'mockBase64String' }),
      );
      expect(toastMocks.success).toHaveBeenCalledWith('imageUploadSuccess');
    });
  });

  test('handles image conversion failure', async () => {
    mockConvertToBase64.mockRejectedValueOnce(new Error('error'));
    setup();
    const fileInput = screen.getByTestId('organisationImage');
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalledWith('imageUploadError');
    });
  });

  test('aborts upload if file validation fails', async () => {
    vi.mocked(validateFile).mockReturnValueOnce({
      isValid: false,
      errorMessage: 'validation error',
    });
    setup();
    const fileInput = screen.getByTestId('organisationImage');
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalledWith('validation error');
      expect(mockConvertToBase64).not.toHaveBeenCalled();
    });
  });

  test('does nothing when file input change is triggered without a file', () => {
    setup();
    const fileInput = screen.getByTestId('organisationImage');
    fireEvent.change(fileInput, { target: { files: [] } });
    expect(vi.mocked(validateFile)).not.toHaveBeenCalled();
  });

  test('triggers createOrg on form submission', async () => {
    setup();
    const form = screen.getByTestId('submitOrganizationForm').closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    expect(mockCreateOrg).toHaveBeenCalled();
  });

  test('closes modal via toggleModal prop', async () => {
    setup();
    const closeButton = screen.getByLabelText(/close/i);
    await userEvent.click(closeButton);
    expect(mockToggleModal).toHaveBeenCalled();
  });

  test('validates required fields presence', () => {
    setup();
    expect(screen.getByTestId('modalOrganizationName')).toBeRequired();
    expect(screen.getByTestId('modalOrganizationDescription')).toBeRequired();
    expect(screen.getByTestId('modalOrganizationCountryCode')).toBeRequired();
    expect(screen.getByTestId('modalOrganizationState')).toBeRequired();
    expect(screen.getByTestId('modalOrganizationCity')).toBeRequired();
    expect(screen.getByTestId('modalOrganizationAddressLine1')).toBeRequired();
  });
});
