import React from 'react';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import PropTypes from 'prop-types';
import styles from './SortingButton.module.css';
import { useTranslation } from 'react-i18next';
import { InterfaceSortingButtonProps } from 'types/shared-components/SortingButton/interface';

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
    <DropDownButton
      id={dropdownTestId}
      options={sortingOptions.map((option) => ({
        label: option.label,
        value: String(option.value),
      }))}
      selectedValue={
        selectedOption !== undefined && selectedOption !== null
          ? String(selectedOption)
          : undefined
      }
      onSelect={(value) => onSortChange(value)}
      ariaLabel={ariaLabel || title}
      dataTestIdPrefix={dataTestIdPrefix}
      buttonLabel={buttonLabel || String(selectedOption ?? '')}
      parentContainerStyle={className}
      variant="outline-secondary"
      icon={
        icon ? (
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
        )
      }
    />
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
