import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AddOnEntry.module.css';
import { Button, Card, Form, Spinner } from 'react-bootstrap';

interface AddOnEntryProps {
  id: string;
  enabled: boolean;
  title: string;
  description: string;
  createdBy: string;
  component: string;
  installed?: boolean;
  configurable?: boolean;
  modified: any;
}

function AddOnEntry({
  id,
  enabled,
  title,
  description,
  createdBy,
  component,
  installed,
  configurable,
  modified,
}: AddOnEntryProps): JSX.Element {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [switchInProgress, setSwitchState] = useState(false);

  const entry = {
    id,
    name: title,
    description,
    createdBy,
    component,
  };

  // TODO: Install/Remove Effect
  // 1. Update Server to add to Org
  // 2. Validate Permissions
  // 3. Trigger Server Hook if Validated. (Stream to track progress)
  const install = () => {
    setButtonLoading(true);
    fetch('http://localhost:3005/installed', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(
        Object.assign(
          {},
          { ...entry },
          {
            installedDatetime: new Date(),
            installedBy: 'Admin',
            enabled: true,
          }
        )
      ),
    })
      .then(() => {
        setButtonLoading(false);
        modified();
      })
      .finally(() => setButtonLoading(false));
  };

  const remove = () => {
    setButtonLoading(true);
    fetch(`http://localhost:3005/installed/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setButtonLoading(false);
        modified();
      })
      .finally(() => setButtonLoading(false));
  };

  const toggleActive = () => {
    setSwitchState(true);
    fetch(`http://localhost:3005/installed/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(
        Object.assign(
          {},
          { ...entry },
          {
            enabled: !enabled,
          }
        )
      ),
    })
      .then(() => {
        modified();
        setSwitchState(false);
      })
      .finally(() => setSwitchState(false));
  };

  return (
    <Card data-testid="AddOnEntry">
      {installed && (
        <Form.Check
          type="switch"
          id="custom-switch"
          label="Enabled"
          className={styles.entrytoggle}
          onChange={toggleActive}
          disabled={switchInProgress}
          checked={enabled}
        />
      )}
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted author">
          {createdBy}
        </Card.Subtitle>
        <Card.Text>{description}</Card.Text>
        <Button
          className={styles.entryaction}
          variant="primary"
          disabled={buttonLoading || !configurable}
          onClick={() => {
            installed ? remove() : install();
          }}
        >
          {buttonLoading ? (
            <Spinner animation="grow" />
          ) : (
            <i className={installed ? 'fa fa-trash' : 'fa fa-cubes'}></i>
          )}
          {installed ? 'Remove' : configurable ? 'Install' : 'Installed'}
        </Button>
      </Card.Body>
    </Card>
  );
}

AddOnEntry.defaultProps = {
  enabled: false,
  configurable: true,
  title: '',
  description: '',
};

AddOnEntry.propTypes = {
  enabled: PropTypes.bool,
  configurable: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default AddOnEntry;
