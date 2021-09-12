import React from 'react';
import PropTypes from 'prop-types';
import styles from './AddOnEntry.module.css';
import { Button, Card, Form } from 'react-bootstrap';

interface AddOnEntryProps {
  enabled: boolean;
  title: string;
  description: string;
  createdBy: string;
  installed?: boolean;
}

function AddOnEntry({
  enabled,
  title,
  description,
  createdBy,
  installed,
}: AddOnEntryProps): JSX.Element {
  // TODO: Install/Remove Effect
  // 1. Update Server to add to Org 2. Validate Permissions 3. Trigger Server Hook if Validated. (Stream to track progress)
  return (
    <Card>
      {installed && (
        <Form.Check
          type="switch"
          id="custom-switch"
          label="Enabled"
          className={styles.entrytoggle}
        />
      )}
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted author">
          {createdBy}
        </Card.Subtitle>
        <Card.Text>{description}</Card.Text>
        <Button className={styles.entryaction} variant="primary">
          <i className={installed ? 'fa fa-trash' : 'fa fa-cubes'}></i>
          {installed ? 'Remove' : 'Install'}
        </Button>
      </Card.Body>
    </Card>
  );
}

AddOnEntry.defaultProps = {
  enabled: true,
  title: '',
  description: '',
};

AddOnEntry.propTypes = {
  enabled: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default AddOnEntry;
