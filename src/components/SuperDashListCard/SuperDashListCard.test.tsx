import React from 'react';
import { render, screen } from '@testing-library/react';
import SuperDashListCard from './SuperDashListCard';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Testing the Super Dash List', () => {
  const props = {
    key: '123',
    id: '123',
    orgName: 'Dogs Care',
    orgLocation: 'India',
    createdDate: '04/07/2019',
    image: '',
    admins: '23',
    members: '34',
  };

  test('should render props and text elements test for the page component', () => {
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
});
