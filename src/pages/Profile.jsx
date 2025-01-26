import React, { useContext, useState } from 'react';
import { UserContext } from '../App';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { updateDisplayName } from '../auth/Auth';

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      navigate('/welcome');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleUpdateDisplayName = async (e) => {
    e.preventDefault();
    if (newDisplayName.length > 9) {
      setError('Display name must be 9 characters or less.');
      return;
    }

    try {
      await updateDisplayName(user.uid, newDisplayName);
      setUser({ ...user, displayName: newDisplayName });
      setNewDisplayName('');
      setError('');
      setIsModalOpen(false); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating display name:', error);
      setError('Failed to update display name.');
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

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-white-500 text-black py-2 rounded-lg hover:bg-orange-100 active:bg-orange-100 transition-colors duration-300"
              >
                Update Display Name
              </button>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full bg-orange-300 text-white py-3 rounded-lg hover:bg-orange-400 active:bg-orange-400 transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>You are not logged in.</p>
            <button 
              onClick={() => navigate('/welcome')}
              className="mt-4 bg-orange-300 text-white px-6 py-3 rounded-lg hover:bg-orange-400 active:bg-orange-400 transition-colors duration-300"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>

      {/* Modal for updating display name */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Update Display Name</h2>
            <form onSubmit={handleUpdateDisplayName} className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                  New Display Name (max 9 characters)
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-400 focus:border-orange-400 sm:text-sm"
                  maxLength={9}
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white-200 text-black px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-300 text-white px-4 py-2 rounded-lg hover:bg-orange-400 transition-colors duration-300"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;