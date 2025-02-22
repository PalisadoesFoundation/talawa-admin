import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import type { InterfaceCustomFieldData } from 'utils/interfaces';
import EditOrgCustomFieldDropDown from './EditCustomFieldDropDown';
import availableFieldTypes from 'utils/fieldTypes';

// Mock external dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    tCommon: (key: string) => key,
  }),
}));

// Mock field types
jest.mock('utils/fieldTypes', () => ({
  availableFieldTypes: ['TEXT', 'NUMBER', 'BOOLEAN'],
}));

describe('EditOrgCustomFieldDropDown Component', () => {
  const mockSetCustomFieldData = jest.fn();
  const initialFieldData: InterfaceCustomFieldData = {
    id: '',
    type: '',
    name: '',
  };

  const baseProps = {
    customFieldData: initialFieldData,
    setCustomFieldData: mockSetCustomFieldData,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default state', () => {
    render(<EditOrgCustomFieldDropDown {...baseProps} />);

    expect(screen.getByTestId('toggleBtn')).toHaveTextContent('common.none');
    expect(screen.getByTitle('Edit Custom Field')).toBeInTheDocument();
  });

  test('displays current field type correctly', () => {
    const props = {
      ...baseProps,
      customFieldData: { ...initialFieldData, type: 'TEXT' },
    };

    render(<EditOrgCustomFieldDropDown {...props} />);
    expect(screen.getByTestId('toggleBtn')).toHaveTextContent(
      'orgProfileField.TEXT',
    );
  });

  test('shows all available field types in dropdown', () => {
    render(<EditOrgCustomFieldDropDown {...baseProps} />);
    fireEvent.click(screen.getByTestId('toggleBtn'));

    availableFieldTypes.forEach((type) => {
      expect(screen.getByText(`orgProfileField.${type}`)).toBeInTheDocument();
    });
  });

  test('updates field type on selection', () => {
    render(<EditOrgCustomFieldDropDown {...baseProps} />);
    fireEvent.click(screen.getByTestId('toggleBtn'));
    fireEvent.click(screen.getByText('orgProfileField.NUMBER'));

    expect(mockSetCustomFieldData).toHaveBeenCalledWith({
      ...initialFieldData,
      type: 'NUMBER',
    });
  });

  test('disables currently selected option', () => {
    const props = {
      ...baseProps,
      customFieldData: { ...initialFieldData, type: 'BOOLEAN' },
    };

    render(<EditOrgCustomFieldDropDown {...props} />);
    fireEvent.click(screen.getByTestId('toggleBtn'));

    const booleanOption = screen.getByText('orgProfileField.BOOLEAN');
    expect(booleanOption.closest('.dropdown-item')).toHaveClass('disabled');
  });

  test('applies custom styles correctly', () => {
    const styleProps = {
      ...baseProps,
      parentContainerStyle: 'custom-container',
      btnStyle: 'custom-button',
    };

    const { container } = render(
      <EditOrgCustomFieldDropDown {...styleProps} />,
    );

    expect(
      container.querySelector('.dropdown.custom-container'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('toggleBtn')).toHaveClass('custom-button');
  });
});
