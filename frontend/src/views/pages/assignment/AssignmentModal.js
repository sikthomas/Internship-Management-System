import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AssignmentModal = ({ show, handleClose, applicantId }) => {
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [completionDate, setCompletionDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/assignment/', {
        applicant_id: applicantId,
        assignment_title: assignmentTitle,
        assignment_description: assignmentDescription,
        completion_date: parseInt(completionDate, 10), // Ensure it's a number
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      console.log('Assignment Created:', response.data);
      handleClose();
    } catch (error) {
      console.error('Failed to assign work:', error);
      alert('Failed to assign work. Please check the input and try again.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Assign Work</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formAssignmentTitle">
            <Form.Label>Assignment Title</Form.Label>
            <Form.Control 
              type="text" 
              value={assignmentTitle} 
              onChange={(e) => setAssignmentTitle(e.target.value)} 
              required 
            />
          </Form.Group>
          <Form.Group controlId="formAssignmentDescription">
            <Form.Label>Assignment Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              value={assignmentDescription} 
              onChange={(e) => setAssignmentDescription(e.target.value)} 
              required 
            />
          </Form.Group>
          <Form.Group controlId="formCompletionDate">
            <Form.Label>Completion Date (in days)</Form.Label>
            <Form.Control 
              type="number" 
              value={completionDate} 
              onChange={(e) => setCompletionDate(e.target.value)} 
              required 
            />
          </Form.Group>
          <Button variant="success" type="submit">
            Assign Work
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AssignmentModal;
