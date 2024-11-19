import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';  // Import useParams to get applicantId from URL

const Assignments = () => {
  const { applicantId } = useParams();  // Get the applicantId from the URL
  const [assignments, setAssignments] = useState([]);
  const [responses, setResponses] = useState({}); // Store replies by assignment ID
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch assignments for the specific applicant
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      const token = localStorage.getItem('access');  // Ensure the token is correct

      if (!token) {
        setError('Authorization token missing!');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/assignments/${applicantId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAssignments(response.data);  // Set the assignments state

        // Fetch replies for each assignment automatically
        response.data.forEach(async (assignment) => {
          const replyResponse = await axios.get(`http://127.0.0.1:8000/api/assignments_reply/${assignment.id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setResponses((prevResponses) => ({
            ...prevResponses,
            [assignment.id]: replyResponse.data, // Store replies for each assignment
          }));
        });

      } catch (err) {
        console.error('Error fetching assignments:', err.response ? err.response.data : err.message);
        setError('Failed to fetch assignments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [applicantId]);  // Fetch assignments when applicantId changes

  return (
    <div style={{ padding: '20px' }}>
      {loading && <Spinner animation="border" />}
      {error && <p className="text-danger">{error}</p>}

      {/* Display assignments in a card layout */}
      <Row>
        {assignments.map((assignment) => (
          <Col md={12} key={assignment.id} className="mb-4">
            <Card style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
              <Card.Body>
                <div style={{ backgroundColor: '#B2BEB5', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
                  <Card.Title style={{ fontSize: '18px', fontWeight: 'bold' }}>Task: {assignment.assignment_title}</Card.Title>
                  <Card.Text><strong>Description:</strong> {assignment.assignment_description}</Card.Text>
                  <Card.Text>
                    <strong>Assigned on:</strong> {new Date(assignment.assigned_date).toLocaleDateString()} 
                    {' | '}
                    <strong>Duration:</strong> {assignment.completion_date} Days
                  </Card.Text>

                  {/* Display replies automatically below the assignment */}
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
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Assignments;
