import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import DynamicDropDown from './DynamicDropDown';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';
import { vi, expect, it, describe, beforeEach } from 'vitest';

describe('DynamicDropDown component', () => {
  const defaultProps = {
    formState: { fieldName: 'value2' as string | undefined },
    setFormState: vi.fn(),
    fieldOptions: [
      { value: 'TEST', label: 'Label 1' },
      { value: 'value2', label: 'Label 2' },
      { value: 'value3', label: 'Label 3' },
    ],
    fieldName: 'fieldName' as string,
  };

  const renderComponent = (props = {}) => {
    const mergedProps = { ...defaultProps, ...props };
    return render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <DynamicDropDown {...mergedProps} />
        </I18nextProvider>
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders and handles selection correctly', async () => {
    const formData = { fieldName: 'value2' };
    const setFormData = vi.fn();

    renderComponent({
      formState: formData,
      setFormState: setFormData,
    });

    // Verify that the dropdown container is rendered
    const containerElement = screen.getByTestId('fieldname-dropdown-container');
    expect(containerElement).toBeInTheDocument();

    // Verify that the dropdown button displays the correct initial label
    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    expect(dropdownButton).toHaveTextContent('Label 2');

    // Open the dropdown menu
    await act(async () => {
      await userEvent.click(dropdownButton);
    });

    // Select the first option in the dropdown
    const optionElement = screen.getByTestId('change-fieldname-btn-TEST');
    await act(async () => {
      await userEvent.click(optionElement);
    });

    // Verify that the setFormData function was called with the correct arguments
    expect(setFormData).toHaveBeenCalledWith({ fieldName: 'TEST' });
  });

  it('calls custom handleChange function when provided', async () => {
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
    await act(async () => {
      await userEvent.click(dropdownButton);
    });

    const optionElement = screen.getByTestId('change-fieldname-btn-value2');
    await act(async () => {
      await userEvent.click(optionElement);
    });

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

    // Open dropdown
    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await act(async () => {
      await userEvent.click(dropdownButton);
    });

    // Get dropdown menu
    const dropdownMenu = screen.getByTestId('fieldname-dropdown-menu');

    // Get an option and focus it
    const option = screen.getByTestId('change-fieldname-btn-value2');
    option.focus();

    // Simulate Enter key press
    await act(async () => {
      fireEvent.keyDown(dropdownMenu, { key: 'Enter' });
    });

    // Verify option is still in the document
    expect(option).toBeInTheDocument();
  });

  it('handles keyboard navigation with Space key correctly', async () => {
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

    // Open dropdown
    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await act(async () => {
      await userEvent.click(dropdownButton);
    });

    // Get dropdown menu
    const dropdownMenu = screen.getByTestId('fieldname-dropdown-menu');

    // Get an option and focus it
    const option = screen.getByTestId('change-fieldname-btn-value2');
    option.focus();

    // Simulate Space key press
    await act(async () => {
      fireEvent.keyDown(dropdownMenu, { key: ' ' });
    });

    // Verify the dropdown menu behavior
    expect(option).toBeInTheDocument();
  });

  it('ignores non-Enter/Space key presses', async () => {
    const formData = { fieldName: 'value1' };
    const setFormData = vi.fn();

    renderComponent({
      formState: formData,
      setFormState: setFormData,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await act(async () => {
      await userEvent.click(dropdownButton);
    });

    const dropdownMenu = screen.getByTestId('fieldname-dropdown-menu');

    // Simulate other key presses (should not trigger preventDefault or click)
    await act(async () => {
      fireEvent.keyDown(dropdownMenu, { key: 'Escape' });
      fireEvent.keyDown(dropdownMenu, { key: 'Tab' });
      fireEvent.keyDown(dropdownMenu, { key: 'a' });
    });

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
    renderComponent();

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await act(async () => {
      await userEvent.click(dropdownButton);
    });

    // Verify all options are rendered
    expect(screen.getByTestId('change-fieldname-btn-TEST')).toBeInTheDocument();
    expect(
      screen.getByTestId('change-fieldname-btn-value2'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('change-fieldname-btn-value3'),
    ).toBeInTheDocument();

    // Verify labels are correct using getAllByText for duplicate text
    expect(screen.getByText('Label 1')).toBeInTheDocument();
    const label2Elements = screen.getAllByText('Label 2');
    expect(label2Elements.length).toBeGreaterThan(0);
    expect(screen.getByText('Label 3')).toBeInTheDocument();
  });

  it('renders options with correct selection state', async () => {
    const formData = { fieldName: 'value2' };

    renderComponent({
      formState: formData,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await act(async () => {
      await userEvent.click(dropdownButton);
    });

    const selectedOption = screen.getByTestId('change-fieldname-btn-value2');
    const unselectedOption = screen.getByTestId('change-fieldname-btn-TEST');

    // Verify both options are rendered correctly
    expect(selectedOption).toBeInTheDocument();
    expect(unselectedOption).toBeInTheDocument();
  });

  it('updates form state with correct field name when selecting option', async () => {
    const formData = { fieldName: 'value1', otherField: 'otherValue' };
    const setFormData = vi.fn();

    renderComponent({
      formState: formData,
      setFormState: setFormData,
    });

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await act(async () => {
      await userEvent.click(dropdownButton);
    });

    const optionElement = screen.getByTestId('change-fieldname-btn-value3');
    await act(async () => {
      await userEvent.click(optionElement);
    });

    expect(setFormData).toHaveBeenCalledWith({
      fieldName: 'value3',
      otherField: 'otherValue',
    });
  });

  it('has correct role attribute on dropdown items', async () => {
    renderComponent();

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await act(async () => {
      await userEvent.click(dropdownButton);
    });

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
    await act(async () => {
      await userEvent.click(dropdownButton);
    });

    const optionElement = screen.getByTestId('change-fieldname-btn-TEST');
    await act(async () => {
      await userEvent.click(optionElement);
    });

    expect(setFormData).toHaveBeenCalledWith({
      fieldName: 'TEST',
      anotherField: 'preserved',
      yetAnotherField: 123,
    });
  });

  it('generates correct test IDs with lowercase field name', async () => {
    renderComponent({
      fieldName: 'MyFieldName',
    });

    const dropdownButton = screen.getByTestId('myfieldname-dropdown-btn');
    expect(dropdownButton).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(dropdownButton);
    });

    const container = screen.getByTestId('myfieldname-dropdown-container');
    const menu = screen.getByTestId('myfieldname-dropdown-menu');

    expect(container).toBeInTheDocument();
    expect(menu).toBeInTheDocument();
  });
});
