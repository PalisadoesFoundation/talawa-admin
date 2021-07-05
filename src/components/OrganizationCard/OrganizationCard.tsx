import React from 'react';

function OrganizationCard(props: {
  key: any;
  image: string;
  name: any;
  lastName: any;
  firstName: any;
}): JSX.Element {
  return (
    <>
      <h4>{props.name}</h4>
      <h5>{props.firstName}</h5>
      <h5>{props.lastName}</h5>
    </>
  );
}

export default OrganizationCard;
