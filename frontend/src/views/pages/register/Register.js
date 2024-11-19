import React, { useState } from 'react';
import axios from 'axios';
import { CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow, CLink, CFormSelect } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    user_type: '',
    university_name: '',
    profile_photo: null, // Initialize as null for file
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profile_photo: e.target.files[0], // Set the first file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    try {
      const response = await axios.post('http://localhost:8000/api/signup/', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Account created successfully!');
      console.log(response.data);
      navigate('/');
    } catch (err) {
      if (err.response) {
        console.error(err.response.data);
        setError(err.response.data.detail || 'An error occurred. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error(err);
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  {error && <p className="text-danger">{error}</p>}
                  {success && <p className="text-success">{success}</p>}

                  {/* First Name */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="first_name"
                      placeholder="First Name"
                      autoComplete="first_name"
                      onChange={handleChange}
                      value={formData.first_name}
                    />
                  </CInputGroup>

                  {/* Last Name */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="last_name"
                      placeholder="Last Name"
                      autoComplete="last_name"
                      onChange={handleChange}
                      value={formData.last_name}
                    />
                  </CInputGroup>

                  {/* Username */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="username"
                      placeholder="Username"
                      autoComplete="username"
                      onChange={handleChange}
                      value={formData.username}
                    />
                  </CInputGroup>

                  {/* Email */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      onChange={handleChange}
                      value={formData.email}
                    />
                  </CInputGroup>

                  {/* User Type Dropdown */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>User Type</CInputGroupText>
                    <CFormSelect
                      name="user_type"
                      onChange={handleChange}
                      value={formData.user_type}
                    >
                      <option value="">Select User Type</option>
                      <option value="student">Student</option>
                      <option value="supervisor">Supervisor</option>
                    </CFormSelect>
                  </CInputGroup>

                  {/* University Dropdown */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>University</CInputGroupText>
                    <CFormSelect
                      name="university_name"
                      onChange={handleChange}
                      value={formData.university_name}
                    >
                      <option value="">Select University</option>
                      <option value="Kabianga">Kabianga</option>
                      <option value="University of Nairobi">University of Nairobi</option>
                      <option value="Kabarak University">Kabarak University</option>
                    </CFormSelect>
                  </CInputGroup>

                  {/* Profile Photo Input */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>Profile Photo</CInputGroupText>
                    <input
                      type="file"
                      name="profile_photo"
                      onChange={handleFileChange}
                    />
                  </CInputGroup>

                  {/* Password */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      name="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      onChange={handleChange}
                      value={formData.password}
                    />
                  </CInputGroup>

                  {/* Confirm Password */}
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      name="confirmPassword"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      onChange={handleChange}
                      value={formData.confirmPassword}
                    />
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton color="success" type="submit">Create Account</CButton>
                  </div>
                  <div className="mt-3 text-center">
                    <CLink 
                      onClick={() => navigate('/login')} 
                      color="link" 
                      style={{ cursor: 'pointer' }}
                    >
                      Already have an account? Log in
                    </CLink>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}

export default Register;
