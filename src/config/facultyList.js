// src/config/facultyList.js
// Shared configuration file for faculty information
// Used by Student.js, Faculty.js, and AuthContext.js

// Faculty list with ID, email, and name
export const facultyList = [
  { id: 'faculty1', email: 'f20211878@hyderabad.bits-pilani.ac.in', name: 'Faculty 1' },
  { id: 'faculty2', email: 'f20213183@hyderabad.bits-pilani.ac.in', name: 'Faculty 2' },
  { id: 'faculty3', email: 'f20210485@hyderabad.bits-pilani.ac.in', name: 'Faculty 3' },
  { id: 'faculty4', email: '', name: 'Faculty 4' },
  { id: 'faculty5', email: '', name: 'Faculty 5' }
];

// Helper function to get just the email addresses (excluding empty ones)
export const getFacultyEmails = () => {
  return facultyList.map(f => f.email).filter(email => email !== '');
};

// Helper function to get faculty options for select dropdowns
export const getFacultyOptions = () => {
  return facultyList.map(f => ({
    value: f.id,
    label: f.name,
    email: f.email
  }));
};

// Helper function to get faculty name by ID
export const getFacultyNameById = (id) => {
  const faculty = facultyList.find(f => f.id === id);
  return faculty ? faculty.name : id;
};

// Helper function to get faculty ID by email
export const getFacultyIdByEmail = (email) => {
  const faculty = facultyList.find(f => f.email === email);
  return faculty ? faculty.id : null;
};
