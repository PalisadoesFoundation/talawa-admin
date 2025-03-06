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
//   within,
// } from '@testing-library/react';
// import { I18nextProvider } from 'react-i18next';
// import { Provider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
// import { store } from 'state/store';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import i18n from '../../utils/i18nForTest';
// import { MOCKS, MOCKS_ERROR } from './OrganizationActionItem.mocks';
// import { StaticMockLink } from 'utils/StaticMockLink';
// import { toast } from 'react-toastify';
// import type { InterfaceItemModalProps } from './ItemModal';
// import ItemModal from './ItemModal';
// import { vi } from 'vitest';

// vi.mock('react-toastify', () => ({
//   toast: {
//     success: vi.fn(),
//     error: vi.fn(),
//     warning: vi.fn(),
//   },
// }));

// const link1 = new StaticMockLink(MOCKS);
// const link2 = new StaticMockLink(MOCKS_ERROR);
// const t = {
//   ...JSON.parse(
//     JSON.stringify(
//       i18n.getDataByLanguage('en')?.translation.organizationActionItems ?? {},
//     ),
//   ),
//   ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
//   ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
// };

// const itemProps: InterfaceItemModalProps[] = [
//   {
//     isOpen: true,
//     hide: vi.fn(),
//     orgId: 'orgId',
//     eventId: undefined,
//     actionItemsRefetch: vi.fn(),
//     editMode: false,
//     actionItem: null,
//   },
//   {
//     isOpen: true,
//     hide: vi.fn(),
//     orgId: 'orgId',
//     eventId: 'eventId',
//     actionItemsRefetch: vi.fn(),
//     editMode: false,
//     actionItem: null,
//   },
//   {
//     isOpen: true,
//     hide: vi.fn(),
//     orgId: 'orgId',
//     eventId: undefined,
//     actionItemsRefetch: vi.fn(),
//     editMode: true,
//     actionItem: {
//       _id: 'actionItemId1',
//       assignee: null,
//       assigneeGroup: null,
//       assigneeType: 'User',
//       assigneeUser: {
//         _id: 'userId1',
//         firstName: 'Harve',
//         lastName: 'Lance',
//         image: '',
//       },
//       actionItemCategory: {
//         _id: 'categoryId1',
//         name: 'Category 1',
//       },
//       preCompletionNotes: 'Notes 1',
//       postCompletionNotes: 'Cmp Notes 1',
//       assignmentDate: new Date('2024-08-27'),
//       dueDate: new Date('2044-08-30'),
//       completionDate: new Date('2044-09-03'),
//       isCompleted: true,
//       event: null,
//       allottedHours: 24,
//       assigner: {
//         _id: 'userId2',
//         firstName: 'Wilt',
//         lastName: 'Shepherd',
//         image: undefined,
//       },
//       creator: {
//         _id: 'userId2',
//         firstName: 'Wilt',
//         lastName: 'Shepherd',
//       },
//     },
//   },
//   {
//     isOpen: true,
//     hide: vi.fn(),
//     orgId: 'orgId',
//     eventId: undefined,
//     actionItemsRefetch: vi.fn(),
//     editMode: true,
//     actionItem: {
//       _id: 'actionItemId2',
//       assignee: null,
//       assigneeGroup: null,
//       assigneeType: 'User',
//       assigneeUser: {
//         _id: 'userId2',
//         firstName: 'Wilt',
//         lastName: 'Shepherd',
//         image: '',
//       },
//       actionItemCategory: {
//         _id: 'categoryId2',
//         name: 'Category 2',
//       },
//       preCompletionNotes: 'Notes 2',
//       postCompletionNotes: null,
//       assignmentDate: new Date('2024-08-27'),
//       dueDate: new Date('2044-09-30'),
//       completionDate: new Date('2044-10-03'),
//       isCompleted: false,
//       event: null,
//       allottedHours: null,
//       assigner: {
//         _id: 'userId2',
//         firstName: 'Wilt',
//         lastName: 'Shepherd',
//         image: 'wilt-image',
//       },
//       creator: {
//         _id: 'userId2',
//         firstName: 'Wilt',
//         lastName: 'Shepherd',
//       },
//     },
//   },
//   {
//     isOpen: true,
//     hide: vi.fn(),
//     orgId: 'orgId',
//     eventId: 'eventId',
//     actionItemsRefetch: vi.fn(),
//     editMode: true,
//     actionItem: {
//       _id: 'actionItemId2',
//       assigneeType: 'EventVolunteer',
//       assignee: {
//         _id: 'volunteerId1',
//         hasAccepted: true,
//         hoursVolunteered: 0,
//         user: {
//           _id: 'userId1',
//           firstName: 'Teresa',
//           lastName: 'Bradley',
//           image: null,
//         },
//         assignments: [],
//         groups: [],
//       },
//       assigneeGroup: null,
//       assigneeUser: null,
//       actionItemCategory: {
//         id: 'categoryId2',
//         name: 'Category 2',
//       },
//       preCompletionNotes: 'Notes 2',
//       postCompletionNotes: null,
//       assignmentDate: new Date('2024-08-27'),
//       dueDate: new Date('2044-09-30'),
//       completionDate: new Date('2044-10-03'),
//       isCompleted: false,
//       event: {
//         _id: 'eventId',
//         title: 'Event 1',
//       },
//       allottedHours: null,
//       assigner: {
//         _id: 'userId2',
//         firstName: 'Wilt',
//         lastName: 'Shepherd',
//         image: 'wilt-image',
//       },
//       creator: {
//         _id: 'userId2',
//         firstName: 'Wilt',
//         lastName: 'Shepherd',
//       },
//     },
//   },
//   {
//     isOpen: true,
//     hide: vi.fn(),
//     orgId: 'orgId',
//     eventId: 'eventId',
//     actionItemsRefetch: vi.fn(),
//     editMode: true,
//     actionItem: {
//       _id: 'actionItemId2',
//       assigneeType: 'EventVolunteerGroup',
//       assigneeGroup: {
//         _id: 'groupId1',
//         name: 'group1',
//         description: 'desc',
//         volunteersRequired: 10,
//         createdAt: '2024-10-27T15:34:15.889Z',
//         creator: {
//           _id: 'userId2',
//           firstName: 'Wilt',
//           lastName: 'Shepherd',
//           image: null,
//         },
//         leader: {
//           _id: 'userId1',
//           firstName: 'Teresa',
//           lastName: 'Bradley',
//           image: null,
//         },
//         volunteers: [
//           {
//             _id: 'volunteerId1',
//             user: {
//               _id: 'userId1',
//               firstName: 'Teresa',
//               lastName: 'Bradley',
//               image: null,
//             },
//           },
//         ],
//         assignments: [],
//         event: {
//           _id: 'eventId',
//         },
//       },
//       assignee: null,
//       assigneeUser: null,
//       actionItemCategory: {
//         _id: 'categoryId2',
//         name: 'Category 2',
//       },
//       preCompletionNotes: 'Notes 2',
//       postCompletionNotes: null,
//       assignmentDate: new Date('2024-08-27'),
//       dueDate: new Date('2044-09-30'),
//       completionDate: new Date('2044-10-03'),
//       isCompleted: false,
//       event: {
//         _id: 'eventId',
//         title: 'Event 1',
//       },
//       allottedHours: null,
//       assigner: {
//         _id: 'userId2',
//         firstName: 'Wilt',
//         lastName: 'Shepherd',
//         image: 'wilt-image',
//       },
//       creator: {
//         _id: 'userId2',
//         firstName: 'Wilt',
//         lastName: 'Shepherd',
//       },
//     },
//   },
// ];

