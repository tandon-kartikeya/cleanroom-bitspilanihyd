// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, signInWithGoogle as firebaseSignInWithGoogle } from '../utils/firebase';
import { getFacultyEmails, getFacultyIdByEmail } from '../config/facultyList';

// Create the Authentication Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'student', 'faculty', or null

  // Using faculty email list from shared configuration

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      // Use the helper function from firebase.js
      const result = await firebaseSignInWithGoogle();
      
      // Get user email
      const email = result.user.email;
      
      // Enforce BITS Pilani Hyderabad email domain restriction
      if (!email.endsWith('@hyderabad.bits-pilani.ac.in')) {
        await signOut(auth);
        setAuthError('You must use your BITS Pilani Hyderabad email to sign in');
        return null;
      }
      
      // Determine if student or faculty based on email pattern
      // Student emails start with 'f', 'p', or 'h' followed by numbers
      const isStudent = email.match(/^[fph]\d+@hyderabad\.bits-pilani\.ac\.in$/);
      
      if (isStudent) {
        // Valid student email format
        setUserRole('student');
      } else {
        // If not a student email pattern, check if it's in the allowed faculty list
        const facultyEmails = getFacultyEmails();
        if (facultyEmails.includes(email)) {
          // Valid faculty email
          setUserRole('faculty');
        } else {
          // Not a valid student pattern or in faculty list
          await signOut(auth);
          setAuthError('Access restricted. Your email is not authorized for this application.');
          return null;
        }
      }
      
      return result.user;
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthError(error.message);
      return null;
    }
  };

  // Sign out
  const logOut = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    try {
      if (!currentUser) {
        throw new Error('No user is logged in');
      }
      
      // In a production app, we would update Firebase Auth and/or Firestore here
      // For now, we'll just update our local state for demonstration
      console.log('Updating profile with data:', profileData);
      
      // Update current user state with new profile data
      setCurrentUser(prev => ({
        ...prev,
        displayName: profileData.name,
        studentId: profileData.studentId,
        department: profileData.department,
        photoURL: profileData.photoURL
      }));
      
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        const email = user.email;
        
        // Verify email domain is valid
        if (!email.endsWith('@hyderabad.bits-pilani.ac.in')) {
          // Sign out and set error
          signOut(auth).then(() => {
            setAuthError('You must use your BITS Pilani Hyderabad email to sign in');
          });
          setUserRole(null);
          setLoading(false);
          return;
        }
        
        // Re-determine role on auth state change
        const isStudent = email.match(/^[fph]\d+@hyderabad\.bits-pilani\.ac\.in$/);
        
        if (isStudent) {
          // Valid student email format
          setUserRole('student');
        } else {
          // If not a student email pattern, check if it's in the allowed faculty list
          const facultyEmails = getFacultyEmails();
          if (facultyEmails.includes(email)) {
            // Valid faculty email
            setUserRole('faculty');
          } else {
            // Not a valid student pattern or in faculty list
            signOut(auth).then(() => {
              setAuthError('Access restricted. Your email is not authorized for this application.');
            });
            setUserRole(null);
            setLoading(false);
            return;
          }
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    // Clean up subscription
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signInWithGoogle,
    logOut,
    authError,
    loading,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};