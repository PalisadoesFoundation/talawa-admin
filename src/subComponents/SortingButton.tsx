import React from 'react';
import { Dropdown } from 'react-bootstrap';
import SortIcon from '@mui/icons-material/Sort';
import PropTypes from 'prop-types';
import styles from '../style/app.module.css';

interface InterfaceSortingOption {
  label: string;
  value: string;
}

interface InterfaceSortingButtonProps {
  title: string;
  sortingOptions: InterfaceSortingOption[];
  selectedOption: string;
  onSortChange: (value: string) => void;
  dataTestIdPrefix: string;
  className?: string;
  buttonLabel?: string; // Optional prop for custom button label
}

const SortingButton: React.FC<InterfaceSortingButtonProps> = ({
  title,
  sortingOptions,
  selectedOption,
  onSortChange,
  dataTestIdPrefix,
  className = styles.dropdownToggle,
  buttonLabel, // Destructure the optional buttonLabel prop
}) => {
  return (
    <Dropdown aria-expanded="false" title={title}>
      <Dropdown.Toggle
        variant={selectedOption === '' ? 'outline-success' : 'success'}
        data-testid={`${dataTestIdPrefix}`}
        className={className}
      >
        <SortIcon className={'me-1'} />
        {buttonLabel || selectedOption}
        {/* Use buttonLabel if provided, otherwise use selectedOption */}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {sortingOptions.map((option) => (
          <Dropdown.Item
            key={option.value}
            onClick={() => onSortChange(option.value)}
            data-testid={`${option.value}`}
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

SortingButton.propTypes = {
  title: PropTypes.string.isRequired,
  sortingOptions: PropTypes.arrayOf(
    PropTypes.exact({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  selectedOption: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  dataTestIdPrefix: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string, // Optional prop for custom button label
};

export default SortingButton;
