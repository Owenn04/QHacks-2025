import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeAuth, getCurrentUser, handleRedirectResult } from './auth/Auth.jsx';
import { useEffect, useState, createContext } from 'react';

import Home from './pages/Home.jsx';
import Camera from './pages/Camera.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AddMeal from './pages/AddMeal.jsx';
import Tracker from './pages/Tracker.jsx';
import Profile from './pages/Profile.jsx';
import Welcome from './pages/Welcome.jsx';
import Goals from './pages/Goals.jsx'

import { ProtectedRoute } from './auth/ProtectedRoute';

import './App.css';

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Handle the redirect result (if the user is returning from Google sign-in)
        const redirectUser = await handleRedirectResult();
        if (redirectUser) {
          setUser(redirectUser);
        }

        // Initialize auth state listener
        const unsubscribe = initializeAuth((currentUser) => {
          setUser(currentUser ?? null);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error processing authentication:", error);
        setLoading(false);
      }
    };

    processAuth();
  }, []);

  if (loading) return null;

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/camera" element={
            <ProtectedRoute>
              <Camera />
            </ProtectedRoute>
          } />
          <Route path="/addmeal" element={
            <ProtectedRoute>
              <AddMeal />
            </ProtectedRoute>
          } />
          <Route path="/tracker" element={
            <ProtectedRoute>
              <Tracker />
            </ProtectedRoute>
          } />
          <Route path="/goals" element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;