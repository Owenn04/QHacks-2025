import React, { useContext } from 'react';
import { UserContext } from '../App'; // Adjust the import path as needed
import { auth } from '../firebase'; // Import Firebase auth for logout
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, setUser } = useContext(UserContext); // Access user and setUser from context
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user using Firebase auth
      setUser(null); // Clear the user from context
      navigate('/login'); // Redirect to the login page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <h1>Profile Page</h1>
      {user ? (
        <>
          <p>Welcome, {user.displayName || 'User'}!</p> {/* Display the user's name */}
          <button onClick={handleLogout}>Logout</button> {/* Logout button */}
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}

export default Profile;