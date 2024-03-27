import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import DynamicDropDown from './DynamicDropDown';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import userEvent from '@testing-library/user-event';

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('DynamicDropDown component', () => {
  test('renders with name and alt attribute', async () => {
    const [formData, setFormData] = [
      {
        fieldName: 'TEST',
      },
      jest.fn(),
    ];

    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <DynamicDropDown
            formState={formData}
            setFormState={setFormData}
            fieldOptions={[
              { value: 'TEST', label: 'label1' },
              { value: 'value2', label: 'label2' },
            ]}
            fieldName="fieldName"
          />
        </I18nextProvider>
      </BrowserRouter>,
    );
    const containterElement = screen.getByTestId(
      'fieldname-dropdown-container',
    );
    await act(async () => {
      userEvent.click(containterElement);
    });

    const optionButton = screen.getByTestId('fieldname-dropdown-btn');

    await act(async () => {
      userEvent.click(optionButton);
    });

    const optionElement = screen.getByTestId('change-fieldname-btn-TEST');
    await act(async () => {
      userEvent.click(optionElement);
    });
    await wait();
    expect(containterElement).toBeInTheDocument();
    await waitFor(() => {
      expect(optionButton).toHaveTextContent('label1');
    });
  });
});