// const renderItemModal = (
//   link: ApolloLink,
//   props: InterfaceItemModalProps,
// ): RenderResult => {
//   return render(
//     <MockedProvider link={link} addTypename={false}>
//       <Provider store={store}>
//         <BrowserRouter>
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <I18nextProvider i18n={i18n}>
//               <ItemModal {...props} />
//             </I18nextProvider>
//           </LocalizationProvider>
//         </BrowserRouter>
//       </Provider>
//     </MockedProvider>,
//   );
// };

// describe('Testing ItemModal', () => {
//   it('Create Action Item (for Member)', async () => {
//     renderItemModal(link1, itemProps[0]);
//     expect(screen.getAllByText(t.createActionItem)).toHaveLength(2);

//     // Select Category 1
//     const categorySelect = await screen.findByTestId('categorySelect');
//     expect(categorySelect).toBeInTheDocument();
//     const inputField = within(categorySelect).getByRole('combobox');
//     fireEvent.mouseDown(inputField);

//     const categoryOption = await screen.findByText('Category 1');
//     expect(categoryOption).toBeInTheDocument();
//     fireEvent.click(categoryOption);

//     // Select Assignee
//     const memberSelect = await screen.findByTestId('memberSelect');
//     expect(memberSelect).toBeInTheDocument();
//     const memberInputField = within(memberSelect).getByRole('combobox');
//     fireEvent.mouseDown(memberInputField);

//     const memberOption = await screen.findByText('Harve Lance');
//     expect(memberOption).toBeInTheDocument();
//     fireEvent.click(memberOption);

//     // Select Due Date
//     fireEvent.change(screen.getByLabelText(t.dueDate), {
//       target: { value: '02/01/2044' },
//     });

//     // Select Allotted Hours (try all options)
//     const allottedHours = screen.getByLabelText(t.allottedHours);
//     const allottedHoursOptions = ['', '-1', '9'];

//     allottedHoursOptions.forEach((option) => {
//       fireEvent.change(allottedHours, { target: { value: option } });
//       expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
//     });

//     // Add Pre Completion Notes
//     fireEvent.change(screen.getByLabelText(t.preCompletionNotes), {
//       target: { value: 'Notes' },
//     });

//     // Click Submit
//     const submitButton = screen.getByTestId('submitBtn');
//     expect(submitButton).toBeInTheDocument();
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(itemProps[0].actionItemsRefetch).toHaveBeenCalled();
//       expect(itemProps[0].hide).toHaveBeenCalled();
//       expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
//     });
//   });

//   it('Create Action Item (for Volunteer)', async () => {
//     renderItemModal(link1, itemProps[1]);
//     expect(screen.getAllByText(t.createActionItem)).toHaveLength(2);

//     // Select Category 1
//     const categorySelect = await screen.findByTestId('categorySelect');
//     expect(categorySelect).toBeInTheDocument();
//     const inputField = within(categorySelect).getByRole('combobox');
//     fireEvent.mouseDown(inputField);

//     const categoryOption = await screen.findByText('Category 1');
//     expect(categoryOption).toBeInTheDocument();
//     fireEvent.click(categoryOption);

//     // Select Volunteer Role
//     const groupRadio = await screen.findByText(t.groups);
//     const individualRadio = await screen.findByText(t.individuals);
//     expect(groupRadio).toBeInTheDocument();
//     expect(individualRadio).toBeInTheDocument();
//     fireEvent.click(individualRadio);

//     // Select Individual Volunteer
//     const volunteerSelect = await screen.findByTestId('volunteerSelect');
//     expect(volunteerSelect).toBeInTheDocument();
//     const volunteerInputField = within(volunteerSelect).getByRole('combobox');
//     fireEvent.mouseDown(volunteerInputField);

//     const volunteerOption = await screen.findByText('Teresa Bradley');
//     expect(volunteerOption).toBeInTheDocument();
//     fireEvent.click(volunteerOption);

//     // Select Due Date
//     fireEvent.change(screen.getByLabelText(t.dueDate), {
//       target: { value: '02/01/2044' },
//     });

//     // Select Allotted Hours (try all options)
//     const allottedHours = screen.getByLabelText(t.allottedHours);
//     const allottedHoursOptions = ['', '-1', '9'];

//     allottedHoursOptions.forEach((option) => {
//       fireEvent.change(allottedHours, { target: { value: option } });
//       expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
//     });

//     // Add Pre Completion Notes
//     fireEvent.change(screen.getByLabelText(t.preCompletionNotes), {
//       target: { value: 'Notes' },
//     });

//     // Click Submit
//     const submitButton = screen.getByTestId('submitBtn');
//     expect(submitButton).toBeInTheDocument();
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(itemProps[1].actionItemsRefetch).toHaveBeenCalled();
//       expect(itemProps[1].hide).toHaveBeenCalled();
//       expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
//     });
//   });

//   it('Create Action Item (for Group)', async () => {
//     renderItemModal(link1, itemProps[1]);
//     expect(screen.getAllByText(t.createActionItem)).toHaveLength(2);

//     // Select Category 1
//     const categorySelect = await screen.findByTestId('categorySelect');
//     expect(categorySelect).toBeInTheDocument();
//     const inputField = within(categorySelect).getByRole('combobox');
//     fireEvent.mouseDown(inputField);

//     const categoryOption = await screen.findByText('Category 1');
//     expect(categoryOption).toBeInTheDocument();
//     fireEvent.click(categoryOption);

//     // Select Volunteer Role
//     const groupRadio = await screen.findByText(t.groups);
//     const individualRadio = await screen.findByText(t.individuals);
//     expect(groupRadio).toBeInTheDocument();
//     expect(individualRadio).toBeInTheDocument();
//     fireEvent.click(groupRadio);

