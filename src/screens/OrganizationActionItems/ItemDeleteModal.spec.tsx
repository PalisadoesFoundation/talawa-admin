// import React from 'react';
// import type { ApolloLink } from '@apollo/client';
// import { MockedProvider } from '@apollo/react-testing';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import type { RenderResult } from '@testing-library/react';
// import {
//   fireEvent,
//   render,
//   screen,
//   waitFor,
//   act,
// } from '@testing-library/react';
// import { I18nextProvider } from 'react-i18next';
// import { Provider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
// import { store } from 'state/store';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import i18nForTest from '../../utils/i18nForTest';
// import { MOCKS, MOCKS_ERROR } from './OrganizationActionItem.mocks';
// import { StaticMockLink } from 'utils/StaticMockLink';
// import { toast } from 'react-toastify';
// import ItemDeleteModal, {
//   type InterfaceItemDeleteModalProps,
// } from './ItemDeleteModal';
// import { vi } from 'vitest';

// vi.mock('react-toastify', () => ({
//   toast: {
//     success: vi.fn(),
//     error: vi.fn(),
//   },
// }));

// const link1 = new StaticMockLink(MOCKS);
// const link2 = new StaticMockLink(MOCKS_ERROR);
// const t = JSON.parse(
//   JSON.stringify(
//     i18nForTest.getDataByLanguage('en')?.translation.organizationActionItems,
//   ),
// );

// describe('Testing ItemDeleteModal', () => {

// });
