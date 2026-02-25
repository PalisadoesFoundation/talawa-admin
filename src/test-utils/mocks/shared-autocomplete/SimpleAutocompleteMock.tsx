/**
 * Simple Autocomplete mock for basic tests.
 * Renders a flat input + option divs without renderInput/renderOption support.
 * Used by the top-level vi.mock('shared-components/Autocomplete') in test files.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { InterfaceAutocompleteMockProps } from 'types/AdminPortal/EventRegistrantsModal/interface';

const SimpleAutocompleteMock: React.FC<InterfaceAutocompleteMockProps> = ({
  options,
  onChange,
  onInputChange,
  noOptionsText,
  getOptionLabel,
  dataTestId = 'shared-autocomplete',
}) => {
  const { t } = useTranslation('common');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onInputChange) {
      onInputChange({} as React.SyntheticEvent, e.target.value, 'input');
    }
  };

  const getLabel = (option: { id: string; name?: string }): string => {
    if (getOptionLabel) return getOptionLabel(option);
    return option.name || 'Unknown User';
  };

  return (
    <div data-testid={dataTestId}>
      <input
        data-testid={`${dataTestId}-input`}
        onChange={handleInputChange}
        onInput={handleInputChange}
        type="text"
      />
      {options && options.length > 0 ? (
        options.map((option) => (
          <div
            key={option.id}
            data-testid={`option-${option.id}`}
            onClick={(): void => {
              if (onChange) {
                onChange(option);
              }
            }}
            onKeyDown={(): void => {
              /* mock */
            }}
            role="button"
            tabIndex={0}
          >
            {getLabel(option)}
          </div>
        ))
      ) : noOptionsText ? (
        <div data-testid="no-options">{noOptionsText}</div>
      ) : (
        <div data-testid="no-options">{t('noOptionsFound')}</div>
      )}
    </div>
  );
};

export default SimpleAutocompleteMock;
