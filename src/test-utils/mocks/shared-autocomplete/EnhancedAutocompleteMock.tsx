/**
 * Enhanced Autocomplete mock for renderOption coverage tests.
 * Calls renderInput and renderOption to test the real rendering logic.
 * Used via vi.doMock('shared-components/Autocomplete') in test files.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { vi } from 'vitest';
import type { InterfaceAutocompleteMockProps } from 'types/AdminPortal/EventRegistrantsModal/interface';

const EnhancedAutocompleteMock: React.FC<InterfaceAutocompleteMockProps> = ({
  renderInput,
  renderOption,
  options,
  onChange,
  getOptionLabel,
  onInputChange,
}) => {
  const { t } = useTranslation('common');
  const [_localInputValue, setLocalInputValue] = React.useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setLocalInputValue(newValue);
    if (onInputChange) {
      onInputChange({} as React.SyntheticEvent, newValue, 'input');
    }
  };

  const inputProps = {
    onChange: handleInputChange,
    onInput: handleInputChange,
  };

  return (
    <div data-testid="autocomplete-mock">
      {renderInput?.({
        InputProps: { ref: vi.fn() },
        id: 'test-autocomplete',
        disabled: false,
        inputProps: inputProps,
      })}
      <div data-testid="options-container">
        {options && options.length > 0 ? (
          options.map((option) => {
            const liProps = {
              key: option.id,
              'data-testid': `rendered-option-${option.id}`,
              onClick: (): void => {
                if (onChange) {
                  onChange(option);
                }
              },
              role: 'option',
              tabIndex: 0,
            };

            return renderOption
              ? renderOption(liProps, option, { selected: false })
              : (() => {
                  const label = getOptionLabel?.(option) || option.name || '';
                  return label;
                })();
          })
        ) : (
          <div data-testid="no-options">{t('noOptionsFound')}</div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAutocompleteMock;
