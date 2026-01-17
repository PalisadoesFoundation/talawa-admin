import React from 'react';
import { Dropdown } from 'react-bootstrap';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import PropTypes from 'prop-types';
import styles from '../../style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';

interface InterfaceSortingOption {
  /** The label to display for the sorting option */
  label: string;
  /** The value associated with the sorting option */
  value: string | number;
}

interface InterfaceSortingButtonProps {
  /** The title attribute for the Dropdown */
  title?: string;
  /** The list of sorting options to display in the Dropdown */
  sortingOptions: InterfaceSortingOption[];
  /** The currently selected sorting option */
  selectedOption?: string | number;
  /** Callback function to handle sorting option change */
  onSortChange: (value: string | number) => void;
  /** The prefix for data-testid attributes for testing */
  dataTestIdPrefix: string;
  /** The data-testid attribute for the Dropdown */
  dropdownTestId?: string;
  /** Custom class name for the Dropdown */
  className?: string;
  /** Optional prop for custom button label */
  buttonLabel?: string;
  /** Type to determine the icon to display: 'sort' or 'filter' */
  type?: 'sort' | 'filter';
  /** Accessible label for the dropdown button (screen readers) */
  ariaLabel?: string;
  icon?: string | null;
}

/**
 * SortingButton component renders a Dropdown with sorting options.
 * It allows users to select a sorting option and triggers a callback on selection.
 * Includes accessibility support for screen readers.
 *
 * @param props - The properties for the SortingButton component.
 * @returns The rendered SortingButton component.
 */
const SortingButton: React.FC<InterfaceSortingButtonProps> = ({
  title,
  sortingOptions,
  selectedOption,
  onSortChange,
  dataTestIdPrefix,
  dropdownTestId,
  className = styles.dropdown,
  buttonLabel,
  type = 'sort',
  ariaLabel,
  icon,
}) => {
  // Determine the icon based on the type
  const IconComponent = type === 'filter' ? FilterAltOutlined : SortIcon;
  const { t: tCommon } = useTranslation('common');

  return (
    <Dropdown aria-expanded="false" title={title} data-testid={dropdownTestId}>
      <Dropdown.Toggle
        variant={selectedOption === '' ? 'outline-success' : 'success'}
        data-testid={`${dataTestIdPrefix}`}
        className={className}
        aria-label={ariaLabel}
      >
        <span className={styles.iconRightMargin}>
          {icon ? (
            <img
              src={String(icon)}
              alt={tCommon('sortingIcon')}
              aria-hidden="true"
            />
          ) : (
            <IconComponent
              data-testid="sorting-icon"
              data-icon-type={type}
              aria-hidden="true"
            />
          )}
        </span>
        {/* Use the appropriate icon */}
        {buttonLabel || selectedOption}
        {/* Use buttonLabel if provided, otherwise use selectedOption */}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {sortingOptions.map((option) => (
          <Dropdown.Item
            key={option.value}
            onClick={() => onSortChange(option.value)}
            data-testid={`${option.value}`}
            className={styles.dropdownItem}
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

SortingButton.propTypes = {
  title: PropTypes.string,
  sortingOptions: PropTypes.arrayOf(
    PropTypes.exact({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }).isRequired,
  ).isRequired,
  selectedOption: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSortChange: PropTypes.func.isRequired,
  dataTestIdPrefix: PropTypes.string.isRequired,
  dropdownTestId: PropTypes.string,
  buttonLabel: PropTypes.string, // Optional prop for custom button label
  type: PropTypes.oneOf(['sort', 'filter']), // Type to determine the icon
  ariaLabel: PropTypes.string, // Accessible label for screen readers
};

export default SortingButton;
