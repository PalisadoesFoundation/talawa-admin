import React from 'react';
import { render, screen } from '@testing-library/react';
import PasswordValidator from './PasswordValidator';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';

describe('PasswordValidator Component', () => {
  const renderComponent = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18nForTest}>
        <PasswordValidator
          password=""
          isInputFocused={false}
          validation={{
            lowercaseChar: false,
            uppercaseChar: false,
            numericValue: false,
            specialChar: false,
          }}
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
    renderComponent({
      isInputFocused: true,
      password: 'abc',
      validation: {
        lowercaseChar: true,
        uppercaseChar: false,
        numericValue: false,
        specialChar: false,
      },
    });
    expect(screen.getByTestId('passwordCheck')).toBeInTheDocument();
    expect(screen.getAllByTestId('validation-item')).toHaveLength(4);
  });

  it('should display validation when password has value even if not focused', () => {
    renderComponent({
      isInputFocused: false,
      password: 'abc',
      validation: {
        lowercaseChar: true,
        uppercaseChar: false,
        numericValue: false,
        specialChar: false,
      },
    });
    expect(screen.getByTestId('passwordCheck')).toBeInTheDocument();
  });

  it('should show all validations when focused', () => {
    renderComponent({
      isInputFocused: true,
      password: 'Test@123',
      validation: {
        lowercaseChar: true,
        uppercaseChar: true,
        numericValue: true,
        specialChar: true,
      },
    });

    const validationItems = screen.getAllByTestId('validation-item');
    expect(validationItems.length).toBeGreaterThan(0);

    expect(
      screen.getByText(/At least one lowercase letter/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/At least one uppercase letter/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/At least one numeric value/i)).toBeInTheDocument();
    expect(
      screen.getByText(/At least one special character/i),
    ).toBeInTheDocument();
  });

  it('should reflect different validation states', () => {
    const { rerender } = renderComponent({
      isInputFocused: true,
      password: 'abc',
      validation: {
        lowercaseChar: true,
        uppercaseChar: false,
        numericValue: false,
        specialChar: false,
      },
    });

    expect(screen.getAllByTestId('validation-item')).toHaveLength(4);

    rerender(
      <I18nextProvider i18n={i18nForTest}>
        <PasswordValidator
          password="Abc@123456"
          isInputFocused={true}
          validation={{
            lowercaseChar: true,
            uppercaseChar: true,
            numericValue: true,
            specialChar: true,
          }}
        />
      </I18nextProvider>,
    );

    expect(screen.getAllByTestId('validation-item')).toHaveLength(4);
  });
});