//     // Select Individual Volunteer
//     const groupSelect = await screen.findByTestId('volunteerGroupSelect');
//     expect(groupSelect).toBeInTheDocument();
//     const groupInputField = within(groupSelect).getByRole('combobox');
//     fireEvent.mouseDown(groupInputField);

//     const groupOption = await screen.findByText('group1');
//     expect(groupOption).toBeInTheDocument();
//     fireEvent.click(groupOption);

//     // Select Due Date
//     fireEvent.change(screen.getByLabelText(t.dueDate), {
//       target: { value: '02/01/2044' },
//     });

//     // Select Allotted Hours (try all options)
//     const allottedHours = screen.getByLabelText(t.allottedHours);
//     const allottedHoursOptions = ['', '-1', '9'];

//     allottedHoursOptions.forEach((option) => {
//       fireEvent.change(allottedHours, { target: { value: option } });
//       expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
//     });

//     // Add Pre Completion Notes
//     fireEvent.change(screen.getByLabelText(t.preCompletionNotes), {
//       target: { value: 'Notes' },
//     });

//     // Click Submit
//     const submitButton = screen.getByTestId('submitBtn');
//     expect(submitButton).toBeInTheDocument();
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(itemProps[1].actionItemsRefetch).toHaveBeenCalled();
//       expect(itemProps[1].hide).toHaveBeenCalled();
//       expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
//     });
//   });

//   it('Update Action Item (completed)', async () => {
//     renderItemModal(link1, itemProps[2]);
//     expect(screen.getAllByText(t.updateActionItem)).toHaveLength(2);

//     // Update Category
//     const categorySelect = await screen.findByTestId('categorySelect');
//     expect(categorySelect).toBeInTheDocument();
//     const inputField = within(categorySelect).getByRole('combobox');
//     fireEvent.mouseDown(inputField);

//     const categoryOption = await screen.findByText('Category 2');
//     expect(categoryOption).toBeInTheDocument();
//     fireEvent.click(categoryOption);

//     // Update Allotted Hours (try all options)
//     const allottedHours = screen.getByLabelText(t.allottedHours);
//     const allottedHoursOptions = ['', '-1', '19'];

//     allottedHoursOptions.forEach((option) => {
//       fireEvent.change(allottedHours, { target: { value: option } });
//       expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
//     });

//     // Update Post Completion Notes
//     fireEvent.change(screen.getByLabelText(t.postCompletionNotes), {
//       target: { value: 'Cmp Notes 2' },
//     });

//     // Click Submit
//     const submitButton = screen.getByTestId('submitBtn');
//     expect(submitButton).toBeInTheDocument();
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(itemProps[2].actionItemsRefetch).toHaveBeenCalled();
//       expect(itemProps[2].hide).toHaveBeenCalled();
//       expect(toast.success).toHaveBeenCalledWith(t.successfulUpdation);
//     });
//   });

//   it('should preserve the assignee when updating other fields', async () => {
//     renderItemModal(link1, itemProps[2]);

//     // Update category
//     const categorySelect = await screen.findByTestId('categorySelect');
//     const inputField = within(categorySelect).getByRole('combobox');
//     fireEvent.mouseDown(inputField);
//     const categoryOption = await screen.findByText('Category 2');
//     fireEvent.click(categoryOption);

//     // Update allotted hours to match mock
//     const allottedHours = screen.getByLabelText(t.allottedHours);
//     fireEvent.change(allottedHours, { target: { value: '19' } });

//     // Update post completion notes to match mock
//     const postCompletionNotes = screen.getByLabelText(t.postCompletionNotes);
//     fireEvent.change(postCompletionNotes, { target: { value: 'Cmp Notes 2' } });

//     // Submit the form
//     const submitButton = screen.getByTestId('submitBtn');
//     fireEvent.click(submitButton);

//     // Verify successful update
//     await waitFor(() => {
//       expect(itemProps[2].actionItemsRefetch).toHaveBeenCalled();
//       expect(itemProps[2].hide).toHaveBeenCalled();
//       expect(toast.success).toHaveBeenCalledWith(t.successfulUpdation);
//     });
//   });

//   it('Update Action Item (Volunteer)', async () => {
//     renderItemModal(link1, itemProps[4]);
//     expect(screen.getAllByText(t.updateActionItem)).toHaveLength(2);

//     // Update Category
//     const categorySelect = await screen.findByTestId('categorySelect');
//     expect(categorySelect).toBeInTheDocument();
//     const inputField = within(categorySelect).getByRole('combobox');
//     fireEvent.mouseDown(inputField);

//     const categoryOption = await screen.findByText('Category 1');
//     expect(categoryOption).toBeInTheDocument();
//     fireEvent.click(categoryOption);

//     // Select Volunteer Role
//     const groupRadio = await screen.findByText(t.groups);
//     const individualRadio = await screen.findByText(t.individuals);
//     expect(groupRadio).toBeInTheDocument();
//     expect(individualRadio).toBeInTheDocument();
//     fireEvent.click(individualRadio);

//     // Select Individual Volunteer
//     const volunteerSelect = await screen.findByTestId('volunteerSelect');
//     expect(volunteerSelect).toBeInTheDocument();
//     const volunteerInputField = within(volunteerSelect).getByRole('combobox');
//     fireEvent.mouseDown(volunteerInputField);

//     // Select Invalid User with no _id
//     const invalidVolunteerOption = await screen.findByText('Invalid User');
//     expect(invalidVolunteerOption).toBeInTheDocument();
//     fireEvent.click(invalidVolunteerOption);

//     fireEvent.mouseDown(volunteerInputField);
//     const volunteerOption = await screen.findByText('Bruce Graza');
//     expect(volunteerOption).toBeInTheDocument();
//     fireEvent.click(volunteerOption);

//     // Update Allotted Hours (try all options)
//     const allottedHours = screen.getByLabelText(t.allottedHours);
//     const allottedHoursOptions = ['', '-1', '19'];

//     allottedHoursOptions.forEach((option) => {
//       fireEvent.change(allottedHours, { target: { value: option } });
//       expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
//     });

//     // Click Submit
//     const submitButton = screen.getByTestId('submitBtn');
//     expect(submitButton).toBeInTheDocument();
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(itemProps[4].actionItemsRefetch).toHaveBeenCalled();
//       expect(itemProps[4].hide).toHaveBeenCalled();
//       expect(toast.success).toHaveBeenCalledWith(t.successfulUpdation);
//     });
//   });

//   it('Update Action Item (Group)', async () => {
//     renderItemModal(link1, itemProps[5]);
//     expect(screen.getAllByText(t.updateActionItem)).toHaveLength(2);

