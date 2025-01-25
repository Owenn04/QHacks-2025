import React, { useContext } from 'react';
import { UserContext } from '../App';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      navigate('/welcome');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Profile</h1>
        
        {user ? (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="flex items-center space-x-4">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-2xl">
                    {user.displayName ? user.displayName.charAt(0) : 'U'}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{user.displayName || 'User'}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-t pt-4 border-orange-400">
                <h3 className="text-lg font-medium mb-2">Account Details</h3>
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Display Name</span>
                    <span>{user.displayName || 'Not set'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span>{user.email}</span>
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full bg-orange-400 text-white py-3 rounded-lg hover:bg-orange-200 transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>You are not logged in.</p>
            <button 
              onClick={() => navigate('/welcome')}
              className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;