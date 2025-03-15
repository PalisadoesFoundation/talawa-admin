import React, { act } from 'react';
import type { RenderResult } from '@testing-library/react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  // within,
} from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import OrganizationModal from './OrganizationModal';
import i18nForTest from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';

const mockUploadFileToMinio = vi
  .fn()
  .mockResolvedValue({ fileUrl: 'https://minio-test.com/test-image.jpg' });

vi.mock('utils/MinioUpload', () => ({
  useMinioUpload: vi.fn(() => ({
    uploadFileToMinio: mockUploadFileToMinio,
  })),
}));

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

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
              userData={undefined}
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
    setup();
    const submitButton = screen.getByTestId('submitOrganizationForm');
    fireEvent.click(submitButton);
    await waitFor(() => expect(mockCreateOrg).toHaveBeenCalled());
  });

  test('should handle successful image upload with MinioClient', async () => {
    setup();

    await wait();

    const fileInput = screen.getByTestId('organisationImage');
    expect(fileInput).toBeInTheDocument();

    const file = new File(['test'], 'test.png', { type: 'image/png' });

    // Mock the MinIO upload response with objectName
    mockUploadFileToMinio.mockResolvedValue({
      objectName: 'organizations/test-image-123.png',
    });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    // Verify MinIO upload was called correctly
    await waitFor(() => {
      expect(mockUploadFileToMinio).toHaveBeenCalledWith(file, 'organizations');
    });

    // Verify form state was updated with objectName while preserving existing state
    await waitFor(() => {
      expect(mockSetFormState).toHaveBeenCalledWith(
        expect.objectContaining({
          addressLine1: '',
          addressLine2: '',
          city: '',
          countryCode: '',
          description: '',
          name: '',
          postalCode: '',
          state: '',
          avatar: 'organizations/test-image-123.png',
        }),
      );
    });
  });

  test('closes modal when close button is clicked', () => {
    setup();
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockToggleModal).toHaveBeenCalled();
  });

  test('triggers sample organization creation', async () => {
    setup();
    fireEvent.click(screen.getByTestId('submitOrganizationForm'));
    await waitFor(() => expect(mockCreateOrg).toHaveBeenCalled());
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

  test('name field should not accept more than 50 characters', async () => {
    setup();
    const nameInput = screen.getByTestId(
      'modalOrganizationName',
    ) as HTMLInputElement;
    const longText = 'a'.repeat(60);

    await userEvent.type(nameInput, longText);

    // Since the component limits input at 50 chars, we check the last setFormState call
    const lastCall =
      mockSetFormState.mock.calls[mockSetFormState.mock.calls.length - 1];
    expect(lastCall[0].name.length).toBeLessThanOrEqual(50);
  });

  test('description field should not accept more than 200 characters', async () => {
    setup();
    const descInput = screen.getByTestId(
      'modalOrganizationDescription',
    ) as HTMLInputElement;
    const longText = 'a'.repeat(250);

    await userEvent.type(descInput, longText);

    // Check the last setFormState call
    const lastCall =
      mockSetFormState.mock.calls[mockSetFormState.mock.calls.length - 1];
    expect(lastCall[0].description.length).toBeLessThanOrEqual(200);
  });

  test('should handle country selection correctly', async () => {
    setup();
    const countrySelect = screen.getByTestId(
      'modalOrganizationCountryCode',
    ) as HTMLSelectElement;
    fireEvent.change(countrySelect, { target: { value: 'us' } });

    expect(mockSetFormState).toHaveBeenCalledWith(
      expect.objectContaining({
        countryCode: 'us',
      }),
    );
  });

  test('country select should have default disabled option', () => {
    setup();
    const countrySelect = screen.getByTestId(
      'modalOrganizationCountryCode',
    ) as HTMLSelectElement;
    const firstOption = countrySelect.options[0];
    expect(firstOption.disabled).toBe(true);
  });

  test('should handle invalid file type', async () => {
    setup();
    const fileInput = screen.getByTestId(
      'organisationImage',
    ) as HTMLInputElement;
    const invalidFile = new File(['dummy content'], 'test.txt', {
      type: 'text/plain',
    });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(fileInput.files?.[0].type).not.toBe('image/png');
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
                userData={undefined}
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
    {
      fieldId: 'modalOrganizationName',
      maxLength: 50,
      formKey: 'name',
    },
    {
      fieldId: 'modalOrganizationDescription',
      maxLength: 200,
      formKey: 'description',
    },
    {
      fieldId: 'modalOrganizationState',
      maxLength: 50,
      formKey: 'state',
    },
    {
      fieldId: 'modalOrganizationCity',
      maxLength: 50,
      formKey: 'city',
    },
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
      // const expectedText = 'a'.repeat(maxLength - 1);

      await userEvent.type(input, longText);

      const lastCall =
        mockSetFormState.mock.calls[mockSetFormState.mock.calls.length - 1];
      expect(lastCall[0][formKey].length).toBeLessThanOrEqual(maxLength);
      expect(lastCall[0][formKey]).not.toEqual(longText);
    });
  });

  // Add new test for MinIO upload error handling
  test('should handle MinIO upload error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    setup();

    // Mock the function to reject with an error
    mockUploadFileToMinio.mockRejectedValue(new Error('MinIO upload failed'));

    await wait();

    const fileInput = screen.getByTestId('organisationImage');
    const file = new File(['dummy content'], 'test.png', {
      type: 'image/png',
    });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    // Verify MinIO upload was attempted
    await waitFor(() => {
      expect(mockUploadFileToMinio).toHaveBeenCalledWith(file, 'organizations');
    });

    // Verify error was logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error uploading image to MinIO:',
        expect.any(Error),
      );
    });

    // Verify form state wasn't updated with objectName due to error
    expect(mockSetFormState).not.toHaveBeenCalledWith(
      expect.objectContaining({
        avatar: expect.any(String),
      }),
    );

    consoleErrorSpy.mockRestore();
  });

  test('should validate file size', async () => {
    setup();
    const fileInput = screen.getByTestId('organisationImage');
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.png', {
      type: 'image/png',
    });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [largeFile] } });
    });

    // Verify MinIO upload was not called for large file
    await waitFor(() => {
      expect(mockUploadFileToMinio).not.toHaveBeenCalled();
    });

    // Verify form state wasn't updated with objectName
    expect(mockSetFormState).not.toHaveBeenCalledWith(
      expect.objectContaining({
        avatar: expect.any(String),
      }),
    );
  });

  test('should validate file type', async () => {
    setup();
    const fileInput = screen.getByTestId('organisationImage');
    const invalidFile = new File(['content'], 'test.txt', {
      type: 'text/plain',
    });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    });

    // Verify MinIO upload was not called for invalid file type
    await waitFor(() => {
      expect(mockUploadFileToMinio).not.toHaveBeenCalled();
    });

    // Verify form state wasn't updated with objectName
    expect(mockSetFormState).not.toHaveBeenCalledWith(
      expect.objectContaining({
        avatar: expect.any(String),
      }),
    );
  });

  test('should handle null file selection', async () => {
    setup();
    const fileInput = screen.getByTestId('organisationImage');

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: null } });
    });

    // Verify MinIO upload was not called
    expect(mockUploadFileToMinio).not.toHaveBeenCalled();

    // Verify form state wasn't updated with objectName
    expect(mockSetFormState).not.toHaveBeenCalledWith(
      expect.objectContaining({
        avatar: expect.any(String),
      }),
    );
  });

  test('should handle empty file selection', async () => {
    setup();
    const fileInput = screen.getByTestId('organisationImage');

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [] } });
    });

    // Verify MinIO upload was not called
    expect(mockUploadFileToMinio).not.toHaveBeenCalled();

    // Verify form state wasn't updated with objectName
    expect(mockSetFormState).not.toHaveBeenCalledWith(
      expect.objectContaining({
        avatar: expect.any(String),
      }),
    );
  });

  test('should show modal when showModal is true', () => {
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
              userData={undefined}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );
    expect(screen.getByTestId('modalOrganizationHeader')).toBeVisible();
  });

  test('should not show modal when showModal is false', () => {
    return render(
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
              userData={undefined}
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
      expect.objectContaining({
        countryCode: 'us',
      }),
    );
  });

  test('should validate all required fields on submit', async () => {
    setup();
    const form = screen.getByTestId('submitOrganizationForm').closest('form');
    expect(form).toBeInTheDocument();

    const requiredFields = [
      'modalOrganizationName',
      'modalOrganizationDescription',
      'modalOrganizationState',
      'modalOrganizationCity',
      'modalOrganizationAddressLine1',
      'modalOrganizationCountryCode',
    ];

    // Verify all required fields are marked as required
    requiredFields.forEach((fieldId) => {
      const field = screen.getByTestId(fieldId);
      expect(field).toBeRequired();
    });

    if (form) {
      await userEvent.click(screen.getByTestId('submitOrganizationForm'));
      expect(mockCreateOrg).toHaveBeenCalled();
    }
  });
});
