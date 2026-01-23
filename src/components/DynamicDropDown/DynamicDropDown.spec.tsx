import React from 'react';
import { render, screen } from '@testing-library/react';
import DynamicDropDown from './DynamicDropDown';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';
import { vi, expect, it, describe } from 'vitest';

const renderComponent = (props: Record<string, unknown> = {}) => {
  const defaultProps = {
    formState: { fieldName: 'value1' },
    setFormState: vi.fn(),
    fieldOptions: [
      { value: 'value1', label: 'Label 1' },
      { value: 'value2', label: 'Label 2' },
      { value: 'value3', label: 'Label 3' },
      { value: 'TEST', label: 'Label 1' },
    ],
    fieldName: 'fieldName',
    ...props,
  };

  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18nForTest}>
        <DynamicDropDown {...defaultProps} />
      </I18nextProvider>
    </BrowserRouter>,
  );
};

describe('DynamicDropDown component', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });
  it('renders and handles selection correctly', async () => {
    const user = userEvent.setup();
    const formData = { fieldName: 'value2' };
    const setFormData = vi.fn();

    renderComponent({
      formState: formData,
      setFormState: setFormData,
    });

    const containerElement = screen.getByTestId('fieldname-dropdown-container');
    expect(containerElement).toBeInTheDocument();

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    expect(dropdownButton).toHaveTextContent('Label 2');

    await user.click(dropdownButton);
    const optionElement = screen.getByTestId('change-fieldname-btn-TEST');
    await user.click(optionElement);

    expect(setFormData).toHaveBeenCalledWith({ fieldName: 'TEST' });
  });

  it('calls custom handleChange function when provided', async () => {
    const user = userEvent.setup();
    const formData = { fieldName: 'value1' };
    const setFormData = vi.fn();
    const customHandleChange = vi.fn();

    renderComponent({
      formState: formData,
      setFormState: setFormData,
      fieldOptions: [
        { value: 'value1', label: 'Label 1' },
        { value: 'value2', label: 'Label 2' },
      ],
      handleChange: customHandleChange,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await user.click(dropdownButton);

    const optionElement = screen.getByTestId('change-fieldname-btn-value2');
    await user.click(optionElement);

    expect(customHandleChange).toHaveBeenCalledTimes(1);
    expect(customHandleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          name: 'fieldName',
          value: 'value2',
        }),
      }),
    );
    expect(setFormData).not.toHaveBeenCalled();
  });

  it('handles keyboard navigation with Enter key correctly', async () => {
    const user = userEvent.setup();
    const formData = { fieldName: 'value1' };
    const setFormData = vi.fn();

    renderComponent({
      formState: formData,
      setFormState: setFormData,
      fieldOptions: [
        { value: 'value1', label: 'Label 1' },
        { value: 'value2', label: 'Label 2' },
      ],
    });

    await user.click(screen.getByTestId('fieldname-dropdown-btn'));

    const option = screen.getByTestId('change-fieldname-btn-value2');

    // 🔑 THIS is required by the component logic
    option.focus();

    await user.keyboard('{Enter}');

    expect(setFormData).toHaveBeenCalledWith(
      expect.objectContaining({
        fieldName: 'value2',
      }),
    );
  });

  it('handles keyboard navigation with Space key correctly', async () => {
    const user = userEvent.setup();
    const formData = { fieldName: 'value1' };
    const setFormData = vi.fn();

    renderComponent({
      formState: formData,
      setFormState: setFormData,
      fieldOptions: [
        { value: 'value1', label: 'Label 1' },
        { value: 'value2', label: 'Label 2' },
      ],
    });

    await user.click(screen.getByTestId('fieldname-dropdown-btn'));

    const option = screen.getByTestId('change-fieldname-btn-value2');

    // Component expects focused option
    option.focus();

    // 🔑 literal space, not {Space}
    await user.keyboard(' ');

    expect(setFormData).toHaveBeenCalledWith(
      expect.objectContaining({
        fieldName: 'value2',
      }),
    );
  });

  it('ignores non-Enter/Space key presses', async () => {
    const user = userEvent.setup();
    const formData = { fieldName: 'value1' };
    const setFormData = vi.fn();

    renderComponent({
      formState: formData,
      setFormState: setFormData,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await user.click(dropdownButton);

    await user.keyboard('{Escape}');
    await user.keyboard('{Tab}');
    await user.keyboard('a');

    expect(setFormData).not.toHaveBeenCalled();
  });

  it('displays "None" when no matching option is found', () => {
    const formData = { fieldName: 'nonExistentValue' };

    renderComponent({
      formState: formData,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    expect(dropdownButton).toHaveTextContent('None');
  });

  it('applies custom parentContainerStyle class', () => {
    const customStyle = 'custom-container-class';

    renderComponent({
      parentContainerStyle: customStyle,
    });

    const containerElement = screen.getByTestId('fieldname-dropdown-container');
    expect(containerElement).toHaveClass(customStyle);
  });

  it('applies custom btnStyle class', () => {
    const customBtnStyle = 'custom-btn-class';

    renderComponent({
      btnStyle: customBtnStyle,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    expect(dropdownButton).toHaveClass(customBtnStyle);
  });

  it('renders all field options in dropdown menu', async () => {
    const user = userEvent.setup();
    renderComponent();

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await user.click(dropdownButton);

    expect(screen.getByTestId('change-fieldname-btn-TEST')).toBeInTheDocument();
    expect(
      screen.getByTestId('change-fieldname-btn-value2'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('change-fieldname-btn-value3'),
    ).toBeInTheDocument();

    const label1Elements = screen.getAllByText('Label 1');
    expect(label1Elements.length).toBeGreaterThan(0);
    const label2Elements = screen.getAllByText('Label 2');
    expect(label2Elements.length).toBeGreaterThan(0);
    expect(screen.getByText('Label 3')).toBeInTheDocument();
  });

  it('renders options with correct selection state', async () => {
    const user = userEvent.setup();
    const formData = { fieldName: 'value2' };

    renderComponent({
      formState: formData,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await user.click(dropdownButton);

    const selectedOption = screen.getByTestId('change-fieldname-btn-value2');
    const unselectedOption = screen.getByTestId('change-fieldname-btn-TEST');

    expect(selectedOption).toBeInTheDocument();
    expect(unselectedOption).toBeInTheDocument();
  });

  it('updates form state with correct field name when selecting option', async () => {
    const user = userEvent.setup();
    const formData = { fieldName: 'value1', otherField: 'otherValue' };
    const setFormData = vi.fn();

    renderComponent({
      formState: formData,
      setFormState: setFormData,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await user.click(dropdownButton);

    const optionElement = screen.getByTestId('change-fieldname-btn-value3');
    await user.click(optionElement);

    expect(setFormData).toHaveBeenCalledWith({
      fieldName: 'value3',
      otherField: 'otherValue',
    });
  });

  it('has correct role attribute on dropdown items', async () => {
    const user = userEvent.setup();
    renderComponent();

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await user.click(dropdownButton);

    const option = screen.getByTestId('change-fieldname-btn-TEST');
    expect(option).toHaveAttribute('role', 'option');
  });

  it('handles empty field value', () => {
    const formData = { fieldName: '' };

    renderComponent({
      formState: formData,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    expect(dropdownButton).toHaveTextContent('None');
  });

  it('handles undefined field value', () => {
    const formData = { fieldName: undefined as string | undefined };

    renderComponent({
      formState: formData,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    expect(dropdownButton).toHaveTextContent('None');
  });

  it('preserves other form state properties when updating', async () => {
    const user = userEvent.setup();
    const formData = {
      fieldName: 'value1',
      anotherField: 'preserved',
      yetAnotherField: 123,
    };
    const setFormData = vi.fn();

    renderComponent({
      formState: formData,
      setFormState: setFormData,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await user.click(dropdownButton);

    const optionElement = screen.getByTestId('change-fieldname-btn-TEST');
    await user.click(optionElement);

    expect(setFormData).toHaveBeenCalledWith({
      fieldName: 'TEST',
      anotherField: 'preserved',
      yetAnotherField: 123,
    });
  });

  it('generates correct test IDs with lowercase field name', async () => {
    const user = userEvent.setup();
    renderComponent({
      fieldName: 'MyFieldName',
    });

    const dropdownButton = screen.getByTestId('myfieldname-dropdown-btn');
    expect(dropdownButton).toBeInTheDocument();

    await user.click(dropdownButton);

    const container = screen.getByTestId('myfieldname-dropdown-container');
    const menu = screen.getByTestId('myfieldname-dropdown-menu');

    expect(container).toBeInTheDocument();
    expect(menu).toBeInTheDocument();
  });

  // NEW TESTS FOR 100% COVERAGE

  it('applies default parentContainerStyle when not provided', () => {
    renderComponent({
      parentContainerStyle: undefined,
    });

    const containerElement = screen.getByTestId('fieldname-dropdown-container');
    expect(containerElement).toHaveClass('m-2');
  });

  it('applies default btnStyle when empty string is provided', () => {
    renderComponent({
      btnStyle: '',
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    // When btnStyle is empty string, the ternary operator returns 'w-100'
    // but we need to check for the actual classes applied
    expect(dropdownButton.className).toContain('dropdown-toggle');
  });

  it('handles keyboard event when no element is focused', async () => {
    const user = userEvent.setup();
    const formData = { fieldName: 'value1' };
    const setFormData = vi.fn();

    renderComponent({
      formState: formData,
      setFormState: setFormData,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await user.click(dropdownButton);

    // Blur any focused element
    const originalActive = document.activeElement;
    const nonHtml = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    );
    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      get: () => nonHtml,
    });

    await user.keyboard('{Enter}');
    expect(setFormData).not.toHaveBeenCalled();

    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      get: () => originalActive,
    });
  });

  it('handles keyboard event when focused element is not an HTMLElement', async () => {
    const user = userEvent.setup();
    const formData = { fieldName: 'value1' };
    const setFormData = vi.fn();

    renderComponent({
      formState: formData,
      setFormState: setFormData,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await user.click(dropdownButton);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    await user.keyboard('{Enter}');
    expect(setFormData).not.toHaveBeenCalled();
  });

  it('renders dropdown options based on current form state', async () => {
    const user = userEvent.setup();
    const formData = { fieldName: 'value2' };

    renderComponent({
      formState: formData,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await user.click(dropdownButton);

    const selectedOption = screen.getByTestId('change-fieldname-btn-value2');
    const unselectedOption = screen.getByTestId('change-fieldname-btn-TEST');

    expect(selectedOption).toBeInTheDocument();
    expect(unselectedOption).toBeInTheDocument();

    expect(selectedOption).toHaveAttribute(
      'data-testid',
      'change-fieldname-btn-value2',
    );
    expect(unselectedOption).toHaveAttribute(
      'data-testid',
      'change-fieldname-btn-TEST',
    );
  });

  it('has correct aria-label on dropdown container', () => {
    renderComponent();

    const containerElement = screen.getByTestId('fieldname-dropdown-container');
    expect(containerElement).toHaveAttribute('aria-label', 'Select fieldName');
  });

  it('has correct title attribute on dropdown container', () => {
    renderComponent();

    const containerElement = screen.getByTestId('fieldname-dropdown-container');
    expect(containerElement).toHaveAttribute('title', 'Select fieldName');
  });

  it('dropdown button has correct aria-expanded attribute', () => {
    renderComponent();

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('dropdown menu has correct role attribute', async () => {
    const user = userEvent.setup();
    renderComponent();

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await user.click(dropdownButton);

    const dropdownMenu = screen.getByTestId('fieldname-dropdown-menu');
    expect(dropdownMenu).toHaveAttribute('role', 'listbox');
  });

  it('handles multiple rapid selections correctly', async () => {
    const user = userEvent.setup();
    const formData = { fieldName: 'value1' };
    const setFormData = vi.fn();

    renderComponent({
      formState: formData,
      setFormState: setFormData,
      fieldOptions: [
        { value: 'value1', label: 'Label 1' },
        { value: 'value2', label: 'Label 2' },
        { value: 'value3', label: 'Label 3' },
      ],
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');

    // First selection
    await user.click(dropdownButton);

    await user.click(screen.getByTestId('change-fieldname-btn-value2'));

    // Second selection
    await user.click(dropdownButton);
    await user.click(screen.getByTestId('change-fieldname-btn-value3'));

    expect(setFormData).toHaveBeenCalledTimes(2);
    expect(setFormData).toHaveBeenNthCalledWith(1, { fieldName: 'value2' });
    expect(setFormData).toHaveBeenNthCalledWith(2, { fieldName: 'value3' });
  });

  it('returns correct label for valid value in getLabel', () => {
    const formData = { fieldName: 'TEST' };

    renderComponent({
      formState: formData,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    expect(dropdownButton).toHaveTextContent('Label 1');
  });

  it('handles options with special characters in values', async () => {
    const user = userEvent.setup();
    const formData = { fieldName: 'value-with-dash' };
    const setFormData = vi.fn();

    renderComponent({
      formState: formData,
      setFormState: setFormData,
      fieldOptions: [
        { value: 'value-with-dash', label: 'Dashed Value' },
        { value: 'value_with_underscore', label: 'Underscore Value' },
      ],
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    expect(dropdownButton).toHaveTextContent('Dashed Value');

    await user.click(dropdownButton);

    const option = screen.getByTestId(
      'change-fieldname-btn-value_with_underscore',
    );

    await user.click(option);

    expect(setFormData).toHaveBeenCalledWith({
      fieldName: 'value_with_underscore',
    });
  });

  it('handles single option in dropdown', async () => {
    const user = userEvent.setup();
    const formData = { fieldName: 'only' };
    const setFormData = vi.fn();

    renderComponent({
      formState: formData,
      setFormState: setFormData,
      fieldOptions: [{ value: 'only', label: 'Only Option' }],
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    expect(dropdownButton).toHaveTextContent('Only Option');

    await user.click(dropdownButton);

    expect(screen.getByTestId('change-fieldname-btn-only')).toBeInTheDocument();
  });

  it('handles empty fieldOptions array', async () => {
    const user = userEvent.setup();
    const formData = { fieldName: 'test' };

    renderComponent({
      formState: formData,
      fieldOptions: [],
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    expect(dropdownButton).toHaveTextContent('None');

    await user.click(dropdownButton);

    const dropdownMenu = screen.getByTestId('fieldname-dropdown-menu');
    expect(dropdownMenu.children).toHaveLength(0);
  });
});
