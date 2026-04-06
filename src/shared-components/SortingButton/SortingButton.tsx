/**
 * SortingButton — thin wrapper around DropDownButton.
 *
 * @deprecated The `type` prop is now supported directly on `DropDownButton`.
 * Use `DropDownButton` with `type="sort"` or `type="filter"` instead.
 */
import React from 'react';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';
import type { InterfaceSortingButtonProps } from 'types/shared-components/SortingButton/interface';

const SortingButton: React.FC<InterfaceSortingButtonProps> = ({
  title,
  sortingOptions,
  selectedOption,
  onSortChange,
  dataTestIdPrefix,
  dropdownTestId,
  className,
  buttonLabel,
  type = 'sort',
  ariaLabel,
  containerClassName,
  toggleClassName,
}) => (
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
    containerClassName={containerClassName}
    toggleClassName={toggleClassName}
    type={type}
  />
);

export default SortingButton;
