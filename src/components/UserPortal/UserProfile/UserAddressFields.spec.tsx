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
    tCommon: (key: string) => `translated_${key}`,
    t: (key: string) => `translated_${key}`,
    handleFieldChange: vi.fn(),
    userDetails: {
      address: '123 Test Street',
      state: 'Test State',
      country: 'US',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<UserAddressFields {...mockProps} />);

    expect(screen.getByTestId('inputAddress')).toBeInTheDocument();
    expect(screen.getByTestId('inputState')).toBeInTheDocument();
    expect(screen.getByTestId('inputCountry')).toBeInTheDocument();
  });

  it('displays correct labels with translations', () => {
    render(<UserAddressFields {...mockProps} />);

    expect(screen.getByText('translated_address')).toBeInTheDocument();
    expect(screen.getByText('translated_state')).toBeInTheDocument();
    expect(screen.getByText('translated_country')).toBeInTheDocument();
  });

  it('handles address input change', () => {
    render(<UserAddressFields {...mockProps} />);

    const addressInput = screen.getByTestId('inputAddress');
    fireEvent.change(addressInput, { target: { value: 'New Address' } });

    expect(mockProps.handleFieldChange).toHaveBeenCalledWith(
      'address',
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
    fireEvent.change(countrySelect, { target: { value: 'CA' } });

    expect(mockProps.handleFieldChange).toHaveBeenCalledWith('country', 'CA');
  });

  it('renders all country options', () => {
    render(<UserAddressFields {...mockProps} />);

    const countrySelect = screen.getByTestId('inputCountry');
    const options = countrySelect.getElementsByTagName('option');

    expect(options.length).toBe(countryOptions.length + 1); // +1 for disabled option
  });

  it('displays initial values correctly', () => {
    render(<UserAddressFields {...mockProps} />);

    expect(screen.getByTestId('inputAddress')).toHaveValue('123 Test Street');
    expect(screen.getByTestId('inputState')).toHaveValue('Test State');
    expect(screen.getByTestId('inputCountry')).toHaveValue('US');
  });
});
