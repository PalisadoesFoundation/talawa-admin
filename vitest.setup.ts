import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import dayjs from 'dayjs';

// Mock the problematic ES module import from @mui/x-date-pickers
vi.mock('@mui/material/utils', () => ({
  capitalize: vi.fn((str) => str.charAt(0).toUpperCase() + str.slice(1)),
  debounce: vi.fn((fn) => fn),
  deprecatedPropType: vi.fn(),
  isHostComponent: vi.fn(() => false),
  isMuiElement: vi.fn(() => false),
  ownerDocument: vi.fn(() => document),
  ownerWindow: vi.fn(() => window),
  requirePropFactory: vi.fn(),
  setRef: vi.fn(),
  unsupportedProp: vi.fn(),
  useControlled: vi.fn(),
  useEnhancedEffect: vi.fn(),
  useEventCallback: vi.fn(),
  useForkRef: vi.fn(),
  useId: vi.fn(),
  default: {},
}));

// Basic cleanup after each test
afterEach(() => {
  cleanup();
});

// Simple console error handler for React 18 warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const firstArg = args[0];
    if (
      typeof firstArg === 'string' &&
      /Warning: ReactDOM.render is no longer supported in React 18./.test(
        firstArg,
      )
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Root module mock for @mui/x-date-pickers to cover all import patterns
vi.mock('@mui/x-date-pickers', () => ({
  DatePicker: vi.fn(({ value, onChange, slotProps, label, ...props }) => {
    // Extract attributes from slotProps.textField.inputProps if available
    const inputProps = slotProps?.textField?.inputProps || {};

    // Filter out non-standard HTML attributes to avoid React warnings
    const nonHtmlProps = [
      'maxDate',
      'minDate',
      'format',
      'timeSteps',
      'minTime',
      'maxTime',
      'shouldDisableDate',
      'shouldDisableTime',
      'minutesStep',
      'secondsStep',
      'disableFuture',
      'disablePast',
      'ampm',
    ];
    const cleanProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !nonHtmlProps.includes(key)),
    );

    const [isOpen, setIsOpen] = React.useState(false);

    return React.createElement('div', {}, [
      label &&
        React.createElement(
          'label',
          { key: 'label', htmlFor: 'date-picker-input' },
          label,
        ),
      React.createElement('input', {
        key: 'input',
        'data-testid': inputProps['data-testid'] || 'date-picker',
        type: 'text', // Use text type instead of date to accept MM/DD/YYYY format
        id: label || 'date-picker-input',
        'aria-label': inputProps['aria-label'] || label,
        className: props.className,
        value: value
          ? typeof value === 'string'
            ? value
            : value.format?.('MM/DD/YYYY') || ''
          : '',
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          const isDayjs =
            value &&
            typeof value !== 'string' &&
            typeof (value as { format?: (format: string) => string }).format ===
              'function';
          onChange?.(newValue ? (isDayjs ? dayjs(newValue) : newValue) : null);
        },
        ...cleanProps,
      }),
      React.createElement(
        'button',
        {
          key: 'choose-button',
          'aria-label': 'choose date',
          type: 'button',
          onClick: () => setIsOpen(!isOpen),
        },
        'choose date',
      ),

      // Calendar interface when opened
      isOpen &&
        React.createElement(
          'div',
          {
            key: 'calendar-interface',
            'data-testid': 'date-picker-interface',
            role: 'grid',
            'aria-label': 'Calendar',
          },
          Array.from({ length: 31 }, (_, i) =>
            React.createElement(
              'button',
              {
                key: `day-${i + 1}`,
                role: 'gridcell',
                onClick: () => {
                  const currentDate = value ? dayjs(value) : dayjs();
                  const newDate = currentDate.date(i + 1);
                  onChange?.(newDate);
                  setIsOpen(false);
                },
              },
              (i + 1).toString(),
            ),
          ),
        ),
    ]);
  }),
  DateTimePicker: vi.fn(({ value, onChange, slotProps, label, ...props }) => {
    const inputProps = slotProps?.textField?.inputProps || {};
    const nonHtmlProps = [
      'maxDate',
      'minDate',
      'timeSteps',
      'shouldDisableDate',
      'shouldDisableTime',
      'minutesStep',
      'secondsStep',
      'disableFuture',
      'disablePast',
      'ampm',
    ];
    const cleanProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !nonHtmlProps.includes(key)),
    );

    const [isOpen, setIsOpen] = React.useState(false);

    const container = React.createElement('div', {}, [
      label &&
        React.createElement(
          'label',
          { key: 'label', htmlFor: 'datetime-picker-input' },
          label,
        ),
      React.createElement('input', {
        key: 'input',
        'data-testid': inputProps['data-testid'] || 'datetime-picker',
        type: 'text', // Use text type instead of datetime-local to accept MM/DD/YYYY format
        id: label || 'datetime-picker-input',
        'aria-label': inputProps['aria-label'] || label,
        className: props.className,
        value: value
          ? typeof value === 'string'
            ? value
            : value.format?.('MM/DD/YYYY') || ''
          : '',
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          const isDayjs =
            value &&
            typeof value !== 'string' &&
            typeof (value as { format?: (format: string) => string }).format ===
              'function';
          onChange?.(newValue ? (isDayjs ? dayjs(newValue) : newValue) : null);
        },
        ...cleanProps,
      }),
      React.createElement(
        'button',
        {
          key: 'button',
          type: 'button',
          'aria-label': 'choose date and time',
          onClick: () => setIsOpen(!isOpen),
        },
        'choose date and time',
      ),
    ]);

    return container;
  }),
  TimePicker: vi.fn(({ value, onChange, slotProps, label, ...props }) => {
    const inputProps = slotProps?.textField?.inputProps || {};
    const nonHtmlProps = [
      'maxTime',
      'minTime',
      'timeSteps',
      'shouldDisableTime',
      'minutesStep',
      'secondsStep',
      'disableFuture',
      'disablePast',
      'ampm',
    ];
    const cleanProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !nonHtmlProps.includes(key)),
    );

    const [isOpen, setIsOpen] = React.useState(false);

    const container = React.createElement('div', {}, [
      label &&
        React.createElement(
          'label',
          { key: 'label', htmlFor: 'time-picker-input' },
          label,
        ),
      React.createElement('input', {
        key: 'input',
        'data-testid': inputProps['data-testid'] || 'time-picker',
        type: 'time',
        id: label || 'time-picker-input',
        'aria-label': inputProps['aria-label'] || label,
        className: props.className,
        value: value
          ? typeof value === 'string'
            ? value
            : value.format?.('HH:mm') || ''
          : '',
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          const isDayjs =
            value &&
            typeof value !== 'string' &&
            typeof (value as { format?: (format: string) => string }).format ===
              'function';
          onChange?.(newValue ? (isDayjs ? dayjs(newValue) : newValue) : null);
        },
        ...cleanProps,
      }),
      React.createElement(
        'button',
        {
          key: 'button',
          type: 'button',
          'aria-label': 'choose time',
          onClick: () => setIsOpen(!isOpen),
        },
        'choose time',
      ),

      // Time picker interface
      isOpen &&
        React.createElement(
          'div',
          {
            key: 'time-interface',
            'data-testid': 'time-picker-interface',
          },
          [
            React.createElement(
              'div',
              {
                key: 'hours-listbox',
                role: 'listbox',
                'aria-label': 'Select hours',
              },
              Array.from({ length: 24 }, (_, i) =>
                React.createElement(
                  'div',
                  {
                    key: `hour-${i}`,
                    role: 'option',
                    onClick: () => {
                      const newTime = `${i.toString().padStart(2, '0')}:${value?.format?.('mm') || '00'}`;
                      onChange?.(dayjs(newTime, 'HH:mm'));
                    },
                  },
                  i.toString(),
                ),
              ),
            ),

            React.createElement(
              'div',
              {
                key: 'minutes-listbox',
                role: 'listbox',
                'aria-label': 'Select minutes',
              },
              Array.from({ length: 60 }, (_, i) =>
                React.createElement(
                  'div',
                  {
                    key: `minute-${i}`,
                    role: 'option',
                    onClick: () => {
                      const newTime = `${value?.format?.('HH') || '00'}:${i.toString().padStart(2, '0')}`;
                      onChange?.(dayjs(newTime, 'HH:mm'));
                    },
                  },
                  i.toString().padStart(2, '0'),
                ),
              ),
            ),
          ],
        ),
    ]);

    return container;
  }),

  LocalizationProvider: vi.fn(({ children }) => {
    return React.createElement(React.Fragment, {}, children);
  }),
  default: vi.fn(({ children }) => {
    return React.createElement(React.Fragment, {}, children);
  }),
}));
