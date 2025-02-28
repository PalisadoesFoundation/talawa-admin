import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import EditOrgCustomFieldDropDown from './EditCustomFieldDropDown';

// Initialize i18n for testing
i18n.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        orgProfileField: {
          TEXT: 'Text',
          NUMBER: 'Number',
          DATE: 'Date',
          BOOLEAN: 'Boolean',
        },
        common: {
          none: 'None',
        },
      },
    },
  },
});

// Mock the availableFieldTypes
vi.mock('utils/fieldTypes', () => ({
  default: ['TEXT', 'NUMBER', 'DATE', 'BOOLEAN'],
}));

describe('EditOrgCustomFieldDropDown Component', () => {
  const mockSetCustomFieldData = vi.fn();
  const defaultProps = {
    customFieldData: {
      type: 'TEXT',
      name: 'Test Field',
      required: false,
    },
    setCustomFieldData: mockSetCustomFieldData,
    variant: 'outline-success' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial type', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <EditOrgCustomFieldDropDown {...defaultProps} />
      </I18nextProvider>,
    );

    expect(screen.getByTestId('toggleBtn')).toHaveTextContent('Text');
  });

  it('applies custom styles when provided', () => {
    const customStyles = {
      parentContainerStyle: 'custom-container',
      btnStyle: 'custom-button',
    };

    render(
      <I18nextProvider i18n={i18n}>
        <EditOrgCustomFieldDropDown {...defaultProps} {...customStyles} />
      </I18nextProvider>,
    );

    const container = screen.getByTitle('Edit Custom Field');
    const button = screen.getByTestId('toggleBtn');

    expect(container).toHaveClass('custom-container');
    expect(button).toHaveClass('custom-button');
  });

  it('displays all available field types in dropdown menu', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <EditOrgCustomFieldDropDown {...defaultProps} />
      </I18nextProvider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('toggleBtn'));
    });

    // Change to get items by their test IDs instead of role
    const menuItems = [
      screen.getByTestId('dropdown-btn-0'),
      screen.getByTestId('dropdown-btn-1'),
      screen.getByTestId('dropdown-btn-2'),
      screen.getByTestId('dropdown-btn-3'),
    ];

    expect(menuItems).toHaveLength(4);
    expect(menuItems[0]).toHaveTextContent('Text');
    expect(menuItems[1]).toHaveTextContent('Number');
    expect(menuItems[2]).toHaveTextContent('Date');
    expect(menuItems[3]).toHaveTextContent('Boolean');
  });

  it('disables current type in dropdown menu', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <EditOrgCustomFieldDropDown {...defaultProps} />
      </I18nextProvider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('toggleBtn'));
    });

    const textOption = screen.getByTestId('dropdown-btn-0');
    expect(textOption).toHaveClass('dropdown-item', 'disabled');
  });

  it('updates custom field data when new type is selected', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <EditOrgCustomFieldDropDown {...defaultProps} />
      </I18nextProvider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('toggleBtn'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('dropdown-btn-1'));
    });

    expect(mockSetCustomFieldData).toHaveBeenCalledWith({
      ...defaultProps.customFieldData,
      type: 'NUMBER',
    });
  });

  it('maintains other custom field data properties when updating type', async () => {
    const customFieldData = {
      type: 'TEXT',
      name: 'Test Field',
      required: true,
      description: 'Test Description',
      options: ['option1', 'option2'],
    };

    render(
      <I18nextProvider i18n={i18n}>
        <EditOrgCustomFieldDropDown
          {...defaultProps}
          customFieldData={customFieldData}
        />
      </I18nextProvider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('toggleBtn'));
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('dropdown-btn-2'));
    });

    expect(mockSetCustomFieldData).toHaveBeenCalledWith({
      ...customFieldData,
      type: 'DATE',
    });
  });
});
