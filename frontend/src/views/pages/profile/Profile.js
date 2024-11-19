import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAvatar,
} from '@coreui/react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const userType = localStorage.getItem('user_type');

const AssignmentModal = ({ show, handleClose, applicantId }) => {
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [completionDate, setCompletionDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/assignment/',
        {
          applicant_id: applicantId,
          assignment_title: assignmentTitle,
          assignment_description: assignmentDescription,
          completion_date: `${completionDate} days`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );
      handleClose(); // Close the modal after submission
    } catch (error) {
      console.error('Failed to assign work:', error);
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

const Profile = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      const token = localStorage.getItem('access');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/applications/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(response.data);
      } catch (err) {
        setError('Failed to fetch applications. Please try again later.');
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);


  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Applicant Details</strong>
          </CCardHeader>
          <CCardBody>
            {loading && <p>Loading applications...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && applications.length === 0 && <p>No applications found.</p>}
            {applications.map((app) => (
              <CCard
                key={app.id}
                className="mb-3"
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
              >
              <CAvatar
                src={`http://127.0.0.1:8000${app.student_profile_image}`}
                alt="Profile"
                style={{ width: '60px', height: '60px', margin: '15px' }}
              />
                <div style={{ flex: 1, padding: '15px' }}>
                  {app.student_first_name} {app.student_last_name} <strong>University:</strong> {app.university_name} <strong>Supervisor:</strong> {app.supervisor_first_name} {app.supervisor_last_name}
                  <strong>Application Date:</strong> {new Date(app.application_date).toLocaleDateString()}
                  {userType === 'company' && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => {
                          setSelectedApplicantId(app.id);
                          setModalShow(true);
                        }}
                      >
                        Assign Work
                      </Button>
                    </>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    as={Link}
                    to={`/pages/assignmentlist/${app.id}`}
                  >
                    View Progress
                  </Button>
                </div>
              </CCard>
            ))}
          </CCardBody>
        </CCard>
      </CCol>
  
      {userType === 'company' && (
        <AssignmentModal
          show={modalShow}
          handleClose={() => setModalShow(false)}
          applicantId={selectedApplicantId}
        />
      )}
    </CRow>
  );
  
};

export default Profile;
