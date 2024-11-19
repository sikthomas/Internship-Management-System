import React, { useEffect, useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react';
import axios from 'axios';

const Roles = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Use the access token
          },
        });
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/roles_choices/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Use the access token
          },
        });
        setRoles(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://127.0.0.1:8000/api/roles/', {
        user_id: selectedUser,
        role: selectedRole,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include the token in the request
        },
      });
      setSuccess('Role assigned successfully!');
      setSelectedUser('');
      setSelectedRole('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error assigning role');
      console.error(err);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Assign User Roles</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              <div className="mb-3">
                <CFormLabel htmlFor="userSelect">Select User</CFormLabel>
                <CFormSelect
                  id="userSelect"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
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
                <CFormLabel htmlFor="roleSelect">Select Role</CFormLabel>
                <CFormSelect
                  id="roleSelect"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Choose a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </CFormSelect>
              </div>
              <CButton color="primary" type="submit">
                Assign Role
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Roles;
