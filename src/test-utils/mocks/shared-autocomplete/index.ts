/**
 * Barrel export for shared-autocomplete test mocks.
 *
 * SimpleAutocompleteMock  – flat input + options (no renderInput/renderOption)
 * EnhancedAutocompleteMock – calls renderInput & renderOption
 * createGetOptionLabelMock – factory returning a mock that captures getOptionLabel calls
 */
export { default as SimpleAutocompleteMock } from './SimpleAutocompleteMock';
export { default as EnhancedAutocompleteMock } from './EnhancedAutocompleteMock';
export { default as createGetOptionLabelMock } from './createGetOptionLabelMock';
