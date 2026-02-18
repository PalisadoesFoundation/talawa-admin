import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { FormCheckField } from './FormCheckField';
import '@testing-library/jest-dom';

describe('FormCheckField', () => {
  const defaultProps = {
    name: 'test-check',
    label: 'Test Label',
    onChange: vi.fn(),
  };

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(<I18nextProvider i18n={i18nForTest}>{ui}</I18nextProvider>);
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders a checkbox by default', () => {
    renderWithProviders(<FormCheckField {...defaultProps} />);
    const checkbox = screen.getByLabelText('Test Label');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  it('renders a radio button when type is radio', () => {
    renderWithProviders(<FormCheckField {...defaultProps} type="radio" />);
    const radio = screen.getByLabelText('Test Label');
    expect(radio).toBeInTheDocument();
    expect(radio).toHaveAttribute('type', 'radio');
  });

  it('renders a switch when type is switch', () => {
    // Note: Form.Check type="switch" renders a checkbox input with a specific class
    renderWithProviders(<FormCheckField {...defaultProps} type="switch" />);
    const switchInput = screen.getByLabelText('Test Label');
    expect(switchInput).toBeInTheDocument();
    expect(switchInput).toHaveAttribute('type', 'checkbox');
    // Bootstrap adds a class for switch, but exact class depends on version/implementation
    // We mainly check it renders an input
  });

  it('handles checked state', () => {
    renderWithProviders(<FormCheckField {...defaultProps} checked={true} />);
    const checkbox = screen.getByLabelText('Test Label');
    expect(checkbox).toBeChecked();
  });

  it('calls onChange handler when clicked', async () => {
    const handleChange = vi.fn();
    renderWithProviders(
      <FormCheckField {...defaultProps} onChange={handleChange} />,
    );
    const checkbox = screen.getByLabelText('Test Label');
    await userEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('forwards disabled prop', () => {
    renderWithProviders(<FormCheckField {...defaultProps} disabled={true} />);
    const checkbox = screen.getByLabelText('Test Label');
    expect(checkbox).toBeDisabled();
  });

  it('renders inline when inline prop is true', () => {
    const { container } = renderWithProviders(
      <FormCheckField {...defaultProps} inline={true} />,
    );
    // When inline is true, it renders Form.Check directly, not wrapped in FormFieldGroup
    // Form.Check inline usually adds a class 'form-check-inline'
    expect(container.firstChild).toHaveClass('form-check-inline');
  });

  it('applies custom className', () => {
    renderWithProviders(
      <FormCheckField {...defaultProps} className="custom-class" />,
    );
    // The class should be on the outer wrapper or the check component depending on implementation
    // Since FormCheckField wraps in FormFieldGroup by default, let's check if the class is applied
    // The Form.Check itself or the group might receive it.
    // In current implementation: Form.Check receives className.
    // Start by finding the input's common ancestor that might have the class
    // Or simpler: verify if the class exists in the rendered output
    const checkElement = screen
      .getByLabelText('Test Label')
      .closest('.form-check');
    expect(checkElement).toHaveClass('custom-class');
  });

  it('renders with validation error', () => {
    renderWithProviders(
      <FormCheckField
        {...defaultProps}
        touched={true}
        error="This field is required"
      />,
    );
    const checkbox = screen.getByLabelText('Test Label');
    expect(checkbox).toHaveClass('is-invalid');
    // FormFieldGroup should render the error message
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('forwards data-testid', () => {
    renderWithProviders(
      <FormCheckField {...defaultProps} data-testid="test-checkbox" />,
    );
    expect(screen.getByTestId('test-checkbox')).toBeInTheDocument();
  });
});
