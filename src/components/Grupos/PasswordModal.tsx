import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface PasswordModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (password: string) => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ show, onHide, onConfirm }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(password);
    setPassword('');
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Acción</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Por favor, ingrese su contraseña para confirmar:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Confirmar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};