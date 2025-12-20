/**
 * Locates a MUI X DatePicker form control by its label text.
 * Updated to work with MUI X DatePicker which doesn't use role="group" anymore.
 * @param label - Label text to search for (case-insensitive substring match)
 * @returns The form control HTMLElement containing the date picker
 * @throws Error if no matching date picker is found
 */

import { screen } from '@testing-library/react';

export const getPickerInputByLabel = (label: string): HTMLElement => {
  const allInputs = screen.getAllByRole('textbox', { hidden: true });
  for (const input of allInputs) {
    const formControl = input.closest('.MuiFormControl-root');
    if (formControl) {
      const labelEl = formControl.querySelector('label');
      if (labelEl) {
        const labelText = labelEl.textContent?.toLowerCase() || '';
        if (labelText.includes(label.toLowerCase())) {
          return formControl as HTMLElement;
        }
      }
    }
  }
  throw new Error(`Could not find date picker for label: ${label}`);
};
