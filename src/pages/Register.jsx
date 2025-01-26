import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { registerUser } from '../auth/Auth';

function Register() {
  const { setUser } = useContext(UserContext);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userData = await registerUser(credentials.username, credentials.password);
      setUser(userData);
      navigate('/');
    } catch (error) {
      setError('Registration failed. Username might be taken or invalid.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden relative">
      {/* Abstract orange circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-50 sm:w-80 sm:h-80"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-300 rounded-full transform translate-x-1/2 translate-y-1/2 opacity-50 sm:w-64 sm:h-64"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 w-full max-w-md">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gray-900">
          Join Our Community
        </h1>
        <p className="text-lg sm:text-xl mb-8 text-gray-700">
          Create an account to start tracking your meals and achieving your health goals today.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {error && (
            <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              placeholder="Choose a username"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition duration-200"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Choose a password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition duration-200"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={navigateToLogin}
              className="text-orange-500 hover:text-orange-600 font-semibold"
              disabled={isLoading}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;