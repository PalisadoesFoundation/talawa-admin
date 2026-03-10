import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import ContactInfoCard from './ContactInfoCard';
import { vi, describe, it, expect, beforeEach } from 'vitest';

/**
 * Tests for the ContactInfoCard component.
 *
 * Covers rendering of all field types (email, phone, address, country),
 * callback invocations, empty/null state handling, and placeholder logic.
 */

const defaultFormState: Record<string, string | null> = {
  mobilePhoneNumber: '+1234567890',
  workPhoneNumber: '+0987654321',
  homePhoneNumber: '+1112223333',
  addressLine1: '123 Main St',
  addressLine2: 'Apt 4',
  postalCode: '12345',
  city: 'TestCity',
  state: 'TestState',
  countryCode: 'us',
};

const renderComponent = (
  overrides: Partial<{
    formState: Record<string, string | null>;
    emailAddress: string;
    handleFieldChange: (fieldName: string, value: string) => void;
  }> = {},
) => {
  const handleFieldChange = vi.fn();
  const props = {
    formState: defaultFormState,
    emailAddress: 'test@example.com',
    handleFieldChange,
    ...overrides,
  };

  const result = render(
    <I18nextProvider i18n={i18nForTest}>
      <ContactInfoCard {...props} />
    </I18nextProvider>,
  );
  return { ...result, handleFieldChange: props.handleFieldChange };
};

