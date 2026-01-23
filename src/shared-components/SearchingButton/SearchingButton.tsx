import React from 'react';
import { Dropdown } from 'react-bootstrap';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import PropTypes from 'prop-types';
import styles from './SearchingButton.module.css';
import { InterfaceSearchingButtonProps } from 'types/shared-components/SearchingButton/interface';

/**
 * SearchingButton component that only displays a text.
 *
 * @param props - The properties for the SearchingButton component.
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

SearchingButton.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string, // Now optional with a default value
  dataTestIdPrefix: PropTypes.string.isRequired,
  dropdownTestId: PropTypes.string,
  type: PropTypes.oneOf(['sort', 'filter']), // Type to determine the icon
};

export default SearchingButton;
