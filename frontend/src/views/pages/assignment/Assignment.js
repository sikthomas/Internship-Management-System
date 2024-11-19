import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row, Spinner, Button, Modal } from 'react-bootstrap';

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState({});

  useEffect(() => {
    const fetchAssignments = async (assignmentId) => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/assignments/${assignmentId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        setAssignments(response.data);
        // Fetch replies for each assignment
        fetchReplies(assignmentId);
      } catch (err) {
        setError('Failed to fetch assignments. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);


  const fetchReplies = async (assignmentId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/assignments_reply/${assignmentId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      // Store replies in state
      setReplies((prev) => ({ ...prev, [assignmentId]: response.data }));
    } catch (error) {
      console.error('Error fetching replies:', error);
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
                
                {/* Display replies for the current assignment */}
                <h4>Reply</h4>
                {replies[assignment.id] && replies[assignment.id].map(reply => (
                  <div key={reply.id} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#96FF96', borderRadius: '5px', color: 'black' }}>
                    <p>{reply.response} <small>({new Date(reply.response_date).toLocaleString()})</small></p>
                  </div>
                ))}

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Assignment;
