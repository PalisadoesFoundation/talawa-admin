import React from 'react';
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import DynamicDropDown from './DynamicDropDown';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';
import { vi, expect, it } from 'vitest';

describe('DynamicDropDown component', () => {
  it('renders and handles selection correctly', async () => {
    const formData = { fieldName: 'value2' };
    const setFormData = vi.fn();

    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <DynamicDropDown
            formState={formData}
            setFormState={setFormData}
            fieldOptions={[
              { value: 'TEST', label: 'Label 1' },
              { value: 'value2', label: 'Label 2' },
            ]}
            fieldName="fieldName"
          />
        </I18nextProvider>
      </BrowserRouter>,
    );

    // Verify that the dropdown container is rendered
    const containerElement = screen.getByTestId('fieldname-dropdown-container');
    expect(containerElement).toBeInTheDocument();

    // Verify that the dropdown button displays the correct initial label
    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    expect(dropdownButton).toHaveTextContent('Label 2');

    // Open the dropdown menu
    await act(async () => {
      userEvent.click(dropdownButton);
    });

    // Select the first option in the dropdown
    const optionElement = screen.getByTestId('change-fieldname-btn-TEST');
    await act(async () => {
      userEvent.click(optionElement);
    });

    // Verify that the setFormData function was called with the correct arguments
    expect(setFormData).toHaveBeenCalledWith({ fieldName: 'TEST' });

    // Verify that the dropdown button displays the updated label
    await waitFor(() => {
      expect(dropdownButton).toHaveTextContent('Label 2');
    });
  });
  it('calls custom handleChange function when provided', async () => {
    const formData = { fieldName: 'value1' };
    const setFormData = vi.fn();
    const customHandleChange = vi.fn();

    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <DynamicDropDown
            formState={formData}
            setFormState={setFormData}
            fieldOptions={[
              { value: 'value1', label: 'Label 1' },
              { value: 'value2', label: 'Label 2' },
            ]}
            fieldName="fieldName"
            handleChange={customHandleChange}
          />
        </I18nextProvider>
      </BrowserRouter>,
    );

    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await act(async () => {
      userEvent.click(dropdownButton);
    });

    const optionElement = screen.getByTestId('change-fieldname-btn-value2');
    await act(async () => {
      userEvent.click(optionElement);
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
  it('handles keyboard navigation correctly', async () => {
    const formData = { fieldName: 'value1' };
    const setFormData = vi.fn();

    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <DynamicDropDown
            formState={formData}
            setFormState={setFormData}
            fieldOptions={[
              { value: 'value1', label: 'Label 1' },
              { value: 'value2', label: 'Label 2' },
            ]}
            fieldName="fieldName"
          />
        </I18nextProvider>
      </BrowserRouter>,
    );

    // Open dropdown
    const dropdownButton = screen.getByTestId('fieldname-dropdown-btn');
    await act(async () => {
      userEvent.click(dropdownButton);
    });

    // Get dropdown menu
    const dropdownMenu = screen.getByTestId('fieldname-dropdown-menu');

    // Simulate Enter key press
    await act(async () => {
      fireEvent.keyDown(dropdownMenu, { key: 'Enter' });
    });

    // Simulate Space key press
    await act(async () => {
      fireEvent.keyDown(dropdownMenu, { key: ' ' });
    });

    // Verify the dropdown menu behavior
    const option = screen.getByTestId('change-fieldname-btn-value2');
    expect(option).toBeInTheDocument();
  });
});