//     // Update Category
//     const categorySelect = await screen.findByTestId('categorySelect');
//     expect(categorySelect).toBeInTheDocument();
//     const inputField = within(categorySelect).getByRole('combobox');
//     fireEvent.mouseDown(inputField);

//     // Select Invalid Category with no _id
//     const invalidCategoryOption = await screen.findByText('Category 3');
//     expect(invalidCategoryOption).toBeInTheDocument();
//     fireEvent.click(invalidCategoryOption);

//     fireEvent.mouseDown(inputField);
//     const categoryOption = await screen.findByText('Category 1');
//     expect(categoryOption).toBeInTheDocument();
//     fireEvent.click(categoryOption);

//     // Select Volunteer Role
//     const groupRadio = await screen.findByText(t.groups);
//     const individualRadio = await screen.findByText(t.individuals);
//     expect(groupRadio).toBeInTheDocument();
//     expect(individualRadio).toBeInTheDocument();
//     fireEvent.click(groupRadio);

//     // Select Individual Volunteer
//     const groupSelect = await screen.findByTestId('volunteerGroupSelect');
//     expect(groupSelect).toBeInTheDocument();
//     const groupInputField = within(groupSelect).getByRole('combobox');
//     fireEvent.mouseDown(groupInputField);

//     // Select Invalid Group with no _id
//     const invalidGroupOption = await screen.findByText('group3');
//     expect(invalidGroupOption).toBeInTheDocument();
//     fireEvent.click(invalidGroupOption);

//     fireEvent.mouseDown(groupInputField);
//     const groupOption = await screen.findByText('group2');
//     expect(groupOption).toBeInTheDocument();
//     fireEvent.click(groupOption);

//     // Update Allotted Hours (try all options)
//     const allottedHours = screen.getByLabelText(t.allottedHours);
//     const allottedHoursOptions = ['', '-1', '19'];

//     allottedHoursOptions.forEach((option) => {
//       fireEvent.change(allottedHours, { target: { value: option } });
//       expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
//     });

//     // Click Submit
//     const submitButton = screen.getByTestId('submitBtn');
//     expect(submitButton).toBeInTheDocument();
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(itemProps[5].actionItemsRefetch).toHaveBeenCalled();
//       expect(itemProps[5].hide).toHaveBeenCalled();
//       expect(toast.success).toHaveBeenCalledWith(t.successfulUpdation);
//     });
//   });

//   it('Update Action Item (Volunteer -> Group)', async () => {
//     renderItemModal(link1, itemProps[4]);
//     expect(screen.getAllByText(t.updateActionItem)).toHaveLength(2);

//     // Update Category
//     const categorySelect = await screen.findByTestId('categorySelect');
//     expect(categorySelect).toBeInTheDocument();
//     const inputField = within(categorySelect).getByRole('combobox');
//     fireEvent.mouseDown(inputField);

//     const categoryOption = await screen.findByText('Category 1');
//     expect(categoryOption).toBeInTheDocument();
//     fireEvent.click(categoryOption);

//     // Select Volunteer Role
//     const groupRadio = await screen.findByText(t.groups);
//     const individualRadio = await screen.findByText(t.individuals);
//     expect(groupRadio).toBeInTheDocument();
//     expect(individualRadio).toBeInTheDocument();
//     fireEvent.click(groupRadio);

//     // Select Individual Volunteer
//     const groupSelect = await screen.findByTestId('volunteerGroupSelect');
//     expect(groupSelect).toBeInTheDocument();
//     const groupInputField = within(groupSelect).getByRole('combobox');
//     fireEvent.mouseDown(groupInputField);

//     const groupOption = await screen.findByText('group2');
//     expect(groupOption).toBeInTheDocument();
//     fireEvent.click(groupOption);

//     // Update Allotted Hours (try all options)
//     const allottedHours = screen.getByLabelText(t.allottedHours);
//     const allottedHoursOptions = ['', '-1', '19'];

//     allottedHoursOptions.forEach((option) => {
//       fireEvent.change(allottedHours, { target: { value: option } });
//       expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
//     });

//     // Click Submit
//     const submitButton = screen.getByTestId('submitBtn');
//     expect(submitButton).toBeInTheDocument();
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(itemProps[4].actionItemsRefetch).toHaveBeenCalled();
//       expect(itemProps[4].hide).toHaveBeenCalled();
//       expect(toast.success).toHaveBeenCalledWith(t.successfulUpdation);
//     });
//   });

//   it('Update Action Item (not completed)', async () => {
//     renderItemModal(link1, itemProps[3]);
//     expect(screen.getAllByText(t.updateActionItem)).toHaveLength(2);

//     // Update Category
//     const categorySelect = await screen.findByTestId('categorySelect');
//     expect(categorySelect).toBeInTheDocument();
//     const inputField = within(categorySelect).getByRole('combobox');
//     fireEvent.mouseDown(inputField);

//     const categoryOption = await screen.findByText('Category 1');
//     expect(categoryOption).toBeInTheDocument();
//     fireEvent.click(categoryOption);

//     // Update Assignee
//     const memberSelect = await screen.findByTestId('memberSelect');
//     expect(memberSelect).toBeInTheDocument();
//     const memberInputField = within(memberSelect).getByRole('combobox');
//     fireEvent.mouseDown(memberInputField);

//     // Select invalid member with no _id
//     const invalidMemberOption = await screen.findByText('Invalid User');
//     expect(invalidMemberOption).toBeInTheDocument();
//     fireEvent.click(invalidMemberOption);

//     fireEvent.mouseDown(memberInputField);
//     const memberOption = await screen.findByText('Harve Lance');
//     expect(memberOption).toBeInTheDocument();
//     fireEvent.click(memberOption);

//     // Update Allotted Hours (try all options)
//     const allottedHours = screen.getByLabelText(t.allottedHours);
//     const allottedHoursOptions = ['', '-1', '19'];

//     allottedHoursOptions.forEach((option) => {
//       fireEvent.change(allottedHours, { target: { value: option } });
//       expect(allottedHours).toHaveValue(parseInt(option) > 0 ? option : '');
//     });

//     // Update Due Date
//     fireEvent.change(screen.getByLabelText(t.dueDate), {
//       target: { value: '02/01/2044' },
//     });

//     // Update Pre Completion Notes
//     fireEvent.change(screen.getByLabelText(t.preCompletionNotes), {
//       target: { value: 'Notes 3' },
//     });

//     // Click Submit
//     const submitButton = screen.getByTestId('submitBtn');
//     expect(submitButton).toBeInTheDocument();
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(itemProps[3].actionItemsRefetch).toHaveBeenCalled();
//       expect(itemProps[3].hide).toHaveBeenCalled();
//       expect(toast.success).toHaveBeenCalledWith(t.successfulUpdation);
//     });
//   });

