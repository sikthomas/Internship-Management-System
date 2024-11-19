import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row, Spinner, Button, Modal } from 'react-bootstrap';

const AllAssignments = () => {
  const [assignments, setAssignments] = useState([]); // List of assignments
  const [error, setError] = useState(''); // Error message
  const [loading, setLoading] = useState(true); // Loading spinner state
  const [modalShow, setModalShow] = useState(false); // Modal visibility for replies
  const [reply, setReply] = useState(''); // Reply text
  const [currentAssignment, setCurrentAssignment] = useState(null); // ID of the current assignment
  const [responses, setResponses] = useState({}); // Store responses for each assignment by ID

  // Fetch assignments initially
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      const token = localStorage.getItem('access'); // Get the token from localStorage
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/my_assignments/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssignments(response.data); // Set the assignments state
      } catch (err) {
        setError('Failed to fetch assignments. Please try again later.');
        console.error('Error fetching assignments:', err.response ? err.response.data : err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []); // Empty dependency array to fetch assignments once on component mount

  // Poll replies for each assignment every 5 seconds (separate effect)
  useEffect(() => {
    const interval = setInterval(() => {
      assignments.forEach((assignment) => {
        fetchReplies(assignment.id); // Fetch replies for each assignment
      });
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup the interval when the component is unmounted
  }, [assignments]); // This effect runs every time the assignments list changes

  // Fetch replies for a specific assignment
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
        [assignmentId]: response.data, // Store the replies for this assignment
      }));
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  // Handle reply submission
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

      fetchReplies(currentAssignment); // Fetch the latest replies after submitting a reply
      setReply(''); // Clear the reply input field
      setModalShow(false); // Close the modal
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  return (
    <div>
      <h3 style={{ backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '3px' }}>
        ASSIGNMENTS
      </h3>

      {/* Show loading spinner while fetching assignments */}
      {loading && <Spinner animation="border" />}
      
      {/* Display error message if failed to fetch assignments */}
      {error && <p className="text-danger">{error}</p>}

      {/* Display assignments */}
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

                {/* Display replies for the current assignment */}
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

                {/* Button to open modal to reply to the assignment */}
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setCurrentAssignment(assignment.id); // Set the current assignment ID
                    setModalShow(true); // Show modal
                  }}
                >
                  Reply
                </Button>
                
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for replying to the assignment */}
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reply to Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)} // Update reply state when input changes
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

export default AllAssignments;
