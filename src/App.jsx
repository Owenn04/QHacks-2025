import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, createContext } from 'react';

import Home from './pages/Home.jsx';
import Camera from './pages/Camera.jsx';
import Register from './pages/Register.jsx';
import AddMeal from './pages/AddMeal.jsx';
import Tracker from './pages/Tracker.jsx';
import Profile from './pages/Profile.jsx';
import Welcome from './pages/Welcome.jsx';
import Goals from './pages/Goals.jsx';

import { ProtectedRoute } from './auth/ProtectedRoute';

import './App.css';

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

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
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;