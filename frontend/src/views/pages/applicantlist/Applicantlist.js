import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableDataCell,
  CTableHeaderCell,
} from '@coreui/react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AssignmentModal = ({ show, handleClose, applicantId }) => {
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [completionDate, setCompletionDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/assignment/', {
        applicant_id: applicantId,
        assignment_title: assignmentTitle,
        assignment_description: assignmentDescription,
        completion_date: `${completionDate} days`,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
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

const Applicants = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);

  
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/applications/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setApplications(response.data);
      } catch (err) {
        setError('Failed to fetch applications. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/applications/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setApplications(applications.filter(app => app.id !== id));
      } catch (err) {
        setError('Failed to delete application. Please try again.');
        console.error(err);
      }
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return ''; // Return an empty string if the input is falsy
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const handleViewAssignments = (applicantId) => {
    navigate(`/pages/assignmentlist/${applicantId}`);
  };

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
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell><strong>Name</strong></CTableHeaderCell>
                  <CTableHeaderCell><strong>ID Number</strong></CTableHeaderCell>
                  <CTableHeaderCell><strong>Phone Number</strong></CTableHeaderCell>
                  <CTableHeaderCell><strong>Course</strong></CTableHeaderCell>
                  <CTableHeaderCell><strong>University</strong></CTableHeaderCell>
                  <CTableHeaderCell><strong>Application Date</strong></CTableHeaderCell>
                  <CTableHeaderCell><strong>CV</strong></CTableHeaderCell>
                  <CTableHeaderCell><strong>Action</strong></CTableHeaderCell>
                  <CTableHeaderCell><strong>Action</strong></CTableHeaderCell>

                </CTableRow>
              </CTableHead>
              <CTableBody>
                {applications.map((app) => (
                  <CTableRow key={app.id}>
                    <CTableDataCell>{capitalizeFirstLetter(app.student_id?.first_name)} {capitalizeFirstLetter(app.student_id?.last_name)}</CTableDataCell>
                    <CTableDataCell>{app.idnumber}</CTableDataCell>
                    <CTableDataCell>{app.phonenumber}</CTableDataCell>
                    <CTableDataCell>{capitalizeFirstLetter(app.course)}</CTableDataCell>
                    <CTableDataCell>{capitalizeFirstLetter(app.university?.university_name)}</CTableDataCell>
                    <CTableDataCell>{new Date(app.application_date).toLocaleDateString()}</CTableDataCell>
                    <CTableDataCell>
                      <a href={app.student_cv} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                        View CV
                      </a>
                    </CTableDataCell>
                    <CTableDataCell>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => {
                          setSelectedApplicantId(app.id);
                          setModalShow(true);
                        }}
                      >
                        Assign Work
                      </Button>{' '}
                      </CTableDataCell>
                      
                      <CTableDataCell>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewAssignments(app.id)}  // Button to view assignments
                      >
                        View Assignments
                      </Button>
                    </CTableDataCell>

                      <CTableDataCell>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(app.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      <AssignmentModal 
        show={modalShow} 
        handleClose={() => {
          setModalShow(false);
          // Reset form state
          setAssignmentTitle('');
          setAssignmentDescription('');
          setCompletionDate('');
        }} 
        applicantId={selectedApplicantId} 
      />
    </CRow>
  );
};

export default Applicants;
