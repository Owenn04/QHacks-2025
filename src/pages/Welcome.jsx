import React from 'react';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { handleGoogleLogin } from '../pages/Login';

function Welcome() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Redirect to home page if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden relative">
      {/* Abstract orange circle */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-50 sm:w-80 sm:h-80"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-300 rounded-full transform translate-x-1/2 translate-y-1/2 opacity-50 sm:w-64 sm:h-64"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gray-900">
          An Easy Way to Eat Healthy
        </h1>
        <p className="text-lg sm:text-xl mb-8 text-gray-700">
        Nutrasense is the ultimate tool for taking control of your nutrition and reaching your health goals. Easily set your daily caloric goals, log your meals, or scan the nutritional information on food packages with just a few taps. With Nutrasense, tracking your intake is fast, simple, and personalized. Let's make your nutrition journey easier and more intuitive—one meal at a time!
        </p>
        {!user ? (
          <button
            onClick={() => handleGoogleLogin(setUser, navigate)}
            className="bg-orange-500 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-orange-600 transition duration-300 shadow-lg flex items-center justify-center space-x-2"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google Logo"
              className="w-5 h-5"
            />
            <span>Sign in with Google</span>
          </button>
        ) : (
          <p className="text-gray-700">You're already logged in.</p>
        )}
      </div>
    </div>
  );
}

export default Welcome