import React from 'react';
import { render, screen } from '@testing-library/react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { I18nextProvider } from 'react-i18next';
import 'jest-location-mock';

import SuperDashListCard from './SuperDashListCard';
import i18nForTest from 'utils/i18nForTest';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe('Testing the Super Dash List', () => {
  test('should render props and text elements test for the page component', () => {
    const props = {
      key: '123',
      id: '123',
      orgName: 'Dogs Care',
      orgLocation: 'India',
      createdDate: '04/07/2019',
      image: 'dummyImage',
      admins: [
        {
          _id: '123',
        },
        {
          _id: '456',
        },
      ],
      members: '34',
    };

    const buttonInstance = shallow(<SuperDashListCard {...props} />);
    const clickButton = buttonInstance.find('button');

    render(
      <I18nextProvider i18n={i18nForTest}>
        <SuperDashListCard
          key={props.key}
          id={props.id}
          image={props.image}
          orgName={props.orgName}
          orgLocation={props.orgLocation}
          createdDate={props.createdDate}
          admins={props.admins}
          members={props.members}
        />
      </I18nextProvider>
    );

    expect(screen.getByText('Admins:')).toBeInTheDocument();
    expect(screen.getByText('Members:')).toBeInTheDocument();
    expect(screen.getByText('Dogs Care')).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.getByText('04/07/2019')).toBeInTheDocument();

    clickButton.simulate('click');
  });

  /*
  WARNING!
    Do not tamper with this testcase. This is a test case to check for the window.location.replace exists and is being called correctly.
    Removal of this testcase will lead to unexpected breaks in the routing of the dashboard and such actions must be avoided.
  */
  test('Testing if window.location.replace exists and is called', () => {
    const props = {
      key: '123',
      id: '123',
      orgName: '',
      orgLocation: 'India',
      createdDate: '04/07/2019',
      image: '',
      admins: [
        {
          _id: '123',
        },
        {
          _id: '456',
        },
      ],
      members: '34',
    };

    const buttonInstance = shallow(<SuperDashListCard {...props} />);
    const clickButton = buttonInstance.find('button');

    render(
      <I18nextProvider i18n={i18nForTest}>
        <SuperDashListCard
          key={props.key}
          id={props.id}
          image={props.image}
          orgName={props.orgName}
          orgLocation={props.orgLocation}
          createdDate={props.createdDate}
          admins={props.admins}
          members={props.members}
        />
      </I18nextProvider>
    );

    clickButton.simulate('click');
    expect(window.location.replace).toHaveBeenCalled();
    expect(window.location).toBeAt(`/orgdash/id=${props.id}`);
  });

  // Do not change the lines above.

  test('Testing if the props data is not provided', () => {
    const props = {
      key: '123',
      id: '123',
      orgName: '',
      orgLocation: 'India',
      createdDate: '04/07/2019',
      image: '',
      admins: [
        {
          _id: '123',
        },
        {
          _id: '456',
        },
      ],
      members: '34',
    };

    window.location.assign('/orgdash');

    render(
      <I18nextProvider i18n={i18nForTest}>
        <SuperDashListCard
          key={props.key}
          id={props.id}
          image={props.image}
          orgName={props.orgName}
          orgLocation={props.orgLocation}
          createdDate={props.createdDate}
          admins={props.admins}
          members={props.members}
        />
      </I18nextProvider>
    );

    expect(window.location).toBeAt('/orgdash');
  });
});
