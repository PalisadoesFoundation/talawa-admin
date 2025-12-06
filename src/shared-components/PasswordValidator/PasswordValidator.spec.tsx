import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import PasswordValidator from './PasswordValidator';

describe('PasswordValidator Component', () => {
  const defaultProps = {
    password: '',
    isInputFocused: false,
    validation: {
      lowercaseChar: true,
      uppercaseChar: true,
      numericValue: true,
      specialChar: true,
    },
  };

  const renderComponent = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18nForTest}>
        <PasswordValidator {...defaultProps} {...props} />
      </I18nextProvider>,
    );
  };

  it('should not display validation when password is short but input is not focused', () => {
    renderComponent({ isInputFocused: false, password: 'abc' });
    expect(screen.queryByTestId('passwordCheck')).not.toBeInTheDocument();
  });

  it('should not display validation when input is not focused', () => {
    renderComponent();
    expect(screen.queryByText(/atleast_6_char_long/i)).not.toBeInTheDocument();
  });

  it('should display length validation when focused', () => {
    renderComponent({ isInputFocused: true, password: 'abc' });
    expect(screen.getByTestId('passwordCheck')).toBeInTheDocument();
  });

  it('should show all validations when focused', () => {
    renderComponent({ isInputFocused: true, password: 'Test@123' });
    expect(screen.getByText(/lowercase_check/i)).toBeInTheDocument();
    expect(screen.getByText(/uppercase_check/i)).toBeInTheDocument();
    expect(screen.getByText(/numeric_value_check/i)).toBeInTheDocument();
    expect(screen.getByText(/special_char_check/i)).toBeInTheDocument();
  });
});
