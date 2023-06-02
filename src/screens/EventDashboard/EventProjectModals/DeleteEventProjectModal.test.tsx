import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { DeleteEventProjectModal } from './DeleteEventProjectModal';
import { DELETE_EVENT_PROJECT_MUTATION } from 'GraphQl/Mutations/mutations';
import { StaticMockLink } from 'utils/StaticMockLink';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { getByText } from '@testing-library/react';

const MOCKS = [
  {
    request: {
      query: DELETE_EVENT_PROJECT_MUTATION,
      variable: { id: '123' },
    },
    result: {
      data: {
        event: {
          _id: '123',
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Delete Event Project Modal', () => {
  const props = {
    show: true,
    project: {
      _id: '123',
      title: 'Test Event Project',
      description: 'Test Event Project Description',
    },
    handleClose: jest.fn(),
    refetchData: jest.fn(),
  };

  test('Testing for modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <DeleteEventProjectModal {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    // await wait();
    // const confirmElement = document.body.getElementById(
    //   'deleteEventProjectConfirm'
    // );
    // expect(confirmElement.innerText).toBe(
    //   'Are you sure you want to delete this?'
    // );
    // userEvent.click(screen.getByTestId('card'));

    // userEvent.click(screen.getByTestId('createEventModalCloseBtn'));

    await wait();
  });

  //   test('Should render text elements when props value is not passed', async () => {
  //     global.confirm = () => false;

  //     render(
  //       <MockedProvider addTypename={false} link={link}>
  //         <I18nextProvider i18n={i18nForTest}>
  //           <EventListCard
  //             key="123"
  //             id="1"
  //             eventName=""
  //             eventLocation=""
  //             eventDescription=""
  //             regDate="19/03/2022"
  //             regEndDate="26/03/2022"
  //             startTime="02:00"
  //             endTime="06:00"
  //             allDay={true}
  //             recurring={false}
  //             isPublic={true}
  //             isRegisterable={false}
  //           />
  //         </I18nextProvider>
  //       </MockedProvider>
  //     );

  //     await wait();

  //     expect(screen.queryByText(props.eventName)).not.toBeInTheDocument();
  //   });

  //   test('Testing event update functionality', async () => {
  //     render(
  //       <MockedProvider addTypename={false} link={link}>
  //         <I18nextProvider i18n={i18nForTest}>
  //           <EventListCard {...props} />
  //         </I18nextProvider>
  //       </MockedProvider>
  //     );

  //     await wait();

  //     userEvent.type(screen.getByTestId('updateTitle'), props.eventName);
  //     userEvent.type(
  //       screen.getByTestId('updateDescription'),
  //       props.eventDescription
  //     );
  //     userEvent.type(screen.getByTestId('updateLocation'), props.eventLocation);
  //     userEvent.click(screen.getByTestId('updateAllDay'));
  //     userEvent.click(screen.getByTestId('updateRecurring'));
  //     userEvent.click(screen.getByTestId('updateIsPublic'));
  //     userEvent.click(screen.getByTestId('updateRegistrable'));

  //     userEvent.click(screen.getByTestId('updatePostBtn'));
  //   });
  //   test('should render props and text  elements test for the screen', async () => {
  //     const { container } = render(
  //       <MockedProvider addTypename={false} link={link}>
  //         <BrowserRouter>
  //           <Provider store={store}>
  //             <I18nextProvider i18n={i18nForTest}></I18nextProvider>
  //           </Provider>
  //         </BrowserRouter>
  //       </MockedProvider>
  //     );

  //     expect(container.textContent).not.toBe('Loading data...');

  //     await wait();
  //   });

  //   test('Testing if the event is not for all day', async () => {
  //     render(
  //       <MockedProvider addTypename={false} link={link}>
  //         <I18nextProvider i18n={i18nForTest}>
  //           <EventListCard {...props} />
  //         </I18nextProvider>
  //       </MockedProvider>
  //     );

  //     await wait();

  //     userEvent.type(screen.getByTestId('updateTitle'), props.eventName);
  //     userEvent.type(
  //       screen.getByTestId('updateDescription'),
  //       props.eventDescription
  //     );
  //     userEvent.type(screen.getByTestId('updateLocation'), props.eventLocation);
  //     userEvent.click(screen.getByTestId('updateAllDay'));
  //     await wait();

  //     userEvent.type(screen.getByTestId('updateStartTime'), props.startTime);
  //     userEvent.type(screen.getByTestId('updateEndTime'), props.endTime);

  //     userEvent.click(screen.getByTestId('updatePostBtn'));
  //   });
  //   test('Testing event preview modal', async () => {
  //     render(
  //       <MockedProvider addTypename={false} link={link}>
  //         <I18nextProvider i18n={i18nForTest}>
  //           <EventListCard {...props} />
  //         </I18nextProvider>
  //       </MockedProvider>
  //     );
  //     await wait();
  //     expect(screen.getByText(props.eventName)).toBeInTheDocument();
  //   });
  //   describe('EventListCard', () => {
  //     it('should render the delete modal', () => {
  //       render(
  //         <MockedProvider link={link} addTypename={false}>
  //           <EventListCard {...props} />
  //         </MockedProvider>
  //       );
  //     });

  //     it('should call the delete event mutation when the "Yes" button is clicked', async () => {
  //       render(
  //         <MockedProvider link={link} addTypename={false}>
  //           <EventListCard {...props} />
  //         </MockedProvider>
  //       );

  //       const deleteBtn = screen.getByTestId('deleteEventBtn');
  //       fireEvent.click(deleteBtn);
  //     });

  //     it('should show an error toast when the delete event mutation fails', async () => {
  //       const errorMocks = [
  //         {
  //           request: {
  //             query: DELETE_EVENT_MUTATION,
  //             variables: {
  //               id: props.id,
  //             },
  //           },
  //           error: new Error('Something went wrong'),
  //         },
  //       ];
  //       const link2 = new StaticMockLink(errorMocks, true);
  //       render(
  //         <MockedProvider link={link2} addTypename={false}>
  //           <EventListCard {...props} />
  //         </MockedProvider>
  //       );

  //       const deleteBtn = screen.getByTestId('deleteEventBtn');
  //       fireEvent.click(deleteBtn);
  //     });
  //   });
});
