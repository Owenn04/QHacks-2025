import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { loginUser } from '../auth/Auth';

function Welcome() {
  const { setUser } = useContext(UserContext);
  const [credentials, setCredentials] = useState({
    email: '',
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
      const userData = await loginUser(credentials.email, credentials.password);
      setUser(userData);
      navigate('/');
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden relative">
      {/* Abstract orange circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-50 sm:w-80 sm:h-80"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-300 rounded-full transform translate-x-1/2 translate-y-1/2 opacity-50 sm:w-64 sm:h-64"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 w-full max-w-md">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gray-900">
          An Easy Way to Eat Healthy
        </h1>
        <p className="text-lg sm:text-xl mb-8 text-gray-700">
        Nutrasense is the ultimate tool for taking control of your nutrition and reaching your health goals. Easily set your daily caloric goals, log your meals, or scan the nutritional information on food packages with just a few taps. With Nutrasense, tracking your intake is fast, simple, and personalized. Let's make your nutrition journey easier and more intuitive—one meal at a time!
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
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="email"
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
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition duration-200"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={navigateToRegister}
              className="text-orange-500 hover:text-orange-600 font-semibold"
              disabled={isLoading}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;