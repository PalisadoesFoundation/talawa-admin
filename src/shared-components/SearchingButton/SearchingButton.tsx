import React from 'react';
import { Dropdown } from 'react-bootstrap';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import styles from './SearchingButton.module.css';
import { InterfaceSearchingButtonProps } from 'types/shared-components/SearchingButton/interface';

/**
 * SearchingButton component that only displays a text.
 *
 * @param title - Tooltip title for the dropdown.
 * @param text - Display text shown in the button (defaults to 'Select an option').
 * @param dataTestIdPrefix - Test ID prefix for the toggle button.
 * @param dropdownTestId - Test ID for the dropdown container.
 * @param className - Optional CSS class for styling.
 * @param type - Icon type: 'sort' (SortIcon) or 'filter' (FilterAltOutlined).
 * @returns The rendered SearchingButton component.
 */
const SearchingButton: React.FC<InterfaceSearchingButtonProps> = ({
  title,
  text = 'Select an option', // Default text if none is provided
  dataTestIdPrefix,
  dropdownTestId,
  className = styles.dropdown,
  type = 'sort',
}) => {
  const IconComponent = type === 'filter' ? FilterAltOutlined : SortIcon;

  return (
    <Dropdown aria-expanded="false" title={title} data-testid={dropdownTestId}>
      <Dropdown.Toggle
        variant="outline-success"
        data-testid={dataTestIdPrefix}
        className={className}
      >
        <IconComponent className="me-1" />
        {text}
      </Dropdown.Toggle>
    </Dropdown>
  );
};

export default SearchingButton;