describe('ContactInfoCard', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('Rendering', () => {
    it('renders the contact info heading', () => {
      renderComponent();
      expect(screen.getByText(/contact/i)).toBeInTheDocument();
    });

    it('renders the email field as disabled', () => {
      renderComponent();
      const emailInput = screen.getByTestId('inputEmail');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toBeDisabled();
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('renders all phone number fields', () => {
      renderComponent();
      expect(screen.getByTestId('inputMobilePhoneNumber')).toBeInTheDocument();
      expect(screen.getByTestId('inputWorkPhoneNumber')).toBeInTheDocument();
      expect(screen.getByTestId('inputHomePhoneNumber')).toBeInTheDocument();
    });

    it('renders phone fields with correct values', () => {
      renderComponent();
      expect(screen.getByTestId('inputMobilePhoneNumber')).toHaveValue(
        '+1234567890',
      );
      expect(screen.getByTestId('inputWorkPhoneNumber')).toHaveValue(
        '+0987654321',
      );
      expect(screen.getByTestId('inputHomePhoneNumber')).toHaveValue(
        '+1112223333',
      );
    });

    it('renders all address fields', () => {
      renderComponent();
      expect(screen.getByTestId('inputAddressLine1')).toBeInTheDocument();
      expect(screen.getByTestId('inputAddressLine2')).toBeInTheDocument();
      expect(screen.getByTestId('inputPostalCode')).toBeInTheDocument();
      expect(screen.getByTestId('inputCity')).toBeInTheDocument();
      expect(screen.getByTestId('inputState')).toBeInTheDocument();
    });

    it('renders address fields with correct values', () => {
      renderComponent();
      expect(screen.getByTestId('inputAddressLine1')).toHaveValue(
        '123 Main St',
      );
      expect(screen.getByTestId('inputAddressLine2')).toHaveValue('Apt 4');
      expect(screen.getByTestId('inputPostalCode')).toHaveValue('12345');
      expect(screen.getByTestId('inputCity')).toHaveValue('TestCity');
      expect(screen.getByTestId('inputState')).toHaveValue('TestState');
    });

    it('renders the country select dropdown', () => {
      renderComponent();
      const countrySelect = screen.getByTestId('inputCountry');
      expect(countrySelect).toBeInTheDocument();
      expect(countrySelect).toHaveValue('us');
    });

    it('renders country options sorted alphabetically', () => {
      renderComponent();
      const countrySelect = screen.getByTestId('inputCountry');
      const options = Array.from(countrySelect.querySelectorAll('option'));
      // First option is the disabled placeholder
      expect(options[0]).toBeDisabled();
      // Remaining options should be sorted alphabetically by label
      const labels = options.slice(1).map((o) => o.textContent);
      const sorted = [...labels].sort((a, b) =>
        (a ?? '').localeCompare(b ?? ''),
      );
      expect(labels).toEqual(sorted);
    });
  });

  describe('Empty and null state handling', () => {
    it('renders empty string when form field is null', () => {
      const emptyFormState: Record<string, string | null> = {
        mobilePhoneNumber: null,
        workPhoneNumber: null,
        homePhoneNumber: null,
        addressLine1: null,
        addressLine2: null,
        postalCode: null,
        city: null,
        state: null,
        countryCode: '',
      };
      renderComponent({ formState: emptyFormState });
      expect(screen.getByTestId('inputMobilePhoneNumber')).toHaveValue('');
      expect(screen.getByTestId('inputAddressLine1')).toHaveValue('');
      expect(screen.getByTestId('inputCity')).toHaveValue('');
    });

    it('renders empty string when emailAddress is undefined', () => {
      renderComponent({ emailAddress: undefined });
      const emailInput = screen.getByTestId('inputEmail');
      expect(emailInput).toHaveValue('');
    });
  });

  describe('Callbacks', () => {
    it('calls handleFieldChange when phone field changes', async () => {
      const handleFieldChange = vi.fn();
      renderComponent({ handleFieldChange });

      const mobileInput = screen.getByTestId('inputMobilePhoneNumber');
      await user.clear(mobileInput);
      await user.type(mobileInput, '+5555555555');
      await waitFor(() => {
        expect(handleFieldChange).toHaveBeenCalledWith(
          'mobilePhoneNumber',
          expect.any(String),
        );
      });
    });

    it('calls handleFieldChange when address field changes', async () => {
      const handleFieldChange = vi.fn();
      renderComponent({ handleFieldChange });

      const addressInput = screen.getByTestId('inputAddressLine1');
      await user.clear(addressInput);
      await user.type(addressInput, '456 Oak Ave');
      await waitFor(() => {
        expect(handleFieldChange).toHaveBeenCalledWith(
          'addressLine1',
          expect.any(String),
        );
      });
    });

    it('calls handleFieldChange when city field changes', async () => {
      const handleFieldChange = vi.fn();
      renderComponent({ handleFieldChange });

      const cityInput = screen.getByTestId('inputCity');
      await user.clear(cityInput);
      await user.type(cityInput, 'NewCity');
      await waitFor(() => {
        expect(handleFieldChange).toHaveBeenCalledWith(
          'city',
          expect.any(String),
        );
      });
    });

    it('calls handleFieldChange when postal code field changes', async () => {
      const handleFieldChange = vi.fn();
      renderComponent({ handleFieldChange });

      const postalInput = screen.getByTestId('inputPostalCode');
      await user.clear(postalInput);
      await user.type(postalInput, '99999');
      await waitFor(() => {
        expect(handleFieldChange).toHaveBeenCalledWith(
          'postalCode',
          expect.any(String),
        );
      });
    });

    it('calls handleFieldChange when country changes', async () => {
      const handleFieldChange = vi.fn();
      renderComponent({ handleFieldChange });

      const countrySelect = screen.getByTestId('inputCountry');
      await user.selectOptions(countrySelect, 'gb');
      await waitFor(() => {
        expect(handleFieldChange).toHaveBeenCalledWith('countryCode', 'gb');
      });
    });

    it('calls handleFieldChange for work phone changes', async () => {
      const handleFieldChange = vi.fn();
      renderComponent({ handleFieldChange });

      const workInput = screen.getByTestId('inputWorkPhoneNumber');
      await user.clear(workInput);
      await user.type(workInput, '+7777777777');
      await waitFor(() => {
        expect(handleFieldChange).toHaveBeenCalledWith(
          'workPhoneNumber',
          expect.any(String),
        );
      });
    });

    it('calls handleFieldChange for home phone changes', async () => {
      const handleFieldChange = vi.fn();
      renderComponent({ handleFieldChange });

      const homeInput = screen.getByTestId('inputHomePhoneNumber');
      await user.clear(homeInput);
      await user.type(homeInput, '+8888888888');
      await waitFor(() => {
        expect(handleFieldChange).toHaveBeenCalledWith(
          'homePhoneNumber',
          expect.any(String),
        );
      });
    });

    it('calls handleFieldChange for addressLine2 changes', async () => {
      const handleFieldChange = vi.fn();
      renderComponent({ handleFieldChange });

      const addr2Input = screen.getByTestId('inputAddressLine2');
      await user.clear(addr2Input);
      await user.type(addr2Input, 'Suite 100');
      await waitFor(() => {
        expect(handleFieldChange).toHaveBeenCalledWith(
          'addressLine2',
          expect.any(String),
        );
      });
    });

    it('calls handleFieldChange for state field changes', async () => {
      const handleFieldChange = vi.fn();
      renderComponent({ handleFieldChange });

      const stateInput = screen.getByTestId('inputState');
      await user.clear(stateInput);
      await user.type(stateInput, 'NewState');
      await waitFor(() => {
        expect(handleFieldChange).toHaveBeenCalledWith(
          'state',
          expect.any(String),
        );
      });
    });
  });

  describe('Placeholder logic', () => {
    it('shows postal code placeholder for postalCode field', () => {
      renderComponent();
      const postalInput = screen.getByTestId('inputPostalCode');
      expect(postalInput).toHaveAttribute('placeholder');
    });

    it('shows city placeholder for city field', () => {
      renderComponent();
      const cityInput = screen.getByTestId('inputCity');
      expect(cityInput).toHaveAttribute('placeholder');
    });

    it('shows address lane placeholder for address fields', () => {
      renderComponent();
      const addr1Input = screen.getByTestId('inputAddressLine1');
      expect(addr1Input).toHaveAttribute('placeholder');
    });
  });
});
