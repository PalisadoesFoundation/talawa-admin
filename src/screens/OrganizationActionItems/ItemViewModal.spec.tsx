// import React from 'react';
// import type { ApolloLink } from '@apollo/client';
// import { MockedProvider } from '@apollo/react-testing';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import type { RenderResult } from '@testing-library/react';
// import { render, screen, within } from '@testing-library/react';
// import { I18nextProvider } from 'react-i18next';
// import { Provider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
// import { store } from 'state/store';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import i18nForTest from '../../utils/i18nForTest';
// import { MOCKS } from './OrganizationActionItem.mocks';
// import { StaticMockLink } from 'utils/StaticMockLink';
// import ItemViewModal, { type InterfaceViewModalProps } from './ItemViewModal';
// import type {InterfaceActionItemInfo,
//   InterfaceEventVolunteerInfo,InterfaceActionItem,
//   InterfaceUserInfo,
//   InterfaceVolunteerGroupInfo,
// } from 'utils/interfaces';
// import { vi } from 'vitest';

// vi.mock('react-toastify', () => ({
//   toast: {
//     success: vi.fn(),
//     error: vi.fn(),
//   },
// }));

// const link1 = new StaticMockLink(MOCKS);
// const t = JSON.parse(
//   JSON.stringify(
//     i18nForTest.getDataByLanguage('en')?.translation.organizationActionItems,
//   ),
// );

// const createUser = (
//   id: string,
//   firstName: string,
//   lastName: string,
//   image?: string,
// ): InterfaceUserInfo => ({
//   _id: id,
//   firstName,
//   lastName,
//   image,
// });

// const createAssignee = (
//   user: ReturnType<typeof createUser>,
//   hasAccepted = true,
// ): InterfaceEventVolunteerInfo => ({
//   _id: `${user._id}-assignee`,
//   user,
//   assignments: [],
//   groups: [],
//   hasAccepted,
//   hoursVolunteered: 0,
// });

// const createAssigneeGroup = (
//   id: string,
//   name: string,
//   leader: ReturnType<typeof createUser>,
// ): InterfaceVolunteerGroupInfo => ({
//   _id: id,
//   name,
//   description: `${name} description`,
//   event: { _id: 'eventId1' },
//   volunteers: [],
//   assignments: [],
//   volunteersRequired: 10,
//   leader,
//   creator: leader,
//   createdAt: '2024-08-27',
// });

// const userWithImage = createUser('userId', 'Wilt', 'Shepherd', 'wilt-image');
// const userWithoutImage = createUser('userId', 'Wilt', 'Shepherd');
// const assigneeWithImage = createUser('userId1', 'John', 'Doe', 'image-url');
// const assigneeWithoutImage = createUser('userId1', 'John', 'Doe');
// const actionItemCategory = {
//   _id: 'actionItemCategoryId2',
//   name: 'Category 2',
// };

// describe('Testing ItemViewModal', () => {

// });
