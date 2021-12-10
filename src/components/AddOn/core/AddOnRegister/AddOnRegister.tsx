import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AddOnRegister.module.css';
import { Button, Form, Modal } from 'react-bootstrap';

interface AddOnRegisterProps {
  id?: string; // OrgId
  createdBy?: string; // User
}

function AddOnRegister({ createdBy }: AddOnRegisterProps): JSX.Element {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleRegister = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        className={styles.modalbtn}
        variant="primary"
        onClick={handleShow}
      >
        <i className="fa fa-plus"></i>
        Add New
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Plugin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="registerForm.PluginName">
              <Form.Label>Plugin Name</Form.Label>
              <Form.Control type="text" placeholder="Plugin Name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerForm.PluginDesc">
              <Form.Label>Plugin Description</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerForm.PluginURL">
              <Form.Label>Plugin Repo (GitHub URL)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Plugin Repo (GitHub URL)"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="registerForm.PluginInstall">
              <Form.Check type="checkbox" label="Install after register." />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleRegister}>
            Register
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

AddOnRegister.defaultProps = {
  createdBy: 'Admin',
};

AddOnRegister.propTypes = {
  createdBy: PropTypes.string,
};

export default AddOnRegister;
