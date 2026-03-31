import React from 'react';
import type { InterfaceAutocompleteMockProps } from 'types/AdminPortal/EventRegistrantsModal/interface';

type EqualityMockProps = InterfaceAutocompleteMockProps & {
  options?: { id: string; name?: string }[];
  isOptionEqualToValue?: (a: unknown, b: unknown) => boolean;
};

/**
 * Creates a mock Autocomplete component that invokes `isOptionEqualToValue`.
 *
 * @param onResult - Callback that receives the comparison result.
 * @returns A mock Autocomplete component for tests.
 */
const createIsOptionEqualToValueMock = (
  onResult: (result: boolean) => void,
): React.FC<EqualityMockProps> => {
  const IsOptionEqualToValueMock: React.FC<EqualityMockProps> = ({
    options,
    isOptionEqualToValue,
    renderInput,
  }) => {
    if (options?.length && isOptionEqualToValue) {
      onResult(isOptionEqualToValue(options[0], options[0]));
    }

    return (
      <div data-testid="autocomplete-equality-mock">
        {renderInput?.({
          InputProps: { ref: React.createRef<HTMLInputElement>() },
          id: 'equality-autocomplete',
          disabled: false,
          inputProps: {},
        })}
      </div>
    );
  };

  return IsOptionEqualToValueMock;
};

export default createIsOptionEqualToValueMock;
