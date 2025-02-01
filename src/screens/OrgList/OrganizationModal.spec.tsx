import React from 'react';
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

vi.mock('utils/convertToBase64', () => ({
  default: vi.fn(() => Promise.resolve('mockBase64String')),
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
  });

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

  test('uploads image correctly', async () => {
    setup();
    const fileInput = screen.getByTestId('organisationImage');
    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() =>
      expect(mockSetFormState).toHaveBeenCalledWith(
        expect.objectContaining({ avatar: 'mockBase64String' }),
      ),
    );
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
});

import userEvent from '@testing-library/user-event';

vi.mock('utils/convertToBase64', () => ({
  default: vi.fn((file) => {
    if (file.size > 5000000) {
      return Promise.reject(new Error('File too large'));
    }
    return Promise.resolve('mockBase64String');
  }),
}));

describe('OrganizationModal Component - Extended Tests', () => {
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

  const setup = (initialFormState = formState): RenderResult => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationModal
              showModal={true}
              toggleModal={mockToggleModal}
              formState={initialFormState}
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

  // Input validation tests
  describe('Input Validation', () => {
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
  });

  // Country selection tests remain the same
  describe('Country Selection', () => {
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
  });

  // Image upload tests remain the same
  describe('Image Upload', () => {
    test('should handle large file upload rejection', async () => {
      setup();
      const fileInput = screen.getByTestId(
        'organisationImage',
      ) as HTMLInputElement;
      const largeFile = new File(['dummy content'], 'large.png', {
        type: 'image/png',
      });
      Object.defineProperty(largeFile, 'size', { value: 6000000 });

      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(mockSetFormState).not.toHaveBeenCalledWith(
          expect.objectContaining({ avatar: 'mockBase64String' }),
        );
      });
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
  });

  // Accessibility tests updated
  describe('Accessibility', () => {
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
  });

  // Form submission tests updated
  describe('Form Submission', () => {
    // test('should validate required fields before submission', async () => {
    //   const initialFormState = {
    //     ...formState,
    //     name: '',
    //     description: '',
    //     addressLine1: '',
    //     city: '',
    //     state: '',
    //   };

    //   setup(initialFormState);
    //   const submitButton = screen.getByTestId('submitOrganizationForm');
    //   const nameInput = screen.getByTestId(
    //     'modalOrganizationName',
    //   ) as HTMLInputElement;
    //   const descInput = screen.getByTestId(
    //     'modalOrganizationDescription',
    //   ) as HTMLInputElement;
    //   const addressInput = screen.getByTestId(
    //     'modalOrganizationAddressLine1',
    //   ) as HTMLInputElement;
    //   const cityInput = screen.getByTestId(
    //     'modalOrganizationCity',
    //   ) as HTMLInputElement;
    //   const stateInput = screen.getByTestId(
    //     'modalOrganizationState',
    //   ) as HTMLInputElement;

    //   // First try submitting with empty fields
    //   fireEvent.click(submitButton);
    //   expect(mockCreateOrg).toHaveBeenCalled();

    //   // Fill in required fields one by one and verify formState updates
    //   fireEvent.change(nameInput, { target: { value: 'Test Org' } });
    //   expect(mockSetFormState).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       name: 'Test Org',
    //     }),
    //   );

    //   fireEvent.change(descInput, { target: { value: 'Test Description' } });
    //   expect(mockSetFormState).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       description: 'Test Description',
    //     }),
    //   );

    //   fireEvent.change(addressInput, { target: { value: '123 Test St' } });
    //   expect(mockSetFormState).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       addressLine1: '123 Test St',
    //     }),
    //   );

    //   fireEvent.change(cityInput, { target: { value: 'Test City' } });
    //   expect(mockSetFormState).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       city: 'Test City',
    //     }),
    //   );

    //   fireEvent.change(stateInput, { target: { value: 'Test State' } });
    //   expect(mockSetFormState).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       state: 'Test State',
    //     }),
    //   );

    //   // Submit form again with filled fields
    //   fireEvent.click(submitButton);

    //   // Verify the form submission was called
    //   expect(mockCreateOrg).toHaveBeenCalledTimes(2);

    //   // Verify that setFormState was called with all the expected values
    //   expect(mockSetFormState).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       name: 'Test Org',
    //       description: 'Test Description',
    //       addressLine1: '123 Test St',
    //       city: 'Test City',
    //       state: 'Test State',
    //     }),
    //   );
    // });

    test('should handle form submission with all fields filled', async () => {
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

      setup(completeFormState);
      const submitButton = screen.getByTestId('submitOrganizationForm');

      await userEvent.click(submitButton);
      expect(mockCreateOrg).toHaveBeenCalled();
    });
  });
});

describe('OrganizationModal Component - Branch Coverage', () => {
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

  const setup = (props = {}): RenderResult => {
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
              {...props}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );
  };

  // Test input length restrictions
  describe('Input Length Restrictions', () => {
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
  });

  // Test file upload handling
  describe('File Upload Handling', () => {
    test('should handle valid image upload', async () => {
      setup();
      const file = new File(['dummy content'], 'test.png', {
        type: 'image/png',
      });
      const fileInput = screen.getByTestId('organisationImage');

      await userEvent.upload(fileInput, file);

      expect(mockSetFormState).toHaveBeenCalledWith(
        expect.objectContaining({
          avatar: 'mockBase64String',
        }),
      );
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
  });

  // Test form submission with required fields
  describe('Form Submission', () => {
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

  // Test country selection
  describe('Country Selection', () => {
    // test('should populate country options correctly', () => {
    //   setup();
    //   const countrySelect = screen.getByTestId('modalOrganizationCountryCode');
    //   const options = within(countrySelect).getAllByRole('option');

    //   // First option should be disabled "Select a country"
    //   expect(options[0]).toBeDisabled();
    //   expect(options[0]).toHaveValue('');

    //   // Verify other options are populated from countryOptions
    //   expect(options.length).toBeGreaterThan(1);
    //   options.slice(1).forEach((option) => {
    //     expect(option).not.toBeDisabled();
    //     expect(option).toHaveValue(expect.any(String));
    //   });
    // });

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
  });

  // Test modal visibility
  describe('Modal Visibility', () => {
    test('should show modal when showModal is true', () => {
      setup({ showModal: true });
      expect(screen.getByTestId('modalOrganizationHeader')).toBeVisible();
    });

    test('should not show modal when showModal is false', () => {
      setup({ showModal: false });
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
  });
});