//   it('Try adding negative Allotted Hours', async () => {
//     renderItemModal(link1, itemProps[0]);
//     expect(screen.getAllByText(t.createActionItem)).toHaveLength(2);
//     const allottedHours = screen.getByLabelText(t.allottedHours);
//     fireEvent.change(allottedHours, { target: { value: '-1' } });

//     await waitFor(() => {
//       expect(allottedHours).toHaveValue('');
//     });

//     fireEvent.change(allottedHours, { target: { value: '' } });

//     await waitFor(() => {
//       expect(allottedHours).toHaveValue('');
//     });

//     fireEvent.change(allottedHours, { target: { value: '0' } });
//     await waitFor(() => {
//       expect(allottedHours).toHaveValue('0');
//     });

//     fireEvent.change(allottedHours, { target: { value: '19' } });
//     await waitFor(() => {
//       expect(allottedHours).toHaveValue('19');
//     });
//   });

//   it('handles infinite for allottedHours', async () => {
//     renderItemModal(link1, itemProps[0]);
//     const hoursInput = screen.getByLabelText(t.allottedHours);

//     // Required field setup for form submission
//     const categorySelect = screen.getByTestId('categorySelect');
//     fireEvent.mouseDown(within(categorySelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Category 1'));

//     const memberSelect = screen.getByTestId('memberSelect');
//     fireEvent.mouseDown(within(memberSelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Harve Lance'));

//     // Test Infinity
//     fireEvent.change(hoursInput, { target: { value: Infinity } });
//     expect(hoursInput).toHaveValue('');

//     // Test -Infinity
//     fireEvent.change(hoursInput, { target: { value: -Infinity } });
//     expect(hoursInput).toHaveValue('');

//     // Test Number.POSITIVE_INFINITY and Number.NEGATIVE_INFINITY
//     fireEvent.change(hoursInput, {
//       target: { value: Number.POSITIVE_INFINITY },
//     });
//     expect(hoursInput).toHaveValue('');

//     fireEvent.change(hoursInput, {
//       target: { value: Number.NEGATIVE_INFINITY },
//     });
//     expect(hoursInput).toHaveValue('');
//   });

//   it('should not allow letters or negative values in allotted hours', async () => {
//     renderItemModal(link1, itemProps[0]);
//     const hoursInput = screen.getByLabelText(t.allottedHours);
//     expect(hoursInput).toBeInTheDocument();

//     // Test letter input
//     fireEvent.change(hoursInput, { target: { value: 'abc' } });
//     await waitFor(() => {
//       expect(hoursInput).toHaveValue('');
//     });

//     // Test negative value
//     fireEvent.change(hoursInput, { target: { value: '-5' } });
//     await waitFor(() => {
//       expect(hoursInput).toHaveValue('');
//     });

//     // Test zero as boundary
//     fireEvent.change(hoursInput, { target: { value: '0' } });
//     await waitFor(() => {
//       expect(hoursInput).toHaveValue('0');
//     });

//     // Test maximum allowed value
//     fireEvent.change(hoursInput, { target: { value: '999999' } });
//     await waitFor(() => {
//       expect(hoursInput).toHaveValue('999999');
//     });
//   });

//   it('validates allotted hours maximum values', async () => {
//     renderItemModal(link1, itemProps[0]);
//     const hoursInput = screen.getByLabelText(t.allottedHours);

//     // Test various large values
//     const testCases = [
//       { input: '9007199254740991', expected: '9007199254740991' }, // MAX_SAFE_INTEGER
//       { input: '9007199254740992', expected: '9007199254740992' }, // MAX_SAFE_INTEGER + 1
//     ];

//     for (const { input, expected } of testCases) {
//       fireEvent.change(hoursInput, { target: { value: input } });
//       await waitFor(() => {
//         expect(hoursInput).toHaveValue(expected);
//       });
//     }

//     // Test that reasonable large values are still accepted
//     const validLargeValues = ['1000', '9999', '99999'];
//     for (const value of validLargeValues) {
//       fireEvent.change(hoursInput, { target: { value } });
//       await waitFor(() => {
//         expect(hoursInput).toHaveValue(value);
//       });
//     }
//   });

//   it('validates allottedHours edge cases', async () => {
//     renderItemModal(link1, itemProps[0]);
//     const allottedHours = screen.getByLabelText(t.allottedHours);

//     // Test invalid string
//     fireEvent.change(allottedHours, { target: { value: 'invalid' } });
//     expect(allottedHours).toHaveValue('');

//     // Test NaN
//     fireEvent.change(allottedHours, { target: { value: NaN } });
//     expect(allottedHours).toHaveValue('');

//     // Test negative number
//     fireEvent.change(allottedHours, { target: { value: -5 } });
//     expect(allottedHours).toHaveValue('');

//     // Test boundary values
//     fireEvent.change(allottedHours, {
//       target: { value: Number.MAX_SAFE_INTEGER },
//     });
//     expect(allottedHours).toHaveValue('9007199254740991');

//     // Test decimal values - according to the component's implementation,
//     // it uses parseInt() so decimals should be truncated
//     fireEvent.change(allottedHours, { target: { value: 5.7 } });
//     expect(allottedHours).toHaveValue('5');

//     // Required fields for form submission
//     const categorySelect = screen.getByTestId('categorySelect');
//     fireEvent.mouseDown(within(categorySelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Category 1'));

//     const memberSelect = screen.getByTestId('memberSelect');
//     fireEvent.mouseDown(within(memberSelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Harve Lance'));

//     // Test form submission with valid number
//     fireEvent.change(allottedHours, { target: { value: 10 } });
//     const submitButton = screen.getByTestId('submitBtn');
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
//     });
//   });

//   it('should fail to Create Action Item', async () => {
//     renderItemModal(link2, itemProps[0]);
//     // Click Submit
//     const submitButton = screen.getByTestId('submitBtn');
//     expect(submitButton).toBeInTheDocument();
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
//     });
//   });

//   it('handles empty strings in all text fields', async () => {
//     renderItemModal(link1, itemProps[0]);

//     // Fill required fields first since they're needed for form submission
//     const categorySelect = screen.getByTestId('categorySelect');
//     fireEvent.mouseDown(within(categorySelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Category 1'));

//     const memberSelect = screen.getByTestId('memberSelect');
//     fireEvent.mouseDown(within(memberSelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Harve Lance'));

//     // Test empty strings in optional fields
//     const preCompletionNotes = screen.getByLabelText(t.preCompletionNotes);
//     fireEvent.change(preCompletionNotes, { target: { value: '' } });
//     expect(preCompletionNotes).toHaveValue('');

//     const allottedHours = screen.getByLabelText(t.allottedHours);
//     fireEvent.change(allottedHours, { target: { value: '' } });
//     expect(allottedHours).toHaveValue('');

