import React from 'react';
import { render, screen } from '@testing-library/react';
import PasswordValidator from './PasswordValidator';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';

const mockValidationData = {
  lowercaseChar: false,
  uppercaseChar: false,
  numericValue: false,
  specialChar: false,
  lengthChar: false,
};

describe('PasswordValidator Component', () => {
  const renderComponent = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18nForTest}>
        <PasswordValidator
          password=""
          isInputFocused={false}
          validation={mockValidationData}
          {...props}
        />
      </I18nextProvider>,
    );
  };

  it('should not display validator when password is empty and input is not focused', () => {
    renderComponent({ isInputFocused: false, password: '' });
    expect(screen.queryByTestId('passwordCheck')).not.toBeInTheDocument();
    expect(screen.queryByTestId('validation-item')).not.toBeInTheDocument();
  });

  it('should display validation when input is focused', () => {
    renderComponent({ isInputFocused: true, password: 'abc' });
    expect(screen.getByTestId('passwordValidator')).toBeInTheDocument();
  });

  it('should display validation when password has value even if not focused', () => {
    renderComponent({ isInputFocused: false, password: 'abc' });
    expect(screen.getByTestId('passwordCheck')).toBeInTheDocument();
  });

  it('should show all validations when focused', () => {
    renderComponent({ isInputFocused: true, password: 'Test@123' });

    const validationItems = screen.getAllByTestId('validation-item');
    expect(validationItems.length).toBeGreaterThan(0);

    expect(
      screen.getByText(/Atleast one lowercase letter/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Atleast one uppercase letter/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Atleaset one numeric value/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Atleast one special character/i),
    ).toBeInTheDocument();
  });
});
