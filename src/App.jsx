import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeAuth, getCurrentUser } from './auth/auth';
import { useEffect, useState, createContext } from 'react';

import Home from './pages/Home.jsx';
import Camera from './pages/Camera.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AddMeal from './pages/AddMeal.jsx';
import Tracker from './pages/Tracker.jsx';
import Profile from './pages/Profile.jsx';
import Welcome from './pages/Welcome.jsx';

import { ProtectedRoute } from './auth/ProtectedRoute';

import './App.css';

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = initializeAuth((currentUser) => {
      setUser(currentUser ?? null);
      setLoading(false);
    });
  
    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <UserContext.Provider value={{user, setUser}}>
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