//     // Submit form
//     const submitButton = screen.getByTestId('submitBtn');
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
//       // Verify optional fields remain empty after submission
//       expect(preCompletionNotes).toHaveValue('');
//       expect(allottedHours).toHaveValue('');
//     });
//   });

//   it('handles whitespace-only strings', async () => {
//     renderItemModal(link1, itemProps[0]);

//     // Select Category 1
//     const categorySelect = screen.getByTestId('categorySelect');
//     fireEvent.mouseDown(within(categorySelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Category 1'));

//     // Select assignee
//     const memberSelect = screen.getByTestId('memberSelect');
//     fireEvent.mouseDown(within(memberSelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Harve Lance'));

//     const preCompletionNotes = screen.getByLabelText(t.preCompletionNotes);

//     // Test various whitespace combinations
//     fireEvent.change(preCompletionNotes, { target: { value: '   ' } });
//     expect(preCompletionNotes).toHaveValue('   ');

//     // Test leading/trailing whitespace
//     fireEvent.change(preCompletionNotes, { target: { value: '  test  ' } });
//     expect(preCompletionNotes).toHaveValue('  test  ');

//     // Test multiple consecutive spaces
//     fireEvent.change(preCompletionNotes, { target: { value: 'test    test' } });
//     expect(preCompletionNotes).toHaveValue('test    test');

//     // Test tab characters
//     fireEvent.change(preCompletionNotes, { target: { value: '\ttest\t' } });
//     expect(preCompletionNotes).toHaveValue('\ttest\t');

//     const submitButton = screen.getByTestId('submitBtn');
//     fireEvent.click(submitButton);
//     await waitFor(() => {
//       expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
//     });
//   });

//   it('handles special characters in text fields', async () => {
//     renderItemModal(link1, itemProps[0]);

//     // Select Category 1
//     const categorySelect = screen.getByTestId('categorySelect');
//     fireEvent.mouseDown(within(categorySelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Category 1'));

//     // Select assignee
//     const memberSelect = screen.getByTestId('memberSelect');
//     fireEvent.mouseDown(within(memberSelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Harve Lance'));

//     const preCompletionNotes = screen.getByLabelText(t.preCompletionNotes);

//     // Test basic special characters
//     fireEvent.change(preCompletionNotes, {
//       target: { value: '!@#$%^&*()_+-=[]{}|;:,.<>?' },
//     });
//     expect(preCompletionNotes).toHaveValue('!@#$%^&*()_+-=[]{}|;:,.<>?');

//     // Test Unicode characters including emojis and international characters
//     fireEvent.change(preCompletionNotes, {
//       target: { value: '🚀 Unicode Test 你好 ñ é è ü ö 한글 עברית العربية' },
//     });
//     expect(preCompletionNotes).toHaveValue(
//       '🚀 Unicode Test 你好 ñ é è ü ö 한글 עברית العربية',
//     );

//     // Test HTML-like content
//     fireEvent.change(preCompletionNotes, {
//       target: { value: '<div>Test</div> <script>alert("test")</script>' },
//     });
//     expect(preCompletionNotes).toHaveValue(
//       '<div>Test</div> <script>alert("test")</script>',
//     );

//     // Test SQL-like characters and quotes
//     fireEvent.change(preCompletionNotes, {
//       target: { value: '\'; DROP TABLE users; -- "quoted" text\'s test' },
//     });
//     expect(preCompletionNotes).toHaveValue(
//       '\'; DROP TABLE users; -- "quoted" text\'s test',
//     );

//     // Test mathematical and currency symbols
//     fireEvent.change(preCompletionNotes, {
//       target: { value: '∑ π ∆ ∞ € £ ¥ ₹ ± ≠ ≈ ∴ ∵' },
//     });
//     expect(preCompletionNotes).toHaveValue('∑ π ∆ ∞ € £ ¥ ₹ ± ≠ ≈ ∴ ∵');

//     const submitButton = screen.getByTestId('submitBtn');
//     fireEvent.click(submitButton);
//     await waitFor(() => {
//       expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
//       // Verify the last special character value persists after submission
//       expect(preCompletionNotes).toHaveValue('∑ π ∆ ∞ € £ ¥ ₹ ± ≠ ≈ ∴ ∵');
//     });
//   });

//   it('handles extremely long text input', async () => {
//     renderItemModal(link1, itemProps[0]);

//     // Select Category
//     const categorySelect = screen.getByTestId('categorySelect');
//     fireEvent.mouseDown(within(categorySelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Category 1'));

//     // Select assignee
//     const memberSelect = screen.getByTestId('memberSelect');
//     fireEvent.mouseDown(within(memberSelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Harve Lance'));

//     const preCompletionNotes = screen.getByLabelText(t.preCompletionNotes);

//     // Test various lengths
//     const lengths = [100, 500, 1000, 5000, 10000];
//     for (const length of lengths) {
//       fireEvent.change(preCompletionNotes, {
//         target: { value: 'a'.repeat(length) },
//       });
//       expect(preCompletionNotes).toHaveValue('a'.repeat(length));
//     }

//     // Test with long repeated words
//     const longWords = Array(100)
//       .fill('supercalifragilisticexpialidocious')
//       .join(' ');
//     fireEvent.change(preCompletionNotes, {
//       target: { value: longWords },
//     });
//     expect(preCompletionNotes).toHaveValue(longWords);

//     // Verify form submission with long text
//     const submitButton = screen.getByTestId('submitBtn');
//     fireEvent.click(submitButton);
//     await waitFor(() => {
//       expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
//       // Verify the long text persists after submission
//       expect(preCompletionNotes).toHaveValue(longWords);
//     });
//   });

//   it('handles rapid form field changes', async () => {
//     renderItemModal(link1, itemProps[0]);

//     // Required fields setup
//     const categorySelect = screen.getByTestId('categorySelect');
//     fireEvent.mouseDown(within(categorySelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Category 1'));

//     const memberSelect = screen.getByTestId('memberSelect');
//     fireEvent.mouseDown(within(memberSelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Harve Lance'));

//     const hoursInput = screen.getByLabelText(t.allottedHours);

//     // Test rapid sequential changes
//     const values = Array.from({ length: 100 }, (_, i) => i.toString());

//     // Fire all changes in immediate succession
//     values.forEach((value) => {
//       fireEvent.change(hoursInput, { target: { value } });
//       expect(hoursInput).toHaveValue(value);
//     });

//     // Test rapid changes with special values interspersed
//     const mixedValues = [
//       '50',
//       '', // Empty value
//       '51',
//       'abc', // Invalid value
//       '52',
//       '-1', // Negative value
//       '53',
//       '99999', // Large value
//       '54',
//     ];

