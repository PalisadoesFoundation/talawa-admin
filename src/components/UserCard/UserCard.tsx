import React from 'react';

function UserCard(props: {
  key: any;
  firstName: any;
  lastName: any;
  image: any;
}): JSX.Element {
  return (
    <>
      <h5>{props.firstName}</h5>
      <h5>{props.lastName}</h5>
    </>
  );
}

export default UserCard;
