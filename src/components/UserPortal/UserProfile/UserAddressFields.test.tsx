import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserAddressFields } from './UserAddressFields';
import { countryOptions } from 'utils/formEnumFields';

describe('UserAddressFields', () => {
  const mockProps = {
    tCommon: (key: string) => `translated_${key}`,
    t: (key: string) => `translated_${key}`,
    handleFieldChange: jest.fn(),
    userDetails: {
      address: '123 Test Street',
      state: 'Test State',
      country: 'US',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form fields correctly', () => {
    render(<UserAddressFields {...mockProps} />);

    expect(screen.getByTestId('inputAddress')).toBeInTheDocument();
    expect(screen.getByTestId('inputState')).toBeInTheDocument();
    expect(screen.getByTestId('inputCountry')).toBeInTheDocument();
  });

  test('displays correct labels with translations', () => {
    render(<UserAddressFields {...mockProps} />);

    expect(screen.getByText('translated_address')).toBeInTheDocument();
    expect(screen.getByText('translated_state')).toBeInTheDocument();
    expect(screen.getByText('translated_country')).toBeInTheDocument();
  });

  test('handles address input change', () => {
    render(<UserAddressFields {...mockProps} />);

    const addressInput = screen.getByTestId('inputAddress');
    fireEvent.change(addressInput, { target: { value: 'New Address' } });

    expect(mockProps.handleFieldChange).toHaveBeenCalledWith(
      'address',
      'New Address',
    );
  });

  test('handles state input change', () => {
    render(<UserAddressFields {...mockProps} />);

    const stateInput = screen.getByTestId('inputState');
    fireEvent.change(stateInput, { target: { value: 'New State' } });

    expect(mockProps.handleFieldChange).toHaveBeenCalledWith(
      'state',
      'New State',
    );
  });

  test('handles country selection change', () => {
    render(<UserAddressFields {...mockProps} />);

    const countrySelect = screen.getByTestId('inputCountry');
    fireEvent.change(countrySelect, { target: { value: 'CA' } });

    expect(mockProps.handleFieldChange).toHaveBeenCalledWith('country', 'CA');
  });

  test('renders all country options', () => {
    render(<UserAddressFields {...mockProps} />);

    const countrySelect = screen.getByTestId('inputCountry');
    const options = countrySelect.getElementsByTagName('option');

    expect(options.length).toBe(countryOptions.length + 1); // +1 for disabled option
  });

  test('displays initial values correctly', () => {
    render(<UserAddressFields {...mockProps} />);

    expect(screen.getByTestId('inputAddress')).toHaveValue('123 Test Street');
    expect(screen.getByTestId('inputState')).toHaveValue('Test State');
    expect(screen.getByTestId('inputCountry')).toHaveValue('US');
  });
});