//     mixedValues.forEach((value) => {
//       fireEvent.change(hoursInput, { target: { value } });
//       // For valid numbers, should have the value
//       // For invalid/empty/negative values, should be empty
//       const expectedValue = /^\d+$/.test(value) ? value : '';
//       expect(hoursInput).toHaveValue(expectedValue);
//     });

//     // Verify final value after rapid changes
//     expect(hoursInput).toHaveValue('54');

//     // Test rapid changes to multiple fields simultaneously
//     const preCompletionNotes = screen.getByLabelText(t.preCompletionNotes);

//     // Rapidly alternate between changing hours and notes
//     for (let i = 0; i < 10; i++) {
//       fireEvent.change(hoursInput, { target: { value: i.toString() } });
//       fireEvent.change(preCompletionNotes, { target: { value: `Note ${i}` } });

//       expect(hoursInput).toHaveValue(i.toString());
//       expect(preCompletionNotes).toHaveValue(`Note ${i}`);
//     }

//     const submitButton = screen.getByTestId('submitBtn');
//     fireEvent.click(submitButton);
//     await waitFor(() => {
//       expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
//       // Verify final values persist after submission
//       expect(hoursInput).toHaveValue('9');
//       expect(preCompletionNotes).toHaveValue('Note 9');
//     });
//   });

//   it('No Fields Updated while Updating', async () => {
//     renderItemModal(link2, itemProps[2]);
//     // Click Submit
//     const submitButton = screen.getByTestId('submitBtn');
//     expect(submitButton).toBeInTheDocument();
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(toast.warning).toHaveBeenCalledWith(t.noneUpdated);
//     });
//   });

//   //checking for empty and null values
//   it('handles empty and null form values correctly', async () => {
//     renderItemModal(link1, itemProps[0]);

//     const allottedHours = screen.getByLabelText(t.allottedHours);
//     const preCompletionNotes = screen.getByLabelText(t.preCompletionNotes);

//     // Test empty values
//     fireEvent.change(allottedHours, { target: { value: '' } });
//     expect(allottedHours).toHaveValue('');

//     fireEvent.change(preCompletionNotes, { target: { value: '' } });
//     expect(preCompletionNotes).toHaveValue('');

//     // Test null values
//     fireEvent.change(allottedHours, { target: { value: null } });
//     expect(allottedHours).toHaveValue('');

//     fireEvent.change(preCompletionNotes, { target: { value: null } });
//     expect(preCompletionNotes).toHaveValue('');

//     // Test undefined values
//     fireEvent.change(allottedHours, { target: { value: undefined } });
//     expect(allottedHours).toHaveValue('');

//     fireEvent.change(preCompletionNotes, { target: { value: undefined } });
//     expect(preCompletionNotes).toHaveValue('');

//     // Test form submission with missing required fields
//     const submitButton = screen.getByTestId('submitBtn');
//     fireEvent.click(submitButton);

//     // Form should not submit without required fields
//     await waitFor(() => {
//       // Verify required fields are marked as required
//       const categorySelect = screen.getByTestId('categorySelect');
//       const categoryInput = within(categorySelect).getByRole('combobox');
//       expect(categoryInput).toBeRequired();

//       // Verify form values remain empty
//       expect(allottedHours).toHaveValue('');
//       expect(preCompletionNotes).toHaveValue('');
//     });

//     // Fill required fields and test submission
//     const categorySelect = screen.getByTestId('categorySelect');
//     fireEvent.mouseDown(within(categorySelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Category 1'));

//     const memberSelect = screen.getByTestId('memberSelect');
//     fireEvent.mouseDown(within(memberSelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Harve Lance'));

//     // Submit form with empty optional fields
//     fireEvent.click(submitButton);
//     await waitFor(() => {
//       expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
//       // Verify optional fields remain empty after successful submission
//       expect(allottedHours).toHaveValue('');
//       expect(preCompletionNotes).toHaveValue('');
//     });
//   });

//   // validation of catergory selection
//   it('validates category selection', async () => {
//     renderItemModal(link1, itemProps[0]);

//     const categorySelect = await screen.findByTestId('categorySelect');
//     const inputField = within(categorySelect).getByRole('combobox');

//     // Test initial state and required validation
//     const submitButton = screen.getByTestId('submitBtn');
//     fireEvent.click(submitButton);
//     expect(inputField).toBeRequired();

//     // Test valid category selection
//     fireEvent.mouseDown(inputField);
//     const categoryOption = await screen.findByText('Category 1');
//     fireEvent.click(categoryOption);
//     expect(inputField).toHaveValue('Category 1');

//     // Test direct input of invalid category
//     fireEvent.change(inputField, { target: { value: 'Invalid Category' } });
//     // Autocomplete should show no options for invalid input
//     await waitFor(() => {
//       expect(screen.queryByText('Invalid Category')).not.toBeInTheDocument();
//     });

//     // Clear selection
//     fireEvent.change(inputField, { target: { value: '' } });
//     fireEvent.blur(inputField);
//     expect(inputField).toHaveValue('');

//     // Test cycling through multiple valid categories
//     const validCategories = ['Category 1', 'Category 2'];
//     for (const category of validCategories) {
//       fireEvent.mouseDown(inputField);
//       const option = await screen.findByText(category);
//       fireEvent.click(option);
//       expect(inputField).toHaveValue(category);
//     }

//     // Test form submission with valid category
//     const memberSelect = screen.getByTestId('memberSelect');
//     fireEvent.mouseDown(within(memberSelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Harve Lance'));

//     fireEvent.click(submitButton);
//     await waitFor(() => {
//       expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
//     });
//   });

//   // changing of assignee type handling
//   it('handles assignee type changes correctly', async () => {
//     renderItemModal(link1, itemProps[1]);

//     // First select required category
//     const categorySelect = screen.getByTestId('categorySelect');
//     fireEvent.mouseDown(within(categorySelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Category 1'));

//     // Test individual volunteer selection
//     const groupRadio = await screen.findByText(t.groups);
//     const individualRadio = await screen.findByText(t.individuals);

//     fireEvent.click(individualRadio);
//     const volunteerSelect = await screen.findByTestId('volunteerSelect');
//     expect(volunteerSelect).toBeInTheDocument();

//     // Test selecting an individual volunteer
//     const volunteerInput = within(volunteerSelect).getByRole('combobox');
//     fireEvent.mouseDown(volunteerInput);
//     fireEvent.click(await screen.findByText('Teresa Bradley'));
//     expect(volunteerInput).toHaveValue('Teresa Bradley');

