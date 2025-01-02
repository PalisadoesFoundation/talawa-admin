import React from 'react';
import { Dropdown } from 'react-bootstrap';
import SortIcon from '@mui/icons-material/Sort';
import styles from '../style/app.module.css';

interface InterfaceSortingButtonProps {
  sortingOptions: string[];
  selectedOption: string;
  onSortChange: (option: string) => void;
}

const SortingButton: React.FC<InterfaceSortingButtonProps> = ({
  sortingOptions,
  selectedOption,
  onSortChange,
}) => {
  return (
    <Dropdown
      aria-expanded="false"
      title="Sort organizations"
      data-testid="sort"
    >
      <Dropdown.Toggle
        variant={selectedOption === '' ? 'outline-success' : 'success'}
        data-testid="sortOrgs"
        className={styles.dropdownToggle}
      >
        <SortIcon className={'me-1'} />
        {selectedOption}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {sortingOptions.map((option) => (
          <Dropdown.Item
            key={option}
            onClick={() => onSortChange(option)}
            data-testid={option}
          >
            {option}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SortingButton;
