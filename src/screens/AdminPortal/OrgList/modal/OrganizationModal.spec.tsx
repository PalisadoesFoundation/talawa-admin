import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  RenderResult,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from '../../../../state/store'; // Update path based on your project structure
import { I18nextProvider } from 'react-i18next';
import OrganizationModal from './OrganizationModal';
import i18nForTest from '../../../../utils/i18nForTest'; // Update path based on your project structure

// Mock toast
const toastMocks = vi.hoisted(() => ({
  error: vi.fn(),
  success: vi.fn(),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: toastMocks,
}));

const { mockUploadFileToMinio } = vi.hoisted(() => ({
  mockUploadFileToMinio: vi
    .fn()
    .mockResolvedValue({ objectName: 'mocked-object-name' }),
}));

vi.mock('utils/MinioUpload', () => ({
  useMinioUpload: () => ({ uploadFileToMinio: mockUploadFileToMinio }),
}));

// Mock formEnumFields to inject a very long country code for validation testing
vi.mock('utils/formEnumFields', () => ({
  countryOptions: [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    // A value > 50 chars to test the validation logic in the onChange handler
    { value: 'x'.repeat(51), label: 'Long Country Name' },
  ],
}));

describe('OrganizationModal Component', () => {
  const mockToggleModal = vi.fn();

  const mockCreateOrg = vi.fn((e) => e.preventDefault());
  const mockSetFormState = vi.fn();

  const formState = {
    addressLine1: '',
    addressLine2: '',
    avatar: '',
    city: '',
    countryCode: '',
    description: '',
    name: '',
    postalCode: '',
    state: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockUploadFileToMinio.mockResolvedValue({
      objectName: 'mocked-object-name',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  vi.mock('utils/convertToBase64', () => ({
    default: vi.fn((file) => {
      if (file.size > 5000000) {
        return Promise.reject(new Error('File too large'));
      }
      return Promise.resolve('mockBase64String');
    }),
  }));

  const setup = (): RenderResult => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationModal
              showModal={true}
              toggleModal={mockToggleModal}
              formState={formState}
              setFormState={mockSetFormState}
              createOrg={mockCreateOrg}
              t={(key) => key}
              tCommon={(key) => key}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );
  };

  test('renders OrganizationModal correctly', () => {
    setup();
    expect(screen.getByTestId('modalOrganizationHeader')).toBeInTheDocument();
    expect(screen.getByTestId('modalOrganizationName')).toBeInTheDocument();
    expect(screen.getByTestId('submitOrganizationForm')).toBeInTheDocument();
  });

  test('updates input fields correctly', async () => {
    setup();
    const nameInput = screen.getByTestId('modalOrganizationName');
    fireEvent.change(nameInput, { target: { value: 'Test Organization' } });
    expect(mockSetFormState).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Test Organization' }),
    );
  });

  test('submits form correctly', async () => {
    const validFormState = {
      name: 'Test Organization',
      description: 'Test Description',
      addressLine1: '123 Test St',
      addressLine2: '',
      city: 'Test City',
      state: 'Test State',
      countryCode: 'us',
      postalCode: '12345',
      avatar: '',
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationModal
              showModal={true}
              toggleModal={mockToggleModal}
              formState={validFormState}
              setFormState={mockSetFormState}
              createOrg={mockCreateOrg}
              t={(key) => key}
              tCommon={(key) => key}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );

    const submitButton = screen.getByTestId('submitOrganizationForm');
    await userEvent.click(submitButton);
    expect(mockCreateOrg).toHaveBeenCalled();
  });

  test('uploads image correctly', async () => {
    setup();
    const fileInput = screen.getByTestId('organisationImage');
    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() =>
      expect(mockSetFormState).toHaveBeenCalledWith(
        expect.objectContaining({ avatar: 'mocked-object-name' }),
      ),
    );
    expect(mockUploadFileToMinio).toHaveBeenCalledWith(file, 'organization');
  });

  test('handles image upload error correctly', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockUploadFileToMinio.mockRejectedValueOnce(new Error('Upload failed'));

    setup();
    const fileInput = screen.getByTestId('organisationImage');
    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error uploading image:',
        expect.any(Error),
      );
    });

    expect(mockSetFormState).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('closes modal when close button is clicked', () => {
    setup();
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockToggleModal).toHaveBeenCalled();
  });

  test('triggers sample organization creation', async () => {
    const validFormState = {
      name: 'Test Organization',
      description: 'Test Description',
      addressLine1: '123 Test St',
      addressLine2: '',
      city: 'Test City',
      state: 'Test State',
      countryCode: 'us',
      postalCode: '12345',
      avatar: '',
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationModal
              showModal={true}
              toggleModal={mockToggleModal}
              formState={validFormState}
              setFormState={mockSetFormState}
              createOrg={mockCreateOrg}
              t={(key) => key}
              tCommon={(key) => key}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );

    await userEvent.click(screen.getByTestId('submitOrganizationForm'));
    expect(mockCreateOrg).toHaveBeenCalled();
  });

  test('updates all form fields correctly', () => {
    setup();
    const fields = [
      {
        testId: 'modalOrganizationDescription',
        key: 'description',
        value: 'A sample description',
      },
      { testId: 'modalOrganizationCity', key: 'city', value: 'Sample City' },
      { testId: 'modalOrganizationState', key: 'state', value: 'Sample State' },
      {
        testId: 'modalOrganizationPostalCode',
        key: 'postalCode',
        value: '123456',
      },
      {
        testId: 'modalOrganizationAddressLine1',
        key: 'addressLine1',
        value: '123 Street',
      },
      {
        testId: 'modalOrganizationAddressLine2',
        key: 'addressLine2',
        value: 'Apt 456',
      },
    ];
    fields.forEach(({ testId, key, value }) => {
      const input = screen.getByTestId(testId);
      fireEvent.change(input, { target: { value } });
      expect(mockSetFormState).toHaveBeenCalledWith(
        expect.objectContaining({ [key]: value }),
      );
    });
  });

  test('description field should not accept more than 200 characters', async () => {
    setup();
    const descInput = screen.getByTestId(
      'modalOrganizationDescription',
    ) as HTMLInputElement;
    const longText = 'a'.repeat(250);

    // Clear any previous calls
    mockSetFormState.mockClear();

    // Use fireEvent.change to test the validation logic directly
    fireEvent.change(descInput, { target: { value: longText } });

    // Should not call setFormState when input exceeds limit
    expect(mockSetFormState).not.toHaveBeenCalled();
  });

  test('should handle country selection correctly', async () => {
    setup();
    const countrySelect = screen.getByTestId(
      'modalOrganizationCountryCode',
    ) as HTMLSelectElement;
    fireEvent.change(countrySelect, { target: { value: 'us' } });

    expect(mockSetFormState).toHaveBeenCalledWith(
      expect.objectContaining({ countryCode: 'us' }),
    );
  });

  test('country code should not update if value length exceeds 50 characters', async () => {
    setup();
    const countrySelect = screen.getByTestId(
      'modalOrganizationCountryCode',
    ) as HTMLSelectElement;

    // Select the mocked option that is intentionally longer than 50 characters
    // 'x'.repeat(51) is in our mock above
    const longCode = 'x'.repeat(51);

    mockSetFormState.mockClear();

    // Simulate user selecting this long option
    fireEvent.change(countrySelect, { target: { value: longCode } });

    // Expect setFormState NOT to be called because 51 > 50
    expect(mockSetFormState).not.toHaveBeenCalled();
  });

  test('country select should have default disabled option', () => {
    setup();
    const countrySelect = screen.getByTestId(
      'modalOrganizationCountryCode',
    ) as HTMLSelectElement;
    const firstOption = countrySelect.options[0];
    expect(firstOption.disabled).toBe(true);
  });

  test('form inputs should have associated labels', () => {
    setup();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/displayImage/i)).toBeInTheDocument();
  });

  test('required fields should have proper aria attributes', () => {
    setup();
    const requiredInputs = screen
      .getAllByRole('textbox', { hidden: true })
      .filter((input) => input instanceof HTMLInputElement && input.required);

    requiredInputs.forEach((input) => {
      // Check if the input has either the required attribute or aria-required
      expect(
        input.hasAttribute('required') ||
          input.getAttribute('aria-required') === 'true',
      ).toBeTruthy();
    });
  });

  test('should handle form submission with all fields filled', async () => {
    const setup = (): RenderResult => {
      return render(
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <OrganizationModal
                showModal={true}
                toggleModal={mockToggleModal}
                formState={completeFormState}
                setFormState={mockSetFormState}
                createOrg={mockCreateOrg}
                t={(key) => key}
                tCommon={(key) => key}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>,
      );
    };
    const completeFormState = {
      ...formState,
      name: 'Test Organization',
      description: 'Test Description',
      addressLine1: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      countryCode: 'us',
      postalCode: '12345',
    };

    setup();
    const submitButton = screen.getByTestId('submitOrganizationForm');

    await userEvent.click(submitButton);
    expect(mockCreateOrg).toHaveBeenCalled();
  });

  const testCases = [
    { fieldId: 'modalOrganizationName', maxLength: 50, formKey: 'name' },
    {
      fieldId: 'modalOrganizationDescription',
      maxLength: 200,
      formKey: 'description',
    },
    { fieldId: 'modalOrganizationState', maxLength: 50, formKey: 'state' },
    { fieldId: 'modalOrganizationCity', maxLength: 50, formKey: 'city' },
    {
      fieldId: 'modalOrganizationPostalCode',
      maxLength: 50,
      formKey: 'postalCode',
    },
    {
      fieldId: 'modalOrganizationAddressLine1',
      maxLength: 50,
      formKey: 'addressLine1',
    },
    {
      fieldId: 'modalOrganizationAddressLine2',
      maxLength: 50,
      formKey: 'addressLine2',
    },
  ];

  testCases.forEach(({ fieldId, maxLength, formKey }) => {
    test(`${formKey} should not accept more than ${maxLength} characters`, async () => {
      setup();
      const input = screen.getByTestId(fieldId);
      const longText = 'a'.repeat(maxLength + 10);

      // Clear any previous calls
      mockSetFormState.mockClear();

      // Use fireEvent.change to test the validation logic directly
      fireEvent.change(input, { target: { value: longText } });

      // Should not call setFormState when input exceeds limit
      expect(mockSetFormState).not.toHaveBeenCalled();
    });
  });
  test('should handle valid image upload', async () => {
    setup();
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('organisationImage');

    await userEvent.upload(fileInput, file);

    expect(mockSetFormState).toHaveBeenCalledWith(
      expect.objectContaining({ avatar: 'mocked-object-name' }),
    );
  });

  test('should handle invalid file type', async () => {
    setup();
    const invalidFile = new File(['content'], 'test.txt', {
      type: 'text/plain',
    });
    const fileInput = screen.getByTestId('organisationImage');

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalledWith('invalidFileType');
    });
    expect(mockUploadFileToMinio).not.toHaveBeenCalled();
    expect(mockSetFormState).not.toHaveBeenCalled();
  });

  test('should handle null file selection', async () => {
    setup();
    const fileInput = screen.getByTestId('organisationImage');

    // Simulate a file input change event with no files
    fireEvent.change(fileInput, { target: { files: null } });

    expect(mockSetFormState).not.toHaveBeenCalled();
  });

  test('should handle empty file selection', async () => {
    setup();
    const fileInput = screen.getByTestId('organisationImage');

    // Simulate a file input change event with empty files array
    fireEvent.change(fileInput, { target: { files: [] } });

    expect(mockSetFormState).not.toHaveBeenCalled();
  });

  test('should show modal when showModal is true', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationModal
              showModal={true}
              toggleModal={mockToggleModal}
              formState={formState}
              setFormState={mockSetFormState}
              createOrg={mockCreateOrg}
              t={(key) => key}
              tCommon={(key) => key}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByTestId('modalOrganizationHeader')).toBeVisible();
  });

  test('should not show modal when showModal is false', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationModal
              showModal={false}
              toggleModal={mockToggleModal}
              formState={formState}
              setFormState={mockSetFormState}
              createOrg={mockCreateOrg}
              t={(key) => key}
              tCommon={(key) => key}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );

    expect(
      screen.queryByTestId('modalOrganizationHeader'),
    ).not.toBeInTheDocument();
  });

  test('should call toggleModal when close button is clicked', async () => {
    setup();
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);
    expect(mockToggleModal).toHaveBeenCalled();
  });
  test('should handle country selection change', async () => {
    setup();
    const countrySelect = screen.getByTestId('modalOrganizationCountryCode');

    await userEvent.selectOptions(countrySelect, 'us');

    expect(mockSetFormState).toHaveBeenCalledWith(
      expect.objectContaining({ countryCode: 'us' }),
    );
  });
  test('should validate all required fields on submit', async () => {
    const validFormState = {
      name: 'Test Organization',
      description: 'Test Description',
      addressLine1: '123 Test St',
      addressLine2: '',
      city: 'Test City',
      state: 'Test State',
      countryCode: 'us',
      postalCode: '12345',
      avatar: '',
    };

    render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationModal
              showModal={true}
              toggleModal={mockToggleModal}
              formState={validFormState}
              setFormState={mockSetFormState}
              createOrg={mockCreateOrg}
              t={(key) => key}
              tCommon={(key) => key}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );

    const form = screen.getByTestId('submitOrganizationForm').closest('form');
    expect(form).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('submitOrganizationForm'));
    expect(mockCreateOrg).toHaveBeenCalled();
  });

  test('should handle file size exceeding 5MB', async () => {
    setup();
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.png', {
      type: 'image/png',
    });
    const fileInput = screen.getByTestId(
      'organisationImage',
    ) as HTMLInputElement;

    await userEvent.upload(fileInput, largeFile);

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalledWith('fileTooLarge');
      expect(mockUploadFileToMinio).not.toHaveBeenCalled();
      expect(mockSetFormState).not.toHaveBeenCalled();
    });
  });

  test('should show success toast on successful upload', async () => {
    setup();
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('organisationImage');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(toastMocks.success).toHaveBeenCalledWith('imageUploadSuccess');
    });
    expect(mockSetFormState).toHaveBeenCalledWith(
      expect.objectContaining({ avatar: 'mocked-object-name' }),
    );
  });

  test('should show error toast on upload failure', async () => {
    mockUploadFileToMinio.mockRejectedValueOnce(new Error('Upload failed'));
    setup();
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('organisationImage');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalledWith('imageUploadError');
    });
    expect(mockSetFormState).not.toHaveBeenCalled();
  });
});
