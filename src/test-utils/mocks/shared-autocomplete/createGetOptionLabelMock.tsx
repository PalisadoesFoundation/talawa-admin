/**
 * Factory that creates an Autocomplete mock capturing getOptionLabel calls.
 * Returns a React component that records each getOptionLabel invocation into
 * the provided `calls` array so tests can assert on the results.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { vi } from 'vitest';
import type { InterfaceAutocompleteMockProps } from 'types/AdminPortal/EventRegistrantsModal/interface';

interface InterfaceGetOptionLabelCall {
  option: unknown;
  result: string;
}

const createGetOptionLabelMock = (
  calls: InterfaceGetOptionLabelCall[],
): React.FC<InterfaceAutocompleteMockProps> => {
  const GetOptionLabelAutocompleteMock: React.FC<
    InterfaceAutocompleteMockProps
  > = ({
    getOptionLabel,
    renderOption,
    options,
    renderInput,
    onChange,
    onInputChange,
  }) => {
    const { t } = useTranslation('common');
    const [_localInputValue, setLocalInputValue] = React.useState('');

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
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
              const label = getOptionLabel
                ? getOptionLabel(option)
                : option.name || '';
              calls.push({ option, result: label });

              const liProps = {
                key: option.id,
                'data-testid': `getoptionlabel-option-${option.id}`,
                onClick: (): void => {
                  if (onChange) {
                    onChange(option);
                  }
                },
                role: 'option',
                tabIndex: 0,
              };

              const optionElement = renderOption ? (
                renderOption(liProps, option, { selected: false })
              ) : (
                <span key={option.id}>{label}</span>
              );

              return optionElement;
            })
          ) : (
            <div data-testid="no-options">{t('noOptionsFound')}</div>
          )}
        </div>
      </div>
    );
  };

  return GetOptionLabelAutocompleteMock;
};

export default createGetOptionLabelMock;
