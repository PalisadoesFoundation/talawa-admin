import type { ReactNode } from 'react';
import React from 'react';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18n from 'i18next';

interface InterfaceTestWrapperProps {
  children: ReactNode;
  mocks?: MockedResponse[];
}

export const TestWrapper = ({
  children,
  mocks = [],
}: InterfaceTestWrapperProps): JSX.Element => (
  <MockedProvider mocks={mocks}>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>{children}</BrowserRouter>
    </I18nextProvider>
  </MockedProvider>
);
