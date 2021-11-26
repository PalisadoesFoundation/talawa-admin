import React from 'react';
import Alert from 'react-bootstrap/Alert';

function AlertResponse(props: any) {
  return (
    <Alert show={props.show} variant="danger">
      <p>{props.message}</p>
    </Alert>
  );
}

export default AlertResponse;
