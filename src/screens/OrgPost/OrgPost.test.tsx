import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render } from '@testing-library/react';
import OrgPost from './OrgPost';
import { ORGANIZATION_POST_LIST } from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { BrowserRouter } from 'react-router-dom';

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_POST_LIST,
    },
    result: {
      data: {
        postsByOrganization: [
          {
            _id: 1,
            title: 'Akatsuki',
            text: 'Capture Jinchuriki',
            imageUrl: '',
            videoUrl: '',
          },
        ],
      },
    },
  },
];

async function wait(ms = 0) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Organisation Post Page', () => {
  test('correct mock data should be queried', async () => {
    const dataQuery1 = MOCKS[0]?.result?.data?.postsByOrganization;

    console.log(`Data is ${dataQuery1}`);
    expect(dataQuery1).toEqual([
      {
        _id: 1,
        title: 'Akatsuki',
        text: 'Capture Jinchuriki',
        imageUrl: '',
        videoUrl: '',
      },
    ]);
  });
  test('should render props and text elements test for the screen', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <OrgPost />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.textContent).not.toBe('Loading data...');
    await wait();
    console.log(container);
    expect(container.textContent).toMatch('Posts by Author');
    expect(container.textContent).toMatch('Posts by Title');
    expect(container.textContent).toMatch('Posts');
    expect(container.textContent).toMatch('+ Create Post');
  });
});
