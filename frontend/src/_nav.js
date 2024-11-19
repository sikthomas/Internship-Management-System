import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilSpeedometer,
} from '@coreui/icons';
import { CNavItem, CNavTitle } from '@coreui/react';

const userType = localStorage.getItem('user_type');

const _nav = [
  // Common items for all users
  
  {
    component: CNavTitle,
    name: 'Theme',
  },
];

// Conditional items based on user roles
if (userType=="company") {
  _nav.push(
    
    {
      component: CNavItem,
      name: 'Applicantions',
      to: '/pages/profile',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Students',
      to: '/pages/personalinfo',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    }
  );
} else if (userType=="supervisor") {
  _nav.push(
    {
      component: CNavItem,
      name: 'Applicantions',
      to: '/pages/profile',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    }
  );
} else if (userType=="student") {
  _nav.push(
    {
      component: CNavItem,
      name: 'Apply Internship',
      to: '/pages/application',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Assignments',
      to: '/pages/assignment',
      icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    },

  );
}

export default _nav;
