import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserAddressFields } from './UserAddressFields';
import { countryOptions } from 'utils/formEnumFields';
import { vi } from 'vitest';

/**
 * Unit tests for UserAddressFields component:
 *
 * 1. **Rendering form fields**: Ensures address, state, and country fields are rendered.
 * 2. **Displaying translated labels**: Verifies correct translations for labels.
 * 3. **Handling input changes**: Tests if `handleFieldChange` is called with correct values for address, state, and country.
 * 4. **Rendering country options**: Checks if all country options are displayed.
 * 5. **Displaying initial values**: Ensures initial values (address, state, country) are correctly shown.
 *
 * `fireEvent` simulates user actions, and `vi.fn()` mocks callback functions.
 */

describe('UserAddressFields', () => {
  const mockProps = {
    t: (key: string) => `translated_${key}`,
    handleFieldChange: vi.fn(),
    userDetails: {
      addressLine1: '123 Test Street',
      addressLine2: 'Apt 4',
      state: 'Test State',
      countryCode: 'US',
      city: 'Test City',
      postalCode: '12345',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<UserAddressFields {...mockProps} />);

    expect(screen.getByTestId('inputAddress1')).toBeInTheDocument();
    expect(screen.getByTestId('inputAddress2')).toBeInTheDocument();
    expect(screen.getByTestId('inputState')).toBeInTheDocument();
    expect(screen.getByTestId('inputCountry')).toBeInTheDocument();
  });

  it('displays correct labels with translations', () => {
    render(<UserAddressFields {...mockProps} />);

    expect(screen.getByText('translated_state')).toBeInTheDocument();
    expect(screen.getByText('translated_country')).toBeInTheDocument();
  });

  it('handles address input change', () => {
    render(<UserAddressFields {...mockProps} />);

    const addressInput1 = screen.getByTestId('inputAddress1');
    fireEvent.change(addressInput1, { target: { value: 'New Address' } });

    expect(mockProps.handleFieldChange).toHaveBeenCalledWith(
      'addressLine1',
      'New Address',
    );

    const addressInput2 = screen.getByTestId('inputAddress2');
    fireEvent.change(addressInput2, { target: { value: 'New Address' } });

    expect(mockProps.handleFieldChange).toHaveBeenCalledWith(
      'addressLine2',
      'New Address',
    );
  });

  it('handles state input change', () => {
    render(<UserAddressFields {...mockProps} />);

    const stateInput = screen.getByTestId('inputState');
    fireEvent.change(stateInput, { target: { value: 'New State' } });

    expect(mockProps.handleFieldChange).toHaveBeenCalledWith(
      'state',
      'New State',
    );
  });

  it('handles country selection change', () => {
    render(<UserAddressFields {...mockProps} />);

    const countrySelect = screen.getByTestId('inputCountry');
    fireEvent.change(countrySelect, { target: { value: 'ca' } });

    expect(mockProps.handleFieldChange).toHaveBeenCalledWith(
      'countryCode',
      'ca',
    );
  });

  it('renders all country options', () => {
    render(<UserAddressFields {...mockProps} />);

    const countrySelect = screen.getByTestId('inputCountry');
    const options = countrySelect.getElementsByTagName('option');

    expect(options.length).toBe(countryOptions.length + 1); // +1 for disabled option
  });

  it('displays initial values correctly', () => {
    render(<UserAddressFields {...mockProps} />);

    expect(screen.getByTestId('inputAddress1')).toHaveValue('123 Test Street');
    expect(screen.getByTestId('inputAddress2')).toHaveValue('Apt 4');
    expect(screen.getByTestId('inputState')).toHaveValue('Test State');
    expect(screen.getByTestId('inputCountry')).toHaveValue('af');
  });
});
