import React from 'react';
import { render, screen } from '@testing-library/react';
import SuperDashListCard from './SuperDashListCard';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-location-mock';

Enzyme.configure({ adapter: new Adapter() });

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
    );

    expect(screen.getByText('Admins:')).toBeInTheDocument();
    expect(screen.getByText('Members:')).toBeInTheDocument();
    expect(screen.getByText('Dogs Care')).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.getByText('04/07/2019')).toBeInTheDocument();

    clickButton.simulate('click');
  });

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
    );

    expect(window.location).toBeAt('/orgdash');
  });
});
