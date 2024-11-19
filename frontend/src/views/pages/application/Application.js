import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CRow,
} from '@coreui/react';

const Application = () => {
  const [users, setSupervisors] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [course, setCourse] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [studentCV, setStudentCV] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/supervisors/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        setSupervisors(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedSupervisor) {
      setError('Please select a supervisor.');
      return;
    }

    const formData = new FormData();
    formData.append('supervisor_id', selectedSupervisor);  // Send the ID as is
    formData.append('idnumber', idNumber);
    formData.append('phonenumber', phoneNumber);
    formData.append('course', course);
    formData.append('registration_number', registrationNumber);
    formData.append('student_cv', studentCV);

    try {
      await axios.post('http://127.0.0.1:8000/api/application/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      setSuccess('Application submitted successfully!');
      // Reset form fields
      setSelectedSupervisor('');
      setIdNumber('');
      setPhoneNumber('');
      setCourse('');
      setRegistrationNumber('');
      setStudentCV(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error submitting the application');
      console.error(err);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Make Application</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              <div className="mb-3">
                <CFormLabel htmlFor="selectedSupervisor">Select Supervisor</CFormLabel>
                <CFormSelect
                  id="selectedSupervisor"
                  value={selectedSupervisor}
                  onChange={(e) => setSelectedSupervisor(e.target.value)}
                >
                  <option value="">Choose a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="idNumber">ID Number</CFormLabel>
                <CFormInput
                  id="idNumber"
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="phoneNumber">Phone Number</CFormLabel>
                <CFormInput
                  id="phoneNumber"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="course">Course</CFormLabel>
                <CFormInput
                  id="course"
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="registrationNumber">Registration Number</CFormLabel>
                <CFormInput
                  id="registrationNumber"
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="studentCV">Upload CV</CFormLabel>
                <CFormInput
                  id="studentCV"
                  type="file"
                  onChange={(e) => setStudentCV(e.target.files[0])}
                  required
                />
              </div>
              <CButton color="primary" type="submit">
                Submit
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Application;
