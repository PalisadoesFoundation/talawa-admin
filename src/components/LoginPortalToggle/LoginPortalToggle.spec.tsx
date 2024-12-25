import React, { act } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import LoginPortalToggle from './LoginPortalToggle';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { describe, test, vi } from 'vitest';

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing LoginPortalToggle component', () => {
  test('Component Should be rendered properly', async () => {
    const mockOnToggle = vi.fn();
    render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <LoginPortalToggle onToggle={mockOnToggle} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    await wait();
  });
});