//     // Test switching to group selection
//     fireEvent.click(groupRadio);
//     const groupSelect = await screen.findByTestId('volunteerGroupSelect');
//     expect(groupSelect).toBeInTheDocument();

//     // Test selecting a group
//     const groupInput = within(groupSelect).getByRole('combobox');
//     fireEvent.mouseDown(groupInput);
//     fireEvent.click(await screen.findByText('group1'));
//     expect(groupInput).toHaveValue('group1');

//     // Test switching back to individual
//     fireEvent.click(individualRadio);
//     const newVolunteerSelect = await screen.findByTestId('volunteerSelect');
//     expect(newVolunteerSelect).toBeInTheDocument();

//     // Test submission without selection
//     const newVolunteerInput = within(newVolunteerSelect).getByRole('combobox');
//     const submitButton = screen.getByTestId('submitBtn');
//     fireEvent.change(newVolunteerInput, { target: { value: '' } });
//     fireEvent.blur(newVolunteerInput);
//     fireEvent.click(submitButton);
//     await waitFor(() => {
//       expect(newVolunteerInput).toBeRequired();
//     });
//   });

//   // for handling null change of date
//   it('handles date changes correctly', async () => {
//     renderItemModal(link1, itemProps[0]);

//     // First select required fields
//     const categorySelect = screen.getByTestId('categorySelect');
//     fireEvent.mouseDown(within(categorySelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Category 1'));

//     const memberSelect = screen.getByTestId('memberSelect');
//     fireEvent.mouseDown(within(memberSelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Harve Lance'));

//     const dateInput = screen.getByLabelText(t.dueDate);

//     // Test past date input
//     const pastDate = '01/01/2020';
//     fireEvent.change(dateInput, { target: { value: pastDate } });
//     expect(dateInput).toHaveValue(pastDate);

//     // Test valid future date
//     const futureDate = '01/01/2025';
//     fireEvent.change(dateInput, { target: { value: futureDate } });
//     expect(dateInput).toHaveValue(futureDate);

//     // Test form submission with valid date
//     const submitButton = screen.getByTestId('submitBtn');
//     fireEvent.click(submitButton);
//     await waitFor(() => {
//       expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
//     });
//   });

//   // for handling form state changes and validations
//   it('handles all form state changes and validations', async () => {
//     renderItemModal(link1, itemProps[1]);

//     // Test category selection
//     const categorySelect = screen.getByTestId('categorySelect');
//     fireEvent.mouseDown(within(categorySelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Category 1'));

//     // Test assignee type changes
//     const groupRadio = screen.getByLabelText(t.groups);
//     fireEvent.click(groupRadio);

//     const groupSelect = await screen.getByTestId('volunteerGroupSelect');
//     fireEvent.mouseDown(within(groupSelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('group1'));

//     // Test date changes
//     const dateInput = screen.getByLabelText(t.dueDate);
//     fireEvent.change(dateInput, { target: { value: '' } });
//     fireEvent.change(dateInput, { target: { value: '01/01/2024' } });

//     // Test allotted hours with various inputs
//     const hoursInput = screen.getByLabelText(t.allottedHours);
//     ['abc', '-5', '', '0', '10'].forEach((value) => {
//       fireEvent.change(hoursInput, { target: { value } });
//     });

//     // Test notes
//     const notesInput = screen.getByLabelText(t.preCompletionNotes);
//     fireEvent.change(notesInput, { target: { value: 'Test notes' } });

//     const submitButton = screen.getByTestId('submitBtn');
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
//     });
//   });

//   // for handling edge cases in timezone
//   it('handles timezone edge cases', async () => {
//     renderItemModal(link1, itemProps[0]);

//     await waitFor(async () => {
//       const dateInput = screen.getByLabelText(t.dueDate);

//       // Test dates around DST changes
//       const dstDates = [
//         '03/12/2025', // Spring forward
//         '11/05/2025', // Fall back
//       ];

//       for (const date of dstDates) {
//         fireEvent.change(dateInput, { target: { value: date } });
//         expect(dateInput).toHaveValue(date);
//       }

//       // Test midnight boundary dates
//       fireEvent.change(dateInput, { target: { value: '01/01/2025' } });
//       expect(dateInput).toHaveValue('01/01/2025');
//     });
//   });

//   // For testing failure of updating action item
//   it('should fail to Update Action Item', async () => {
//     renderItemModal(link2, itemProps[2]);
//     expect(screen.getAllByText(t.updateActionItem)).toHaveLength(2);

//     // Update Post Completion Notes
//     fireEvent.change(screen.getByLabelText(t.postCompletionNotes), {
//       target: { value: 'Cmp Notes 2' },
//     });

//     // Click Submit
//     const submitButton = screen.getByTestId('submitBtn');
//     expect(submitButton).toBeInTheDocument();
//     fireEvent.click(submitButton);

//     await waitFor(() => {
//       expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
//     });
//   });

//   it('handles potentially malicious input patterns correctly', async () => {
//     renderItemModal(link1, itemProps[0]);

//     // Select required fields
//     const categorySelect = screen.getByTestId('categorySelect');
//     fireEvent.mouseDown(within(categorySelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Category 1'));

//     const memberSelect = screen.getByTestId('memberSelect');
//     fireEvent.mouseDown(within(memberSelect).getByRole('combobox'));
//     fireEvent.click(await screen.findByText('Harve Lance'));

//     const preCompletionNotes = screen.getByLabelText(t.preCompletionNotes);

//     // Test HTML-like content
//     fireEvent.change(preCompletionNotes, {
//       target: { value: '<div>Test</div> <script>alert("test")</script>' },
//     });
//     expect(preCompletionNotes).toHaveValue(
//       '<div>Test</div> <script>alert("test")</script>',
//     );

//     // Test common XSS patterns
//     const xssPatterns = [
//       '<img src="x" onerror="alert(1)">',
//       'javascript:alert(1)',
//       '"><script>alert(1)</script>',
//       '<svg onload="alert(1)">',
//       '\'--"<script>alert(1)</script>',
//       '"; DROP TABLE users; --',
//       '${alert(1)}',
//       "{{constructor.constructor('alert(1)')()}}",
//     ];

//     for (const pattern of xssPatterns) {
//       fireEvent.change(preCompletionNotes, { target: { value: pattern } });
//       expect(preCompletionNotes).toHaveValue(pattern);
//     }

//     // Test form submission with special characters
//     const submitButton = screen.getByTestId('submitBtn');
//     fireEvent.click(submitButton);
//     await waitFor(() => {
//       expect(toast.success).toHaveBeenCalledWith(t.successfulCreation);
//       // Verify the last input value persists after submission
//       expect(preCompletionNotes).toHaveValue(
//         xssPatterns[xssPatterns.length - 1],
//       );
//     });
//   });
// });
