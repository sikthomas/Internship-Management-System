import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row, Spinner, Button, Modal } from 'react-bootstrap';

const MyAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [reply, setReply] = useState('');
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [responses, setResponses] = useState({});
  
  // Fetch assignments initially
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      const token = localStorage.getItem('access');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/my_assignments/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssignments(response.data);
      } catch (err) {
        setError('Failed to fetch assignments. Please try again later.');
        console.error('Error fetching assignments:', err.response ? err.response.data : err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Poll replies for assignments every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      assignments.forEach((assignment) => {
        fetchReplies(assignment.id);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [assignments]);

  const fetchReplies = async (assignmentId) => {
    const token = localStorage.getItem('access');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/assignments_reply/${assignmentId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponses((prevResponses) => ({
        ...prevResponses,
        [assignmentId]: response.data,
      }));
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleReply = async () => {
    try {
      const token = localStorage.getItem('access');
      await axios.post('http://127.0.0.1:8000/api/reply/', {
        assignment_id: currentAssignment,
        response: reply,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchReplies(currentAssignment);
      setReply('');
      setModalShow(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  return (
    <div>
      <h3 style={{ backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '3px' }}>
        ASSIGNMENTS
      </h3>

      {loading && <Spinner animation="border" />}

      {error && <p className="text-danger">{error}</p>}

      <Row>
        {assignments.map((assignment) => (
          <Col md={12} key={assignment.id} className="mb-4">
            <Card>
              <Card.Body>
                <div style={{ backgroundColor: '#d3d3d3', padding: '10px', borderRadius: '5px' }}>
                  <Card.Title>Task: {assignment.assignment_title}</Card.Title>
                  <Card.Text>Description: {assignment.assignment_description}</Card.Text>
                  <p>
                    Assigned on: {new Date(assignment.assigned_date).toLocaleDateString()}
                    {' | Duration: '} {assignment.completion_date} Days
                  </p>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <h5>Replies:</h5>
                  {responses[assignment.id] && responses[assignment.id].length > 0 ? (
                    responses[assignment.id].map((reply) => (
                      <div
                        key={reply.id}
                        style={{
                          marginTop: '10px',
                          padding: '10px',
                          backgroundColor: '#96FF96',
                          borderRadius: '5px',
                          color: 'black',
                        }}
                      >
                        <p>{reply.response}</p>
                        <small>{new Date(reply.response_date).toLocaleString()}</small>
                      </div>
                    ))
                  ) : (
                    <p>No replies yet.</p>
                  )}
                </div>

                <Button
                  variant="primary"
                  onClick={() => {
                    setCurrentAssignment(assignment.id);
                    setModalShow(true);
                  }}
                >
                  Reply
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reply to Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={5}
            style={{ width: '100%' }}
            placeholder="Write your reply here..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleReply}>
            Submit Reply
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyAssignment;
